import React, { useMemo } from 'react';
import { addDays, format } from 'date-fns';
import { getDailyPriority } from '../utils/priorityEngine';

export default function DailyPlan({ subjects }) {
    // Logic: Calculate "Tomorrow's" plan (or Today if user wants? User prompt said "Kal ka Plan", so Tomorrow)
    const tomorrow = useMemo(() => addDays(new Date(), 1), []);

    const priorities = useMemo(() => {
        return subjects
            .map(sub => getDailyPriority(sub, tomorrow))
            .filter(p => p !== null) // Only show subjects that have class tomorrow
            .sort((a, b) => b.pScore - a.pScore); // Sort high priority first
    }, [subjects, tomorrow]);

    if (priorities.length === 0) {
        return (
            <div className="card" style={{ marginBottom: '2rem', borderColor: 'var(--accent-primary)', position: 'relative', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '4px', background: 'var(--accent-primary)' }}></div>
                <h3>📆 Tomorrow's Plan ({format(tomorrow, 'MMM d')})</h3>
                <p style={{ color: 'var(--text-secondary)' }}>No classes scheduled for tomorrow! Enjoy your day off. 😴</p>
            </div>
        );
    }

    return (
        <div className="card" style={{ marginBottom: '2rem', borderColor: 'var(--accent-primary)', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '4px', background: 'var(--accent-primary)' }}></div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <h3 style={{ margin: 0 }}>📆 Tomorrow's Plan</h3>
                <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>{format(tomorrow, 'EEE, MMM d')}</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                {priorities.map((p, idx) => (
                    <div key={idx} style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '0.8rem',
                        backgroundColor: 'var(--bg-secondary)',
                        borderRadius: '8px',
                        borderLeft: `4px solid ${p.color}`
                    }}>
                        <div>
                            <div style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>{p.subjectName}</div>
                            {p.reasons.length > 0 && (
                                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
                                    {p.reasons.join(', ')}
                                </div>
                            )}
                        </div>
                        <div style={{ textAlign: 'right' }}>
                            <div style={{
                                color: p.color,
                                fontWeight: 'bold',
                                fontSize: '0.9rem',
                                textTransform: 'uppercase'
                            }}>
                                {p.message}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
