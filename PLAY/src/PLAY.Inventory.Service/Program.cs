using PLAY.Common.MassTransit;
using PLAY.Common.MongoDb;
using PLAY.Inventory.Service.Clients;
using PLAY.Inventory.Service.Entities;
using Polly;
using Polly.Timeout;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddMongo()
    .AddMongoRepository<InventoryItem>("inventoryItems")
    .AddMongoRepository<CatalogItem>("catalogitems")
    .AddMassTransitWithRabbitMq(builder.Configuration);

var jitterer = new Random();

builder.Services.AddHttpClient<CatalogClient>(client =>
{
    client.BaseAddress = new Uri("https://localhost:7148/api");
})
.AddTransientHttpErrorPolicy(policyBuilder => policyBuilder
    .Or<TimeoutRejectedException>()
    .WaitAndRetryAsync(
        retryCount: 5,
        sleepDurationProvider: retryAttempt =>
            TimeSpan.FromSeconds(Math.Pow(2, retryAttempt)) +
            TimeSpan.FromMilliseconds(jitterer.Next(0, 1000)), // Adding jitter
        onRetry: (outcome, timespan, retryAttempt, context) =>
        {
            var logger = builder.Services.BuildServiceProvider().GetRequiredService<ILogger<CatalogClient>>();
            logger.LogWarning($"Delaying for {timespan.TotalSeconds} seconds, then making retry {retryAttempt}");
        }
    ))
.AddTransientHttpErrorPolicy(policyBuilder => policyBuilder
    .Or<TimeoutRejectedException>()
    .CircuitBreakerAsync(
        handledEventsAllowedBeforeBreaking: 3,
        durationOfBreak: TimeSpan.FromSeconds(15),
        onBreak: (outcome, timespan) =>
        {
            var logger = builder.Services.BuildServiceProvider().GetRequiredService<ILogger<CatalogClient>>();
            logger.LogWarning($"Opening the circuit for {timespan.TotalSeconds} seconds...");
        },
        onReset: () =>
        {
            var logger = builder.Services.BuildServiceProvider().GetRequiredService<ILogger<CatalogClient>>();
            logger.LogWarning($"Closing the circuit...");
        })
)
.AddPolicyHandler(Policy.TimeoutAsync<HttpResponseMessage>(TimeSpan.FromSeconds(1)));

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowSpecificOrigin",
        builder => builder
            .WithOrigins("http://localhost:5173")
            .AllowAnyMethod()
            .AllowAnyHeader());
});
builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuck
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseCors("AllowSpecificOrigin");

app.UseAuthorization();

app.MapControllers();

app.Run();
