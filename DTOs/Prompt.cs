namespace Prog3_WebApi_Javascript.DTOs;

public class Prompt
{
    public string prompt { get; set; }
    public ResumeDataDTO userData { get; set; }
    public List<ChatMessage> input { get; set; } = new List<ChatMessage>();

}