namespace Parabolica.Api.Nascar.Models;

using System.Text.Json;
using System.Text.Json.Serialization;

/// <summary>Represents the NASCAR weekend feed response payload.</summary>
/// <remarks>
/// Models https://cf.nascar.com/cacher/{year}/{seriesID}/{raceID}/weekend-feed.json.
/// </remarks>
public class WeekendFeedResponse
{
    [JsonPropertyName("weekend_race")]
    public List<WeekendRace> WeekendRace { get; set; } = new();

    [JsonPropertyName("weekend_runs")]
    public List<WeekendRun> WeekendRuns { get; set; } = new();

    [JsonExtensionData]
    public Dictionary<string, JsonElement> ExtensionData { get; set; } = new();
}

/// <summary>Represents a race entry within the weekend feed.</summary>
public class WeekendRace
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

    [JsonPropertyName("stage_4_laps")]
    public int? Stage4Laps { get; set; }

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

    [JsonPropertyName("results")]
    public List<WeekendRaceResult> Results { get; set; } = new();

    [JsonPropertyName("caution_segments")]
    public List<WeekendCautionSegment> CautionSegments { get; set; } = new();

    [JsonPropertyName("race_leaders")]
    public List<WeekendRaceLeader> RaceLeaders { get; set; } = new();

    // In your sample: []
    // Use JsonElement to tolerate changes in object shape if they ever populate.
    [JsonPropertyName("infractions")]
    public List<JsonElement> Infractions { get; set; } = new();

    [JsonPropertyName("schedule")]
    public List<WeekendScheduleEvent> Schedule { get; set; } = new();

    [JsonPropertyName("stage_results")]
    public List<WeekendStageResult> StageResults { get; set; } = new();

    // In your sample: []
    [JsonPropertyName("pit_reports")]
    public List<JsonElement> PitReports { get; set; } = new();

    [JsonPropertyName("radio_broadcaster")]
    public string RadioBroadcaster { get; set; } = "";

    [JsonPropertyName("television_broadcaster")]
    public string TelevisionBroadcaster { get; set; } = "";

    [JsonPropertyName("satellite_radio_broadcaster")]
    public string SatelliteRadioBroadcaster { get; set; } = "";

    [JsonPropertyName("master_race_id")]
    public int? MasterRaceId { get; set; }

    [JsonPropertyName("timing_run_id")]
    public int? TimingRunId { get; set; }

    [JsonPropertyName("inspection_complete")]
    public bool? InspectionComplete { get; set; }

    [JsonPropertyName("playoff_round")]
    public int? PlayoffRound { get; set; }

    [JsonExtensionData]
    public Dictionary<string, JsonElement> ExtensionData { get; set; } = new();
}

/// <summary>Represents a race result entry within the weekend feed.</summary>
public class WeekendRaceResult
{
    [JsonPropertyName("result_id")]
    public int? ResultId { get; set; }

    [JsonPropertyName("finishing_position")]
    public int? FinishingPosition { get; set; }

    [JsonPropertyName("starting_position")]
    public int? StartingPosition { get; set; }

    [JsonPropertyName("car_number")]
    public string CarNumber { get; set; } = "";

    [JsonPropertyName("driver_fullname")]
    public string DriverFullname { get; set; } = "";

    [JsonPropertyName("driver_id")]
    public int? DriverId { get; set; }

    [JsonPropertyName("driver_hometown")]
    public string DriverHometown { get; set; } = "";

    [JsonPropertyName("hometown_city")]
    public string HometownCity { get; set; } = "";

    [JsonPropertyName("hometown_state")]
    public string HometownState { get; set; } = "";

    [JsonPropertyName("hometown_country")]
    public string HometownCountry { get; set; } = "";

    [JsonPropertyName("team_id")]
    public int? TeamId { get; set; }

    [JsonPropertyName("team_name")]
    public string TeamName { get; set; } = "";

    [JsonPropertyName("qualifying_order")]
    public int? QualifyingOrder { get; set; }

    [JsonPropertyName("qualifying_position")]
    public int? QualifyingPosition { get; set; }

    [JsonPropertyName("qualifying_speed")]
    public double? QualifyingSpeed { get; set; }

    [JsonPropertyName("laps_led")]
    public int? LapsLed { get; set; }

    [JsonPropertyName("times_led")]
    public int? TimesLed { get; set; }

    [JsonPropertyName("car_make")]
    public string CarMake { get; set; } = "";

    [JsonPropertyName("car_model")]
    public string CarModel { get; set; } = "";

    [JsonPropertyName("sponsor")]
    public string Sponsor { get; set; } = "";

    [JsonPropertyName("points_earned")]
    public int? PointsEarned { get; set; }

    [JsonPropertyName("playoff_points_earned")]
    public int? PlayoffPointsEarned { get; set; }

    [JsonPropertyName("laps_completed")]
    public int? LapsCompleted { get; set; }

    [JsonPropertyName("finishing_status")]
    public string FinishingStatus { get; set; } = "";

    [JsonPropertyName("winnings")]
    public double? Winnings { get; set; }

    [JsonPropertyName("series_id")]
    public int? SeriesId { get; set; }

    [JsonPropertyName("race_season")]
    public int? RaceSeason { get; set; }

    [JsonPropertyName("race_id")]
    public int? RaceId { get; set; }

    [JsonPropertyName("owner_fullname")]
    public string OwnerFullname { get; set; } = "";

    [JsonPropertyName("crew_chief_id")]
    public int? CrewChiefId { get; set; }

    [JsonPropertyName("crew_chief_fullname")]
    public string CrewChiefFullname { get; set; } = "";

    [JsonPropertyName("points_position")]
    public int? PointsPosition { get; set; }

