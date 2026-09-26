namespace Parabolica.Api.Admin;

using Microsoft.AspNetCore.Mvc;

/// <summary>Base controller for admin endpoints protected by admin key auth.</summary>
[ApiController]
[ServiceFilter(typeof(AdminKeyAuthFilter))]
public abstract class AdminControllerBase : ControllerBase
{
}