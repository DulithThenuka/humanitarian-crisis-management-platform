using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using HumanitarianCrisisPlatform.Application.Common.Models;

namespace HumanitarianCrisisPlatform.API.Controllers;

[Authorize]
[Route("api/ai/assistant")]
public class AIAssistanceController : BaseApiController
{
    public class AssistantQueryDto
    {
        public string Query { get; set; } = string.Empty;
        public string? Language { get; set; }
    }

    public class AssistantResponseDto
    {
        public string Reply { get; set; } = string.Empty;
        public string Category { get; set; } = "general";
        public DateTime Timestamp { get; set; } = DateTime.UtcNow;
    }

    [HttpPost]
    public ActionResult<Result<AssistantResponseDto>> GetGuidance([FromBody] AssistantQueryDto request)
    {
        if (string.IsNullOrWhiteSpace(request?.Query))
        {
            return BadRequest(Result<AssistantResponseDto>.Failure("Query cannot be empty."));
        }

        var q = request.Query.Trim().ToLowerInvariant();
        string reply;
        string cat = "general";

        if (q.Contains("emergency") || q.Contains("danger") || q.Contains("life threat") || q.Contains("immediate help") || q.Contains("ambulance") || q.Contains("fire"))
        {
            cat = "emergency";
            reply = "WARNING: If you or someone else is in immediate physical danger or facing a life-threatening emergency, please contact your local emergency services (119 / 110 / 1990 Suwa Seriya) immediately. HumanAid Assistant cannot dispatch emergency responders directly.";
        }
        else if (q.Contains("request") || q.Contains("submit") || q.Contains("apply") || q.Contains("food") || q.Contains("medical") || q.Contains("water") || q.Contains("ration"))
        {
            cat = "requests";
            reply = "To request relief supplies or medical assistance, navigate to the 'Submit Assistance Request' tab. Fill in your required aid category, the number of people in your household, and your accurate location. An emergency coordinator will verify and schedule fulfillment.";
        }
        else if (q.Contains("status") || q.Contains("track") || q.Contains("check") || q.Contains("my request") || q.Contains("progress") || q.Contains("when"))
        {
            cat = "tracking";
            reply = "You can track the live status of all your submitted aid applications in the 'My Requests' tab. It displays real-time progression stages (Submitted, Under Review, Verified, In Progress, and Resolved) along with coordinator verification notes.";
        }
        else if (q.Contains("shelter") || q.Contains("evacuat") || q.Contains("camp") || q.Contains("safe place") || q.Contains("sleep") || q.Contains("stay"))
        {
            cat = "shelters";
            reply = "Verified evacuation shelters and community relief centres are listed under 'Find Shelters & Help Centres'. You can view available capacity, facilities (medical, food, sanitation), contact numbers, and intake status in real time.";
        }
        else if (q.Contains("alert") || q.Contains("warning") || q.Contains("flood") || q.Contains("weather") || q.Contains("tsunami") || q.Contains("broadcast"))
        {
            cat = "alerts";
            reply = "Official disaster advisories and government safety broadcasts are published under the 'Emergency Alerts' tab. Please review high-priority alerts frequently and follow regional evacuation instructions.";
        }
        else if (q.Contains("profile") || q.Contains("phone") || q.Contains("number") || q.Contains("contact") || q.Contains("address") || q.Contains("district"))
        {
            cat = "profile";
            reply = "You can update your personal contact details, mobile phone number, and residential district in 'My Profile'. Keeping your contact information current ensures field relief teams can reach you swiftly.";
        }
        else
        {
            reply = "HumanAid Assistant provides guidance on using the platform. You can submit aid requests, track existing applications in 'My Requests', locate active emergency shelters, and view real-time crisis alerts. How can I assist you with your relief needs today?";
        }

        return Ok(Result<AssistantResponseDto>.Success(new AssistantResponseDto
        {
            Reply = reply,
            Category = cat,
            Timestamp = DateTime.UtcNow
        }));
    }
}
