-- ============================================================
-- Humanitarian Crisis Management Platform - Database Schema
-- SQL Server Compatible
-- ============================================================

-- ========================
-- Users Table
-- ========================
CREATE TABLE Users (
    Id                  UNIQUEIDENTIFIER    PRIMARY KEY DEFAULT NEWID(),
    FullName            NVARCHAR(200)       NOT NULL,
    Email               NVARCHAR(256)       NOT NULL UNIQUE,
    PasswordHash        NVARCHAR(500)       NOT NULL,
    PhoneNumber         NVARCHAR(20)        NULL,
    Role                INT                 NOT NULL DEFAULT 0,  -- 0=Citizen, 1=Coordinator, 2=LogisticsManager, 3=Volunteer, 4=Admin
    IsActive            BIT                 NOT NULL DEFAULT 1,
    CreatedAt           DATETIME2           NOT NULL DEFAULT GETUTCDATE(),
    UpdatedAt           DATETIME2           NULL,
    CreatedBy           NVARCHAR(256)       NULL,
    LastModifiedBy      NVARCHAR(256)       NULL
);

-- ========================
-- Crisis Events Table
-- ========================
CREATE TABLE CrisisEvents (
    Id                  UNIQUEIDENTIFIER    PRIMARY KEY DEFAULT NEWID(),
    Title               NVARCHAR(300)       NOT NULL,
    Description         NVARCHAR(MAX)       NULL,
    DisasterType        INT                 NOT NULL,  -- 0=Flood, 1=Landslide, 2=Storm, 3=Tsunami
    Severity            INT                 NOT NULL DEFAULT 1,
    Latitude            DECIMAL(9,6)        NULL,
    Longitude           DECIMAL(9,6)        NULL,
    AffectedAreaRadius  DECIMAL(10,2)       NULL,
    StartDate           DATETIME2           NOT NULL,
    EndDate             DATETIME2           NULL,
    IsActive            BIT                 NOT NULL DEFAULT 1,
    CreatedAt           DATETIME2           NOT NULL DEFAULT GETUTCDATE(),
    UpdatedAt           DATETIME2           NULL,
    CreatedBy           NVARCHAR(256)       NULL,
    LastModifiedBy      NVARCHAR(256)       NULL
);

-- ========================
-- Assistance Requests Table
-- ========================
CREATE TABLE AssistanceRequests (
    Id                  UNIQUEIDENTIFIER    PRIMARY KEY DEFAULT NEWID(),
    RequestorId         UNIQUEIDENTIFIER    NOT NULL,
    CrisisEventId       UNIQUEIDENTIFIER    NULL,
    Category            NVARCHAR(100)       NOT NULL,
    Description         NVARCHAR(MAX)       NOT NULL,
    Urgency             INT                 NOT NULL DEFAULT 1,  -- PriorityLevel enum
    Status              INT                 NOT NULL DEFAULT 0,  -- RequestStatus enum
    Latitude            DECIMAL(9,6)        NULL,
    Longitude           DECIMAL(9,6)        NULL,
    Address             NVARCHAR(500)       NULL,
    NumberOfPeople      INT                 NOT NULL DEFAULT 1,
    ContactPhone        NVARCHAR(20)        NULL,
    AttachmentUrl       NVARCHAR(1000)      NULL,
    AIPriorityScore     DECIMAL(5,2)        NULL,
    AIConfidence        DECIMAL(5,4)        NULL,
    IsDuplicate         BIT                 NOT NULL DEFAULT 0,
    DuplicateOfId       UNIQUEIDENTIFIER    NULL,
    ResolvedAt          DATETIME2           NULL,
    CreatedAt           DATETIME2           NOT NULL DEFAULT GETUTCDATE(),
    UpdatedAt           DATETIME2           NULL,
    CreatedBy           NVARCHAR(256)       NULL,
    LastModifiedBy      NVARCHAR(256)       NULL,

    CONSTRAINT FK_AssistanceRequests_Requestor FOREIGN KEY (RequestorId) REFERENCES Users(Id),
    CONSTRAINT FK_AssistanceRequests_CrisisEvent FOREIGN KEY (CrisisEventId) REFERENCES CrisisEvents(Id),
    CONSTRAINT FK_AssistanceRequests_DuplicateOf FOREIGN KEY (DuplicateOfId) REFERENCES AssistanceRequests(Id)
);

