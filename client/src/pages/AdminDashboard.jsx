import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { CheckCircle, Clock, MapPin, ExternalLink, RefreshCcw, LayoutPanelLeft, Trash2 } from 'lucide-react';

function AdminDashboard() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchReports = async () => {
    setLoading(true);
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

  const formatDate = (dateString) => {
    if (!dateString) return 'Pending...';
    const date = new Date(dateString);
    return !isNaN(date.getTime()) 
      ? date.toLocaleDateString('en-IN', {
          day: '2-digit',
          month: 'short',
          year: 'numeric'
        })
      : 'Invalid Date';
  };

  const handleUpdateStatus = async (id, newStatus) => {
    try {
      await axios.put(`http://localhost:5000/api/reports/update-status/${id}`, {
        status: newStatus
      });
      setReports(reports.map(r => r._id === id ? { ...r, status: newStatus } : r));
    } catch (err) {
      console.error("Update Error:", err);
      alert("Failed to update status.");
    }
  };

  // --- NEW: Delete Logic ---
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this report permanently?")) {
      try {
        await axios.delete(`http://localhost:5000/api/reports/delete/${id}`);
        // Remove from local state
        setReports(reports.filter(r => r._id !== id));
      } catch (err) {
        console.error("Delete Error:", err);
        alert("Failed to delete report.");
      }
    }
  };

  return (
    <div className="max-w-6xl mx-auto pb-10">
      <div className="flex items-center justify-between mb-10">
        <div className="flex items-center gap-4">
          <div className="bg-slate-900 p-3 rounded-2xl shadow-lg shadow-slate-200">
            <LayoutPanelLeft className="text-white" size={28} />
          </div>
          <div>
            <h2 className="text-3xl font-black text-slate-800 tracking-tight">Admin Console</h2>
            <p className="text-slate-400 font-bold text-sm">Reviewing {reports.length} total submissions</p>
          </div>
        </div>
        <button 
          onClick={fetchReports}
          className="group flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 hover:border-blue-500 rounded-xl transition-all shadow-sm active:scale-95"
          title="Refresh Feed"
        >
          <span className="text-sm font-bold text-slate-600 group-hover:text-blue-600 transition-colors">Sync Data</span>
          <RefreshCcw size={18} className={`text-slate-400 group-hover:text-blue-600 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      <div className="bg-white rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/50 border-b border-slate-100">
              <th className="p-6 text-[10px] font-black uppercase text-slate-400 tracking-[0.2em]">Issue Details</th>
              <th className="p-6 text-[10px] font-black uppercase text-slate-400 tracking-[0.2em]">Category</th>
              <th className="p-6 text-[10px] font-black uppercase text-slate-400 tracking-[0.2em]">Location Search</th>
              <th className="p-6 text-[10px] font-black uppercase text-slate-400 tracking-[0.2em]">Status & Date</th>
              <th className="p-6 text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {reports.map((report) => (
              <tr key={report._id} className="hover:bg-blue-50/20 transition-all group">
                <td className="p-6">
                  <div className="flex items-center gap-4">
                    {report.imageUrl ? (
                      <img src={report.imageUrl} className="w-12 h-12 rounded-xl object-cover shadow-sm ring-2 ring-slate-50" alt="proof" />
                    ) : (
                      <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center text-slate-300">
                        <Clock size={20} />
                      </div>
                    )}
                    <div>
                      <div className="font-black text-slate-800 text-sm group-hover:text-blue-600 transition-colors">{report.title}</div>
                      <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">Ref: {report._id.slice(-6)}</div>
                    </div>
                  </div>
                </td>

                <td className="p-6">
                  <span className="text-[10px] font-black px-3 py-1 bg-slate-100 text-slate-500 rounded-lg uppercase tracking-wider">
                    {report.category}
                  </span>
                </td>

                <td className="p-6">
                  <a 
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(report.location?.address || report.title)}`}
                    target="_blank" 
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 text-xs font-bold text-blue-600 hover:text-blue-800 transition-colors bg-blue-50/50 px-3 py-1.5 rounded-xl border border-blue-100/50"
                  >
                    <MapPin size={14} className="text-red-500" /> 
                    <span className="max-w-[150px] truncate">{report.location?.address || "Open Location"}</span>
                    <ExternalLink size={12} className="opacity-40" />
                  </a>
                </td>

                <td className="p-6">
                  <div className="space-y-1">
                    <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wide ${
                      report.status === 'Resolved' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
                    }`}>
                      {report.status === 'Resolved' ? <CheckCircle size={12} /> : <Clock size={12} />}
                      {report.status}
                    </div>
                    <div className="flex items-center gap-1.5 text-[10px] text-slate-400 font-bold ml-1">
                      {report.createdAt ? 
                        new Date(report.createdAt).toLocaleDateString('en-IN', {
                          day: '2-digit',
                          month: 'short'
                        }) : 'Today'}
                    </div>
                  </div>
                </td>

                {/* --- Updated Actions Section --- */}
                <td className="p-6 text-right">
                  <div className="flex items-center justify-end gap-3">
                    {report.status !== 'Resolved' ? (
                      <button 
                        onClick={() => handleUpdateStatus(report._id, 'Resolved')}
                        className="px-4 py-2 bg-blue-600 text-white text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-slate-900 transition-all active:scale-95 shadow-md shadow-blue-100"
                      >
                        Resolve
                      </button>
                    ) : (
                      <span className="text-slate-300 font-black text-[10px] uppercase tracking-widest italic flex items-center gap-1">
                        <CheckCircle size={12}/> Closed
                      </span>
                    )}
                    
                    <button 
                      onClick={() => handleDelete(report._id)}
                      className="p-2 text-slate-300 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all active:scale-90"
                      title="Delete Report"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {loading && (
          <div className="p-20 text-center">
            <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-slate-400 font-bold text-sm animate-pulse uppercase tracking-widest">Querying MongoDB...</p>
          </div>
        )}

        {reports.length === 0 && !loading && (
          <div className="p-24 text-center">
            <div className="bg-slate-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
               <Clock className="text-slate-200" size={32} />
            </div>
            <p className="text-slate-800 font-black text-lg">No Active Complaints</p>
            <p className="text-slate-400 text-sm font-medium mt-1">Everything looks clean!</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminDashboard;