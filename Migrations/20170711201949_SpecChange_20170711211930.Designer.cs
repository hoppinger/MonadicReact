using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;
using MonadicComponents.Models;

namespace MonadicComponents.Migrations
{
    [DbContext(typeof(MonadicComponentsContext))]
    [Migration("20170711201949_SpecChange_20170711211930")]
    partial class SpecChange_20170711211930
    {
        protected override void BuildTargetModel(ModelBuilder modelBuilder)
        {
            modelBuilder
                .HasAnnotation("ProductVersion", "1.1.1");

            modelBuilder.Entity("MonadicComponents.Models.Course", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd();

                    b.Property<string>("Attachment");

                    b.Property<DateTime>("CreatedDate");

                    b.Property<string>("Logo");

                    b.Property<string>("Name");

                    b.Property<int>("Points");

                    b.HasKey("Id");

                    b.ToTable("Course");
                });

            modelBuilder.Entity("MonadicComponents.Models.Course_AttachmentData", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd();

                    b.Property<string>("Content");

                    b.Property<string>("ContentType");

                    b.Property<int>("CourseId");

                    b.Property<string>("FileName");

                    b.HasKey("Id");

                    b.HasIndex("CourseId")
                        .IsUnique();

                    b.ToTable("Course_AttachmentData");
                });

            modelBuilder.Entity("MonadicComponents.Models.Course_Lecture", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd();

                    b.Property<int>("CourseId");

                    b.Property<int>("LectureId");

                    b.HasKey("Id");

                    b.HasIndex("CourseId");

                    b.HasIndex("LectureId");

                    b.ToTable("Course_Lecture");
                });

            modelBuilder.Entity("MonadicComponents.Models.HomePage", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd();

                    b.Property<DateTime>("CreatedDate");

                    b.HasKey("Id");

                    b.ToTable("HomePage");
                });

            modelBuilder.Entity("MonadicComponents.Models.Lecture", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd();

                    b.Property<DateTime>("CreatedDate");

                    b.Property<string>("Description");

                    b.Property<string>("Name");

                    b.HasKey("Id");

                    b.ToTable("Lecture");
                });

            modelBuilder.Entity("MonadicComponents.Models.Session", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd();

                    b.Property<string>("AdditionalInfo");

                    b.Property<string>("Content");

                    b.Property<string>("CookieName");

                    b.Property<DateTime>("CreatedAt");

                    b.Property<int?>("LoggedEntityId");

                    b.Property<string>("LoggedEntityName");

                    b.HasKey("Id");

                    b.HasIndex("CookieName");

                    b.HasIndex("CreatedAt");

                    b.HasIndex("LoggedEntityId");

                    b.HasIndex("LoggedEntityName");

                    b.ToTable("Session");
                });

            modelBuilder.Entity("MonadicComponents.Models.Course_AttachmentData", b =>
                {
                    b.HasOne("MonadicComponents.Models.Course", "Course")
                        .WithOne("Course_AttachmentData")
                        .HasForeignKey("MonadicComponents.Models.Course_AttachmentData", "CourseId")
                        .OnDelete(DeleteBehavior.Cascade);
                });

            modelBuilder.Entity("MonadicComponents.Models.Course_Lecture", b =>
                {
                    b.HasOne("MonadicComponents.Models.Course", "Course")
                        .WithMany("Course_Lectures")
                        .HasForeignKey("CourseId")
                        .OnDelete(DeleteBehavior.Cascade);

                    b.HasOne("MonadicComponents.Models.Lecture", "Lecture")
                        .WithMany("Course_Lectures")
                        .HasForeignKey("LectureId")
                        .OnDelete(DeleteBehavior.Cascade);
                });
        }
    }
}
