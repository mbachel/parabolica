namespace Parabolica.Api.Data.Entities;

/// <summary>Represents a stored NASCAR weekend feed snapshot for a race.</summary>
public class NascarWeekendFeed
{
    /// <summary>Gets or sets the primary key.</summary>
    public long Id { get; set; }                  //primary key
    /// <summary>Gets or sets the season year for the snapshot.</summary>
    public int Year { get; set; }
    /// <summary>Gets or sets the series identifier.</summary>
    public int SeriesId { get; set; }
    /// <summary>Gets or sets the race identifier.</summary>
    public int RaceId { get; set; }

    /// <summary>Gets or sets when the snapshot was pulled in UTC.</summary>
    public DateTime PulledAtUtc { get; set; }
    /// <summary>Gets or sets the raw JSON payload for the weekend feed snapshot.</summary>
    public string RawJson { get; set; } = "";    //store raw json for flexibility, can be parsed into structured data as needed
}