using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore.Migrations;

namespace MonadicComponents.Migrations
{
    public partial class SpecChange_20170711211930 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Attachment",
                table: "Course",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "Course_AttachmentData",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    Content = table.Column<string>(nullable: true),
                    ContentType = table.Column<string>(nullable: true),
                    CourseId = table.Column<int>(nullable: false),
                    FileName = table.Column<string>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Course_AttachmentData", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Course_AttachmentData_Course_CourseId",
                        column: x => x.CourseId,
                        principalTable: "Course",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Course_AttachmentData_CourseId",
                table: "Course_AttachmentData",
                column: "CourseId",
                unique: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Course_AttachmentData");

            migrationBuilder.DropColumn(
                name: "Attachment",
                table: "Course");
        }
    }
}
