import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

function Signup() {
  const [form, setForm] = useState({
    name: '', rollNumber: '', branch: '', email: '', password: ''
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await axios.post('http://localhost:5001/api/students/signup', form);
      alert('Signup successful! Please login.');
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.error || 'Something went wrong');
    }
  };

  return (
    <div className="min-h-screen bg-[#F7F8FA] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="font-['Poppins'] font-bold text-2xl text-[#0F2545]">
            NIT Bhopal
          </h1>
          <p className="font-['Inter'] text-sm text-gray-500 mt-1">
            Create your Placement Cell account
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
          <h2 className="font-['Poppins'] font-semibold text-xl text-[#1E1E24] mb-6">
            Sign Up
          </h2>

          <form onSubmit={handleSignup} className="space-y-4">
            <input
              placeholder="Full Name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full px-4 py-2.5 rounded-lg border border-gray-300 font-['Inter'] text-sm focus:outline-none focus:ring-2 focus:ring-[#D4A24C] focus:border-transparent"
            />
            <input
              placeholder="Roll Number / Scholar Number"
              value={form.rollNumber}
              onChange={(e) => setForm({ ...form, rollNumber: e.target.value })}
              className="w-full px-4 py-2.5 rounded-lg border border-gray-300 font-['Inter'] text-sm focus:outline-none focus:ring-2 focus:ring-[#D4A24C] focus:border-transparent"
            />
            <input
              placeholder="Branch (e.g. CSE)"
              value={form.branch}
              onChange={(e) => setForm({ ...form, branch: e.target.value })}
              className="w-full px-4 py-2.5 rounded-lg border border-gray-300 font-['Inter'] text-sm focus:outline-none focus:ring-2 focus:ring-[#D4A24C] focus:border-transparent"
            />
            <input
              type="email"
              placeholder="scholar.no@stu.manit.ac.in"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full px-4 py-2.5 rounded-lg border border-gray-300 font-['Inter'] text-sm focus:outline-none focus:ring-2 focus:ring-[#D4A24C] focus:border-transparent"
            />
            <input
              type="password"
              placeholder="Password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className="w-full px-4 py-2.5 rounded-lg border border-gray-300 font-['Inter'] text-sm focus:outline-none focus:ring-2 focus:ring-[#D4A24C] focus:border-transparent"
            />

            {error && (
              <p className="text-red-500 text-sm text-center">{error}</p>
            )}

            <button
              type="submit"
              className="w-full bg-[#0F2545] text-white font-['Inter'] font-medium py-2.5 rounded-lg hover:bg-[#16305E] transition-colors mt-2"
            >
              Sign Up
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-4 font-['Inter']">
            Already have an account?{' '}
            <Link to="/" className="text-[#0F2545] font-medium hover:underline">
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Signup;