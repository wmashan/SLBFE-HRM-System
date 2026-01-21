# Employee Table Design - SLBFE HRM System

## Overview
This document outlines the comprehensive Employee table design based on the requirements specified for storing employee data in the SLBFE HRM System.

## Database Design

### Entity: Employee
**File Location**: `backend/SLBFE.HRM.API/Core/Entities/Employee.cs`

### Table Structure

#### 1. Basic Information
| Field Name | Data Type | Max Length | Required | Description |
|------------|-----------|------------|----------|-------------|
| `Id` | int | - | Yes | Primary Key (from BaseEntity) |
| `Title` | string | 20 | No | Employee Title (Mr., Mrs., Ms., Dr., Prof., etc.) |
| `FullName` | string | 200 | Yes | Full Name of the employee |
| `NameWithInitials` | string | 100 | Yes | Name with Initials (e.g., J.A. Perera) |
| `FirstName` | string | 100 | Yes | First Name |
| `LastName` | string | 100 | Yes | Last Name |
| `NIC` | string | 20 | Yes | National Identity Card Number (Unique) |
| `DateOfBirth` | DateTime | - | Yes | Birth Day |
| `Division` | string | 100 | Yes | Employee Division |
| `Designation` | string | 100 | Yes | Employee Designation/Position |
| `Grade` | string | 50 | No | Employee Grade |
| `CivilStatus` | string | 20 | Yes | Civil Status (Single, Married, Divorced, Widowed) |

#### 2. Address Information
| Field Name | Data Type | Max Length | Required | Description |
|------------|-----------|------------|----------|-------------|
| `PermanentAddressLine1` | string | 200 | Yes | Permanent Address Line 1 |
| `PermanentAddressLine2` | string | 200 | No | Permanent Address Line 2 |
| `PermanentTown` | string | 100 | Yes | Permanent Address Town |
| `TemporaryAddressLine1` | string | 200 | No | Temporary Address Line 1 |
| `TemporaryAddressLine2` | string | 200 | No | Temporary Address Line 2 |
| `TemporaryTown` | string | 100 | No | Temporary Address Town |

#### 3. Contact Information
| Field Name | Data Type | Max Length | Required | Description |
|------------|-----------|------------|----------|-------------|
| `MobileNumber` | string | 20 | Yes | Personal Mobile Number |
| `PhoneNumber` | string | 20 | No | Official Phone Number |
| `EmailAddress` | string | 100 | Yes | Email Address (Unique, with Email validation) |

#### 4. Educational Background
| Field Name | Data Type | Max Length | Required | Description |
|------------|-----------|------------|----------|-------------|
| `GCEOLDetails` | string | - | No | GCE O/L Examination Details (JSON format) |
| `GCEALDetails` | string | - | No | GCE A/L Examination Details (JSON format) |
| `HigherStudiesDetails` | string | - | No | Higher Studies Details (JSON format) |

**Educational Details JSON Structure Example:**
```json
{
  "GCEOLDetails": {
    "year": "2010",
    "school": "ABC College",
    "subjects": [
      {"subject": "Mathematics", "grade": "A"},
      {"subject": "Science", "grade": "B"},
      {"subject": "English", "grade": "A"}
    ],
    "attempts": 1
  },
  "GCEALDetails": {
    "year": "2012",
    "school": "ABC College", 
    "stream": "Physical Science",
    "subjects": [
      {"subject": "Combined Mathematics", "grade": "A"},
      {"subject": "Physics", "grade": "B"},
      {"subject": "Chemistry", "grade": "A"}
    ],
    "zscore": 1.8456
  },
  "HigherStudiesDetails": [
    {
      "degree": "Bachelor of Science in Computer Science",
      "institution": "University of Colombo",
      "year": "2016",
      "grade": "Second Class Upper Division",
      "gpa": 3.45
    }
  ]
}
```

#### 5. Employment Details
| Field Name | Data Type | Max Length | Required | Description |
|------------|-----------|------------|----------|-------------|
| `TypeOfEmployment` | string | 50 | Yes | Type of Employment (Permanent, Contract, Casual) |
| `EmploymentStatus` | EmploymentStatus Enum | - | Yes | Current Employment Status |
| `DateOfPermanent` | DateTime | - | No | Date when employee became permanent |
| `JoinDateContract` | DateTime | - | No | Join Date for Contract employees |
| `JoinDateCasual` | DateTime | - | No | Join Date for Casual employees |
| `EmployeeNumber` | string | 50 | Yes | Employee Number (Unique identifier) |