-- ========================
-- AI Decision Audit Table
-- ========================
CREATE TABLE AIDecisionAudits (
    Id                  UNIQUEIDENTIFIER    PRIMARY KEY DEFAULT NEWID(),
    AssistanceRequestId UNIQUEIDENTIFIER    NOT NULL,
    AISuggestion        NVARCHAR(MAX)       NOT NULL,
    ConfidenceScore     DECIMAL(5,4)        NOT NULL,
    SuggestedPriority   INT                 NOT NULL,
    WasOverridden       BIT                 NOT NULL DEFAULT 0,
    HumanDecision       NVARCHAR(MAX)       NULL,
    OverriddenBy        UNIQUEIDENTIFIER    NULL,
    OverrideReason      NVARCHAR(MAX)       NULL,
    ReviewedAt          DATETIME2           NULL,
    CreatedAt           DATETIME2           NOT NULL DEFAULT GETUTCDATE(),
    UpdatedAt           DATETIME2           NULL,
    CreatedBy           NVARCHAR(256)       NULL,
    LastModifiedBy      NVARCHAR(256)       NULL,

    CONSTRAINT FK_AIDecisionAudits_Request FOREIGN KEY (AssistanceRequestId) REFERENCES AssistanceRequests(Id),
    CONSTRAINT FK_AIDecisionAudits_Overrider FOREIGN KEY (OverriddenBy) REFERENCES Users(Id)
);

-- ========================
-- Shelters Table
-- ========================
CREATE TABLE Shelters (
    Id                  UNIQUEIDENTIFIER    PRIMARY KEY DEFAULT NEWID(),
    Name                NVARCHAR(300)       NOT NULL,
    Address             NVARCHAR(500)       NOT NULL,
    Latitude            DECIMAL(9,6)        NOT NULL,
    Longitude           DECIMAL(9,6)        NOT NULL,
    TotalCapacity       INT                 NOT NULL,
    CurrentOccupancy    INT                 NOT NULL DEFAULT 0,
    Facilities          NVARCHAR(MAX)       NULL,       -- JSON array of available facilities
    ContactPhone        NVARCHAR(20)        NULL,
    IsActive            BIT                 NOT NULL DEFAULT 1,
    CrisisEventId       UNIQUEIDENTIFIER    NULL,
    CreatedAt           DATETIME2           NOT NULL DEFAULT GETUTCDATE(),
    UpdatedAt           DATETIME2           NULL,
    CreatedBy           NVARCHAR(256)       NULL,
    LastModifiedBy      NVARCHAR(256)       NULL,

    CONSTRAINT FK_Shelters_CrisisEvent FOREIGN KEY (CrisisEventId) REFERENCES CrisisEvents(Id),
    CONSTRAINT CK_Shelters_Occupancy CHECK (CurrentOccupancy <= TotalCapacity)
);

-- ========================
-- Shelter Allocations Table
-- ========================
CREATE TABLE ShelterAllocations (
    Id                  UNIQUEIDENTIFIER    PRIMARY KEY DEFAULT NEWID(),
    ShelterId           UNIQUEIDENTIFIER    NOT NULL,
    AssistanceRequestId UNIQUEIDENTIFIER    NULL,
    PersonName          NVARCHAR(200)       NOT NULL,
    NumberOfPersons     INT                 NOT NULL DEFAULT 1,
    CheckInDate         DATETIME2           NOT NULL DEFAULT GETUTCDATE(),
    CheckOutDate        DATETIME2           NULL,
    Notes               NVARCHAR(MAX)       NULL,
    CreatedAt           DATETIME2           NOT NULL DEFAULT GETUTCDATE(),
    UpdatedAt           DATETIME2           NULL,
    CreatedBy           NVARCHAR(256)       NULL,
    LastModifiedBy      NVARCHAR(256)       NULL,

    CONSTRAINT FK_ShelterAllocations_Shelter FOREIGN KEY (ShelterId) REFERENCES Shelters(Id),
    CONSTRAINT FK_ShelterAllocations_Request FOREIGN KEY (AssistanceRequestId) REFERENCES AssistanceRequests(Id)
);

