-- ==========================================================================================
-- HumanAid - Step 1: Controlled Baseline Adoption Script
-- (FOR DBA REVIEW ONLY - DO NOT AUTO-EXECUTE)
-- Target Database: HumanitarianCrisisDb on (localdb)\MSSQLLocalDB
-- Baseline Migration ID: 20261106174251_InitialCoreSchema
-- EF Core ProductVersion: 8.0.0
-- ==========================================================================================
-- PURPOSE:
--   Strictly validates that the existing HumanitarianCrisisDb schema matches all 11 core
--   tables, all 157 columns (names, SQL data types, allowed lengths, decimal precision/scale,
--   and nullability), all 11 primary keys, all 15 foreign-key relationships, and (if present)
--   the structure of [dbo].[__EFMigrationsHistory] BEFORE recording
--   '20261106174251_InitialCoreSchema' as applied.
--
-- SAFETY GUARANTEES:
--   - Does NOT execute InitialCoreSchema.Up() or any CREATE/DROP/ALTER on core tables.
--   - Aborts and rolls back immediately if any table, column, type, length, precision,
--     scale, nullability, primary key, or foreign key mismatches.
-- ==========================================================================================

SET NOCOUNT ON;
SET XACT_ABORT ON;

BEGIN TRY
    BEGIN TRANSACTION;

    -- ======================================================================================
    -- 1. Validate Existing [dbo].[__EFMigrationsHistory] Structure (If Present)
    -- ======================================================================================
    IF OBJECT_ID(N'[dbo].[__EFMigrationsHistory]', N'U') IS NOT NULL
    BEGIN
        IF NOT EXISTS (
            SELECT 1
            FROM sys.columns c
            INNER JOIN sys.types ty ON c.user_type_id = ty.user_type_id
            WHERE c.object_id = OBJECT_ID(N'[dbo].[__EFMigrationsHistory]')
              AND c.name = N'MigrationId'
              AND ty.name = N'nvarchar'
              AND c.max_length = 300 -- nvarchar(150) = 300 bytes
              AND c.is_nullable = 0
        )
        OR NOT EXISTS (
            SELECT 1
            FROM sys.columns c
            INNER JOIN sys.types ty ON c.user_type_id = ty.user_type_id
            WHERE c.object_id = OBJECT_ID(N'[dbo].[__EFMigrationsHistory]')
              AND c.name = N'ProductVersion'
              AND ty.name = N'nvarchar'
              AND c.max_length = 64 -- nvarchar(32) = 64 bytes
              AND c.is_nullable = 0
        )
        OR (
            SELECT COUNT(DISTINCT i.index_id)
            FROM sys.indexes i
            WHERE i.object_id = OBJECT_ID(N'[dbo].[__EFMigrationsHistory]')
              AND i.is_primary_key = 1
        ) <> 1
        OR (
            SELECT COUNT(*)
            FROM sys.indexes i
            INNER JOIN sys.index_columns ic ON i.object_id = ic.object_id AND i.index_id = ic.index_id
            WHERE i.object_id = OBJECT_ID(N'[dbo].[__EFMigrationsHistory]')
              AND i.is_primary_key = 1
        ) <> 1
        OR NOT EXISTS (
            SELECT 1
            FROM sys.indexes i
            INNER JOIN sys.index_columns ic ON i.object_id = ic.object_id AND i.index_id = ic.index_id
            INNER JOIN sys.columns c ON ic.object_id = c.object_id AND ic.column_id = c.column_id
            WHERE i.object_id = OBJECT_ID(N'[dbo].[__EFMigrationsHistory]')
              AND i.is_primary_key = 1
              AND ic.key_ordinal = 1
              AND ic.is_included_column = 0
              AND c.name = N'MigrationId'
        )
        BEGIN
            RAISERROR(N'Baseline adoption aborted: Existing [dbo].[__EFMigrationsHistory] table does not match EF Core 8 schema (MigrationId nvarchar(150) NOT NULL PK, ProductVersion nvarchar(32) NOT NULL).', 16, 1);
        END;
    END;

    -- ======================================================================================
    -- 2. Validate Exact 11 Core Tables in [dbo] Schema
    -- ======================================================================================
    DECLARE @ExpectedTables TABLE (TableName SYSNAME NOT NULL PRIMARY KEY);
    INSERT INTO @ExpectedTables (TableName)
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

    DECLARE @MissingTables NVARCHAR(MAX);
    SELECT @MissingTables = STRING_AGG(et.TableName, N', ')
    FROM @ExpectedTables et
    LEFT JOIN sys.tables t
        ON t.name = et.TableName
       AND t.schema_id = SCHEMA_ID(N'dbo')
    WHERE t.object_id IS NULL;

    IF @MissingTables IS NOT NULL
    BEGIN
        RAISERROR(N'Baseline adoption aborted: Missing expected [dbo] core tables: %s', 16, 1, @MissingTables);
    END;

    -- ======================================================================================
    -- 3. Validate All 157 Columns Across the 11 Core Tables
    --    (Exact TableName, ColumnName, DataType, MaxLengthA/MaxLengthB, Precision, Scale, IsNullable)
    --    Note: nvarchar(N) max_length in sys.columns is 2*N bytes, or -1 for nvarchar(max).
    --    MaxLengthA = Schema.sql length; MaxLengthB = Post-alignment EF Core length.
    -- ======================================================================================
    DECLARE @ExpectedColumns TABLE (
        TableName   SYSNAME NOT NULL,
        ColumnName  SYSNAME NOT NULL,
        DataType    SYSNAME NOT NULL,
        MaxLengthA  SMALLINT NOT NULL,
        MaxLengthB  SMALLINT NOT NULL,
        Prec        TINYINT NOT NULL,
        Scale       TINYINT NOT NULL,
        IsNullable  BIT NOT NULL,
        PRIMARY KEY (TableName, ColumnName)
    );

    INSERT INTO @ExpectedColumns (TableName, ColumnName, DataType, MaxLengthA, MaxLengthB, Prec, Scale, IsNullable)
    VALUES
        -- 1. AIDecisionAudits (14 columns)
        (N'AIDecisionAudits', N'Id',                  N'uniqueidentifier', 16,   16,   0,  0, 0),
        (N'AIDecisionAudits', N'AssistanceRequestId', N'uniqueidentifier', 16,   16,   0,  0, 0),
        (N'AIDecisionAudits', N'AISuggestion',        N'nvarchar',         -1,   -1,   0,  0, 0),
        (N'AIDecisionAudits', N'ConfidenceScore',     N'decimal',          5,    5,    5,  4, 0),
        (N'AIDecisionAudits', N'SuggestedPriority',   N'int',              4,    4,    10, 0, 0),
        (N'AIDecisionAudits', N'WasOverridden',       N'bit',              1,    1,    1,  0, 0),
        (N'AIDecisionAudits', N'HumanDecision',       N'nvarchar',         -1,   -1,   0,  0, 1),
        (N'AIDecisionAudits', N'OverriddenBy',        N'uniqueidentifier', 16,   16,   0,  0, 1),
        (N'AIDecisionAudits', N'OverrideReason',      N'nvarchar',         -1,   -1,   0,  0, 1),
        (N'AIDecisionAudits', N'ReviewedAt',          N'datetime2',        8,    8,    27, 7, 1),
        (N'AIDecisionAudits', N'CreatedAt',           N'datetime2',        8,    8,    27, 7, 0),
        (N'AIDecisionAudits', N'UpdatedAt',           N'datetime2',        8,    8,    27, 7, 1),
        (N'AIDecisionAudits', N'CreatedBy',           N'nvarchar',         512,  -1,   0,  0, 1),
        (N'AIDecisionAudits', N'LastModifiedBy',      N'nvarchar',         512,  -1,   0,  0, 1),

        -- 2. AssistanceRequests (22 columns)
        (N'AssistanceRequests', N'Id',              N'uniqueidentifier', 16,   16,   0,  0, 0),
        (N'AssistanceRequests', N'RequestorId',     N'uniqueidentifier', 16,   16,   0,  0, 0),
        (N'AssistanceRequests', N'CrisisEventId',   N'uniqueidentifier', 16,   16,   0,  0, 1),
        (N'AssistanceRequests', N'Category',        N'nvarchar',         200,  200,  0,  0, 0),
        (N'AssistanceRequests', N'Description',     N'nvarchar',         -1,   -1,   0,  0, 0),
        (N'AssistanceRequests', N'Urgency',         N'int',              4,    4,    10, 0, 0),
        (N'AssistanceRequests', N'Status',          N'int',              4,    4,    10, 0, 0),
        (N'AssistanceRequests', N'Latitude',        N'decimal',          5,    5,    9,  6, 1),
        (N'AssistanceRequests', N'Longitude',       N'decimal',          5,    5,    9,  6, 1),
        (N'AssistanceRequests', N'Address',         N'nvarchar',         1000, 1000, 0,  0, 1),
        (N'AssistanceRequests', N'NumberOfPeople',  N'int',              4,    4,    10, 0, 0),
        (N'AssistanceRequests', N'ContactPhone',    N'nvarchar',         40,   100,  0,  0, 1),
        (N'AssistanceRequests', N'AttachmentUrl',   N'nvarchar',         2000, 2000, 0,  0, 1),
        (N'AssistanceRequests', N'AIPriorityScore', N'decimal',          5,    5,    5,  2, 1),
        (N'AssistanceRequests', N'AIConfidence',    N'decimal',          5,    5,    5,  4, 1),
        (N'AssistanceRequests', N'IsDuplicate',     N'bit',              1,    1,    1,  0, 0),
        (N'AssistanceRequests', N'DuplicateOfId',   N'uniqueidentifier', 16,   16,   0,  0, 1),
        (N'AssistanceRequests', N'ResolvedAt',      N'datetime2',        8,    8,    27, 7, 1),
        (N'AssistanceRequests', N'CreatedAt',       N'datetime2',        8,    8,    27, 7, 0),
        (N'AssistanceRequests', N'UpdatedAt',       N'datetime2',        8,    8,    27, 7, 1),
        (N'AssistanceRequests', N'CreatedBy',       N'nvarchar',         512,  -1,   0,  0, 1),
        (N'AssistanceRequests', N'LastModifiedBy',  N'nvarchar',         512,  -1,   0,  0, 1),

        -- 3. CrisisEvents (15 columns)
        (N'CrisisEvents', N'Id',                 N'uniqueidentifier', 16,  16,  0,  0, 0),
        (N'CrisisEvents', N'Title',              N'nvarchar',         600, 600, 0,  0, 0),
        (N'CrisisEvents', N'Description',        N'nvarchar',         -1,  -1,  0,  0, 1),
        (N'CrisisEvents', N'DisasterType',       N'int',              4,   4,   10, 0, 0),
        (N'CrisisEvents', N'Severity',           N'int',              4,   4,   10, 0, 0),
        (N'CrisisEvents', N'Latitude',           N'decimal',          5,   5,   9,  6, 1),
        (N'CrisisEvents', N'Longitude',          N'decimal',          5,   5,   9,  6, 1),
        (N'CrisisEvents', N'AffectedAreaRadius', N'decimal',          9,   9,   10, 2, 1),
        (N'CrisisEvents', N'StartDate',          N'datetime2',        8,   8,   27, 7, 0),
        (N'CrisisEvents', N'EndDate',            N'datetime2',        8,   8,   27, 7, 1),
        (N'CrisisEvents', N'IsActive',           N'bit',              1,   1,   1,  0, 0),
        (N'CrisisEvents', N'CreatedAt',          N'datetime2',        8,   8,   27, 7, 0),
        (N'CrisisEvents', N'UpdatedAt',          N'datetime2',        8,   8,   27, 7, 1),
        (N'CrisisEvents', N'CreatedBy',          N'nvarchar',         512, -1,  0,  0, 1),
        (N'CrisisEvents', N'LastModifiedBy',     N'nvarchar',         512, -1,  0,  0, 1),

        -- 4. Donations (16 columns)
        (N'Donations', N'Id',              N'uniqueidentifier', 16,  16,  0,  0, 0),
        (N'Donations', N'DonorName',       N'nvarchar',         400, 400, 0,  0, 0),
        (N'Donations', N'DonorEmail',      N'nvarchar',         512, 512, 0,  0, 1),
        (N'Donations', N'DonorPhone',      N'nvarchar',         40,  100, 0,  0, 1),
        (N'Donations', N'DonationType',    N'int',              4,   4,   10, 0, 0),
        (N'Donations', N'Amount',          N'decimal',          9,   9,   12, 2, 1),
        (N'Donations', N'Currency',        N'nvarchar',         20,  20,  0,  0, 1),
        (N'Donations', N'ItemDescription', N'nvarchar',         -1,  -1,  0,  0, 1),
        (N'Donations', N'ItemQuantity',    N'int',              4,   4,   10, 0, 1),
        (N'Donations', N'CrisisEventId',   N'uniqueidentifier', 16,  16,  0,  0, 1),
        (N'Donations', N'Status',          N'int',              4,   4,   10, 0, 0),
        (N'Donations', N'ReceivedAt',      N'datetime2',        8,   8,   27, 7, 1),
        (N'Donations', N'CreatedAt',       N'datetime2',        8,   8,   27, 7, 0),
        (N'Donations', N'UpdatedAt',       N'datetime2',        8,   8,   27, 7, 1),
        (N'Donations', N'CreatedBy',       N'nvarchar',         512, -1,  0,  0, 1),
        (N'Donations', N'LastModifiedBy',  N'nvarchar',         512, -1,  0,  0, 1),

        -- 5. ResourceAllocations (14 columns)
        (N'ResourceAllocations', N'Id',                  N'uniqueidentifier', 16,  16, 0,  0, 0),
        (N'ResourceAllocations', N'ResourceId',          N'uniqueidentifier', 16,  16, 0,  0, 0),
        (N'ResourceAllocations', N'AssistanceRequestId', N'uniqueidentifier', 16,  16, 0,  0, 1),
        (N'ResourceAllocations', N'ShelterId',           N'uniqueidentifier', 16,  16, 0,  0, 1),
        (N'ResourceAllocations', N'Quantity',            N'decimal',          9,   9,  12, 2, 0),
        (N'ResourceAllocations', N'DispatchStatus',      N'int',              4,   4,  10, 0, 0),
        (N'ResourceAllocations', N'Priority',            N'int',              4,   4,  10, 0, 0),
        (N'ResourceAllocations', N'DispatchedAt',        N'datetime2',        8,   8,  27, 7, 1),
        (N'ResourceAllocations', N'DeliveredAt',         N'datetime2',        8,   8,  27, 7, 1),
        (N'ResourceAllocations', N'Notes',               N'nvarchar',         -1,  -1, 0,  0, 1),
        (N'ResourceAllocations', N'CreatedAt',           N'datetime2',        8,   8,  27, 7, 0),
        (N'ResourceAllocations', N'UpdatedAt',           N'datetime2',        8,   8,  27, 7, 1),
        (N'ResourceAllocations', N'CreatedBy',           N'nvarchar',         512, -1, 0,  0, 1),
        (N'ResourceAllocations', N'LastModifiedBy',      N'nvarchar',         512, -1, 0,  0, 1),

        -- 6. Resources (13 columns)
        (N'Resources', N'Id',                N'uniqueidentifier', 16,  16,  0,  0, 0),
        (N'Resources', N'Name',              N'nvarchar',         400, 400, 0,  0, 0),
        (N'Resources', N'Category',          N'nvarchar',         200, 200, 0,  0, 0),
        (N'Resources', N'Unit',              N'nvarchar',         100, 100, 0,  0, 0),
        (N'Resources', N'TotalQuantity',     N'decimal',          9,   9,   12, 2, 0),
        (N'Resources', N'AllocatedQuantity', N'decimal',          9,   9,   12, 2, 0),
        (N'Resources', N'MinimumThreshold',  N'decimal',          9,   9,   12, 2, 0),
        (N'Resources', N'WarehouseLocation', N'nvarchar',         600, -1,  0,  0, 1),
        (N'Resources', N'ExpiryDate',        N'datetime2',        8,   8,   27, 7, 1),
        (N'Resources', N'CreatedAt',         N'datetime2',        8,   8,   27, 7, 0),
        (N'Resources', N'UpdatedAt',         N'datetime2',        8,   8,   27, 7, 1),
        (N'Resources', N'CreatedBy',         N'nvarchar',         512, -1,  0,  0, 1),
        (N'Resources', N'LastModifiedBy',    N'nvarchar',         512, -1,  0,  0, 1),

        -- 7. ShelterAllocations (12 columns)
        (N'ShelterAllocations', N'Id',                  N'uniqueidentifier', 16,  16,  0,  0, 0),
        (N'ShelterAllocations', N'ShelterId',           N'uniqueidentifier', 16,  16,  0,  0, 0),
        (N'ShelterAllocations', N'AssistanceRequestId', N'uniqueidentifier', 16,  16,  0,  0, 1),
        (N'ShelterAllocations', N'PersonName',          N'nvarchar',         400, 400, 0,  0, 0),
        (N'ShelterAllocations', N'NumberOfPersons',     N'int',              4,   4,   10, 0, 0),
        (N'ShelterAllocations', N'CheckInDate',         N'datetime2',        8,   8,   27, 7, 0),
        (N'ShelterAllocations', N'CheckOutDate',        N'datetime2',        8,   8,   27, 7, 1),
        (N'ShelterAllocations', N'Notes',               N'nvarchar',         -1,  -1,  0,  0, 1),
        (N'ShelterAllocations', N'CreatedAt',           N'datetime2',        8,   8,   27, 7, 0),
        (N'ShelterAllocations', N'UpdatedAt',           N'datetime2',        8,   8,   27, 7, 1),
        (N'ShelterAllocations', N'CreatedBy',           N'nvarchar',         512, -1,  0,  0, 1),
        (N'ShelterAllocations', N'LastModifiedBy',      N'nvarchar',         512, -1,  0,  0, 1),

        -- 8. Shelters (15 columns)
        (N'Shelters', N'Id',               N'uniqueidentifier', 16,   16,   0,  0, 0),
        (N'Shelters', N'Name',             N'nvarchar',         600,  600,  0,  0, 0),
        (N'Shelters', N'Address',          N'nvarchar',         1000, 1000, 0,  0, 0),
        (N'Shelters', N'Latitude',         N'decimal',          5,    5,    9,  6, 0),
        (N'Shelters', N'Longitude',        N'decimal',          5,    5,    9,  6, 0),
        (N'Shelters', N'TotalCapacity',    N'int',              4,    4,    10, 0, 0),
        (N'Shelters', N'CurrentOccupancy', N'int',              4,    4,    10, 0, 0),
        (N'Shelters', N'Facilities',       N'nvarchar',         -1,   -1,   0,  0, 1),
        (N'Shelters', N'ContactPhone',     N'nvarchar',         40,   -1,   0,  0, 1),
        (N'Shelters', N'IsActive',         N'bit',              1,    1,    1,  0, 0),
        (N'Shelters', N'CrisisEventId',    N'uniqueidentifier', 16,   16,   0,  0, 1),
        (N'Shelters', N'CreatedAt',        N'datetime2',        8,    8,    27, 7, 0),
        (N'Shelters', N'UpdatedAt',        N'datetime2',        8,    8,    27, 7, 1),
        (N'Shelters', N'CreatedBy',        N'nvarchar',         512,  -1,   0,  0, 1),
        (N'Shelters', N'LastModifiedBy',   N'nvarchar',         512,  -1,   0,  0, 1),

        -- 9. Users (11 columns)
        (N'Users', N'Id',             N'uniqueidentifier', 16,   16,   0,  0, 0),
        (N'Users', N'FullName',       N'nvarchar',         400,  400,  0,  0, 0),
        (N'Users', N'Email',          N'nvarchar',         512,  512,  0,  0, 0),
        (N'Users', N'PasswordHash',   N'nvarchar',         1000, 1000, 0,  0, 0),
        (N'Users', N'PhoneNumber',    N'nvarchar',         40,   100,  0,  0, 1),
        (N'Users', N'Role',           N'int',              4,    4,    10, 0, 0),
        (N'Users', N'IsActive',       N'bit',              1,    1,    1,  0, 0),
        (N'Users', N'CreatedAt',      N'datetime2',        8,    8,    27, 7, 0),
        (N'Users', N'UpdatedAt',      N'datetime2',        8,    8,    27, 7, 1),
        (N'Users', N'CreatedBy',      N'nvarchar',         512,  -1,   0,  0, 1),
        (N'Users', N'LastModifiedBy', N'nvarchar',         512,  -1,   0,  0, 1),

        -- 10. VolunteerAssignments (13 columns)
        (N'VolunteerAssignments', N'Id',                  N'uniqueidentifier', 16,  16, 0,  0, 0),
        (N'VolunteerAssignments', N'VolunteerId',         N'uniqueidentifier', 16,  16, 0,  0, 0),
        (N'VolunteerAssignments', N'AssistanceRequestId', N'uniqueidentifier', 16,  16, 0,  0, 1),
        (N'VolunteerAssignments', N'TaskDescription',     N'nvarchar',         -1,  -1, 0,  0, 0),
        (N'VolunteerAssignments', N'AssignmentStatus',    N'int',              4,   4,  10, 0, 0),
        (N'VolunteerAssignments', N'AIMatchScore',        N'decimal',          5,   5,  5,  4, 1),
        (N'VolunteerAssignments', N'StartTime',           N'datetime2',        8,   8,  27, 7, 1),
        (N'VolunteerAssignments', N'EndTime',             N'datetime2',        8,   8,  27, 7, 1),
        (N'VolunteerAssignments', N'Notes',               N'nvarchar',         -1,  -1, 0,  0, 1),
        (N'VolunteerAssignments', N'CreatedAt',           N'datetime2',        8,   8,  27, 7, 0),
        (N'VolunteerAssignments', N'UpdatedAt',           N'datetime2',        8,   8,  27, 7, 1),
        (N'VolunteerAssignments', N'CreatedBy',           N'nvarchar',         512, -1, 0,  0, 1),
        (N'VolunteerAssignments', N'LastModifiedBy',      N'nvarchar',         512, -1, 0,  0, 1),

        -- 11. Volunteers (12 columns)
        (N'Volunteers', N'Id',                N'uniqueidentifier', 16,  16, 0,  0, 0),
        (N'Volunteers', N'UserId',            N'uniqueidentifier', 16,  16, 0,  0, 0),
        (N'Volunteers', N'Skills',            N'nvarchar',         -1,  -1, 0,  0, 1),
        (N'Volunteers', N'Availability',      N'nvarchar',         -1,  -1, 0,  0, 1),
        (N'Volunteers', N'IsAvailable',       N'bit',              1,   1,  1,  0, 0),
        (N'Volunteers', N'Latitude',          N'decimal',          5,   5,  9,  6, 1),
        (N'Volunteers', N'Longitude',         N'decimal',          5,   5,  9,  6, 1),
        (N'Volunteers', N'MaxTravelDistance', N'decimal',          9,   9,  10, 2, 1),
        (N'Volunteers', N'CreatedAt',         N'datetime2',        8,   8,  27, 7, 0),
        (N'Volunteers', N'UpdatedAt',         N'datetime2',        8,   8,  27, 7, 1),
        (N'Volunteers', N'CreatedBy',         N'nvarchar',         512, -1, 0,  0, 1),
        (N'Volunteers', N'LastModifiedBy',    N'nvarchar',         512, -1, 0,  0, 1);

    -- 3a. Check for missing or mismatched columns (type, length, precision, scale, nullability)
    DECLARE @ColumnMismatches NVARCHAR(MAX);
    SELECT @ColumnMismatches = STRING_AGG(
        ec.TableName + N'.' + ec.ColumnName +
        CASE
            WHEN c.column_id IS NULL THEN N' (MISSING)'
            ELSE N' (actual: ' + ty.name +
                 N', max_length=' + CAST(c.max_length AS NVARCHAR(10)) +
                 N', prec=' + CAST(c.precision AS NVARCHAR(10)) +
                 N', scale=' + CAST(c.scale AS NVARCHAR(10)) +
                 N', nullable=' + CAST(c.is_nullable AS NVARCHAR(2)) + N')'
        END, N'; ')
    FROM @ExpectedColumns ec
    LEFT JOIN sys.tables t
        ON t.name = ec.TableName AND t.schema_id = SCHEMA_ID(N'dbo')
    LEFT JOIN sys.columns c
        ON c.object_id = t.object_id AND c.name = ec.ColumnName
    LEFT JOIN sys.types ty
        ON c.user_type_id = ty.user_type_id
    WHERE c.column_id IS NULL
       OR ty.name <> ec.DataType
       OR (c.max_length <> ec.MaxLengthA AND c.max_length <> ec.MaxLengthB)
       OR c.precision <> ec.Prec
       OR c.scale <> ec.Scale
       OR c.is_nullable <> ec.IsNullable;

    IF @ColumnMismatches IS NOT NULL
    BEGIN
        RAISERROR(N'Baseline adoption aborted: Column definition mismatches detected: %s', 16, 1, @ColumnMismatches);
    END;

    -- 3b. Check for unexpected extra columns in any of the 11 core tables
    DECLARE @ExtraColumns NVARCHAR(MAX);
    SELECT @ExtraColumns = STRING_AGG(t.name + N'.' + c.name, N', ')
    FROM sys.tables t
    INNER JOIN @ExpectedTables et ON t.name = et.TableName AND t.schema_id = SCHEMA_ID(N'dbo')
    INNER JOIN sys.columns c ON t.object_id = c.object_id
    LEFT JOIN @ExpectedColumns ec ON ec.TableName = t.name AND ec.ColumnName = c.name
    WHERE ec.ColumnName IS NULL;

    IF @ExtraColumns IS NOT NULL
    BEGIN
        RAISERROR(N'Baseline adoption aborted: Unexpected extra columns found in core tables: %s', 16, 1, @ExtraColumns);
    END;

    -- ======================================================================================
    -- 4. Validate Primary Keys on All 11 Core Tables
    --    - Each of the 11 tables must have EXACTLY ONE primary key constraint/index.
    --    - Each primary key must have EXACTLY ONE column (no composite PKs or extra columns).
    --    - That single primary key column (key_ordinal = 1) must be [Id].
    -- ======================================================================================
    DECLARE @PKValidationErrors NVARCHAR(MAX);

    ;WITH TablePKStats AS (
        SELECT
            et.TableName,
            PKCount = COUNT(DISTINCT i.index_id),
            TotalPKColumns = COUNT(ic.column_id),
            IdKeyOrdinal1Count = SUM(
                CASE
                    WHEN ic.key_ordinal = 1 AND ic.is_included_column = 0 AND c.name = N'Id' THEN 1
                    ELSE 0
                END
            ),
            NonIdOrExtraColumns = STRING_AGG(
                CASE
                    WHEN c.name <> N'Id' OR ic.key_ordinal > 1 OR ic.is_included_column = 1
                    THEN c.name + N' (ordinal=' + CAST(ic.key_ordinal AS NVARCHAR(10)) + N')'
                    ELSE NULL
                END,
                N', '
            )
        FROM @ExpectedTables et
        LEFT JOIN sys.tables t
            ON t.name = et.TableName
           AND t.schema_id = SCHEMA_ID(N'dbo')
        LEFT JOIN sys.indexes i
            ON i.object_id = t.object_id
           AND i.is_primary_key = 1
        LEFT JOIN sys.index_columns ic
            ON ic.object_id = i.object_id
           AND ic.index_id = i.index_id
        LEFT JOIN sys.columns c
            ON c.object_id = ic.object_id
           AND c.column_id = ic.column_id
        GROUP BY et.TableName
    )
    SELECT @PKValidationErrors = STRING_AGG(
        TableName + N': ' +
        CASE
            WHEN PKCount = 0 THEN N'missing primary key'
            WHEN PKCount > 1 THEN N'multiple primary keys detected (' + CAST(PKCount AS NVARCHAR(10)) + N')'
            WHEN TotalPKColumns > 1 THEN N'composite primary key detected (' + CAST(TotalPKColumns AS NVARCHAR(10)) + N' columns; unexpected: ' + ISNULL(NonIdOrExtraColumns, N'unknown') + N')'
            WHEN TotalPKColumns <> 1 OR IdKeyOrdinal1Count <> 1 THEN N'primary key is not single-column on [Id] (unexpected: ' + ISNULL(NonIdOrExtraColumns, N'unknown') + N')'
            ELSE N'invalid primary key'
        END,
        N'; '
    )
    FROM TablePKStats
    WHERE PKCount <> 1
       OR TotalPKColumns <> 1
       OR IdKeyOrdinal1Count <> 1;

    IF @PKValidationErrors IS NOT NULL
    BEGIN
        RAISERROR(N'Baseline adoption aborted: Primary key validation failed: %s', 16, 1, @PKValidationErrors);
    END;

    -- ======================================================================================
    -- 5. Validate All 15 Core Foreign Key Relationships (Parent Table/Col -> Ref Table/Col)
    -- ======================================================================================
    DECLARE @ExpectedFKs TABLE (
        ParentTable SYSNAME NOT NULL,
        ParentCol   SYSNAME NOT NULL,
        RefTable    SYSNAME NOT NULL,
        RefCol      SYSNAME NOT NULL,
        PRIMARY KEY (ParentTable, ParentCol, RefTable, RefCol)
    );

    INSERT INTO @ExpectedFKs (ParentTable, ParentCol, RefTable, RefCol)
    VALUES
        (N'AIDecisionAudits',     N'AssistanceRequestId', N'AssistanceRequests', N'Id'),
        (N'AIDecisionAudits',     N'OverriddenBy',        N'Users',              N'Id'),
        (N'AssistanceRequests',   N'CrisisEventId',       N'CrisisEvents',       N'Id'),
        (N'AssistanceRequests',   N'DuplicateOfId',       N'AssistanceRequests', N'Id'),
        (N'AssistanceRequests',   N'RequestorId',         N'Users',              N'Id'),
        (N'Donations',            N'CrisisEventId',       N'CrisisEvents',       N'Id'),
        (N'ResourceAllocations',  N'AssistanceRequestId', N'AssistanceRequests', N'Id'),
        (N'ResourceAllocations',  N'ResourceId',          N'Resources',          N'Id'),
        (N'ResourceAllocations',  N'ShelterId',           N'Shelters',           N'Id'),
        (N'ShelterAllocations',   N'AssistanceRequestId', N'AssistanceRequests', N'Id'),
        (N'ShelterAllocations',   N'ShelterId',           N'Shelters',           N'Id'),
        (N'Shelters',             N'CrisisEventId',       N'CrisisEvents',       N'Id'),
        (N'VolunteerAssignments', N'AssistanceRequestId', N'AssistanceRequests', N'Id'),
        (N'VolunteerAssignments', N'VolunteerId',         N'Volunteers',         N'Id'),
        (N'Volunteers',           N'UserId',              N'Users',              N'Id');

    DECLARE @MissingFKs NVARCHAR(MAX);
    SELECT @MissingFKs = STRING_AGG(
        efk.ParentTable + N'.' + efk.ParentCol + N' -> ' + efk.RefTable + N'.' + efk.RefCol, N'; ')
    FROM @ExpectedFKs efk
    WHERE NOT EXISTS (
        SELECT 1
        FROM sys.foreign_keys fk
        INNER JOIN sys.foreign_key_columns fkc ON fk.object_id = fkc.constraint_object_id
        INNER JOIN sys.tables pt ON fk.parent_object_id = pt.object_id AND pt.schema_id = SCHEMA_ID(N'dbo')
        INNER JOIN sys.columns pc ON fkc.parent_object_id = pc.object_id AND fkc.parent_column_id = pc.column_id
        INNER JOIN sys.tables rt ON fk.referenced_object_id = rt.object_id AND rt.schema_id = SCHEMA_ID(N'dbo')
        INNER JOIN sys.columns rc ON fkc.referenced_object_id = rc.object_id AND fkc.referenced_column_id = rc.column_id
        WHERE pt.name = efk.ParentTable
          AND pc.name = efk.ParentCol
          AND rt.name = efk.RefTable
          AND rc.name = efk.RefCol
    );

    IF @MissingFKs IS NOT NULL
    BEGIN
        RAISERROR(N'Baseline adoption aborted: Missing required core foreign key relationships: %s', 16, 1, @MissingFKs);
    END;

    -- ======================================================================================
    -- 6. Create [dbo].[__EFMigrationsHistory] (If Absent) and Register InitialCoreSchema
    -- ======================================================================================
    IF OBJECT_ID(N'[dbo].[__EFMigrationsHistory]', N'U') IS NULL
    BEGIN
        CREATE TABLE [dbo].[__EFMigrationsHistory] (
            [MigrationId] NVARCHAR(150) NOT NULL,
            [ProductVersion] NVARCHAR(32) NOT NULL,
            CONSTRAINT [PK___EFMigrationsHistory] PRIMARY KEY ([MigrationId])
        );
    END;

    IF NOT EXISTS (
        SELECT 1
        FROM [dbo].[__EFMigrationsHistory]
        WHERE [MigrationId] = N'20261106174251_InitialCoreSchema'
    )
    BEGIN
        INSERT INTO [dbo].[__EFMigrationsHistory] ([MigrationId], [ProductVersion])
        VALUES (N'20261106174251_InitialCoreSchema', N'8.0.0');
    END;

    COMMIT TRANSACTION;
    PRINT N'SUCCESS: All 11 core tables, 157 columns, 11 primary keys, and 15 foreign keys passed validation. Migration 20261106174251_InitialCoreSchema recorded in [dbo].[__EFMigrationsHistory].';
END TRY
BEGIN CATCH
    IF @@TRANCOUNT > 0
        ROLLBACK TRANSACTION;

    DECLARE @ErrorMessage NVARCHAR(4000) = ERROR_MESSAGE();
    RAISERROR(N'Baseline adoption failed and was rolled back: %s', 16, 1, @ErrorMessage);
END CATCH;
