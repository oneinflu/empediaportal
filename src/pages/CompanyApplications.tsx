import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import PageMeta from "../components/common/PageMeta";
import PageBreadcrumb from "../components/common/PageBreadCrumb";
import { Table, TableHeader, TableBody, TableRow, TableCell } from "../components/ui/table";
import Badge from "../components/ui/badge/Badge";
import Button from "../components/ui/button/Button";
import { applicationService, Application } from "../services/applicationService";

export default function CompanyApplications() {
  const { id } = useParams();
  const [applications, setApplications] = useState<Application[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchApplications = async () => {
      setIsLoading(true);
      try {
        if (!id) {
          setApplications([]);
        } else {
          const data = await applicationService.getCompanyApplications(id);
          setApplications(Array.isArray(data) ? data : []);
        }
      } catch (error) {
        console.error("Error fetching company applications:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchApplications();
  }, [id]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Applied": return "primary";
      case "Screening": return "info";
      case "Shortlisted": return "info";
      case "Interviewing": return "warning";
      case "Offer Sent": return "success";
      case "Hired": return "success";
      case "Rejected": return "error";
      default: return "light";
    }
  };

  return (
    <>
      <PageMeta
        title="Company Applications | Empedia Admin"
        description="View applications for this company"
      />
      <PageBreadcrumb pageTitle="Company Applications" />
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <Link to="/users/companies">
            <Button variant="outline">Back to Companies</Button>
          </Link>
        </div>
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
          <div className="max-w-full overflow-x-auto">
            <div className="min-w-[1000px]">
              <Table>
                <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
                  <TableRow>
                    <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">Position</TableCell>
                    <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">Applicant</TableCell>
                    <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">Date</TableCell>
                    <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">Status</TableCell>
                    <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">Actions</TableCell>
                  </TableRow>
                </TableHeader>
                <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                  {isLoading ? (
                    <TableRow>
                      <TableCell className="px-5 py-4">Loading...</TableCell>
                    </TableRow>
                  ) : applications.length === 0 ? (
                    <TableRow>
                      <TableCell className="px-5 py-4">No applications found.</TableCell>
                    </TableRow>
                  ) : (
                    applications.map((app) => (
                      <TableRow key={app._id}>
                        <TableCell className="px-5 py-4 text-start">
                          <div>
                            <span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
                              {app.job?.title || "Internship Application"}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                          {app.user?.full_name} ({app.user?.email})
                        </TableCell>
                        <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                          {new Date(app.createdAt || app.appliedAt).toLocaleDateString()}
                        </TableCell>
                        <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                          <Badge size="sm" color={getStatusColor(app.status)}>
                            {app.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                          <div className="flex gap-2">
                            <Link to={`/applications/${app._id}`}>
                              <Button size="sm" variant="outline">View</Button>
                            </Link>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
