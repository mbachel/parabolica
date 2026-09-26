namespace Parabolica.Api.Nascar.Models;

using System.Text.Json;
using System.Text.Json.Serialization;

/// <summary>Represents the NASCAR race list basic response payload.</summary>
/// <remarks>
/// Models https://cf.nascar.com/cacher/{year}/race_list_basic.json.
/// The JSON shape is a single object whose properties are "series_1", "series_2", "series_3", etc.,
/// each containing an array of races, so the keys are captured via <see cref="JsonExtensionDataAttribute"/>.
/// </remarks>
public class RaceListBasicResponse
{
    /// <summary>Holds dynamic top-level buckets like "series_1", "series_2", etc.</summary>
    [JsonExtensionData]
    public Dictionary<string, JsonElement> SeriesBuckets { get; set; } = new();

    /// <summary>Gets the Cup Series bucket ("series_1") if available.</summary>
    /// <param name="options">Optional serializer options used for deserialization.</param>
    /// <returns>A list of races, or an empty list when missing or invalid.</returns>
    public List<RaceListBasicRace> GetCupSeries1(JsonSerializerOptions? options = null)
    {
        if (!SeriesBuckets.TryGetValue("series_1", out var element))
            return new List<RaceListBasicRace>();

        if (element.ValueKind is JsonValueKind.Null or JsonValueKind.Undefined)
            return new List<RaceListBasicRace>();

        try
        {
            return element.Deserialize<List<RaceListBasicRace>>(options) ?? new List<RaceListBasicRace>();
        }
        catch
        {
            return new List<RaceListBasicRace>();
        }
    }
}

/// <summary>Represents a single race entry inside a series bucket.</summary>
public class RaceListBasicRace
{
    [JsonPropertyName("race_id")]
    public int? RaceId { get; set; }

    [JsonPropertyName("series_id")]
    public int? SeriesId { get; set; }

    [JsonPropertyName("race_season")]
    public int? RaceSeason { get; set; }

    [JsonPropertyName("race_name")]
    public string RaceName { get; set; } = "";

    [JsonPropertyName("race_type_id")]
    public int? RaceTypeId { get; set; }

    [JsonPropertyName("restrictor_plate")]
    public bool? RestrictorPlate { get; set; }

    [JsonPropertyName("track_id")]
    public int? TrackId { get; set; }

    [JsonPropertyName("track_name")]
    public string TrackName { get; set; } = "";

    [JsonPropertyName("date_scheduled")]
    public string DateScheduled { get; set; } = "";

    [JsonPropertyName("race_date")]
    public string RaceDate { get; set; } = "";

    [JsonPropertyName("qualifying_date")]
    public string QualifyingDate { get; set; } = "";

    [JsonPropertyName("tunein_date")]
    public string TuneinDate { get; set; } = "";

    [JsonPropertyName("scheduled_distance")]
    public double? ScheduledDistance { get; set; }

    [JsonPropertyName("actual_distance")]
    public double? ActualDistance { get; set; }

    [JsonPropertyName("scheduled_laps")]
    public int? ScheduledLaps { get; set; }

    [JsonPropertyName("actual_laps")]
    public int? ActualLaps { get; set; }

    [JsonPropertyName("stage_1_laps")]
    public int? Stage1Laps { get; set; }

    [JsonPropertyName("stage_2_laps")]
    public int? Stage2Laps { get; set; }

    [JsonPropertyName("stage_3_laps")]
    public int? Stage3Laps { get; set; }

    [JsonPropertyName("number_of_cars_in_field")]
    public int? NumberOfCarsInField { get; set; }

    [JsonPropertyName("pole_winner_driver_id")]
    public int? PoleWinnerDriverId { get; set; }

    [JsonPropertyName("pole_winner_speed")]
    public double? PoleWinnerSpeed { get; set; }

    [JsonPropertyName("number_of_lead_changes")]
    public int? NumberOfLeadChanges { get; set; }

    [JsonPropertyName("number_of_leaders")]
    public int? NumberOfLeaders { get; set; }

    [JsonPropertyName("number_of_cautions")]
    public int? NumberOfCautions { get; set; }

    [JsonPropertyName("number_of_caution_laps")]
    public int? NumberOfCautionLaps { get; set; }

    [JsonPropertyName("average_speed")]
    public double? AverageSpeed { get; set; }

    [JsonPropertyName("total_race_time")]
    public string TotalRaceTime { get; set; } = "";

    [JsonPropertyName("margin_of_victory")]
    public string MarginOfVictory { get; set; } = "";

    [JsonPropertyName("race_purse")]
    public double? RacePurse { get; set; }

    [JsonPropertyName("race_comments")]
    public string RaceComments { get; set; } = "";

    [JsonPropertyName("attendance")]
    public int? Attendance { get; set; }

    [JsonPropertyName("infractions")]
    public List<JsonElement> Infractions { get; set; } = new();

    // NOTE: schedule item shape matches the schedule objects in your other NASCAR JSONs too.
    [JsonPropertyName("schedule")]
    public List<RaceListBasicScheduleEvent> Schedule { get; set; } = new();

    [JsonPropertyName("radio_broadcaster")]
    public string RadioBroadcaster { get; set; } = "";

    [JsonPropertyName("television_broadcaster")]
    public string TelevisionBroadcaster { get; set; } = "";

    [JsonPropertyName("satellite_radio_broadcaster")]
    public string SatelliteRadioBroadcaster { get; set; } = "";

    [JsonPropertyName("master_race_id")]
    public int? MasterRaceId { get; set; }

    [JsonPropertyName("inspection_complete")]
    public bool? InspectionComplete { get; set; }

    [JsonPropertyName("playoff_round")]
    public int? PlayoffRound { get; set; }

    [JsonPropertyName("is_qualifying_race")]
    public bool? IsQualifyingRace { get; set; }

    [JsonPropertyName("qualifying_race_no")]
    public int? QualifyingRaceNo { get; set; }

    [JsonPropertyName("qualifying_race_id")]
    public int? QualifyingRaceId { get; set; }

    [JsonPropertyName("has_qualifying")]
    public bool? HasQualifying { get; set; }

    [JsonPropertyName("winner_driver_id")]
    public int? WinnerDriverId { get; set; }

    [JsonPropertyName("pole_winner_laptime")]
    public double? PoleWinnerLaptime { get; set; }

    // Any new/unknown properties on a race object go here.
    [JsonExtensionData]
    public Dictionary<string, JsonElement> ExtensionData { get; set; } = new();
}

/// <summary>Represents a scheduled event entry for a race.</summary>
public class RaceListBasicScheduleEvent
{
    [JsonPropertyName("event_name")]
    public string EventName { get; set; } = "";

    [JsonPropertyName("notes")]
    public string Notes { get; set; } = "";

    [JsonPropertyName("start_time_utc")]
    public string StartTimeUtc { get; set; } = "";

    [JsonPropertyName("run_type")]
    public int? RunType { get; set; }

    [JsonExtensionData]
    public Dictionary<string, JsonElement> ExtensionData { get; set; } = new();
}