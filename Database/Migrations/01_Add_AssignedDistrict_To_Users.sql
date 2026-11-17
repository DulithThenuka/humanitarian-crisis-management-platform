-- ==========================================================================================
-- Migration: 01_Add_AssignedDistrict_To_Users
-- Target Database: HumanitarianCrisisDb on (localdb)\mssqllocaldb
-- Safety: Non-destructive, idempotent, zero data modification
-- ==========================================================================================

SET NOCOUNT ON;

IF NOT EXISTS (
    SELECT 1 
    FROM INFORMATION_SCHEMA.COLUMNS 
    WHERE TABLE_NAME = N'Users' 
      AND COLUMN_NAME = N'AssignedDistrict'
      AND TABLE_SCHEMA = N'dbo'
)
BEGIN
    ALTER TABLE [dbo].[Users] ADD [AssignedDistrict] NVARCHAR(100) NULL;
    PRINT N'SUCCESS: Column [AssignedDistrict] NVARCHAR(100) NULL added to [dbo].[Users].';
END
ELSE
BEGIN
    PRINT N'NOTICE: Column [AssignedDistrict] already exists in [dbo].[Users]. No changes made.';
END
GO
