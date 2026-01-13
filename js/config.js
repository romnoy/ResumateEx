/**
 * Resumate Configuration File
 * הגדרות כלליות של המערכת
 */

const ResumateConfig = {
    // localStorage keys
    STORAGE_KEYS: {
        JOB_FIELD: 'resumate_jobField',
        JOB_DESCRIPTION: 'resumate_jobDescription',
        PERSONALITY: 'resumate_personality',
        USER_NAME: 'resumate_userName',
        WORK_EXPERIENCE: 'resumate_workExperience',
        SKILLS: 'resumate_skills',
        EDUCATION: 'resumate_education'
    },

    // טיפוסי אישיות
    PERSONALITY_TYPES: {
        a: {
            title: 'Executing',
            hebrewTitle: 'ביצוע',
            icon: '🎯',
            description: 'אתה איש/אשת ביצוע! אתה מצטיין בהפיכת רעיונות למציאות. אנשים סומכים עליך להשלים משימות ולהוביל תהליכים לסיום מוצלח.',
            traits: [
                { title: 'ממוקד תוצאות', desc: 'אתה מונע על ידי השגת מטרות מוחשיות' },
                { title: 'מאורגן ומתודי', desc: 'אוהב מבנה, סדר ושגרה קבועה' },
                { title: 'אמין ואחראי', desc: 'אפשר לסמוך עליך להשלים מה שהתחלת' },
                { title: 'מעשי ופרקטי', desc: 'מעדיף פעולה על פני תיאוריה' }
            ],
            roles: 'תפקידים מומלצים: מנהל פרויקטים, מנהל תפעול, רכז לוגיסטיקה, מפקח איכות',
            keywords: ['ביצוע', 'מנהל', 'פרויקט', 'תפעול', 'לוגיסטיקה']
        },
        b: {
            title: 'Influencing',
            hebrewTitle: 'השפעה',
            icon: '🚀',
            description: 'אתה איש/אשת השפעה! אתה מצטיין בשכנוע אחרים, מוביל יזמות ומניע אנשים לפעולה. אתה נולדת למנהיגות.',
            traits: [
                { title: 'כריזמטי ומשפיע', desc: 'יודע לשכנע ולהוביל אנשים' },
                { title: 'תחרותי ונחוש', desc: 'אוהב אתגרים ומניע לזכייה' },
                { title: 'בטוח בעצמו', desc: 'לא מפחד לקחת סיכונים ולהוביל' },
                { title: 'בעל חזון', desc: 'רואה הזדמנויות ויוצר שינוי' }
            ],
            roles: 'תפקידים מומלצים: מנהל מכירות, יזם, מנכ"ל, מנהל שיווק',
            keywords: ['מכירות', 'שיווק', 'יזם', 'מנכל', 'עסקי']
        },
        c: {
            title: 'Relationship Building',
            hebrewTitle: 'בניית קשרים',
            icon: '❤️',
            description: 'אתה בונה/בונה קשרים מעולה! אתה מצטיין ביצירת אווירה חיובית, בתמיכה באחרים ובחיבור בין אנשים. אתה דבק הצוות.',
            traits: [
                { title: 'אמפתי ותומך', desc: 'מבין ומעריך את רגשות האחרים' },
                { title: 'שיתופי פעולה', desc: 'מעדיף עבודת צוות על פני עבודה עצמאית' },
                { title: 'מחבר אנשים', desc: 'יוצר תקשורת ויחסים חזקים' },
                { title: 'מאזין פעיל', desc: 'נותן תשומת לב אמיתית לצרכי אחרים' }
            ],
            roles: 'תפקידים מומלצים: מנהל משאבי אנוש, יועץ ארגוני, מתאם צוות, רכז קהילה',
            keywords: ['משאבי אנוש', 'HR', 'שירות', 'לקוחות', 'רכז']
        },
        d: {
            title: 'Strategic Thinking',
            hebrewTitle: 'חשיבה אסטרטגית',
            icon: '🧠',
            description: 'אתה חושב/חושבת אסטרטגי! אתה מצטיין בניתוח, בפתרון בעיות מורכבות ובתכנון ארוך טווח. אתה רואה את התמונה הגדולה.',
            traits: [
                { title: 'אנליטי ומעמיק', desc: 'בודק דברים לעומק ומבין מערכות מורכבות' },
                { title: 'חשיבה עצמאית', desc: 'מעדיף לחקור ולחשוב בעצמו' },
                { title: 'חדשני ויצירתי', desc: 'מוצא פתרונות מקוריים לבעיות' },
                { title: 'ראיית עתיד', desc: 'מתכנן קדימה ורואה השלכות ארוכות טווח' }
            ],
            roles: 'תפקידים מומלצים: אסטרטג עסקי, חוקר, יועץ, מנהל פיתוח מוצר',
            keywords: ['אסטרטגי', 'יועץ', 'חוקר', 'אנליסט', 'פיתוח', 'תכנות']
        }
    },

    // שאלות הצ'אט
    CHAT_QUESTIONS: [
        {
            key: 'userName',
            text: 'היי! שמי רזומי 👋\n\nמה שמך?'
        },
        {
            key: 'workExperience',
            text: 'נעים מאוד להכיר! 😊\n\nבואי נתחיל: ספרי לי על הניסיון התעסוקתי שלך. איזה תפקידים היו לך? באילו חברות? מתי?'
        },
        {
            key: 'skills',
            text: 'מעולה! תודה על המידע 👍\n\nעכשיו, ספרי לי על הכישורים שלך:\n• כישורים טכניים (תוכנות, כלים, טכנולוגיות)\n• כישורים רכים (עבודת צוות, ניהול זמן, תקשורת וכו\')'
        },
        {
            key: 'education',
            text: 'נהדר! כמעט סיימנו 🎯\n\nשאלה אחרונה: ספרי לי על ההשכלה שלך. תארים, קורסים, הכשרות - כל מה שרלוונטי!'
        }
    ],

    // הגדרות ניתוח התאמה
    MATCH_ANALYSIS: {
        BASE_SCORE: 70,
        PERSONALITY_MATCH_BONUS: 15,
        DATA_ONLY_BONUS: 5,
        MAX_SCORE: 95
    }
};

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ResumateConfig;
}
