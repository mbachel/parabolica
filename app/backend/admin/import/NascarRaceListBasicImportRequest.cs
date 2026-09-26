namespace Parabolica.Api.Admin.Import;

/// <summary>Represents a request to import race list basic data for a season.</summary>
/// <param name="Year">Season year to import.</param>
/// <param name="Force">Whether to re-import when data already exists.</param>
public record NascarRaceListBasicImportRequest(int Year, bool Force = false);