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
import { jobService } from "../../services/jobService";
import { companyService, Company } from "../../services/companyService";

interface AddJobFormProps {
  onCancel?: () => void;
  onSuccess?: () => void;
  jobId?: string;
}

export default function AddJobForm({ onCancel, onSuccess, jobId }: AddJobFormProps) {
  const [step, setStep] = useState(1);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [coverImage, setCoverImage] = useState<File | null>(null);
  const [formData, setFormData] = useState({
    // Step 1: Job Basics
    title: "",
    company: "",
    jobType: "",
    workMode: "",
    location: "",
    experienceLevel: [] as string[],
    // Step 2: Job Overview
    shortSummary: "",
    roleRationale: "",
    companyProblem: "",
    roleImpact: "",
    // Step 3: Skills & Requirements
    requiredSkills: [] as string[],
    niceToHaveSkills: [] as string[],
    education: "",
    // Step 4: Responsibilities & Perks
    responsibilities: "",
    salaryMin: "",
    salaryMax: "",
    conversionPossible: "No",
    perks: [] as string[],
    // Step 5: Smart Linking
    minCourseCompletion: "",
    internshipExperienceRequired: "No",
    recommendedCourses: [] as string[],
    linkedInternships: [] as string[],
    linkedMentorships: [] as string[],
    deadline: "",
  });

  const isEditing = !!jobId;

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
    const loadJob = async () => {
      if (!isEditing || !jobId) return;
      try {
        const j = await jobService.getJobById(jobId);
        const companyId = typeof j.company === 'object' ? j.company?._id || "" : String(j.company || "");
        setFormData(prev => ({
          ...prev,
          title: j.title || "",
          company: companyId,
          jobType: j.jobType || "",
          workMode: j.workMode || "",
          location: j.location || "",
          experienceLevel: Array.isArray(j.experienceLevel) ? j.experienceLevel : [],
          shortSummary: j.shortSummary || "",
          roleRationale: j.roleRationale || "",
          companyProblem: j.companyProblem || "",
          roleImpact: j.roleImpact || "",
          requiredSkills: Array.isArray(j.requiredSkills) ? j.requiredSkills : [],
          niceToHaveSkills: Array.isArray(j.niceToHaveSkills) ? j.niceToHaveSkills : [],
          education: j.education || "",
          responsibilities: j.responsibilities || "",
          salaryMin: j.salaryMin || "",
          salaryMax: j.salaryMax || "",
          conversionPossible: j.conversionPossible || "No",
          perks: Array.isArray(j.perks) ? j.perks : [],
          minCourseCompletion: j.minCourseCompletion || "",
          internshipExperienceRequired: j.internshipExperienceRequired || "No",
          recommendedCourses: [],
          linkedInternships: [],
          linkedMentorships: [],
          deadline: j.deadline || "",
        }));
      } catch (e) {
        console.error("Failed to load job", e);
      }
    };
    loadJob();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [jobId]);

  const jobTypeOptions = [
    "Full-time",
    "Part-time",
    "Contract",
    "Fresher"
  ];

  const workModeOptions = [
    "Remote",
    "Hybrid",
    "Onsite"
  ];

  const experienceOptions = [
    "Fresher",
    "0–1 year",
    "1–3 years",
    "3–5 years",
    "5+ years"
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
    { value: "JavaScript", text: "JavaScript" },
    { value: "React", text: "React" },
    { value: "Node.js", text: "Node.js" },
  ];

  const perkOptions = [
    "Learning budget",
    "Certificate",
    "PPO opportunity",
    "Flexible hours",
    "Health insurance"
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleTextAreaChange = (name: string) => (value: string) => {
      setFormData((prev) => ({ ...prev, [name]: value }));
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

  const handleCompanyChange = (value: string) => {
    setFormData((prev) => ({ ...prev, company: value }));
  };

  const handleSkillsChange = (selected: string[]) => {
      setFormData(prev => ({ ...prev, requiredSkills: selected }));
  };

  const handleNiceToHaveSkillsChange = (selected: string[]) => {
      setFormData(prev => ({ ...prev, niceToHaveSkills: selected }));
  };

  const handleCoverImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files[0]) {
          setCoverImage(e.target.files[0]);
      }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (step < 5) {
      setStep(step + 1);
    } else {
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

        if (isEditing && jobId) {
          await jobService.updateJob(jobId, data);
        } else {
          await jobService.createJob(data);
        }
        if (onSuccess) onSuccess();
      } catch (error) {
        console.error("Failed to create job", error);
        alert("Failed to create job. Please try again.");
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Progress Indicator */}
      <div className="flex items-center justify-between mb-6">
        {[1, 2, 3, 4, 5].map((s) => (
            <div key={s} className="flex items-center gap-2">
                 <span className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium ${step >= s ? "bg-brand-500 text-white" : "bg-gray-100 text-gray-500 dark:bg-gray-800"}`}>{s}</span>
            </div>
        ))}
      </div>

      {step === 1 && (
        <div className="space-y-6 animate-fadeIn">
          {/* Job Title */}
          <div>
            <Label htmlFor="title">Job Title (Mandatory)</Label>
            <Input
              type="text"
              id="title"
              name="title"
              placeholder="e.g. Junior Data Analyst"
              value={formData.title}
              onChange={handleInputChange}
            />
          </div>

          {/* Company Name */}
          <div>
            <Label htmlFor="company">Company</Label>
            <Select
                options={companies.map(c => ({ value: c._id || "", label: c.company_name }))}
                onChange={handleCompanyChange}
                placeholder="Select Company"
                defaultValue={formData.company}
            />
          </div>

          {/* Cover Image */}
          <div>
              <Label>Cover Image</Label>
              <FileInput onChange={handleCoverImageChange} />
          </div>

          {/* Job Type */}
          <div>
            <Label>Job Type</Label>
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
          </div>
        </div>
      )}

      {/* Step 2: Job Overview */}
      {step === 2 && (
        <div className="space-y-6 animate-fadeIn">
             <div>
                 <Label htmlFor="shortSummary">Short Summary</Label>
                 <TextArea value={formData.shortSummary} onChange={handleTextAreaChange("shortSummary")} rows={3} />
             </div>
             <div>
                 <Label htmlFor="roleRationale">Role Rationale</Label>
                 <TextArea value={formData.roleRationale} onChange={handleTextAreaChange("roleRationale")} rows={3} />
             </div>
             <div>
                 <Label htmlFor="companyProblem">Company Problem</Label>
                 <TextArea value={formData.companyProblem} onChange={handleTextAreaChange("companyProblem")} rows={3} />
             </div>
             <div>
                 <Label htmlFor="roleImpact">Role Impact</Label>
                 <TextArea value={formData.roleImpact} onChange={handleTextAreaChange("roleImpact")} rows={3} />
             </div>
        </div>
      )}

      {/* Step 3: Skills */}
      {step === 3 && (
          <div className="space-y-6 animate-fadeIn">
              <div>
                  <MultiSelect label="Required Skills" options={skillOptions} defaultSelected={formData.requiredSkills} onChange={handleSkillsChange} />
              </div>
              <div>
                  <MultiSelect label="Nice to Have Skills" options={skillOptions} defaultSelected={formData.niceToHaveSkills} onChange={handleNiceToHaveSkillsChange} />
              </div>
              <div>
                  <Label htmlFor="education">Education</Label>
                  <Input id="education" name="education" value={formData.education} onChange={handleInputChange} />
              </div>
          </div>
      )}

      {/* Step 4: Details */}
      {step === 4 && (
          <div className="space-y-6 animate-fadeIn">
              <div>
                  <Label htmlFor="responsibilities">Responsibilities</Label>
                  <TextArea value={formData.responsibilities} onChange={handleTextAreaChange("responsibilities")} rows={4} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                  <div>
                      <Label htmlFor="salaryMin">Min Salary</Label>
                      <Input id="salaryMin" name="salaryMin" value={formData.salaryMin} onChange={handleInputChange} />
                  </div>
                  <div>
                      <Label htmlFor="salaryMax">Max Salary</Label>
                      <Input id="salaryMax" name="salaryMax" value={formData.salaryMax} onChange={handleInputChange} />
                  </div>
              </div>
              <div>
                <Label>Perks</Label>
                <div className="mt-3 space-y-3">
                    {perkOptions.map(perk => (
                        <Checkbox key={perk} id={perk} label={perk} checked={formData.perks.includes(perk)} onChange={(checked) => handlePerkChange(perk, checked)} />
                    ))}
                </div>
              </div>
          </div>
      )}

      {/* Step 5: Linking */}
      {step === 5 && (
          <div className="space-y-6 animate-fadeIn">
              <div>
                  <Label htmlFor="minCourseCompletion">Min Course Completion</Label>
                  <Input id="minCourseCompletion" name="minCourseCompletion" value={formData.minCourseCompletion} onChange={handleInputChange} />
              </div>
              {/* Add more linking fields as needed */}
          </div>
      )}

      <div className="flex items-center justify-end gap-3 mt-6">
        {onCancel && (
          <Button size="sm" variant="outline" onClick={onCancel} type="button">
            Cancel
          </Button>
        )}
        {step > 1 && (
            <Button size="sm" variant="outline" onClick={() => setStep(step - 1)} type="button">
                Back
            </Button>
        )}
        <Button size="sm" type="submit">
          {step === 5 ? "Create Job" : "Next Step"}
        </Button>
      </div>
    </form>
  );
}
