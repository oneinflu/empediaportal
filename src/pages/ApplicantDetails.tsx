import  { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Application, applicationService } from '../services/applicationService';
import Badge from '../components/ui/badge/Badge';

export default function ApplicantDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [application, setApplication] = useState<Application | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    const fetchApplication = async () => {
      if (!id) return;
      try {
        const data = await applicationService.getApplicationById(id);
        setApplication(data);
      } catch (error) {
        console.error("Failed to fetch application", error);
      } finally {
        setLoading(false);
      }
    };

    fetchApplication();
  }, [id]);

  const handleStatusUpdate = async (newStatus: string) => {
    if (!id) return;
    setUpdating(true);
    try {
      await applicationService.updateStatus(id, newStatus);
      // Refresh data
      const data = await applicationService.getApplicationById(id);
      setApplication(data);
    } catch (error) {
      console.error("Failed to update status", error);
    } finally {
      setUpdating(false);
    }
  };

  if (loading) return <div className="p-6">Loading application details...</div>;
  if (!application) return <div className="p-6">Application not found.</div>;

  const applicant = application.user;
  
  const applicantName = applicant?.full_name || 'Unknown Applicant';
  const applicantEmail = applicant?.email || 'No Email';
  const applicantPhone = applicant?.phone || 'No Phone';
  const resumeUrl = application.resume_url || application.resume || applicant?.resume_url;
  
  const getFileUrl = (path: string) => {
    if (path.startsWith('http')) return path;
    // Remove leading slash if present to avoid double slashes
    const cleanPath = path.startsWith('/') ? path.slice(1) : path;
    return `https://empediaapis-w7dq6.ondigitalocean.app/${cleanPath}`;
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Application Details</h1>
        <button 
          onClick={() => navigate(-1)}
          className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300"
        >
          Back
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Applicant Info Card */}
        <div className="md:col-span-2 space-y-6">
          <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Applicant Information</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">Full Name</label>
                <div className="mt-1 text-lg text-gray-900 dark:text-white">{applicantName}</div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">Email</label>
                <div className="mt-1 text-lg text-gray-900 dark:text-white">{applicantEmail}</div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">Phone</label>
                <div className="mt-1 text-lg text-gray-900 dark:text-white">{applicantPhone}</div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">Applied For</label>
                <div className="mt-1 text-lg text-gray-900 dark:text-white">
                  {application.job ? `Job: ${application.job.title}` : 'Internship'}
                </div>
              </div>
               <div>
                <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">Applied On</label>
                <div className="mt-1 text-lg text-gray-900 dark:text-white">
                  {new Date(application.createdAt || application.appliedAt).toLocaleDateString()}
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Resume / Documents</h2>
            {resumeUrl ? (
               <div className="flex items-center space-x-4">
                 <a 
                   href={getFileUrl(resumeUrl)} 
                   target="_blank" 
                   rel="noopener noreferrer"
                   className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none"
                 >
                   Download Resume
                 </a>
                 <span className="text-sm text-gray-500">
                   (Opens in new tab)
                 </span>
               </div>
            ) : (
              <p className="text-gray-500">No resume uploaded.</p>
            )}
          </div>
        </div>

        {/* Status & Actions Card */}
        <div className="space-y-6">
          <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Application Status</h2>
            <div className="mb-6">
              <div className="flex justify-center">
                <Badge 
                  size="md" 
                  color={
                    application.status === 'Applied' ? 'primary' :
                    application.status === 'Shortlisted' ? 'info' :
                    application.status === 'Interview' ? 'warning' :
                    application.status === 'Offer' ? 'success' :
                    'error'
                  }
                >
                  {application.status}
                </Badge>
              </div>
            </div>

            <div className="space-y-3">
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Change Status</h3>
              
              <button
                onClick={() => handleStatusUpdate('Shortlisted')}
                disabled={updating || application.status === 'Shortlisted'}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none disabled:opacity-50"
              >
                Shortlist
              </button>
              
              <button
                onClick={() => handleStatusUpdate('Interview')}
                disabled={updating || application.status === 'Interview'}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-yellow-600 hover:bg-yellow-700 focus:outline-none disabled:opacity-50"
              >
                Interview
              </button>
              
              <button
                onClick={() => handleStatusUpdate('Offer')}
                disabled={updating || application.status === 'Offer'}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none disabled:opacity-50"
              >
                Extend Offer
              </button>
              
              <button
                onClick={() => handleStatusUpdate('Rejected')}
                disabled={updating || application.status === 'Rejected'}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none disabled:opacity-50"
              >
                Reject
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
