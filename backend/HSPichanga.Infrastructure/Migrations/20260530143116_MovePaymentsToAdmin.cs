using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace HSPichanga.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class MovePaymentsToAdmin : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                schema: "public",
                table: "HorariosDisponibles",
                keyColumn: "Id",
                keyValue: new Guid("19275eb3-8082-465c-9550-40eb0cfd3e68"));

            migrationBuilder.DeleteData(
                schema: "public",
                table: "HorariosDisponibles",
                keyColumn: "Id",
                keyValue: new Guid("921388e5-f4df-4f1c-b429-9e9eb0a29a31"));

            migrationBuilder.DeleteData(
                schema: "public",
                table: "HorariosDisponibles",
                keyColumn: "Id",
                keyValue: new Guid("dc18829d-1535-467d-9485-8f6ae314ab55"));

            migrationBuilder.DeleteData(
                schema: "public",
                table: "HorariosDisponibles",
                keyColumn: "Id",
                keyValue: new Guid("ee97d804-85a3-4873-ac85-50b8c49e19f7"));

            migrationBuilder.DropColumn(
                name: "CelularPlin",
                schema: "public",
                table: "Canchas");

            migrationBuilder.DropColumn(
                name: "CelularYape",
                schema: "public",
                table: "Canchas");

            migrationBuilder.AddColumn<string>(
                name: "PlinNumero",
                schema: "public",
                table: "Usuarios",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "PlinQrUrl",
                schema: "public",
                table: "Usuarios",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "YapeNumero",
                schema: "public",
                table: "Usuarios",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "YapeQrUrl",
                schema: "public",
                table: "Usuarios",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "EvidenciaPagoUrl",
                schema: "public",
                table: "Reservas",
                type: "text",
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
                    { new Guid("4979616a-5937-4446-9249-6bb35c8e74b5"), true, new Guid("cccccccc-cccc-cccc-cccc-cccccccccccc"), 5, new TimeSpan(0, 20, 0, 0, 0), new TimeSpan(0, 18, 0, 0, 0) },
                    { new Guid("5fbd7d8a-4b82-4bba-8df1-d630f50e6a87"), true, new Guid("cccccccc-cccc-cccc-cccc-cccccccccccc"), 1, new TimeSpan(0, 20, 0, 0, 0), new TimeSpan(0, 18, 0, 0, 0) },
                    { new Guid("9c3517a2-b0bb-4175-ab46-94767f9cbcbc"), true, new Guid("cccccccc-cccc-cccc-cccc-cccccccccccc"), 3, new TimeSpan(0, 20, 0, 0, 0), new TimeSpan(0, 18, 0, 0, 0) },
                    { new Guid("b3f4706e-d19a-4286-a2f2-4fa94e3b3491"), true, new Guid("cccccccc-cccc-cccc-cccc-cccccccccccc"), 6, new TimeSpan(0, 12, 0, 0, 0), new TimeSpan(0, 10, 0, 0, 0) }
                });

            migrationBuilder.UpdateData(
                schema: "public",
                table: "Usuarios",
                keyColumn: "Id",
                keyValue: new Guid("aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa"),
                columns: new[] { "PasswordHash", "PlinNumero", "PlinQrUrl", "YapeNumero", "YapeQrUrl" },
                values: new object[] { "$2a$11$eHay0hh9FoEk0ZJ.WpYlQuZyEjcuSS4a9cTLz4WgQhmdZPBb0g0oy", null, null, null, null });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                schema: "public",
                table: "HorariosDisponibles",
                keyColumn: "Id",
                keyValue: new Guid("4979616a-5937-4446-9249-6bb35c8e74b5"));

            migrationBuilder.DeleteData(
                schema: "public",
                table: "HorariosDisponibles",
                keyColumn: "Id",
                keyValue: new Guid("5fbd7d8a-4b82-4bba-8df1-d630f50e6a87"));

            migrationBuilder.DeleteData(
                schema: "public",
                table: "HorariosDisponibles",
                keyColumn: "Id",
                keyValue: new Guid("9c3517a2-b0bb-4175-ab46-94767f9cbcbc"));

            migrationBuilder.DeleteData(
                schema: "public",
                table: "HorariosDisponibles",
                keyColumn: "Id",
                keyValue: new Guid("b3f4706e-d19a-4286-a2f2-4fa94e3b3491"));

            migrationBuilder.DropColumn(
                name: "PlinNumero",
                schema: "public",
                table: "Usuarios");

            migrationBuilder.DropColumn(
                name: "PlinQrUrl",
                schema: "public",
                table: "Usuarios");

            migrationBuilder.DropColumn(
                name: "YapeNumero",
                schema: "public",
                table: "Usuarios");

            migrationBuilder.DropColumn(
                name: "YapeQrUrl",
                schema: "public",
                table: "Usuarios");

            migrationBuilder.DropColumn(
                name: "EvidenciaPagoUrl",
                schema: "public",
                table: "Reservas");

            migrationBuilder.AddColumn<string>(
                name: "CelularPlin",
                schema: "public",
                table: "Canchas",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "CelularYape",
                schema: "public",
                table: "Canchas",
                type: "text",
                nullable: true);

            migrationBuilder.UpdateData(
                schema: "public",
                table: "Canchas",
                keyColumn: "Id",
                keyValue: new Guid("cccccccc-cccc-cccc-cccc-cccccccccccc"),
                columns: new[] { "CelularPlin", "CelularYape", "FotosUrls" },
                values: new object[] { null, null, new List<string>() });

            migrationBuilder.InsertData(
                schema: "public",
                table: "HorariosDisponibles",
                columns: new[] { "Id", "Activo", "CanchaId", "DiaSemana", "HoraFin", "HoraInicio" },
                values: new object[,]
                {
                    { new Guid("19275eb3-8082-465c-9550-40eb0cfd3e68"), true, new Guid("cccccccc-cccc-cccc-cccc-cccccccccccc"), 3, new TimeSpan(0, 20, 0, 0, 0), new TimeSpan(0, 18, 0, 0, 0) },
                    { new Guid("921388e5-f4df-4f1c-b429-9e9eb0a29a31"), true, new Guid("cccccccc-cccc-cccc-cccc-cccccccccccc"), 1, new TimeSpan(0, 20, 0, 0, 0), new TimeSpan(0, 18, 0, 0, 0) },
                    { new Guid("dc18829d-1535-467d-9485-8f6ae314ab55"), true, new Guid("cccccccc-cccc-cccc-cccc-cccccccccccc"), 6, new TimeSpan(0, 12, 0, 0, 0), new TimeSpan(0, 10, 0, 0, 0) },
                    { new Guid("ee97d804-85a3-4873-ac85-50b8c49e19f7"), true, new Guid("cccccccc-cccc-cccc-cccc-cccccccccccc"), 5, new TimeSpan(0, 20, 0, 0, 0), new TimeSpan(0, 18, 0, 0, 0) }
                });

            migrationBuilder.UpdateData(
                schema: "public",
                table: "Usuarios",
                keyColumn: "Id",
                keyValue: new Guid("aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa"),
                column: "PasswordHash",
                value: "$2a$11$K23CszsfKu2GBc9BXsnhVerUUXMqb0UmnAax/.yL3tCBGDDBi5amK");
        }
    }
}
