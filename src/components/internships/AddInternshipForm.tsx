import React, { useState, useEffect } from "react";
import Label from "../form/Label";
import Input from "../form/input/InputField";
import Radio from "../form/input/Radio";
import Checkbox from "../form/input/Checkbox";
import Button from "../ui/button/Button";
import MultiSelect from "../form/MultiSelect";
import TextArea from "../form/input/TextArea";
import Select from "../form/Select";
import FileInput from "../form/input/FileInput";
import { internshipService } from "../../services/internshipService";
import { companyService, Company } from "../../services/companyService";

interface AddInternshipFormProps {
  onCancel?: () => void;
  onSuccess?: () => void;
  internshipId?: string;
}

export default function AddInternshipForm({ onCancel, onSuccess, internshipId }: AddInternshipFormProps) {
  const [step, setStep] = useState(1);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [coverImage, setCoverImage] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [formData, setFormData] = useState({
    // Step 1: Internship Basics
    title: "Junior Data Science Intern",
    company: "",
    jobType: "Internship",
    workMode: "",
    location: "",
    experienceLevel: ["Fresher"] as string[],
    // Step 2: Internship Overview
    shortSummary: "Entry-level internship focused on learning Excel, data cleaning, and reporting. Ideal for students.",
    roleRationale: "",
    companyProblem: "",
    roleImpact: "",
    // Step 3: Skills & Requirements
    requiredSkills: ["Excel", "Basic SQL", "Communication"],
    niceToHaveSkills: ["Power BI", "Python"],
    education: "",
    // Step 4: Responsibilities & Perks
    responsibilities: "",
    salaryMin: "",
    salaryMax: "",
    conversionPossible: "Yes",
    perks: [] as string[],
    // Step 5: Smart Linking
    minCourseCompletion: "",
    internshipExperienceRequired: "No",
    recommendedCourses: [] as string[],
    linkedMentorships: [] as string[],
    deadline: "",
  });
  const isEditing = !!internshipId;

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const data = await companyService.getAllCompanies();
        setCompanies(data);
      } catch (error) {
        console.error("Failed to fetch companies", error);
      }
    };
    fetchCompanies();
  }, []);

  useEffect(() => {
    const loadInternship = async () => {
      if (!isEditing || !internshipId) return;
      try {
        const i = await internshipService.getInternshipById(internshipId);
        const companyId = typeof i.company === 'object' ? (i.company?._id || "") : String(i.company || "");
        setFormData(prev => ({
          ...prev,
          title: i.title || prev.title,
          company: companyId,
          jobType: "Internship",
          workMode: i.workMode || "",
          location: i.location || "",
          experienceLevel: Array.isArray(i.experienceLevel) ? i.experienceLevel : prev.experienceLevel,
          shortSummary: i.shortSummary || prev.shortSummary,
          roleRationale: i.roleRationale || "",
          companyProblem: i.companyProblem || "",
          roleImpact: i.roleImpact || "",
          requiredSkills: Array.isArray(i.requiredSkills) ? i.requiredSkills : prev.requiredSkills,
          niceToHaveSkills: Array.isArray(i.niceToHaveSkills) ? i.niceToHaveSkills : prev.niceToHaveSkills,
          education: i.education || "",
          responsibilities: i.responsibilities || "",
          salaryMin: i.salaryMin || "",
          salaryMax: i.salaryMax || "",
          conversionPossible: i.conversionPossible || prev.conversionPossible,
          perks: Array.isArray(i.perks) ? i.perks : prev.perks,
          minCourseCompletion: i.minCourseCompletion || "",
          internshipExperienceRequired: i.internshipExperienceRequired || "No",
          recommendedCourses: [],
          linkedMentorships: [],
          deadline: i.deadline || "",
        }));
      } catch (e) {
        console.error("Failed to load internship", e);
      }
    };
    loadInternship();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [internshipId]);
  const jobTypeOptions = [
    "Internship",
    "Part-time",
    "Project-based",
  ];

  const workModeOptions = [
    "Remote",
    "Hybrid",
    "Onsite"
  ];

  const experienceOptions = [
    "Fresher",
    "Final-year Student",
    "0–1 year"
  ];
  
  const skillOptions = [
    { value: "Excel", text: "Excel" },
    { value: "Basic SQL", text: "Basic SQL" },
    { value: "Communication", text: "Communication" },
    { value: "Power BI", text: "Power BI" },
    { value: "Python", text: "Python" },
    { value: "Tableau", text: "Tableau" },
    { value: "R", text: "R" },
    { value: "Machine Learning", text: "Machine Learning" },
  ];

  const educationOptions = [
    "Any degree",
    "Bachelor's degree in related field",
    "Master's degree in related field",
    "Final-year students allowed",
    "Specific degree (CS/IT/Data Science)"
  ];

  const perkOptions = [
    "Learning budget",
    "Certificate",
    "PPO opportunity",
    "Flexible hours",
    "Health insurance"
  ];

  const courseOptions = [
    { value: "COURSE-001", label: "Excel for Finance Interns" },
    { value: "COURSE-002", label: "Data Analysis Bootcamp" },
    { value: "COURSE-003", label: "Business Communication Masterclass" },
    { value: "COURSE-004", label: "Python for Beginners" },
  ];

  const recommendedCoursesData = [
    { id: "c1", title: "Excel for Finance Interns", skillGap: "Advanced Excel", duration: "2 weeks" },
    { id: "c2", title: "Data Analysis Bootcamp", skillGap: "Data Analysis, SQL", duration: "4 weeks" },
    { id: "c3", title: "Business Comm. Masterclass", skillGap: "Communication", duration: "1 week" }
  ];

  const recommendedMentorshipsData = [
    { id: "m1", name: "Sarah Jenkins", expertise: "Senior Analyst", duration: "3 Sessions", goal: "Portfolio Review" },
    { id: "m2", name: "David Chen", expertise: "Data Lead", duration: "5 Sessions", goal: "Career Roadmap" }
  ];

  const handleArrayToggle = (field: "recommendedCourses" | "linkedMentorships", value: string) => {
    setFormData((prev) => {
      const current = prev[field];
      const updated = current.includes(value)
        ? current.filter((item) => item !== value)
        : [...current, value];
      return { ...prev, [field]: updated };
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCompanyChange = (value: string) => {
    setFormData((prev) => ({ ...prev, company: value }));
  };

  const handleCoverImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setCoverImage(e.target.files[0]);
    }
  };

  const handleJobTypeChange = (value: string) => {
    setFormData((prev) => ({ ...prev, jobType: value }));
  };

  const handleWorkModeChange = (value: string) => {
    setFormData((prev) => ({ ...prev, workMode: value }));
  };

  const handleExperienceChange = (option: string, checked: boolean) => {
    setFormData((prev) => {
      const newExperience = checked
        ? [...prev.experienceLevel, option]
        : prev.experienceLevel.filter((item) => item !== option);
      return { ...prev, experienceLevel: newExperience };
    });
  };

  const handlePerkChange = (perk: string, checked: boolean) => {
    setFormData((prev) => {
      const newPerks = checked
        ? [...prev.perks, perk]
        : prev.perks.filter((p) => p !== perk);
      return { ...prev, perks: newPerks };
    });
  };

  const validateStep = (currentStep: number) => {
    const newErrors: Record<string, string> = {};
    let isValid = true;

    if (currentStep === 1) {
      if (!formData.title.trim()) newErrors.title = "Title is required";
      if (!formData.company) newErrors.company = "Company is required";
      if (!formData.jobType) newErrors.jobType = "Internship type is required";
      if (!formData.workMode) newErrors.workMode = "Work mode is required";
      if ((formData.workMode === "Onsite" || formData.workMode === "Hybrid") && !formData.location.trim()) {
        newErrors.location = "Location is required for Onsite/Hybrid roles";
      }
      if (formData.experienceLevel.length === 0) newErrors.experienceLevel = "Select at least one experience level";
    }

    if (currentStep === 2) {
      if (!formData.shortSummary.trim()) newErrors.shortSummary = "Short summary is required";
    }

    if (currentStep === 3) {
      if (formData.requiredSkills.length === 0) newErrors.requiredSkills = "At least one required skill is needed";
    }

    if (currentStep === 4) {
      if (!formData.responsibilities.trim()) newErrors.responsibilities = "Responsibilities are required";
    }

    if (currentStep === 5) {
      if (!formData.deadline) newErrors.deadline = "Application deadline is required";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      isValid = false;
    } else {
      setErrors({});
    }

    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateStep(step)) {
      return;
    }

    if (step < 5) {
      setStep(step + 1);
    } else {
      setIsSubmitting(true);
      try {
        const data = new FormData();
        Object.keys(formData).forEach((key) => {
          const value = formData[key as keyof typeof formData];
          if (Array.isArray(value)) {
             value.forEach(v => data.append(key, v));
          } else {
             data.append(key, String(value));
          }
        });
        
        if (coverImage) {
          data.append("coverImage", coverImage);
        }

        if (isEditing && internshipId) {
          await internshipService.updateInternship(internshipId, data);
        } else {
          await internshipService.createInternship(data);
        }
        if (onSuccess) onSuccess();
      } catch (error) {
        console.error("Failed to create internship", error);
        alert("Failed to create internship. Please try again.");
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Progress Indicator */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <span className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium ${step >= 1 ? "bg-brand-500 text-white" : "bg-gray-100 text-gray-500 dark:bg-gray-800"}`}>1</span>
          <span className="hidden sm:inline text-sm font-medium text-gray-700 dark:text-gray-300">Basics</span>
        </div>
        <div className="h-px flex-1 bg-gray-200 mx-2 dark:bg-gray-700"></div>
        <div className="flex items-center gap-2">
          <span className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium ${step >= 2 ? "bg-brand-500 text-white" : "bg-gray-100 text-gray-500 dark:bg-gray-800"}`}>2</span>
          <span className="hidden sm:inline text-sm font-medium text-gray-700 dark:text-gray-300">Overview</span>
        </div>
        <div className="h-px flex-1 bg-gray-200 mx-2 dark:bg-gray-700"></div>
        <div className="flex items-center gap-2">
          <span className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium ${step >= 3 ? "bg-brand-500 text-white" : "bg-gray-100 text-gray-500 dark:bg-gray-800"}`}>3</span>
          <span className="hidden sm:inline text-sm font-medium text-gray-700 dark:text-gray-300">Skills</span>
        </div>
        <div className="h-px flex-1 bg-gray-200 mx-2 dark:bg-gray-700"></div>
        <div className="flex items-center gap-2">
          <span className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium ${step >= 4 ? "bg-brand-500 text-white" : "bg-gray-100 text-gray-500 dark:bg-gray-800"}`}>4</span>
          <span className="hidden sm:inline text-sm font-medium text-gray-700 dark:text-gray-300">Details</span>
        </div>
      </div>

      {step === 1 && (
        <div className="space-y-6 animate-fadeIn">
          {/* Internship Title */}
          <div>
            <Label htmlFor="title">Internship Title (Mandatory)</Label>
            <Input
              type="text"
              id="title"
              name="title"
              placeholder="e.g. Junior Data Analyst Intern"
              value={formData.title}
              onChange={handleInputChange}
              error={!!errors.title}
              hint={errors.title}
            />
          </div>

          {/* Company Name */}
          <div>
            <Label htmlFor="company">Company / Organization Name</Label>
            <Select
              options={companies.map(c => ({ value: c._id || "", label: c.company_name }))}
              onChange={handleCompanyChange}
              placeholder="Select Company"
              defaultValue={formData.company}
            />
            {errors.company && <p className="mt-1 text-xs text-red-500">{errors.company}</p>}
          </div>

          {/* Cover Image */}
          <div>
            <Label>Cover Image</Label>
            <FileInput onChange={handleCoverImageChange} />
          </div>

          {/* Internship Type */}
          <div>
            <Label>Internship Type</Label>
            <div className="flex flex-wrap gap-4 mt-3">
              {jobTypeOptions.map((type) => (
                <Radio
                  key={type}
                  id={`type-${type}`}
                  name="jobType"
                  value={type}
                  label={type}
                  checked={formData.jobType === type}
                  onChange={handleJobTypeChange}
                />
              ))}
            </div>
            {errors.jobType && <p className="mt-1 text-xs text-red-500">{errors.jobType}</p>}
          </div>

          {/* Work Mode */}
          <div>
            <Label>Work Mode</Label>
            <div className="flex flex-wrap gap-4 mt-3">
              {workModeOptions.map((mode) => (
                <Radio
                  key={mode}
                  id={`mode-${mode}`}
                  name="workMode"
                  value={mode}
                  label={mode}
                  checked={formData.workMode === mode}
                  onChange={handleWorkModeChange}
                />
              ))}
            </div>
            {errors.workMode && <p className="mt-1 text-xs text-red-500">{errors.workMode}</p>}
          </div>

          {/* Location (Conditional) */}
          {(formData.workMode === "Onsite" || formData.workMode === "Hybrid") && (
            <div className="animate-fadeIn">
              <Label htmlFor="location">Location</Label>
              <Input
                type="text"
                id="location"
                name="location"
                placeholder="e.g. San Francisco, CA"
                value={formData.location}
                onChange={handleInputChange}
                error={!!errors.location}
                hint={errors.location}
              />
            </div>
          )}

          {/* Experience Level */}
          <div>
            <Label>Experience Level</Label>
            <div className="mt-3 space-y-3">
              {experienceOptions.map((option) => (
                <Checkbox
                  key={option}
                  id={`exp-${option.replace(/\s+/g, '-').toLowerCase()}`}
                  label={option}
                  checked={formData.experienceLevel.includes(option)}
                  onChange={(checked) => handleExperienceChange(option, checked)}
                />
              ))}
            </div>
            {errors.experienceLevel && <p className="mt-1 text-xs text-red-500">{errors.experienceLevel}</p>}
          </div>
        </div>
      )}

      {/* Step 2: Internship Overview */}
      {step === 2 && (
        <div className="space-y-6 animate-fadeIn">
          {/* Short Internship Summary */}
          <div>
            <Label htmlFor="shortSummary">Short Internship Summary (3–4 lines)</Label>
            <TextArea
              placeholder="Entry-level internship focused on Excel..."
              rows={4}
              value={formData.shortSummary}
              onChange={(value) => setFormData((prev) => ({ ...prev, shortSummary: value }))}
              error={!!errors.shortSummary}
              hint={errors.shortSummary}
            />
          </div>

          {/* Why this role exists */}
          <div>
            <Label htmlFor="roleRationale">Why this role exists</Label>
            <TextArea
              placeholder="Explain the reason for this opening..."
              rows={3}
              value={formData.roleRationale}
              onChange={(value) => setFormData((prev) => ({ ...prev, roleRationale: value }))}
            />
          </div>

          {/* What problem the company is solving */}
          <div>
            <Label htmlFor="companyProblem">What problem the company is solving</Label>
            <TextArea
              placeholder="Describe the company's mission/problem..."
              rows={3}
              value={formData.companyProblem}
              onChange={(value) => setFormData((prev) => ({ ...prev, companyProblem: value }))}
            />
          </div>

          {/* Why this role matters */}
          <div>
            <Label htmlFor="roleImpact">Why this role matters</Label>
            <TextArea
              placeholder="Explain the impact of this role..."
              rows={3}
              value={formData.roleImpact}
              onChange={(value) => setFormData((prev) => ({ ...prev, roleImpact: value }))}
            />
          </div>
        </div>
      )}

      {/* Step 3: Skills & Requirements */}
      {step === 3 && (
        <div className="space-y-6 animate-fadeIn">
          {/* Required Skills */}
          <div>
            <MultiSelect
              label="Required Skills"
              options={skillOptions}
              defaultSelected={formData.requiredSkills}
              onChange={(selected) => setFormData((prev) => ({ ...prev, requiredSkills: selected }))}
            />
            {errors.requiredSkills && <p className="mt-1 text-xs text-red-500">{errors.requiredSkills}</p>}
          </div>

          {/* Nice-to-have Skills */}
          <div>
            <MultiSelect
              label="Nice-to-have Skills"
              options={skillOptions}
              defaultSelected={formData.niceToHaveSkills}
              onChange={(selected) => setFormData((prev) => ({ ...prev, niceToHaveSkills: selected }))}
            />
          </div>

          {/* Educational Requirement */}
          <div>
            <Label>Educational Requirement</Label>
            <div className="flex flex-col gap-3 mt-3">
              {educationOptions.map((option) => (
                <Radio
                  key={option}
                  id={`edu-${option.replace(/\s+/g, '-').toLowerCase()}`}
                  name="education"
                  value={option}
                  label={option}
                  checked={formData.education === option}
                  onChange={(value) => setFormData((prev) => ({ ...prev, education: value }))}
                />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Step 4: Responsibilities & Perks */}
      {step === 4 && (
        <div className="space-y-6 animate-fadeIn">
          {/* Key Responsibilities */}
          <div>
            <Label htmlFor="responsibilities">Key Responsibilities</Label>
            <TextArea
              placeholder="List the main responsibilities (5–7 bullets max)..."
              rows={5}
              value={formData.responsibilities}
              onChange={(value) => setFormData((prev) => ({ ...prev, responsibilities: value }))}
              hint="e.g. Clean and organize datasets, Prepare weekly reports, Assist senior analysts"
            />
          </div>

          {/* Salary Range (Stipend) */}
          <div>
            <Label>Stipend Range (Monthly)</Label>
            <div className="flex gap-4 mt-1">
              <div className="flex-1">
                <Input
                  type="number"
                  placeholder="Min"
                  value={formData.salaryMin}
                  onChange={(e) => setFormData((prev) => ({ ...prev, salaryMin: e.target.value }))}
                />
              </div>
              <div className="flex-1">
                <Input
                  type="number"
                  placeholder="Max"
                  value={formData.salaryMax}
                  onChange={(e) => setFormData((prev) => ({ ...prev, salaryMax: e.target.value }))}
                />
              </div>
            </div>
          </div>

          {/* Internship-to-job conversion */}
          <div>
            <Label>Internship-to-job conversion possible?</Label>
            <div className="flex gap-4 mt-3">
              <Radio
                id="conversion-yes"
                name="conversion"
                value="Yes"
                label="Yes"
                checked={formData.conversionPossible === "Yes"}
                onChange={() => setFormData((prev) => ({ ...prev, conversionPossible: "Yes" }))}
              />
              <Radio
                id="conversion-no"
                name="conversion"
                value="No"
                label="No"
                checked={formData.conversionPossible === "No"}
                onChange={() => setFormData((prev) => ({ ...prev, conversionPossible: "No" }))}
              />
            </div>
          </div>

          {/* Perks */}
          <div>
            <Label>Perks</Label>
            <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3">
              {perkOptions.map((perk) => (
                <Checkbox
                  key={perk}
                  id={`perk-${perk.replace(/\s+/g, '-').toLowerCase()}`}
                  label={perk}
                  checked={formData.perks.includes(perk)}
                  onChange={(checked) => handlePerkChange(perk, checked)}
                />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Step 5: Smart Linking */}
      {step === 5 && (
        <div className="space-y-6 animate-fadeIn">
          <div className="bg-blue-50 dark:bg-blue-900/10 p-4 rounded-xl border border-blue-100 dark:border-blue-800">
            <h4 className="text-sm font-semibold text-blue-800 dark:text-blue-200 mb-1">Eligibility Check (Smart Linking)</h4>
            <p className="text-xs text-blue-600 dark:text-blue-300">
              Set minimum requirements to automatically filter and prioritize applicants.
            </p>
          </div>

          {/* Minimum Course Completion */}
          <div>
            <Label>Minimum Course Completion Required (Optional)</Label>
            <Select
              options={courseOptions}
              placeholder="Select a course..."
              onChange={(value) => setFormData((prev) => ({ ...prev, minCourseCompletion: value }))}
              className="mt-1"
            />
            {formData.minCourseCompletion && (
              <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                Applicants who completed this course will get priority.
              </p>
            )}
          </div>

          {/* Internship Experience */}
          <div>
            <Label>Previous Internship Experience Required?</Label>
            <div className="flex gap-4 mt-3">
              <Radio
                id="exp-yes"
                name="internshipExp"
                value="Yes"
                label="Yes"
                checked={formData.internshipExperienceRequired === "Yes"}
                onChange={() => setFormData((prev) => ({ ...prev, internshipExperienceRequired: "Yes" }))}
              />
              <Radio
                id="exp-no"
                name="internshipExp"
                value="No"
                label="No"
                checked={formData.internshipExperienceRequired === "No"}
                onChange={() => setFormData((prev) => ({ ...prev, internshipExperienceRequired: "No" }))}
              />
            </div>
          </div>

          <div className="border-t border-gray-100 dark:border-gray-700 my-6"></div>

          <div className="bg-purple-50 dark:bg-purple-900/10 p-4 rounded-xl border border-purple-100 dark:border-purple-800">
            <h4 className="text-sm font-semibold text-purple-800 dark:text-purple-200 mb-1">Linked Opportunities (Empedia Core)</h4>
            <p className="text-xs text-purple-600 dark:text-purple-300">
              Connect applicants with resources to bridge skill gaps.
            </p>
          </div>

          {/* Recommended Courses */}
          <div>
            <Label>Recommended Courses</Label>
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">UI Text: “Complete these short courses to qualify faster”</p>
            <div className="grid gap-3">
              {recommendedCoursesData.map((course) => (
                <div 
                  key={course.id} 
                  className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${formData.recommendedCourses.includes(course.id) ? 'border-brand-500 bg-brand-50/50 dark:border-brand-500 dark:bg-brand-900/20' : 'border-gray-200 hover:border-brand-300 dark:border-gray-700'}`} 
                  onClick={() => handleArrayToggle("recommendedCourses", course.id)}
                >
                   <div className={`w-5 h-5 rounded border flex items-center justify-center mt-0.5 ${formData.recommendedCourses.includes(course.id) ? 'bg-brand-500 border-brand-500' : 'border-gray-300 bg-white dark:bg-gray-800 dark:border-gray-600'}`}>
                      {formData.recommendedCourses.includes(course.id) && <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>}
                   </div>
                   <div>
                      <h5 className="text-sm font-medium text-gray-900 dark:text-white">{course.title}</h5>
                      <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1 text-xs text-gray-500 dark:text-gray-400">
                        <span className="flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-blue-400"></span>
                            Gap: {course.skillGap}
                        </span>
                        <span className="flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-green-400"></span>
                            {course.duration}
                        </span>
                      </div>
                   </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recommended Mentorships */}
          <div>
            <Label>Recommended Mentorships</Label>
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">UI Text: “Get guided by industry professionals for this role”</p>
            <div className="grid gap-3">
              {recommendedMentorshipsData.map((mentor) => (
                <div 
                  key={mentor.id} 
                  className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${formData.linkedMentorships.includes(mentor.id) ? 'border-brand-500 bg-brand-50/50 dark:border-brand-500 dark:bg-brand-900/20' : 'border-gray-200 hover:border-brand-300 dark:border-gray-700'}`} 
                  onClick={() => handleArrayToggle("linkedMentorships", mentor.id)}
                >
                   <div className={`w-5 h-5 rounded border flex items-center justify-center mt-0.5 ${formData.linkedMentorships.includes(mentor.id) ? 'bg-brand-500 border-brand-500' : 'border-gray-300 bg-white dark:bg-gray-800 dark:border-gray-600'}`}>
                      {formData.linkedMentorships.includes(mentor.id) && <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>}
                   </div>
                   <div>
                      <h5 className="text-sm font-medium text-gray-900 dark:text-white">{mentor.name} <span className="text-gray-500 font-normal">- {mentor.expertise}</span></h5>
                      <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1 text-xs text-gray-500 dark:text-gray-400">
                         <span>{mentor.duration}</span>
                         <span className="text-purple-600 dark:text-purple-400">Goal: {mentor.goal}</span>
                      </div>
                   </div>
                </div>
              ))}
            </div>
          </div>

          {/* Application Deadline */}
          <div>
            <Label htmlFor="deadline">Application Deadline</Label>
            <Input
              type="date"
              id="deadline"
              name="deadline"
              value={formData.deadline}
              onChange={handleInputChange}
              error={!!errors.deadline}
              hint={errors.deadline}
            />
          </div>
        </div>
      )}

      {/* Navigation Buttons */}
      <div className="flex items-center justify-between pt-6 border-t border-gray-200 dark:border-gray-700">
        <Button type="button" variant="outline" onClick={step === 1 ? onCancel : () => setStep(step - 1)} disabled={isSubmitting}>
          {step === 1 ? "Cancel" : "Back"}
        </Button>
        
        <Button type="submit" variant="primary" disabled={isSubmitting}>
          {isSubmitting ? "Publishing..." : (step === 5 ? "Publish Internship" : "Next Step")}
        </Button>
      </div>
    </form>
  );
}
