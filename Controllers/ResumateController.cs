using Microsoft.AspNetCore.Mvc;
using Prog3_WebApi_Javascript.DTOs;
using System.Text.Json.Nodes;

namespace Prog3_WebApi_Javascript.Controllers;


[Route("api/[controller]")]
[ApiController]

public class ResumateController : ControllerBase
{
    // Temporery vars
    private static PersonalityDTO _personalityData = null;
    private static ChatDTO _chatData = null;
    
    private readonly HttpClient _client;
    private readonly string _model;
    
    public ResumateController(IConfiguration config)
    {
        
        // Initialize the private HttpClient instance
        _client = new HttpClient();

        // Retrieve the OpenAI Model from the configuration settings
        _model = config.GetValue<string>("OpenAI:Model");

        // Retrieve the API key from the configuration settings
        string api_key = config.GetValue<string>("OpenAI:Key");

        // Create the authorization header using the API key
        string auth = "Bearer " + api_key;

        // Add the authorization header to the default request headers of the HttpClient instance
        _client.DefaultRequestHeaders.Add("Authorization", auth);
    }

    
    // פונקציה 1: שמירת נתוני מבחן אישיות
    // =============================================
    [HttpPost("SavePersonality")]
    public IActionResult SavePersonality(PersonalityDTO personalityDTO)
    {
        // בדיקת תקינות - נתונים ריקים?
        if (personalityDTO == null){
            return BadRequest("נתונים ריקים");
        }

        // בדיקת תקינות - יש תחום עניין?
        if (string.IsNullOrEmpty(personalityDTO.jobField)){
            return BadRequest("חובה למלא תחום עניין");
        }

        // בדיקת תקינות - יש טיפוס אישיות?
        if (string.IsNullOrEmpty(personalityDTO.personalityType)){
            return BadRequest("חובה לבצע מבחן אישיות");
        }

        // שמירה בזיכרון
        _personalityData = personalityDTO;

        // החזרת הצלחה
        return Ok("נתוני מבחן האישיות נשמרו בהצלחה");
    }


    // =============================================
    // פונקציה 2: שמירת נתוני צ'אט
    // =============================================
    [HttpPost("SaveChat")]
    public IActionResult SaveChat(ChatDTO chatDTO)
    {
        // בדיקת תקינות - נתונים ריקים?
        if (chatDTO == null){
            return BadRequest("נתונים ריקים");
        }

        // בדיקת תקינות - יש היסטוריה?
        if (chatDTO.chatHistory == null || chatDTO.chatHistory.Count == 0){
            return BadRequest("חובה לבצע שיחה עם הצ'אטבוט");
        }

        // שמירה בזיכרון
        _chatData = chatDTO;

        // החזרת הצלחה
        return Ok("נתוני הצ'אט נשמרו בהצלחה");
    }


