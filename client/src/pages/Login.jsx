import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { LogIn, Mail, Lock } from 'lucide-react';

function Login() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', formData);
      
      // Save data to localStorage
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      
      alert(`Welcome back, ${res.data.user.name}!`);
      window.location.href = '/'; // Refresh to update Nav state
    } catch (err) {
      alert(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20 bg-white p-10 rounded-[2.5rem] shadow-xl border border-slate-100">
      <div className="text-center mb-8">
        <div className="bg-blue-600 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 text-white shadow-lg shadow-blue-200">
          <LogIn size={32} />
        </div>
        <h2 className="text-3xl font-black text-slate-800">Welcome Back</h2>
        <p className="text-slate-400 font-medium">Login to your citizen account</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
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
        <button className="w-full py-4 bg-slate-900 text-white font-black rounded-2xl shadow-xl hover:bg-blue-600 transition-all active:scale-95 uppercase tracking-widest text-xs">
          Sign In
        </button>
      </form>

      <p className="text-center mt-8 text-slate-500 font-medium text-sm">
        Don't have an account? <Link to="/signup" className="text-blue-600 font-black hover:underline">Sign up</Link>
      </p>
    </div>
  );
}

export default Login;