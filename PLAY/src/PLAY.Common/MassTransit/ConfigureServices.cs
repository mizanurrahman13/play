using MassTransit;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using PLAY.Common.Settings;
using System.Reflection;

namespace PLAY.Common.MassTransit;

public static class ConfigureServices
{
    public static IServiceCollection AddMassTransitWithRabbitMq(this  IServiceCollection services, IConfiguration configuration)
    {
        // Configure MassTransit with RabbitMQ
        services.AddMassTransit(configure =>
        {
            configure.AddConsumers(Assembly.GetEntryAssembly());
            configure.UsingRabbitMq((context, configurator) =>
            {
                var serviceSettings = configuration.GetSection(nameof(ServiceSettings)).Get<ServiceSettings>();
                var rabbitMQSettings = configuration.GetSection(nameof(RabbitMQSettings)).Get<RabbitMQSettings>();
                configurator.Host(rabbitMQSettings!.Host);
                configurator.ConfigureEndpoints(context, new KebabCaseEndpointNameFormatter(serviceSettings!.ServiceName, false));
                configurator.UseMessageRetry(retryConfigurator =>
                {
                    retryConfigurator.Interval(3, TimeSpan.FromSeconds(5));
                });
            });
        });

        // Add MassTransit hosted service
        services.AddHostedService<MassTransitHostedService>();

        return services;
    }
}
