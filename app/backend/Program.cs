using Parabolica.Api.Nascar.Services;
using Parabolica.Api.Admin;
using Parabolica.Api.Data;
using Microsoft.EntityFrameworkCore;

//=== BUILD PHASE BEGIN ===

var builder = WebApplication.CreateBuilder(args);

//scan for [ApiController] and add those controllers to the service collection
builder.Services.AddControllers();

//identify the app to the NASCAR API on every request
const string userAgent = "Parabolica/1.0 (+https://github.com/mbachel/parabolica)";

//add services for nascar
builder.Services.AddHttpClient<NascarApiClient>(client =>
{
    client.Timeout = TimeSpan.FromSeconds(15);
    client.DefaultRequestHeaders.UserAgent.ParseAdd(userAgent);
});
builder.Services.AddHttpClient<NascarHistoricalApiClient>(client =>
{
    client.Timeout = TimeSpan.FromSeconds(30);
    client.DefaultRequestHeaders.UserAgent.ParseAdd(userAgent);
});
builder.Services.AddScoped<AdminKeyAuthFilter>();
builder.Services.AddSingleton<NascarCacheService>();
builder.Services.AddSingleton<NascarLiveRaceDetector>();
builder.Services.AddHostedService<NascarPollingService>();
builder.Services.AddDbContext<ParabolicaDbContext>(options =>
{
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection"));
});

//report app and database health at /health
builder.Services.AddHealthChecks()
    .AddDbContextCheck<ParabolicaDbContext>();
// === BUILD PHASE END ===

// === RUN PHASE BEGIN ===

//build the app and configure the HTTP request pipeline
var app = builder.Build();

//auto-apply EF core migrations on startup
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<ParabolicaDbContext>();
    db.Database.Migrate();
}

//map controller routes
app.MapControllers();

//map health check endpoint
app.MapHealthChecks("/health");

//start listening for API requests
app.Run();

// === RUN PHASE END ===