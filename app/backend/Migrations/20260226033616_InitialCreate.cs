using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace Parabolica.Api.Migrations
{
    /// <inheritdoc />
    public partial class InitialCreate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "nascar_race_list_basic_year",
                columns: table => new
                {
                    Year = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    PulledAtUtc = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    RawJson = table.Column<string>(type: "jsonb", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_nascar_race_list_basic_year", x => x.Year);
                });

            migrationBuilder.CreateTable(
                name: "nascar_weekend_feed",
                columns: table => new
                {
                    Id = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Year = table.Column<int>(type: "integer", nullable: false),
                    SeriesId = table.Column<int>(type: "integer", nullable: false),
                    RaceId = table.Column<int>(type: "integer", nullable: false),
                    PulledAtUtc = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    RawJson = table.Column<string>(type: "jsonb", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_nascar_weekend_feed", x => x.Id);
                });

            migrationBuilder.CreateIndex(
                name: "IX_nascar_weekend_feed_Year_SeriesId_RaceId",
                table: "nascar_weekend_feed",
                columns: new[] { "Year", "SeriesId", "RaceId" },
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "nascar_race_list_basic_year");

            migrationBuilder.DropTable(
                name: "nascar_weekend_feed");
        }
    }
}
