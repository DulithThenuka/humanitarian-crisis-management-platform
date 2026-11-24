namespace HumanitarianCrisisPlatform.Application.DTOs.AI;

public class AssistantChatRequestDto
{
    public string? Query { get; set; }
    public List<AssistantChatMessageDto>? Messages { get; set; }
    public string? Language { get; set; }
}

public class AssistantChatMessageDto
{
    public string Role { get; set; } = "user"; // "user", "assistant", "system"
    public string Content { get; set; } = string.Empty;
}

public class AssistantChatResponseDto
{
    public string Reply { get; set; } = string.Empty;
    public string Category { get; set; } = "general";
    public string Provider { get; set; } = "Groq";
    public string Model { get; set; } = "qwen/qwen3.8-27b";
    public DateTime Timestamp { get; set; } = DateTime.UtcNow;
}
