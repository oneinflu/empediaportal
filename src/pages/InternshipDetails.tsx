import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import PageMeta from "../components/common/PageMeta";
import PageBreadcrumb from "../components/common/PageBreadCrumb";
import Badge from "../components/ui/badge/Badge";
import Button from "../components/ui/button/Button";
import { internshipService, Internship } from "../services/internshipService";

export default function InternshipDetails() {
  const { id } = useParams();
  const [internship, setInternship] = useState<Internship | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchInternship = async () => {
      if (!id) return;
      setLoading(true);
      try {
        const data = await internshipService.getInternshipById(id);
        setInternship(data);
      } catch {
        setInternship(null);
      } finally {
        setLoading(false);
      }
    };
    fetchInternship();
  }, [id]);

  const companyName = (() => {
    if (!internship?.company) return "";
    if (typeof internship.company === "string") return internship.company;
    return internship.company.company_name || "";
  })();

  const handleDelete = async () => {
    if (!id) return;
    const confirm = window.confirm("Are you sure you want to delete this internship?");
    if (!confirm) return;
    try {
      await internshipService.deleteInternship(id);
      alert("Internship deleted");
      navigate("/internships");
    } catch {
      alert("Failed to delete internship");
    }
  };

  return (
    <>
      <PageMeta title="Internship Details | Empedia Admin" description="View internship details" />
      <PageBreadcrumb pageTitle="Internship Details" />
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <Link to="/internships">
            <Button variant="outline">Back</Button>
          </Link>
          {internship && (
            <Button variant="outline" onClick={handleDelete}>Delete</Button>
          )}
        </div>
        {loading ? (
          <div className="flex justify-center items-center p-8">
            <div className="animate-spin rounded-full border-4 border-gray-200 border-t-blue-600 w-8 h-8"></div>
          </div>
        ) : internship ? (
          <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
            <div className="flex items-start justify-between">
              <div>
                <h1 className="text-2xl font-semibold text-gray-800 dark:text-white/90">{internship.title}</h1>
                <p className="text-gray-500 dark:text-gray-400">{companyName}</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {internship.internshipType && <Badge size="sm" color="light">{internship.internshipType}</Badge>}
                  {internship.workMode && <Badge size="sm" color="light">{internship.workMode}</Badge>}
                  {internship.status && (
                    <Badge
                      size="sm"
                      color={internship.status === "Approved" ? "success" : internship.status === "Pending" ? "warning" : "error"}
                    >
                      {internship.status}
                    </Badge>
                  )}
                </div>
              </div>
              <div className="text-right">
                {internship.applicationDeadline && (
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    Deadline: {new Date(internship.applicationDeadline).toLocaleDateString()}
                  </div>
                )}
              </div>
            </div>

            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h2 className="text-lg font-medium text-gray-800 dark:text-white/90">Details</h2>
                <div className="mt-3 space-y-2 text-sm text-gray-700 dark:text-gray-300">
                  <div>Location: {internship.location || "Remote"}</div>
                  <div>Duration: {internship.duration || "-"}</div>
                  <div>Stipend: {internship.stipend || "-"}</div>
                  <div>Start Date: {internship.startDate ? new Date(internship.startDate).toLocaleDateString() : "-"}</div>
                </div>
              </div>
              <div>
                <h2 className="text-lg font-medium text-gray-800 dark:text-white/90">Required Skills</h2>
                <div className="mt-3 flex flex-wrap gap-2">
                  {(internship.requiredSkills || []).map((s, i) => (
                    <Badge key={i} size="sm" color="light">
                      {s}
                    </Badge>
                  ))}
                  {(internship.niceToHaveSkills || []).map((s, i) => (
                    <Badge key={`n-${i}`} size="sm" color="light">
                      {s}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-1 gap-6">
              {internship.description && (
                <div>
                  <h2 className="text-lg font-medium text-gray-800 dark:text-white/90">Description</h2>
                  <p className="mt-2 text-gray-700 dark:text-gray-300 whitespace-pre-wrap">{internship.description}</p>
                </div>
              )}
              {internship.responsibilities && (
                <div>
                  <h2 className="text-lg font-medium text-gray-800 dark:text-white/90">Responsibilities</h2>
                  <p className="mt-2 text-gray-700 dark:text-gray-300 whitespace-pre-wrap">{internship.responsibilities}</p>
                </div>
              )}
              {internship.perks && internship.perks.length > 0 && (
                <div>
                  <h2 className="text-lg font-medium text-gray-800 dark:text-white/90">Perks</h2>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {internship.perks.map((p, i) => (
                      <Badge key={i} size="sm" color="light">
                        {p}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {(internship.recommendedCourses?.length || internship.recommendedJobs?.length || internship.recommendedMentors?.length) ? (
              <div className="space-y-6 pt-6 border-t border-gray-200 dark:border-gray-800 mt-8">
                <h2 className="text-xl font-bold text-gray-800 dark:text-white">Recommended Growth</h2>

                {internship.recommendedCourses && internship.recommendedCourses.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold mb-3 text-gray-700 dark:text-gray-200">Recommended Courses</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {internship.recommendedCourses.map((c) => (
                        <div key={c._id} className="p-4 border rounded-lg bg-white dark:bg-gray-800 dark:border-gray-700">
                          <h4 className="font-medium text-gray-900 dark:text-white">{c.title}</h4>
                          <p className="text-sm text-gray-500">{c.level}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {internship.recommendedJobs && internship.recommendedJobs.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold mb-3 text-gray-700 dark:text-gray-200">Recommended Jobs</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {internship.recommendedJobs.map((j) => (
                        <div key={j._id} className="p-4 border rounded-lg bg-white dark:bg-gray-800 dark:border-gray-700">
                          <h4 className="font-medium text-gray-900 dark:text-white">{j.title}</h4>
                          <p className="text-sm text-gray-500">
                             {typeof j.company === 'string' ? j.company : j.company?.company_name}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {internship.recommendedMentors && internship.recommendedMentors.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold mb-3 text-gray-700 dark:text-gray-200">Recommended Mentors</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {internship.recommendedMentors.map((m) => (
                        <div key={m._id} className="p-4 border rounded-lg bg-white dark:bg-gray-800 dark:border-gray-700">
                          <h4 className="font-medium text-gray-900 dark:text-white">{m.fullName}</h4>
                          {m.headline && <p className="text-sm text-gray-500">{m.headline}</p>}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : null}
          </div>
        ) : (
          <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
            <div className="text-center text-gray-600 dark:text-gray-400">Internship not found</div>
          </div>
        )}
      </div>
    </>
  );
}
