using Microsoft.AspNetCore.Mvc;
using PLAY.Common;
using PLAY.Inventory.Service.Clients;
using PLAY.Inventory.Service.Entities;

namespace PLAY.Inventory.Service.Controllers;

[Route("api/[controller]")]
[ApiController]
public class ItemsController : ControllerBase
{
    private readonly IRepository<InventoryItem> _inventoryItemsRepository;
    private readonly IRepository<CatalogItem> _catalogItemsRepository;
    public ItemsController(IRepository<InventoryItem> itemsRepository, CatalogClient catalogClient, IRepository<CatalogItem> catalogItemsRepository)
    {
        _inventoryItemsRepository = itemsRepository;
        _catalogItemsRepository = catalogItemsRepository;
    }

    [HttpGet("/items")]
    public async Task<ActionResult<IEnumerable<CatalogItemDto>>> GetItems()
    {
        var items = await _inventoryItemsRepository.GetAllAsync();

        return Ok(items);
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<InventoryItemDto>>> GetAsync(Guid userId)
    {
        if (userId == Guid.Empty)
            return BadRequest();

        //var items = await _inventoryItemsRepository.GetAllAsync(item => item.UserId == userId);

        //return Ok(items);

        
        var inventoryItemEntities = await _inventoryItemsRepository.GetAllAsync(item => item.UserId == userId);
        var itemIds = inventoryItemEntities.Select(item => item.CatalogItemId);
        var catalogItemEntities = await _catalogItemsRepository.GetAllAsync(item => itemIds.Contains(item.Id));


        var inventoryItemDtos = inventoryItemEntities.Select(inventoryItem =>
        {
            var catalogItem = catalogItemEntities.SingleOrDefault(catalogItem => catalogItem.Id == inventoryItem.CatalogItemId);
            if (catalogItem == null)
            {
                // Log the issue or handle it accordingly
                // For example, you can skip the item, log an error, or return a default value
                Console.WriteLine($"Catalog item not found for Id: {inventoryItem.CatalogItemId}");
                return null; // Or handle this case differently based on your requirements
            }
            return inventoryItem.AsDto(catalogItem.Name, catalogItem.Description);
        }).Where(dto => dto != null).ToList();

        return Ok(inventoryItemDtos);
    }   

    [HttpPost]
    public async Task<ActionResult> PostAsync(GrantItemsDto grantItemsDto)
    {
        var inventoryItem = await _inventoryItemsRepository.GetAsync(
            item => item.UserId == grantItemsDto.UserId && item.CatalogItemId == grantItemsDto.CatalogItemId);

        if (inventoryItem is null)
        {
            inventoryItem = new InventoryItem
            {
                CatalogItemId = grantItemsDto.CatalogItemId,
                UserId = grantItemsDto.UserId,
                Quantity = grantItemsDto.Quantity,
                AcquiredDate = DateTimeOffset.UtcNow
            };

            await _inventoryItemsRepository.CreateAsync(inventoryItem);
        }
        else
        {
            inventoryItem.Quantity += grantItemsDto.Quantity;
            await _inventoryItemsRepository.UpdateAsync(inventoryItem);
        }

        return Ok();            
    }
}
