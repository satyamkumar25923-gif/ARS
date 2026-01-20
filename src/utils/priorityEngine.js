import { isSameDay, addDays, getDay, parseISO } from 'date-fns';

/**
 * Calculate priority for a specific subject on a specific date.
 * @param {Object} subject - The subject object with attendance stats and events.
 * @param {Date} date - The date to check (usually 'tomorrow').
 * @returns {Object|null} - Priority object { score, level, reasons, color } or null if no class.
 */
export function getDailyPriority(subject, date) {
    // 1. Check if class is scheduled for this day
    // schedule is array of day indexes (0=Sun, 1=Mon, ..., 6=Sat)
    const dayIndex = getDay(date);
    if (!subject.schedule || !subject.schedule.includes(dayIndex)) {
        return null; // No class today
    }

    let pScore = 0;
    let reasons = [];

    // 2. Check for Events (Assignments/Tests) on this date
    // Events array: [{ title, type, date: 'YYYY-MM-DD', ... }]
    const eventsToday = subject.events?.filter(e => isSameDay(parseISO(e.date), date)) || [];

    if (eventsToday.length > 0) {
        pScore += 100; // Immediate High Priority
        eventsToday.forEach(e => {
            reasons.push(`${e.type === 'test' ? '📝' : '📂'} ${e.title}`);
        });
    }

    // 3. Check Attendance Risk
    // Using simple threshold for now since we have the existing math
    if (subject.attended / subject.total < (subject.target / 100)) {
        pScore += 50;
        reasons.push(`⚠️ Attendance Lagging (${((subject.attended / subject.total) * 100).toFixed(1)}%)`);
    } else {
        // Attendance is safe
        // Maybe minus score?
    }

    // Determine Level
    let level = 'LOW';
    let color = 'var(--status-safe)';
    let message = 'Bunk Safe 😎';

    if (pScore >= 100) {
        level = 'HIGH';
        color = 'var(--status-danger)';
        message = 'MUST GO 🚨';
    } else if (pScore >= 50) {
        level = 'MEDIUM';
        color = 'var(--status-warning)';
        message = 'Should Go 🤔';
    }

    return {
        subjectName: subject.name,
        pScore,
        level,
        color,
        message,
        reasons
    };
}

export const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
