namespace Parabolica.Api.Nascar.Services;

using Parabolica.Api.Nascar.Models;

/// <summary>Caches the latest NASCAR live feed snapshot for quick access.</summary>
public class NascarCacheService
{
    //store the latest feed as a LiveFeedResponse object
    private LiveFeedResponse? _latestFeed;
    //store last known race state
    private NascarLiveRaceDetector.RaceActivityState _lastRaceState = NascarLiveRaceDetector.RaceActivityState.Unknown;
    //store timestamp of last update
    private DateTime _lastUpdated;

    //lock object for thread safety
    private readonly object _lock = new();

    /// <summary>Updates the cached live feed snapshot.</summary>
    /// <param name="feed">Latest feed data to cache.</param>
    public void Update(LiveFeedResponse feed, NascarLiveRaceDetector.RaceActivityState raceState)
    {
        lock (_lock)
        {
            _latestFeed = feed;
            _lastRaceState = raceState;
            _lastUpdated = DateTime.UtcNow;
        }
    }

    /// <summary>Gets the latest cached feed and its update timestamp.</summary>
    /// <returns>The cached feed, race state, and the last updated time in UTC.</returns>
    public (LiveFeedResponse? Feed, NascarLiveRaceDetector.RaceActivityState RaceState, DateTime LastUpdated) GetLatest()
    {
        lock (_lock)
        {
            return (_latestFeed, _lastRaceState, _lastUpdated);
        }
    }
}