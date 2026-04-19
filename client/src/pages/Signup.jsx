import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { UserPlus, Mail, Lock, User } from 'lucide-react';

function Signup() {
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/auth/signup', formData);
      alert("Account created successfully! Please login.");
      navigate('/login');
    } catch (err) {
      alert(err.response?.data?.message || "Signup failed");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20 bg-white p-10 rounded-[2.5rem] shadow-xl border border-slate-100">
      <div className="text-center mb-8">
        <div className="bg-blue-50 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 text-blue-600">
          <UserPlus size={32} />
        </div>
        <h2 className="text-3xl font-black text-slate-800">Join CivicLens</h2>
        <p className="text-slate-400 font-medium">Start reporting and verifying issues</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="relative">
          <User className="absolute left-4 top-3.5 text-slate-400" size={18} />
          <input 
            type="text" placeholder="Full Name" 
            className="w-full pl-12 pr-4 py-3 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 font-medium"
            onChange={(e) => setFormData({...formData, name: e.target.value})}
            required
          />
        </div>
        <div className="relative">
          <Mail className="absolute left-4 top-3.5 text-slate-400" size={18} />
          <input 
            type="email" placeholder="Email Address" 
            className="w-full pl-12 pr-4 py-3 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 font-medium"
            onChange={(e) => setFormData({...formData, email: e.target.value})}
            required
          />
        </div>
        <div className="relative">
          <Lock className="absolute left-4 top-3.5 text-slate-400" size={18} />
          <input 
            type="password" placeholder="Password" 
            className="w-full pl-12 pr-4 py-3 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 font-medium"
            onChange={(e) => setFormData({...formData, password: e.target.value})}
            required
          />
        </div>
        <button className="w-full py-4 bg-blue-600 text-white font-black rounded-2xl shadow-lg shadow-blue-100 hover:bg-slate-900 transition-all active:scale-95 uppercase tracking-widest text-xs">
          Create Account
        </button>
      </form>

      <p className="text-center mt-8 text-slate-500 font-medium text-sm">
        Already have an account? <Link to="/login" className="text-blue-600 font-black hover:underline">Login</Link>
      </p>
    </div>
  );
}

export default Signup;