using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace SLBFE.HRM.API.Migrations
{
    /// <inheritdoc />
    public partial class AddTitleTable : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Titles",
                columns: table => new
                {
                    TitleId = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: false),
                    Description = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    DisplayOrder = table.Column<int>(type: "int", nullable: false),
                    IsActive = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Titles", x => x.TitleId);
                });

            migrationBuilder.InsertData(
                table: "Titles",
                columns: new[] { "TitleId", "Description", "DisplayOrder", "IsActive" },
                values: new object[,]
                {
                    { "DR", "Dr.", 5, true },
                    { "MISS", "Miss", 4, true },
                    { "MR", "Mr.", 1, true },
                    { "MRS", "Mrs.", 2, true },
                    { "MS", "Ms.", 3, true },
                    { "PROF", "Prof.", 6, true },
                    { "REV", "Rev.", 7, true }
                });

            migrationBuilder.CreateIndex(
                name: "IX_Titles_DisplayOrder",
                table: "Titles",
                column: "DisplayOrder");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Titles");
        }
    }
}
