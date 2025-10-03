import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useAuth } from './contexts/AuthContext';
import Login from './components/auth/Login';
import TaskList from './components/tasks/TaskList';
import Header from './components/common/Header';
import LoadingSpinner from './components/common/LoadingSpinner';


function AppContent() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {user ? (
        <>
          <Header />
          <main>
            <Routes>
              <Route path="/tasks" element={<TaskList />} />
              <Route path="/" element={<Navigate to="/tasks" replace />} />
            </Routes>
          </main>
        </>
      ) : (
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      )}
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 4000,
        }}
      />
    </Router>
  );
}

export default App;