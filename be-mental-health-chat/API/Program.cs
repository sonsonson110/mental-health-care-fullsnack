using API.Hubs;
using Application;
using Application.Meters;
using Azure.Monitor.OpenTelemetry.AspNetCore;
using HealthChecks.UI.Client;
using Infrastructure;
using Infrastructure.Data;
using Microsoft.AspNetCore.Diagnostics.HealthChecks;
using Microsoft.OpenApi.Models;
using OpenTelemetry.Metrics;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddSignalR(options => { options.DisableImplicitFromServicesParameters = true; });
builder.Services.AddControllers();

// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo { Title = "MyYour API", Version = "v1" });

    // Add Bearer token authentication
    var securityScheme = new OpenApiSecurityScheme
    {
        Name = "Authorization",
        Type = SecuritySchemeType.Http,
        Scheme = "bearer",
        BearerFormat = "JWT",
        In = ParameterLocation.Header,
        Description = "JWT Authorization header using the Bearer scheme."
    };

    c.AddSecurityDefinition("Bearer", securityScheme);

    var securityRequirement = new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference
                {
                    Type = ReferenceType.SecurityScheme,
                    Id = "Bearer"
                }
            },
            []
        }
    };

    c.AddSecurityRequirement(securityRequirement);
});

// Add problem details
builder.Services.AddProblemDetails();

// CORS
var allowedOrigins = builder.Configuration.GetSection("Cors:AllowedOrigins").Get<string[]>();
builder.Services.AddCors(option =>
{
    option.AddPolicy("AllowSpecificOrigins", p => p
            .WithOrigins(allowedOrigins ?? throw new InvalidOperationException("Allowed origins not set"))
            .AllowAnyMethod()
            .AllowAnyHeader()
            .AllowCredentials()
            .WithExposedHeaders("Content-Disposition")
            .WithExposedHeaders("WWW-Authenticate") // For client to handle 401 responses gracefully
    );
});

// Add Open Telemetry
builder.Services.AddOpenTelemetry()
    .UseAzureMonitor(cfg =>
    {
        cfg.ConnectionString = builder.Configuration.GetConnectionString("AzureAppInsight");
    })
    .WithMetrics(cfg => 
        cfg
            .AddMeter(ChatbotMeter.MeterName)
            .AddAspNetCoreInstrumentation()
            // .AddConsoleExporter()
        );

// Custom services
builder.Services
    .AddInfrastructure(builder.Configuration)
    .AddApplication(builder.Configuration);

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseCors("AllowSpecificOrigins");

var cacheMaxAgeFiveMinutes = (60 * 5).ToString();
app.UseStaticFiles(new StaticFileOptions
{
    OnPrepareResponse = ctx =>
    {
        ctx.Context.Response.Headers.Append(
            "Cache-Control", $"public, max-age={cacheMaxAgeFiveMinutes}");
    }
});

app.UseAuthentication();
app.UseAuthorization();

app.MapHub<ChatHub>("/chat");
app.MapControllers();

app.MapHealthChecks("health", new HealthCheckOptions
{
    ResponseWriter = UIResponseWriter.WriteHealthCheckUIResponse
});

// Initialize the database
// await DatabaseInitializer.Initialize(app.Services);

app.Run();