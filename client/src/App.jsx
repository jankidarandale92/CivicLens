import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home.jsx';
import ReportIssue from './pages/ReportIssue.jsx';
import AdminDashboard from './pages/AdminDashboard.jsx';
import Login from './pages/Login.jsx';
import Signup from './pages/Signup.jsx';
import { LayoutDashboard, PlusCircle, ShieldCheck, LogIn, UserPlus, LogOut, User } from 'lucide-react';

function App() {
  const [user, setUser] = useState(null);

  // Check if user is logged in on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    window.location.href = '/login';
  };

  return (
    <Router>
      <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
        <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
          <div className="max-w-6xl mx-auto px-6 h-20 flex justify-between items-center">
            
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 group">
              <div className="bg-blue-600 p-2 rounded-xl group-hover:rotate-6 transition-transform">
                <LayoutDashboard className="text-white" size={24} />
              </div>
              <h1 className="text-2xl font-black tracking-tighter">
                CIVIC<span className="text-blue-600">LENS</span>
              </h1>
            </Link>

            {/* Navigation Links */}
            <div className="flex items-center gap-3">
              {/* Common Links */}
              <Link 
                to="/report" 
                className="flex items-center gap-2 text-slate-600 hover:text-blue-600 px-4 py-2.5 rounded-xl font-bold text-sm transition-colors"
              >
                <PlusCircle size={18} />
                New Report
              </Link>

              {/* Conditional Rendering based on Auth State */}
              {!user ? (
                <>
                  <div className="w-[1px] h-8 bg-slate-200 mx-2"></div>
                  <Link 
                    to="/login" 
                    className="flex items-center gap-2 text-slate-600 hover:text-blue-600 px-4 py-2.5 rounded-xl font-bold text-sm transition-colors"
                  >
                    <LogIn size={18} />
                    Login
                  </Link>
                  <Link 
                    to="/signup" 
                    className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-xl font-bold text-sm hover:bg-blue-700 transition-all shadow-md shadow-blue-100 active:scale-95"
                  >
                    <UserPlus size={18} />
                    Sign Up
                  </Link>
                </>
              ) : (
                <>
                  {/* Admin specific link */}
                  {user.role === 'admin' && (
                    <Link 
                      to="/admin" 
                      className="flex items-center gap-2 text-slate-600 hover:text-blue-600 px-4 py-2.5 rounded-xl font-bold text-sm transition-colors group"
                    >
                      <ShieldCheck size={18} className="group-hover:text-blue-600 transition-colors" />
                      Admin Panel
                    </Link>
                  )}

                  <div className="w-[1px] h-8 bg-slate-200 mx-2"></div>

                  {/* User Profile & Logout */}
                  <div className="flex items-center gap-4 bg-slate-50 px-4 py-2 rounded-2xl border border-slate-100">
                    <div className="flex items-center gap-2">
                      <div className="bg-blue-100 p-1.5 rounded-lg">
                        <User size={16} className="text-blue-600" />
                      </div>
                      <span className="text-sm font-black text-slate-700 uppercase tracking-tight">
                        {user.name.split(' ')[0]}
                      </span>
                    </div>
                    <button 
                      onClick={handleLogout}
                      className="text-slate-400 hover:text-red-500 transition-colors"
                      title="Logout"
                    >
                      <LogOut size={18} />
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <main className="max-w-6xl mx-auto p-6 min-h-[calc(100vh-160px)]">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/report" element={<ReportIssue />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
          </Routes>
        </main>

        <footer className="py-10 text-center text-slate-400 text-[10px] font-black uppercase tracking-[0.2em]">
          © 2026 CivicLens Infrastructure Management • PCCOE SEM 6
        </footer>
      </div>
    </Router>
  );
}

export default App;