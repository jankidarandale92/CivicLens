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

  // Updated Helper function to handle safe date formatting
  const formatDate = (dateString) => {
    // Current Date for Fallback (19 Apr 2026)
    const fallbackDate = "19 Apr 2026";
    
    if (!dateString) return fallbackDate;
    
    const date = new Date(dateString);
    
    // Safety check: If the date is valid, format it; otherwise, use fallback
    return !isNaN(date.getTime()) 
      ? date.toLocaleDateString('en-IN', {
          day: '2-digit',
          month: 'short',
          year: 'numeric'
        })
      : fallbackDate;
  };

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header Section */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 tracking-tight">Community Feed</h2>
          <p className="text-slate-500 text-sm font-medium">Real-time civic issues reported by citizens</p>
        </div>
        <div className="bg-white px-5 py-2.5 rounded-2xl shadow-sm border border-slate-100">
          <p className="text-blue-600 text-sm font-black tracking-tight">
            {reports.length} Verified Issues
          </p>
        </div>
      </div>

      {/* Grid Layout */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-24 space-y-4">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-slate-400 font-bold animate-pulse text-xs uppercase tracking-widest">Syncing with Civic Database...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {reports.map((report) => (
            <div key={report._id} className="bg-white rounded-[2.5rem] overflow-hidden shadow-sm border border-slate-100 hover:shadow-2xl hover:-translate-y-1 transition-all duration-500 group">
              
              {/* Report Image Section */}
              <div className="h-52 bg-slate-200 relative overflow-hidden">
                {report.imageUrl ? (
                  <img 
                    src={report.imageUrl} 
                    alt={report.title} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full text-slate-300">
                    <ImageIcon size={56} strokeWidth={1.5} />
                  </div>
                )}
                
                {/* Category Badge */}
                <div className="absolute top-5 left-5">
                  <span className="text-[10px] uppercase tracking-[0.15em] font-black px-4 py-1.5 bg-white/90 backdrop-blur-md shadow-xl text-blue-700 rounded-xl border border-white/20">
                    {report.category}
                  </span>
                </div>
              </div>

              {/* Content Section */}
              <div className="p-7">
                <div className="flex justify-between items-center mb-4">
                  {/* Status Badge */}
                  <div className={`text-[10px] uppercase tracking-wider font-black px-3 py-1 rounded-lg border ${
                    report.status === 'Resolved' 
                    ? 'bg-green-50 text-green-600 border-green-100' 
                    : 'bg-amber-50 text-amber-600 border-amber-100'
                  }`}>
                    {report.status}
                  </div>
                  
                  {/* Robust Timestamp Applied Here */}
                  <div className="flex items-center gap-1.5 text-slate-400 text-xs font-bold">
                    <Clock size={14} className="text-slate-300" />
                    <span>{formatDate(report.createdAt)}</span>
                  </div>
                </div>
                
                <h3 className="text-xl font-black text-slate-900 mb-2 line-clamp-1 group-hover:text-blue-600 transition-colors duration-300">
                  {report.title}
                </h3>
                <p className="text-slate-500 text-sm mb-8 leading-relaxed line-clamp-2 font-medium">
                  {report.description}
                </p>
                
                {/* Footer Link Section */}
                <div className="flex items-center justify-between pt-5 border-t border-slate-50">
                  <div className="flex items-center gap-2.5 text-slate-600 max-w-[55%]">
                    <div className="p-2 bg-red-50 rounded-xl shrink-0">
                      <MapPin size={16} className="text-red-500" />
                    </div>
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-tight truncate">
                      {report.location?.address || "Verified Area"}
                    </span>
                  </div>
                  
                  {/* Fixed Search-based Map Redirection */}
                  <a 
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(report.location?.address || report.title)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 text-xs font-black hover:underline flex items-center gap-1.5 bg-blue-50 px-4 py-2 rounded-xl transition-all hover:bg-blue-600 hover:text-white group/btn shadow-sm"
                  >
                    View Map 
                    <ExternalLink size={14} className="group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {!loading && reports.length === 0 && (
        <div className="text-center py-24 bg-white rounded-[3rem] border-2 border-dashed border-slate-100">
          <div className="bg-slate-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
            <ImageIcon className="text-slate-300" size={32} />
          </div>
          <h3 className="text-slate-800 font-bold text-lg">No issues reported yet</h3>
          <p className="text-slate-400 text-sm mt-1">Be the hero your community needs!</p>
        </div>
      )}
    </div>
  );
}

export default Home;