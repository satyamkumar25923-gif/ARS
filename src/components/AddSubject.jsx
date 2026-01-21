import React, { useState } from 'react';
import { DAYS } from '../utils/priorityEngine';

export default function AddSubject({ onAdd }) {
    const [isOpen, setIsOpen] = useState(false);
    const [name, setName] = useState('');
    const [attended, setAttended] = useState('');
    const [total, setTotal] = useState('');
    const [target, setTarget] = useState(75);
    const [time, setTime] = useState('');
    const [schedule, setSchedule] = useState([]); // [1, 3, 5] for Mon, Wed, Fri

    const toggleDay = (index) => {
        setSchedule(prev =>
            prev.includes(index)
                ? prev.filter(d => d !== index)
                : [...prev, index]
        );
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!name || total === '' || attended === '') return;

        onAdd({
            name,
            attended: parseInt(attended),
            total: parseInt(total),
            target: parseInt(target),
            schedule,
            time,
            events: [] // Initialize empty events
        });

        // Reset
        setName('');
        setAttended('');
        setTotal('');
        setSchedule([]);
        setTime('');
        setIsOpen(false);
    };

    if (!isOpen) {
        return (
            <button
                className="btn-primary"
                onClick={() => setIsOpen(true)}
                style={{ width: '100%', padding: '1rem', fontSize: '1.1rem', marginBottom: '2rem' }}
            >
                + Add New Subject
            </button>
        );
    }

    return (
        <div className="card" style={{ marginBottom: '2rem', textAlign: 'left', borderColor: 'var(--accent-primary)' }}>
            <h3 style={{ marginTop: 0 }}>Add Subject</h3>
            <form onSubmit={handleSubmit}>
                <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Subject Name</label>
                    <input
                        type="text"
                        placeholder="e.g. DBMS"
                        value={name}
                        onChange={e => setName(e.target.value)}
                        required
                    />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Attended</label>
                        <input
                            type="number"
                            placeholder="0"
                            value={attended}
                            onChange={e => setAttended(e.target.value)}
                            min="0"
                            required
                        />
                    </div>
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Total Classes</label>
                        <input
                            type="number"
                            placeholder="0"
                            value={total}
                            onChange={e => setTotal(e.target.value)}
                            min="1"
                            required
                        />
                    </div>
                </div>

                <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Target %</label>
                    <input
                        type="number"
                        value={target}
                        onChange={e => setTarget(e.target.value)}
                        min="1" max="100"
                    />
                </div>

                {/* Time Selection - Added Back */}
                <div style={{ marginBottom: '1rem' }}>
                    <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Class Time</label>
                    <input
                        type="time"
                        value={time}
                        onChange={e => setTime(e.target.value)}
                        required
                    />
                </div>

                {/* Timetable Selection */}
                <div style={{ marginBottom: '1.5rem' }}>
                    <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Weekly Schedule (Tap days)</label>
                    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                        {DAYS.map((day, index) => (
                            <button
                                key={day}
                                type="button"
                                onClick={() => toggleDay(index)}
                                style={{
                                    padding: '0.5rem',
                                    borderRadius: '8px',
                                    border: '1px solid',
                                    borderColor: schedule.includes(index) ? 'var(--accent-primary)' : 'var(--bg-card)',
                                    backgroundColor: schedule.includes(index) ? 'var(--accent-primary)' : 'transparent',
                                    color: schedule.includes(index) ? 'white' : 'var(--text-secondary)',
                                    fontWeight: schedule.includes(index) ? 'bold' : 'normal',
                                    fontSize: '0.85rem'
                                }}
                            >
                                {day}
                            </button>
                        ))}
                    </div>
                </div>

                <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                    <button type="submit" className="btn-primary" style={{ flex: 2 }}>Save Subject</button>
                    <button type="button" onClick={() => setIsOpen(false)} style={{ flex: 1, background: 'transparent', borderColor: 'var(--bg-card)' }}>Cancel</button>
                </div>
            </form>
        </div>
    );
}
