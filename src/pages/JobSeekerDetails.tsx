import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import Button from '../components/ui/button/Button';
import Modal from '../components/ui/modal/Modal';
import { userService, User } from '../services/userService';
import PageMeta from "../components/common/PageMeta";
import PageBreadcrumb from "../components/common/PageBreadCrumb";
import Badge from "../components/ui/badge/Badge";

export default function JobSeekerDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      if (!id) return;
      setLoading(true);
      try {
        const data = await userService.getUserById(id);
        setUser(data);
      } catch (error) {
        console.error('Error fetching user:', error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    
    const userStr = localStorage.getItem('user');
    if (userStr) {
      const currentUser = JSON.parse(userStr);
      setIsAdmin(currentUser.role === 'Admin');
    }

    fetchUser();
  }, [id]);

  const handleDelete = async () => {
    if (!id) return;
    try {
      await userService.deleteUser(id);
      navigate('/users/job-seekers');
    } catch (error) {
      console.error('Failed to delete job seeker:', error);
      alert('Failed to delete job seeker');
    }
  };

  const profilePhoto = user?.profile_photo ? `https://empediaapis-w7dq6.ondigitalocean.app/${user.profile_photo}` : "";
  const experienceYears = (() => {
    if (!user) return 0;
    if (typeof user.experience_years === "number") return user.experience_years;
    if (user.experiences && user.experiences.length > 0) {
      const total = user.experiences.reduce((acc, exp) => {
        const start = new Date(exp.startDate);
        const end = exp.endDate ? new Date(exp.endDate) : new Date();
        const diff = end.getTime() - start.getTime();
        return acc + diff / (1000 * 60 * 60 * 24 * 365);
      }, 0);
      return Math.round(total);
    }
    return 0;
  })();

  if (loading) return (
    <div className="flex justify-center items-center p-8">
      <div className="animate-spin rounded-full border-4 border-gray-200 border-t-blue-600 w-8 h-8"></div>
    </div>
  );

  if (!user) return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
      <div className="text-center text-gray-600 dark:text-gray-400">User not found</div>
    </div>
  );

  return (
    <>
      <PageMeta title="Job Seeker Details | Empedia Admin" description="View job seeker details" />
      <PageBreadcrumb pageTitle="Job Seeker Details" />
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <Link to="/users/job-seekers">
            <Button variant="outline">Back</Button>
          </Link>
          {isAdmin && (
            <Button variant="outline" onClick={() => setIsDeleteModalOpen(true)}>
              Delete Job Seeker
            </Button>
          )}
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
          <div className="flex gap-6 items-center">
            {profilePhoto ? (
              <img
                src={profilePhoto}
                alt={user.full_name}
                className="w-20 h-20 rounded-full object-cover"
              />
            ) : (
              <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 font-bold">
                {user.full_name?.charAt(0)}
              </div>
            )}
            <div className="flex-1">
              <h1 className="text-2xl font-semibold text-gray-800 dark:text-white/90">{user.full_name}</h1>
              <div className="mt-2 text-sm text-gray-700 dark:text-gray-300">{user.headline || user.bio || ""}</div>
              <div className="mt-2 flex flex-wrap gap-2">
                {user.location && <Badge size="sm" color="light">{user.location}</Badge>}
                <Badge size="sm" color="light">{experienceYears} Years</Badge>
              </div>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h2 className="text-lg font-medium text-gray-800 dark:text-white/90">Skills</h2>
              <div className="mt-3 flex flex-wrap gap-2">
                {(user.skills || []).map((s, i) => (
                  <Badge key={i} size="sm" color="light">
                    {s}
                  </Badge>
                ))}
              </div>
            </div>
            <div>
              <h2 className="text-lg font-medium text-gray-800 dark:text-white/90">Education</h2>
              <div className="mt-3 space-y-2 text-sm text-gray-700 dark:text-gray-300">
                {(user.education || []).map((edu, i) => (
                  <div key={i}>
                    <div>{edu.degree}</div>
                    <div className="text-gray-500">{edu.school}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-6">
            <h2 className="text-lg font-medium text-gray-800 dark:text-white/90">Experience</h2>
            <div className="mt-3 space-y-3">
              {(user.experiences || []).map((exp, i) => (
                <div key={i} className="rounded-xl border border-gray-200 p-4 dark:border-gray-800">
                  <div className="font-medium text-gray-800 dark:text-white/90">{exp.title}</div>
                  <div className="text-gray-600 dark:text-gray-400">{exp.company}</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    {new Date(exp.startDate).toLocaleDateString()} - {exp.endDate ? new Date(exp.endDate).toLocaleDateString() : "Present"}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <Modal isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)} title="Delete Job Seeker">
        <div className="p-6">
          <p>Are you sure you want to delete this job seeker? This action cannot be undone.</p>
          <div className="flex justify-end gap-3 mt-4">
            <Button variant="outline" onClick={() => setIsDeleteModalOpen(false)}>Cancel</Button>
            <Button variant="primary" onClick={handleDelete}>Delete</Button>
          </div>
        </div>
      </Modal>
    </>
  );
}
