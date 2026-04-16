using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace HSPichanga.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class InitialCreate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.EnsureSchema(
                name: "public");

            migrationBuilder.CreateTable(
                name: "Usuarios",
                schema: "public",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    NombreCompleto = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: false),
                    Email = table.Column<string>(type: "character varying(256)", maxLength: 256, nullable: false),
                    PasswordHash = table.Column<string>(type: "text", nullable: false),
                    Rol = table.Column<int>(type: "integer", nullable: false),
                    Telefono = table.Column<string>(type: "character varying(20)", maxLength: 20, nullable: false),
                    FotoUrl = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: true),
                    Activo = table.Column<bool>(type: "boolean", nullable: false),
                    FechaRegistro = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Usuarios", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Zonas",
                schema: "public",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    Nombre = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    Departamento = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    Activo = table.Column<bool>(type: "boolean", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Zonas", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Clubs",
                schema: "public",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    DelegadoId = table.Column<Guid>(type: "uuid", nullable: false),
                    NombreClub = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: false),
                    LogoUrl = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: true),
                    Activo = table.Column<bool>(type: "boolean", nullable: false),
                    FechaCreacion = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Clubs", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Clubs_Usuarios_DelegadoId",
                        column: x => x.DelegadoId,
                        principalSchema: "public",
                        principalTable: "Usuarios",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "Canchas",
                schema: "public",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    ZonaId = table.Column<Guid>(type: "uuid", nullable: false),
                    Nombre = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: false),
                    Descripcion = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: false),
                    Modalidad = table.Column<int>(type: "integer", nullable: false),
                    JugadoresRequeridos = table.Column<int>(type: "integer", nullable: false),
                    CostoTotal = table.Column<decimal>(type: "numeric(10,2)", nullable: false),
                    Direccion = table.Column<string>(type: "character varying(300)", maxLength: 300, nullable: false),
                    FotoUrl = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: true),
                    TieneLuz = table.Column<bool>(type: "boolean", nullable: false),
                    TieneEstacionamiento = table.Column<bool>(type: "boolean", nullable: false),
                    Activo = table.Column<bool>(type: "boolean", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Canchas", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Canchas_Zonas_ZonaId",
                        column: x => x.ZonaId,
                        principalSchema: "public",
                        principalTable: "Zonas",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "HorariosDisponibles",
                schema: "public",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    CanchaId = table.Column<Guid>(type: "uuid", nullable: false),
                    DiaSemana = table.Column<int>(type: "integer", nullable: false),
                    HoraInicio = table.Column<TimeSpan>(type: "interval", nullable: false),
                    HoraFin = table.Column<TimeSpan>(type: "interval", nullable: false),
                    Activo = table.Column<bool>(type: "boolean", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_HorariosDisponibles", x => x.Id);
                    table.ForeignKey(
                        name: "FK_HorariosDisponibles_Canchas_CanchaId",
                        column: x => x.CanchaId,
                        principalSchema: "public",
                        principalTable: "Canchas",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Partidos",
                schema: "public",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    CanchaId = table.Column<Guid>(type: "uuid", nullable: false),
                    HorarioId = table.Column<Guid>(type: "uuid", nullable: false),
                    OrganizadorId = table.Column<Guid>(type: "uuid", nullable: false),
                    FechaHora = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    TipoPartido = table.Column<int>(type: "integer", nullable: false),
                    Categoria = table.Column<int>(type: "integer", nullable: false),
                    Estado = table.Column<int>(type: "integer", nullable: false),
                    CuotaIndividual = table.Column<decimal>(type: "numeric(10,2)", nullable: false),
                    TarifaEquipo = table.Column<decimal>(type: "numeric(10,2)", nullable: false),
                    CuposTotales = table.Column<int>(type: "integer", nullable: false),
                    CuposOcupados = table.Column<int>(type: "integer", nullable: false),
                    Notas = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: true),
                    FechaCreacion = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Partidos", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Partidos_Canchas_CanchaId",
                        column: x => x.CanchaId,
                        principalSchema: "public",
                        principalTable: "Canchas",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Partidos_HorariosDisponibles_HorarioId",
                        column: x => x.HorarioId,
                        principalSchema: "public",
                        principalTable: "HorariosDisponibles",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Partidos_Usuarios_OrganizadorId",
                        column: x => x.OrganizadorId,
                        principalSchema: "public",
                        principalTable: "Usuarios",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "Reservas",
                schema: "public",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    PartidoId = table.Column<Guid>(type: "uuid", nullable: false),
                    JugadorId = table.Column<Guid>(type: "uuid", nullable: false),
                    MontoPagado = table.Column<decimal>(type: "numeric(10,2)", nullable: false),
                    EstadoPago = table.Column<int>(type: "integer", nullable: false),
                    FechaReserva = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    CodigoConfirmacion = table.Column<string>(type: "character varying(30)", maxLength: 30, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Reservas", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Reservas_Partidos_PartidoId",
                        column: x => x.PartidoId,
                        principalSchema: "public",
                        principalTable: "Partidos",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Reservas_Usuarios_JugadorId",
                        column: x => x.JugadorId,
                        principalSchema: "public",
                        principalTable: "Usuarios",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.InsertData(
                schema: "public",
                table: "Usuarios",
                columns: new[] { "Id", "Activo", "Email", "FechaRegistro", "FotoUrl", "NombreCompleto", "PasswordHash", "Rol", "Telefono" },
                values: new object[] { new Guid("aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa"), true, "admin@adhsoftsport.com", new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), null, "Administrador ADHSOFT SPORT", "$2a$11$20F8G1LFI.cX2vExxpcLCemnCCb0zxJTADc2qHS2HLwlFCAXXhTGq", 1, "+51999000000" });

            migrationBuilder.InsertData(
                schema: "public",
                table: "Zonas",
                columns: new[] { "Id", "Activo", "Departamento", "Nombre" },
                values: new object[,]
                {
                    { new Guid("11111111-1111-1111-1111-111111111111"), true, "Lima", "Miraflores" },
                    { new Guid("22222222-2222-2222-2222-222222222222"), true, "Lima", "San Isidro" },
                    { new Guid("33333333-3333-3333-3333-333333333333"), true, "Lima", "Surco" },
                    { new Guid("44444444-4444-4444-4444-444444444444"), true, "Lima", "La Molina" },
                    { new Guid("55555555-5555-5555-5555-555555555555"), true, "Lima", "San Borja" }
                });

            migrationBuilder.InsertData(
                schema: "public",
                table: "Canchas",
                columns: new[] { "Id", "Activo", "CostoTotal", "Descripcion", "Direccion", "FotoUrl", "JugadoresRequeridos", "Modalidad", "Nombre", "TieneEstacionamiento", "TieneLuz", "ZonaId" },
                values: new object[] { new Guid("cccccccc-cccc-cccc-cccc-cccccccccccc"), true, 280.00m, "Cancha de grass sintético con iluminación LED profesional", "Av. Larco 1200, Miraflores", null, 14, 2, "Cancha Central ADHSOFT", true, true, new Guid("11111111-1111-1111-1111-111111111111") });

            migrationBuilder.InsertData(
                schema: "public",
                table: "HorariosDisponibles",
                columns: new[] { "Id", "Activo", "CanchaId", "DiaSemana", "HoraFin", "HoraInicio" },
                values: new object[,]
                {
                    { new Guid("05f82304-dd97-4970-abfc-04f963a1ecf1"), true, new Guid("cccccccc-cccc-cccc-cccc-cccccccccccc"), 6, new TimeSpan(0, 12, 0, 0, 0), new TimeSpan(0, 10, 0, 0, 0) },
                    { new Guid("06e359ad-173b-44c8-9c3a-7604b3dc84a3"), true, new Guid("cccccccc-cccc-cccc-cccc-cccccccccccc"), 3, new TimeSpan(0, 20, 0, 0, 0), new TimeSpan(0, 18, 0, 0, 0) },
                    { new Guid("3d500824-64e6-49c3-9d15-ecf2d611f6d2"), true, new Guid("cccccccc-cccc-cccc-cccc-cccccccccccc"), 1, new TimeSpan(0, 20, 0, 0, 0), new TimeSpan(0, 18, 0, 0, 0) },
                    { new Guid("9f904273-3058-476c-8736-620045947b7b"), true, new Guid("cccccccc-cccc-cccc-cccc-cccccccccccc"), 5, new TimeSpan(0, 20, 0, 0, 0), new TimeSpan(0, 18, 0, 0, 0) }
                });

            migrationBuilder.CreateIndex(
                name: "IX_Canchas_ZonaId",
                schema: "public",
                table: "Canchas",
                column: "ZonaId");

            migrationBuilder.CreateIndex(
                name: "IX_Clubs_DelegadoId",
                schema: "public",
                table: "Clubs",
                column: "DelegadoId");

            migrationBuilder.CreateIndex(
                name: "IX_HorariosDisponibles_CanchaId",
                schema: "public",
                table: "HorariosDisponibles",
                column: "CanchaId");

            migrationBuilder.CreateIndex(
                name: "IX_Partidos_CanchaId",
                schema: "public",
                table: "Partidos",
                column: "CanchaId");

            migrationBuilder.CreateIndex(
                name: "IX_Partidos_HorarioId",
                schema: "public",
                table: "Partidos",
                column: "HorarioId");

            migrationBuilder.CreateIndex(
                name: "IX_Partidos_OrganizadorId",
                schema: "public",
                table: "Partidos",
                column: "OrganizadorId");

            migrationBuilder.CreateIndex(
                name: "IX_Reservas_CodigoConfirmacion",
                schema: "public",
                table: "Reservas",
                column: "CodigoConfirmacion",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Reservas_JugadorId",
                schema: "public",
                table: "Reservas",
                column: "JugadorId");

            migrationBuilder.CreateIndex(
                name: "IX_Reservas_PartidoId",
                schema: "public",
                table: "Reservas",
                column: "PartidoId");

            migrationBuilder.CreateIndex(
                name: "IX_Usuarios_Email",
                schema: "public",
                table: "Usuarios",
                column: "Email",
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Clubs",
                schema: "public");

            migrationBuilder.DropTable(
                name: "Reservas",
                schema: "public");

            migrationBuilder.DropTable(
                name: "Partidos",
                schema: "public");

            migrationBuilder.DropTable(
                name: "HorariosDisponibles",
                schema: "public");

            migrationBuilder.DropTable(
                name: "Usuarios",
                schema: "public");

            migrationBuilder.DropTable(
                name: "Canchas",
                schema: "public");

            migrationBuilder.DropTable(
                name: "Zonas",
                schema: "public");
        }
    }
}
