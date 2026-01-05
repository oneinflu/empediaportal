import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import PageMeta from "../components/common/PageMeta";
import PageBreadcrumb from "../components/common/PageBreadCrumb";
import { Table, TableHeader, TableBody, TableRow, TableCell } from "../components/ui/table";
import Badge from "../components/ui/badge/Badge";
import Button from "../components/ui/button/Button";
import { internshipService, Internship } from "../services/internshipService";

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

interface InternshipsTableProps {
  positions: Position[];
  isLoading: boolean;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const InternshipsTable: React.FC<InternshipsTableProps> = ({ positions, isLoading, currentPage, totalPages, onPageChange }) => {



  const getRecommendationColor = (status: string) => {
    switch (status) {
      case "Fresh": return "success";
      case "Stale": return "warning";
      case "Missing": return "error";
      default: return "light";
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-4 w-full">
        <div className="animate-spin rounded-full border-4 border-gray-200 border-t-blue-600 w-8 h-8"></div>
      </div>
    );
  }

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
                  Internship
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
                  Applicants
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  Last Updated
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  Recommendations
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
              {positions.map((position) => (
                <TableRow key={position.id}>
                  <TableCell className="px-5 py-4 sm:px-6 text-start">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-50 text-blue-500 dark:bg-blue-900/20 dark:text-blue-400 font-bold text-lg">
                        {position.company.charAt(0)}
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-800 dark:text-white/90">
                          {position.title}
                        </h3>
                        <span className="text-theme-xs text-gray-500 dark:text-gray-400">
                          {position.company}
                        </span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="px-5 py-4 sm:px-6 text-start">
                  <Badge size="sm" color="primary">
                    {position.type}
                  </Badge>
                </TableCell>
                  <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                    <div className="flex flex-wrap gap-1">
                      {position.skills.slice(0, 2).map((skill, index) => (
                        <Badge key={index} size="sm" color="light">
                          {skill}
                        </Badge>
                      ))}
                      {position.skills.length > 2 && (
                        <Badge size="sm" color="light">
                          +{position.skills.length - 2}
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                    {position.location}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                    {position.applicantsCount.toLocaleString()}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                    {position.lastUpdated}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                    <Badge
                      size="sm"
                      color={getRecommendationColor(position.recommendationsStatus)}
                    >
                      {position.recommendationsStatus}
                    </Badge>
                  </TableCell>
                  <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                    <div className="flex gap-2">
                      <Link to={`/internships/${position.id}`}>
                        <Button
                          size="sm"
                          variant="outline"
                        >
                          View
                        </Button>
                      </Link>
                      <Link to={`/internships/edit/${position.id}`}>
                        <Button
                          size="sm"
                          variant="primary"
                        >
                          Edit
                        </Button>
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
              Showing page <span className="font-medium">{currentPage}</span> of{" "}
              <span className="font-medium">{totalPages}</span>
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

export default function Internships() {
  const [positions, setPositions] = useState<Position[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchPositions = async () => {
      setIsLoading(true);
      try {
        const data = await internshipService.getAllInternships(currentPage);
        const internshipsList = data.internships || [];
        const mappedInternships: Position[] = internshipsList.map((internship: Internship) => ({
            id: internship._id || "",
            title: internship.title,
            company: typeof internship.company === 'object' ? internship.company?.company_name : 'Unknown Company',
            type: "Internship",
            location: internship.location || "Remote",
            skills: internship.requiredSkills || [],
            status: internship.status || "Pending",
            applicantsCount: 0,
            lastUpdated: new Date(internship.updatedAt || Date.now()).toLocaleDateString(),
            recommendationsStatus: "Fresh",
            sponsored: false
        }));
        setPositions(mappedInternships);
        setTotalPages(data.totalPages || 1);
      } catch (error) {
        console.error("Error fetching internships:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPositions();
  }, [currentPage]);

  return (
    <>
      <PageMeta
        title="Internships | Empedia Admin"
        description="Manage internship listings in the Empedia platform"
      />
      <div className="mx-auto w-full max-w-[1080px]">
        <div className="flex items-center justify-between mb-6">
          <PageBreadcrumb pageTitle="Internships" />
          <Link to="/internships/add">
            <Button variant="primary">
              Add New Internship
            </Button>
          </Link>
        </div>

        <InternshipsTable 
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
