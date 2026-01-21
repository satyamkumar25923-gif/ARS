import React, { useState, useMemo } from 'react';
import { format, differenceInDays, parseISO } from 'date-fns';

export default function PendingTasks({ subjects, onToggle, inline = false }) {
    const [isCollapsed, setIsCollapsed] = useState(false);

    // Aggregate all incomplete events from all subjects
    const pendingTasks = useMemo(() => {
        let tasks = [];
        subjects.forEach(sub => {
            if (sub.events) {
                sub.events.forEach(event => {
                    if (!event.completed) {
                        tasks.push({
                            ...event,
                            subjectName: sub.name,
                            subjectId: sub.id
                        });
                    }
                });
            }
        });
        // Sort by date (nearest first)
        return tasks.sort((a, b) => new Date(a.date) - new Date(b.date));
    }, [subjects]);

    if (isCollapsed && !inline) {
        return (
            <div
                onClick={() => setIsCollapsed(false)}
                style={{
                    position: 'fixed', left: 0, top: '20%',
                    backgroundColor: 'var(--bg-card)',
                    border: '1px solid var(--accent-primary)',
                    borderLeft: 'none',
                    padding: '1rem 0.5rem',
                    borderTopRightRadius: '12px',
                    borderBottomRightRadius: '12px',
                    cursor: 'pointer',
                    zIndex: 100,
                    boxShadow: '2px 0 10px rgba(0,0,0,0.3)',
                    writingMode: 'vertical-rl',
                    textOrientation: 'mixed',
                    fontWeight: 'bold',
                    color: 'var(--accent-primary)',
                    maxHeight: '300px'
                }}
            >
                {pendingTasks.length > 0 ? `🚨 ${pendingTasks.length} Pending` : '✅ All Done'}
            </div>
        );
    }

    return (
        <div style={{
            ...(inline ? {
                width: '100%',
                marginBottom: '1rem'
            } : {
                position: 'fixed', left: '20px', top: '15%', bottom: '15%',
                width: '280px',
                backgroundColor: 'var(--bg-card)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '16px',
                padding: '1.5rem',
                zIndex: 100,
                boxShadow: '5px 0 20px rgba(0,0,0,0.3)',
                backdropFilter: 'blur(10px)',
            }),
            display: 'flex', flexDirection: 'column',
            // On mobile, might need adjustment, but user asked for "left side floating page"
            ...(!inline ? { '@media(max-width: 800px)': { display: 'none' } } : {})
        }} className="floating-tasks-panel">

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <h3 style={{ margin: 0, fontSize: '1.1rem' }}>📝 Pending Work</h3>
                {!inline && (
                    <button
                        onClick={() => setIsCollapsed(true)}
                        style={{ background: 'transparent', border: 'none', padding: '0.2rem', fontSize: '1.2rem', color: 'var(--text-secondary)' }}
                    >
                        ◀
                    </button>
                )}
            </div>

            {pendingTasks.length === 0 ? (
                <div style={{ textAlign: 'center', marginTop: '2rem', opacity: 0.7 }}>
                    <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>😎</div>
                    <p>No pending work!</p>
                    <p style={{ color: 'var(--status-safe)', fontWeight: 'bold' }}>Bunk Safe Approved ✅</p>
                </div>
            ) : (
                <div style={{ overflowY: 'auto', flex: 1, paddingRight: '0.5rem' }}>
                    {pendingTasks.map(task => {
                        const daysLeft = differenceInDays(parseISO(task.date), new Date());
                        let urgencyColor = 'var(--text-secondary)';
                        if (daysLeft < 0) urgencyColor = 'var(--text-secondary)'; // Overdue
                        else if (daysLeft <= 1) urgencyColor = 'var(--status-danger)';
                        else if (daysLeft <= 3) urgencyColor = 'var(--status-warning)';

                        return (
                            <div key={`${task.subjectId}-${task.id}`} style={{
                                marginBottom: '1rem',
                                padding: '0.8rem',
                                backgroundColor: 'var(--bg-secondary)',
                                borderRadius: '8px',
                                borderLeft: `3px solid ${urgencyColor}`,
                                textAlign: 'left'
                            }}>
                                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
                                    <input
                                        type="checkbox"
                                        checked={task.completed}
                                        onChange={() => onToggle(task.subjectId, task.id)}
                                        style={{ marginTop: '0.3rem', width: '1.2rem', height: '1.2rem', cursor: 'pointer' }}
                                    />
                                    <div>
                                        <div style={{ fontWeight: '600', fontSize: '0.95rem' }}>{task.title}</div>
                                        <div style={{ fontSize: '0.8rem', color: 'var(--accent-primary)', marginBottom: '0.2rem' }}>
                                            {task.subjectName} • {task.type}
                                        </div>
                                        <div style={{ fontSize: '0.85rem', color: urgencyColor, fontWeight: '500' }}>
                                            {daysLeft < 0 ? 'Overdue ⚠️' : daysLeft === 0 ? 'Due Today 🚨' : daysLeft === 1 ? 'Due Tomorrow ⏳' : `Due in ${daysLeft} days`}
                                        </div>
                                        <div style={{ fontSize: '0.8rem', opacity: 0.7 }}>
                                            {format(parseISO(task.date), 'MMM d')}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
