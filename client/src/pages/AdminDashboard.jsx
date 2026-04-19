import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { CheckCircle, Clock, MapPin, ExternalLink, RefreshCcw } from 'lucide-react';

function AdminDashboard() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch all reports from our Node.js Backend
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

  // Update Status Logic (Pending -> Resolved)
  const handleUpdateStatus = async (id, newStatus) => {
    try {
      // Matches the PUT route: /api/reports/update-status/:id
      await axios.put(`http://localhost:5000/api/reports/update-status/${id}`, {
        status: newStatus
      });
      
      // Update local state instantly for better UX
      setReports(reports.map(r => r._id === id ? { ...r, status: newStatus } : r));
    } catch (err) {
      console.error("Update Error:", err);
      alert("Failed to update status. Please check if backend is running.");
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-black text-slate-800">Admin Panel</h2>
          <p className="text-slate-500 font-medium text-sm">Manage and resolve reported civic issues</p>
        </div>
        <button 
          onClick={fetchReports}
          className="p-2 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors text-slate-600"
          title="Refresh Data"
        >
          <RefreshCcw size={20} className={loading ? 'animate-spin' : ''} />
        </button>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="p-4 text-xs font-black uppercase text-slate-500 tracking-wider">Issue</th>
              <th className="p-4 text-xs font-black uppercase text-slate-500 tracking-wider">Category</th>
              <th className="p-4 text-xs font-black uppercase text-slate-500 tracking-wider">Location</th>
              <th className="p-4 text-xs font-black uppercase text-slate-500 tracking-wider">Status</th>
              <th className="p-4 text-xs font-black uppercase text-slate-500 tracking-wider text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {reports.map((report) => (
              <tr key={report._id} className="hover:bg-blue-50/30 transition-colors group">
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    {report.imageUrl && (
                      <img src={report.imageUrl} className="w-10 h-10 rounded-lg object-cover" alt="thumb" />
                    )}
                    <div>
                      <div className="font-bold text-slate-800">{report.title}</div>
                      <div className="text-[10px] text-slate-400 font-medium tracking-tight">ID: {report._id.slice(-6)}</div>
                    </div>
                  </div>
                </td>
                <td className="p-4">
                  <span className="text-xs font-bold px-2 py-1 bg-slate-100 text-slate-600 rounded-md">
                    {report.category}
                  </span>
                </td>
                <td className="p-4">
                  {/* Fixed Google Maps URL for exact GPS pinning */}
                  <a 
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(report.location.address)}`}
                    target="_blank" 
                    rel="noreferrer"
                    className="flex items-center gap-1 text-xs font-bold text-blue-600 hover:underline"
                  >
                    <MapPin size={14} /> Open Map <ExternalLink size={10} />
                  </a>
                </td>
                <td className="p-4">
                  <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase ${
                    report.status === 'Resolved' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
                  }`}>
                    {report.status === 'Resolved' ? <CheckCircle size={12} /> : <Clock size={12} />}
                    {report.status}
                  </div>
                </td>
                <td className="p-4 text-right">
                  {report.status !== 'Resolved' ? (
                    <button 
                      onClick={() => handleUpdateStatus(report._id, 'Resolved')}
                      className="px-4 py-1.5 bg-blue-600 text-white text-xs font-bold rounded-lg hover:bg-blue-700 shadow-md shadow-blue-100 transition-all active:scale-95"
                    >
                      Resolve
                    </button>
                  ) : (
                    <span className="text-xs font-bold text-slate-300">Closed</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {reports.length === 0 && !loading && (
          <div className="p-20 text-center text-slate-400 font-medium">
            No complaints found in the database.
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminDashboard;