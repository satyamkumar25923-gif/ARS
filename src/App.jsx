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

function Dashboard() {
  const { logout, currentUser } = useAuth();
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

  async function handleLogout() {
    try {
      await logout();
    } catch {
      console.error("Failed to log out");
    }
  }

  return (
    <div className="app-container">
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
          <button _onClick={handleLogout} onClick={handleLogout} style={{ fontSize: '0.8rem', padding: '0.4rem 0.8rem', borderColor: 'var(--bg-card)' }}>
            Logout
          </button>
        </div>
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
