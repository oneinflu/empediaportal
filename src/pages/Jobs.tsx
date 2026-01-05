import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import PageMeta from "../components/common/PageMeta";
import PageBreadcrumb from "../components/common/PageBreadCrumb";

import { Table, TableHeader, TableBody, TableRow, TableCell } from "../components/ui/table";
import Badge from "../components/ui/badge/Badge";
import Button from "../components/ui/button/Button";
import { jobService, Job } from "../services/jobService";

interface Position {
  id: string;
  title: string;
  company: string;
  type: string;
  location: string;
  skills: string[];
  status: string;
  applicantsCount: number;
  lastUpdated: string;
  recommendationsStatus: string;
  sponsored: boolean;
}

interface JobsTableProps {
  positions: Position[];
  isLoading: boolean;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const JobsTable: React.FC<JobsTableProps> = ({ positions, isLoading, currentPage, totalPages, onPageChange }) => {


  const getStatusColor = (status: string) => {
    switch (status) {
      case "Published": return "success";
      case "Approved": return "success";
      case "Draft": return "warning";
      case "Pending": return "warning";
      case "Closed": return "error";
      case "Rejected": return "error";
      default: return "light";
    }
  };

  const getRecommendationColor = (status: string) => {
    switch (status) {
      case "Fresh": return "success";
      case "Stale": return "warning";
      case "Missing": return "error";
      default: return "light";
    }
  };

  if (isLoading) {
    return <div className="p-6 text-center">Loading...</div>;
  }

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
      <div className="max-w-full overflow-x-auto">
        <div className="min-w-[1000px]">
          <Table>
            <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
              <TableRow>
                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">Position</TableCell>
                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">Skills</TableCell>
                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">Location</TableCell>
                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">Applicants</TableCell>
                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">Last Updated</TableCell>
                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">Recommendations</TableCell>
                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">Actions</TableCell>
              </TableRow>
            </TableHeader>
            <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
              {positions.map((position) => (
                <TableRow key={position.id}>
                  <TableCell className="px-5 py-4 text-start">
                    <div>
                      <span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
                        {position.title}
                        {position.sponsored && (
                          <span className="ml-2">
                            <Badge size="sm" color="primary">Sponsored</Badge>
                          </span>
                        )}
                      </span>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {position.company}
                      </span>
                      <div className="mt-1 flex items-center gap-2">
                        <Badge size="sm" color="light">{position.type}</Badge>
                        <Badge size="sm" color={getStatusColor(position.status)}>{position.status}</Badge>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                    <div className="flex flex-wrap gap-1">
                      {position.skills.slice(0, 3).map((skill, index) => (
                        <Badge key={index} size="sm" color="light">{skill}</Badge>
                      ))}
                      {position.skills.length > 3 && <Badge size="sm" color="light">+{position.skills.length - 3}</Badge>}
                    </div>
                  </TableCell>
                  <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">{position.location}</TableCell>
                  <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">{position.applicantsCount}</TableCell>
                  <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">{position.lastUpdated}</TableCell>
                  <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                    <Badge size="sm" color={getRecommendationColor(position.recommendationsStatus)}>{position.recommendationsStatus}</Badge>
                  </TableCell>
                  <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                    <div className="flex gap-2">
                      <Link to={`/jobs/${position.id}`}>
                        <Button size="sm" variant="outline">View</Button>
                      </Link>
                      <Link to={`/jobs/edit/${position.id}`}>
                        <Button size="sm" variant="primary">Edit</Button>
                      </Link>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
      
      {/* Pagination */}
      <div className="flex items-center justify-between border-t border-gray-100 px-4 py-3 dark:border-white/[0.05] sm:px-6">
        <div className="flex flex-1 justify-between sm:hidden">
          <Button 
            variant="outline" 
            size="sm" 
            disabled={currentPage === 1}
            onClick={() => onPageChange(currentPage - 1)}
          >
            Previous
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            disabled={currentPage === totalPages}
            onClick={() => onPageChange(currentPage + 1)}
          >
            Next
          </Button>
        </div>
        <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
          <div>
            <p className="text-sm text-gray-700 dark:text-gray-400">
              Showing page <span className="font-medium">{currentPage}</span> of <span className="font-medium">{totalPages}</span>
            </p>
          </div>
          <div>
            <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
               <Button 
                 variant="outline" 
                 size="sm" 
                 disabled={currentPage === 1}
                 onClick={() => onPageChange(currentPage - 1)}
               >
                 Previous
               </Button>
               <Button 
                 variant="outline" 
                 size="sm" 
                 disabled={currentPage === totalPages}
                 onClick={() => onPageChange(currentPage + 1)}
               >
                 Next
               </Button>
            </nav>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function Jobs() {
  const [positions, setPositions] = useState<Position[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchPositions = async () => {
      setIsLoading(true);
      try {
        const data = await jobService.getAllJobs(currentPage);
        const jobsList = data.jobs || [];
        const mappedJobs: Position[] = jobsList.map((job: Job) => ({
            id: job._id,
            title: job.title,
            company: typeof job.company === 'object' ? job.company?.company_name : 'Unknown Company',
            type: job.jobType || "Job",
            location: job.location || "Remote",
            skills: job.requiredSkills || [],
            status: job.status || "Pending",
            applicantsCount: 0,
            lastUpdated: new Date(job.updatedAt || Date.now()).toLocaleDateString(),
            recommendationsStatus: "Fresh",
            sponsored: false
        }));
        setPositions(mappedJobs);
        setTotalPages(data.totalPages || 1);
      } catch (error) {
        console.error("Error fetching jobs:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPositions();
  }, [currentPage]);

  return (
    <>
      <PageMeta
        title="React.js Job Dashboard | TailAdmin - React.js Admin Dashboard Template"
        description="This is React.js Job Dashboard page for TailAdmin - React.js Tailwind CSS Admin Dashboard Template"
      />
      <PageBreadcrumb pageTitle="Job Dashboard" />

      <div className="space-y-6">
        <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold text-gray-800 dark:text-white">Jobs Overview</h2>
            <Link to="/jobs/add">
                <Button variant="primary">Add Job</Button>
            </Link>
        </div>
        <JobsTable 
          positions={positions} 
          isLoading={isLoading} 
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </div>
    </>
  );
}
