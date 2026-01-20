import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import SubjectCard from './components/SubjectCard';
import AddSubject from './components/AddSubject';

function PrivateRoute({ children }) {
  const { currentUser } = useAuth();
  return currentUser ? children : <Navigate to="/login" />;
}

import DailyPlan from './components/DailyPlan';
import PendingTasks from './components/PendingTasks';
import AddEventModal from './components/AddEventModal';

function Dashboard() {
  const { logout, currentUser } = useAuth();
  const [subjects, setSubjects] = useState(() => {
    // NOTE: We need to ensure existing subjects have 'events' array if loading from old localStorage
    const saved = localStorage.getItem('ars-subjects');
    const parsed = saved ? JSON.parse(saved) : [];
    return parsed.map(s => ({ ...s, events: s.events || [], schedule: s.schedule || [] }));
  });

  const [isEventModalOpen, setEventModalOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem('ars-subjects', JSON.stringify(subjects));
  }, [subjects]);

  const addSubject = (subject) => {
    setSubjects([...subjects, { ...subject, id: Date.now() }]);
  };

  const addEvent = ({ subjectId, event }) => {
    setSubjects(subjects.map(sub => {
      if (sub.id !== subjectId) return sub;
      // Ensure new events have completed: false
      return { ...sub, events: [...sub.events, { ...event, completed: false }] };
    }));
  };

  const toggleEvent = (subjectId, eventId) => {
    setSubjects(subjects.map(sub => {
      if (sub.id !== subjectId) return sub;
      return {
        ...sub,
        events: sub.events.map(e =>
          e.id === eventId ? { ...e, completed: !e.completed } : e
        )
      };
    }));
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

  async function handleLogout() {
    try {
      await logout();
    } catch {
      console.error("Failed to log out");
    }
  }

  return (
    <div className="app-container">
      {/* Pending Tasks Floating Panel */}
      <PendingTasks subjects={subjects} onToggle={toggleEvent} />

      <header style={{ marginBottom: '3rem', position: 'relative' }}>
        <h1 style={{ marginBottom: '0.2rem' }}>ARS 🛡️</h1>
        <p style={{ fontSize: '1.2rem', color: 'var(--text-secondary)', margin: 0 }}>
          Attendance Rescue System
        </p>
        <p style={{ fontStyle: 'italic', marginTop: '0.5rem', opacity: 0.8 }}>
          "Warden se pehle warning dene wala dost" 😅
        </p>

        <div style={{ position: 'absolute', top: 0, right: 0, display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'none', '@media(min-width: 600px)': { display: 'block' } }}>
            {currentUser.email}
          </span>
          <button onClick={handleLogout} style={{ fontSize: '0.8rem', padding: '0.4rem 0.8rem', borderColor: 'var(--bg-card)' }}>
            Logout
          </button>
        </div>
      </header>

      <main style={{ maxWidth: '600px', margin: '0 auto' }}>

        {/* Priority Screen / Daily Plan */}
        <DailyPlan subjects={subjects} />

        {/* Action Buttons */}
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
          <button
            onClick={() => setEventModalOpen(true)}
            style={{ flex: 1, padding: '1rem', background: 'var(--bg-card)', border: '1px dashed var(--accent-primary)', color: 'var(--accent-primary)' }}
          >
            📅 Add Assignment / Test
          </button>
        </div>

        <AddSubject onAdd={addSubject} />

        {subjects.length === 0 && (
          <div className="card" style={{ marginBottom: '2rem', textAlign: 'center', borderStyle: 'dashed' }}>
            <h2>Welcome to ARS! 👋</h2>
            <p style={{ color: 'var(--text-secondary)' }}>
              No subjects added yet. Start by adding your subjects and current attendance.
            </p>
            <p style={{ fontSize: '0.9rem', color: 'var(--accent-primary)' }}>
              ✨ New: Priority Alerts & Calendar!
            </p>
          </div>
        )}

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

        <AddEventModal
          isOpen={isEventModalOpen}
          onClose={() => setEventModalOpen(false)}
          subjects={subjects}
          onSave={addEvent}
        />

        <footer style={{ marginTop: '4rem', color: 'var(--text-secondary)', fontSize: '0.8rem' }}>
          <p>ARS v2.0 • Smart Priority Agent</p>
        </footer>
      </main>
    </div>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/"
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
          />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
