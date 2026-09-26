namespace Parabolica.Api.Nascar.Models;

using System.Text.Json;
using System.Text.Json.Serialization;

/// <summary>Represents the NASCAR live feed response payload.</summary>
/// <remarks>
/// Models https://cf.nascar.com/live/feeds/live-feed.json.
/// </remarks>
public class LiveFeedResponse
{
    [JsonPropertyName("lap_number")]
    public int? LapNumber { get; set; }

    [JsonPropertyName("elapsed_time")]
    public int? ElapsedTime { get; set; }

    [JsonPropertyName("flag_state")]
    public int? FlagState { get; set; }

    [JsonPropertyName("race_id")]
    public int? RaceId { get; set; }

    [JsonPropertyName("laps_in_race")]
    public int? LapsInRace { get; set; }

    [JsonPropertyName("laps_to_go")]
    public int? LapsToGo { get; set; }

    [JsonPropertyName("vehicles")]
    public List<Vehicle> Vehicles { get; set; } = new();

    [JsonPropertyName("run_id")]
    public int? RunId { get; set; }

    //set default value to empty string to avoid null
    [JsonPropertyName("run_name")]
    public string RaceName { get; set; } = "";

    [JsonPropertyName("series_id")]
    public int? SeriesId { get; set; }

    [JsonPropertyName("time_of_day")]
    public int? TimeOfDay { get; set; }

    [JsonPropertyName("time_of_day_os")]
    public string TimeOfDayOs { get; set; } = "";

    [JsonPropertyName("track_id")]
    public int? TrackId { get; set; }

    [JsonPropertyName("track_length")]
    public double? TrackLength { get; set; }

    [JsonPropertyName("track_name")]
    public string TrackName { get; set; } = "";

    //run_type: 1=Practice, 2=Qualifying, 3=Race
    [JsonPropertyName("run_type")]
    public int? RunType { get; set; }

    [JsonPropertyName("number_of_caution_segments")]
    public int? NumberOfCautionSegments { get; set; }

    [JsonPropertyName("number_of_caution_laps")]
    public int? NumberOfCautionLaps { get; set; }

    [JsonPropertyName("number_of_lead_changes")]
    public int? NumberOfLeadChanges { get; set; }

    [JsonPropertyName("number_of_leaders")]
    public int? NumberOfLeaders { get; set; }

    [JsonPropertyName("avg_diff_1to3")]
    public int? AvgDiff1To3 { get; set; }

    [JsonPropertyName("stage")]
    public Stage Stage { get; set; } = new();

    // Capture any new/unknown properties added by NASCAR without breaking deserialization.
    [JsonExtensionData]
    public Dictionary<string, JsonElement> ExtensionData { get; set; } = new();
}

/// <summary>Represents a vehicle entry in the live feed.</summary>
public class Vehicle
{
    [JsonPropertyName("average_restart_speed")]
    public double? AverageRestartSpeed { get; set; }

    [JsonPropertyName("average_running_position")]
    public double? AverageRunningPosition { get; set; }

    [JsonPropertyName("average_speed")]
    public double? AverageSpeed { get; set; }

    [JsonPropertyName("best_lap")]
    public int? BestLap { get; set; }

    [JsonPropertyName("best_lap_speed")]
    public double? BestLapSpeed { get; set; }

    [JsonPropertyName("best_lap_time")]
    public double? BestLapTime { get; set; }

    [JsonPropertyName("vehicle_manufacturer")]
    public string VehicleManufacturer { get; set; } = "";

    [JsonPropertyName("vehicle_number")]
    public string VehicleNumber { get; set; } = "";

    [JsonPropertyName("driver")]
    public Driver Driver { get; set; } = new();

    [JsonPropertyName("vehicle_elapsed_time")]
    public double? VehicleElapsedTime { get; set; }

    [JsonPropertyName("fastest_laps_run")]
    public int? FastestLapsRun { get; set; }

    [JsonPropertyName("laps_position_improved")]
    public int? LapsPositionImproved { get; set; }

    [JsonPropertyName("laps_completed")]
    public int? LapsCompleted { get; set; }

