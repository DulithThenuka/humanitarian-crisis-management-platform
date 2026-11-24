using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using HumanitarianCrisisPlatform.Application.Common.Models;
using HumanitarianCrisisPlatform.Application.DTOs.AI;
using HumanitarianCrisisPlatform.Application.Interfaces.Infrastructure;

namespace HumanitarianCrisisPlatform.API.Controllers;

[Authorize]
[Route("api/ai/assistant")]
public class AIAssistanceController : BaseApiController
{
    private readonly IAIServiceClient _aiService;
    private readonly ILogger<AIAssistanceController> _logger;

    public AIAssistanceController(IAIServiceClient aiService, ILogger<AIAssistanceController> logger)
    {
        _aiService = aiService;
        _logger = logger;
    }

    // Retained for backward compatibility
    public class AssistantQueryDto : AssistantChatRequestDto { }
    public class AssistantResponseDto : AssistantChatResponseDto { }

    [HttpPost]
    [HttpPost("chat")]
    public async Task<ActionResult<Result<AssistantChatResponseDto>>> GetGuidance(
        [FromBody] AssistantChatRequestDto request,
        CancellationToken cancellationToken)
    {
        var hasValidQuery = !string.IsNullOrWhiteSpace(request?.Query);
        var hasValidMessages = request?.Messages != null && request.Messages.Any(m => !string.IsNullOrWhiteSpace(m?.Content));

        if (!hasValidQuery && !hasValidMessages)
        {
            return BadRequest(Result<AssistantChatResponseDto>.Failure("Query or conversation messages cannot be empty."));
        }

        try
        {
            var result = await _aiService.GenerateAssistantChatAsync(request, cancellationToken);
            return Ok(Result<AssistantChatResponseDto>.Success(result));
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Unexpected error in AIAssistanceController.");
            return StatusCode(500, Result<AssistantChatResponseDto>.Failure("An unexpected error occurred while processing your request. Please try again."));
        }
    }
}
