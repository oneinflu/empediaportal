/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import PageMeta from "../components/common/PageMeta";
import PageBreadcrumb from "../components/common/PageBreadCrumb";

import { Table, TableHeader, TableBody, TableRow, TableCell } from "../components/ui/table";
import Badge from "../components/ui/badge/Badge";
import Button from "../components/ui/button/Button";

import { mentorService } from "../services/mentorService";

interface Mentor {
  id: string;
  name: string;
  photo: string;
  headline: string;
  expertise: string[];
  rating: number;
  hourlyRate: number;
  availability: string;
  isVerified: boolean;
  status: "Active" | "Suspended" | "Pending" | "Approved" | "Rejected";
  pastMenteesCount: number;
}

interface MentorsTableProps {
  mentors: Mentor[];
  isLoading: boolean;
}

const MentorsTable: React.FC<MentorsTableProps> = ({ mentors }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = 5; // This would normally be calculated based on total mentors and page size

  const handlePageChange = (page: number) => {
    console.log(`Navigating to page ${page}`);
    setCurrentPage(page);
    // Here you would fetch the mentors for the new page
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
                  Mentor
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  Expertise
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  Rating
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  Hourly Rate
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  Availability
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  Past Mentees
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
              {mentors.map((mentor) => (
                <TableRow key={mentor.id}>
                  <TableCell className="px-5 py-4 text-start">
                    <div className="flex items-center gap-3">
                      <img 
                        src={mentor.photo} 
                        alt={mentor.name} 
                        className="h-10 w-10 rounded-full object-cover"
                      />
                      <div>
                        <span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
                          {mentor.name}
                          {mentor.isVerified && (
                            <span className="ml-1 text-blue-500">✓</span>
                          )}
                        </span>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {mentor.headline}
                        </span>
                        <Badge
                          size="sm"
                          color={mentor.status === "Approved" || mentor.status === "Active" ? "success" : mentor.status === "Pending" ? "warning" : "error"}
                          
                        >
                          {mentor.status}
                        </Badge>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                    <div className="flex flex-wrap gap-1">
                      {mentor.expertise.map((skill, index) => (
                        <Badge key={index} size="sm" >
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                    <div className="flex items-center">
                      <span className="text-yellow-500 mr-1">★</span>
                      {mentor.rating.toFixed(1)}
                    </div>
                  </TableCell>
                  <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                    ${mentor.hourlyRate}/hr
                  </TableCell>
                  <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                    {mentor.availability}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                    {mentor.pastMenteesCount.toLocaleString()}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                    <div className="flex gap-2">
                      <Link to={`/mentors/${mentor.id}`}>
                        <Button
                          size="sm"
                          variant="outline"
                        >
                          View
                        </Button>
                      </Link>
                      <Link to={`/mentors/edit/${mentor.id}`}>
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
            onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
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
                onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
              >
                Previous
              </Button>
              {[...Array(totalPages)].map((_, index) => (
                <Button
                  key={index}
                  variant={currentPage === index + 1 ? "primary" : "outline"}
                  size="sm"
                  onClick={() => handlePageChange(index + 1)}
                >
                  {index + 1}
                </Button>
              ))}
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
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

export default function Mentors() {
  const [mentors, setMentors] = useState<Mentor[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchMentors = async () => {
      setIsLoading(true);
      try {
        const data = await mentorService.getAllMentors();
        const mappedMentors: Mentor[] = data.map((item: any) => ({
            id: item._id,
            name: item.fullName,
            photo: item.profilePhoto ? `https://empediaapis-w7dq6.ondigitalocean.app/${item.profilePhoto}` : "", // Adjust base URL as needed
            headline: item.headline || "",
            expertise: item.expertiseTags || [],
            rating: item.rating || 0, // Default if not in schema
            hourlyRate: item.pricingAmount || 0,
            availability: `${item.weeklySlots || 0} slots/week`,
            isVerified: false, // Default
            status: item.status || "Pending",
            pastMenteesCount: item.pastMenteesCount || 0
        }));
        setMentors(mappedMentors);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching mentors:", error);
        setIsLoading(false);
      }
    };

    fetchMentors();
  }, []);

  return (
    <>
      <PageMeta
        title="Mentors | Empedia Admin"
        description="Manage mentors in the Empedia platform"
      />
      <PageBreadcrumb pageTitle="Mentors" />
      
      <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03] mb-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white/90">Mentors</h2>
            <p className="mt-2 text-gray-500 dark:text-gray-400">
              Manage all mentors registered on the platform.
            </p>
          </div>
          <Link to="/mentors/add">
            <Button variant="primary">Add New Mentor</Button>
          </Link>
        </div>
      </div>


      <MentorsTable mentors={mentors} isLoading={isLoading} />
    </>
  );
}
