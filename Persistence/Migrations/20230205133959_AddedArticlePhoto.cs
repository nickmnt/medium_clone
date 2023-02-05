using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Persistence.Migrations
{
    public partial class AddedArticlePhoto : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "PhotoId",
                table: "Articles",
                type: "text",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "ArticlePhoto",
                columns: table => new
                {
                    Id = table.Column<string>(type: "text", nullable: false),
                    Url = table.Column<string>(type: "text", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ArticlePhoto", x => x.Id);
                });

            migrationBuilder.UpdateData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: 1,
                column: "ConcurrencyStamp",
                value: "a69bd9fa-dbd7-4ec8-91e8-ceeaedea5369");

            migrationBuilder.UpdateData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: 2,
                column: "ConcurrencyStamp",
                value: "0d690c70-1c8a-43d2-b601-7031176ced67");

            migrationBuilder.CreateIndex(
                name: "IX_Articles_PhotoId",
                table: "Articles",
                column: "PhotoId");

            migrationBuilder.AddForeignKey(
                name: "FK_Articles_ArticlePhoto_PhotoId",
                table: "Articles",
                column: "PhotoId",
                principalTable: "ArticlePhoto",
                principalColumn: "Id");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Articles_ArticlePhoto_PhotoId",
                table: "Articles");

            migrationBuilder.DropTable(
                name: "ArticlePhoto");

            migrationBuilder.DropIndex(
                name: "IX_Articles_PhotoId",
                table: "Articles");

            migrationBuilder.DropColumn(
                name: "PhotoId",
                table: "Articles");

            migrationBuilder.UpdateData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: 1,
                column: "ConcurrencyStamp",
                value: "d48ad5e6-4e19-47ee-bd65-95a23dbcfc80");

            migrationBuilder.UpdateData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: 2,
                column: "ConcurrencyStamp",
                value: "ac6cc42f-8fed-46c6-846f-9ba99af1eec5");
        }
    }
}
