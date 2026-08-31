import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Dashboard() {
  const [student, setStudent] = useState(null);
  const [drives, setDrives] = useState([]);
  const [applications, setApplications] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const data = localStorage.getItem('student');
    if (!data) {
      navigate('/');
    } else {
      const parsed = JSON.parse(data);
      setStudent(parsed);
      fetchDrives(parsed.branch);
      fetchApplications(parsed._id);
    }
  }, [navigate]);

  const fetchDrives = async (branch) => {
    try {
      const res = await axios.get('https://nitb-placement-cell.onrender.com/api/drives');
      const eligible = res.data.filter(
        (d) => d.company && d.company.eligibleBranches.includes(branch)
      );
      setDrives(eligible);
    } catch (err) {
      console.log('Error fetching drives', err);
    }
  };

  const fetchApplications = async (studentId) => {
    try {
      const res = await axios.get(`http://localhost:5001/api/applications/student/${studentId}`);
      setApplications(res.data);
    } catch (err) {
      console.log('Error fetching applications', err);
    }
  };

  const handleApply = async (driveId, registrationLink) => {
    try {
      await axios.post('http://localhost:5001/api/applications', {
        student: student._id,
        drive: driveId
      });
      fetchApplications(student._id);
      if (registrationLink) {
        window.open(registrationLink, '_blank');
      }
    } catch (err) {
      alert(err.response?.data?.error || 'Error applying');
    }
  };

 const hasApplied = (driveId) => {
  return applications.some((a) => a.drive && a.drive._id === driveId);
};

  const handleLogout = () => {
    localStorage.removeItem('student');
    navigate('/');
  };

  if (!student) return null;

  return (
    <div className="min-h-screen bg-[#F7F8FA]">
      <nav className="bg-[#0F2545] px-6 py-4 flex justify-between items-center">
        <div>
          <h1 className="font-['Poppins'] font-bold text-lg text-white">NIT Bhopal</h1>
          <p className="font-['Inter'] text-xs text-gray-300">Placement Cell Portal</p>
        </div>
        <button
          onClick={handleLogout}
          className="font-['Inter'] text-sm text-white bg-[#16305E] px-4 py-2 rounded-lg hover:bg-[#1E3D73] transition-colors"
        >
          Logout
        </button>
      </nav>

      <div className="max-w-5xl mx-auto px-6 py-10">
        <h2 className="font-['Poppins'] font-semibold text-2xl text-[#1E1E24] mb-1">
          Welcome, {student.name}
        </h2>
        <p className="font-['Inter'] text-sm text-gray-500 mb-8">
          {student.branch} • {student.rollNumber}
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
            <p className="font-['Inter'] text-xs text-gray-500 mb-1">Placement Status</p>
            <p className={`font-['Poppins'] font-semibold text-lg ${student.isPlaced ? 'text-green-600' : 'text-[#D4A24C]'}`}>
              {student.isPlaced ? 'Placed' : 'Not Placed'}
            </p>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
            <p className="font-['Inter'] text-xs text-gray-500 mb-1">Applications</p>
            <p className="font-['Poppins'] font-semibold text-lg text-[#0F2545]">{applications.length}</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
            <p className="font-['Inter'] text-xs text-gray-500 mb-1">Open Drives</p>
            <p className="font-['Poppins'] font-semibold text-lg text-[#0F2545]">{drives.length}</p>
          </div>
        </div>

        {student.isPlaced && (
          <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-8">
            <p className="font-['Inter'] text-sm text-green-700">
              🎉 You are placed! You can no longer apply to new drives.
            </p>
          </div>
        )}

        {/* Open Drives */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8">
          <h3 className="font-['Poppins'] font-semibold text-lg text-[#1E1E24] mb-4">
            Open Drives for {student.branch}
          </h3>

          {drives.length === 0 ? (
            <p className="font-['Inter'] text-sm text-gray-400 text-center py-6">
              No open drives right now for your branch.
            </p>
          ) : (
            <div className="space-y-3">
              {drives.map((d) => (
                <div
                  key={d._id}
                  className="flex justify-between items-center border border-gray-100 rounded-lg p-4"
                >
                  <div>
                    <p className="font-['Poppins'] font-medium text-sm text-[#1E1E24]">
                      {d.company.name} — {d.company.role}
                    </p>
                    <p className="font-['Inter'] text-xs text-gray-500 mt-0.5">
                      {d.company.package} • Deadline: {new Date(d.deadline).toDateString()}
                    </p>
                  </div>

                  {hasApplied(d._id) ? (
                    <span className="text-sm font-['Inter'] text-green-600 font-medium">Applied ✓</span>
                  ) : (
                    <button
                      onClick={() => handleApply(d._id, d.registrationLink)}
                      disabled={student.isPlaced}
                      className="bg-[#0F2545] text-white text-sm font-['Inter'] font-medium px-4 py-2 rounded-lg hover:bg-[#16305E] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      Apply
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* My Applications */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="font-['Poppins'] font-semibold text-lg text-[#1E1E24] mb-4">
            My Applications
          </h3>

          {applications.length === 0 ? (
            <p className="font-['Inter'] text-sm text-gray-400 text-center py-6">
              You haven't applied to any drives yet.
            </p>
          ) : (
            <div className="space-y-3">
              {applications.filter((a) => a.drive).map((a) => (
  <div
    key={a._id}
    className="flex justify-between items-center border border-gray-100 rounded-lg p-4"
  >
    <div>
      <p className="font-['Poppins'] font-medium text-sm text-[#1E1E24]">
        {a.drive.company.name} — {a.drive.company.role}
      </p>
                    <p className="font-['Inter'] text-xs text-gray-500 mt-0.5">
                      Applied on {new Date(a.createdAt).toDateString()}
                    </p>
                  </div>
                  <span className={`text-xs font-['Inter'] font-medium px-3 py-1 rounded-full ${
                    a.status === 'selected' ? 'bg-green-100 text-green-700' :
                    a.status === 'rejected' ? 'bg-red-100 text-red-700' :
                    'bg-yellow-100 text-yellow-700'
                  }`}>
                    {a.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;