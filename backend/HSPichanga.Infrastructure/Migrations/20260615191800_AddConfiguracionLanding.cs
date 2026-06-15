using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace HSPichanga.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddConfiguracionLanding : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                schema: "public",
                table: "HorariosDisponibles",
                keyColumn: "Id",
                keyValue: new Guid("50d0aa3a-97a7-4d0a-b566-1d1a548c3570"));

            migrationBuilder.DeleteData(
                schema: "public",
                table: "HorariosDisponibles",
                keyColumn: "Id",
                keyValue: new Guid("7a545db3-44c3-4b9e-994a-d6b938cf7c42"));

            migrationBuilder.DeleteData(
                schema: "public",
                table: "HorariosDisponibles",
                keyColumn: "Id",
                keyValue: new Guid("94667ebe-1e86-4596-a1ea-88c6ef0ec3f3"));

            migrationBuilder.DeleteData(
                schema: "public",
                table: "HorariosDisponibles",
                keyColumn: "Id",
                keyValue: new Guid("a3f1bbc8-faed-4fa1-83bf-02400b98bfc5"));

            migrationBuilder.CreateTable(
                name: "ConfiguracionesLanding",
                schema: "public",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Clave = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    Valor = table.Column<string>(type: "text", nullable: true),
                    UltimaActualizacion = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ConfiguracionesLanding", x => x.Id);
                });

            migrationBuilder.UpdateData(
                schema: "public",
                table: "Canchas",
                keyColumn: "Id",
                keyValue: new Guid("cccccccc-cccc-cccc-cccc-cccccccccccc"),
                column: "FotosUrls",
                value: new List<string>());

            migrationBuilder.InsertData(
                schema: "public",
                table: "HorariosDisponibles",
                columns: new[] { "Id", "Activo", "CanchaId", "DiaSemana", "HoraFin", "HoraInicio" },
                values: new object[,]
                {
                    { new Guid("031a1e70-3b18-4fed-9350-b2c02549e918"), true, new Guid("cccccccc-cccc-cccc-cccc-cccccccccccc"), 3, new TimeSpan(0, 20, 0, 0, 0), new TimeSpan(0, 18, 0, 0, 0) },
                    { new Guid("0d4ea2e8-9eff-48f8-8281-d68238e40213"), true, new Guid("cccccccc-cccc-cccc-cccc-cccccccccccc"), 5, new TimeSpan(0, 20, 0, 0, 0), new TimeSpan(0, 18, 0, 0, 0) },
                    { new Guid("5b561e84-e35c-44d9-a34d-c0670f9610d3"), true, new Guid("cccccccc-cccc-cccc-cccc-cccccccccccc"), 6, new TimeSpan(0, 12, 0, 0, 0), new TimeSpan(0, 10, 0, 0, 0) },
                    { new Guid("802a7b26-89d4-46a9-be51-65718729bace"), true, new Guid("cccccccc-cccc-cccc-cccc-cccccccccccc"), 1, new TimeSpan(0, 20, 0, 0, 0), new TimeSpan(0, 18, 0, 0, 0) }
                });

            migrationBuilder.UpdateData(
                schema: "public",
                table: "Usuarios",
                keyColumn: "Id",
                keyValue: new Guid("aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa"),
                column: "PasswordHash",
                value: "$2a$11$mhAJoAcvSDxEteh4efafsO/6ISxc6KnYtJ5zmH4USlNsI99WO6SiC");

            migrationBuilder.CreateIndex(
                name: "IX_ConfiguracionesLanding_Clave",
                schema: "public",
                table: "ConfiguracionesLanding",
                column: "Clave",
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "ConfiguracionesLanding",
                schema: "public");

            migrationBuilder.DeleteData(
                schema: "public",
                table: "HorariosDisponibles",
                keyColumn: "Id",
                keyValue: new Guid("031a1e70-3b18-4fed-9350-b2c02549e918"));

            migrationBuilder.DeleteData(
                schema: "public",
                table: "HorariosDisponibles",
                keyColumn: "Id",
                keyValue: new Guid("0d4ea2e8-9eff-48f8-8281-d68238e40213"));

            migrationBuilder.DeleteData(
                schema: "public",
                table: "HorariosDisponibles",
                keyColumn: "Id",
                keyValue: new Guid("5b561e84-e35c-44d9-a34d-c0670f9610d3"));

            migrationBuilder.DeleteData(
                schema: "public",
                table: "HorariosDisponibles",
                keyColumn: "Id",
                keyValue: new Guid("802a7b26-89d4-46a9-be51-65718729bace"));

            migrationBuilder.UpdateData(
                schema: "public",
                table: "Canchas",
                keyColumn: "Id",
                keyValue: new Guid("cccccccc-cccc-cccc-cccc-cccccccccccc"),
                column: "FotosUrls",
                value: new List<string>());

            migrationBuilder.InsertData(
                schema: "public",
                table: "HorariosDisponibles",
                columns: new[] { "Id", "Activo", "CanchaId", "DiaSemana", "HoraFin", "HoraInicio" },
                values: new object[,]
                {
                    { new Guid("50d0aa3a-97a7-4d0a-b566-1d1a548c3570"), true, new Guid("cccccccc-cccc-cccc-cccc-cccccccccccc"), 5, new TimeSpan(0, 20, 0, 0, 0), new TimeSpan(0, 18, 0, 0, 0) },
                    { new Guid("7a545db3-44c3-4b9e-994a-d6b938cf7c42"), true, new Guid("cccccccc-cccc-cccc-cccc-cccccccccccc"), 1, new TimeSpan(0, 20, 0, 0, 0), new TimeSpan(0, 18, 0, 0, 0) },
                    { new Guid("94667ebe-1e86-4596-a1ea-88c6ef0ec3f3"), true, new Guid("cccccccc-cccc-cccc-cccc-cccccccccccc"), 6, new TimeSpan(0, 12, 0, 0, 0), new TimeSpan(0, 10, 0, 0, 0) },
                    { new Guid("a3f1bbc8-faed-4fa1-83bf-02400b98bfc5"), true, new Guid("cccccccc-cccc-cccc-cccc-cccccccccccc"), 3, new TimeSpan(0, 20, 0, 0, 0), new TimeSpan(0, 18, 0, 0, 0) }
                });

            migrationBuilder.UpdateData(
                schema: "public",
                table: "Usuarios",
                keyColumn: "Id",
                keyValue: new Guid("aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa"),
                column: "PasswordHash",
                value: "$2a$11$jyN9f7vhGGd8YS/Z2C7g8ulWoTURVofdSMTjBHqCQLrS5ZZxYaoSu");
        }
    }
}
