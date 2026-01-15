namespace Prog3_WebApi_Javascript.DTOs;

public class MatchAnalysisDTO
{
    // ציון (מספר שלם בין 0 ל-100)
    public int Score { get; set; }

    // רשימת החוזקות (List של מחרוזות)
    public List<string> Strengths { get; set; }

    // רשימת נקודות לשיפור
    public List<string> Weaknesses { get; set; }

    // הסבר כללי / כותרת משנה ("התאמה גבוהה מאוד...")
    public string MatchExplanation { get; set; }
    
    // אופציונלי: טיפוס האישיות (כדי להציג אותו גם במסך הזה)
    public string PersonalityType { get; set; }
}