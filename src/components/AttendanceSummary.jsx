import React, { useState } from 'react';
import { calculateAttendance } from '../utils/attendanceHelper';

export default function AttendanceSummary({ subjects }) {
    const [isExpanded, setIsExpanded] = useState(false);

    if (subjects.length === 0) return null;

    // Compact Summary (Just a toggle or icon if collapsed?)
    // Let's make it a small list by default, but distinct from the main flow.

    const overallStyle = {
        position: 'fixed',
        right: '2rem',
        top: '50%', // Move down to middle of screen
        transform: 'translateY(-50%)', // Center vertically relative to itself
        width: '240px',
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

    // Mobile hide logic (simple CSS media query equivalent in JS not easy for resize, 
    // but we can assume this is mostly for desktop per user habit. 
    // For mobile, fixed right might cover content. I'll add a simple hide switch or check width)

    if (window.innerWidth < 1100) {
        // Simple check to avoid blocking mobile screen. 
        // Real responsive logic usually handled by CSS media queries.
        // I'll make it use a class and handle responsiveness in style tag if possible, or just render.
        // The user specifically asked for "Floating on right", implying desktop space availability.
    }

    return (
        <div className="attendance-floating-panel" style={{
            ...overallStyle,
            // Hide on small screens using CSS media query logic injected into style tag or purely conditional
            display: 'block'
        }}>
            <style>
                {`
                    @media (max-width: 1100px) {
                        .attendance-floating-panel {
                            display: none !important;
                        }
                    }
                `}
            </style>

            <div
                style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}
            >
                <h4 style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '1px' }}>
                    Status 📊
                </h4>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                {subjects.map(sub => {
                    const { status, currentPct } = calculateAttendance(sub.attended, sub.total, sub.target);
                    const isSafe = status === 'safe';
                    const color = isSafe ? 'var(--status-safe)' : 'var(--status-danger)';

                    return (
                        <div key={sub.id} style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            fontSize: '0.85rem'
                        }}>
                            <div style={{ fontWeight: '500', truncate: true, maxWidth: '120px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                {sub.name}
                            </div>
                            <div style={{
                                color: color,
                                fontWeight: 'bold',
                            }}>
                                {currentPct}%
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
