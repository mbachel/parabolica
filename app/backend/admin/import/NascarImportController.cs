namespace Parabolica.Api.Admin.Import;

using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Parabolica.Api.Data;
using Parabolica.Api.Data.Entities;
using Parabolica.Api.Nascar.Services;

/// <summary>Imports NASCAR historical data into the database.</summary>
[Route("api/admin/import/nascar")]
public class NascarImportController : AdminControllerBase
{
    private readonly ParabolicaDbContext _db;
    private readonly NascarHistoricalApiClient _historical;
    private readonly ILogger<NascarImportController> _logger;
    
    /// <summary>Initializes a new instance of the <see cref="NascarImportController"/> class.</summary>
    /// <param name="db">Database context.</param>
    /// <param name="historical">Historical NASCAR API client.</param>
    /// <param name="logger">Logger for import operations.</param>
    public NascarImportController(
        ParabolicaDbContext db, 
        NascarHistoricalApiClient historical, 
        ILogger<NascarImportController> logger)
    {
        _db = db;
        _historical = historical;
        _logger = logger;
    }

    /// <summary>Imports the race list basic data for a season.</summary>
    /// <param name="req">Import request parameters.</param>
    /// <param name="ct">Cancellation token for the request.</param>
    /// <returns>Import status and metadata.</returns>
    [HttpPost("race-list-basic")]
    public async Task<IActionResult> ImportRaceListBasic(
        [FromBody] NascarRaceListBasicImportRequest req, 
        CancellationToken ct)
    {
        try
        {
            var existing = await _db.NascarRaceListBasicYears
                .SingleOrDefaultAsync(x => x.Year == req.Year, ct);

            if (existing is not null && !req.Force)
            {
                return Ok(new 
                { 
                    status = "skipped", 
                    reason = "Already imported", 
                    year = req.Year, 
                    pulledAtUtc = existing.PulledAtUtc 
                });
            }

            var rawJson = await _historical.GetRaceListBasicRawJsonAsync(req.Year, ct);

            if (existing is null)
            {
                _db.NascarRaceListBasicYears.Add(new NascarRaceListBasicYear
                {
                    Year = req.Year,
                    PulledAtUtc = DateTime.UtcNow,
                    RawJson = rawJson
                });
            }
            else
            {
                existing.PulledAtUtc = DateTime.UtcNow;
                existing.RawJson = rawJson;
            }

            await _db.SaveChangesAsync(ct);

            return Ok(new { status = "imported", type = "race-list-basic", year = req.Year, pulledAtUtc = DateTime.UtcNow });
        }
        catch (HttpRequestException ex)
        {
            _logger.LogWarning(ex, "Race list basic import failed for year {Year}", req.Year);
            return StatusCode(StatusCodes.Status502BadGateway, new
            {
                status = "failed",
                type = "race-list-basic",
                year = req.Year,
                error = ex.Message
            });
        }
    }

    /// <summary>Imports the weekend feed data for a specific race.</summary>
    /// <param name="req">Import request parameters.</param>
    /// <param name="ct">Cancellation token for the request.</param>
    /// <returns>Import status and metadata.</returns>
    [HttpPost("weekend-feed")]
    public async Task<IActionResult> ImportWeekendFeed(
        [FromBody] NascarWeekendFeedImportRequest req,
        CancellationToken ct)
    {
        try
        {
            var existing = await _db.NascarWeekendFeeds
                .SingleOrDefaultAsync(x =>
                    x.Year == req.Year &&
                    x.SeriesId == req.SeriesId &&
                    x.RaceId == req.RaceId, ct);

            if (existing is not null && !req.Force)
            {
                return Ok(new
                {
                    status = "skipped",
                    reason = "Already imported",
                    year = req.Year,
                    seriesId = req.SeriesId,
                    raceId = req.RaceId,
                    pulledAtUtc = existing.PulledAtUtc
                });
            }

            var rawJson = await _historical.GetWeekendFeedRawJsonAsync(req.Year, req.SeriesId, req.RaceId, ct);

            if (existing is null)
            {
                _db.NascarWeekendFeeds.Add(new NascarWeekendFeed
                {
                    Year = req.Year,
                    SeriesId = req.SeriesId,
                    RaceId = req.RaceId,
                    PulledAtUtc = DateTime.UtcNow,
                    RawJson = rawJson
                });
            }
            else
            {
                existing.PulledAtUtc = DateTime.UtcNow;
                existing.RawJson = rawJson;
            }

            await _db.SaveChangesAsync(ct);

            return Ok(new
            {
                status = "imported",
                type = "weekend-feed",
                year = req.Year,
                seriesId = req.SeriesId,
                raceId = req.RaceId,
                pulledAtUtc = existing?.PulledAtUtc
            });
        }
        catch (HttpRequestException ex)
        {
            _logger.LogWarning(ex, 
                "Weekend feed import failed for year {Year}, series {SeriesId}, race {RaceId}", 
                req.Year, req.SeriesId, req.RaceId);

            return StatusCode(StatusCodes.Status502BadGateway, new
            {
                status = "failed",
                type = "weekend-feed",
                year = req.Year,
                seriesId = req.SeriesId,
                raceId = req.RaceId,
                error = ex.Message
            });
        }
    }
}