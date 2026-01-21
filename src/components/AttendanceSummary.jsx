import React, { useState } from 'react';
import { calculateAttendance } from '../utils/attendanceHelper';

export default function AttendanceSummary({ subjects, onDelete, inline = false }) {
    const [isExpanded, setIsExpanded] = useState(false);
    const [confirmDeleteId, setConfirmDeleteId] = useState(null);

    if (subjects.length === 0) return null;

    const overallStyle = {
        position: 'fixed',
        right: '2rem',
        top: '50%', // Move down to middle of screen
        transform: 'translateY(-50%)', // Center vertically relative to itself
        width: '260px',
        background: 'var(--bg-card)',
        borderRadius: '16px',
        boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
        zIndex: 100,
        padding: '1.2rem',
        border: '1px solid var(--text-secondary)',
        borderColor: 'rgba(255,255,255,0.05)',
        maxHeight: '60vh',
        overflowY: 'auto'
    };

    const handleDeleteClick = (id) => {
        if (confirmDeleteId === id) {
            onDelete(id);
            setConfirmDeleteId(null);
        } else {
            setConfirmDeleteId(id);
            setTimeout(() => setConfirmDeleteId(null), 3000);
        }
    };

    return (
        <div className="attendance-floating-panel" style={{
            ...overallStyle,
            display: 'block',
            ...(inline ? {
                position: 'relative',
                right: 'auto',
                top: 'auto',
                transform: 'none',
                width: '100%',
                maxHeight: 'none',
                boxShadow: 'none',
                background: 'transparent',
                border: 'none',
                padding: 0
            } : {})
        }}>
            {!inline && (
                <style>
                    {`
                        @media (max-width: 1100px) {
                            .attendance-floating-panel {
                                display: none !important;
                            }
                        }
                    `}
                </style>
            )}

            <div
                style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}
            >
                <h4 style={{ margin: 0, fontSize: '1.2rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '1px' }}>
                    Status 📊
                </h4>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
                {subjects.map(sub => {
                    const { status, currentPct } = calculateAttendance(sub.attended, sub.total, sub.target);
                    const isSafe = status === 'safe';
                    const color = isSafe ? 'var(--status-safe)' : 'var(--status-danger)';

                    return (
                        <div key={sub.id} style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            fontSize: '1.1rem'
                        }}>
                            <div style={{ fontWeight: '500', truncate: true, maxWidth: '120px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', flex: 1, marginRight: '8px' }}>
                                {sub.name}
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <div style={{
                                    color: color,
                                    fontWeight: 'bold',
                                }}>
                                    {currentPct}%
                                </div>
                                <button
                                    onClick={() => handleDeleteClick(sub.id)}
                                    style={{
                                        padding: '0.3rem 0.6rem', // Larger touch target
                                        fontSize: '1rem', // Bigger X
                                        background: confirmDeleteId === sub.id ? 'var(--status-danger)' : 'rgba(255,255,255,0.05)',
                                        color: confirmDeleteId === sub.id ? 'white' : 'var(--text-secondary)',
                                        border: 'none',
                                        cursor: 'pointer',
                                        borderRadius: '4px',
                                        minWidth: '24px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        lineHeight: 1
                                    }}
                                    title="Delete Subject"
                                >
                                    {confirmDeleteId === sub.id ? 'Delete' : '×'}
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>

            {!isExpanded && subjects.length > 5 && (
                <div style={{ textAlign: 'center', fontSize: '0.7rem', color: 'var(--text-secondary)', marginTop: '0.5rem' }}>
                    Scroll for more
                </div>
            )}
        </div>
    );
}
