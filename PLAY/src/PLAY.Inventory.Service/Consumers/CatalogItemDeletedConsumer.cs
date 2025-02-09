using MassTransit;
using PLAY.Catalog.Contracts;
using PLAY.Common;
using PLAY.Inventory.Service.Entities;

namespace PLAY.Inventory.Service.Consumers;

public class CatalogItemDeletedConsumer : IConsumer<CatalogItemDeleted>
{
    private readonly IRepository<CatalogItem> repsitory;

    public CatalogItemDeletedConsumer(IRepository<CatalogItem> repository)
    {
        this.repsitory = repository;
    }
    public async Task Consume(ConsumeContext<CatalogItemDeleted> context)
    {
        var message = context.Message;

        var item = await repsitory.GetAsync(message.ItemId);

        if (item is null)
        {
            return;
        }
        
        await repsitory.RemoveAsync(message.ItemId);
    }
}
