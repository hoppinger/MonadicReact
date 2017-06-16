using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore.Migrations;

namespace MonadicComponents.Migrations
{
    public partial class SpecChange_20170611913420 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Course",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    CreatedDate = table.Column<DateTime>(nullable: false),
                    Name = table.Column<string>(nullable: true),
                    Points = table.Column<int>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Course", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "HomePage",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    CreatedDate = table.Column<DateTime>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_HomePage", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Lecture",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    CreatedDate = table.Column<DateTime>(nullable: false),
                    Description = table.Column<string>(nullable: true),
                    Name = table.Column<string>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Lecture", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Session",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    AdditionalInfo = table.Column<string>(nullable: true),
                    Content = table.Column<string>(nullable: true),
                    CookieName = table.Column<string>(nullable: true),
                    CreatedAt = table.Column<DateTime>(nullable: false),
                    LoggedEntityId = table.Column<int>(nullable: true),
                    LoggedEntityName = table.Column<string>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Session", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Course_Lecture",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    CourseId = table.Column<int>(nullable: false),
                    LectureId = table.Column<int>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Course_Lecture", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Course_Lecture_Course_CourseId",
                        column: x => x.CourseId,
                        principalTable: "Course",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Course_Lecture_Lecture_LectureId",
                        column: x => x.LectureId,
                        principalTable: "Lecture",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Course_Lecture_CourseId",
                table: "Course_Lecture",
                column: "CourseId");

            migrationBuilder.CreateIndex(
                name: "IX_Course_Lecture_LectureId",
                table: "Course_Lecture",
                column: "LectureId");

            migrationBuilder.CreateIndex(
                name: "IX_Session_CookieName",
                table: "Session",
                column: "CookieName");

            migrationBuilder.CreateIndex(
                name: "IX_Session_CreatedAt",
                table: "Session",
                column: "CreatedAt");

            migrationBuilder.CreateIndex(
                name: "IX_Session_LoggedEntityId",
                table: "Session",
                column: "LoggedEntityId");

            migrationBuilder.CreateIndex(
                name: "IX_Session_LoggedEntityName",
                table: "Session",
                column: "LoggedEntityName");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Course_Lecture");

            migrationBuilder.DropTable(
                name: "HomePage");

            migrationBuilder.DropTable(
                name: "Session");

            migrationBuilder.DropTable(
                name: "Course");

            migrationBuilder.DropTable(
                name: "Lecture");
        }
    }
}
