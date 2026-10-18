using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using HumanitarianCrisisPlatform.Application.Common.Models;
using HumanitarianCrisisPlatform.Application.DTOs.AI;
using HumanitarianCrisisPlatform.Application.Interfaces.Services;

namespace HumanitarianCrisisPlatform.API.Controllers;

[Authorize(Roles = "Coordinator,Admin")]
public class AIReviewController : BaseApiController
{
    private readonly IAIDecisionService _aiService;

    public AIReviewController(IAIDecisionService aiService)
    {
        _aiService = aiService;
    }

    [HttpPost("override")]
    public async Task<ActionResult<Result<bool>>> OverrideDecision([FromBody] HumanOverrideDto dto)
    {
        dto.Action = "Override";
        var result = await _aiService.ProcessHumanOverrideAsync(dto, CurrentUserId);
        return Ok(result);
    }

    [HttpPost("approve")]
    public async Task<ActionResult<Result<bool>>> ApproveDecision([FromBody] HumanOverrideDto dto)
    {
        dto.Action = "Approve";
        var result = await _aiService.ProcessHumanOverrideAsync(dto, CurrentUserId);
        return Ok(result);
    }
}
