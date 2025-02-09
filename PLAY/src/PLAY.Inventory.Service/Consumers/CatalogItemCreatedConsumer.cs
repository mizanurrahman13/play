using MassTransit;
using PLAY.Catalog.Contracts;
using PLAY.Common;
using PLAY.Inventory.Service.Entities;

namespace PLAY.Inventory.Service.Consumers;

public class CatalogItemCreatedConsumer : IConsumer<CatalogItemCreated>
{
    private readonly IRepository<CatalogItem> repsitory;

    public CatalogItemCreatedConsumer(IRepository<CatalogItem> repository)
    {
        this.repsitory = repository;
    }
    public async Task Consume(ConsumeContext<CatalogItemCreated> context)
    {
        var message = context.Message;

        var item = await repsitory.GetAsync(message.ItemId);

        if (item is not null)
        {
            return;
        }

        item = new CatalogItem
        {
            Id = message.ItemId,
            Name = message.Name,
            Description = message.Description,
        };

        await repsitory.CreateAsync(item);
    }
}
