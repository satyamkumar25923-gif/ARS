import React, { useState } from 'react';
import { calculateAttendance } from '../utils/attendanceHelper';

export default function SubjectCard({ subject, onUpdate, onDelete }) {
    const { name, attended, total, target } = subject;
    const result = calculateAttendance(attended, total, target);

    const [isDeleting, setIsDeleting] = useState(false);

    const isSafe = result.status === 'safe';
    const statusColor = isSafe ? 'var(--status-safe)' : 'var(--status-danger)';

    const handleDelete = () => {
        if (isDeleting) {
            onDelete(subject.id);
        } else {
            setIsDeleting(true);
            setTimeout(() => setIsDeleting(false), 3000); // Reset after 3s
        }
    };

    return (
        <div className="card" style={{ textAlign: 'left', position: 'relative', borderLeft: `4px solid ${statusColor}` }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <h3 style={{ margin: 0, fontSize: '1.25rem' }}>{name}</h3>
                <span style={{
                    fontSize: '0.9rem',
                    padding: '0.25rem 0.5rem',
                    borderRadius: '4px',
                    backgroundColor: isSafe ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)',
                    color: statusColor,
                    fontWeight: 'bold'
                }}>
                    {result.currentPct}%
                </span>
            </div>

            <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
                <div>
                    <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Attended</span>
                    <div style={{ fontSize: '1.1rem', fontWeight: 600 }}>{attended}/{total}</div>
                </div>
                <div>
                    <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Target</span>
                    <div style={{ fontSize: '1.1rem', fontWeight: 600 }}>{target}%</div>
                </div>
            </div>

            <div style={{ marginBottom: '1.5rem', padding: '1rem', background: 'var(--bg-secondary)', borderRadius: '8px' }}>
                {isSafe ? (
                    <p style={{ margin: 0, color: 'var(--status-safe)' }}>
                        You can safely bunk <strong>{result.bunkable}</strong> classes! 🎉
                    </p>
                ) : (
                    <p style={{ margin: 0, color: 'var(--status-danger)' }}>
                        ⚠️ Status: <strong>{result.riskLevel}</strong><br />
                        You MUST attend <strong>{result.needed}</strong> continuous classes to reach {target}%.
                    </p>
                )}
            </div>

            <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button
                    onClick={() => onUpdate(subject.id, 'present')}
                    style={{ flex: 1, backgroundColor: 'rgba(16, 185, 129, 0.1)', color: 'var(--status-safe)', borderColor: 'var(--status-safe)' }}
                >
                    Present ✅
                </button>
                <button
                    onClick={() => onUpdate(subject.id, 'absent')}
                    style={{ flex: 1, backgroundColor: 'rgba(239, 68, 68, 0.1)', color: 'var(--status-danger)', borderColor: 'var(--status-danger)' }}
                >
                    Absent ❌
                </button>
            </div>

            <button
                onClick={handleDelete}
                style={{
                    position: 'absolute',
                    top: '1rem',
                    right: '1rem',
                    background: isDeleting ? 'var(--status-danger)' : 'transparent',
                    border: isDeleting ? 'none' : 'none',
                    color: isDeleting ? 'white' : 'var(--text-secondary)',
                    padding: '0.3rem 0.6rem',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '0.9rem',
                    fontWeight: 'bold',
                    transition: 'all 0.2s'
                }}
                title="Delete Subject"
            >
                {isDeleting ? "Sure?" : "🗑️"}
            </button>
        </div>
    );
}