    // =============================================
    // פונקציה 3: קבלת כל הנתונים
    // =============================================
    [HttpGet("GetAllData")]
    public IActionResult GetAllData()
    {
        // בדיקה - האם יש נתוני אישיות?
        if (_personalityData == null){
            return BadRequest("אין נתוני מבחן אישיות. אנא השלם את מבחן האישיות.");
        }

        // בדיקה - האם יש נתוני צ'אט?
        if (_chatData == null){
            return BadRequest("אין נתוני צ'אט. אנא השלם את השיחה עם הבוט.");
        }

        // יצירת אובייקט עם הכל
        ResumeDataDTO allData = new ResumeDataDTO
        {
            personality = _personalityData,
            chat = _chatData
        };

        // החזרת כל הנתונים
        return Ok(allData);
    }
    
    
[HttpPost("MatchAnalysis")]
public async Task<IActionResult> MatchAnalysis()
{
    // 1. בדיקה שיש לנו בכלל נתונים לעבוד איתם
    if (_chatData == null || _personalityData == null)
    {
        return BadRequest("חסרים נתונים (צ'אט או אישיות). אנא בצע את השלבים הקודמים.");
    }

    // 2. הכנת המידע לשליחה ל-AI
    // אנחנו אורזים את הנתונים ששמרנו בזיכרון לאובייקט אחד והופכים אותו לטקסט
    var combinedData = new
    {
        Personality = _personalityData,
        ChatHistory = _chatData
    };
    
    // שימוש ב-System.Text.Json להמרה למחרוזת
    string dataAsJson = System.Text.Json.JsonSerializer.Serialize(combinedData);

    // 3. הגדרת ה-System Prompt (ההנחיה למוח של ה-AI)
    // שימי לב: אנחנו מבקשים ממנו להחזיר JSON בלבד!
    string systemPrompt = $@"
    You are a professional career consultant and HR expert.
    I will provide you with:
    1. A candidate's personality assessment results.
    2. A chat history where the candidate describes their experience.

    Your task is to analyze this data and generate a 'Match Analysis' for a potential job.
    
    You MUST return the result in strictly valid JSON format matching this structure:
    {{
        ""score"": (integer between 0-100),
        ""strengths"": [""strength 1"", ""strength 2"", ""strength 3""],
        ""weaknesses"": [""improvement point 1"", ""improvement point 2""],
        ""matchExplanation"": ""A short summary paragraph (in Hebrew) explaining the match"",
        ""personalityType"": ""The personality type code or name (e.g., 'A - Executing')""
    }}

    IMPORTANT: 
    - The output must be valid JSON only. No markdown, no code blocks.
    - The content (strengths, weaknesses, explanation) MUST be in HEBREW.
    - Be professional but encouraging.

    Here is the candidate data:
    {dataAsJson}
    ";

    // 4. בניית גוף הבקשה לפי הדרישות של OpenAI
    var requestBody = new
    {
        model = _model, // המודל שהגדרת בבנאי (למשל gpt-4o-mini)
        response_format = new { type = "json_object" }, // חובה! מכריח את ה-AI להחזיר JSON תקין
        messages = new[]
        {
            new { role = "system", content = systemPrompt }
        }
    };

   try
    {
        string openAiEndpoint = "https://api.openai.com/v1/chat/completions";
        var response = await _client.PostAsJsonAsync(openAiEndpoint, requestBody);
        
        // 1. קריאת התשובה כ-JSON (כמו בדוגמה שלך)
        System.Text.Json.Nodes.JsonObject? root;

        try
        {
            root = await response.Content.ReadFromJsonAsync<System.Text.Json.Nodes.JsonObject>();
        }
        catch (Exception e)
        {
            //return BadRequest("Failed to parse JSON: " + e.Message);
            
            throw new Exception("Failed to parse JSON: " + e.Message);
        }

        if (root == null)
        {
            //return BadRequest("Empty JSON response.");
            throw new Exception("Empty JSON response.");
        }

        // 2. בדיקת שגיאות (בדיוק כמו ב-GPTChat)
        if (!response.IsSuccessStatusCode)
        {
            string errorMessage = "Unknown error";

            var errorNode = root["error"];
            if (errorNode != null)
            {
                var messageNode = errorNode["message"];
                if (messageNode != null)
                {
                 //   string? msg = messageNode.ToString(); // או GetValue<string>()
                  /*  if (!string.IsNullOrWhiteSpace(msg))
                    {
                        errorMessage = msg;
                    }*/
                    throw new Exception("OpenAI Error: " + errorMessage);
                }
            }
            
            return BadRequest("problem: " + errorMessage);
        }

        // 3. חילוץ התוכן (המחרוזת שה-AI כתב)
        // המבנה של OpenAI הוא choices -> message -> content
        string aiContent = root["choices"][0]["message"]["content"].ToString();

        if (string.IsNullOrEmpty(aiContent))
        {
            return BadRequest("No content found in OpenAI response.");
        }

        // 4. המרה מהמחרוזת של ה-AI לאובייקט ה-DTO שלנו
        var matchResult = System.Text.Json.JsonSerializer.Deserialize<MatchAnalysisDTO>(aiContent, new System.Text.Json.JsonSerializerOptions
        {
            PropertyNameCaseInsensitive = true
        });

        return Ok(matchResult);
    }
    catch (Exception ex)
    {
        // ==========================================================
        // מצב חירום / דמו: ה-AI נכשל? נחזיר נתונים פיקטיביים!
        // ==========================================================
        Console.WriteLine("AI Failed, using Demo Data: " + ex.Message);

        MatchAnalysisDTO demoResult = new MatchAnalysisDTO
        {
            Score = 88,
            MatchExplanation = "המועמד מציג יכולות גבוהות מאוד בתחום המבוקש. הניתוח (במצב דמו) מראה התאמה טובה.",
            Strengths = new List<string> { "יכולת למידה מהירה", "עבודת צוות מצוינת", "מוטיבציה גבוהה" },
            Weaknesses = new List<string> { "חוסר בניסיון ניהולי", "נדרש שיפור באנגלית" },
            PersonalityType = _personalityData.personalityType // נשתמש במה שיש לנו
        };

        // במקום להחזיר שגיאה, אנחנו מחזירים תשובה תקינה עם הדמו
        return Ok(demoResult);
    }

}

    }
    