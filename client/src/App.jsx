import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { MapPin, AlertCircle, CheckCircle, Clock, Plus, X } from 'lucide-react';

function App() {
  const [reports, setReports] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Pothole'
  });

  // Fetch all reports from our Node.js Backend
  const fetchReports = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/reports/all');
      setReports(res.data);
    } catch (err) {
      console.error("Fetch Error:", err);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          await axios.post('http://localhost:5000/api/reports/add', {
            ...formData,
            latitude,
            longitude,
            address: "Detected via GPS"
          });
          alert("✅ Report Logged!");
          setShowForm(false);
          fetchReports();
        } catch (err) {
          alert("❌ Submission Failed.");
        } finally {
          setLoading(false);
        }
      });
    } else {
      alert("Enable GPS to report issues.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      {/* Navbar */}
      <nav className="bg-blue-700 text-white p-4 shadow-md sticky top-0 z-50">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-black tracking-tight">CIVIC<span className="text-blue-300">LENS</span></h1>
          <button 
            onClick={() => setShowForm(!showForm)}
            className="flex items-center gap-2 bg-white text-blue-700 px-5 py-2 rounded-full font-bold hover:bg-blue-50 transition-all shadow-sm"
          >
            {showForm ? <X size={20}/> : <Plus size={20}/>}
            {showForm ? "Close" : "New Report"}
          </button>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto p-6">
        {/* Animated Form Section */}
        {showForm && (
          <div className="bg-white p-8 rounded-2xl shadow-xl border border-blue-100 mb-10">
            <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-2">
              <AlertCircle className="text-blue-600" /> What's the problem?
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input 
                  type="text" 
                  placeholder="Issue Title" 
                  className="p-4 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  required
                />
                <select 
                  className="p-4 bg-slate-50 border-none rounded-xl outline-none"
                  onChange={(e) => setFormData({...formData, category: e.target.value})}
                >
                  <option value="Pothole">Pothole</option>
                  <option value="Garbage">Garbage / Waste</option>
                  <option value="Streetlight">Streetlight Issue</option>
                  <option value="Water Leakage">Water Leakage</option>
                </select>
              </div>
              <textarea 
                placeholder="Describe the issue in detail..." 
                className="w-full p-4 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-blue-500 outline-none h-32"
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                required
              />
              <button 
                type="submit" 
                disabled={loading}
                className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-blue-700 disabled:bg-slate-300 transition-all"
              >
                {loading ? "Verifying Location..." : "Submit Report"}
              </button>
            </form>
          </div>
        )}

        {/* Dashboard Feed */}
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-slate-800">Public Feed</h2>
          <p className="text-slate-500 text-sm">{reports.length} Reports active</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reports.map((report) => (
            <div key={report._id} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:border-blue-200 transition-all">
              <div className="flex justify-between items-start mb-4">
                <span className="text-[10px] uppercase tracking-widest font-black px-2 py-1 bg-blue-50 text-blue-600 rounded">
                  {report.category}
                </span>
                <span className={`text-xs font-bold px-2 py-1 rounded-full ${report.status === 'Resolved' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                  {report.status}
                </span>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">{report.title}</h3>
              <p className="text-slate-600 text-sm mb-6 leading-relaxed line-clamp-3">{report.description}</p>
              
              <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                <div className="flex items-center gap-2 text-slate-400">
                  <MapPin size={16} className="text-red-400" />
                  <span className="text-xs font-medium">GPS Linked</span>
                </div>
                <div className="text-[10px] text-slate-400 font-medium">
                  {new Date(report.createdAt).toLocaleDateString()}
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}

export default App;