import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { MapPin, Clock, Image as ImageIcon, ExternalLink } from 'lucide-react';

function Home() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch all reports from our Node.js Backend
  const fetchReports = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/reports/all');
      setReports(res.data);
    } catch (err) {
      console.error("Fetch Error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header Section */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 tracking-tight">Community Feed</h2>
          <p className="text-slate-500 text-sm">Real-time civic issues reported by citizens</p>
        </div>
        <div className="bg-white px-4 py-2 rounded-2xl shadow-sm border border-slate-100">
          <p className="text-blue-600 text-sm font-black">{reports.length} Verified Issues</p>
        </div>
      </div>

      {/* Grid Layout */}
      {loading ? (
        <div className="text-center py-20 text-slate-400 font-medium animate-pulse">
          Loading community reports...
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {reports.map((report) => (
            <div key={report._id} className="bg-white rounded-3xl overflow-hidden shadow-sm border border-slate-100 hover:shadow-xl transition-all duration-300 group">
              
              {/* Report Image Section */}
              <div className="h-48 bg-slate-200 relative overflow-hidden">
                {report.imageUrl ? (
                  <img 
                    src={report.imageUrl} 
                    alt={report.title} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full text-slate-400">
                    <ImageIcon size={48} />
                  </div>
                )}
                
                {/* Category Badge */}
                <div className="absolute top-4 left-4">
                  <span className="text-[10px] uppercase tracking-widest font-black px-3 py-1 bg-white/90 backdrop-blur shadow-sm text-blue-700 rounded-lg">
                    {report.category}
                  </span>
                </div>
              </div>

              {/* Content Section */}
              <div className="p-6">
                <div className="flex justify-between items-center mb-3">
                  {/* Status Badge */}
                  <div className={`text-[11px] font-bold px-3 py-1 rounded-full ${
                    report.status === 'Resolved' 
                    ? 'bg-green-100 text-green-700' 
                    : 'bg-amber-100 text-amber-700'
                  }`}>
                    {report.status}
                  </div>
                  {/* Timestamp */}
                  <div className="flex items-center gap-1 text-slate-400 text-xs">
                    <Clock size={12} />
                    {new Date(report.createdAt).toLocaleDateString()}
                  </div>
                </div>
                
                <h3 className="text-xl font-bold text-slate-900 mb-2 line-clamp-1 group-hover:text-blue-600 transition-colors">
                  {report.title}
                </h3>
                <p className="text-slate-500 text-sm mb-6 leading-relaxed line-clamp-2">
                  {report.description}
                </p>
                
                {/* Footer Link Section */}
                <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                  <div className="flex items-center gap-2 text-slate-600">
                    <div className="p-1.5 bg-red-50 rounded-lg">
                      <MapPin size={14} className="text-red-500" />
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-tighter">Verified Area</span>
                  </div>
                  
                  {/* Fixed Map Redirection URL */}
                  <a 
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(report.location.address)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 text-xs font-bold hover:underline flex items-center gap-1 bg-blue-50 px-3 py-1.5 rounded-lg transition-colors hover:bg-blue-100"
                  >
                    View Map <ExternalLink size={12} />
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {!loading && reports.length === 0 && (
        <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-slate-200">
          <p className="text-slate-400 font-medium">No civic issues reported yet. Be the first!</p>
        </div>
      )}
    </div>
  );
}

export default Home;