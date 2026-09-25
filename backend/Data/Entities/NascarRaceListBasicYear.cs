namespace Parabolica.Api.Data.Entities;

/// <summary>Represents a stored NASCAR race list basic snapshot for a season.</summary>
public class NascarRaceListBasicYear
{
    /// <summary>Gets or sets the season year key.</summary>
    public int Year { get; set; }              //primary key
    /// <summary>Gets or sets when the snapshot was pulled in UTC.</summary>
    public DateTime PulledAtUtc { get; set; }
    /// <summary>Gets or sets the raw JSON payload for the season snapshot.</summary>
    public string RawJson { get; set; } = "";  //store raw json for flexibility, can be parsed into structured data as needed
}