namespace Parabolica.Api.Nascar.Services;

using System.Text.Json;
using Parabolica.Api.Nascar.Models;

/// <summary>Fetches live NASCAR feed data from the public API.</summary>
public class NascarApiClient
{
    private readonly HttpClient _http;
    private readonly ILogger<NascarApiClient> _logger;

    //store public access link to live feed json
    private const string LiveFeedUrl = "https://cf.nascar.com/live/feeds/live-feed.json";

    /// <summary>Initializes a new instance of the <see cref="NascarApiClient"/> class.</summary>
    /// <param name="http">HTTP client for API calls.</param>
    /// <param name="logger">Logger for request and error details.</param>
    public NascarApiClient(HttpClient http, ILogger<NascarApiClient> logger)
    {
        _http = http;
        _logger = logger;
    }

    /// <summary>Gets the latest live NASCAR feed snapshot.</summary>
    /// <param name="ct">Cancellation token for the request.</param>
    /// <returns>The live feed response, or null when unavailable.</returns>
    public async Task<LiveFeedResponse?> GetLiveFeedAsync(CancellationToken ct = default)
    {
        try
        {
            var response = await _http.GetAsync(LiveFeedUrl, ct);

            if (!response.IsSuccessStatusCode)
            {
                _logger.LogWarning(
                    "NASCAR live feed returned {StatusCode}",
                    response.StatusCode);
                return null;
            }

            var json = await response.Content.ReadAsStringAsync(ct);

            return JsonSerializer.Deserialize<LiveFeedResponse>(json);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to fetch NASCAR live feed");
            return null;
        }
    }
}