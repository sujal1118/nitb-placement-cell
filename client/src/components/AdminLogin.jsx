import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    if (email === 'admin@nitb.ac.in' && password === 'admin123') {
      localStorage.setItem('isAdmin', 'true');
      navigate('/admin-dashboard');
    } else {
      setError('Invalid admin credentials');
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
            TPO / Admin Login
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
          <h2 className="font-['Poppins'] font-semibold text-xl text-[#1E1E24] mb-6">
            Admin Login
          </h2>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="font-['Inter'] text-sm text-gray-600 block mb-1">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@nitb.ac.in"
                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 font-['Inter'] text-sm focus:outline-none focus:ring-2 focus:ring-[#D4A24C] focus:border-transparent"
              />
            </div>

            <div>
              <label className="font-['Inter'] text-sm text-gray-600 block mb-1">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 font-['Inter'] text-sm focus:outline-none focus:ring-2 focus:ring-[#D4A24C] focus:border-transparent"
              />
            </div>

            {error && (
              <p className="text-red-500 text-sm text-center">{error}</p>
            )}

            <button
              type="submit"
              className="w-full bg-[#0F2545] text-white font-['Inter'] font-medium py-2.5 rounded-lg hover:bg-[#16305E] transition-colors mt-2"
            >
              Login
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default AdminLogin;