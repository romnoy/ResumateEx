document.addEventListener('DOMContentLoaded', async function() {
    console.log("--- דף התצוגה נטען (גרסה חדשה) ---");

    try {
        // 1. שליפת הנתונים
        const response = await fetch('/api/Resumate/GetAllData');
        if (!response.ok) throw new Error('השרת לא החזיר נתונים (סטטוס: ' + response.status + ')');

        const data = await response.json();
        console.log("1. הנתונים הגולמיים שהתקבלו:", data);

        // בדיקה שהמבנה תקין
        if (!data.chat || !data.chat.chatHistory) {
            throw new Error('מבנה הנתונים לא תקין - חסר chatHistory');
        }

        // 2. פירוק חכם של ההיסטוריה (מתקן בעיות של אותיות גדולות/קטנות)
        const userAnswers = data.chat.chatHistory.filter(msg => {
            // בדיקה האם המפתח הוא role או Role
            const role = msg.role || msg.Role || '';
            // המרה לאותיות קטנות והסרת רווחים כדי להיות בטוחים
            return role.toString().toLowerCase().trim() === 'user';
        });

        console.log(`2. נמצאו ${userAnswers.length} תשובות של המשתמש:`, userAnswers);

        if (userAnswers.length === 0) {
            alert("הערה: לא נמצאו תשובות משתמש בצ'אט. האם ענית על השאלות?");
        }

        // 3. הצבת הנתונים (שימוש במנגנון גיבוי ל-content/Content)

        // [0] שם מלא
        if (userAnswers[0]) {
            const name = userAnswers[0].content || userAnswers[0].Content || '';
            console.log("-> מעדכן שם ל:", name);
            updateText('resumeName', name);
        }

        // [1] ניסיון תעסוקתי
        if (userAnswers[1]) {
            const rawExp = userAnswers[1].content || userAnswers[1].Content || '';
            const expText = rawExp.replace(/\n/g, '<br>');
            updateHtml('resumeExperience', expText);
        }

        // [2] כישורים
        if (userAnswers[2]) {
            const rawSkills = userAnswers[2].content || userAnswers[2].Content || '';
            const skillsText = rawSkills.replace(/\n/g, '<br>');
            updateHtml('resumeSkills', skillsText);
        }

        // [3] השכלה
        if (userAnswers[3]) {
            const rawEdu = userAnswers[3].content || userAnswers[3].Content || '';
            const eduText = rawEdu.replace(/\n/g, '<br>');
            updateHtml('resumeEducation', eduText);
        }

        // מילוי נתונים מהשאלון
        if (data.personality) {
            // תמיכה גם ב-jobField וגם ב-JobField
            const job = data.personality.jobField || data.personality.JobField || 'מחפש עבודה';
            updateText('resumeRole', job);
            displayPersonality(data.personality);
        }

        // נתונים פיקטיביים
        updateText('resumeEmail', 'student@ruppin.ac.il');
        updateText('resumePhone', '050-1234567');

    } catch (error) {
        console.error('שגיאה קריטית:', error);
        alert("שגיאה בטעינת הנתונים: " + error.message);
    }
});

// --- פונקציות עזר ---

function updateText(id, text) {
    const el = document.getElementById(id);
    if (el) {
        el.textContent = text;
        // מוודא שהטקסט בצבע שחור נראה לעין
        el.style.color = "#1F2937";
    } else {
        console.warn(`לא נמצא אלמנט ב-HTML עם ה-ID: ${id}`);
    }
}

function updateHtml(id, html) {
    const el = document.getElementById(id);
    if (el) el.innerHTML = html;
}

const personalityTypes = {
    a: { title: 'Executing', hebrewTitle: 'ביצוע', icon: '🎯' },
    b: { title: 'Influencing', hebrewTitle: 'השפעה', icon: '🚀' },
    c: { title: 'Relationship Building', hebrewTitle: 'בניית קשרים', icon: '❤️' },
    d: { title: 'Strategic Thinking', hebrewTitle: 'חשיבה אסטרטגית', icon: '🧠' }
};

function displayPersonality(personalityData) {
    // תמיכה באותיות גדולות/קטנות בטיפוס האישיות
    const rawType = personalityData.personalityType || personalityData.PersonalityType || '';
    const typeKey = rawType.toLowerCase();

    const info = personalityTypes[typeKey];
    if (info) {
        updateText('personalityIcon', info.icon);
        updateText('personalityTitle', info.hebrewTitle);
    }
}