-- ==========================================================================================
-- HumanAid - Step 2: Non-Destructive Corrective Core Schema Alignment Script
-- (REVIEW THE NOTES BELOW BEFORE EXECUTION)
-- Target Database: HumanitarianCrisisDb on (localdb)\MSSQLLocalDB
-- ==========================================================================================
-- PURPOSE & DATA-PRESERVATION DECISIONS:
--   1. Exact (TableName, ColumnName) dependency pre-check covers default constraints,
--      indexes, check constraints, foreign keys, and expression dependencies on all 27
--      columns scheduled for widening before executing any ALTER COLUMN statement.
--   2. Widens selected phone/location columns and widens CreatedBy / LastModifiedBy across
--      all 11 core tables to NVARCHAR(MAX) NULL without changing stored values.
--   3. Preserves the existing unique constraint/index on Users.Email without creating a
--      duplicate unique index, aligns the legacy IX_AIDecisionAudits_RequestId index name
--      in-place when appropriate, detects valid leading-column indexes (ignoring disabled,
--      filtered, hypothetical, or non-rowstore indexes), and aborts on unrelated index-name
--      collisions rather than dropping unrelated indexes.
--   4. Validates all 15 core relationships for orphaned references before modifying any
--      foreign key constraints.
--   5. Enforces the intended humanitarian data-preservation FK matrix across all 15 core
--      relationships:
--        - 9 ON DELETE NO ACTION relationships (including ResourceAllocations.ShelterId to
--          avoid a second referential-action path from CrisisEvents through Shelters to
--          ResourceAllocations).
--        - 6 ON DELETE SET NULL relationships on nullable associations.
--        - 0 ON DELETE CASCADE relationships.
--   6. Identifies existing foreign keys by actual parent and referenced columns (not only
--      constraint names), preserves equivalent valid FKs under existing names without adding
--      duplicates, replaces an existing FK only when confirmed to represent the exact
--      intended single-column relationship whose delete action or trust/enabled state needs
--      correction, and aborts on unexpected composite FKs or unrelated FK-name collisions.
--   7. Commits the transaction only after all post-alignment validations succeed; rolls back
--      automatically on any error.
-- ==========================================================================================

SET NOCOUNT ON;
SET XACT_ABORT ON;

