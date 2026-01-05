import  { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Badge from '../ui/badge/Badge';
import { Application, applicationService } from '../../services/applicationService';

interface ApplicantListProps {
  companyId: string;
  jobId: string;
}

export default function ApplicantList({ companyId, jobId }: ApplicantListProps) {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const data = await applicationService.getCompanyApplications(companyId);
        // Filter by job ID since the API returns all company applications
        const jobApplications = data.filter((app: Application) => app.job._id === jobId);
        setApplications(jobApplications);
      } catch (error) {
        console.error("Failed to fetch applications", error);
      } finally {
        setLoading(false);
      }
    };

    if (companyId) {
      fetchApplications();
    }
  }, [companyId, jobId]);

  if (loading) return <div>Loading applicants...</div>;
  if (applications.length === 0) return <div className="text-gray-500">No applicants yet.</div>;

  return (
    <div className="mt-8">
      <h2 className="text-lg font-medium text-gray-800 dark:text-white/90 mb-4">Applicants ({applications.length})</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-800">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-900 dark:divide-gray-700">
            {applications.map((app) => (
              <tr key={app._id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                  {app.user?.full_name || 'Unknown'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                  {app.user?.email || 'No Email'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                  {new Date(app.createdAt || app.appliedAt).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <Badge 
                    size="sm" 
                    color={
                      app.status === 'Applied' ? 'primary' :
                      app.status === 'Shortlisted' ? 'info' :
                      app.status === 'Interview' ? 'warning' :
                      app.status === 'Offer' ? 'success' :
                      'error'
                    }
                  >
                    {app.status}
                  </Badge>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <Link to={`/applications/${app._id}`} className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300">
                    View Details
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
