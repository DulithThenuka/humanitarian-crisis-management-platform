-- ============================================================
-- Humanitarian Crisis Management Platform - Seed Data
-- ============================================================

-- ========================
-- Seed Admin User
-- Password: Admin@123 (BCrypt hashed)
-- ========================
INSERT INTO Users (Id, FullName, Email, PasswordHash, PhoneNumber, Role, IsActive, CreatedAt)
VALUES (
    'A1B2C3D4-E5F6-7890-ABCD-EF1234567890',
    'System Administrator',
    'admin@crisisplatform.org',
    '$2a$11$K1J2k3L4m5N6o7P8q9R0sOtUvWxYz1A2B3C4D5E6F7G8H9I0J1K2',
    '+94771234567',
    4,  -- Admin role
    1,
    GETUTCDATE()
);

-- ========================
-- Seed Coordinator User
-- Password: Coord@123
-- ========================
INSERT INTO Users (Id, FullName, Email, PasswordHash, PhoneNumber, Role, IsActive, CreatedAt)
VALUES (
    'B2C3D4E5-F6A7-8901-BCDE-F12345678901',
    'Jane Coordinator',
    'coordinator@crisisplatform.org',
    '$2a$11$L2M3n4O5p6Q7r8S9t0U1vOwXyZ2A3B4C5D6E7F8G9H0I1J2K3L4',
    '+94779876543',
    1,  -- Coordinator role
    1,
    GETUTCDATE()
);

-- ========================
-- Seed Logistics Manager
-- Password: Logistics@123
-- ========================
INSERT INTO Users (Id, FullName, Email, PasswordHash, PhoneNumber, Role, IsActive, CreatedAt)
VALUES (
    'C3D4E5F6-A7B8-9012-CDEF-123456789012',
    'Mark Logistics',
    'logistics@crisisplatform.org',
    '$2a$11$M3N4o5P6q7R8s9T0u1V2wOxYz3A4B5C6D7E8F9G0H1I2J3K4L5',
    '+94770001111',
    2,  -- LogisticsManager role
    1,
    GETUTCDATE()
);

-- ========================
-- Seed Citizen User
-- Password: Citizen@123
-- ========================
INSERT INTO Users (Id, FullName, Email, PasswordHash, PhoneNumber, Role, IsActive, CreatedAt)
VALUES (
    'D4E5F6A7-B8C9-0123-DEFA-234567890123',
    'Alice Citizen',
    'citizen@crisisplatform.org',
    '$2a$11$N4O5p6Q7r8S9t0U1v2W3xOyZ4A5B6C7D8E9F0G1H2I3J4K5L6',
    '+94772223333',
    0,  -- Citizen role
    1,
    GETUTCDATE()
);

-- ========================
-- Seed Volunteer User
-- Password: Volunteer@123
-- ========================
INSERT INTO Users (Id, FullName, Email, PasswordHash, PhoneNumber, Role, IsActive, CreatedAt)
VALUES (
    'E5F6A7B8-C9D0-1234-EFAB-345678901234',
    'Bob Volunteer',
    'volunteer@crisisplatform.org',
    '$2a$11$O5P6q7R8s9T0u1V2w3X4yOz5A6B7C8D9E0F1G2H3I4J5K6L7',
    '+94774445555',
    3,  -- Volunteer role
    1,
    GETUTCDATE()
);

-- ========================
-- Seed Crisis Events
-- ========================
INSERT INTO CrisisEvents (Id, Title, Description, DisasterType, Severity, Latitude, Longitude, AffectedAreaRadius, StartDate, IsActive, CreatedAt)
VALUES
(
    'F6A7B8C9-D0E1-2345-FABC-456789012345',
    '2024 Southern Province Floods',
    'Severe flooding across the Southern Province affecting multiple districts. Major river systems have overflowed causing widespread displacement.',
    0,  -- Flood
    4,
    6.0535,
    80.2210,
    50.00,
    '2024-05-15T06:00:00',
    1,
    GETUTCDATE()
),
(
    'A7B8C9D0-E1F2-3456-ABCD-567890123456',
    'Badulla District Landslide',
    'Multiple landslides triggered by heavy monsoon rains in the Badulla District hill country region.',
    1,  -- Landslide
    3,
    6.9934,
    81.0550,
    15.00,
    '2024-06-20T14:30:00',
    1,
    GETUTCDATE()
),
(
    'B8C9D0E1-F2A3-4567-BCDE-678901234567',
    'Eastern Coast Cyclone Warning',
    'Category 2 tropical cyclone approaching the eastern coastline with expected landfall within 48 hours.',
    2,  -- Storm
    5,
    7.8731,
    81.6747,
    100.00,
    '2024-07-10T00:00:00',
    0,
    GETUTCDATE()
);

