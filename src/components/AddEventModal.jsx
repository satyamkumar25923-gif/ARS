import React, { useState } from 'react';

export default function AddEventModal({ isOpen, onClose, subjects, onSave }) {
    const [title, setTitle] = useState('');
    const [type, setType] = useState('assignment'); // assignment, test, other
    const [date, setDate] = useState('');
    const [selectedSubjectId, setSelectedSubjectId] = useState('');

    if (!isOpen) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!selectedSubjectId || !date || !title) return;

        onSave({
            subjectId: parseInt(selectedSubjectId),
            event: {
                id: Date.now() + Math.random(),
                title,
                type,
                date
            }
        });

        // Reset partly
        setTitle('');
        setDate('');
        // Keep subject selected for ease? No, let's reset or keep user preference? Let's reset.
        onClose();
    };

    return (
        <div style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.8)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            zIndex: 1000
        }}>
            <div className="card" style={{ width: '90%', maxWidth: '400px', textAlign: 'left' }}>
                <h3 style={{ marginTop: 0 }}>Add Academic Event 📅</h3>

                <form onSubmit={handleSubmit}>
                    {/* Subject Select */}
                    <div style={{ marginBottom: '1rem' }}>
                        <label style={{ display: 'block', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>Subject</label>
                        <select
                            value={selectedSubjectId}
                            onChange={e => setSelectedSubjectId(e.target.value)}
                            style={{
                                width: '100%', padding: '0.8rem',
                                background: 'var(--bg-secondary)', color: 'white',
                                border: '1px solid var(--bg-card)', borderRadius: '8px'
                            }}
                            required
                        >
                            <option value="">Select Subject...</option>
                            {subjects.map(s => (
                                <option key={s.id} value={s.id}>{s.name}</option>
                            ))}
                        </select>
                    </div>

                    {/* Event Type */}
                    <div style={{ marginBottom: '1rem' }}>
                        <label style={{ display: 'block', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>Type</label>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                            {['assignment', 'test', 'exam'].map(t => (
                                <button
                                    key={t}
                                    type="button"
                                    onClick={() => setType(t)}
                                    style={{
                                        flex: 1,
                                        padding: '0.6rem',
                                        textTransform: 'capitalize',
                                        background: type === t ? 'var(--accent-primary)' : 'var(--bg-secondary)',
                                        color: type === t ? 'white' : 'var(--text-secondary)',
                                        border: '1px solid var(--bg-card)'
                                    }}
                                >
                                    {t}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Title */}
                    <div style={{ marginBottom: '1rem' }}>
                        <label style={{ display: 'block', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>Title</label>
                        <input
                            type="text"
                            placeholder="e.g. Unit 2 Quiz"
                            value={title}
                            onChange={e => setTitle(e.target.value)}
                            required
                        />
                    </div>

                    {/* Date */}
                    <div style={{ marginBottom: '1.5rem' }}>
                        <label style={{ display: 'block', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>Due Date</label>
                        <input
                            type="date"
                            value={date}
                            onChange={e => setDate(e.target.value)}
                            required
                            style={{ colorScheme: 'dark' }}
                        />
                    </div>

                    <div style={{ display: 'flex', gap: '1rem' }}>
                        <button type="submit" className="btn-primary" style={{ flex: 1 }}>Add Event</button>
                        <button type="button" onClick={onClose} style={{ flex: 1, background: 'transparent' }}>Cancel</button>
                    </div>

                </form>
            </div>
        </div>
    );
}
