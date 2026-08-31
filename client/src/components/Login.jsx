import { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await axios.post('https://nitb-placement-cell.onrender.com/api/students/login', {
        email,
        password
      });
      localStorage.setItem('student', JSON.stringify(res.data.student));
      navigate('/dashboard');
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
            Placement Cell Portal
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
          <h2 className="font-['Poppins'] font-semibold text-xl text-[#1E1E24] mb-6">
            Login
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
                placeholder="scholar.no@stu.manit.ac.in"
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
          <p className="text-center text-sm text-gray-500 mt-4 font-['Inter']">
  New here?{' '}
  <Link to="/signup" className="text-[#0F2545] font-medium hover:underline">
    Create an account
  </Link>
</p>
        </div>

        <p className="text-center text-xs text-gray-400 font-['Inter'] mt-6">
          Placement Cell Management System
        </p>
      </div>
    </div>
  );
}

export default Login;