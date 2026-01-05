import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import PageMeta from "../components/common/PageMeta";
import PageBreadcrumb from "../components/common/PageBreadCrumb";
import Badge from "../components/ui/badge/Badge";
import Button from "../components/ui/button/Button";
import Modal from "../components/ui/modal/Modal";
import ApplicantList from "../components/jobs/ApplicantList";
import { jobService, Job, Company } from "../services/jobService";
import { applicationService } from "../services/applicationService";

export default function JobDetails() {
  const { id } = useParams();
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [isApplying, setIsApplying] = useState(false);
  const [resume, setResume] = useState<File | null>(null);
  const [showApplyModal, setShowApplyModal] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [currentUser, setCurrentUser] = useState<any>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      setCurrentUser(JSON.parse(userStr));
    }

    const fetchJob = async () => {
      if (!id) return;
      setLoading(true);
      try {
        const data = await jobService.getJobById(id);
        setJob(data);
      } catch {
        setJob(null);
      } finally {
        setLoading(false);
      }
    };
    fetchJob();
  }, [id]);

  const handleApply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resume || !id) return;

    setIsApplying(true);
    try {
      await applicationService.applyForJob(id, resume);
      alert("Application submitted successfully!");
      setShowApplyModal(false);
      setResume(null);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      alert(error.response?.data?.message || "Failed to apply");
    } finally {
      setIsApplying(false);
    }
  };

  const companyName = (() => {
    if (!job?.company) return "";
    if (typeof job.company === "string") return job.company;
    return (job.company as Company).company_name || "";
  })();

  const companyId = (() => {
    if (!job?.company) return "";
    if (typeof job.company === "string") return ""; // Can't get ID from string
    return (job.company as Company)._id || "";
  })();

  // Simple check: if user is a company, show applicants. Real app should check ownership.
  const isRecruiter = currentUser?.role === 'Company' || currentUser?.role === 'Admin';

  const handleDelete = async () => {
    if (!id) return;
    const confirm = window.confirm("Are you sure you want to delete this job?");
    if (!confirm) return;
    try {
      await jobService.deleteJob(id);
      alert("Job deleted");
      navigate("/jobs");
    } catch {
      alert("Failed to delete job");
    }
  };

  return (
    <>
      <PageMeta title="Job Details | Empedia Admin" description="View job details" />
      <PageBreadcrumb pageTitle="Job Details" />
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <Link to="/jobs">
            <Button variant="outline">Back</Button>
          </Link>
          <div className="flex gap-3">
            {job && !isRecruiter && (
              <Button onClick={() => setShowApplyModal(true)}>Apply Now</Button>
            )}
            {job && (
              <Button variant="outline" onClick={handleDelete}>Delete</Button>
            )}
          </div>
        </div>
        
        {loading ? (
          <div className="flex justify-center items-center p-8">
            <div className="animate-spin rounded-full border-4 border-gray-200 border-t-blue-600 w-8 h-8"></div>
          </div>
        ) : job ? (
          <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
            {job.coverImage && (
              <img
                src={`https://empediaapis-w7dq6.ondigitalocean.app/${job.coverImage}`}
                alt={job.title || ""}
                className="w-full max-h-56 object-cover rounded-xl mb-4"
              />
            )}
            <div className="flex items-start justify-between">
              <div>
                <h1 className="text-2xl font-semibold text-gray-800 dark:text-white/90">{job.title}</h1>
                <p className="text-gray-500 dark:text-gray-400">{companyName}</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {job.jobType && <Badge size="sm" color="light">{job.jobType}</Badge>}
                  {job.workMode && <Badge size="sm" color="light">{job.workMode}</Badge>}
                  {job.status && (
                    <Badge
                      size="sm"
                      color={job.status === "Approved" ? "success" : job.status === "Pending" ? "warning" : "error"}
                    >
                      {job.status}
                    </Badge>
                  )}
                </div>
              </div>
              <div className="text-right">
                {job.deadline && (
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    Deadline: {new Date(job.deadline).toLocaleDateString()}
                  </div>
                )}
              </div>
            </div>

            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h2 className="text-lg font-medium text-gray-800 dark:text-white/90">Details</h2>
                <div className="mt-3 space-y-2 text-sm text-gray-700 dark:text-gray-300">
                  <div>Location: {job.location || "Remote"}</div>
                  <div>
                    Salary: {job.salaryMin || "-"} {job.salaryMax ? `- ${job.salaryMax}` : ""}
                  </div>
                  <div>Experience Level: {(job.experienceLevel || []).join(", ") || "N/A"}</div>
                  <div>Education: {job.education || "N/A"}</div>
                  {job.conversionPossible && <div>Conversion Possible: {job.conversionPossible}</div>}
                  {job.minCourseCompletion && <div>Min Course Completion: {job.minCourseCompletion}</div>}
                  {job.internshipExperienceRequired && <div>Internship Experience: {job.internshipExperienceRequired}</div>}
                </div>
              </div>
              <div>
                <h2 className="text-lg font-medium text-gray-800 dark:text-white/90">Required Skills</h2>
                <div className="mt-3 flex flex-wrap gap-2">
                  {(job.requiredSkills || []).map((s, i) => (
                    <Badge key={i} size="sm" color="light">
                      {s}
                    </Badge>
                  ))}
                  {(job.niceToHaveSkills || []).map((s, i) => (
                    <Badge key={`n-${i}`} size="sm" color="light">
                      {s}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-1 gap-6">
              {job.shortSummary && (
                <div>
                  <h2 className="text-lg font-medium text-gray-800 dark:text-white/90">Summary</h2>
                  <p className="mt-2 text-gray-700 dark:text-gray-300">{job.shortSummary}</p>
                </div>
              )}
              {(job.roleRationale || job.companyProblem || job.roleImpact) && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {job.roleRationale && (
                    <div>
                      <h3 className="font-medium text-gray-800 dark:text-white/90">Role Rationale</h3>
                      <p className="mt-2 text-gray-700 dark:text-gray-300">{job.roleRationale}</p>
                    </div>
                  )}
                  {job.companyProblem && (
                    <div>
                      <h3 className="font-medium text-gray-800 dark:text-white/90">Company Problem</h3>
                      <p className="mt-2 text-gray-700 dark:text-gray-300">{job.companyProblem}</p>
                    </div>
                  )}
                  {job.roleImpact && (
                    <div>
                      <h3 className="font-medium text-gray-800 dark:text-white/90">Role Impact</h3>
                      <p className="mt-2 text-gray-700 dark:text-gray-300">{job.roleImpact}</p>
                    </div>
                  )}
                </div>
              )}
              {job.responsibilities && (
                <div>
                  <h2 className="text-lg font-medium text-gray-800 dark:text-white/90">Responsibilities</h2>
                  <p className="mt-2 text-gray-700 dark:text-gray-300 whitespace-pre-wrap">{job.responsibilities}</p>
                </div>
              )}
              {job.perks && job.perks.length > 0 && (
                <div>
                  <h2 className="text-lg font-medium text-gray-800 dark:text-white/90">Perks</h2>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {job.perks.map((p, i) => (
                      <Badge key={i} size="sm" color="light">
                        {p}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {(job.recommendedCourses?.length || job.recommendedInternships?.length || job.recommendedMentors?.length) ? (
              <div className="space-y-6 pt-6 border-t border-gray-200 dark:border-gray-800 mt-8">
                <h2 className="text-xl font-bold text-gray-800 dark:text-white">Recommended Growth</h2>

                {job.recommendedCourses && job.recommendedCourses.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold mb-3 text-gray-700 dark:text-gray-200">Recommended Courses</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {job.recommendedCourses.map((c) => (
                        <div key={c._id} className="p-4 border rounded-lg bg-white dark:bg-gray-800 dark:border-gray-700">
                          <h4 className="font-medium text-gray-900 dark:text-white">{c.title}</h4>
                          <p className="text-sm text-gray-500">{c.level}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {job.recommendedInternships && job.recommendedInternships.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold mb-3 text-gray-700 dark:text-gray-200">Recommended Internships</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {job.recommendedInternships.map((i) => (
                        <div key={i._id} className="p-4 border rounded-lg bg-white dark:bg-gray-800 dark:border-gray-700">
                          <h4 className="font-medium text-gray-900 dark:text-white">{i.title}</h4>
                          <p className="text-sm text-gray-500">
                            {typeof i.company === 'string' ? i.company : i.company?.company_name}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {job.recommendedMentors && job.recommendedMentors.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold mb-3 text-gray-700 dark:text-gray-200">Recommended Mentors</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {job.recommendedMentors.map((m) => (
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

            {/* Recruiter View: Applicants */}
            {isRecruiter && companyId && id && (
              <ApplicantList companyId={companyId} jobId={id} />
            )}

          </div>
        ) : (
          <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
            <div className="text-center text-gray-600 dark:text-gray-400">Job not found</div>
          </div>
        )}
      </div>

      <Modal isOpen={showApplyModal} onClose={() => setShowApplyModal(false)} title={`Apply for ${job?.title}`}>
        <div className="p-6">
          <form onSubmit={handleApply}>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Upload Resume (PDF)</label>
              <input
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={(e) => setResume(e.target.files ? e.target.files[0] : null)}
                className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                required
              />
            </div>
            <div className="flex justify-end gap-3">
              <Button type="button" variant="outline" onClick={() => setShowApplyModal(false)}>Cancel</Button>
              <Button type="submit" disabled={isApplying || !resume}>
                {isApplying ? 'Submitting...' : 'Submit Application'}
              </Button>
            </div>
          </form>
        </div>
      </Modal>
    </>
  );
}
