// js/personality.js

document.addEventListener('DOMContentLoaded', function() {
    // משתנים לאלמנטים בטופס
    const submitBtn = document.getElementById('submitBtn');
    const validationMessage = document.getElementById('validationMessage');
    const assessmentForm = document.getElementById('assessmentForm'); // הוספנו משתנה לטופס

    // שדות הקלט
    const jobFieldInput = document.getElementById('jobField');
    const jobDescInput = document.getElementById('jobDescription');

    // 1. בדיקת תקינות בזמן אמת
    function checkAllFields() {
        const q1 = document.querySelector('input[name="q1"]:checked');
        const q2 = document.querySelector('input[name="q2"]:checked');
        const q3 = document.querySelector('input[name="q3"]:checked');
        const q4 = document.querySelector('input[name="q4"]:checked');

        // הגנה: אם האלמנטים לא קיימים בדף, נעצור
        if (!jobFieldInput || !submitBtn) return;

        const jobFieldFilled = jobFieldInput.value.trim().length > 0;
        const allValid = q1 && q2 && q3 && q4 && jobFieldFilled;

        submitBtn.disabled = !allValid;

        if (validationMessage) {
            if (!allValid) {
                validationMessage.classList.add('show');
                validationMessage.innerText = "אנא מלא את תחום העיסוק וענה על כל השאלות";
            } else {
                validationMessage.classList.remove('show');
            }
        }
    }

    // הוספת מאזינים לשינויים
    document.querySelectorAll('input[type="radio"]').forEach(radio => {
        radio.addEventListener('change', checkAllFields);
    });

    if(jobFieldInput) {
        jobFieldInput.addEventListener('input', checkAllFields);
    }

    // ============================================================
    // תיקון קריטי 1: חסימת שליחת טופס כללית (מונע ריענון ב-Enter)
    // ============================================================
    if (assessmentForm) {
        assessmentForm.addEventListener('submit', function(e) {
            e.preventDefault(); // חוסם את הריענון האוטומטי של הדפדפן
            return false;
        });
    }

    // ============================================================
    // תיקון קריטי 2: טיפול בלחיצה על הכפתור עם preventDefault
    // ============================================================
    if(submitBtn) {
        // הוספנו את הפרמטר 'e' לפונקציה
        submitBtn.addEventListener('click', async function(e) {

            e.preventDefault(); // רשת ביטחון למקרה שהדפדפן חושב שזה כפתור שליחה

            // אינדיקציה למשתמש
            submitBtn.innerHTML = 'מעבד נתונים... ⏳';
            submitBtn.disabled = true;

            const calculatedType = calculateType();

            const personalityData = {
                jobField: jobFieldInput.value,
                jobDescription: jobDescInput.value || "",
                personalityType: calculatedType
            };

            try {
                // מנסים לשמור בשרת
                const response = await fetch('/api/Resumate/SavePersonality', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(personalityData)
                });

                if (response.ok) {
                    console.log("נשמר בהצלחה!");
                } else {
                    console.warn("השרת לא זמין או החזיר שגיאה (מצב דמו?)");
                }

            } catch (error) {
                console.error("תקלת תקשורת:", error);
            } finally {
                // === תמיד עוברים לדף הבא ===
                setTimeout(() => {
                    window.location.href = 'chat.html';
                }, 500);
            }
        });
    }
});

// פונקציית עזר לחישוב הטיפוס
function calculateType() {
    const getVal = (name) => {
        const el = document.querySelector(`input[name="${name}"]:checked`);
        return el ? el.value : '0';
    };

    const answers = [getVal('q1'), getVal('q2'), getVal('q3'), getVal('q4')];
    const counts = {0: 0, 1: 0, 2: 0, 3: 0};

    answers.forEach(val => counts[val]++);

    let maxType = '0';
    if (counts[1] > counts[maxType]) maxType = '1';
    if (counts[2] > counts[maxType]) maxType = '2';
    if (counts[3] > counts[maxType]) maxType = '3';

    const typeMap = {'0': 'a', '1': 'b', '2': 'c', '3': 'd'};
    return typeMap[maxType];
}