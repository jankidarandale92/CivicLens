import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { MapPin, AlertCircle, CheckCircle, Clock, Plus, X, Upload, Image as ImageIcon } from 'lucide-react';

function App() {
  const [reports, setReports] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState(null); // State for the image file
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
    
    if (!file) {
      return alert("Please upload a photo as proof of the issue.");
    }

    setLoading(true);

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(async (position) => {
        const { latitude, longitude } = position.coords;

        // Using FormData to handle the image file upload
        const data = new FormData();
        data.append('title', formData.title);
        data.append('description', formData.description);
        data.append('category', formData.category);
        data.append('latitude', latitude);
        data.append('longitude', longitude);
        data.append('address', "Location Verified via GPS");
        data.append('image', file); // Matches upload.single('image') on backend

        try {
          await axios.post('http://localhost:5000/api/reports/add', data, {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          });
          
          alert("✅ Verified Report Logged with Proof!");
          
          // Reset Form
          setFile(null);
          setFormData({ title: '', description: '', category: 'Pothole' });
          setShowForm(false);
          fetchReports();
        } catch (err) {
          console.error("Submission error:", err);
          alert("❌ Failed to submit report. Please try again.");
        } finally {
          setLoading(false);
        }
      }, (error) => {
        alert("Location access denied. Please enable GPS to report issues.");
        setLoading(false);
      });
    } else {
      alert("Your browser does not support Geolocation.");
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
          <div className="bg-white p-8 rounded-2xl shadow-xl border border-blue-100 mb-10 animate-in fade-in zoom-in duration-300">
            <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-2">
              <AlertCircle className="text-blue-600" /> Report an Issue
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input 
                  type="text" 
                  placeholder="What's the issue? (e.g. Broken Pavement)" 
                  className="p-4 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  required
                />
                <select 
                  className="p-4 bg-slate-50 border-none rounded-xl outline-none"
                  value={formData.category}
                  onChange={(e) => setFormData({...formData, category: e.target.value})}
                >
                  <option value="Pothole">Pothole</option>
                  <option value="Garbage">Garbage / Waste</option>
                  <option value="Streetlight">Streetlight Issue</option>
                  <option value="Water Leakage">Water Leakage</option>
                </select>
              </div>

              <textarea 
                placeholder="Provide a brief description of the location or problem..." 
                className="w-full p-4 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-blue-500 outline-none h-24"
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                required
              />

              {/* Upload Zone */}
              <div className="md:col-span-2">
                <label className="block text-sm font-bold text-slate-700 mb-2">Proof of Issue</label>
                <div className="relative border-2 border-dashed border-slate-300 rounded-xl p-6 bg-slate-50 hover:bg-slate-100 transition-all group text-center">
                  <input 
                    type="file" 
                    accept="image/*" 
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                    onChange={(e) => setFile(e.target.files[0])}
                    required
                  />
                  <div className="space-y-2">
                    <Upload className="mx-auto text-slate-400 group-hover:text-blue-500 transition-colors" size={32} />
                    <p className="text-slate-600 font-medium">
                      {file ? <span className="text-blue-600">Selected: {file.name}</span> : "Click to upload image proof"}
                    </p>
                    <p className="text-xs text-slate-400 font-medium">PNG or JPG preferred</p>
                  </div>
                </div>
              </div>

              <button 
                type="submit" 
                disabled={loading}
                className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-blue-700 disabled:bg-slate-300 transition-all shadow-lg shadow-blue-200"
              >
                {loading ? "Uploading Evidence..." : "Submit Verified Report"}
              </button>
            </form>
          </div>
        )}

        {/* Dashboard Feed */}
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-slate-800">Community Reports</h2>
          <div className="bg-slate-200 h-[1px] flex-grow mx-4"></div>
          <p className="text-slate-500 text-sm font-semibold">{reports.length} Verified Issues</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {reports.map((report) => (
            <div key={report._id} className="bg-white rounded-3xl overflow-hidden shadow-sm border border-slate-100 hover:shadow-xl transition-all group">
              {/* Report Image */}
              <div className="h-48 bg-slate-200 relative overflow-hidden">
                {report.imageUrl ? (
                  <img 
                    src={report.imageUrl} 
                    alt={report.title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full text-slate-400">
                    <ImageIcon size={48} />
                  </div>
                )}
                <div className="absolute top-4 left-4">
                  <span className="text-[10px] uppercase tracking-widest font-black px-3 py-1 bg-white/90 backdrop-blur shadow-sm text-blue-700 rounded-lg">
                    {report.category}
                  </span>
                </div>
              </div>

              <div className="p-6">
                <div className="flex justify-between items-center mb-3">
                  <div className={`text-[11px] font-bold px-3 py-1 rounded-full ${report.status === 'Resolved' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                    {report.status}
                  </div>
                  <div className="flex items-center gap-1 text-slate-400 text-xs">
                    <Clock size={12} />
                    {new Date(report.createdAt).toLocaleDateString()}
                  </div>
                </div>
                
                <h3 className="text-xl font-bold text-slate-900 mb-2 line-clamp-1">{report.title}</h3>
                <p className="text-slate-500 text-sm mb-6 leading-relaxed line-clamp-2">{report.description}</p>
                
                <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                  <div className="flex items-center gap-2 text-slate-600">
                    <div className="p-1.5 bg-red-50 rounded-lg">
                      <MapPin size={14} className="text-red-500" />
                    </div>
                    <span className="text-xs font-bold uppercase tracking-tighter">Live Location</span>
                  </div>
                  <button className="text-blue-600 text-xs font-bold hover:underline">View Map</button>
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