import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { AlertCircle, Upload, ArrowLeft } from 'lucide-react';

function ReportIssue() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Pothole'
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return alert("Please upload a photo as proof.");

    setLoading(true);

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(async (position) => {
        const { latitude, longitude } = position.coords;

        const data = new FormData();
        data.append('title', formData.title);
        data.append('description', formData.description);
        data.append('category', formData.category);
        data.append('latitude', latitude);
        data.append('longitude', longitude);
        data.append('address', "Location Verified via GPS");
        data.append('image', file);

        try {
          await axios.post('http://localhost:5000/api/reports/add', data, {
            headers: { 'Content-Type': 'multipart/form-data' }
          });
          alert("✅ Verified Report Logged!");
          navigate('/'); // Redirect to Home to see the new report
        } catch (err) {
          console.error(err);
          alert("❌ Submission Failed.");
        } finally {
          setLoading(false);
        }
      }, () => {
        alert("GPS access denied. Cannot verify location.");
        setLoading(false);
      });
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <button 
        onClick={() => navigate('/')}
        className="flex items-center gap-2 text-slate-500 hover:text-blue-600 mb-6 transition-colors"
      >
        <ArrowLeft size={20} /> Back to Feed
      </button>

      <div className="bg-white p-8 rounded-2xl shadow-xl border border-blue-100 animate-in fade-in zoom-in duration-300">
        <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-2">
          <AlertCircle className="text-blue-600" /> Report an Issue
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-600">Issue Title</label>
              <input 
                type="text" 
                placeholder="e.g. Broken Pavement" 
                className="w-full p-4 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-600">Category</label>
              <select 
                className="w-full p-4 bg-slate-50 border-none rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.category}
                onChange={(e) => setFormData({...formData, category: e.target.value})}
              >
                <option value="Pothole">Pothole</option>
                <option value="Garbage">Garbage / Waste</option>
                <option value="Streetlight">Streetlight Issue</option>
                <option value="Water Leakage">Water Leakage</option>
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-600">Detailed Description</label>
            <textarea 
              placeholder="Describe the problem..." 
              className="w-full p-4 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-blue-500 outline-none h-32"
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-600">Upload Photo Proof</label>
            <div className="relative border-2 border-dashed border-slate-300 rounded-xl p-8 bg-slate-50 hover:bg-slate-100 transition-all group text-center">
              <input 
                type="file" 
                accept="image/*" 
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                onChange={(e) => setFile(e.target.files[0])}
                required
              />
              <div className="space-y-2">
                <Upload className="mx-auto text-slate-400 group-hover:text-blue-500 transition-colors" size={40} />
                <p className="text-slate-600 font-medium">
                  {file ? <span className="text-blue-600 font-bold">Selected: {file.name}</span> : "Click or drag photo here"}
                </p>
                <p className="text-xs text-slate-400">PNG, JPG, or JPEG accepted</p>
              </div>
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-blue-700 disabled:bg-slate-300 transition-all shadow-lg shadow-blue-200"
          >
            {loading ? "Uploading Evidence..." : "Submit Report"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default ReportIssue;