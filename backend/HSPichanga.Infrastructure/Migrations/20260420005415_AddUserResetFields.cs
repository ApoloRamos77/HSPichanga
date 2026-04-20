using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace HSPichanga.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddUserResetFields : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                schema: "public",
                table: "HorariosDisponibles",
                keyColumn: "Id",
                keyValue: new Guid("188e99dd-8f39-4d66-b329-5b76a00673ed"));

            migrationBuilder.DeleteData(
                schema: "public",
                table: "HorariosDisponibles",
                keyColumn: "Id",
                keyValue: new Guid("6acc4d9d-3f5a-4ddd-bcad-be9d608aa565"));

            migrationBuilder.DeleteData(
                schema: "public",
                table: "HorariosDisponibles",
                keyColumn: "Id",
                keyValue: new Guid("93dfb3d8-8978-43f0-97f7-ad5e48bff678"));

            migrationBuilder.DeleteData(
                schema: "public",
                table: "HorariosDisponibles",
                keyColumn: "Id",
                keyValue: new Guid("ed536a01-a5c4-4e3d-b0dc-ac7013274f33"));

            migrationBuilder.AddColumn<string>(
                name: "ResetToken",
                schema: "public",
                table: "Usuarios",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "ResetTokenExpiry",
                schema: "public",
                table: "Usuarios",
                type: "timestamp with time zone",
                nullable: true);

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
                    { new Guid("4f6a32be-cecd-4ff1-ab48-810fd05468c0"), true, new Guid("cccccccc-cccc-cccc-cccc-cccccccccccc"), 5, new TimeSpan(0, 20, 0, 0, 0), new TimeSpan(0, 18, 0, 0, 0) },
                    { new Guid("509be1ea-eb12-4f94-96a1-fc15c2f58bf2"), true, new Guid("cccccccc-cccc-cccc-cccc-cccccccccccc"), 3, new TimeSpan(0, 20, 0, 0, 0), new TimeSpan(0, 18, 0, 0, 0) },
                    { new Guid("9256cede-6608-4c3e-8e6b-b7c6d056fc96"), true, new Guid("cccccccc-cccc-cccc-cccc-cccccccccccc"), 1, new TimeSpan(0, 20, 0, 0, 0), new TimeSpan(0, 18, 0, 0, 0) },
                    { new Guid("b15216f5-2e2a-46a0-a258-94ae42a76507"), true, new Guid("cccccccc-cccc-cccc-cccc-cccccccccccc"), 6, new TimeSpan(0, 12, 0, 0, 0), new TimeSpan(0, 10, 0, 0, 0) }
                });

            migrationBuilder.UpdateData(
                schema: "public",
                table: "Usuarios",
                keyColumn: "Id",
                keyValue: new Guid("aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa"),
                columns: new[] { "PasswordHash", "ResetToken", "ResetTokenExpiry" },
                values: new object[] { "$2a$11$l31qKQXfHsXrnxirix03fODiAAJReaZWSMFF2ICAWmIa0rqkshptS", null, null });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                schema: "public",
                table: "HorariosDisponibles",
                keyColumn: "Id",
                keyValue: new Guid("4f6a32be-cecd-4ff1-ab48-810fd05468c0"));

            migrationBuilder.DeleteData(
                schema: "public",
                table: "HorariosDisponibles",
                keyColumn: "Id",
                keyValue: new Guid("509be1ea-eb12-4f94-96a1-fc15c2f58bf2"));

            migrationBuilder.DeleteData(
                schema: "public",
                table: "HorariosDisponibles",
                keyColumn: "Id",
                keyValue: new Guid("9256cede-6608-4c3e-8e6b-b7c6d056fc96"));

            migrationBuilder.DeleteData(
                schema: "public",
                table: "HorariosDisponibles",
                keyColumn: "Id",
                keyValue: new Guid("b15216f5-2e2a-46a0-a258-94ae42a76507"));

            migrationBuilder.DropColumn(
                name: "ResetToken",
                schema: "public",
                table: "Usuarios");

            migrationBuilder.DropColumn(
                name: "ResetTokenExpiry",
                schema: "public",
                table: "Usuarios");

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
                    { new Guid("188e99dd-8f39-4d66-b329-5b76a00673ed"), true, new Guid("cccccccc-cccc-cccc-cccc-cccccccccccc"), 3, new TimeSpan(0, 20, 0, 0, 0), new TimeSpan(0, 18, 0, 0, 0) },
                    { new Guid("6acc4d9d-3f5a-4ddd-bcad-be9d608aa565"), true, new Guid("cccccccc-cccc-cccc-cccc-cccccccccccc"), 1, new TimeSpan(0, 20, 0, 0, 0), new TimeSpan(0, 18, 0, 0, 0) },
                    { new Guid("93dfb3d8-8978-43f0-97f7-ad5e48bff678"), true, new Guid("cccccccc-cccc-cccc-cccc-cccccccccccc"), 5, new TimeSpan(0, 20, 0, 0, 0), new TimeSpan(0, 18, 0, 0, 0) },
                    { new Guid("ed536a01-a5c4-4e3d-b0dc-ac7013274f33"), true, new Guid("cccccccc-cccc-cccc-cccc-cccccccccccc"), 6, new TimeSpan(0, 12, 0, 0, 0), new TimeSpan(0, 10, 0, 0, 0) }
                });

            migrationBuilder.UpdateData(
                schema: "public",
                table: "Usuarios",
                keyColumn: "Id",
                keyValue: new Guid("aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa"),
                column: "PasswordHash",
                value: "$2a$11$G20LFYTfjUvzsvqBEo8LeuvYSNFrVGGsF/g4iIDYAuaehQ6AElz9q");
        }
    }
}
