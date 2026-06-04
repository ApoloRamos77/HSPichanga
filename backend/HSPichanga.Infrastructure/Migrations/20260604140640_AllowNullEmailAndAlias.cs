using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace HSPichanga.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AllowNullEmailAndAlias : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                schema: "public",
                table: "HorariosDisponibles",
                keyColumn: "Id",
                keyValue: new Guid("47dc8669-f76f-402a-be08-9855ce0785aa"));

            migrationBuilder.DeleteData(
                schema: "public",
                table: "HorariosDisponibles",
                keyColumn: "Id",
                keyValue: new Guid("4809b693-af6c-42c5-af4c-6f9b51b581f0"));

            migrationBuilder.DeleteData(
                schema: "public",
                table: "HorariosDisponibles",
                keyColumn: "Id",
                keyValue: new Guid("74608e22-5306-4290-903e-e764fe16763f"));

            migrationBuilder.DeleteData(
                schema: "public",
                table: "HorariosDisponibles",
                keyColumn: "Id",
                keyValue: new Guid("aba92b3d-9a4a-4dfe-b035-ef42ffbeed82"));

            migrationBuilder.AlterColumn<string>(
                name: "Email",
                schema: "public",
                table: "Usuarios",
                type: "character varying(256)",
                maxLength: 256,
                nullable: true,
                oldClrType: typeof(string),
                oldType: "character varying(256)",
                oldMaxLength: 256);

            migrationBuilder.AddColumn<string>(
                name: "Alias",
                schema: "public",
                table: "Usuarios",
                type: "character varying(50)",
                maxLength: 50,
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
                    { new Guid("0ea5dc0c-62f8-4197-954a-05f16430d777"), true, new Guid("cccccccc-cccc-cccc-cccc-cccccccccccc"), 3, new TimeSpan(0, 20, 0, 0, 0), new TimeSpan(0, 18, 0, 0, 0) },
                    { new Guid("2d636ee2-ac33-4c7c-baea-3db4b3ae6f02"), true, new Guid("cccccccc-cccc-cccc-cccc-cccccccccccc"), 5, new TimeSpan(0, 20, 0, 0, 0), new TimeSpan(0, 18, 0, 0, 0) },
                    { new Guid("e6047760-58a1-40a8-9a51-a16cf1069773"), true, new Guid("cccccccc-cccc-cccc-cccc-cccccccccccc"), 1, new TimeSpan(0, 20, 0, 0, 0), new TimeSpan(0, 18, 0, 0, 0) },
                    { new Guid("eacb9788-481e-4e2b-9e48-7d72cdb60383"), true, new Guid("cccccccc-cccc-cccc-cccc-cccccccccccc"), 6, new TimeSpan(0, 12, 0, 0, 0), new TimeSpan(0, 10, 0, 0, 0) }
                });

            migrationBuilder.UpdateData(
                schema: "public",
                table: "Usuarios",
                keyColumn: "Id",
                keyValue: new Guid("aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa"),
                columns: new[] { "Alias", "PasswordHash" },
                values: new object[] { null, "$2a$11$b1y6t9zJFvCx5zo1BdQ2UeHoEP4VZPYr9Jn0VmsRg7nN.u5LxlQ9u" });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                schema: "public",
                table: "HorariosDisponibles",
                keyColumn: "Id",
                keyValue: new Guid("0ea5dc0c-62f8-4197-954a-05f16430d777"));

            migrationBuilder.DeleteData(
                schema: "public",
                table: "HorariosDisponibles",
                keyColumn: "Id",
                keyValue: new Guid("2d636ee2-ac33-4c7c-baea-3db4b3ae6f02"));

            migrationBuilder.DeleteData(
                schema: "public",
                table: "HorariosDisponibles",
                keyColumn: "Id",
                keyValue: new Guid("e6047760-58a1-40a8-9a51-a16cf1069773"));

            migrationBuilder.DeleteData(
                schema: "public",
                table: "HorariosDisponibles",
                keyColumn: "Id",
                keyValue: new Guid("eacb9788-481e-4e2b-9e48-7d72cdb60383"));

            migrationBuilder.DropColumn(
                name: "Alias",
                schema: "public",
                table: "Usuarios");

            migrationBuilder.AlterColumn<string>(
                name: "Email",
                schema: "public",
                table: "Usuarios",
                type: "character varying(256)",
                maxLength: 256,
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "character varying(256)",
                oldMaxLength: 256,
                oldNullable: true);

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
                    { new Guid("47dc8669-f76f-402a-be08-9855ce0785aa"), true, new Guid("cccccccc-cccc-cccc-cccc-cccccccccccc"), 5, new TimeSpan(0, 20, 0, 0, 0), new TimeSpan(0, 18, 0, 0, 0) },
                    { new Guid("4809b693-af6c-42c5-af4c-6f9b51b581f0"), true, new Guid("cccccccc-cccc-cccc-cccc-cccccccccccc"), 6, new TimeSpan(0, 12, 0, 0, 0), new TimeSpan(0, 10, 0, 0, 0) },
                    { new Guid("74608e22-5306-4290-903e-e764fe16763f"), true, new Guid("cccccccc-cccc-cccc-cccc-cccccccccccc"), 1, new TimeSpan(0, 20, 0, 0, 0), new TimeSpan(0, 18, 0, 0, 0) },
                    { new Guid("aba92b3d-9a4a-4dfe-b035-ef42ffbeed82"), true, new Guid("cccccccc-cccc-cccc-cccc-cccccccccccc"), 3, new TimeSpan(0, 20, 0, 0, 0), new TimeSpan(0, 18, 0, 0, 0) }
                });

            migrationBuilder.UpdateData(
                schema: "public",
                table: "Usuarios",
                keyColumn: "Id",
                keyValue: new Guid("aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa"),
                column: "PasswordHash",
                value: "$2a$11$C6ODDkKFIihyyvgL4/w/gOO3gZFbdhB.CPldGEVQLf4/xeTBSD/bi");
        }
    }
}