-- ========================
-- Resources Table
-- ========================
CREATE TABLE Resources (
    Id                  UNIQUEIDENTIFIER    PRIMARY KEY DEFAULT NEWID(),
    Name                NVARCHAR(200)       NOT NULL,
    Category            NVARCHAR(100)       NOT NULL,    -- Medicine, Water, Food, Equipment
    Unit                NVARCHAR(50)        NOT NULL,    -- Litres, Kg, Units, Boxes
    TotalQuantity       DECIMAL(12,2)       NOT NULL DEFAULT 0,
    AllocatedQuantity   DECIMAL(12,2)       NOT NULL DEFAULT 0,
    MinimumThreshold    DECIMAL(12,2)       NOT NULL DEFAULT 0,
    WarehouseLocation   NVARCHAR(300)       NULL,
    ExpiryDate          DATETIME2           NULL,
    CreatedAt           DATETIME2           NOT NULL DEFAULT GETUTCDATE(),
    UpdatedAt           DATETIME2           NULL,
    CreatedBy           NVARCHAR(256)       NULL,
    LastModifiedBy      NVARCHAR(256)       NULL,

    CONSTRAINT CK_Resources_Allocated CHECK (AllocatedQuantity <= TotalQuantity)
);

-- ========================
-- Resource Allocations Table
-- ========================
CREATE TABLE ResourceAllocations (
    Id                  UNIQUEIDENTIFIER    PRIMARY KEY DEFAULT NEWID(),
    ResourceId          UNIQUEIDENTIFIER    NOT NULL,
    AssistanceRequestId UNIQUEIDENTIFIER    NULL,
    ShelterId           UNIQUEIDENTIFIER    NULL,
    Quantity            DECIMAL(12,2)       NOT NULL,
    DispatchStatus      INT                 NOT NULL DEFAULT 0,  -- 0=Pending, 1=Dispatched, 2=Delivered, 3=Cancelled
    Priority            INT                 NOT NULL DEFAULT 1,
    DispatchedAt        DATETIME2           NULL,
    DeliveredAt         DATETIME2           NULL,
    Notes               NVARCHAR(MAX)       NULL,
    CreatedAt           DATETIME2           NOT NULL DEFAULT GETUTCDATE(),
    UpdatedAt           DATETIME2           NULL,
    CreatedBy           NVARCHAR(256)       NULL,
    LastModifiedBy      NVARCHAR(256)       NULL,

    CONSTRAINT FK_ResourceAllocations_Resource FOREIGN KEY (ResourceId) REFERENCES Resources(Id),
    CONSTRAINT FK_ResourceAllocations_Request FOREIGN KEY (AssistanceRequestId) REFERENCES AssistanceRequests(Id),
    CONSTRAINT FK_ResourceAllocations_Shelter FOREIGN KEY (ShelterId) REFERENCES Shelters(Id)
);

-- ========================
-- Volunteers Table
-- ========================
CREATE TABLE Volunteers (
    Id                  UNIQUEIDENTIFIER    PRIMARY KEY DEFAULT NEWID(),
    UserId              UNIQUEIDENTIFIER    NOT NULL,
    Skills              NVARCHAR(MAX)       NULL,       -- JSON array of skills
    Availability        NVARCHAR(MAX)       NULL,       -- JSON schedule
    IsAvailable         BIT                 NOT NULL DEFAULT 1,
    Latitude            DECIMAL(9,6)        NULL,
    Longitude           DECIMAL(9,6)        NULL,
    MaxTravelDistance    DECIMAL(10,2)       NULL,       -- in kilometers
    CreatedAt           DATETIME2           NOT NULL DEFAULT GETUTCDATE(),
    UpdatedAt           DATETIME2           NULL,
    CreatedBy           NVARCHAR(256)       NULL,
    LastModifiedBy      NVARCHAR(256)       NULL,

    CONSTRAINT FK_Volunteers_User FOREIGN KEY (UserId) REFERENCES Users(Id)
);

