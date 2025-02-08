using Microsoft.AspNetCore.Mvc;
using PLAY.Catalog.Service.Entities;
using PLAY.Common;

namespace PLAY.Catalog.Service.Controllers;

[Route("api/[controller]")]
[ApiController]
public class ItemsController : ControllerBase
{
    private readonly IRepository<Item> _itemsRepository;
    private static int requestCounter = 0;

    public ItemsController(IRepository<Item> itemsRepository)
    {
        _itemsRepository = itemsRepository;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<ItemDto>>> GetAsync()
    {
        requestCounter++;
        Console.WriteLine($"Request {requestCounter}: Starting...");

        if (requestCounter <= 2)
        {
            Console.WriteLine($"Request {requestCounter}: Delaying...");
            await Task.Delay(TimeSpan.FromSeconds(10));
        }

        if (requestCounter <= 4)
        {
            Console.WriteLine($"Request {requestCounter}: 500 (Internal Server Error).");
            return StatusCode(500);
        }

        var items = (await _itemsRepository.GetAllAsync())
            .Select(item => item.AsDto());

        Console.WriteLine($"Request {requestCounter}: 200 (Ok).");

        return Ok(items);
    }

    // GET /items/123
    [HttpGet("{id}")]
    public async Task<ActionResult<ItemDto>> GetByIdAsync(Guid id)
    {
        var item = await _itemsRepository.GetAsync(id);

        if (item is null)
            return NotFound();

        return item.AsDto();
    }
    // POST/ items
    [HttpPost]
    public async Task<ActionResult<ItemDto>> PostAsync(CreateItemDto createItemDto)
    {
        var item = new Item
        {
            Name = createItemDto.Name,
            Description = createItemDto.Description,
            Price = createItemDto.Price,
            CreatedDate = DateTimeOffset.UtcNow,
        };

        await _itemsRepository.CreateAsync(item);

        return CreatedAtAction(nameof(GetByIdAsync), new{ id = item.Id }, item);
    }

    // PUT /items/{id}
    [HttpPut("{id}")]
    public async Task<IActionResult> PutAsync(Guid id, UpdateItemDto updateItemDto)
    {
        var existingItem = await _itemsRepository.GetAsync(id);

        if (existingItem is null)
            return NotFound();

        existingItem.Name = updateItemDto.Name;
            existingItem.Description = updateItemDto.Description;
            existingItem.Price = updateItemDto.Price;

        await _itemsRepository.UpdateAsync(existingItem);

        return NoContent();
    }

    // DELETE /items/{id}
    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(Guid id)
    {
        var item = await _itemsRepository.GetAsync(id);

        if (item is null)
            return NotFound();

        await _itemsRepository.RemoveAsync(item.Id);

        return NoContent();
    }
}
