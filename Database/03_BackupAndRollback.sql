-- ==========================================================================================
-- HumanAid - Step 0: Safe Pre-Migration Backup, Verification, and Emergency Rollback Script
-- (FOR DBA REVIEW ONLY - DO NOT AUTO-EXECUTE)
-- Target Database: HumanitarianCrisisDb on (localdb)\MSSQLLocalDB
-- ==========================================================================================

SET NOCOUNT ON;
SET XACT_ABORT ON;

-- ==========================================================================================
-- SECTION 1: SAFE PRE-MIGRATION FULL BACKUP (NO OVERWRITE + CHECKSUM + EXPLICIT VERIFICATION)
-- ==========================================================================================
-- Safeguards:
--   1. Checks sys.dm_os_file_exists before running BACKUP DATABASE and aborts if the target
--      .bak file already exists, preventing accidental overwrite of a prior backup.
--   2. Uses WITH NOFORMAT, NOINIT, NOSKIP, CHECKSUM, STOP_ON_ERROR inside TRY...CATCH.
--   3. Immediately verifies backup stream integrity via RESTORE VERIFYONLY WITH CHECKSUM.
--   4. Explicitly validates backup metadata in msdb.dbo.backupset + msdb.dbo.backupmediafamily
--      (backup_set_id, type = 'D', backup_finish_date >= @BackupStartTime, backup_size > 0,
--      has_backup_checksums = 1, is_damaged = 0) and aborts if any check fails BEFORE
--      printing SUCCESS.
-- ==========================================================================================

BEGIN TRY
    DECLARE @BackupFilePath NVARCHAR(400) = N'C:\Users\eshan\HumanitarianCrisisDb_PreMigration.bak';
    DECLARE @FileExists INT = 0;
    DECLARE @BackupStartTime DATETIME = DATEADD(SECOND, -1, GETDATE());

    SELECT @FileExists = file_exists
    FROM sys.dm_os_file_exists(@BackupFilePath);

    IF @FileExists = 1
    BEGIN
        RAISERROR(N'Backup aborted to prevent overwriting existing backup file: %s. Specify a new timestamped filename before proceeding.', 16, 1, @BackupFilePath);
    END;

    BACKUP DATABASE [HumanitarianCrisisDb]
    TO DISK = @BackupFilePath
    WITH NOFORMAT,
         NOINIT,
         NOSKIP,
         CHECKSUM,
         STOP_ON_ERROR,
         NAME = N'HumanitarianCrisisDb Pre-EF-Migration Full Backup',
         STATS = 10;

    -- Verify physical backup media and checksum integrity (raises severity 16 error on failure):
    RESTORE VERIFYONLY
    FROM DISK = @BackupFilePath
    WITH CHECKSUM;

    -- Explicitly verify backup metadata recorded in msdb before reporting success:
    DECLARE @VerifiedBackupSetId   INT;
    DECLARE @VerifiedBackupType    CHAR(1);
    DECLARE @VerifiedBackupSize    NUMERIC(20, 0);
    DECLARE @VerifiedHasChecksums  BIT;
    DECLARE @VerifiedIsDamaged     BIT;
    DECLARE @VerifiedStartDate     DATETIME;
    DECLARE @VerifiedFinishDate    DATETIME;
    DECLARE @VerifiedPhysicalPath  NVARCHAR(260);

    SELECT TOP (1)
        @VerifiedBackupSetId  = bs.backup_set_id,
        @VerifiedBackupType   = bs.[type],
        @VerifiedBackupSize   = bs.backup_size,
        @VerifiedHasChecksums = bs.has_backup_checksums,
        @VerifiedIsDamaged    = bs.is_damaged,
        @VerifiedStartDate    = bs.backup_start_date,
        @VerifiedFinishDate   = bs.backup_finish_date,
        @VerifiedPhysicalPath = bmf.physical_device_name
    FROM msdb.dbo.backupset bs
    INNER JOIN msdb.dbo.backupmediafamily bmf
        ON bs.media_set_id = bmf.media_set_id
    WHERE bs.database_name = N'HumanitarianCrisisDb'
      AND bmf.physical_device_name = @BackupFilePath
      AND bs.backup_finish_date >= @BackupStartTime
    ORDER BY bs.backup_finish_date DESC;

    IF @VerifiedBackupSetId IS NULL
    BEGIN
        RAISERROR(N'Backup verification failed: No matching completed backup record found in msdb.dbo.backupset for HumanitarianCrisisDb at %s.', 16, 1, @BackupFilePath);
    END;

    IF @VerifiedBackupType <> 'D'
       OR @VerifiedBackupSize IS NULL
       OR @VerifiedBackupSize <= 0
       OR @VerifiedHasChecksums <> 1
       OR @VerifiedIsDamaged <> 0
       OR @VerifiedFinishDate IS NULL
    BEGIN
       DECLARE @VerifiedHasChecksumsInt INT =
    ISNULL(CONVERT(INT, @VerifiedHasChecksums), -1);