-- ========================
-- Volunteer Assignments Table
-- ========================
CREATE TABLE VolunteerAssignments (
    Id                  UNIQUEIDENTIFIER    PRIMARY KEY DEFAULT NEWID(),
    VolunteerId         UNIQUEIDENTIFIER    NOT NULL,
    AssistanceRequestId UNIQUEIDENTIFIER    NULL,
    TaskDescription     NVARCHAR(MAX)       NOT NULL,
    AssignmentStatus    INT                 NOT NULL DEFAULT 0,  -- 0=Assigned, 1=InProgress, 2=Completed, 3=Cancelled
    AIMatchScore        DECIMAL(5,4)        NULL,
    StartTime           DATETIME2           NULL,
    EndTime             DATETIME2           NULL,
    Notes               NVARCHAR(MAX)       NULL,
    CreatedAt           DATETIME2           NOT NULL DEFAULT GETUTCDATE(),
    UpdatedAt           DATETIME2           NULL,
    CreatedBy           NVARCHAR(256)       NULL,
    LastModifiedBy      NVARCHAR(256)       NULL,

    CONSTRAINT FK_VolunteerAssignments_Volunteer FOREIGN KEY (VolunteerId) REFERENCES Volunteers(Id),
    CONSTRAINT FK_VolunteerAssignments_Request FOREIGN KEY (AssistanceRequestId) REFERENCES AssistanceRequests(Id)
);

-- ========================
-- Donations Table
-- ========================
CREATE TABLE Donations (
    Id                  UNIQUEIDENTIFIER    PRIMARY KEY DEFAULT NEWID(),
    DonorName           NVARCHAR(200)       NOT NULL,
    DonorEmail          NVARCHAR(256)       NULL,
    DonorPhone          NVARCHAR(20)        NULL,
    DonationType        INT                 NOT NULL,    -- 0=Monetary, 1=Material
    Amount              DECIMAL(12,2)       NULL,
    Currency            NVARCHAR(10)        NULL DEFAULT 'USD',
    ItemDescription     NVARCHAR(MAX)       NULL,
    ItemQuantity        INT                 NULL,
    CrisisEventId       UNIQUEIDENTIFIER    NULL,
    Status              INT                 NOT NULL DEFAULT 0,  -- 0=Pledged, 1=Received, 2=Distributed
    ReceivedAt          DATETIME2           NULL,
    CreatedAt           DATETIME2           NOT NULL DEFAULT GETUTCDATE(),
    UpdatedAt           DATETIME2           NULL,
    CreatedBy           NVARCHAR(256)       NULL,
    LastModifiedBy      NVARCHAR(256)       NULL,

    CONSTRAINT FK_Donations_CrisisEvent FOREIGN KEY (CrisisEventId) REFERENCES CrisisEvents(Id)
);

-- ========================
-- Indexes for Performance
-- ========================
CREATE INDEX IX_AssistanceRequests_Status ON AssistanceRequests(Status);
CREATE INDEX IX_AssistanceRequests_Urgency ON AssistanceRequests(Urgency);
CREATE INDEX IX_AssistanceRequests_RequestorId ON AssistanceRequests(RequestorId);
CREATE INDEX IX_AssistanceRequests_CrisisEventId ON AssistanceRequests(CrisisEventId);
CREATE INDEX IX_AIDecisionAudits_RequestId ON AIDecisionAudits(AssistanceRequestId);
CREATE INDEX IX_Shelters_IsActive ON Shelters(IsActive);
CREATE INDEX IX_ResourceAllocations_ResourceId ON ResourceAllocations(ResourceId);
CREATE INDEX IX_Volunteers_IsAvailable ON Volunteers(IsAvailable);
CREATE INDEX IX_VolunteerAssignments_VolunteerId ON VolunteerAssignments(VolunteerId);
CREATE INDEX IX_Donations_CrisisEventId ON Donations(CrisisEventId);
