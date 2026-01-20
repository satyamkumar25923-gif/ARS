import React, { useState, useEffect } from 'react';
import SubjectCard from './components/SubjectCard';
import AddSubject from './components/AddSubject';

function App() {
  const [subjects, setSubjects] = useState(() => {
    const saved = localStorage.getItem('ars-subjects');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('ars-subjects', JSON.stringify(subjects));
  }, [subjects]);

  const addSubject = (subject) => {
    setSubjects([...subjects, { ...subject, id: Date.now() }]);
  };

  const updateAttendance = (id, type) => {
    setSubjects(subjects.map(sub => {
      if (sub.id !== id) return sub;
      const newTotal = sub.total + 1;
      const newAttended = type === 'present' ? sub.attended + 1 : sub.attended;
      return { ...sub, total: newTotal, attended: newAttended };
    }));
  };

  const deleteSubject = (id) => {
    setSubjects(subjects.filter(sub => sub.id !== id));
  };

  // Safe to bunk calculation across all subjects?
  // Maybe just show a summary header.

  return (
    <div className="app-container">
      <header style={{ marginBottom: '3rem' }}>
        <h1 style={{ marginBottom: '0.2rem' }}>ARS 🛡️</h1>
        <p style={{ fontSize: '1.2rem', color: 'var(--text-secondary)', margin: 0 }}>
          Attendance Rescue System
        </p>
        <p style={{ fontStyle: 'italic', marginTop: '0.5rem', opacity: 0.8 }}>
          "Warden se pehle warning dene wala dost" 😅
        </p>
      </header>

      <main style={{ maxWidth: '600px', margin: '0 auto' }}>

        {subjects.length === 0 && (
          <div className="card" style={{ marginBottom: '2rem', textAlign: 'center', borderStyle: 'dashed' }}>
            <h2>Welcome to ARS! 👋</h2>
            <p style={{ color: 'var(--text-secondary)' }}>
              No subjects added yet. Start by adding your subjects and current attendance.
            </p>
            <p style={{ fontSize: '0.9rem', color: 'var(--accent-primary)' }}>
              ✨ Tracks subject-wise attendance<br />
              ✨ Predicts safe bunkable days<br />
              ✨ Warns before detention
            </p>
          </div>
        )}

        <AddSubject onAdd={addSubject} />

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {subjects.map(sub => (
            <SubjectCard
              key={sub.id}
              subject={sub}
              onUpdate={updateAttendance}
              onDelete={deleteSubject}
            />
          ))}
        </div>

        <footer style={{ marginTop: '4rem', color: 'var(--text-secondary)', fontSize: '0.8rem' }}>
          <p>ARS v1.0 • Student First Tool</p>
        </footer>
      </main>
    </div>
  );
}

export default App;
