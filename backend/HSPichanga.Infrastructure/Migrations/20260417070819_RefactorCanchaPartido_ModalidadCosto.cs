using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace HSPichanga.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class RefactorCanchaPartido_ModalidadCosto : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                schema: "public",
                table: "HorariosDisponibles",
                keyColumn: "Id",
                keyValue: new Guid("1c7aef4f-2c38-4d2d-82b9-912db04703bd"));

            migrationBuilder.DeleteData(
                schema: "public",
                table: "HorariosDisponibles",
                keyColumn: "Id",
                keyValue: new Guid("35e854bc-f83a-440e-b489-c92e6bca39d5"));

            migrationBuilder.DeleteData(
                schema: "public",
                table: "HorariosDisponibles",
                keyColumn: "Id",
                keyValue: new Guid("7619dceb-27b3-4a13-be5b-0df186e033b7"));

            migrationBuilder.DeleteData(
                schema: "public",
                table: "HorariosDisponibles",
                keyColumn: "Id",
                keyValue: new Guid("b64076d0-bd17-4ba6-be98-f156e94c8009"));

            migrationBuilder.DropColumn(
                name: "CostoTotal",
                schema: "public",
                table: "Canchas");

            migrationBuilder.DropColumn(
                name: "JugadoresRequeridos",
                schema: "public",
                table: "Canchas");

            migrationBuilder.DropColumn(
                name: "Modalidad",
                schema: "public",
                table: "Canchas");

            migrationBuilder.AddColumn<decimal>(
                name: "CostoTotal",
                schema: "public",
                table: "Partidos",
                type: "numeric(10,2)",
                nullable: false,
                defaultValue: 0m);

            migrationBuilder.AddColumn<int>(
                name: "Modalidad",
                schema: "public",
                table: "Partidos",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AlterColumn<int>(
                name: "EstadoCancha",
                schema: "public",
                table: "Canchas",
                type: "integer",
                nullable: false,
                oldClrType: typeof(int),
                oldType: "integer",
                oldDefaultValue: 1);

            migrationBuilder.AddColumn<List<string>>(
                name: "FotosUrls",
                schema: "public",
                table: "Canchas",
                type: "text[]",
                nullable: false,
                defaultValue: new string[0]);

            migrationBuilder.AddColumn<string>(
                name: "UbicacionGoogleMaps",
                schema: "public",
                table: "Canchas",
                type: "character varying(1000)",
                maxLength: 1000,
                nullable: true);

            migrationBuilder.UpdateData(
                schema: "public",
                table: "Canchas",
                keyColumn: "Id",
                keyValue: new Guid("cccccccc-cccc-cccc-cccc-cccccccccccc"),
                columns: new[] { "FotosUrls", "UbicacionGoogleMaps" },
                values: new object[] { new List<string>(), null });

            migrationBuilder.InsertData(
                schema: "public",
                table: "HorariosDisponibles",
                columns: new[] { "Id", "Activo", "CanchaId", "DiaSemana", "HoraFin", "HoraInicio" },
                values: new object[,]
                {
                    { new Guid("5d034939-838b-41ae-af49-c9c26c2560a2"), true, new Guid("cccccccc-cccc-cccc-cccc-cccccccccccc"), 6, new TimeSpan(0, 12, 0, 0, 0), new TimeSpan(0, 10, 0, 0, 0) },
                    { new Guid("80889f87-f857-4831-a7dd-8ee1fc9a7d30"), true, new Guid("cccccccc-cccc-cccc-cccc-cccccccccccc"), 5, new TimeSpan(0, 20, 0, 0, 0), new TimeSpan(0, 18, 0, 0, 0) },
                    { new Guid("a5a116b2-2846-479e-803d-dc5160df69ea"), true, new Guid("cccccccc-cccc-cccc-cccc-cccccccccccc"), 3, new TimeSpan(0, 20, 0, 0, 0), new TimeSpan(0, 18, 0, 0, 0) },
                    { new Guid("f4302053-1ec1-474e-a7b4-6e83c2786ca8"), true, new Guid("cccccccc-cccc-cccc-cccc-cccccccccccc"), 1, new TimeSpan(0, 20, 0, 0, 0), new TimeSpan(0, 18, 0, 0, 0) }
                });

            migrationBuilder.UpdateData(
                schema: "public",
                table: "Usuarios",
                keyColumn: "Id",
                keyValue: new Guid("aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa"),
                column: "PasswordHash",
                value: "$2a$11$6nVQ8ObGQOnd6qGORMDhXOt6IH2bmEgfvp.bscT5yZA4ODyrI1sR.");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                schema: "public",
                table: "HorariosDisponibles",
                keyColumn: "Id",
                keyValue: new Guid("5d034939-838b-41ae-af49-c9c26c2560a2"));

            migrationBuilder.DeleteData(
                schema: "public",
                table: "HorariosDisponibles",
                keyColumn: "Id",
                keyValue: new Guid("80889f87-f857-4831-a7dd-8ee1fc9a7d30"));

            migrationBuilder.DeleteData(
                schema: "public",
                table: "HorariosDisponibles",
                keyColumn: "Id",
                keyValue: new Guid("a5a116b2-2846-479e-803d-dc5160df69ea"));

            migrationBuilder.DeleteData(
                schema: "public",
                table: "HorariosDisponibles",
                keyColumn: "Id",
                keyValue: new Guid("f4302053-1ec1-474e-a7b4-6e83c2786ca8"));

            migrationBuilder.DropColumn(
                name: "CostoTotal",
                schema: "public",
                table: "Partidos");

            migrationBuilder.DropColumn(
                name: "Modalidad",
                schema: "public",
                table: "Partidos");

            migrationBuilder.DropColumn(
                name: "FotosUrls",
                schema: "public",
                table: "Canchas");

            migrationBuilder.DropColumn(
                name: "UbicacionGoogleMaps",
                schema: "public",
                table: "Canchas");

            migrationBuilder.AlterColumn<int>(
                name: "EstadoCancha",
                schema: "public",
                table: "Canchas",
                type: "integer",
                nullable: false,
                defaultValue: 1,
                oldClrType: typeof(int),
                oldType: "integer");

            migrationBuilder.AddColumn<decimal>(
                name: "CostoTotal",
                schema: "public",
                table: "Canchas",
                type: "numeric(10,2)",
                nullable: false,
                defaultValue: 0m);

            migrationBuilder.AddColumn<int>(
                name: "JugadoresRequeridos",
                schema: "public",
                table: "Canchas",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "Modalidad",
                schema: "public",
                table: "Canchas",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.UpdateData(
                schema: "public",
                table: "Canchas",
                keyColumn: "Id",
                keyValue: new Guid("cccccccc-cccc-cccc-cccc-cccccccccccc"),
                columns: new[] { "CostoTotal", "JugadoresRequeridos", "Modalidad" },
                values: new object[] { 280.00m, 14, 2 });

            migrationBuilder.InsertData(
                schema: "public",
                table: "HorariosDisponibles",
                columns: new[] { "Id", "Activo", "CanchaId", "DiaSemana", "HoraFin", "HoraInicio" },
                values: new object[,]
                {
                    { new Guid("1c7aef4f-2c38-4d2d-82b9-912db04703bd"), true, new Guid("cccccccc-cccc-cccc-cccc-cccccccccccc"), 6, new TimeSpan(0, 12, 0, 0, 0), new TimeSpan(0, 10, 0, 0, 0) },
                    { new Guid("35e854bc-f83a-440e-b489-c92e6bca39d5"), true, new Guid("cccccccc-cccc-cccc-cccc-cccccccccccc"), 5, new TimeSpan(0, 20, 0, 0, 0), new TimeSpan(0, 18, 0, 0, 0) },
                    { new Guid("7619dceb-27b3-4a13-be5b-0df186e033b7"), true, new Guid("cccccccc-cccc-cccc-cccc-cccccccccccc"), 1, new TimeSpan(0, 20, 0, 0, 0), new TimeSpan(0, 18, 0, 0, 0) },
                    { new Guid("b64076d0-bd17-4ba6-be98-f156e94c8009"), true, new Guid("cccccccc-cccc-cccc-cccc-cccccccccccc"), 3, new TimeSpan(0, 20, 0, 0, 0), new TimeSpan(0, 18, 0, 0, 0) }
                });

            migrationBuilder.UpdateData(
                schema: "public",
                table: "Usuarios",
                keyColumn: "Id",
                keyValue: new Guid("aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa"),
                column: "PasswordHash",
                value: "$2a$11$uQN3rv6/PtDi6FT8pKekdeQYsTUhiUTNxIrIpxTaumz5r1eZtm0iC");
        }
    }
}
