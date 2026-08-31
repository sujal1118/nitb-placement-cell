import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function AdminDashboard() {
  const navigate = useNavigate();
  const [companies, setCompanies] = useState([]);
  const [drives, setDrives] = useState([]);

  const [companyForm, setCompanyForm] = useState({
    name: '', role: '', package: '', eligibleBranches: ''
  });
  const [driveForm, setDriveForm] = useState({ company: '', deadline: '', registrationLink: '' });
  const [selectedDrive, setSelectedDrive] = useState(null);
const [driveApplications, setDriveApplications] = useState([]);

  useEffect(() => {
    if (localStorage.getItem('isAdmin') !== 'true') {
      navigate('/admin');
    } else {
      fetchCompanies();
      fetchDrives();
    }
  }, [navigate]);

  const fetchCompanies = async () => {
    const res = await axios.get('http://localhost:5001/api/companies');
    setCompanies(res.data);
  };

  const fetchDrives = async () => {
    const res = await axios.get('http://localhost:5001/api/drives');
    setDrives(res.data);
  };
  const viewApplications = async (driveId) => {
  try {
    const res = await axios.get(`http://localhost:5001/api/applications/drive/${driveId}`);
    setDriveApplications(res.data);
    setSelectedDrive(driveId);
  } catch (err) {
    console.log('Error fetching applications', err);
  }
};


const markSelected = async (applicationId) => {
  try {
    await axios.put(`http://localhost:5001/api/applications/${applicationId}`, {
      status: 'selected'
    });
    alert('Student marked as selected!');
    viewApplications(selectedDrive);
  } catch (err) {
    alert('Error updating status');
  }
};

  const handleAddCompany = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5001/api/companies', {
        name: companyForm.name,
        role: companyForm.role,
        package: companyForm.package,
        eligibleBranches: companyForm.eligibleBranches.split(',').map(b => b.trim())
      });
      setCompanyForm({ name: '', role: '', package: '', eligibleBranches: '' });
      fetchCompanies();
    } catch (err) {
      alert('Error adding company');
    }
  };

  const handleAddDrive = async (e) => {
    e.preventDefault();
    if (!driveForm.company || !driveForm.deadline) {
      alert('Please select a company and deadline');
      return;
    }
    try {
      await axios.post('http://localhost:5001/api/drives', {
        company: driveForm.company,
        deadline: driveForm.deadline,
        registrationLink: driveForm.registrationLink
      });
      setDriveForm({ company: '', deadline: '', registrationLink: '' });
      fetchDrives();
    } catch (err) {
      console.log(err.response?.data);
      alert(err.response?.data?.error || 'Error adding drive');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('isAdmin');
    navigate('/admin');
  };

  return (
    <div className="min-h-screen bg-[#F7F8FA]">
      <nav className="bg-[#0F2545] px-6 py-4 flex justify-between items-center">
        <div>
          <h1 className="font-['Poppins'] font-bold text-lg text-white">NIT Bhopal</h1>
          <p className="font-['Inter'] text-xs text-gray-300">Admin / TPO Panel</p>
        </div>
        <button
          onClick={handleLogout}
          className="font-['Inter'] text-sm text-white bg-[#16305E] px-4 py-2 rounded-lg hover:bg-[#1E3D73] transition-colors"
        >
          Logout
        </button>
      </nav>

      <div className="max-w-5xl mx-auto px-6 py-10 space-y-10">

        {/* Add Company */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="font-['Poppins'] font-semibold text-lg text-[#1E1E24] mb-4">Add Company</h2>
          <form onSubmit={handleAddCompany} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <input
              placeholder="Company Name"
              value={companyForm.name}
              onChange={(e) => setCompanyForm({ ...companyForm, name: e.target.value })}
              className="px-4 py-2 rounded-lg border border-gray-300 font-['Inter'] text-sm"
            />
            <input
              placeholder="Role"
              value={companyForm.role}
              onChange={(e) => setCompanyForm({ ...companyForm, role: e.target.value })}
              className="px-4 py-2 rounded-lg border border-gray-300 font-['Inter'] text-sm"
            />
            <input
              placeholder="Package (e.g. 7 LPA)"
              value={companyForm.package}
              onChange={(e) => setCompanyForm({ ...companyForm, package: e.target.value })}
              className="px-4 py-2 rounded-lg border border-gray-300 font-['Inter'] text-sm"
            />
            <input
              placeholder="Eligible Branches (comma separated)"
              value={companyForm.eligibleBranches}
              onChange={(e) => setCompanyForm({ ...companyForm, eligibleBranches: e.target.value })}
              className="px-4 py-2 rounded-lg border border-gray-300 font-['Inter'] text-sm"
            />
            <button
              type="submit"
              className="sm:col-span-2 bg-[#0F2545] text-white font-['Inter'] font-medium py-2.5 rounded-lg hover:bg-[#16305E] transition-colors"
            >
              Add Company
            </button>
          </form>
        </div>

        {/* Add Drive */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="font-['Poppins'] font-semibold text-lg text-[#1E1E24] mb-4">Add Drive</h2>
          <form onSubmit={handleAddDrive} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <select
              value={driveForm.company}
              onChange={(e) => setDriveForm({ ...driveForm, company: e.target.value })}
              className="px-4 py-2 rounded-lg border border-gray-300 font-['Inter'] text-sm"
            >
              <option value="">Select Company</option>
              {companies.map((c) => (
                <option key={c._id} value={c._id}>{c.name}</option>
              ))}
            </select>
            <input
              type="date"
              value={driveForm.deadline}
              onChange={(e) => setDriveForm({ ...driveForm, deadline: e.target.value })}
              className="px-4 py-2 rounded-lg border border-gray-300 font-['Inter'] text-sm"
            />
            <input
              placeholder="Registration Link (optional)"
              value={driveForm.registrationLink}
              onChange={(e) => setDriveForm({ ...driveForm, registrationLink: e.target.value })}
              className="sm:col-span-2 px-4 py-2 rounded-lg border border-gray-300 font-['Inter'] text-sm"
            />
            <button
              type="submit"
              className="sm:col-span-2 bg-[#0F2545] text-white font-['Inter'] font-medium py-2.5 rounded-lg hover:bg-[#16305E] transition-colors"
            >
              Add Drive
            </button>
          </form>
        </div>

        {/* Companies List */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="font-['Poppins'] font-semibold text-lg text-[#1E1E24] mb-4">Companies</h2>
          <div className="space-y-2">
            {companies.map((c) => (
              <div key={c._id} className="flex justify-between text-sm font-['Inter'] border-b border-gray-100 py-2">
                <span>{c.name} — {c.role}</span>
                <span className="text-gray-500">{c.package}</span>
              </div>
            ))}
          </div>
        </div>

      {/* Drives List */}
<div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
  <h2 className="font-['Poppins'] font-semibold text-lg text-[#1E1E24] mb-4">Drives</h2>
  <div className="space-y-2">
    {drives.map((d) => (
      <div key={d._id} className="flex justify-between items-center text-sm font-['Inter'] border-b border-gray-100 py-2">
        <div>
          <span>{d.company?.name || 'Unknown'}</span>
          <span className="text-gray-500 ml-2">{new Date(d.deadline).toDateString()}</span>
        </div>
        <button
          onClick={() => viewApplications(d._id)}
          className="text-[#0F2545] font-medium hover:underline"
        >
          View Applications
        </button>
      </div>
    ))}
  </div>
</div>

{/* Applications for selected drive */}
{selectedDrive && (
  <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
    <h2 className="font-['Poppins'] font-semibold text-lg text-[#1E1E24] mb-4">Applications</h2>
    {driveApplications.length === 0 ? (
      <p className="font-['Inter'] text-sm text-gray-400 text-center py-6">
        No applications yet for this drive.
      </p>
    ) : (
      <div className="space-y-2">
        {driveApplications.map((a) => (
          <div key={a._id} className="flex justify-between items-center text-sm font-['Inter'] border-b border-gray-100 py-2">
            <div>
              <span className="font-medium">{a.student?.name}</span>
              <span className="text-gray-500 ml-2">{a.student?.rollNumber}</span>
            </div>
            <div className="flex items-center gap-3">
              <span className={`text-xs px-2 py-1 rounded-full ${
                a.status === 'selected' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
              }`}>
                {a.status}
              </span>
              {a.status !== 'selected' && (
                <button
                  onClick={() => markSelected(a._id)}
                  className="text-white bg-green-600 hover:bg-green-700 px-3 py-1 rounded-lg text-xs"
                >
                  Mark Selected
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    )}
  </div>
)}

      </div>
    </div>
  );
}

export default AdminDashboard;