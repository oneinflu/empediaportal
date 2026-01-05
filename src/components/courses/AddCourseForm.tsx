import React, { useState } from "react";
import Label from "../form/Label";
import Input from "../form/input/InputField";
import Select from "../form/Select";
import MultiSelect from "../form/MultiSelect";
import Radio from "../form/input/Radio";
import Checkbox from "../form/input/Checkbox";
import Button from "../ui/button/Button";
import FileInput from "../form/input/FileInput";
import { courseService } from "../../services/courseService";

interface AddCourseFormProps {
  onCancel?: () => void;
  onSuccess?: () => void;
  courseId?: string;
}

interface Lesson {
  id: string;
  title: string;
  type: "Video" | "PDF/Notes" | "Assignment" | "Quiz" | "Live Session";
  duration: number; // minutes
  isPreviewFree: boolean;
  videoUrl?: string;
  videoFile?: File | null;
  supportingMaterialUrl?: string;
  supportingMaterialType?: string;
  supportingMaterialFile?: File | null;
  description?: string;
}

interface Section {
  id: string;
  title: string;
  duration: string;
  lessons: Lesson[];
}

export default function AddCourseForm({ onCancel, onSuccess, courseId }: AddCourseFormProps) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    title: "",
    hook: "",
    category: "",
    skills: [] as string[],
    courseType: "",
    outcomes: [""] as string[],
    opportunities: [] as string[],
    sections: [] as Section[],
    instructorName: "",
    instructorBio: "",
    instructorLinkedin: "",
    instructorTrustLine: "",
    instructorCompanyLogos: [] as string[],
    // Pricing & Access
    priceType: "Free" as "Free" | "Paid",
    priceAmount: "",
    accessType: "Lifetime" as "Lifetime" | "Limited",
    accessDuration: "", // days
    refundPolicy: "",
    earlyBirdPrice: "",
    hasStudentDiscount: false,
    // Assessment
    hasAssignment: false,
    hasQuiz: false,
    hasProject: false,
    hasCertificate: false,
    completionLogic: "Watch %" as "Watch %" | "Submit Assignment" | "Manual Approval",
    // Visibility
    status: "Draft" as "Draft" | "Published",
    visibility: "Public" as "Public" | "Private",
    isFeatured: false,
    maxStudents: "",
  });
  
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [coverImageFile, setCoverImageFile] = useState<File | null>(null);
  const isEditing = !!courseId;

  React.useEffect(() => {
    const loadCourse = async () => {
      if (!isEditing || !courseId) return;
      try {
        const c = await courseService.getCourse(courseId);
        const sectionsSrc = (c as unknown as { sections?: unknown }).sections;
        const rawSections = Array.isArray(sectionsSrc) ? sectionsSrc : [];
        const mappedSections = rawSections.map((sObj) => {
          const s = sObj as Record<string, unknown>;
          const lessonsSrc = Array.isArray(s.lessons as unknown) ? (s.lessons as unknown[]) : [];
          const lessons = lessonsSrc.map((lObj) => {
            const l = lObj as Record<string, unknown>;
            return {
              id: String(l._id ?? Math.random()),
              title: String(l.title ?? ""),
              type: "Video",
              duration: Number(l.duration ?? 0),
              isPreviewFree: Boolean(l.isPreviewFree ?? false),
              videoUrl: String(l.videoUrl ?? ""),
              supportingMaterialUrl: String(l.supportingMaterialUrl ?? ""),
              supportingMaterialType: String(l.supportingMaterialType ?? ""),
              description: String(l.description ?? ""),
            };
          });
          return {
            id: String(s._id ?? Math.random()),
            title: String(s.title ?? ""),
            duration: "",
            lessons,
          };
        });
        const updated = {
          title: c.title || "",
          hook: c.hook || "",
          category: c.category || "",
          skills: Array.isArray(c.skills) ? (c.skills as string[]) : [],
          courseType: c.courseType || "",
          outcomes: Array.isArray(c.outcomes) ? (c.outcomes as string[]) : [],
          opportunities: Array.isArray(c.opportunities) ? (c.opportunities as string[]) : [],
          sections: mappedSections as Section[],
          instructorName: c.instructorName || "",
          instructorBio: c.instructorBio || "",
          instructorLinkedin: c.instructorLinkedin || "",
          instructorTrustLine: c.instructorTrustLine || "",
          instructorCompanyLogos: Array.isArray(c.instructorCompanyLogos) ? (c.instructorCompanyLogos as string[]) : [],
          // Pricing & Access
          priceType: c.priceType === "Paid" ? "Paid" : "Free" as "Free" | "Paid",
          priceAmount: c.priceAmount ? String(c.priceAmount) : "",
          accessType: c.accessType === "Limited" ? "Limited" : "Lifetime" as "Lifetime" | "Limited",
          accessDuration: c.accessDuration ? String(c.accessDuration) : "",
          refundPolicy: c.refundPolicy || "",
          earlyBirdPrice: c.earlyBirdPrice ? String(c.earlyBirdPrice) : "",
          hasStudentDiscount: !!c.hasStudentDiscount,
          // Assessment
          hasAssignment: !!c.hasAssignment,
          hasQuiz: !!c.hasQuiz,
          hasProject: !!c.hasProject,
          hasCertificate: !!c.hasCertificate,
          completionLogic: c.completionLogic === "Submit Assignment" ? "Submit Assignment" : c.completionLogic === "Manual Approval" ? "Manual Approval" : "Watch %" as "Watch %" | "Submit Assignment" | "Manual Approval",
          // Visibility
          status: c.status === "Published" ? "Published" : "Draft" as "Draft" | "Published",
          visibility: "Public" as "Public" | "Private",
          isFeatured: !!c.isFeatured,
          maxStudents: c.maxStudents ? String(c.maxStudents) : "",
        };
        setFormData(updated);
        setThumbnailFile(null);
        setCoverImageFile(null);
      } catch (e) {
        console.error("Failed to load course", e);
      }
    };
    loadCourse();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [courseId]);

  const categoryOptions = [
    { value: "Tech", label: "Tech" },
    { value: "Finance", label: "Finance" },
    { value: "Design", label: "Design" },
    { value: "Marketing", label: "Marketing" },
    { value: "Operations", label: "Operations" },
    { value: "Soft Skills", label: "Soft Skills" },
  ];

  const skillOptions = [
    { value: "Excel", text: "Excel" },
    { value: "Data Analysis", text: "Data Analysis" },
    { value: "Internship Prep", text: "Internship Prep" },
    { value: "Python", text: "Python" },
    { value: "React", text: "React" },
    { value: "Communication", text: "Communication" },
  ];

  const opportunityOptions = [
    "Internship roles",
    "Entry-level jobs",
    "Mentorships",
  ];

  const lessonTypeOptions = [
    { value: "Video", label: "Video" },
    { value: "PDF/Notes", label: "PDF / Notes" },
    { value: "Assignment", label: "Assignment" },
    { value: "Quiz", label: "Quiz" },
    { value: "Live Session", label: "Live Session" },
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (value: string) => {
    setFormData((prev) => ({ ...prev, category: value }));
  };

  const handleSkillsChange = (selected: string[]) => {
    setFormData((prev) => ({ ...prev, skills: selected }));
  };

  const handleTypeChange = (value: string) => {
    setFormData((prev) => ({ ...prev, courseType: value }));
  };

  // Outcome Handlers
  const handleOutcomeChange = (index: number, value: string) => {
    const newOutcomes = [...formData.outcomes];
    newOutcomes[index] = value;
    setFormData((prev) => ({ ...prev, outcomes: newOutcomes }));
  };

  const addOutcome = () => {
    setFormData((prev) => ({ ...prev, outcomes: [...prev.outcomes, ""] }));
  };

  const removeOutcome = (index: number) => {
    const newOutcomes = formData.outcomes.filter((_, i) => i !== index);
    setFormData((prev) => ({ ...prev, outcomes: newOutcomes }));
  };

  // Opportunity Handlers
  const handleOpportunityChange = (opportunity: string, checked: boolean) => {
    setFormData((prev) => {
      const newOpportunities = checked
        ? [...prev.opportunities, opportunity]
        : prev.opportunities.filter((op) => op !== opportunity);
      return { ...prev, opportunities: newOpportunities };
    });
  };

  // Curriculum Handlers
  const addSection = () => {
    setFormData((prev) => ({
      ...prev,
      sections: [
        ...prev.sections,
        {
          id: Date.now().toString(),
          title: "",
          duration: "",
          lessons: [],
        },
      ],
    }));
  };

  const removeSection = (sectionId: string) => {
    setFormData((prev) => ({
      ...prev,
      sections: prev.sections.filter((s) => s.id !== sectionId),
    }));
  };

  const updateSection = (sectionId: string, field: keyof Section, value: string) => {
    setFormData((prev) => ({
      ...prev,
      sections: prev.sections.map((s) =>
        s.id === sectionId ? { ...s, [field]: value } : s
      ),
    }));
  };

  const addLesson = (sectionId: string) => {
    setFormData((prev) => ({
      ...prev,
      sections: prev.sections.map((s) => {
        if (s.id === sectionId) {
          return {
            ...s,
            lessons: [
              ...s.lessons,
              {
                id: Date.now().toString(),
                title: "",
                type: "Video",
                duration: 0,
                isPreviewFree: false,
              },
            ],
          };
        }
        return s;
      }),
    }));
  };

  const removeLesson = (sectionId: string, lessonId: string) => {
    setFormData((prev) => ({
      ...prev,
      sections: prev.sections.map((s) => {
        if (s.id === sectionId) {
          return {
            ...s,
            lessons: s.lessons.filter((l) => l.id !== lessonId),
          };
        }
        return s;
      }),
    }));
  };

  const updateLesson = (sectionId: string, lessonId: string, field: keyof Lesson, value: string | number | boolean | File | null) => {
    setFormData((prev) => ({
      ...prev,
      sections: prev.sections.map((s) => {
        if (s.id === sectionId) {
          return {
            ...s,
            lessons: s.lessons.map((l) =>
              l.id === lessonId ? { ...l, [field]: value } : l
            ),
          };
        }
        return s;
      }),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // LOGGING PAYLOAD FOR USER REVIEW
    console.log(`⬇️ JSON PAYLOAD AFTER STEP ${step} ⬇️`);
    console.log(JSON.stringify(formData, null, 2));
    console.log("--------------------------------------------------");

    if (step < 3) {
      setStep(step + 1);
    } else {
      console.log("✅ FINAL COURSE FORM SUBMISSION:", formData);
      
      try {
        const hasInvalidLessonTitles = (formData.sections || []).some(s =>
          (s.lessons || []).some(l => !String(l.title || "").trim())
        );
        if (hasInvalidLessonTitles) {
          alert("Please add a title for every lesson.");
          return;
        }
        const data = new FormData();
        
        Object.keys(formData).forEach(key => {
            const value = formData[key as keyof typeof formData];
            if (key === 'sections') {
                 const sectionsPayload = (formData.sections || []).map(s => ({
                   id: s.id,
                   title: s.title,
                   duration: s.duration,
                   lessons: (s.lessons || []).map(l => ({
                     id: l.id,
                     title: l.title,
                     type: l.type,
                     duration: l.duration,
                     isPreviewFree: l.isPreviewFree,
                     videoUrl: l.videoUrl || "",
                     supportingMaterialUrl: l.supportingMaterialUrl || "",
                     supportingMaterialType: l.supportingMaterialType || "",
                     description: l.description || ""
                   }))
                 }));
                 data.append(key, JSON.stringify(sectionsPayload));
            } else if (Array.isArray(value)) {
                 data.append(key, JSON.stringify(value));
            } else {
                 data.append(key, String(value));
            }
        });

        if (thumbnailFile) data.append('thumbnail', thumbnailFile);
        if (coverImageFile) data.append('coverImage', coverImageFile);

        formData.sections.forEach((s) => {
          s.lessons.forEach((l) => {
            if (l.videoFile) {
              data.append(`videoFile_${s.id}_${l.id}`, l.videoFile);
            }
            if (l.supportingMaterialFile) {
              data.append(`materialFile_${s.id}_${l.id}`, l.supportingMaterialFile);
            }
          });
        });

        if (isEditing && courseId) {
          await courseService.updateCourse(courseId, data);
        } else {
          await courseService.createCourse(data);
        }
        if (onSuccess) onSuccess();
      } catch (error) {
        console.error("Failed to create course", error);
        alert("Failed to create course. Please try again.");
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Progress Indicator */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <span className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium ${step >= 1 ? "bg-brand-500 text-white" : "bg-gray-100 text-gray-500 dark:bg-gray-800"}`}>1</span>
          <span className="hidden sm:inline text-sm font-medium text-gray-700 dark:text-gray-300">Basic Info</span>
        </div>
        <div className="h-px flex-1 bg-gray-200 mx-2 dark:bg-gray-700"></div>
        <div className="flex items-center gap-2">
          <span className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium ${step >= 2 ? "bg-brand-500 text-white" : "bg-gray-100 text-gray-500 dark:bg-gray-800"}`}>2</span>
          <span className="hidden sm:inline text-sm font-medium text-gray-700 dark:text-gray-300">Curriculum</span>
        </div>
        <div className="h-px flex-1 bg-gray-200 mx-2 dark:bg-gray-700"></div>
        <div className="flex items-center gap-2">
          <span className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium ${step >= 3 ? "bg-brand-500 text-white" : "bg-gray-100 text-gray-500 dark:bg-gray-800"}`}>3</span>
          <span className="hidden sm:inline text-sm font-medium text-gray-700 dark:text-gray-300">Pricing & Publish</span>
        </div>
      </div>

      {step === 1 && (
        <div className="space-y-6 animate-fadeIn">
          {/* Course Title */}
          <div>
            <Label htmlFor="title">Course Title (Mandatory)</Label>
            <Input
              type="text"
              id="title"
              name="title"
              placeholder="e.g. Excel for Finance Interns (3 Hours)"
              value={formData.title}
              onChange={handleInputChange}
              hint="Clear, outcome-based title"
            />
          </div>

          {/* One-line Hook */}
          <div>
            <Label htmlFor="hook">One-line Hook / Value Proposition</Label>
            <Input
              type="text"
              id="hook"
              name="hook"
              placeholder="e.g. Learn the exact Excel skills used in real finance internships"
              value={formData.hook}
              onChange={handleInputChange}
            />
          </div>

          {/* Category */}
          <div>
            <Label>Category</Label>
            <Select
              options={categoryOptions}
              placeholder="Select Category"
              onChange={handleSelectChange}
              defaultValue={formData.category}
            />
          </div>

          {/* Skill Tags */}
          <div>
            <MultiSelect
              label="Skill Tags (3-6)"
              options={skillOptions}
              defaultSelected={formData.skills}
              onChange={handleSkillsChange}
            />
          </div>

          {/* Course Type */}
          <div>
            <Label>Course Type</Label>
            <div className="flex flex-wrap gap-4 mt-3">
              <Radio
                id="recorded"
                name="courseType"
                value="Recorded"
                label="Recorded"
                checked={formData.courseType === "Recorded"}
                onChange={handleTypeChange}
              />
              <Radio
                id="live"
                name="courseType"
                value="Live"
                label="Live"
                checked={formData.courseType === "Live"}
                onChange={handleTypeChange}
              />
              <Radio
                id="hybrid"
                name="courseType"
                value="Hybrid"
                label="Hybrid (recorded + live doubt session)"
                checked={formData.courseType === "Hybrid"}
                onChange={handleTypeChange}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label>Thumbnail Image</Label>
              <FileInput onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  setThumbnailFile(e.target.files[0]);
                }
              }} />
            </div>
            <div>
              <Label>Cover Image</Label>
              <FileInput onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  setCoverImageFile(e.target.files[0]);
                }
              }} />
            </div>
          </div>

          <div className="h-px bg-gray-200 dark:bg-gray-700 my-6"></div>
          
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">Instructor Info</h3>

          {/* Instructor Name */}
          <div>
            <Label htmlFor="instructorName">Instructor Name</Label>
            <Input
              type="text"
              id="instructorName"
              name="instructorName"
              placeholder="e.g. John Doe"
              value={formData.instructorName}
              onChange={handleInputChange}
            />
          </div>

          {/* Short Bio */}
          <div>
            <Label htmlFor="instructorBio">Short Bio (2-3 lines)</Label>
            <textarea
              id="instructorBio"
              name="instructorBio"
              className="w-full min-h-[80px] p-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all resize-y text-sm"
              placeholder="Briefly describe your background and expertise..."
              value={formData.instructorBio}
              onChange={(e) => setFormData(prev => ({ ...prev, instructorBio: e.target.value }))}
            />
          </div>

          {/* Experience Proof */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100">Experience Proof</h3>
            
            <div>
              <Label htmlFor="instructorLinkedin">LinkedIn Profile</Label>
              <Input
                type="text"
                id="instructorLinkedin"
                name="instructorLinkedin"
                placeholder="https://linkedin.com/in/..."
                value={formData.instructorLinkedin}
                onChange={handleInputChange}
              />
            </div>

            <div>
              <Label htmlFor="instructorCompanyLogos">Company Names (for logos)</Label>
              <Input
                type="text"
                id="instructorCompanyLogos"
                name="instructorCompanyLogos"
                placeholder="e.g. Google, Amazon, Microsoft (comma separated)"
                value={formData.instructorCompanyLogos.join(", ")}
                onChange={(e) => setFormData(prev => ({ ...prev, instructorCompanyLogos: e.target.value.split(",").map(s => s.trim()) }))}
                hint="We will display logos for these companies"
              />
            </div>
          </div>

          {/* Trust Line */}
          <div>
            <Label htmlFor="instructorTrustLine">Why should students trust you? (1 line)</Label>
            <Input
              type="text"
              id="instructorTrustLine"
              name="instructorTrustLine"
              placeholder="e.g. Ex-Google PM with 10 years of experience"
              value={formData.instructorTrustLine}
              onChange={handleInputChange}
            />
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-6 animate-fadeIn">
          {/* Outcomes */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">Outcomes & Opportunities</h3>
            <Label>What you will learn (3-5 bullet points)</Label>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">Students buy outcomes, not syllabus.</p>
            <div className="space-y-3">
              {formData.outcomes.map((outcome, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    type="text"
                    placeholder={`Outcome ${index + 1} (e.g. Build internship-ready Excel models)`}
                    value={outcome}
                    onChange={(e) => handleOutcomeChange(index, e.target.value)}
                  />
                  {formData.outcomes.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeOutcome(index)}
                      className="text-gray-400 hover:text-red-500 transition-colors px-2"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  )}
                </div>
              ))}
              <Button 
                type="button" 
                variant="outline" 
                size="sm" 
                onClick={addOutcome}
                className="mt-2"
              >
                + Add Outcome
              </Button>
            </div>
          </div>

          {/* Opportunities */}
          <div>
            <Label>After this course, you can apply for</Label>
            <div className="mt-3 space-y-3">
              {opportunityOptions.map((option) => (
                <Checkbox
                  key={option}
                  id={`opportunity-${option.replace(/\s+/g, '-').toLowerCase()}`}
                  label={option}
                  checked={formData.opportunities.includes(option)}
                  onChange={(checked) => handleOpportunityChange(option, checked)}
                />
              ))}
            </div>
          </div>

          {/* Assessment */}
          <div className="border-t border-gray-100 dark:border-gray-700 pt-6">
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">Assessment & Certification</h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                <Checkbox 
                    id="hasAssignment" 
                    label="Assignment" 
                    checked={formData.hasAssignment} 
                    onChange={(checked) => setFormData(prev => ({ ...prev, hasAssignment: checked }))} 
                />
                <Checkbox 
                    id="hasQuiz" 
                    label="Quiz" 
                    checked={formData.hasQuiz} 
                    onChange={(checked) => setFormData(prev => ({ ...prev, hasQuiz: checked }))} 
                />
                <Checkbox 
                    id="hasProject" 
                    label="Mini Project" 
                    checked={formData.hasProject} 
                    onChange={(checked) => setFormData(prev => ({ ...prev, hasProject: checked }))} 
                />
                <Checkbox 
                    id="hasCertificate" 
                    label="Certificate on Completion" 
                    checked={formData.hasCertificate} 
                    onChange={(checked) => setFormData(prev => ({ ...prev, hasCertificate: checked }))} 
                />
            </div>

            <div>
                <Label>Completion Logic</Label>
                <div className="flex flex-wrap gap-4 mt-2">
                     <Radio
                        id="logic-watch"
                        name="completionLogic"
                        value="Watch %"
                        label="Watch %"
                        checked={formData.completionLogic === "Watch %"}
                        onChange={(value) => setFormData(prev => ({ ...prev, completionLogic: value as "Watch %" | "Submit Assignment" | "Manual Approval" }))}
                    />
                    <Radio
                        id="logic-assignment"
                        name="completionLogic"
                        value="Submit Assignment"
                        label="Submit Assignment"
                        checked={formData.completionLogic === "Submit Assignment"}
                        onChange={(value) => setFormData(prev => ({ ...prev, completionLogic: value as "Watch %" | "Submit Assignment" | "Manual Approval" }))}
                    />
                     <Radio
                        id="logic-manual"
                        name="completionLogic"
                        value="Manual Approval"
                        label="Manual Approval"
                        checked={formData.completionLogic === "Manual Approval"}
                        onChange={(value) => setFormData(prev => ({ ...prev, completionLogic: value as "Watch %" | "Submit Assignment" | "Manual Approval" }))}
                    />
                </div>
            </div>
          </div>

          {/* Curriculum Structure */}
          <div className="border-t border-gray-100 dark:border-gray-700 pt-6">
             <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">Curriculum Structure</h3>
             <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">Keep total lessons ideally 5–15 max.</p>
             
             <div className="space-y-8">
                {formData.sections.map((section, sectionIndex) => (
                    <div key={section.id} className="border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden bg-gray-50/50 dark:bg-gray-800/50">
                    {/* Section Header */}
                    <div className="p-4 bg-gray-100 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex-1 space-y-3 sm:space-y-0 sm:flex sm:gap-4">
                        <div className="flex-1">
                            <Input
                            type="text"
                            placeholder={`Section ${sectionIndex + 1} Title`}
                            value={section.title}
                            onChange={(e) => updateSection(section.id, "title", e.target.value)}
                            className="bg-white dark:bg-gray-900 font-medium"
                            />
                        </div>
                        <div className="w-full sm:w-40">
                            <Input
                            type="text"
                            placeholder="Duration (opt)"
                            value={section.duration}
                            onChange={(e) => updateSection(section.id, "duration", e.target.value)}
                            className="bg-white dark:bg-gray-900 text-sm"
                            />
                        </div>
                        </div>
                        <button
                        type="button"
                        onClick={() => removeSection(section.id)}
                        className="text-gray-400 hover:text-red-500 transition-colors p-2"
                        title="Remove Section"
                        >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                        </button>
                    </div>

                    {/* Lessons List */}
                    <div className="p-4 space-y-4">
                        {section.lessons.map((lesson, lessonIndex) => (
                        <div key={lesson.id} className="flex flex-col gap-4 p-4 bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 relative group">
                            <div className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                                type="button"
                                onClick={() => removeLesson(section.id, lesson.id)}
                                className="text-gray-400 hover:text-red-500 p-1"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                            </div>
                            
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="sm:col-span-2">
                                <Label className="text-xs mb-1">Lesson Title</Label>
                                <Input
                                type="text"
                                placeholder={`Lesson ${lessonIndex + 1} Title`}
                                value={lesson.title}
                                onChange={(e) => updateLesson(section.id, lesson.id, "title", e.target.value)}
                                className="h-9 text-sm"
                                />
                            </div>
                            
                            <div>
                                <Label className="text-xs mb-1">Type</Label>
                                <Select
                                options={lessonTypeOptions}
                                onChange={(value) => updateLesson(section.id, lesson.id, "type", value)}
                                defaultValue={lesson.type}
                                className="h-9 text-sm py-1"
                                />
                            </div>

                            <div>
                                <Label className="text-xs mb-1">Duration (min)</Label>
                                <Input
                                type="number"
                                placeholder="Min"
                                value={lesson.duration.toString()}
                                onChange={(e) => updateLesson(section.id, lesson.id, "duration", parseInt(e.target.value) || 0)}
                                className="h-9 text-sm"
                                min="0"
                                />
                            </div>

                            {/* Video Upload */}
                            {lesson.type === "Video" && (
                              <div className="sm:col-span-2">
                                <Label className="text-xs mb-1">Video File</Label>
                                <FileInput
                                  accept="video/*"
                                  onChange={(e) => {
                                    if (e.target.files && e.target.files[0]) {
                                      updateLesson(section.id, lesson.id, "videoFile", e.target.files[0]);
                                    }
                                  }}
                                />
                                {lesson.videoUrl && !lesson.videoFile && (
                                  <p className="text-xs text-green-600 mt-1">
                                    Current video uploaded. Upload new to replace.
                                  </p>
                                )}
                              </div>
                            )}

                            {/* Material Upload */}
                            {(lesson.type === "PDF/Notes" || lesson.type === "Assignment") && (
                              <div className="sm:col-span-2">
                                <Label className="text-xs mb-1">Material File</Label>
                                <FileInput
                                  accept=".pdf,.doc,.docx,.zip"
                                  onChange={(e) => {
                                    if (e.target.files && e.target.files[0]) {
                                      updateLesson(section.id, lesson.id, "supportingMaterialFile", e.target.files[0]);
                                    }
                                  }}
                                />
                                {lesson.supportingMaterialUrl && !lesson.supportingMaterialFile && (
                                  <p className="text-xs text-green-600 mt-1">
                                    Current material uploaded. Upload new to replace.
                                  </p>
                                )}
                              </div>
                            )}
                            </div>

                            <div className="flex items-center gap-2">
                            <Checkbox
                                id={`preview-${lesson.id}`}
                                checked={lesson.isPreviewFree}
                                onChange={(checked) => updateLesson(section.id, lesson.id, "isPreviewFree", checked)}
                                label="Free Preview"
                                className="w-4 h-4"
                            />
                            </div>
                        </div>
                        ))}

                        <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => addLesson(section.id)}
                        className="w-full border-dashed border-gray-300 dark:border-gray-600 text-gray-500 hover:text-brand-500 hover:border-brand-500"
                        >
                        + Add Lesson
                        </Button>
                    </div>
                    </div>
                ))}

                <Button
                    type="button"
                    variant="outline"
                    onClick={addSection}
                    className="w-full py-4 border-2 border-dashed border-gray-300 dark:border-gray-600 text-gray-500 hover:text-brand-500 hover:border-brand-500 hover:bg-gray-50 dark:hover:bg-gray-800/50"
                >
                    + Add New Section
                </Button>
            </div>
          </div>
        </div>
      )}

      {/* Content step removed */}

      {step === 3 && (
        <div className="space-y-6 animate-fadeIn">
          {/* Pricing */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">Pricing & Access</h3>
            
            <div className="flex gap-4 mb-4">
                <Radio
                    id="price-free"
                    name="priceType"
                    value="Free"
                    label="Free"
                    checked={formData.priceType === "Free"}
                    onChange={(value) => setFormData(prev => ({ ...prev, priceType: value as "Free" | "Paid" }))}
                />
                <Radio
                    id="price-paid"
                    name="priceType"
                    value="Paid"
                    label="Paid"
                    checked={formData.priceType === "Paid"}
                    onChange={(value) => setFormData(prev => ({ ...prev, priceType: value as "Free" | "Paid" }))}
                />
            </div>

            {formData.priceType === "Paid" && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 animate-fadeIn">
                    <div>
                        <Label htmlFor="priceAmount">Price (₹)</Label>
                        <Input
                            type="number"
                            id="priceAmount"
                            name="priceAmount"
                            placeholder="999"
                            value={formData.priceAmount}
                            onChange={handleInputChange}
                        />
                    </div>
                     <div>
                        <Label htmlFor="earlyBirdPrice">Early Bird Price (Optional)</Label>
                        <Input
                            type="number"
                            id="earlyBirdPrice"
                            name="earlyBirdPrice"
                            placeholder="499"
                            value={formData.earlyBirdPrice}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div className="sm:col-span-2">
                        <Checkbox 
                            id="studentDiscount"
                            label="Enable Student Discount"
                            checked={formData.hasStudentDiscount}
                            onChange={(checked) => setFormData(prev => ({ ...prev, hasStudentDiscount: checked }))}
                        />
                    </div>
                </div>
            )}
            
            <div className="mt-4">
                 <Label>Access Type</Label>
                 <div className="flex gap-4 mt-2 mb-4">
                    <Radio
                        id="access-lifetime"
                        name="accessType"
                        value="Lifetime"
                        label="Lifetime"
                        checked={formData.accessType === "Lifetime"}
                        onChange={(value) => setFormData(prev => ({ ...prev, accessType: value as "Lifetime" | "Limited" }))}
                    />
                    <Radio
                        id="access-limited"
                        name="accessType"
                        value="Limited"
                        label="Limited Period"
                        checked={formData.accessType === "Limited"}
                        onChange={(value) => setFormData(prev => ({ ...prev, accessType: value as "Lifetime" | "Limited" }))}
                    />
                </div>
                {formData.accessType === "Limited" && (
                     <div className="animate-fadeIn mb-4">
                        <Label htmlFor="accessDuration">Duration (Days)</Label>
                        <Input
                            type="number"
                            id="accessDuration"
                            name="accessDuration"
                            placeholder="30"
                            value={formData.accessDuration}
                            onChange={handleInputChange}
                        />
                    </div>
                )}
            </div>

            <div>
                <Label htmlFor="refundPolicy">Refund Policy</Label>
                <Input
                    type="text"
                    id="refundPolicy"
                    name="refundPolicy"
                    placeholder="e.g. 7-day money back guarantee"
                    value={formData.refundPolicy}
                    onChange={handleInputChange}
                />
            </div>
          </div>

          <div className="border-t border-gray-100 dark:border-gray-700 pt-6">
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">Visibility & Publishing</h3>
             <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                 <div>
                    <Label>Visibility</Label>
                     <div className="flex gap-4 mt-2">
                        <Radio
                            id="vis-public"
                            name="visibility"
                            value="Public"
                            label="Public"
                            checked={formData.visibility === "Public"}
                            onChange={(value) => setFormData(prev => ({ ...prev, visibility: value as "Public" | "Private" }))}
                        />
                        <Radio
                            id="vis-private"
                            name="visibility"
                            value="Private"
                            label="Private (Invite Only)"
                            checked={formData.visibility === "Private"}
                            onChange={(value) => setFormData(prev => ({ ...prev, visibility: value as "Public" | "Private" }))}
                        />
                    </div>
                 </div>
                 
                 <div>
                    <Label>Status</Label>
                     <div className="flex gap-4 mt-2">
                        <Radio
                            id="status-draft"
                            name="status"
                            value="Draft"
                            label="Draft"
                            checked={formData.status === "Draft"}
                            onChange={(value) => setFormData(prev => ({ ...prev, status: value as "Draft" | "Published" }))}
                        />
                        <Radio
                            id="status-published"
                            name="status"
                            value="Published"
                            label="Published"
                            checked={formData.status === "Published"}
                            onChange={(value) => setFormData(prev => ({ ...prev, status: value as "Draft" | "Published" }))}
                        />
                    </div>
                 </div>

                 <div className="sm:col-span-2 space-y-3">
                     <Checkbox 
                        id="isFeatured"
                        label="Featured Course"
                        checked={formData.isFeatured}
                        onChange={(checked) => setFormData(prev => ({ ...prev, isFeatured: checked }))}
                    />
                     <div>
                        <Label htmlFor="maxStudents">Max Student Limit (Optional)</Label>
                        <Input
                            type="number"
                            id="maxStudents"
                            name="maxStudents"
                            placeholder="Leave empty for unlimited"
                            value={formData.maxStudents}
                            onChange={handleInputChange}
                        />
                    </div>
                 </div>
             </div>
          </div>
        </div>
      )}

      <div className="flex justify-end gap-3 mt-6 pt-6 border-t border-gray-100 dark:border-gray-700">
        {step === 1 ? (
          <>
            {onCancel && (
              <Button variant="outline" type="button" onClick={onCancel}>
                Cancel
              </Button>
            )}
            <Button variant="primary" type="submit">
              Next Step
            </Button>
          </>
        ) : (
          <>
            <Button variant="outline" type="button" onClick={() => setStep(step - 1)}>
              Back
            </Button>
            <Button variant="primary" type="submit">
              {step === 3 ? "Submit Course" : "Next Step"}
            </Button>
          </>
        )}
      </div>

      {/* Debug: Live JSON Payload Preview */}
      <div className="mt-8 border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden">
        <div className="bg-gray-100 dark:bg-gray-800 px-4 py-2 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
          <span className="text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
            Live Data Payload (Step {step}/3)
          </span>
          <span className="text-[10px] text-gray-500 bg-gray-200 dark:bg-gray-700 px-2 py-0.5 rounded-full">
            Debug View
          </span>
        </div>
        <div className="bg-gray-900 p-4 overflow-x-auto max-h-96 custom-scrollbar">
          <pre className="text-xs font-mono text-green-400 whitespace-pre-wrap">
            {JSON.stringify(formData, null, 2)}
          </pre>
        </div>
      </div>

      {/* Debug: Simulated API Response */}
      <div className="mt-8 border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden">
        <div className="bg-gray-100 dark:bg-gray-800 px-4 py-2 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
          <span className="text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
            Simulated API Response (Preview)
          </span>
          <span className="text-[10px] text-blue-600 bg-blue-100 dark:bg-blue-900/30 px-2 py-0.5 rounded-full border border-blue-200 dark:border-blue-800">
            201 Created
          </span>
        </div>
        <div className="bg-gray-900 p-4 overflow-x-auto max-h-96 custom-scrollbar">
          <pre className="text-xs font-mono text-blue-400 whitespace-pre-wrap">
            {JSON.stringify({
              status: "success",
              message: "Course created successfully",
              data: {
                id: "course_" + Math.random().toString(36).substr(2, 9),
                slug: formData.title ? formData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-') : "untitled-course",
                ...formData,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
                stats: {
                  students: 0,
                  rating: 0,
                  reviews: 0
                }
              }
            }, null, 2)}
          </pre>
        </div>
      </div>
    </form>
  );
}
