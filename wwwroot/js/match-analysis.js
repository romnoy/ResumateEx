document.addEventListener('DOMContentLoaded', async function() {
    const personalityTypes = {
        a: { hebrewTitle: 'מבצע (Executing)', icon: '🎯' },
        b: { hebrewTitle: 'משפיע (Influencing)', icon: '🚀' },
        c: { hebrewTitle: 'בונה קשרים (Relationship Building)', icon: '❤️' },
        d: { hebrewTitle: 'חושב אסטרטגי (Strategic Thinking)', icon: '🧠' }
    };
    // 1. עדכון הודעת טעינה (כדי שהמשתמש יבין שמשהו קורה)
    document.getElementById('matchSubtitle').textContent = "ה-AI מנתח את הנתונים שלך, זה ייקח כמה שניות...";

    try {
        // 2. פנייה לשרת (לפונקציה שבנינו בקונטרולר)
        // שימי לב: אנחנו משתמשים ב-POST כי הפונקציה בשרת מוגדרת כ-[HttpPost]
        const response = await fetch('/api/Resumate/MatchAnalysis', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error('שגיאה בתקשורת עם השרת');
        }

        // 3. קבלת הנתונים (ה-DTO שיצרת)
        const data = await response.json();
        console.log("הנתונים שהתקבלו:", data); // לבדיקה בקונסול

        // 4. עדכון הציון (עם אנימציה קטנה של מספר רץ)
        animateScore(data.score);

        // 5. עדכון הטקסטים הכלליים
        document.getElementById('matchSubtitle').textContent = data.matchExplanation;
        document.getElementById('personalityType').textContent = data.personalityTitle;

        const typeKey = (data.personalityType || '').toLowerCase(); // מוודאים שזה אות קטנה ('b')
        const typeInfo = personalityTypes[typeKey]; // מחפשים במילון

        const typeEl = document.getElementById('personalityType');
        if (typeEl) {
            if (typeInfo) {
                // אם מצאנו במילון -> נציג את השם בעברית
                typeEl.textContent = typeInfo.hebrewTitle;
            } else {
                // אם לא מצאנו -> נציג את מה שהגיע מהשרת (גיבוי)
                typeEl.textContent = data.personalityType;
            }
        }

        // 6. בניית רשימת החוזקות (לתוך ה-UL שהכנו)
        renderList('strengthsList', data.strengths, true);

        // 7. בניית רשימת השיפורים
        renderList('weaknessesList', data.weaknesses, false);

    } catch (error) {
        console.error('Error:', error);
        document.getElementById('matchSubtitle').textContent = "אופס! קרתה תקלה בטעינת הנתונים.";
        document.getElementById('matchSubtitle').style.color = "red";
    }
});

// --- פונקציות עזר ---

// פונקציה שבונה את ה-HTML של הרשימות (כדי לא לכתוב פעמיים אותו קוד)
function renderList(elementId, items, isStrength) {
    const listElement = document.getElementById(elementId);
    if (!listElement || !items) return;

    listElement.innerHTML = ''; // ניקוי הרשימה

    items.forEach(item => {
        const li = document.createElement('li');

        // בחירת העיצוב המתאים (ירוק לחוזקות, כתום לשיפורים)
        const className = isStrength ? 'match-item strength' : 'match-item improvement';
        const icon = isStrength ? '✓' : '▸';

        li.className = className;
        li.innerHTML = `
            <span class="match-item-icon">${icon}</span>
            <div class="match-item-content">
                <div class="match-item-title">${item}</div>
            </div>
        `;

        listElement.appendChild(li);
    });
}

// פונקציה נחמדה שגורמת למספר "לרוץ" מ-0 עד לציון הסופי
function animateScore(finalScore) {
    const scoreElement = document.getElementById('matchScore');
    let currentScore = 0;

    const interval = setInterval(() => {
        if (currentScore >= finalScore) {
            clearInterval(interval);
        } else {
            currentScore++;
            scoreElement.textContent = currentScore;
        }
    }, 5); // מהירות הריצה (כל 20 מילישניות המספר עולה)
}