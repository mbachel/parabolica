namespace Parabolica.Api.Admin.Import;

/// <summary>Represents a request to import weekend feed data for a race.</summary>
/// <param name="Year">Season year to import.</param>
/// <param name="SeriesId">Series identifier.</param>
/// <param name="RaceId">Race identifier.</param>
/// <param name="Force">Whether to re-import when data already exists.</param>
public record NascarWeekendFeedImportRequest(int Year, int SeriesId, int RaceId, bool Force = false);