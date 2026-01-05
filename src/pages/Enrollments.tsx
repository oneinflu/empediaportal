import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import PageMeta from "../components/common/PageMeta";
import PageBreadcrumb from "../components/common/PageBreadCrumb";
import { Table, TableHeader, TableBody, TableRow, TableCell } from "../components/ui/table";
import Badge from "../components/ui/badge/Badge";
import Button from "../components/ui/button/Button";
import { enrollmentService, Enrollment } from "../services/enrollmentService";

export default function Enrollments() {
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchEnrollments = async () => {
      setIsLoading(true);
      try {
        const rawUser = localStorage.getItem("user");
        const user = rawUser ? JSON.parse(rawUser) : null;
        const userId = user?._id;
        const isAdmin = user?.role === 'superadmin' || user?.role === 'moderator';
        if (isAdmin) {
          const data = await enrollmentService.getAllEnrollments();
          setEnrollments(Array.isArray(data) ? data : []);
        } else if (!userId) {
          setEnrollments([]);
        } else {
          const data = await enrollmentService.getUserEnrollments(userId);
          setEnrollments(Array.isArray(data) ? data : []);
        }
      } catch (error) {
        console.error("Error fetching enrollments:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchEnrollments();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Completed": return "success";
      case "In Progress": return "info";
      default: return "light";
    }
  };

  return (
    <>
      <PageMeta
        title="Enrollments | Empedia Admin"
        description="View course enrollments"
      />
      <div className="mx-auto w-full max-w-[1080px]">
        <div className="flex items-center justify-between mb-6">
          <PageBreadcrumb pageTitle="Enrollments" />
        </div>
        {isLoading && (
          <div className="p-6 text-center">Loading...</div>
        )}
        {!isLoading && enrollments.length === 0 && (
          <div className="p-6 text-center">No enrollments found.</div>
        )}
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
          <div className="max-w-full overflow-x-auto">
            <div className="min-w-[900px]">
              <Table>
                <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
                  <TableRow>
                    <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">Course</TableCell>
                    <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">Progress</TableCell>
                    <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">Status</TableCell>
                    <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">Certificate</TableCell>
                    <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">Actions</TableCell>
                  </TableRow>
                </TableHeader>
                <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                  {!isLoading && enrollments.map((en) => {
                    const courseTitle =
                      typeof en.course_id === "object"
                        ? (en.course_id as { title?: string })?.title || "Untitled Course"
                        : (en.course_id || "Untitled Course");
                    const progress = en.progress_percent ?? 0;
                    const status = en.completion_status ?? "In Progress";
                    const certificate = en.certificate_url;
                    return (
                      <TableRow key={en._id}>
                        <TableCell className="px-5 py-4 text-start">
                          <div>
                            <span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
                              {courseTitle}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                          {progress}%
                        </TableCell>
                        <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                          <Badge size="sm" color={getStatusColor(status)}>
                            {status}
                          </Badge>
                        </TableCell>
                        <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                          {certificate ? (
                            <a href={certificate} target="_blank" rel="noreferrer" className="text-brand-500 hover:text-brand-600">
                              View
                            </a>
                          ) : (
                            "-"
                          )}
                        </TableCell>
                        <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                          <div className="flex gap-2">
                            <Link to={`/courses`}>
                              <Button size="sm" variant="outline">Browse Courses</Button>
                            </Link>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
