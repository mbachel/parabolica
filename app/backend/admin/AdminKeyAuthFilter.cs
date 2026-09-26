namespace Parabolica.Api.Admin;

using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;

/// <summary>Validates the admin API key from request headers.</summary>
public class AdminKeyAuthFilter : IAsyncActionFilter
{
    private readonly IConfiguration _config;

    /// <summary>Initializes a new instance of the <see cref="AdminKeyAuthFilter"/> class.</summary>
    /// <param name="config">Configuration used to resolve the admin key.</param>
    public AdminKeyAuthFilter(IConfiguration config)
    {
        _config = config;
    }

    /// <summary>Executes the filter to validate the admin key.</summary>
    /// <param name="context">Action execution context.</param>
    /// <param name="next">Delegate to execute the next filter or action.</param>
    /// <returns>A task representing the asynchronous operation.</returns>
    public async Task OnActionExecutionAsync(ActionExecutingContext context, ActionExecutionDelegate next)
    {
        var configuredKey = _config["Admin:Key"];

        if (string.IsNullOrWhiteSpace(configuredKey))
        {
            context.Result = new StatusCodeResult(StatusCodes.Status500InternalServerError);
            return;
        }

        if (!context.HttpContext.Request.Headers.TryGetValue("X-Admin-Key", out var provided) ||
            provided.Count != 1 ||
            !string.Equals(provided[0], configuredKey, StringComparison.Ordinal))
        {
            context.Result = new UnauthorizedObjectResult(new { error = "Unauthorized" });
            return;
        }

        await next();
    }
}