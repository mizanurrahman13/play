using MassTransit;
using PLAY.Catalog.Contracts;
using PLAY.Common;
using PLAY.Inventory.Service.Entities;

namespace PLAY.Inventory.Service.Consumers;

public class CatalogItemUpdatedConsumer : IConsumer<CatalogItemUpdated>
{
    private readonly IRepository<CatalogItem> repsitory;

    public CatalogItemUpdatedConsumer(IRepository<CatalogItem> repository)
    {
        this.repsitory = repository;
    }
    public async Task Consume(ConsumeContext<CatalogItemUpdated> context)
    {
        var message = context.Message;

        var item = await repsitory.GetAsync(message.ItemId);

        if (item is null)
        {
            item = new CatalogItem
            {
                Id = message.ItemId,
                Name = message.Name,
                Description = message.Description,
            };
        }
        else
        {
            item.Name = message.Name;
            item.Description = message.Description;

            await repsitory.UpdateAsync(item);
        }
    }
}