    [JsonPropertyName("laps_led")]
    public List<LapsLed> LapsLed { get; set; } = new();

    [JsonPropertyName("last_lap_speed")]
    public double? LastLapSpeed { get; set; }

    [JsonPropertyName("last_lap_time")]
    public double? LastLapTime { get; set; }

    [JsonPropertyName("passes_made")]
    public int? PassesMade { get; set; }

    [JsonPropertyName("passing_differential")]
    public int? PassingDifferential { get; set; }

    [JsonPropertyName("position_differential_last_10_percent")]
    public int? PositionDifferentialLast10Percent { get; set; }

    [JsonPropertyName("pit_stops")]
    public List<PitStop> PitStops { get; set; } = new();

    [JsonPropertyName("qualifying_status")]
    public int? QualifyingStatus { get; set; }

    [JsonPropertyName("running_position")]
    public int? RunningPosition { get; set; }

    [JsonPropertyName("status")]
    public int? Status { get; set; }

    [JsonPropertyName("delta")]
    public double? Delta { get; set; }

    [JsonPropertyName("sponsor_name")]
    public string SponsorName { get; set; } = "";

    [JsonPropertyName("starting_position")]
    public int? StartingPosition { get; set; }

    [JsonPropertyName("times_passed")]
    public int? TimesPassed { get; set; }

    [JsonPropertyName("quality_passes")]
    public int? QualityPasses { get; set; }

    [JsonPropertyName("is_on_track")]
    public bool? IsOnTrack { get; set; }

    [JsonPropertyName("is_on_dvp")]
    public bool? IsOnDvp { get; set; }

    [JsonExtensionData]
    public Dictionary<string, JsonElement> ExtensionData { get; set; } = new();
}

/// <summary>Represents driver identity details in the live feed.</summary>
public class Driver
{
    [JsonPropertyName("driver_id")]
    public int? DriverId { get; set; }

    [JsonPropertyName("full_name")]
    public string DriverName { get; set; } = "";

    [JsonPropertyName("first_name")]
    public string FirstName { get; set; } = "";

    [JsonPropertyName("last_name")]
    public string LastName { get; set; } = "";

    [JsonPropertyName("is_in_chase")]
    public bool? IsInChase { get; set; }

    [JsonExtensionData]
    public Dictionary<string, JsonElement> ExtensionData { get; set; } = new();
}

/// <summary>Represents a continuous lap range led by a vehicle.</summary>
public class LapsLed
{
    [JsonPropertyName("start_lap")]
    public int? StartLap { get; set; }

    [JsonPropertyName("end_lap")]
    public int? EndLap { get; set; }

    [JsonExtensionData]
    public Dictionary<string, JsonElement> ExtensionData { get; set; } = new();
}

/// <summary>Represents a pit stop entry for a vehicle.</summary>
public class PitStop
{
    [JsonPropertyName("positions_gained_lossed")]
    public int? PositionsGainedLossed { get; set; }

    [JsonPropertyName("pit_in_elapsed_time")]
    public double? PitInElapsedTime { get; set; }

    [JsonPropertyName("pit_in_lap_count")]
    public int? PitInLapCount { get; set; }

    [JsonPropertyName("pit_in_leader_lap")]
    public int? PitInLeaderLap { get; set; }

    [JsonPropertyName("pit_out_elapsed_time")]
    public double? PitOutElapsedTime { get; set; }

    [JsonPropertyName("pit_in_rank")]
    public int? PitInRank { get; set; }

    [JsonPropertyName("pit_out_rank")]
    public int? PitOutRank { get; set; }

    [JsonExtensionData]
    public Dictionary<string, JsonElement> ExtensionData { get; set; } = new();
}

/// <summary>Represents stage metadata for the live feed.</summary>
public class Stage
{
    [JsonPropertyName("stage_num")]
    public int? StageNum { get; set; }

    [JsonPropertyName("finish_at_lap")]
    public int? FinishAtLap { get; set; }

    [JsonPropertyName("laps_in_stage")]
    public int? LapsInStage { get; set; }

    [JsonExtensionData]
    public Dictionary<string, JsonElement> ExtensionData { get; set; } = new();
}