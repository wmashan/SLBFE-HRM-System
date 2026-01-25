using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SLBFE.HRM.API.Migrations
{
    /// <inheritdoc />
    public partial class InitialCreate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Employees",
                columns: table => new
                {
                    EmployeeId = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    TitleId = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: false),
                    FullName = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: false),
                    NameInitials = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    FirstName = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    LastName = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    Nic = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: false),
                    BirthDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    DivisionId = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    DesignationId = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    GradeId = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    CivilStatusId = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: false),
                    PermanentAddressL1 = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: false),
                    PermanentAddressL2 = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: true),
                    PermanentTownId = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    TemporaryAddressL1 = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: true),
                    TemporaryAddressL2 = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: true),
                    TemporaryTownId = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: true),
                    Contact1 = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: false),
                    Contact2 = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: true),
                    Email = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    OL = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    AL = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    HigherStudies = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    EmployeeTypeId = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    PermanentDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    JoinDateContract = table.Column<DateTime>(type: "datetime2", nullable: true),
                    JoinDateCasual = table.Column<DateTime>(type: "datetime2", nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Employees", x => x.EmployeeId);
                });

            migrationBuilder.CreateTable(
                name: "MedicalRequests",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    EmployeeId = table.Column<int>(type: "int", nullable: false),
                    EmployeeNumber = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    Division = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    ApplicantName = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: false),
                    MaritalStatus = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: false),
                    RequestNumber = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    RequestType = table.Column<int>(type: "int", nullable: false),
                    PatientName = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: false),
                    RelationshipToApplicant = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    PatientAge = table.Column<int>(type: "int", nullable: false),
                    MedicalProvider = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: false),
                    DoctorName = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: false),
                    Diagnosis = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: false),
                    TreatmentDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    TreatmentDuration = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: true),
                    RequestedAmount = table.Column<decimal>(type: "decimal(18,2)", precision: 18, scale: 2, nullable: false),
                    ClaimedAmount = table.Column<decimal>(type: "decimal(18,2)", precision: 18, scale: 2, nullable: false),
                    AvailableAmount = table.Column<decimal>(type: "decimal(18,2)", precision: 18, scale: 2, nullable: false),
                    ApprovedAmount = table.Column<decimal>(type: "decimal(18,2)", precision: 18, scale: 2, nullable: true),
                    Status = table.Column<int>(type: "int", nullable: false),
                    Attachments = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    SubmittedDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    ApprovedBy = table.Column<int>(type: "int", nullable: true),
                    ReviewedDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    ApproverComments = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    PaymentDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    PaymentReference = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    RejectionReason = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Description = table.Column<string>(type: "nvarchar(1000)", maxLength: 1000, nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: true),
                    CreatedBy = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    UpdatedBy = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    IsDeleted = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_MedicalRequests", x => x.Id);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Employees_CivilStatusId",
                table: "Employees",
                column: "CivilStatusId");

            migrationBuilder.CreateIndex(
                name: "IX_Employees_DesignationId",
                table: "Employees",
                column: "DesignationId");

            migrationBuilder.CreateIndex(
                name: "IX_Employees_DivisionId",
                table: "Employees",
                column: "DivisionId");

            migrationBuilder.CreateIndex(
                name: "IX_Employees_Email",
                table: "Employees",
                column: "Email",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Employees_EmployeeTypeId",
                table: "Employees",
                column: "EmployeeTypeId");

            migrationBuilder.CreateIndex(
                name: "IX_Employees_FullName",
                table: "Employees",
                column: "FullName");

            migrationBuilder.CreateIndex(
                name: "IX_Employees_GradeId",
                table: "Employees",
                column: "GradeId");

            migrationBuilder.CreateIndex(
                name: "IX_Employees_Nic",
                table: "Employees",
                column: "Nic",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Employees_PermanentTownId",
                table: "Employees",
                column: "PermanentTownId");

            migrationBuilder.CreateIndex(
                name: "IX_Employees_TitleId",
                table: "Employees",
                column: "TitleId");

            migrationBuilder.CreateIndex(
                name: "IX_MedicalRequests_EmployeeId",
                table: "MedicalRequests",
                column: "EmployeeId");

            migrationBuilder.CreateIndex(
                name: "IX_MedicalRequests_RequestNumber",
                table: "MedicalRequests",
                column: "RequestNumber",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_MedicalRequests_Status",
                table: "MedicalRequests",
                column: "Status");

            migrationBuilder.CreateIndex(
                name: "IX_MedicalRequests_SubmittedDate",
                table: "MedicalRequests",
                column: "SubmittedDate");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Employees");

            migrationBuilder.DropTable(
                name: "MedicalRequests");
        }
    }
}
