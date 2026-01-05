import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import PageMeta from "../../components/common/PageMeta";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import { Table, TableHeader, TableBody, TableRow, TableCell } from "../../components/ui/table";
import Badge from "../../components/ui/badge/Badge";
import Button from "../../components/ui/button/Button";
import { userService, User } from "../../services/userService";

interface JobSeeker {
  id: string;
  name: string;
  photo: string;
  headline: string;
  skills: string[];
  location: string;
  experience: number;
  education: string;
  status: "Active" | "Suspended" | "Pending";
  joinedDate: string;
  applicationCount: number;
}

interface JobSeekersTableProps {
  jobSeekers: JobSeeker[];
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const JobSeekersTable: React.FC<JobSeekersTableProps> = ({ 
  jobSeekers, 
  currentPage, 
  totalPages, 
  onPageChange 
}) => {
  const handleEditJobSeeker = (jobSeekerId: string) => {
    console.log(`Editing job seeker with ID: ${jobSeekerId}`);
    // Open edit modal or navigate to edit page
  };

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
      <div className="max-w-full overflow-x-auto">
        <div className="min-w-[1000px]">
          <Table>
            {/* Table Header */}
            <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
              <TableRow>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  Job Seeker
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  Skills
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  Location
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  Experience
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  Education
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  Joined Date
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  Actions
                </TableCell>
              </TableRow>
            </TableHeader>

            {/* Table Body */}
            <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
              {jobSeekers.map((seeker) => (
                <TableRow key={seeker.id}>
                  <TableCell className="px-5 py-4 text-start">
                    <div className="flex items-center gap-3">
                      {seeker.photo ? (
                        <img 
                          src={`https://empediaapis-w7dq6.ondigitalocean.app/${seeker.photo.replace(/\\/g, '/')}`}
                          alt={seeker.name} 
                          className="h-10 w-10 rounded-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = "https://via.placeholder.com/40";
                          }}
                        />
                      ) : (
                         <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 font-bold">
                           {seeker.name.charAt(0)}
                         </div>
                      )}
                      <div>
                        <span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
                          {seeker.name}
                        </span>
                        <span className="block text-gray-500 text-theme-xs dark:text-gray-400">
                          {seeker.headline}
                        </span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                    <div className="flex flex-wrap gap-1">
                      {seeker.skills && seeker.skills.slice(0, 3).map((skill, index) => (
                        <Badge key={index} size="sm" color="light">
                          {skill}
                        </Badge>
                      ))}
                      {seeker.skills && seeker.skills.length > 3 && (
                        <Badge size="sm" color="light">+{seeker.skills.length - 3}</Badge>
                      )}
                      {(!seeker.skills || seeker.skills.length === 0) && "N/A"}
                    </div>
                  </TableCell>
                  <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                    {seeker.location || "N/A"}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                    {seeker.experience || 0} Years
                  </TableCell>
                  <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                    {seeker.education || "N/A"}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                    {new Date(seeker.joinedDate).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                    <div className="flex gap-2">
                      <Link to={`/users/job-seekers/${seeker.id}`}>
                        <Button
                          size="sm"
                          variant="outline"
                        >
                          View
                        </Button>
                      </Link>
                      <Button
                        size="sm"
                        variant="primary"
                        onClick={() => handleEditJobSeeker(seeker.id)}
                      >
                        Edit
                      </Button>
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
            onClick={() => onPageChange(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
          >
            Next
          </Button>
        </div>
        <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
          <div>
            <p className="text-sm text-gray-700 dark:text-gray-400">
              Showing <span className="font-medium">{currentPage}</span> of{" "}
              <span className="font-medium">{totalPages}</span> pages
            </p>
          </div>
          <div>
            <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
              >
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
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

export default function JobSeekers() {
  const [isLoading, setIsLoading] = useState(true);
  const [jobSeekers, setJobSeekers] = useState<JobSeeker[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchUsers(currentPage);
  }, [currentPage]);

  const fetchUsers = async (page: number) => {
    try {
      setIsLoading(true);
      const data = await userService.getAllUsers(page, 10);
      
      const mappedSeekers: JobSeeker[] = data.users.map((user: User) => {
        // Calculate experience years if not provided directly
        let expYears = user.experience_years || 0;
        if (!expYears && user.experiences && user.experiences.length > 0) {
           expYears = user.experiences.reduce((acc, exp) => {
            const start = new Date(exp.startDate);
            const end = exp.endDate ? new Date(exp.endDate) : new Date();
            const diff = end.getTime() - start.getTime();
            return acc + (diff / (1000 * 60 * 60 * 24 * 365));
          }, 0);
        }

        // Format education
        let eduString = user.education_level || "";
        if (!eduString && user.education && user.education.length > 0) {
           // Take the first education entry
           const edu = user.education[0];
           eduString = `${edu.degree} ${edu.school ? `at ${edu.school}` : ''}`;
        }

        return {
          id: user._id,
          name: user.full_name,
          photo: user.profile_photo || "",
          headline: user.headline || user.bio || "",
          skills: user.skills || [],
          location: user.location || "",
          experience: Math.round(expYears),
          education: eduString,
          status: "Active",
          joinedDate: user.created_at,
          applicationCount: 0 
        };
      });
      
      setJobSeekers(mappedSeekers);
      setCurrentPage(data.currentPage);
      setTotalPages(data.totalPages);
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <PageMeta
        title="Job Seekers | Empedia Admin"
        description="Manage job seeker accounts in the Empedia platform"
      />
      <PageBreadcrumb pageTitle="Job Seekers" />
      
      <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white/90">Job Seekers</h2>
            <p className="mt-2 text-gray-500 dark:text-gray-400">
              Manage all job seeker accounts and their profiles.
            </p>
          </div>
          <Link to="/users/job-seekers/add">
            <Button
              size="md"
              startIcon={<span className="text-lg">+</span>}
            >
              Add New Job Seeker
            </Button>
          </Link>
        </div>
        
        {isLoading ? (
          <div className="flex justify-center items-center p-4 w-full">
            <div className="animate-spin rounded-full border-4 border-gray-200 border-t-blue-600 w-8 h-8"></div>
          </div>
        ) : (
          <JobSeekersTable 
            jobSeekers={jobSeekers} 
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        )}
      </div>
    </>
  );
}
