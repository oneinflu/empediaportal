import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import PageMeta from "../components/common/PageMeta";
import PageBreadcrumb from "../components/common/PageBreadCrumb";
import Badge from "../components/ui/badge/Badge";
import Button from "../components/ui/button/Button";
import { courseService, Course, Section, Lesson } from "../services/courseService";

export default function CourseDetails() {
  const { id } = useParams();
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [curriculum, setCurriculum] = useState<Section[]>([]);
  const [currLoading, setCurrLoading] = useState(false);
  const [newSectionTitle, setNewSectionTitle] = useState("");
  const [lessonInputs, setLessonInputs] = useState<Record<string, Partial<Lesson>>>({});

  useEffect(() => {
    const fetchCourse = async () => {
      if (!id) return;
      setLoading(true);
      try {
        const data = await courseService.getCourse(id);
        setCourse(data);
      } catch {
        setCourse(null);
      } finally {
        setLoading(false);
      }
    };
    fetchCourse();
  }, [id]);

  useEffect(() => {
    const fetchCurriculum = async () => {
      if (!id) return;
      setCurrLoading(true);
      try {
        const data = await courseService.getCurriculum(id);
        setCurriculum(data);
      } finally {
        setCurrLoading(false);
      }
    };
    fetchCurriculum();
  }, [id]);

  const handleAddSection = async () => {
    if (!id || !newSectionTitle.trim()) return;
    const added = await courseService.addSection(id, newSectionTitle.trim());
    setCurriculum((prev) => [...prev, added]);
    setNewSectionTitle("");
  };

  const updateLessonInput = (sectionId: string, field: keyof Lesson, value: string | number | boolean) => {
    setLessonInputs((prev) => ({
      ...prev,
      [sectionId]: {
        ...prev[sectionId],
        [field]: value as never
      }
    }));
  };

  const handleAddLesson = async (sectionId: string) => {
    if (!id) return;
    const payload = lessonInputs[sectionId] || {};
    if (!payload.title) return;
    const added = await courseService.addLesson(id, sectionId, {
      title: payload.title,
      type: "Video",
      duration: payload.duration || 0,
      isPreviewFree: !!payload.isPreviewFree,
      videoUrl: payload.videoUrl
    });
    setCurriculum((prev) =>
      prev.map((s) =>
        s._id === sectionId ? { ...s, lessons: [...(s.lessons || []), added] } : s
      )
    );
    setLessonInputs((prev) => ({ ...prev, [sectionId]: {} }));
  };

  const handleDelete = async () => {
    if (!id) return;
    const confirm = window.confirm("Are you sure you want to delete this course?");
    if (!confirm) return;
    try {
      await courseService.deleteCourse(id);
      alert("Course deleted");
      navigate("/courses");
    } catch {
      alert("Failed to delete course");
    }
  };

  return (
    <>
      <PageMeta title="Course Details | Empedia Admin" description="View course details" />
      <PageBreadcrumb pageTitle="Course Details" />
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <Link to="/courses">
            <Button variant="outline">Back</Button>
          </Link>
          {course && (
            <Button variant="outline" onClick={handleDelete}>Delete</Button>
          )}
        </div>
        {loading ? (
          <div className="flex justify-center items-center p-8">
            <div className="animate-spin rounded-full border-4 border-gray-200 border-t-blue-600 w-8 h-8"></div>
          </div>
        ) : course ? (
          <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
            <div className="flex gap-6">
              {course.coverImage && (
                <img
                  src={`https://empediaapis-w7dq6.ondigitalocean.app/${course.coverImage}`}
                  alt={course.title}
                  className="w-40 h-40 rounded-xl object-cover"
                />
              )}
              <div className="flex-1">
                <h1 className="text-2xl font-semibold text-gray-800 dark:text-white/90">{course.title}</h1>
                <div className="mt-2 flex flex-wrap gap-2">
                  {course.level && <Badge size="sm" color="light">{course.level}</Badge>}
                  {course.priceType && (
                    <Badge size="sm" color={course.priceType === "Free" ? "success" : "primary"}>
                      {course.priceType}
                    </Badge>
                  )}
                  {typeof course.priceAmount === "number" && course.priceType === "Paid" && (
                    <Badge size="sm" color="light">${course.priceAmount}</Badge>
                  )}
                </div>
                <div className="mt-3 text-sm text-gray-700 dark:text-gray-300">
                  {course.hook}
                </div>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h2 className="text-lg font-medium text-gray-800 dark:text-white/90">Details</h2>
                <div className="mt-3 space-y-2 text-sm text-gray-700 dark:text-gray-300">
                  <div>Category: {course.category || "N/A"}</div>
                  <div>Access: {course.accessType || "N/A"}</div>
                  {course.accessDuration && <div>Duration: {course.accessDuration} days</div>}
                  {course.refundPolicy && <div>Refund Policy: {course.refundPolicy}</div>}
                </div>
              </div>
              <div>
                <h2 className="text-lg font-medium text-gray-800 dark:text-white/90">Skills</h2>
                <div className="mt-3 flex flex-wrap gap-2">
                  {(course.skills || []).map((s, i) => (
                    <Badge key={i} size="sm" color="light">
                      {s}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-1 gap-6">
              {course.outcomes && course.outcomes.length > 0 && (
                <div>
                  <h2 className="text-lg font-medium text-gray-800 dark:text-white/90">Outcomes</h2>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {course.outcomes.map((o, i) => (
                      <Badge key={i} size="sm" color="light">
                        {o}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
              {course.opportunities && course.opportunities.length > 0 && (
                <div>
                  <h2 className="text-lg font-medium text-gray-800 dark:text-white/90">Opportunities</h2>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {course.opportunities.map((o, i) => (
                      <Badge key={i} size="sm" color="light">
                        {o}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
              {(course.instructorName || course.instructorBio) && (
                <div>
                  <h2 className="text-lg font-medium text-gray-800 dark:text-white/90">Instructor</h2>
                  <div className="mt-2 text-sm text-gray-700 dark:text-gray-300">
                    <div>{course.instructorName}</div>
                    <div className="mt-1">{course.instructorBio}</div>
                  </div>
                </div>
              )}
            </div>

            {(course.recommendedJobs?.length || course.recommendedInternships?.length || course.recommendedMentors?.length) ? (
              <div className="space-y-6 pt-6 border-t border-gray-200 dark:border-gray-800 mt-8">
                <h2 className="text-xl font-bold text-gray-800 dark:text-white">Recommended Growth</h2>

                {course.recommendedJobs && course.recommendedJobs.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold mb-3 text-gray-700 dark:text-gray-200">Recommended Jobs</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {course.recommendedJobs.map((j) => (
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

                {course.recommendedInternships && course.recommendedInternships.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold mb-3 text-gray-700 dark:text-gray-200">Recommended Internships</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {course.recommendedInternships.map((i) => (
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

                {course.recommendedMentors && course.recommendedMentors.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold mb-3 text-gray-700 dark:text-gray-200">Recommended Mentors</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {course.recommendedMentors.map((m) => (
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

            <div className="mt-8">
              <h2 className="text-lg font-medium text-gray-800 dark:text-white/90">Curriculum</h2>
              <div className="mt-3">
                {currLoading ? (
                  <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <div className="animate-spin rounded-full border-4 border-gray-200 border-t-blue-600 w-5 h-5"></div>
                    Loading curriculum
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <input
                        value={newSectionTitle}
                        onChange={(e) => setNewSectionTitle(e.target.value)}
                        placeholder="New section title"
                        className="rounded-lg border border-gray-300 px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
                      />
                      <Button variant="primary" onClick={handleAddSection}>Add Section</Button>
                    </div>
                    <div className="space-y-3">
                      {curriculum.map((section) => (
                        <div key={section._id} className="rounded-xl border border-gray-200 dark:border-gray-800 p-4">
                          <div className="flex items-center justify-between">
                            <div className="font-medium text-gray-800 dark:text-white/90">{section.title}</div>
                            {section.bunnyPath && (
                              <div className="text-xs text-gray-500 dark:text-gray-400">{section.bunnyPath}</div>
                            )}
                          </div>
                          <div className="mt-3 space-y-2">
                            {(section.lessons || []).map((lesson) => (
                              <div key={lesson._id} className="flex items-center justify-between rounded-lg bg-gray-50 dark:bg-white/[0.03] px-3 py-2">
                                <div className="text-sm text-gray-800 dark:text-gray-200">{lesson.title}</div>
                                <div className="text-xs text-gray-500 dark:text-gray-400">
                                  {lesson.type} {typeof lesson.duration === "number" ? `• ${lesson.duration} min` : ""} {lesson.isPreviewFree ? "• Free Preview" : ""}
                                </div>
                              </div>
                            ))}
                          </div>
                          <div className="mt-4 grid grid-cols-1 md:grid-cols-5 gap-2">
                            <input
                              value={(lessonInputs[section._id || ""]?.title as string) || ""}
                              onChange={(e) => updateLessonInput(section._id || "", "title", e.target.value)}
                              placeholder="Lesson title"
                              className="rounded-lg border border-gray-300 px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
                            />
                            <input
                              value={(lessonInputs[section._id || ""]?.videoUrl as string) || ""}
                              onChange={(e) => updateLessonInput(section._id || "", "videoUrl", e.target.value)}
                              placeholder="Video URL"
                              className="rounded-lg border border-gray-300 px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
                            />
                            <input
                              type="number"
                              value={(lessonInputs[section._id || ""]?.duration as number) || 0}
                              onChange={(e) => updateLessonInput(section._id || "", "duration", Number(e.target.value))}
                              placeholder="Duration (min)"
                              className="rounded-lg border border-gray-300 px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
                            />
                            <label className="inline-flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                              <input
                                type="checkbox"
                                checked={!!lessonInputs[section._id || ""]?.isPreviewFree}
                                onChange={(e) => updateLessonInput(section._id || "", "isPreviewFree", e.target.checked)}
                                className="rounded border-gray-300 dark:border-gray-700"
                              />
                              Free preview
                            </label>
                            <Button variant="primary" onClick={() => handleAddLesson(section._id || "")}>Add Lesson</Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
            <div className="text-center text-gray-600 dark:text-gray-400">Course not found</div>
          </div>
        )}
      </div>
    </>
  );
}
