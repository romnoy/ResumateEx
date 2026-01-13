/**
 * Resumate Storage Manager
 * ניהול localStorage בצורה מרוכזת
 */

const ResumateStorage = {
    /**
     * שמירת ערך ב-localStorage
     */
    set(key, value) {
        try {
            if (typeof value === 'object') {
                localStorage.setItem(key, JSON.stringify(value));
            } else {
                localStorage.setItem(key, value);
            }
            return true;
        } catch (error) {
            console.error('Error saving to localStorage:', error);
            return false;
        }
    },

    /**
     * קריאת ערך מ-localStorage
     */
    get(key, parseJSON = false) {
        try {
            const value = localStorage.getItem(key);
            if (!value) return null;
            
            if (parseJSON) {
                return JSON.parse(value);
            }
            return value;
        } catch (error) {
            console.error('Error reading from localStorage:', error);
            return null;
        }
    },

    /**
     * מחיקת ערך מ-localStorage
     */
    remove(key) {
        try {
            localStorage.removeItem(key);
            return true;
        } catch (error) {
            console.error('Error removing from localStorage:', error);
            return false;
        }
    },

    /**
     * ניקוי כל נתוני Resumate
     */
    clearAll() {
        try {
            const keys = Object.values(ResumateConfig.STORAGE_KEYS);
            keys.forEach(key => localStorage.removeItem(key));
            return true;
        } catch (error) {
            console.error('Error clearing localStorage:', error);
            return false;
        }
    },

    /**
     * שמירת נתוני משרה
     */
    saveJobData(jobField, jobDescription = '') {
        this.set(ResumateConfig.STORAGE_KEYS.JOB_FIELD, jobField);
        this.set(ResumateConfig.STORAGE_KEYS.JOB_DESCRIPTION, jobDescription);
        console.log('Job data saved:', { jobField, jobDescription });
    },

    /**
     * קריאת נתוני משרה
     */
    getJobData() {
        return {
            jobField: this.get(ResumateConfig.STORAGE_KEYS.JOB_FIELD),
            jobDescription: this.get(ResumateConfig.STORAGE_KEYS.JOB_DESCRIPTION)
        };
    },

    /**
     * שמירת נתוני אישיות
     */
    savePersonality(personalityData) {
        this.set(ResumateConfig.STORAGE_KEYS.PERSONALITY, personalityData);
        console.log('Personality data saved:', personalityData);
    },

    /**
     * קריאת נתוני אישיות
     */
    getPersonality() {
        return this.get(ResumateConfig.STORAGE_KEYS.PERSONALITY, true);
    },

    /**
     * שמירת תשובות צ'אט
     */
    saveChatAnswers(answers) {
        this.set(ResumateConfig.STORAGE_KEYS.USER_NAME, answers.userName || '');
        this.set(ResumateConfig.STORAGE_KEYS.WORK_EXPERIENCE, answers.workExperience || '');
        this.set(ResumateConfig.STORAGE_KEYS.SKILLS, answers.skills || '');
        this.set(ResumateConfig.STORAGE_KEYS.EDUCATION, answers.education || '');
        console.log('Chat answers saved:', answers);
    },

    /**
     * קריאת כל תשובות הצ'אט
     */
    getChatAnswers() {
        return {
            userName: this.get(ResumateConfig.STORAGE_KEYS.USER_NAME),
            workExperience: this.get(ResumateConfig.STORAGE_KEYS.WORK_EXPERIENCE),
            skills: this.get(ResumateConfig.STORAGE_KEYS.SKILLS),
            education: this.get(ResumateConfig.STORAGE_KEYS.EDUCATION)
        };
    },

    /**
     * קריאת כל הנתונים של המשתמש
     */
    getAllData() {
        return {
            job: this.getJobData(),
            personality: this.getPersonality(),
            chat: this.getChatAnswers()
        };
    },

    /**
     * בדיקה האם כל הנתונים הדרושים קיימים
     */
    hasAllRequiredData() {
        const data = this.getAllData();
        return !!(
            data.job.jobField &&
            data.personality &&
            data.chat.userName &&
            data.chat.workExperience &&
            data.chat.skills &&
            data.chat.education
        );
    }
};

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ResumateStorage;
}
