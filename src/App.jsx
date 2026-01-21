import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import SubjectCard from './components/SubjectCard';
import AddSubject from './components/AddSubject';
import DailyPlan from './components/DailyPlan';
import PendingTasks from './components/PendingTasks';
import AddEventModal from './components/AddEventModal';
import AttendanceSummary from './components/AttendanceSummary';


function PrivateRoute({ children }) {
  const { currentUser } = useAuth();
  return currentUser ? children : <Navigate to="/login" />;
}

function Dashboard() {
  const { logout, currentUser } = useAuth();
  const [subjects, setSubjects] = useState(() => {
    const saved = localStorage.getItem('ars-subjects');
    const parsed = saved ? JSON.parse(saved) : [];
    return parsed.map(s => ({ ...s, events: s.events || [], schedule: s.schedule || [] }));
  });

  const [isEventModalOpen, setEventModalOpen] = useState(false);

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem('ars-subjects', JSON.stringify(subjects));
  }, [subjects]);

  const addSubject = (subject) => {
    setSubjects([...subjects, { ...subject, id: Date.now() }]);
  };

  const addEvent = ({ subjectId, event }) => {
    setSubjects(subjects.map(sub => {
      if (sub.id !== subjectId) return sub;
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
      const today = new Date().toDateString();

      // Undo
      if (type === 'undo') {
        const last = sub.lastAction;
        if (!last || last.date !== today) return sub;

        let newTotal = sub.total;
        let newAttended = sub.attended;

        if (last.status === 'present') {
          newTotal = Math.max(0, sub.total - 1);
          newAttended = Math.max(0, sub.attended - 1);
        } else if (last.status === 'absent') {
          newTotal = Math.max(0, sub.total - 1);
        }

        return {
          ...sub,
          total: newTotal,
          attended: newAttended,
          lastAction: null
        };
      }

      // New Action
      if (sub.lastAction && sub.lastAction.date === today) return sub;

      let newTotal = sub.total;
      let newAttended = sub.attended;

      if (type === 'present') {
        newTotal = sub.total + 1;
        newAttended = sub.attended + 1;
      } else if (type === 'absent') {
        newTotal = sub.total + 1;
      }

      return {
        ...sub,
        total: newTotal,
        attended: newAttended,
        lastAction: { date: today, status: type }
      };
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

  // Helper to check if today has classes
  const todayClasses = subjects
    .filter(sub => sub.schedule && sub.schedule.includes(new Date().getDay()))
    .sort((a, b) => (a.time || '').localeCompare(b.time || ''));

  return (
    <div className="app-container" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>

      {/* Header Bar */}
      <header style={{
        padding: '0.4rem 2rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        background: '#151518', // Consistent solid background
        backdropFilter: 'blur(10px)',
        borderBottom: '1px solid rgba(255,255,255,0.05)',
        position: 'sticky',
        top: 0,
        zIndex: 1000
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <img src="/logo.png" alt="Bunkey Shield" style={{ height: '80px', marginTop: '-5px', marginBottom: '-5px' }} />
          <h1 style={{ margin: 0, fontSize: '2.4rem', background: 'linear-gradient(135deg, #a855f7, #6366f1)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', fontWeight: 'bold' }}>
            Bunkey
          </h1>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
          <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', display: 'none', '@media(min-width: 600px)': { display: 'block' } }}>
            {currentUser.email}
          </span>
          <button onClick={handleLogout} className="desktop-logout" style={{ fontSize: '0.8rem', padding: '0.4rem 0.8rem', background: 'transparent', border: '1px solid rgba(255,255,255,0.1)' }}>
            Logout
          </button>
          {/* Mobile Menu Toggle */}
          <button
            className="mobile-menu-btn"
            onClick={() => setIsMobileMenuOpen(true)}
            style={{ background: 'transparent', border: 'none', color: 'white', fontSize: '1.5rem', cursor: 'pointer', display: 'none' }}
          >
            ☰
          </button>
        </div>
      </header>

      {/* Main Grid Layout */}
      <main className="dashboard-grid" style={{
        flex: 1,
        padding: '2rem',
        maxWidth: '1600px',
        margin: '0 auto',
        width: '100%',
        boxSizing: 'border-box'
      }}>
        <style>{`
          .dashboard-grid {
            display: grid;
            grid-template-columns: 320px 1fr 300px; /* 3 Columns on large screens */
            gap: 2rem;
            align-items: start;
          }
          
          /* Mobile Menu Styles */
          .mobile-menu-btn {
             display: none;
          }

          /* Tablet & Mobile */
          @media (max-width: 1200px) {
            .dashboard-grid {
              grid-template-columns: 1fr 300px;
            }
            .dashboard-left-col {
              display: none; /* Hide left sidebar */
            }
            .mobile-menu-btn {
              display: block !important;
            }
            .desktop-logout {
              display: none;
            }
          }

          /* Mobile */
          @media (max-width: 900px) {
            .dashboard-grid {
              grid-template-columns: 1fr;
              padding: 1rem;
            }
             .dashboard-right-col {
              display: none; /* Hide right col on mobile too? Or stack it? User issue was left col */
             }
          }
        `}</style>

        {/* Mobile Menu Overlay */}
        {isMobileMenuOpen && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0,0,0,0.8)',
            backdropFilter: 'blur(5px)',
            zIndex: 2000,
            display: 'flex',
            justifyContent: 'flex-end'
          }} onClick={() => setIsMobileMenuOpen(false)}>
            <div style={{
              width: '80%',
              maxWidth: '350px',
              height: '100%',
              backgroundColor: '#18181b', // Zinc 900
              padding: '2rem',
              boxSizing: 'border-box',
              display: 'flex',
              flexDirection: 'column',
              borderLeft: '1px solid rgba(255,255,255,0.1)',
              animation: 'slideIn 0.3s ease-out'
            }} onClick={e => e.stopPropagation()}>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h2 style={{ margin: 0, fontSize: '1.5rem' }}>Menu</h2>
                <button onClick={() => setIsMobileMenuOpen(false)} style={{ background: 'transparent', border: 'none', fontSize: '1.5rem', color: 'white' }}>✕</button>
              </div>

              <div className="thin-scrollbar" style={{ marginBottom: '2rem', flex: 1, overflowY: 'auto' }}>
                <button
                  onClick={() => { setEventModalOpen(true); setIsMobileMenuOpen(false); }}
                  style={{
                    width: '100%',
                    padding: '1rem',
                    background: 'rgba(99, 102, 241, 0.1)',
                    border: '1px dashed var(--accent-primary)',
                    color: 'var(--accent-primary)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem',
                    marginBottom: '1rem'
                  }}
                >
                  <span>+</span> Add Assignment
                </button>

                <div style={{ marginBottom: '1rem' }}>
                  <h3 style={{ fontSize: '1.1rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '1px' }}>Tasks</h3>
                  <PendingTasks subjects={subjects} onToggle={toggleEvent} inline={true} />
                </div>

                {/* Also show Attendance Summary on Mobile Menu as it might be hidden */}
                <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '1rem' }}>
                  <h3 style={{ fontSize: '1.1rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '1px' }}>Status</h3>
                  <AttendanceSummary subjects={subjects} onDelete={deleteSubject} inline={true} />
                </div>
              </div>

              <button
                onClick={handleLogout}
                style={{
                  marginTop: 'auto',
                  padding: '1rem',
                  background: 'var(--bg-card)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  color: 'var(--status-danger)',
                  width: '100%',
                  fontWeight: 'bold',
                  borderRadius: '8px',
                  cursor: 'pointer'
                }}>
                Logout
              </button>

            </div>
            <style>{`
              @keyframes slideIn {
                from { transform: translateX(100%); }
                to { transform: translateX(0); }
              }
            `}</style>
          </div>
        )}

        {/* Left Column: Agenda & Tasks */}
        <aside className="dashboard-left-col">
          <div style={{ position: 'sticky', top: '100px' }}>
            <div style={{ marginBottom: '1rem' }}>
              <h3 style={{ fontSize: '1.1rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '1px' }}>Tasks</h3>
              <PendingTasks subjects={subjects} onToggle={toggleEvent} inline={true} />
            </div>

            <button
              onClick={() => setEventModalOpen(true)}
              style={{
                width: '100%',
                padding: '1rem',
                background: 'rgba(99, 102, 241, 0.1)',
                border: '1px dashed var(--accent-primary)',
                color: 'var(--accent-primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem'
              }}
            >
              <span>+</span> Add Assignment
            </button>
          </div>
        </aside>

        {/* Center Column: Plan & Classes */}
        <section className="dashboard-center-col" style={{ minWidth: 0 }}>

          {/* Daily Plan Hero */}
          <div style={{ marginBottom: '2rem' }}>
            <DailyPlan subjects={subjects} />
          </div>

          {/* Today's Classes */}
          {todayClasses.length > 0 && (
            <div style={{ marginBottom: '3rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h2 style={{ margin: 0, fontSize: '1.8rem' }}>Today's Classes</h2>
                <span style={{ background: 'var(--bg-card)', padding: '0.2rem 0.8rem', borderRadius: '12px', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                  {new Date().toLocaleDateString('en-US', { weekday: 'long' })}
                </span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
                {todayClasses.map(sub => (
                  <SubjectCard
                    key={sub.id}
                    subject={sub}
                    onUpdate={updateAttendance}
                    onDelete={deleteSubject}
                  />
                ))}
              </div>
            </div>
          )}

          {/* All Subjects List / Add Subject */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h2 style={{ margin: 0, fontSize: '1.5rem' }}>Manage Subjects</h2>
            </div>

            <AddSubject onAdd={addSubject} />

            {/* List of subjects NOT today (optional, or just list all small) */}

          </div>
        </section>

        {/* Right Column: Status & Stats */}
        <aside className="dashboard-right-col" style={{ minWidth: 0 }}>
          <div style={{ position: 'sticky', top: '100px' }}>
            <AttendanceSummary subjects={subjects} onDelete={deleteSubject} inline={true} />

            <div style={{ marginTop: '2rem', padding: '1.5rem', background: 'linear-gradient(180deg, rgba(255,255,255,0.03) 0%, transparent 100%)', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)' }}>
              <h4 style={{ margin: '0 0 1rem 0', color: 'var(--text-secondary)' }}>Pro Tip 💡</h4>
              <p style={{ fontSize: '0.9rem', lineHeight: '1.6', color: 'var(--text-secondary)' }}>
                Keep your attendance above <strong>75%</strong> to fly under the radar. Use the <em>Bunk Safe</em> calculator before skipping!
              </p>
            </div>
          </div>
        </aside>

      </main>

      <AddEventModal
        isOpen={isEventModalOpen}
        onClose={() => setEventModalOpen(false)}
        subjects={subjects}
        onSave={addEvent}
      />
    </div>
  );
}

function App() {
  return (
    <Router basename={import.meta.env.BASE_URL}>
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

