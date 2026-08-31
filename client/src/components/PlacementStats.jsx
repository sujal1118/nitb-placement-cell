import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

function PlacementStats() {
  const [stats, setStats] = useState([]);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await axios.get('https://nitb-placement-cell.onrender.com/api/students/stats/branches');
      setStats(res.data);
    } catch (err) {
      console.log('Error fetching stats', err);
    }
  };

  return (
    <div className="min-h-screen bg-[#F7F8FA]">
      <nav className="bg-[#0F2545] px-6 py-4 flex justify-between items-center">
        <div>
          <h1 className="font-['Poppins'] font-bold text-lg text-white">NIT Bhopal</h1>
          <p className="font-['Inter'] text-xs text-gray-300">Placement Cell Portal</p>
        </div>
        <Link
          to="/"
          className="font-['Inter'] text-sm text-white bg-[#16305E] px-4 py-2 rounded-lg hover:bg-[#1E3D73] transition-colors"
        >
          Login
        </Link>
      </nav>

      <div className="max-w-4xl mx-auto px-6 py-10">
        <h2 className="font-['Poppins'] font-semibold text-2xl text-[#1E1E24] mb-1">
          Placement Statistics
        </h2>
        <p className="font-['Inter'] text-sm text-gray-500 mb-8">
          Branch-wise placement percentage
        </p>

        {stats.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-center">
            <p className="font-['Inter'] text-sm text-gray-400">
              No data available yet.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {stats.map((s) => (
              <div key={s.branch} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-['Poppins'] font-semibold text-[#1E1E24]">{s.branch}</span>
                  <span className="font-['Inter'] text-sm text-gray-500">
                    {s.placed} / {s.total} placed
                  </span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-3">
                  <div
                    className="bg-[#D4A24C] h-3 rounded-full transition-all"
                    style={{ width: `${s.percentage}%` }}
                  ></div>
                </div>
                <p className="font-['Inter'] text-xs text-gray-500 mt-1">{s.percentage}%</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default PlacementStats;