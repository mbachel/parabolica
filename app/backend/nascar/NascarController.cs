namespace Parabolica.Api.Nascar;

using Microsoft.AspNetCore.Mvc;
using Parabolica.Api.Nascar.Services;

/// <summary>Exposes NASCAR live feed endpoints.</summary>
[ApiController]
[Route("api/nascar")]
public class NascarController : ControllerBase
{
    private readonly NascarCacheService _cache;

    /// <summary>Initializes a new instance of the <see cref="NascarController"/> class.</summary>
    /// <param name="cache">Cache service for NASCAR live feed data.</param>
    public NascarController(NascarCacheService cache)
    {
        _cache = cache;
    }

    /// <summary>Gets the latest live NASCAR feed snapshot.</summary>
    /// <returns>Live feed data or a waiting status when unavailable.</returns>
    [HttpGet("live")]
    public IActionResult GetLiveFeed()
    {
        var (feed, state, lastUpdated) = _cache.GetLatest();

        var raceState = state switch
        {
            NascarLiveRaceDetector.RaceActivityState.NoRace => "no-race",
            NascarLiveRaceDetector.RaceActivityState.PreRace => "pre-race",
            NascarLiveRaceDetector.RaceActivityState.Active => "active",
            NascarLiveRaceDetector.RaceActivityState.PostRace => "post-race",
            NascarLiveRaceDetector.RaceActivityState.Unknown => "unknown",
            _ => "unknown"
        };

        return Ok(new
        {
            raceState,
            lastUpdated,
            data = feed
        });
    }
}