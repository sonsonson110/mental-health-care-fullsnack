using System.Diagnostics.Metrics;

namespace Application.Meters;

public class ChatbotMeter
{
    public Meter Meter { get; init; }
    public Counter<int> CallCounter { get; init; }
    public Counter<int> InitCounter { get; init; }
    
    public static readonly string MeterName = "Application.ChatbotMeter";

    public ChatbotMeter()
    {
        Meter = new Meter(MeterName, "1.0.0");
        CallCounter = Meter.CreateCounter<int>("chatbot.calls", description: "Chatbot calls to Gemini API");
        InitCounter = Meter.CreateCounter<int>("chatbot.inits", description: "Chatbot inits");
    }
}