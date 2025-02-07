namespace PLAY.Inventory.Service.Clients;

public class CatalogClient
{
    private readonly HttpClient _httpClient;

    public CatalogClient(HttpClient httpClient)
    {
        _httpClient = httpClient;
        _httpClient.BaseAddress = new Uri("https://localhost:7148/api"); // Ensure the correct base address
    }

    public async Task<IReadOnlyCollection<CatalogItemDto>> GetCatalogItemsAsync()
    {
        var response = await _httpClient.GetAsync("https://localhost:7148/api/Items");

        if (!response.IsSuccessStatusCode)
        {
            // Log the status code and reason
            var error = $"Error: {response.StatusCode}, Reason: {response.ReasonPhrase}";
            // Log error or throw an exception
            throw new HttpRequestException(error);
        }

        var items = await response.Content.ReadFromJsonAsync<IReadOnlyCollection<CatalogItemDto>>();
        return items ?? Array.Empty<CatalogItemDto>();
    }
}


//public class CatalogClient
//{
//    private readonly HttpClient _httpClient;

//    public CatalogClient(HttpClient httpClient)
//    {
//        _httpClient = httpClient;
//        _httpClient.BaseAddress = new Uri("https://localhost:7148/api"); // Set the correct base address
//    }

//    public async Task<IReadOnlyCollection<CatalogItemDto>> GetCatalogItemsAsync()
//    {
//        var items = await _httpClient.GetFromJsonAsync<IReadOnlyCollection<CatalogItemDto>>("/Items");
//        return items ?? Array.Empty<CatalogItemDto>();
//    }   
//}
