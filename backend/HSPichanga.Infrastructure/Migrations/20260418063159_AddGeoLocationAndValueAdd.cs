using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace HSPichanga.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddGeoLocationAndValueAdd : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
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

            migrationBuilder.AddColumn<double>(
                name: "Latitude",
                schema: "public",
                table: "Canchas",
                type: "double precision",
                nullable: true);

            migrationBuilder.AddColumn<double>(
                name: "Longitude",
                schema: "public",
                table: "Canchas",
                type: "double precision",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "Calificaciones",
                schema: "public",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    CanchaId = table.Column<Guid>(type: "uuid", nullable: false),
                    UsuarioId = table.Column<Guid>(type: "uuid", nullable: false),
                    Puntuacion = table.Column<int>(type: "integer", nullable: false),
                    Comentario = table.Column<string>(type: "text", nullable: true),
                    Fecha = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Calificaciones", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Calificaciones_Canchas_CanchaId",
                        column: x => x.CanchaId,
                        principalSchema: "public",
                        principalTable: "Canchas",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Calificaciones_Usuarios_UsuarioId",
                        column: x => x.UsuarioId,
                        principalSchema: "public",
                        principalTable: "Usuarios",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Mensajes",
                schema: "public",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    PartidoId = table.Column<Guid>(type: "uuid", nullable: false),
                    UsuarioId = table.Column<Guid>(type: "uuid", nullable: false),
                    Contenido = table.Column<string>(type: "text", nullable: false),
                    FechaEnvio = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Mensajes", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Mensajes_Partidos_PartidoId",
                        column: x => x.PartidoId,
                        principalSchema: "public",
                        principalTable: "Partidos",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Mensajes_Usuarios_UsuarioId",
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
                columns: new[] { "CelularPlin", "CelularYape", "FotosUrls", "Latitude", "Longitude" },
                values: new object[] { null, null, new List<string>(), null, null });

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

            migrationBuilder.CreateIndex(
                name: "IX_Calificaciones_CanchaId",
                schema: "public",
                table: "Calificaciones",
                column: "CanchaId");

            migrationBuilder.CreateIndex(
                name: "IX_Calificaciones_UsuarioId",
                schema: "public",
                table: "Calificaciones",
                column: "UsuarioId");

            migrationBuilder.CreateIndex(
                name: "IX_Mensajes_PartidoId",
                schema: "public",
                table: "Mensajes",
                column: "PartidoId");

            migrationBuilder.CreateIndex(
                name: "IX_Mensajes_UsuarioId",
                schema: "public",
                table: "Mensajes",
                column: "UsuarioId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Calificaciones",
                schema: "public");

            migrationBuilder.DropTable(
                name: "Mensajes",
                schema: "public");

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

            migrationBuilder.DropColumn(
                name: "CelularPlin",
                schema: "public",
                table: "Canchas");

            migrationBuilder.DropColumn(
                name: "CelularYape",
                schema: "public",
                table: "Canchas");

            migrationBuilder.DropColumn(
                name: "Latitude",
                schema: "public",
                table: "Canchas");

            migrationBuilder.DropColumn(
                name: "Longitude",
                schema: "public",
                table: "Canchas");

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
    }
}
