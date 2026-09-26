namespace Parabolica.Api.Nascar.Services;

/// <summary>Fetches historical NASCAR data from the public API.</summary>
public class NascarHistoricalApiClient
{
    private readonly HttpClient _http;
    private readonly ILogger<NascarHistoricalApiClient> _logger;

    /// <summary>Initializes a new instance of the <see cref="NascarHistoricalApiClient"/> class.</summary>
    /// <param name="http">HTTP client for API calls.</param>
    /// <param name="logger">Logger for request and error details.</param>
    public NascarHistoricalApiClient(HttpClient http, ILogger<NascarHistoricalApiClient> logger)
    {
        _http = http;
        _logger = logger;
    }

    /// <summary>Gets the race list basic JSON for a season.</summary>
    /// <param name="year">Season year to query.</param>
    /// <param name="ct">Cancellation token for the request.</param>
    /// <returns>The raw JSON response.</returns>
    public async Task<string> GetRaceListBasicRawJsonAsync(int year, CancellationToken ct = default)
    {
        var url = $"https://cf.nascar.com/cacher/{year}/race_list_basic.json";
        return await GetRequiredRawJsonAsync(url, ct);
    }

    /// <summary>Gets the weekend feed JSON for a specific race.</summary>
    /// <param name="year">Season year to query.</param>
    /// <param name="seriesId">Series identifier.</param>
    /// <param name="raceId">Race identifier.</param>
    /// <param name="ct">Cancellation token for the request.</param>
    /// <returns>The raw JSON response.</returns>
    public async Task<string> GetWeekendFeedRawJsonAsync(int year, int seriesId, int raceId, CancellationToken ct = default)
    {
        var url = $"https://cf.nascar.com/cacher/{year}/{seriesId}/{raceId}/weekend-feed.json";

        return await GetRequiredRawJsonAsync(url, ct);
    }

    /// <summary>Fetches a required JSON payload and validates the response.</summary>
    /// <param name="url">URL to fetch.</param>
    /// <param name="ct">Cancellation token for the request.</param>
    /// <returns>The raw JSON response.</returns>
    private async Task<string> GetRequiredRawJsonAsync(string url, CancellationToken ct)
    {
        try
        {
            var response = await _http.GetAsync(url, ct);

            if (!response.IsSuccessStatusCode)
            {
                _logger.LogWarning("Failed to fetch data from {Url}. Status code: {StatusCode}", url, response.StatusCode);
                throw new HttpRequestException(
                    $"Request failed: {(int)response.StatusCode} {response.ReasonPhrase} ({url})"
                );
            }

            var json = await response.Content.ReadAsStringAsync(ct);

            if (string.IsNullOrWhiteSpace(json))
            {
                _logger.LogWarning("Received empty response from {Url}", url);
                throw new HttpRequestException($"Received empty response from {url}");
            }

            return json;
        }
        catch (Exception ex) when (ex is not OperationCanceledException)
        {
            _logger.LogError(ex, "Exception occurred while fetching data from {Url}", url);
            throw;
        }
    }
}