-- ========================
-- Seed Shelters
-- ========================
INSERT INTO Shelters (Id, Name, Address, Latitude, Longitude, TotalCapacity, CurrentOccupancy, Facilities, ContactPhone, IsActive, CrisisEventId, CreatedAt)
VALUES
(
    '10000000-0000-0000-0000-000000000001',
    'Galle Community Hall Shelter',
    'Main Street, Galle, Southern Province',
    6.0329,
    80.2168,
    200,
    45,
    '["Water Supply","First Aid","Toilets","Kitchen","Electricity","WiFi"]',
    '+94912234567',
    1,
    'F6A7B8C9-D0E1-2345-FABC-456789012345',
    GETUTCDATE()
),
(
    '10000000-0000-0000-0000-000000000002',
    'Matara Public School Shelter',
    'School Lane, Matara, Southern Province',
    5.9485,
    80.5353,
    150,
    80,
    '["Water Supply","First Aid","Toilets","Electricity"]',
    '+94412345678',
    1,
    'F6A7B8C9-D0E1-2345-FABC-456789012345',
    GETUTCDATE()
),
(
    '10000000-0000-0000-0000-000000000003',
    'Badulla Town Hall Emergency Centre',
    'Town Hall Road, Badulla',
    6.9934,
    81.0550,
    100,
    25,
    '["Water Supply","First Aid","Toilets","Kitchen"]',
    '+94552345678',
    1,
    'A7B8C9D0-E1F2-3456-ABCD-567890123456',
    GETUTCDATE()
);

-- ========================
-- Seed Resources
-- ========================
INSERT INTO Resources (Id, Name, Category, Unit, TotalQuantity, AllocatedQuantity, MinimumThreshold, WarehouseLocation, CreatedAt)
VALUES
('20000000-0000-0000-0000-000000000001', 'Drinking Water Bottles (500ml)', 'Water', 'Units', 10000, 2500, 1000, 'Central Warehouse, Colombo', GETUTCDATE()),
('20000000-0000-0000-0000-000000000002', 'Rice (50kg Bags)', 'Food', 'Bags', 500, 120, 50, 'Central Warehouse, Colombo', GETUTCDATE()),
('20000000-0000-0000-0000-000000000003', 'First Aid Kits', 'Medicine', 'Units', 300, 75, 30, 'Medical Supplies Depot, Kandy', GETUTCDATE()),
('20000000-0000-0000-0000-000000000004', 'Emergency Blankets', 'Equipment', 'Units', 2000, 400, 200, 'Central Warehouse, Colombo', GETUTCDATE()),
('20000000-0000-0000-0000-000000000005', 'Paracetamol (500mg)', 'Medicine', 'Boxes', 1000, 150, 100, 'Medical Supplies Depot, Kandy', GETUTCDATE()),
('20000000-0000-0000-0000-000000000006', 'Tarpaulin Sheets', 'Equipment', 'Units', 800, 200, 100, 'Logistics Hub, Galle', GETUTCDATE());

-- ========================
-- Seed Volunteer Record
-- ========================
INSERT INTO Volunteers (Id, UserId, Skills, Availability, IsAvailable, Latitude, Longitude, MaxTravelDistance, CreatedAt)
VALUES (
    '30000000-0000-0000-0000-000000000001',
    'E5F6A7B8-C9D0-1234-EFAB-345678901234',
    '["First Aid","Search and Rescue","Driving","Translation (Sinhala/Tamil/English)"]',
    '{"monday":"09:00-17:00","tuesday":"09:00-17:00","wednesday":"09:00-17:00","thursday":"09:00-17:00","friday":"09:00-17:00","saturday":"10:00-14:00","sunday":"unavailable"}',
    1,
    6.9271,
    79.8612,
    50.00,
    GETUTCDATE()
);