BEGIN TRY
    BEGIN TRANSACTION;

    -- ======================================================================================
    -- PART 1: Exact (TableName, ColumnName) Pre-Flight Dependency Check on Columns to Widen
    -- ======================================================================================
    DECLARE @ColumnsToWiden TABLE (
        TableName         NVARCHAR(128) COLLATE DATABASE_DEFAULT NOT NULL,
        ColumnName        NVARCHAR(128) COLLATE DATABASE_DEFAULT NOT NULL,
        TargetTypeSql     NVARCHAR(50)  COLLATE DATABASE_DEFAULT NOT NULL,
        ExpectedMaxLength SMALLINT NOT NULL, -- sys.columns.max_length in bytes (-1 for MAX)
        PRIMARY KEY (TableName, ColumnName)
    );

    INSERT INTO @ColumnsToWiden (TableName, ColumnName, TargetTypeSql, ExpectedMaxLength)
    VALUES
        -- Phone and warehouse location columns (5 columns)
        (N'Users',                N'PhoneNumber',       N'NVARCHAR(50) NULL',  100),
        (N'AssistanceRequests',   N'ContactPhone',      N'NVARCHAR(50) NULL',  100),
        (N'Donations',            N'DonorPhone',        N'NVARCHAR(50) NULL',  100),
        (N'Shelters',             N'ContactPhone',      N'NVARCHAR(MAX) NULL', -1),
        (N'Resources',            N'WarehouseLocation', N'NVARCHAR(MAX) NULL', -1),

        -- Audit columns across all 11 core tables (22 columns)
        (N'AIDecisionAudits',     N'CreatedBy',         N'NVARCHAR(MAX) NULL', -1),
        (N'AIDecisionAudits',     N'LastModifiedBy',    N'NVARCHAR(MAX) NULL', -1),
        (N'AssistanceRequests',   N'CreatedBy',         N'NVARCHAR(MAX) NULL', -1),
        (N'AssistanceRequests',   N'LastModifiedBy',    N'NVARCHAR(MAX) NULL', -1),
        (N'CrisisEvents',         N'CreatedBy',         N'NVARCHAR(MAX) NULL', -1),
        (N'CrisisEvents',         N'LastModifiedBy',    N'NVARCHAR(MAX) NULL', -1),
        (N'Donations',            N'CreatedBy',         N'NVARCHAR(MAX) NULL', -1),
        (N'Donations',            N'LastModifiedBy',    N'NVARCHAR(MAX) NULL', -1),
        (N'ResourceAllocations',  N'CreatedBy',         N'NVARCHAR(MAX) NULL', -1),
        (N'ResourceAllocations',  N'LastModifiedBy',    N'NVARCHAR(MAX) NULL', -1),
        (N'Resources',            N'CreatedBy',         N'NVARCHAR(MAX) NULL', -1),
        (N'Resources',            N'LastModifiedBy',    N'NVARCHAR(MAX) NULL', -1),
        (N'ShelterAllocations',   N'CreatedBy',         N'NVARCHAR(MAX) NULL', -1),
        (N'ShelterAllocations',   N'LastModifiedBy',    N'NVARCHAR(MAX) NULL', -1),
        (N'Shelters',             N'CreatedBy',         N'NVARCHAR(MAX) NULL', -1),
        (N'Shelters',             N'LastModifiedBy',    N'NVARCHAR(MAX) NULL', -1),
        (N'Users',                N'CreatedBy',         N'NVARCHAR(MAX) NULL', -1),
        (N'Users',                N'LastModifiedBy',    N'NVARCHAR(MAX) NULL', -1),
        (N'VolunteerAssignments', N'CreatedBy',         N'NVARCHAR(MAX) NULL', -1),
        (N'VolunteerAssignments', N'LastModifiedBy',    N'NVARCHAR(MAX) NULL', -1),
        (N'Volunteers',           N'CreatedBy',         N'NVARCHAR(MAX) NULL', -1),
        (N'Volunteers',           N'LastModifiedBy',    N'NVARCHAR(MAX) NULL', -1);

    -- 1a. Confirm all 27 target (TableName, ColumnName) pairs exist in [dbo]
    DECLARE @MissingWidenColumns NVARCHAR(MAX);
    SELECT @MissingWidenColumns = STRING_AGG(ctw.TableName + N'.' + ctw.ColumnName, N', ')
    FROM @ColumnsToWiden ctw
    LEFT JOIN sys.tables t
        ON t.name COLLATE DATABASE_DEFAULT = ctw.TableName COLLATE DATABASE_DEFAULT
       AND t.schema_id = SCHEMA_ID(N'dbo')
    LEFT JOIN sys.columns c
        ON c.object_id = t.object_id
       AND c.name COLLATE DATABASE_DEFAULT = ctw.ColumnName COLLATE DATABASE_DEFAULT
    WHERE c.column_id IS NULL;

    IF @MissingWidenColumns IS NOT NULL
    BEGIN
        RAISERROR(
            N'Corrective alignment aborted: target columns scheduled for widening are missing: %s',
            16, 1, @MissingWidenColumns
        );
    END;

    -- 1b. Check exact (TableName, ColumnName) pairs for blocking indexes, default/check
    --     constraints, foreign keys, or SQL expression dependencies
    DECLARE @BlockingDeps NVARCHAR(MAX);

    SELECT @BlockingDeps = STRING_AGG(
        ctw.TableName + N'.' + ctw.ColumnName + N' (' + dep.DepType + N': ' + dep.DepName + N')',
        N', '
    )
    FROM @ColumnsToWiden ctw
    INNER JOIN sys.tables t
        ON t.name COLLATE DATABASE_DEFAULT = ctw.TableName COLLATE DATABASE_DEFAULT
       AND t.schema_id = SCHEMA_ID(N'dbo')
    INNER JOIN sys.columns c
        ON c.object_id = t.object_id
       AND c.name COLLATE DATABASE_DEFAULT = ctw.ColumnName COLLATE DATABASE_DEFAULT
    INNER JOIN (
        SELECT
            dc.parent_object_id AS object_id,
            dc.parent_column_id AS column_id,
            N'DEFAULT_CONSTRAINT' COLLATE DATABASE_DEFAULT AS DepType,
            dc.name COLLATE DATABASE_DEFAULT AS DepName
        FROM sys.default_constraints dc

        UNION ALL

        SELECT
            ic.object_id,
            ic.column_id,
            N'INDEX' COLLATE DATABASE_DEFAULT AS DepType,
            i.name COLLATE DATABASE_DEFAULT AS DepName
        FROM sys.index_columns ic
        INNER JOIN sys.indexes i
            ON ic.object_id = i.object_id
           AND ic.index_id = i.index_id

        UNION ALL

        SELECT
            cc.parent_object_id AS object_id,
            cc.parent_column_id AS column_id,
            N'CHECK_CONSTRAINT' COLLATE DATABASE_DEFAULT AS DepType,
            cc.name COLLATE DATABASE_DEFAULT AS DepName
        FROM sys.check_constraints cc
        WHERE cc.parent_column_id <> 0

        UNION ALL

        SELECT
            fkc.parent_object_id AS object_id,
            fkc.parent_column_id AS column_id,
            N'FOREIGN_KEY_PARENT' COLLATE DATABASE_DEFAULT AS DepType,
            fk.name COLLATE DATABASE_DEFAULT AS DepName
        FROM sys.foreign_key_columns fkc
        INNER JOIN sys.foreign_keys fk
            ON fk.object_id = fkc.constraint_object_id

        UNION ALL

        SELECT
            fkc.referenced_object_id AS object_id,
            fkc.referenced_column_id AS column_id,
            N'FOREIGN_KEY_REFERENCED' COLLATE DATABASE_DEFAULT AS DepType,
            fk.name COLLATE DATABASE_DEFAULT AS DepName
        FROM sys.foreign_key_columns fkc
        INNER JOIN sys.foreign_keys fk
            ON fk.object_id = fkc.constraint_object_id

        UNION ALL

        SELECT
            sed.referenced_id AS object_id,
            sed.referenced_minor_id AS column_id,
            N'EXPRESSION_DEPENDENCY' COLLATE DATABASE_DEFAULT AS DepType,
            ISNULL(OBJECT_NAME(sed.referencing_id), N'unknown') COLLATE DATABASE_DEFAULT AS DepName
        FROM sys.sql_expression_dependencies sed
        WHERE sed.referenced_minor_id <> 0
    ) dep
        ON dep.object_id = c.object_id
       AND dep.column_id = c.column_id;

    IF @BlockingDeps IS NOT NULL
    BEGIN
        RAISERROR(
            N'Corrective alignment aborted: dependent indexes/constraints found on columns scheduled for widening: %s',
            16, 1, @BlockingDeps
        );
    END;

    -- ======================================================================================
    -- PART 2: Non-Destructive NVARCHAR Column Widening & Audit Column Alignment
    -- ======================================================================================
    -- 2a. Phone and warehouse location columns
    ALTER TABLE [dbo].[Users]               ALTER COLUMN [PhoneNumber]       NVARCHAR(50)  NULL;
    ALTER TABLE [dbo].[AssistanceRequests]  ALTER COLUMN [ContactPhone]      NVARCHAR(50)  NULL;
    ALTER TABLE [dbo].[Donations]           ALTER COLUMN [DonorPhone]        NVARCHAR(50)  NULL;
    ALTER TABLE [dbo].[Shelters]            ALTER COLUMN [ContactPhone]      NVARCHAR(MAX) NULL;
    ALTER TABLE [dbo].[Resources]           ALTER COLUMN [WarehouseLocation] NVARCHAR(MAX) NULL;

    -- 2b. Audit columns (CreatedBy, LastModifiedBy) across all 11 core tables
    ALTER TABLE [dbo].[AIDecisionAudits]     ALTER COLUMN [CreatedBy]      NVARCHAR(MAX) NULL;
    ALTER TABLE [dbo].[AIDecisionAudits]     ALTER COLUMN [LastModifiedBy] NVARCHAR(MAX) NULL;
    ALTER TABLE [dbo].[AssistanceRequests]   ALTER COLUMN [CreatedBy]      NVARCHAR(MAX) NULL;
    ALTER TABLE [dbo].[AssistanceRequests]   ALTER COLUMN [LastModifiedBy] NVARCHAR(MAX) NULL;
    ALTER TABLE [dbo].[CrisisEvents]         ALTER COLUMN [CreatedBy]      NVARCHAR(MAX) NULL;
    ALTER TABLE [dbo].[CrisisEvents]         ALTER COLUMN [LastModifiedBy] NVARCHAR(MAX) NULL;
    ALTER TABLE [dbo].[Donations]            ALTER COLUMN [CreatedBy]      NVARCHAR(MAX) NULL;
    ALTER TABLE [dbo].[Donations]            ALTER COLUMN [LastModifiedBy] NVARCHAR(MAX) NULL;
    ALTER TABLE [dbo].[ResourceAllocations]  ALTER COLUMN [CreatedBy]      NVARCHAR(MAX) NULL;
    ALTER TABLE [dbo].[ResourceAllocations]  ALTER COLUMN [LastModifiedBy] NVARCHAR(MAX) NULL;
    ALTER TABLE [dbo].[Resources]            ALTER COLUMN [CreatedBy]      NVARCHAR(MAX) NULL;
    ALTER TABLE [dbo].[Resources]            ALTER COLUMN [LastModifiedBy] NVARCHAR(MAX) NULL;
    ALTER TABLE [dbo].[ShelterAllocations]   ALTER COLUMN [CreatedBy]      NVARCHAR(MAX) NULL;
    ALTER TABLE [dbo].[ShelterAllocations]   ALTER COLUMN [LastModifiedBy] NVARCHAR(MAX) NULL;
    ALTER TABLE [dbo].[Shelters]             ALTER COLUMN [CreatedBy]      NVARCHAR(MAX) NULL;
    ALTER TABLE [dbo].[Shelters]             ALTER COLUMN [LastModifiedBy] NVARCHAR(MAX) NULL;
    ALTER TABLE [dbo].[Users]                ALTER COLUMN [CreatedBy]      NVARCHAR(MAX) NULL;
    ALTER TABLE [dbo].[Users]                ALTER COLUMN [LastModifiedBy] NVARCHAR(MAX) NULL;
    ALTER TABLE [dbo].[VolunteerAssignments] ALTER COLUMN [CreatedBy]      NVARCHAR(MAX) NULL;
    ALTER TABLE [dbo].[VolunteerAssignments] ALTER COLUMN [LastModifiedBy] NVARCHAR(MAX) NULL;
    ALTER TABLE [dbo].[Volunteers]           ALTER COLUMN [CreatedBy]      NVARCHAR(MAX) NULL;
    ALTER TABLE [dbo].[Volunteers]           ALTER COLUMN [LastModifiedBy] NVARCHAR(MAX) NULL;

    -- 2c. Verify all 27 widened columns now match their target NVARCHAR length and nullability
    DECLARE @WidenPostCheckErrors NVARCHAR(MAX);
    SELECT @WidenPostCheckErrors = STRING_AGG(
        ctw.TableName + N'.' + ctw.ColumnName +
        N' (type=' + ty.name COLLATE DATABASE_DEFAULT +
        N', max_length=' + CAST(c.max_length AS NVARCHAR(10)) +
        N', is_nullable=' + CAST(c.is_nullable AS NVARCHAR(2)) + N')',
        N'; '
    )
    FROM @ColumnsToWiden ctw
    INNER JOIN sys.tables t
        ON t.name COLLATE DATABASE_DEFAULT = ctw.TableName COLLATE DATABASE_DEFAULT
       AND t.schema_id = SCHEMA_ID(N'dbo')
    INNER JOIN sys.columns c
        ON c.object_id = t.object_id
       AND c.name COLLATE DATABASE_DEFAULT = ctw.ColumnName COLLATE DATABASE_DEFAULT
    INNER JOIN sys.types ty
        ON c.user_type_id = ty.user_type_id
    WHERE ty.name COLLATE DATABASE_DEFAULT <> N'nvarchar' COLLATE DATABASE_DEFAULT
       OR c.max_length <> ctw.ExpectedMaxLength
       OR c.is_nullable <> 1;

    IF @WidenPostCheckErrors IS NOT NULL
    BEGIN
        RAISERROR(
            N'Corrective alignment aborted: post-widening column verification failed: %s',
            16, 1, @WidenPostCheckErrors
        );
    END;

    -- ======================================================================================
    -- PART 3: Equivalent Index Detection & Safe Index Alignment (No Duplicate Indexes)
    -- ======================================================================================
    -- Rules enforced:
    --   - Preserves existing unique constraint/index on Users.Email without creating a
    --     duplicate unique index.
    --   - Detects legacy IX_AIDecisionAudits_RequestId and renames it in-place to
    --     IX_AIDecisionAudits_AssistanceRequestId when appropriate.
    --   - Considers an existing index valid ONLY when it is enabled (is_disabled = 0),
    --     non-hypothetical (is_hypothetical = 0), unfiltered (has_filter = 0), rowstore
    --     (type IN (1, 2)), and has the expected column as leading key column (key_ordinal = 1,
    --     is_included_column = 0), plus single-key uniqueness when RequireUnique = 1.
    --   - Aborts rather than dropping if any expected index name is occupied by an unrelated
    --     or unsuitable index.
    -- ======================================================================================

    -- 3a. Guard and align legacy IX_AIDecisionAudits_RequestId -> IX_AIDecisionAudits_AssistanceRequestId
    IF EXISTS (
        SELECT 1
        FROM sys.indexes i
        WHERE i.object_id = OBJECT_ID(N'[dbo].[AIDecisionAudits]')
          AND i.name COLLATE DATABASE_DEFAULT = N'IX_AIDecisionAudits_RequestId' COLLATE DATABASE_DEFAULT
          AND (
              i.type NOT IN (1, 2)
              OR i.is_disabled = 1
              OR i.is_hypothetical = 1
              OR i.has_filter = 1
              OR NOT EXISTS (
                  SELECT 1
                  FROM sys.index_columns ic
                  INNER JOIN sys.columns c
                      ON ic.object_id = c.object_id
                     AND ic.column_id = c.column_id
                  WHERE ic.object_id = i.object_id
                    AND ic.index_id = i.index_id
                    AND ic.key_ordinal = 1
                    AND ic.is_included_column = 0
                    AND c.name COLLATE DATABASE_DEFAULT = N'AssistanceRequestId' COLLATE DATABASE_DEFAULT
              )
          )
    )
    BEGIN
        RAISERROR(
            N'Corrective alignment aborted: legacy index IX_AIDecisionAudits_RequestId on dbo.AIDecisionAudits is disabled, filtered, hypothetical, or does not have AssistanceRequestId as leading key column.',
            16, 1
        );
    END;

    IF EXISTS (
        SELECT 1
        FROM sys.indexes i
        WHERE i.object_id = OBJECT_ID(N'[dbo].[AIDecisionAudits]')
          AND i.name COLLATE DATABASE_DEFAULT = N'IX_AIDecisionAudits_RequestId' COLLATE DATABASE_DEFAULT
    )
    AND NOT EXISTS (
        SELECT 1
        FROM sys.indexes i
        WHERE i.object_id = OBJECT_ID(N'[dbo].[AIDecisionAudits]')
          AND i.name COLLATE DATABASE_DEFAULT = N'IX_AIDecisionAudits_AssistanceRequestId' COLLATE DATABASE_DEFAULT
    )
    BEGIN
        EXEC sp_rename
            N'dbo.AIDecisionAudits.IX_AIDecisionAudits_RequestId',
            N'IX_AIDecisionAudits_AssistanceRequestId',
            N'INDEX';
    END;

    -- 3b. Declare all 19 expected core indexes from InitialCoreSchema
    DECLARE @ExpectedIndexes TABLE (
        RowNum            INT IDENTITY(1,1) NOT NULL PRIMARY KEY,
        TableName         NVARCHAR(128) COLLATE DATABASE_DEFAULT NOT NULL,
        ColumnName        NVARCHAR(128) COLLATE DATABASE_DEFAULT NOT NULL,
        ExpectedIndexName NVARCHAR(128) COLLATE DATABASE_DEFAULT NOT NULL,
        RequireUnique     BIT NOT NULL,
        UNIQUE (TableName, ColumnName)
    );

    INSERT INTO @ExpectedIndexes (TableName, ColumnName, ExpectedIndexName, RequireUnique)
    VALUES
        (N'Users',                N'Email',               N'IX_Users_Email',                                 1),
        (N'AIDecisionAudits',     N'AssistanceRequestId', N'IX_AIDecisionAudits_AssistanceRequestId',        0),
        (N'AIDecisionAudits',     N'OverriddenBy',        N'IX_AIDecisionAudits_OverriddenBy',               0),
        (N'AssistanceRequests',   N'CrisisEventId',       N'IX_AssistanceRequests_CrisisEventId',            0),
        (N'AssistanceRequests',   N'DuplicateOfId',       N'IX_AssistanceRequests_DuplicateOfId',            0),
        (N'AssistanceRequests',   N'RequestorId',         N'IX_AssistanceRequests_RequestorId',              0),
        (N'AssistanceRequests',   N'Status',              N'IX_AssistanceRequests_Status',                   0),
        (N'AssistanceRequests',   N'Urgency',             N'IX_AssistanceRequests_Urgency',                  0),
        (N'Donations',            N'CrisisEventId',       N'IX_Donations_CrisisEventId',                     0),
        (N'ResourceAllocations',  N'AssistanceRequestId', N'IX_ResourceAllocations_AssistanceRequestId',     0),
        (N'ResourceAllocations',  N'ResourceId',          N'IX_ResourceAllocations_ResourceId',              0),
        (N'ResourceAllocations',  N'ShelterId',           N'IX_ResourceAllocations_ShelterId',               0),
        (N'ShelterAllocations',   N'AssistanceRequestId', N'IX_ShelterAllocations_AssistanceRequestId',      0),
        (N'ShelterAllocations',   N'ShelterId',           N'IX_ShelterAllocations_ShelterId',                0),
        (N'Shelters',             N'CrisisEventId',       N'IX_Shelters_CrisisEventId',                      0),
        (N'VolunteerAssignments', N'AssistanceRequestId', N'IX_VolunteerAssignments_AssistanceRequestId',    0),
        (N'VolunteerAssignments', N'VolunteerId',         N'IX_VolunteerAssignments_VolunteerId',            0),
        (N'Volunteers',           N'IsAvailable',         N'IX_Volunteers_IsAvailable',                      0),
        (N'Volunteers',           N'UserId',              N'IX_Volunteers_UserId',                           0);

    -- 3c. Abort if any expected index name is occupied by an unrelated, disabled, filtered,
    --     hypothetical, or non-matching index on that table
    DECLARE @IndexNameCollisions NVARCHAR(MAX);
    SELECT @IndexNameCollisions = STRING_AGG(
        ei.TableName + N'.' + ei.ExpectedIndexName,
        N', '
    )
    FROM @ExpectedIndexes ei
    INNER JOIN sys.tables t
        ON t.name COLLATE DATABASE_DEFAULT = ei.TableName COLLATE DATABASE_DEFAULT
       AND t.schema_id = SCHEMA_ID(N'dbo')
    INNER JOIN sys.indexes i
        ON i.object_id = t.object_id
       AND i.name COLLATE DATABASE_DEFAULT = ei.ExpectedIndexName COLLATE DATABASE_DEFAULT
    WHERE i.type NOT IN (1, 2)
       OR i.is_disabled = 1
       OR i.is_hypothetical = 1
       OR i.has_filter = 1
       OR (ei.RequireUnique = 1 AND i.is_unique = 0)
       OR (
           ei.RequireUnique = 1
           AND (
               SELECT COUNT(*)
               FROM sys.index_columns ic2
               WHERE ic2.object_id = i.object_id
                 AND ic2.index_id = i.index_id
                 AND ic2.key_ordinal >= 1
                 AND ic2.is_included_column = 0
           ) <> 1
       )
       OR NOT EXISTS (
           SELECT 1
           FROM sys.index_columns ic
           INNER JOIN sys.columns c
               ON ic.object_id = c.object_id
              AND ic.column_id = c.column_id
           WHERE ic.object_id = i.object_id
             AND ic.index_id = i.index_id
             AND ic.key_ordinal = 1
             AND ic.is_included_column = 0
             AND c.name COLLATE DATABASE_DEFAULT = ei.ColumnName COLLATE DATABASE_DEFAULT
       );

    IF @IndexNameCollisions IS NOT NULL
    BEGIN
        RAISERROR(
            N'Corrective alignment aborted: expected index name is occupied by an unrelated, disabled, filtered, or incompatible index: %s',
            16, 1, @IndexNameCollisions
        );
    END;

    -- 3d. Create missing indexes ONLY when no valid leading-key-column index covers the column
    DECLARE @IdxRow           INT = 1;
    DECLARE @IdxMaxRow        INT = (SELECT COUNT(*) FROM @ExpectedIndexes);
    DECLARE @IdxTableName     NVARCHAR(128);
    DECLARE @IdxColumnName    NVARCHAR(128);
    DECLARE @IdxExpectedName  NVARCHAR(128);
    DECLARE @IdxRequireUnique BIT;
    DECLARE @CreateIdxSql     NVARCHAR(MAX);

    WHILE @IdxRow <= @IdxMaxRow
    BEGIN
        SELECT
            @IdxTableName     = TableName,
            @IdxColumnName    = ColumnName,
            @IdxExpectedName  = ExpectedIndexName,
            @IdxRequireUnique = RequireUnique
        FROM @ExpectedIndexes
        WHERE RowNum = @IdxRow;

        IF NOT EXISTS (
            SELECT 1
            FROM sys.tables t
            INNER JOIN sys.indexes i
                ON i.object_id = t.object_id
            INNER JOIN sys.index_columns ic
                ON ic.object_id = i.object_id
               AND ic.index_id = i.index_id
            INNER JOIN sys.columns c
                ON c.object_id = ic.object_id
               AND c.column_id = ic.column_id
            WHERE t.schema_id = SCHEMA_ID(N'dbo')
              AND t.name COLLATE DATABASE_DEFAULT = @IdxTableName COLLATE DATABASE_DEFAULT
              AND i.type IN (1, 2)
              AND i.is_disabled = 0
              AND i.is_hypothetical = 0
              AND i.has_filter = 0
              AND ic.key_ordinal = 1
              AND ic.is_included_column = 0
              AND c.name COLLATE DATABASE_DEFAULT = @IdxColumnName COLLATE DATABASE_DEFAULT
              AND (
                  @IdxRequireUnique = 0
                  OR (
                      i.is_unique = 1
                      AND (
                          SELECT COUNT(*)
                          FROM sys.index_columns ic2
                          WHERE ic2.object_id = i.object_id
                            AND ic2.index_id = i.index_id
                            AND ic2.key_ordinal >= 1
                            AND ic2.is_included_column = 0
                      ) = 1
                  )
              )
        )
        BEGIN
            SET @CreateIdxSql = N'CREATE '
                              + CASE WHEN @IdxRequireUnique = 1 THEN N'UNIQUE ' ELSE N'' END
                              + N'NONCLUSTERED INDEX ' + QUOTENAME(@IdxExpectedName)
                              + N' ON [dbo].' + QUOTENAME(@IdxTableName)
                              + N'(' + QUOTENAME(@IdxColumnName) + N');';
            EXEC sp_executesql @CreateIdxSql;
        END;

        SET @IdxRow += 1;
    END;

    -- 3e. Post-verify all 19 expected index coverages
    DECLARE @MissingIndexCoverage NVARCHAR(MAX);
    SELECT @MissingIndexCoverage = STRING_AGG(ei.TableName + N'(' + ei.ColumnName + N')', N', ')
    FROM @ExpectedIndexes ei
    WHERE NOT EXISTS (
        SELECT 1
        FROM sys.tables t
        INNER JOIN sys.indexes i
            ON i.object_id = t.object_id
        INNER JOIN sys.index_columns ic
            ON ic.object_id = i.object_id
           AND ic.index_id = i.index_id
        INNER JOIN sys.columns c
            ON c.object_id = ic.object_id
           AND c.column_id = ic.column_id
        WHERE t.schema_id = SCHEMA_ID(N'dbo')
          AND t.name COLLATE DATABASE_DEFAULT = ei.TableName COLLATE DATABASE_DEFAULT
          AND i.type IN (1, 2)
          AND i.is_disabled = 0
          AND i.is_hypothetical = 0
          AND i.has_filter = 0
          AND ic.key_ordinal = 1
          AND ic.is_included_column = 0
          AND c.name COLLATE DATABASE_DEFAULT = ei.ColumnName COLLATE DATABASE_DEFAULT
          AND (
              ei.RequireUnique = 0
              OR (
                  i.is_unique = 1
                  AND (
                      SELECT COUNT(*)
                      FROM sys.index_columns ic2
                      WHERE ic2.object_id = i.object_id
                        AND ic2.index_id = i.index_id
                        AND ic2.key_ordinal >= 1
                        AND ic2.is_included_column = 0
                  ) = 1
              )
          )
    );

    IF @MissingIndexCoverage IS NOT NULL
    BEGIN
        RAISERROR(
            N'Corrective alignment aborted: post-index verification failed for: %s',
            16, 1, @MissingIndexCoverage
        );
    END;

    -- ======================================================================================
    -- PART 4: Pre-Validate Existing Referential Integrity Before Modifying Foreign Keys
    -- ======================================================================================
    IF EXISTS (SELECT 1 FROM [dbo].[AIDecisionAudits] c WHERE NOT EXISTS (SELECT 1 FROM [dbo].[AssistanceRequests] p WHERE p.[Id] = c.[AssistanceRequestId]))
        RAISERROR(N'Orphaned rows detected in AIDecisionAudits.AssistanceRequestId.', 16, 1);
    IF EXISTS (SELECT 1 FROM [dbo].[AIDecisionAudits] c WHERE c.[OverriddenBy] IS NOT NULL AND NOT EXISTS (SELECT 1 FROM [dbo].[Users] p WHERE p.[Id] = c.[OverriddenBy]))
        RAISERROR(N'Orphaned rows detected in AIDecisionAudits.OverriddenBy.', 16, 1);
    IF EXISTS (SELECT 1 FROM [dbo].[AssistanceRequests] c WHERE c.[CrisisEventId] IS NOT NULL AND NOT EXISTS (SELECT 1 FROM [dbo].[CrisisEvents] p WHERE p.[Id] = c.[CrisisEventId]))
        RAISERROR(N'Orphaned rows detected in AssistanceRequests.CrisisEventId.', 16, 1);
    IF EXISTS (SELECT 1 FROM [dbo].[AssistanceRequests] c WHERE c.[DuplicateOfId] IS NOT NULL AND NOT EXISTS (SELECT 1 FROM [dbo].[AssistanceRequests] p WHERE p.[Id] = c.[DuplicateOfId]))
        RAISERROR(N'Orphaned rows detected in AssistanceRequests.DuplicateOfId.', 16, 1);
    IF EXISTS (SELECT 1 FROM [dbo].[AssistanceRequests] c WHERE NOT EXISTS (SELECT 1 FROM [dbo].[Users] p WHERE p.[Id] = c.[RequestorId]))
        RAISERROR(N'Orphaned rows detected in AssistanceRequests.RequestorId.', 16, 1);
    IF EXISTS (SELECT 1 FROM [dbo].[Donations] c WHERE c.[CrisisEventId] IS NOT NULL AND NOT EXISTS (SELECT 1 FROM [dbo].[CrisisEvents] p WHERE p.[Id] = c.[CrisisEventId]))
        RAISERROR(N'Orphaned rows detected in Donations.CrisisEventId.', 16, 1);
    IF EXISTS (SELECT 1 FROM [dbo].[ResourceAllocations] c WHERE c.[AssistanceRequestId] IS NOT NULL AND NOT EXISTS (SELECT 1 FROM [dbo].[AssistanceRequests] p WHERE p.[Id] = c.[AssistanceRequestId]))
        RAISERROR(N'Orphaned rows detected in ResourceAllocations.AssistanceRequestId.', 16, 1);
    IF EXISTS (SELECT 1 FROM [dbo].[ResourceAllocations] c WHERE NOT EXISTS (SELECT 1 FROM [dbo].[Resources] p WHERE p.[Id] = c.[ResourceId]))
        RAISERROR(N'Orphaned rows detected in ResourceAllocations.ResourceId.', 16, 1);
    IF EXISTS (SELECT 1 FROM [dbo].[ResourceAllocations] c WHERE c.[ShelterId] IS NOT NULL AND NOT EXISTS (SELECT 1 FROM [dbo].[Shelters] p WHERE p.[Id] = c.[ShelterId]))
        RAISERROR(N'Orphaned rows detected in ResourceAllocations.ShelterId.', 16, 1);
    IF EXISTS (SELECT 1 FROM [dbo].[ShelterAllocations] c WHERE c.[AssistanceRequestId] IS NOT NULL AND NOT EXISTS (SELECT 1 FROM [dbo].[AssistanceRequests] p WHERE p.[Id] = c.[AssistanceRequestId]))
        RAISERROR(N'Orphaned rows detected in ShelterAllocations.AssistanceRequestId.', 16, 1);
    IF EXISTS (SELECT 1 FROM [dbo].[ShelterAllocations] c WHERE NOT EXISTS (SELECT 1 FROM [dbo].[Shelters] p WHERE p.[Id] = c.[ShelterId]))
        RAISERROR(N'Orphaned rows detected in ShelterAllocations.ShelterId.', 16, 1);
    IF EXISTS (SELECT 1 FROM [dbo].[Shelters] c WHERE c.[CrisisEventId] IS NOT NULL AND NOT EXISTS (SELECT 1 FROM [dbo].[CrisisEvents] p WHERE p.[Id] = c.[CrisisEventId]))
        RAISERROR(N'Orphaned rows detected in Shelters.CrisisEventId.', 16, 1);
    IF EXISTS (SELECT 1 FROM [dbo].[VolunteerAssignments] c WHERE c.[AssistanceRequestId] IS NOT NULL AND NOT EXISTS (SELECT 1 FROM [dbo].[AssistanceRequests] p WHERE p.[Id] = c.[AssistanceRequestId]))
        RAISERROR(N'Orphaned rows detected in VolunteerAssignments.AssistanceRequestId.', 16, 1);
    IF EXISTS (SELECT 1 FROM [dbo].[VolunteerAssignments] c WHERE NOT EXISTS (SELECT 1 FROM [dbo].[Volunteers] p WHERE p.[Id] = c.[VolunteerId]))
        RAISERROR(N'Orphaned rows detected in VolunteerAssignments.VolunteerId.', 16, 1);
    IF EXISTS (SELECT 1 FROM [dbo].[Volunteers] c WHERE NOT EXISTS (SELECT 1 FROM [dbo].[Users] p WHERE p.[Id] = c.[UserId]))
        RAISERROR(N'Orphaned rows detected in Volunteers.UserId.', 16, 1);

    -- ======================================================================================
    -- PART 5: Align and Post-Validate All 15 Foreign Keys
    --         (9 NO ACTION, 6 SET NULL, 0 CASCADE; No Multiple Cascade Paths)
    -- ======================================================================================
    DECLARE @CoreTables TABLE (
        TableName NVARCHAR(128) COLLATE DATABASE_DEFAULT NOT NULL PRIMARY KEY
    );
    INSERT INTO @CoreTables (TableName)
    VALUES
        (N'AIDecisionAudits'),
        (N'AssistanceRequests'),
        (N'CrisisEvents'),
        (N'Donations'),
        (N'ResourceAllocations'),
        (N'Resources'),
        (N'ShelterAllocations'),
        (N'Shelters'),
        (N'Users'),
        (N'VolunteerAssignments'),
        (N'Volunteers');

    DECLARE @TargetForeignKeys TABLE (
        RowNum                   INT IDENTITY(1,1) NOT NULL PRIMARY KEY,
        ParentTable              NVARCHAR(128) COLLATE DATABASE_DEFAULT NOT NULL,
        ParentCol                NVARCHAR(128) COLLATE DATABASE_DEFAULT NOT NULL,
        RefTable                 NVARCHAR(128) COLLATE DATABASE_DEFAULT NOT NULL,
        RefCol                   NVARCHAR(128) COLLATE DATABASE_DEFAULT NOT NULL,
        CanonicalFKName          NVARCHAR(128) COLLATE DATABASE_DEFAULT NOT NULL,
        ExpectedDeleteActionDesc NVARCHAR(60)  COLLATE DATABASE_DEFAULT NOT NULL,
        ExpectedDeleteClause     NVARCHAR(60)  COLLATE DATABASE_DEFAULT NOT NULL,
        UNIQUE (ParentTable, ParentCol),
        UNIQUE (CanonicalFKName)
    );

    INSERT INTO @TargetForeignKeys (
        ParentTable, ParentCol, RefTable, RefCol,
        CanonicalFKName, ExpectedDeleteActionDesc, ExpectedDeleteClause
    )
    VALUES
        -- 1. AIDecisionAudits.AssistanceRequestId -> AssistanceRequests.Id (NO ACTION)
        (N'AIDecisionAudits',     N'AssistanceRequestId', N'AssistanceRequests', N'Id',
         N'FK_AIDecisionAudits_AssistanceRequests_AssistanceRequestId',     N'NO_ACTION', N'NO ACTION'),

        -- 2. AIDecisionAudits.OverriddenBy -> Users.Id (NO ACTION)
        (N'AIDecisionAudits',     N'OverriddenBy',        N'Users',              N'Id',
         N'FK_AIDecisionAudits_Users_OverriddenBy',                         N'NO_ACTION', N'NO ACTION'),

        -- 3. AssistanceRequests.CrisisEventId -> CrisisEvents.Id (SET NULL)
        (N'AssistanceRequests',   N'CrisisEventId',       N'CrisisEvents',       N'Id',
         N'FK_AssistanceRequests_CrisisEvents_CrisisEventId',               N'SET_NULL',  N'SET NULL'),

        -- 4. AssistanceRequests.DuplicateOfId -> AssistanceRequests.Id (NO ACTION)
        (N'AssistanceRequests',   N'DuplicateOfId',       N'AssistanceRequests', N'Id',
         N'FK_AssistanceRequests_AssistanceRequests_DuplicateOfId',         N'NO_ACTION', N'NO ACTION'),

        -- 5. AssistanceRequests.RequestorId -> Users.Id (NO ACTION)
        (N'AssistanceRequests',   N'RequestorId',         N'Users',              N'Id',
         N'FK_AssistanceRequests_Users_RequestorId',                        N'NO_ACTION', N'NO ACTION'),

        -- 6. Donations.CrisisEventId -> CrisisEvents.Id (SET NULL)
        (N'Donations',            N'CrisisEventId',       N'CrisisEvents',       N'Id',
         N'FK_Donations_CrisisEvents_CrisisEventId',                        N'SET_NULL',  N'SET NULL'),

        -- 7. ResourceAllocations.AssistanceRequestId -> AssistanceRequests.Id (SET NULL)
        (N'ResourceAllocations',  N'AssistanceRequestId', N'AssistanceRequests', N'Id',
         N'FK_ResourceAllocations_AssistanceRequests_AssistanceRequestId',  N'SET_NULL',  N'SET NULL'),

        -- 8. ResourceAllocations.ResourceId -> Resources.Id (NO ACTION)
        (N'ResourceAllocations',  N'ResourceId',          N'Resources',          N'Id',
         N'FK_ResourceAllocations_Resources_ResourceId',                    N'NO_ACTION', N'NO ACTION'),

        -- 9. ResourceAllocations.ShelterId -> Shelters.Id (NO ACTION: avoids multiple cascade paths through Shelters)
        (N'ResourceAllocations',  N'ShelterId',           N'Shelters',           N'Id',
         N'FK_ResourceAllocations_Shelters_ShelterId',                      N'NO_ACTION', N'NO ACTION'),

        -- 10. ShelterAllocations.AssistanceRequestId -> AssistanceRequests.Id (SET NULL)
        (N'ShelterAllocations',   N'AssistanceRequestId', N'AssistanceRequests', N'Id',
         N'FK_ShelterAllocations_AssistanceRequests_AssistanceRequestId',   N'SET_NULL',  N'SET NULL'),

        -- 11. ShelterAllocations.ShelterId -> Shelters.Id (NO ACTION)
        (N'ShelterAllocations',   N'ShelterId',           N'Shelters',           N'Id',
         N'FK_ShelterAllocations_Shelters_ShelterId',                       N'NO_ACTION', N'NO ACTION'),

        -- 12. Shelters.CrisisEventId -> CrisisEvents.Id (SET NULL)
        (N'Shelters',             N'CrisisEventId',       N'CrisisEvents',       N'Id',
         N'FK_Shelters_CrisisEvents_CrisisEventId',                         N'SET_NULL',  N'SET NULL'),

        -- 13. VolunteerAssignments.AssistanceRequestId -> AssistanceRequests.Id (SET NULL)
        (N'VolunteerAssignments', N'AssistanceRequestId', N'AssistanceRequests', N'Id',
         N'FK_VolunteerAssignments_AssistanceRequests_AssistanceRequestId', N'SET_NULL',  N'SET NULL'),

        -- 14. VolunteerAssignments.VolunteerId -> Volunteers.Id (NO ACTION)
        (N'VolunteerAssignments', N'VolunteerId',         N'Volunteers',         N'Id',
         N'FK_VolunteerAssignments_Volunteers_VolunteerId',                 N'NO_ACTION', N'NO ACTION'),

        -- 15. Volunteers.UserId -> Users.Id (NO ACTION)
        (N'Volunteers',           N'UserId',              N'Users',              N'Id',
         N'FK_Volunteers_Users_UserId',                                     N'NO_ACTION', N'NO ACTION');

    -- 5a. Abort if any composite foreign key exists on any of the 11 core tables
    DECLARE @CompositeFKs NVARCHAR(MAX);
    SELECT @CompositeFKs = STRING_AGG(
        pt.name COLLATE DATABASE_DEFAULT + N'.' + fk.name COLLATE DATABASE_DEFAULT,
        N', '
    )
    FROM sys.foreign_keys fk
    INNER JOIN sys.tables pt
        ON fk.parent_object_id = pt.object_id
       AND pt.schema_id = SCHEMA_ID(N'dbo')
    INNER JOIN @CoreTables ct
        ON ct.TableName COLLATE DATABASE_DEFAULT = pt.name COLLATE DATABASE_DEFAULT
    WHERE (
        SELECT COUNT(*)
        FROM sys.foreign_key_columns fkc
        WHERE fkc.constraint_object_id = fk.object_id
    ) <> 1;

    IF @CompositeFKs IS NOT NULL
    BEGIN
        RAISERROR(
            N'Corrective alignment aborted: unexpected composite foreign key(s) detected on core tables: %s',
            16, 1, @CompositeFKs
        );
    END;

    -- 5b. Abort if any foreign key on the 11 core tables represents an unexpected/unrelated
    --     parent->referenced column relationship not in the 15 intended relationships
    DECLARE @UnrelatedFKs NVARCHAR(MAX);
    SELECT @UnrelatedFKs = STRING_AGG(
        pt.name COLLATE DATABASE_DEFAULT + N'.' + pc.name COLLATE DATABASE_DEFAULT
        + N' -> ' + ISNULL(rt.name COLLATE DATABASE_DEFAULT, N'?') + N'.' + ISNULL(rc.name COLLATE DATABASE_DEFAULT, N'?')
        + N' (' + fk.name COLLATE DATABASE_DEFAULT + N')',
        N'; '
    )
    FROM sys.foreign_keys fk
    INNER JOIN sys.foreign_key_columns fkc
        ON fk.object_id = fkc.constraint_object_id
    INNER JOIN sys.tables pt
        ON fk.parent_object_id = pt.object_id
       AND pt.schema_id = SCHEMA_ID(N'dbo')
    INNER JOIN @CoreTables ct
        ON ct.TableName COLLATE DATABASE_DEFAULT = pt.name COLLATE DATABASE_DEFAULT
    INNER JOIN sys.columns pc
        ON fkc.parent_object_id = pc.object_id
       AND fkc.parent_column_id = pc.column_id
    LEFT JOIN sys.tables rt
        ON fk.referenced_object_id = rt.object_id
       AND rt.schema_id = SCHEMA_ID(N'dbo')
    LEFT JOIN sys.columns rc
        ON fkc.referenced_object_id = rc.object_id
       AND fkc.referenced_column_id = rc.column_id
    LEFT JOIN @TargetForeignKeys tfk
        ON tfk.ParentTable COLLATE DATABASE_DEFAULT = pt.name COLLATE DATABASE_DEFAULT
       AND tfk.ParentCol COLLATE DATABASE_DEFAULT = pc.name COLLATE DATABASE_DEFAULT
       AND tfk.RefTable COLLATE DATABASE_DEFAULT = rt.name COLLATE DATABASE_DEFAULT
       AND tfk.RefCol COLLATE DATABASE_DEFAULT = rc.name COLLATE DATABASE_DEFAULT
    WHERE tfk.RowNum IS NULL;

    IF @UnrelatedFKs IS NOT NULL
    BEGIN
        RAISERROR(
            N'Corrective alignment aborted: unexpected or unrelated foreign key relationship(s) found on core tables: %s',
            16, 1, @UnrelatedFKs
        );
    END;

    -- 5c. Abort if any canonical FK name is occupied by an unrelated constraint or object in [dbo]
    DECLARE @FKNameCollisions NVARCHAR(MAX);
    SELECT @FKNameCollisions = STRING_AGG(
        tfk.CanonicalFKName + N' (object_id=' + CAST(o.object_id AS NVARCHAR(20)) + N')',
        N', '
    )
    FROM @TargetForeignKeys tfk
    INNER JOIN sys.objects o
        ON o.name COLLATE DATABASE_DEFAULT = tfk.CanonicalFKName COLLATE DATABASE_DEFAULT
       AND o.schema_id = SCHEMA_ID(N'dbo')
    WHERE NOT EXISTS (
        SELECT 1
        FROM sys.foreign_keys fk
        INNER JOIN sys.foreign_key_columns fkc
            ON fk.object_id = fkc.constraint_object_id
        INNER JOIN sys.tables pt
            ON fk.parent_object_id = pt.object_id
           AND pt.schema_id = SCHEMA_ID(N'dbo')
        INNER JOIN sys.columns pc
            ON fkc.parent_object_id = pc.object_id
           AND fkc.parent_column_id = pc.column_id
        INNER JOIN sys.tables rt
            ON fk.referenced_object_id = rt.object_id
           AND rt.schema_id = SCHEMA_ID(N'dbo')
        INNER JOIN sys.columns rc
            ON fkc.referenced_object_id = rc.object_id
           AND fkc.referenced_column_id = rc.column_id
        WHERE fk.object_id = o.object_id
          AND pt.name COLLATE DATABASE_DEFAULT = tfk.ParentTable COLLATE DATABASE_DEFAULT
          AND pc.name COLLATE DATABASE_DEFAULT = tfk.ParentCol COLLATE DATABASE_DEFAULT
          AND rt.name COLLATE DATABASE_DEFAULT = tfk.RefTable COLLATE DATABASE_DEFAULT
          AND rc.name COLLATE DATABASE_DEFAULT = tfk.RefCol COLLATE DATABASE_DEFAULT
          AND (
              SELECT COUNT(*)
              FROM sys.foreign_key_columns fkc2
              WHERE fkc2.constraint_object_id = fk.object_id
          ) = 1
    );

    IF @FKNameCollisions IS NOT NULL
    BEGIN
        RAISERROR(
            N'Corrective alignment aborted: canonical FK constraint name is occupied by an unrelated object/constraint: %s',
            16, 1, @FKNameCollisions
        );
    END;

    -- 5d. Abort if duplicate foreign keys already exist on the same core relationship
    DECLARE @DuplicateExistingFKs NVARCHAR(MAX);
    SELECT @DuplicateExistingFKs = STRING_AGG(
        tfk.ParentTable + N'.' + tfk.ParentCol + N' (count=' + CAST(ExistingCount.Cnt AS NVARCHAR(10)) + N')',
        N', '
    )
    FROM @TargetForeignKeys tfk
    CROSS APPLY (
        SELECT COUNT(DISTINCT fk.object_id) AS Cnt
        FROM sys.foreign_keys fk
        INNER JOIN sys.foreign_key_columns fkc
            ON fk.object_id = fkc.constraint_object_id
        INNER JOIN sys.tables pt
            ON fk.parent_object_id = pt.object_id
           AND pt.schema_id = SCHEMA_ID(N'dbo')
        INNER JOIN sys.columns pc
            ON fkc.parent_object_id = pc.object_id
           AND fkc.parent_column_id = pc.column_id
        WHERE pt.name COLLATE DATABASE_DEFAULT = tfk.ParentTable COLLATE DATABASE_DEFAULT
          AND pc.name COLLATE DATABASE_DEFAULT = tfk.ParentCol COLLATE DATABASE_DEFAULT
    ) ExistingCount
    WHERE ExistingCount.Cnt > 1;

    IF @DuplicateExistingFKs IS NOT NULL
    BEGIN
        RAISERROR(
            N'Corrective alignment aborted: duplicate foreign keys detected on core relationship(s): %s',
            16, 1, @DuplicateExistingFKs
        );
    END;

    -- 5e. Replace an existing FK ONLY when it is confirmed to represent the exact intended
    --     relationship AND its delete action or trust/enabled state needs correction
    DECLARE @DropFKTable NVARCHAR(128);
    DECLARE @DropFKName  NVARCHAR(128);
    DECLARE @DropFKSql   NVARCHAR(MAX);

    DECLARE DropMismatchedFKCursor CURSOR LOCAL FAST_FORWARD FOR
        SELECT
            pt.name COLLATE DATABASE_DEFAULT AS ParentTable,
            fk.name COLLATE DATABASE_DEFAULT AS ExistingFKName
        FROM sys.foreign_keys fk
        INNER JOIN sys.foreign_key_columns fkc
            ON fk.object_id = fkc.constraint_object_id
        INNER JOIN sys.tables pt
            ON fk.parent_object_id = pt.object_id
           AND pt.schema_id = SCHEMA_ID(N'dbo')
        INNER JOIN sys.columns pc
            ON fkc.parent_object_id = pc.object_id
           AND fkc.parent_column_id = pc.column_id
        INNER JOIN sys.tables rt
            ON fk.referenced_object_id = rt.object_id
           AND rt.schema_id = SCHEMA_ID(N'dbo')
        INNER JOIN sys.columns rc
            ON fkc.referenced_object_id = rc.object_id
           AND fkc.referenced_column_id = rc.column_id
        INNER JOIN @TargetForeignKeys tfk
            ON tfk.ParentTable COLLATE DATABASE_DEFAULT = pt.name COLLATE DATABASE_DEFAULT
           AND tfk.ParentCol COLLATE DATABASE_DEFAULT = pc.name COLLATE DATABASE_DEFAULT
           AND tfk.RefTable COLLATE DATABASE_DEFAULT = rt.name COLLATE DATABASE_DEFAULT
           AND tfk.RefCol COLLATE DATABASE_DEFAULT = rc.name COLLATE DATABASE_DEFAULT
        WHERE (
            SELECT COUNT(*)
            FROM sys.foreign_key_columns fkc2
            WHERE fkc2.constraint_object_id = fk.object_id
        ) = 1
          AND (
              fk.delete_referential_action_desc COLLATE DATABASE_DEFAULT <> tfk.ExpectedDeleteActionDesc COLLATE DATABASE_DEFAULT
              OR fk.is_disabled = 1
              OR fk.is_not_trusted = 1
          );

    OPEN DropMismatchedFKCursor;
    FETCH NEXT FROM DropMismatchedFKCursor INTO @DropFKTable, @DropFKName;

    WHILE @@FETCH_STATUS = 0
    BEGIN
        SET @DropFKSql = N'ALTER TABLE [dbo].' + QUOTENAME(@DropFKTable)
                       + N' DROP CONSTRAINT ' + QUOTENAME(@DropFKName) + N';';
        EXEC sp_executesql @DropFKSql;

        FETCH NEXT FROM DropMismatchedFKCursor INTO @DropFKTable, @DropFKName;
    END;

    CLOSE DropMismatchedFKCursor;
    DEALLOCATE DropMismatchedFKCursor;

    -- 5f. Create each missing or replaced FK WITH CHECK only when no equivalent valid
    --     single-column, enabled, trusted FK with the intended delete action exists
    DECLARE @FKRowId                 INT = 1;
    DECLARE @FKMaxRowId              INT = (SELECT COUNT(*) FROM @TargetForeignKeys);
    DECLARE @CurParentTable          NVARCHAR(128);
    DECLARE @CurParentCol            NVARCHAR(128);
    DECLARE @CurRefTable             NVARCHAR(128);
    DECLARE @CurRefCol               NVARCHAR(128);
    DECLARE @CurCanonicalFKName      NVARCHAR(128);
    DECLARE @CurExpectedDeleteDesc   NVARCHAR(60);
    DECLARE @CurExpectedDeleteClause NVARCHAR(60);
    DECLARE @AddFKSql                NVARCHAR(MAX);

    WHILE @FKRowId <= @FKMaxRowId
    BEGIN
        SELECT
            @CurParentTable          = ParentTable,
            @CurParentCol            = ParentCol,
            @CurRefTable             = RefTable,
            @CurRefCol               = RefCol,
            @CurCanonicalFKName      = CanonicalFKName,
            @CurExpectedDeleteDesc   = ExpectedDeleteActionDesc,
            @CurExpectedDeleteClause = ExpectedDeleteClause
        FROM @TargetForeignKeys
        WHERE RowNum = @FKRowId;

        IF NOT EXISTS (
            SELECT 1
            FROM sys.foreign_keys fk
            INNER JOIN sys.foreign_key_columns fkc
                ON fk.object_id = fkc.constraint_object_id
            INNER JOIN sys.tables pt
                ON fk.parent_object_id = pt.object_id
               AND pt.schema_id = SCHEMA_ID(N'dbo')
            INNER JOIN sys.columns pc
                ON fkc.parent_object_id = pc.object_id
               AND fkc.parent_column_id = pc.column_id
            INNER JOIN sys.tables rt
                ON fk.referenced_object_id = rt.object_id
               AND rt.schema_id = SCHEMA_ID(N'dbo')
            INNER JOIN sys.columns rc
                ON fkc.referenced_object_id = rc.object_id
               AND fkc.referenced_column_id = rc.column_id
            WHERE pt.name COLLATE DATABASE_DEFAULT = @CurParentTable COLLATE DATABASE_DEFAULT
              AND pc.name COLLATE DATABASE_DEFAULT = @CurParentCol COLLATE DATABASE_DEFAULT
              AND rt.name COLLATE DATABASE_DEFAULT = @CurRefTable COLLATE DATABASE_DEFAULT
              AND rc.name COLLATE DATABASE_DEFAULT = @CurRefCol COLLATE DATABASE_DEFAULT
              AND fk.delete_referential_action_desc COLLATE DATABASE_DEFAULT = @CurExpectedDeleteDesc COLLATE DATABASE_DEFAULT
              AND fk.is_disabled = 0
              AND fk.is_not_trusted = 0
              AND (
                  SELECT COUNT(*)
                  FROM sys.foreign_key_columns fkc2
                  WHERE fkc2.constraint_object_id = fk.object_id
              ) = 1
        )
        BEGIN
            SET @AddFKSql = N'ALTER TABLE [dbo].' + QUOTENAME(@CurParentTable)
                          + N' WITH CHECK ADD CONSTRAINT ' + QUOTENAME(@CurCanonicalFKName)
                          + N' FOREIGN KEY (' + QUOTENAME(@CurParentCol) + N')'
                          + N' REFERENCES [dbo].' + QUOTENAME(@CurRefTable) + N'(' + QUOTENAME(@CurRefCol) + N')'
                          + N' ON DELETE ' + @CurExpectedDeleteClause + N';';
            EXEC sp_executesql @AddFKSql;
        END;

        SET @FKRowId += 1;
    END;

    -- 5g. Post-validate all 15 relationships and exact delete-behavior distribution
    --     (Must be: 15 total FKs = 9 NO_ACTION + 6 SET_NULL + 0 CASCADE)
    DECLARE @FKPostCheckErrors NVARCHAR(MAX);
    SELECT @FKPostCheckErrors = STRING_AGG(
        tfk.ParentTable + N'.' + tfk.ParentCol + N' -> ' + tfk.RefTable + N'.' + tfk.RefCol
        + N' (expected=' + tfk.ExpectedDeleteActionDesc
        + N', valid_matches=' + CAST(ISNULL(Matched.FKCount, 0) AS NVARCHAR(10)) + N')',
        N'; '
    )
    FROM @TargetForeignKeys tfk
    OUTER APPLY (
        SELECT COUNT(DISTINCT fk.object_id) AS FKCount
        FROM sys.foreign_keys fk
        INNER JOIN sys.foreign_key_columns fkc
            ON fk.object_id = fkc.constraint_object_id
        INNER JOIN sys.tables pt
            ON fk.parent_object_id = pt.object_id
           AND pt.schema_id = SCHEMA_ID(N'dbo')
        INNER JOIN sys.columns pc
            ON fkc.parent_object_id = pc.object_id
           AND fkc.parent_column_id = pc.column_id
        INNER JOIN sys.tables rt
            ON fk.referenced_object_id = rt.object_id
           AND rt.schema_id = SCHEMA_ID(N'dbo')
        INNER JOIN sys.columns rc
            ON fkc.referenced_object_id = rc.object_id
           AND fkc.referenced_column_id = rc.column_id
        WHERE pt.name COLLATE DATABASE_DEFAULT = tfk.ParentTable COLLATE DATABASE_DEFAULT
          AND pc.name COLLATE DATABASE_DEFAULT = tfk.ParentCol COLLATE DATABASE_DEFAULT
          AND rt.name COLLATE DATABASE_DEFAULT = tfk.RefTable COLLATE DATABASE_DEFAULT
          AND rc.name COLLATE DATABASE_DEFAULT = tfk.RefCol COLLATE DATABASE_DEFAULT
          AND fk.delete_referential_action_desc COLLATE DATABASE_DEFAULT = tfk.ExpectedDeleteActionDesc COLLATE DATABASE_DEFAULT
          AND fk.is_disabled = 0
          AND fk.is_not_trusted = 0
          AND (
              SELECT COUNT(*)
              FROM sys.foreign_key_columns fkc2
              WHERE fkc2.constraint_object_id = fk.object_id
          ) = 1
    ) Matched
    WHERE ISNULL(Matched.FKCount, 0) <> 1;

    IF @FKPostCheckErrors IS NOT NULL
    BEGIN
        RAISERROR(
            N'Corrective alignment aborted: post-alignment foreign key verification failed: %s',
            16, 1, @FKPostCheckErrors
        );
    END;

    DECLARE @TotalCoreFKs      INT;
    DECLARE @NoActionCoreFKs   INT;
    DECLARE @SetNullCoreFKs    INT;
    DECLARE @CascadeCoreFKs    INT;

    SELECT
        @TotalCoreFKs    = COUNT(*),
        @NoActionCoreFKs = ISNULL(SUM(CASE WHEN fk.delete_referential_action_desc COLLATE DATABASE_DEFAULT = N'NO_ACTION' COLLATE DATABASE_DEFAULT THEN 1 ELSE 0 END), 0),
        @SetNullCoreFKs  = ISNULL(SUM(CASE WHEN fk.delete_referential_action_desc COLLATE DATABASE_DEFAULT = N'SET_NULL'  COLLATE DATABASE_DEFAULT THEN 1 ELSE 0 END), 0),
        @CascadeCoreFKs  = ISNULL(SUM(CASE WHEN fk.delete_referential_action_desc COLLATE DATABASE_DEFAULT = N'CASCADE'   COLLATE DATABASE_DEFAULT THEN 1 ELSE 0 END), 0)
    FROM sys.foreign_keys fk
    INNER JOIN sys.tables pt
        ON fk.parent_object_id = pt.object_id
       AND pt.schema_id = SCHEMA_ID(N'dbo')
    INNER JOIN @CoreTables ct
        ON ct.TableName COLLATE DATABASE_DEFAULT = pt.name COLLATE DATABASE_DEFAULT;

    IF @TotalCoreFKs <> 15
       OR @NoActionCoreFKs <> 9
       OR @SetNullCoreFKs <> 6
       OR @CascadeCoreFKs <> 0
    BEGIN
        RAISERROR(
            N'Corrective alignment aborted: unexpected core FK delete-action counts (total=%d, NO_ACTION=%d, SET_NULL=%d, CASCADE=%d; expected total=15, NO_ACTION=9, SET_NULL=6, CASCADE=0).',
            16, 1, @TotalCoreFKs, @NoActionCoreFKs, @SetNullCoreFKs, @CascadeCoreFKs
        );
    END;

    COMMIT TRANSACTION;
    PRINT N'SUCCESS: Non-destructive core schema alignment completed (27 columns widened, 19 index coverages verified, 15 foreign keys verified: 9 NO ACTION, 6 SET NULL, 0 CASCADE).';
END TRY
BEGIN CATCH
    IF @@TRANCOUNT > 0
        ROLLBACK TRANSACTION;

    DECLARE @ErrorMessage NVARCHAR(4000) = ERROR_MESSAGE();
    RAISERROR(N'Corrective schema alignment failed and was rolled back: %s', 16, 1, @ErrorMessage);
END CATCH;
