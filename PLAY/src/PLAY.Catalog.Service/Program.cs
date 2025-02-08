using MassTransit;
using PLAY.Catalog.Service.Entities;
using PLAY.Catalog.Service.Settings;
using PLAY.Common.MongoDb;
using PLAY.Common.Settings;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddMongo()
    .AddMongoRepository<Item>("items");

// Configure MassTransit with RabbitMQ
builder.Services.AddMassTransit(x =>
{
    x.UsingRabbitMq((context, configurator) =>
    {
        var serviceSettings = builder.Configuration.GetSection(nameof(ServiceSettings)).Get<ServiceSettings>();
        var rabbitMQSettings = builder.Configuration.GetSection(nameof(RabbitMQSettings)).Get<RabbitMQSettings>();
        configurator.Host(rabbitMQSettings!.Host);
        configurator.ConfigureEndpoints(context, new KebabCaseEndpointNameFormatter(serviceSettings!.ServiceName, false));
    });

    // Add additional configuration if needed
    // Example: x.AddConsumer<YourConsumer>();
});

// Add MassTransit hosted service
builder.Services.AddHostedService<MassTransitHostedService>();

builder.Services.AddControllers(options =>
{
    options.SuppressAsyncSuffixInActionNames = false;
});

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

app.UseAuthorization();

app.MapControllers();

app.Run();
