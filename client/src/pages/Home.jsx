import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { MapPin, Clock, Image as ImageIcon, ExternalLink, ShieldCheck, AlertCircle } from 'lucide-react';

function Home() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Get current user from localStorage
  const savedUser = localStorage.getItem('user');
  const user = savedUser ? JSON.parse(savedUser) : null;
  const currentUserId = user ? user.id : null;

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

  // Community Verification Logic
  const handleVerify = async (reportId) => {
    // 1. Check if user is logged in
    if (!currentUserId) {
      alert("Please login to verify community issues!");
      navigate('/login');
      return;
    }

    try {
      const res = await axios.patch(`http://localhost:5000/api/reports/verify/${reportId}`, {
        userId: currentUserId 
      });
      
      // Update local state to show the new verification count and status
      setReports(reports.map(r => r._id === reportId ? res.data : r));
    } catch (err) {
      alert(err.response?.data?.message || "Verification failed");
    }
  };

  const formatDate = (dateString) => {
    const fallbackDate = "19 Apr 2026";
    if (!dateString) return fallbackDate;
    const date = new Date(dateString);
    return !isNaN(date.getTime()) 
      ? date.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
      : fallbackDate;
  };

  return (
    <div className="max-w-6xl mx-auto pb-12">
      {/* Header Section */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-black text-slate-800 tracking-tight uppercase">Citizen Feed</h2>
          <p className="text-slate-500 text-sm font-medium">Verify community issues to fast-track resolution</p>
        </div>
        <div className="bg-white px-5 py-2.5 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-2">
          <ShieldCheck className="text-blue-600" size={18} />
          <p className="text-blue-600 text-sm font-black tracking-tight">{reports.length} Total Reports</p>
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-24 space-y-4">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-slate-400 font-bold animate-pulse text-xs uppercase tracking-widest">Accessing Civic Ledger...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {reports.map((report) => {
            const verificationCount = report.verifiedBy?.length || 0;
            const isCommunityVerified = verificationCount >= 5;
            const hasUserVerified = report.verifiedBy?.includes(currentUserId);

            return (
              <div 
                key={report._id} 
                className={`bg-white rounded-[2.5rem] overflow-hidden shadow-sm border transition-all duration-500 group relative ${
                  isCommunityVerified ? 'border-amber-200 ring-4 ring-amber-50' : 'border-slate-100 hover:shadow-2xl'
                }`}
              >
                {/* Community Verified Ribbon */}
                {isCommunityVerified && (
                  <div className="absolute top-0 right-10 z-20 bg-amber-400 text-white px-3 py-1 rounded-b-xl text-[10px] font-black shadow-md flex items-center gap-1">
                    <ShieldCheck size={12} /> VERIFIED
                  </div>
                )}

                {/* Image Section */}
                <div className="h-52 bg-slate-200 relative overflow-hidden">
                  {report.imageUrl ? (
                    <img 
                      src={report.imageUrl} 
                      alt={report.title} 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full text-slate-300"><ImageIcon size={56} /></div>
                  )}
                  <div className="absolute top-5 left-5">
                    <span className="text-[10px] uppercase tracking-widest font-black px-4 py-1.5 bg-white/90 backdrop-blur-md shadow-xl text-blue-700 rounded-xl border border-white/20">
                      {report.category}
                    </span>
                  </div>
                </div>

                {/* Content Section */}
                <div className="p-7">
                  <div className="flex justify-between items-center mb-4">
                    <div className={`text-[10px] uppercase tracking-wider font-black px-3 py-1 rounded-lg border ${
                      report.status === 'Resolved' ? 'bg-green-50 text-green-600 border-green-100' : 
                      isCommunityVerified ? 'bg-amber-50 text-amber-600 border-amber-100' : 'bg-slate-50 text-slate-500'
                    }`}>
                      {report.status}
                    </div>
                    <div className="flex items-center gap-1.5 text-slate-400 text-xs font-bold">
                      <Clock size={14} className="text-slate-300" />
                      <span>{formatDate(report.createdAt)}</span>
                    </div>
                  </div>
                  
                  <h3 className="text-xl font-black text-slate-900 mb-2 line-clamp-1 group-hover:text-blue-600 transition-colors duration-300">
                    {report.title}
                  </h3>
                  <p className="text-slate-500 text-sm mb-6 leading-relaxed line-clamp-2 font-medium">
                    {report.description}
                  </p>
                  
                  {/* Verification Button Section */}
                  <div className="flex flex-col gap-4">
                    <button 
                      onClick={() => handleVerify(report._id)}
                      disabled={hasUserVerified && !!currentUserId}
                      className={`w-full py-3 rounded-2xl font-black text-xs uppercase tracking-widest transition-all flex items-center justify-center gap-2 border-2 ${
                        hasUserVerified && !!currentUserId
                        ? 'bg-slate-50 border-slate-100 text-slate-400 cursor-not-allowed'
                        : 'bg-white border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white shadow-lg shadow-blue-50 active:scale-95'
                      }`}
                    >
                      <ShieldCheck size={16} />
                      {hasUserVerified && !!currentUserId ? "Already Verified" : `Verify Issue (${verificationCount})`}
                    </button>

                    {/* Footer Info */}
                    <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                      <div className="flex items-center gap-2 text-slate-400 max-w-[50%]">
                        <MapPin size={14} className="text-red-400 shrink-0" />
                        <span className="text-[10px] font-bold uppercase truncate">{report.location?.address || "Location Verified"}</span>
                      </div>
                      <a 
                        href={`http://googleusercontent.com/maps.google.com/search?api=1&query=${encodeURIComponent(report.location?.address || report.title)}`}
                        target="_blank" rel="noopener noreferrer"
                        className="text-blue-600 text-xs font-black hover:underline flex items-center gap-1 bg-blue-50 px-3 py-1 rounded-lg"
                      >
                        Map <ExternalLink size={12} />
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default Home;