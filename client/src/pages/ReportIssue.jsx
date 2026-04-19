import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { AlertCircle, Upload, ArrowLeft, MapPin } from 'lucide-react';

function ReportIssue() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Pothole',
    address: '' // New state for manual address
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return alert("Please upload a photo as proof.");

    setLoading(true);

    // Capture GPS coordinates while user provides the manual address
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(async (position) => {
        const { latitude, longitude } = position.coords;

        const data = new FormData();
        data.append('title', formData.title);
        data.append('description', formData.description);
        data.append('category', formData.category);
        data.append('latitude', latitude);
        data.append('longitude', longitude);
        // We use the manual address provided by the user for the display/search
        data.append('address', formData.address); 
        data.append('image', file);

        try {
          await axios.post('http://localhost:5000/api/reports/add', data, {
            headers: { 'Content-Type': 'multipart/form-data' }
          });
          alert("✅ Verified Report Logged!");
          navigate('/'); 
        } catch (err) {
          console.error(err);
          alert("❌ Submission Failed.");
        } finally {
          setLoading(false);
        }
      }, (error) => {
        alert("GPS access denied. We need your coordinates to verify the report location.");
        setLoading(false);
      });
    } else {
      alert("Geolocation is not supported by your browser.");
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <button 
        onClick={() => navigate('/')}
        className="flex items-center gap-2 text-slate-500 hover:text-blue-600 mb-6 transition-colors font-bold text-sm"
      >
        <ArrowLeft size={18} /> Back to Feed
      </button>

      <div className="bg-white p-8 rounded-3xl shadow-xl border border-blue-50 mb-10 animate-in fade-in zoom-in duration-300">
        <div className="flex items-center gap-3 mb-8">
          <div className="bg-blue-100 p-3 rounded-2xl">
            <AlertCircle className="text-blue-600" size={24} />
          </div>
          <div>
            <h2 className="text-2xl font-black text-slate-800 tracking-tight">Report an Issue</h2>
            <p className="text-slate-500 text-sm font-medium">Your location will be verified via GPS</p>
          </div>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Issue Title</label>
              <input 
                type="text" 
                placeholder="e.g. Broken Pavement" 
                className="w-full p-4 bg-slate-50 border-2 border-transparent rounded-2xl focus:border-blue-500 focus:bg-white transition-all outline-none font-medium"
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Category</label>
              <select 
                className="w-full p-4 bg-slate-50 border-2 border-transparent rounded-2xl outline-none focus:border-blue-500 focus:bg-white transition-all font-medium appearance-none"
                value={formData.category}
                onChange={(e) => setFormData({...formData, category: e.target.value})}
              >
                <option value="Pothole">Pothole</option>
                <option value="Garbage">Garbage / Waste</option>
                <option value="Streetlight">Streetlight Issue</option>
                <option value="Water Leakage">Water Leakage</option>
              </select>
            </div>

            {/* NEW: Manual Address / Landmark Input */}
            <div className="md:col-span-2 space-y-2">
              <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1 flex items-center gap-1">
                <MapPin size={12} /> Location / Nearest Landmark
              </label>
              <input 
                type="text" 
                placeholder="e.g. Near Akurdi Station, Sector 24" 
                className="w-full p-4 bg-slate-50 border-2 border-transparent rounded-2xl focus:border-blue-500 focus:bg-white transition-all outline-none font-medium"
                value={formData.address}
                onChange={(e) => setFormData({...formData, address: e.target.value})}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Detailed Description</label>
            <textarea 
              placeholder="Describe the problem in detail so workers can find it..." 
              className="w-full p-4 bg-slate-50 border-2 border-transparent rounded-2xl focus:border-blue-500 focus:bg-white transition-all outline-none h-32 font-medium"
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Upload Photo Proof</label>
            <div className="relative border-2 border-dashed border-slate-200 rounded-3xl p-10 bg-slate-50 hover:bg-slate-100 hover:border-blue-300 transition-all group text-center">
              <input 
                type="file" 
                accept="image/*" 
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                onChange={(e) => setFile(e.target.files[0])}
                required
              />
              <div className="space-y-3">
                <div className="bg-white w-12 h-12 rounded-2xl shadow-sm flex items-center justify-center mx-auto group-hover:scale-110 transition-transform">
                  <Upload className="text-slate-400 group-hover:text-blue-500 transition-colors" size={24} />
                </div>
                <p className="text-slate-600 font-bold">
                  {file ? <span className="text-blue-600">Selected: {file.name}</span> : "Drop your photo here or click to browse"}
                </p>
                <p className="text-xs text-slate-400 font-medium tracking-wide">High resolution JPG/PNG preferred</p>
              </div>
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-blue-600 text-white py-5 rounded-3xl font-black text-lg hover:bg-blue-700 disabled:bg-slate-300 transition-all shadow-xl shadow-blue-100 active:scale-[0.98]"
          >
            {loading ? "Processing Verified Report..." : "Submit Verified Report"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default ReportIssue;