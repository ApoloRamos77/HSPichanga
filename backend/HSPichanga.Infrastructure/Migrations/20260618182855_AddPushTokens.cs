using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace HSPichanga.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddPushTokens : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
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

            migrationBuilder.CreateTable(
                name: "PushTokens",
                schema: "public",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    UsuarioId = table.Column<Guid>(type: "uuid", nullable: false),
                    Token = table.Column<string>(type: "text", nullable: false),
                    FechaActualizacion = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PushTokens", x => x.Id);
                    table.ForeignKey(
                        name: "FK_PushTokens_Usuarios_UsuarioId",
                        column: x => x.UsuarioId,
                        principalSchema: "public",
                        principalTable: "Usuarios",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
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
                    { new Guid("2233ad99-6f1f-4dda-9700-47749680ec67"), true, new Guid("cccccccc-cccc-cccc-cccc-cccccccccccc"), 6, new TimeSpan(0, 12, 0, 0, 0), new TimeSpan(0, 10, 0, 0, 0) },
                    { new Guid("9c1c9ae8-106f-44b1-8b04-7cfc596783ef"), true, new Guid("cccccccc-cccc-cccc-cccc-cccccccccccc"), 5, new TimeSpan(0, 20, 0, 0, 0), new TimeSpan(0, 18, 0, 0, 0) },
                    { new Guid("a65c8980-4873-4c99-99fa-83a39f1a699b"), true, new Guid("cccccccc-cccc-cccc-cccc-cccccccccccc"), 3, new TimeSpan(0, 20, 0, 0, 0), new TimeSpan(0, 18, 0, 0, 0) },
                    { new Guid("dab03275-e86a-4ee2-a28c-4f1920ce2668"), true, new Guid("cccccccc-cccc-cccc-cccc-cccccccccccc"), 1, new TimeSpan(0, 20, 0, 0, 0), new TimeSpan(0, 18, 0, 0, 0) }
                });

            migrationBuilder.UpdateData(
                schema: "public",
                table: "Usuarios",
                keyColumn: "Id",
                keyValue: new Guid("aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa"),
                column: "PasswordHash",
                value: "$2a$11$yPnvSGUVCG7fWCnyWlnol.jNJG6QsOAKf4SXop/BCOQiAL1FqxmBu");

            migrationBuilder.CreateIndex(
                name: "IX_PushTokens_UsuarioId",
                schema: "public",
                table: "PushTokens",
                column: "UsuarioId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "PushTokens",
                schema: "public");

            migrationBuilder.DeleteData(
                schema: "public",
                table: "HorariosDisponibles",
                keyColumn: "Id",
                keyValue: new Guid("2233ad99-6f1f-4dda-9700-47749680ec67"));

            migrationBuilder.DeleteData(
                schema: "public",
                table: "HorariosDisponibles",
                keyColumn: "Id",
                keyValue: new Guid("9c1c9ae8-106f-44b1-8b04-7cfc596783ef"));

            migrationBuilder.DeleteData(
                schema: "public",
                table: "HorariosDisponibles",
                keyColumn: "Id",
                keyValue: new Guid("a65c8980-4873-4c99-99fa-83a39f1a699b"));

            migrationBuilder.DeleteData(
                schema: "public",
                table: "HorariosDisponibles",
                keyColumn: "Id",
                keyValue: new Guid("dab03275-e86a-4ee2-a28c-4f1920ce2668"));

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
        }
    }
}
