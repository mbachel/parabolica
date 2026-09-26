namespace Parabolica.Api.Nascar.Services;

/// <summary>Background service that polls the live feed when races are active.</summary>
public class NascarPollingService : BackgroundService
{
    private readonly NascarCacheService _cache;
    private readonly NascarLiveRaceDetector _detector;
    private readonly ILogger<NascarPollingService> _logger;

    /// <summary>Initializes a new instance of the <see cref="NascarPollingService"/> class.</summary>
    /// <param name="detector">Live race detector used to gate polling.</param>
    /// <param name="cache">Cache for the latest live feed snapshot.</param>
    /// <param name="logger">Logger for polling activity.</param>
    public NascarPollingService(
        NascarLiveRaceDetector detector,
        NascarCacheService cache,
        ILogger<NascarPollingService> logger)
    {
        _detector = detector;
        _cache = cache;
        _logger = logger;
    }

    /// <summary>Executes the background polling loop.</summary>
    /// <param name="stoppingToken">Cancellation token to stop the service.</param>
    /// <returns>A task representing the background operation.</returns>
    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        //log that we're starting
        _logger.LogInformation("NASCAR polling service started (gated via live-race detector)");

        //loop forever until cancellation requested
        //(when docker sends SIGTERM, or Ctrl+C in dev)
        while (!stoppingToken.IsCancellationRequested)
        {
            //call the live race detector to check the status
            var status = await _detector.GetStatusAsync(stoppingToken);

            //update the cache for any state that returned feed data (active, pre-race, post-race)
            if (status.Feed is not null)
            {
                _cache.Update(status.Feed, status.State);
            }

            _logger.LogDebug("NASCAR detector state: {State} ({Reason}). Next check in {Delay}",
                status.State, status.Reason, status.NextCheckDelay);

            //wait until configured interval before next poll
            //will be interrupted immediately if cancellation requested
            await Task.Delay(status.NextCheckDelay, stoppingToken);
        }

        //log that we're stopping
        _logger.LogInformation("NASCAR polling service stopped");
    }
}