DECLARE @VerifiedIsDamagedInt INT =
    ISNULL(CONVERT(INT, @VerifiedIsDamaged), -1);

RAISERROR(
    N'Backup metadata verification failed: BackupSetId=%d has invalid metadata (type=%s, has_checksums=%d, is_damaged=%d).',
    16,
    1,
    @VerifiedBackupSetId,
    @VerifiedBackupType,
    @VerifiedHasChecksumsInt,
    @VerifiedIsDamagedInt);
END;

    -- Emit verified backup metadata for DBA audit log:
    SELECT
        @VerifiedBackupSetId  AS VerifiedBackupSetId,
        N'HumanitarianCrisisDb' AS DatabaseName,
        @VerifiedBackupType   AS BackupType,
        @VerifiedStartDate    AS BackupStartDate,
        @VerifiedFinishDate   AS BackupFinishDate,
        @VerifiedBackupSize   AS BackupSizeBytes,
        @VerifiedHasChecksums AS HasBackupChecksums,
        @VerifiedIsDamaged    AS IsDamaged,
        @VerifiedPhysicalPath AS PhysicalDevicePath;

    PRINT N'SUCCESS: Pre-migration backup created, verified via RESTORE VERIFYONLY WITH CHECKSUM, and confirmed in msdb.dbo.backupset.';
END TRY
BEGIN CATCH
    DECLARE @BackupErrorMessage NVARCHAR(4000) = ERROR_MESSAGE();
    RAISERROR(N'CRITICAL: Pre-migration backup or verification failed. Do NOT proceed with migrations: %s', 16, 1, @BackupErrorMessage);
END CATCH;
GO


-- ==========================================================================================
-- SECTION 2: EMERGENCY ROLLBACK / RESTORE PROCEDURE (DESTRUCTIVE - MANUAL USE ONLY)
-- ==========================================================================================
-- WARNING - DESTRUCTIVE OPERATION:
--   RESTORE DATABASE ... WITH REPLACE overwrites the entire current HumanitarianCrisisDb
--   database with the backup image, permanently discarding any data or schema changes made
--   after the backup timestamp.
--   This block is commented out AND guarded by @ConfirmDestructiveRestore = 0 so it can
--   never execute accidentally.
-- ==========================================================================================
/*
USE [master];
GO

DECLARE @ConfirmDestructiveRestore BIT = 0; -- MUST be manually changed to 1 after DBA review
DECLARE @RestoreFilePath NVARCHAR(400) = N'C:\Users\eshan\HumanitarianCrisisDb_PreMigration.bak';

IF @ConfirmDestructiveRestore <> 1
BEGIN
    RAISERROR(N'Destructive restore aborted: @ConfirmDestructiveRestore is 0.', 16, 1);
    RETURN;
END;

-- Verify backup integrity before attempting destructive restore:
RESTORE VERIFYONLY
FROM DISK = @RestoreFilePath
WITH CHECKSUM;

ALTER DATABASE [HumanitarianCrisisDb] SET SINGLE_USER WITH ROLLBACK IMMEDIATE;

RESTORE DATABASE [HumanitarianCrisisDb]
FROM DISK = @RestoreFilePath
WITH REPLACE, RECOVERY, STATS = 10;

ALTER DATABASE [HumanitarianCrisisDb] SET MULTI_USER;
PRINT N'Emergency restore of HumanitarianCrisisDb completed.';
GO
*/
