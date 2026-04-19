import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home.jsx';
import ReportIssue from './pages/ReportIssue.jsx';
import AdminDashboard from './pages/AdminDashboard.jsx';
import { LayoutDashboard, PlusCircle, ShieldCheck } from 'lucide-react';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
        <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
          <div className="max-w-6xl mx-auto px-6 h-20 flex justify-between items-center">
            
            <Link to="/" className="flex items-center gap-2 group">
              <div className="bg-blue-600 p-2 rounded-xl group-hover:rotate-6 transition-transform">
                <LayoutDashboard className="text-white" size={24} />
              </div>
              <h1 className="text-2xl font-black tracking-tighter">
                CIVIC<span className="text-blue-600">LENS</span>
              </h1>
            </Link>

            <div className="flex items-center gap-3">
              <Link 
                to="/report" 
                className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-xl font-bold text-sm hover:bg-blue-700 transition-all shadow-md shadow-blue-100 active:scale-95"
              >
                <PlusCircle size={18} />
                New Report
              </Link>

              <div className="w-[1px] h-8 bg-slate-200 mx-2"></div>

              <Link 
                to="/admin" 
                className="flex items-center gap-2 text-slate-600 hover:text-blue-600 px-4 py-2.5 rounded-xl font-bold text-sm transition-colors group"
              >
                <ShieldCheck size={18} className="group-hover:text-blue-600 transition-colors" />
                Admin Panel
              </Link>
            </div>
          </div>
        </nav>

        <main className="max-w-6xl mx-auto p-6">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/report" element={<ReportIssue />} />
            <Route path="/admin" element={<AdminDashboard />} />
          </Routes>
        </main>

        <footer className="py-10 text-center text-slate-400 text-xs font-medium">
          © 2026 CivicLens Infrastructure Management
        </footer>
      </div>
    </Router>
  );
}

export default App; 