#### 6. Additional Information
| Field Name | Data Type | Max Length | Required | Description |
|------------|-----------|------------|----------|-------------|
| `Gender` | string | 10 | No | Gender |
| `Nationality` | string | 50 | No | Nationality |
| `BloodGroup` | string | 5 | No | Blood Group |
| `ProfilePicture` | string | - | No | Employee Profile Picture path/URL |
| `Status` | EmployeeStatus Enum | - | Yes | Employee Status (Active, Inactive, etc.) |
| `Department` | string | 100 | No | Department/Branch |
| `ReportingManagerId` | int | - | No | Foreign Key to reporting manager |
| `BasicSalary` | decimal | - | No | Basic salary amount (Precision: 18,2) |
| `Notes` | string | - | No | Additional notes or comments |

#### 7. Audit Information (From BaseEntity)
| Field Name | Data Type | Required | Description |
|------------|-----------|----------|-------------|
| `CreatedAt` | DateTime | Yes | Record creation timestamp |
| `UpdatedAt` | DateTime | No | Last update timestamp |
| `CreatedBy` | string | No | User who created the record |
| `UpdatedBy` | string | No | User who last updated the record |
| `IsDeleted` | bool | Yes | Soft delete flag |

## Enums

### EmploymentStatus
```csharp
public enum EmploymentStatus
{
    Active = 1,
    OnLeave = 2,
    Suspended = 3,
    Retired = 4,
    Terminated = 5
}
```

### EmployeeStatus
```csharp
public enum EmployeeStatus
{
    Active = 1,
    Inactive = 2,
    OnProbation = 3,
    OnLeave = 4,
    Suspended = 5,
    Terminated = 6,
    Retired = 7
}
```

## Database Relationships

### Self-Referencing Relationship
- **Employee** → **ReportingManager** (Employee)
  - One-to-Many relationship for organizational hierarchy
  - Foreign Key: `ReportingManagerId`
  - Delete Behavior: Restrict (prevents cascading deletes)

### Related Entities
- **Employee** → **MedicalRequests** (One-to-Many)
  - Foreign Key: `EmployeeId` in MedicalRequest table
  - Delete Behavior: Cascade

## Indexes for Performance

### Unique Indexes
- `EmployeeNumber` (Unique)
- `NIC` (Unique)
- `EmailAddress` (Unique)

### Regular Indexes
- `FullName`
- `Division`
- `Designation`
- `Status`
- `TypeOfEmployment`
- `Department`

## Data Transfer Objects (DTOs)

### Response DTOs
- **EmployeeDto**: Complete employee information for detailed views
- **EmployeeSummaryDto**: Basic employee information for lists and summaries

### Request DTOs
- **CreateEmployeeDto**: For creating new employee records
- **UpdateEmployeeDto**: For updating existing employee records
- **EmployeeSearchDto**: For searching and filtering employees

## File Locations

```
backend/SLBFE.HRM.API/
├── Core/
│   ├── Entities/
│   │   ├── BaseEntity.cs
│   │   └── Employee.cs
│   └── Enums/
│       └── Enums.cs
├── Application/
│   └── DTOs/
│       ├── Request/
│       │   └── EmployeeRequestDto.cs
│       └── Response/
│           └── EmployeeDto.cs
└── Infrastructure/
    └── Data/
        └── Context/
            └── ApplicationDbContext.cs
```

## Next Steps

1. **Create Migration**: Generate Entity Framework migration for the Employee table
   ```bash
   dotnet ef migrations add CreateEmployeeTable
   ```

2. **Update Database**: Apply the migration to create the table
   ```bash
   dotnet ef database update
   ```

3. **Create Services**: Implement Employee service interfaces and implementations
4. **Create Controllers**: Implement Employee API controllers
5. **Add Validation**: Implement FluentValidation rules for Employee DTOs
6. **Add Tests**: Create unit and integration tests for Employee functionality

## Security Considerations

1. **Personal Data**: Employee data contains sensitive personal information - ensure proper access controls
2. **GDPR Compliance**: Consider data retention policies and right to be forgotten
3. **Audit Trail**: All employee data changes should be logged for compliance
4. **Access Control**: Implement role-based access for different employee operations

## Data Migration Notes

- When migrating existing employee data, ensure proper data validation
- Consider creating a data seeding script for initial employee records
- Backup existing data before running migrations in production
- Plan for data transformation if migrating from legacy systems

---

**Document Version**: 1.0  
**Created**: January 21, 2026  
**Last Updated**: January 21, 2026