    [JsonPropertyName("points_delta")]
    public int? PointsDelta { get; set; }

    [JsonPropertyName("owner_id")]
    public int? OwnerId { get; set; }

    [JsonPropertyName("official_car_number")]
    public string OfficialCarNumber { get; set; } = "";

    [JsonPropertyName("disqualified")]
    public bool? Disqualified { get; set; }

    [JsonPropertyName("diff_laps")]
    public int? DiffLaps { get; set; }

    [JsonPropertyName("diff_time")]
    public int? DiffTime { get; set; }

    [JsonPropertyName("pit_box")]
    public int? PitBox { get; set; }

    [JsonExtensionData]
    public Dictionary<string, JsonElement> ExtensionData { get; set; } = new();
}

/// <summary>Represents a caution segment entry within a race.</summary>
public class WeekendCautionSegment
{
    [JsonPropertyName("race_id")]
    public int? RaceId { get; set; }

    [JsonPropertyName("start_lap")]
    public int? StartLap { get; set; }

    [JsonPropertyName("end_lap")]
    public int? EndLap { get; set; }

    [JsonPropertyName("reason")]
    public string Reason { get; set; } = "";

    [JsonPropertyName("comment")]
    public string Comment { get; set; } = "";

    [JsonPropertyName("beneficiary_car_number")]
    public string? BeneficiaryCarNumber { get; set; }

    [JsonPropertyName("flag_state")]
    public int? FlagState { get; set; }

    [JsonExtensionData]
    public Dictionary<string, JsonElement> ExtensionData { get; set; } = new();
}

/// <summary>Represents a lap range led by a car during a race.</summary>
public class WeekendRaceLeader
{
    [JsonPropertyName("start_lap")]
    public int? StartLap { get; set; }

    [JsonPropertyName("end_lap")]
    public int? EndLap { get; set; }

    [JsonPropertyName("car_number")]
    public string CarNumber { get; set; } = "";

    [JsonPropertyName("race_id")]
    public int? RaceId { get; set; }

    [JsonExtensionData]
    public Dictionary<string, JsonElement> ExtensionData { get; set; } = new();
}

/// <summary>Represents a scheduled event entry for the weekend.</summary>
public class WeekendScheduleEvent
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

/// <summary>Represents a stage results collection for a race.</summary>
public class WeekendStageResult
{
    [JsonPropertyName("stage_number")]
    public int? StageNumber { get; set; }

    [JsonPropertyName("results")]
    public List<WeekendStageResultEntry> Results { get; set; } = new();

    [JsonExtensionData]
    public Dictionary<string, JsonElement> ExtensionData { get; set; } = new();
}

/// <summary>Represents a driver entry within stage results.</summary>
public class WeekendStageResultEntry
{
    [JsonPropertyName("driver_fullname")]
    public string DriverFullname { get; set; } = "";

    [JsonPropertyName("driver_id")]
    public int? DriverId { get; set; }

    [JsonPropertyName("car_number")]
    public string CarNumber { get; set; } = "";

    [JsonPropertyName("finishing_position")]
    public int? FinishingPosition { get; set; }

    [JsonPropertyName("stage_points")]
    public int? StagePoints { get; set; }

    [JsonExtensionData]
    public Dictionary<string, JsonElement> ExtensionData { get; set; } = new();
}

/// <summary>Represents a run session within the weekend feed.</summary>
public class WeekendRun
{
    [JsonPropertyName("weekend_run_id")]
    public int? WeekendRunId { get; set; }

    [JsonPropertyName("race_id")]
    public int? RaceId { get; set; }

    [JsonPropertyName("timing_run_id")]
    public int? TimingRunId { get; set; }

    [JsonPropertyName("run_type")]
    public int? RunType { get; set; }

    [JsonPropertyName("run_name")]
    public string RunName { get; set; } = "";

    [JsonPropertyName("run_date")]
    public string RunDate { get; set; } = "";

    [JsonPropertyName("run_date_utc")]
    public string RunDateUtc { get; set; } = "";

    [JsonPropertyName("results")]
    public List<WeekendRunResult> Results { get; set; } = new();

    [JsonExtensionData]
    public Dictionary<string, JsonElement> ExtensionData { get; set; } = new();
}

/// <summary>Represents a run result entry within the weekend feed.</summary>
public class WeekendRunResult
{
    [JsonPropertyName("run_id")]
    public int? RunId { get; set; }

    [JsonPropertyName("car_number")]
    public string CarNumber { get; set; } = "";

    [JsonPropertyName("vehicle_number")]
    public string VehicleNumber { get; set; } = "";

    [JsonPropertyName("manufacturer")]
    public string Manufacturer { get; set; } = "";

    [JsonPropertyName("driver_id")]
    public int? DriverId { get; set; }

    [JsonPropertyName("driver_name")]
    public string DriverName { get; set; } = "";

    [JsonPropertyName("finishing_position")]
    public int? FinishingPosition { get; set; }

    [JsonPropertyName("best_lap_time")]
    public double? BestLapTime { get; set; }

    [JsonPropertyName("best_lap_speed")]
    public double? BestLapSpeed { get; set; }

    [JsonPropertyName("best_lap_number")]
    public int? BestLapNumber { get; set; }

    [JsonPropertyName("laps_completed")]
    public int? LapsCompleted { get; set; }

    [JsonPropertyName("comment")]
    public string Comment { get; set; } = "";

    [JsonPropertyName("delta_leader")]
    public double? DeltaLeader { get; set; }

    [JsonPropertyName("disqualified")]
    public bool? Disqualified { get; set; }

    [JsonExtensionData]
    public Dictionary<string, JsonElement> ExtensionData { get; set; } = new();
}