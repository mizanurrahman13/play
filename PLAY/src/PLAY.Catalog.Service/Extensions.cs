using PLAY.Catalog.Service.Entities;
using static PLAY.Catalog.Service.Dtos;

namespace PLAY.Catalog.Service;

public static class Extensions
{
    public static ItemDto AsDto(this Item item)
    {
        return new ItemDto(item.Id, item.Name, item.Description, item.Price, item.CreatedDate);
    }
}
