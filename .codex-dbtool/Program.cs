using Microsoft.Data.SqlClient;

var connectionString =
    "Server=DESKTOP-ANSK0OM\\SQLEXPRESS;Database=BoutiqueDb;Trusted_Connection=True;TrustServerCertificate=True;Encrypt=False;Connect Timeout=5;";

await using var connection = new SqlConnection(connectionString);
await connection.OpenAsync();

if (args.Length == 0 || args[0] == "list")
{
    await using var command = connection.CreateCommand();
    command.CommandText = "SELECT Id, Nom, PhotoUrl FROM dbo.Products ORDER BY Id";
    await using var reader = await command.ExecuteReaderAsync();

    while (await reader.ReadAsync())
    {
        Console.WriteLine($"{reader.GetInt32(0)} | {reader.GetString(1)} | {reader.GetString(2)}");
    }

    return;
}

if (args[0] == "update-images")
{
    var images = new Dictionary<string, string>(StringComparer.OrdinalIgnoreCase)
    {
        ["tomate"] = "https://commons.wikimedia.org/wiki/Special:Redirect/file/Tomato.jpg?width=600",
        ["comcombre"] = "https://commons.wikimedia.org/wiki/Special:Redirect/file/ARS_cucumber.jpg?width=600",
        ["concombre"] = "https://commons.wikimedia.org/wiki/Special:Redirect/file/ARS_cucumber.jpg?width=600",
        ["celeris"] = "https://commons.wikimedia.org/wiki/Special:Redirect/file/Apium_graveolens_var._dulce.jpg?width=600",
        ["celeri"] = "https://commons.wikimedia.org/wiki/Special:Redirect/file/Apium_graveolens_var._dulce.jpg?width=600",
        ["céleri"] = "https://commons.wikimedia.org/wiki/Special:Redirect/file/Apium_graveolens_var._dulce.jpg?width=600"
    };

    foreach (var (name, url) in images)
    {
        await using var command = connection.CreateCommand();
        command.CommandText = """
            UPDATE dbo.Products
            SET PhotoUrl = @url
            WHERE LOWER(Nom) = @name;
            """;
        command.Parameters.AddWithValue("@url", url);
        command.Parameters.AddWithValue("@name", name.ToLowerInvariant());
        var count = await command.ExecuteNonQueryAsync();

        if (count > 0)
        {
            Console.WriteLine($"Updated {name}: {count}");
        }
    }
}
