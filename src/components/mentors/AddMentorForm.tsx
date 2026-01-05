import React, { useState, useEffect } from "react";
import Label from "../form/Label";
import Input from "../form/input/InputField";
import FileInput from "../form/input/FileInput";
import TextArea from "../form/input/TextArea";
import Button from "../ui/button/Button";
import Badge from "../ui/badge/Badge";

import MultiSelect from "../form/MultiSelect";
import Select from "../form/Select";
import Switch from "../form/switch/Switch";
import Radio from "../form/input/Radio";

import { mentorService } from "../../services/mentorService";

interface AddMentorFormProps {
  onCancel?: () => void;
  onSuccess?: () => void;
  mentorId?: string;
}

export default function AddMentorForm({ onCancel, onSuccess, mentorId }: AddMentorFormProps) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    // Step 1: Mentor Basics
    fullName: "",
    profilePhoto: null as File | null,
    coverImage: null as File | null,
    headline: "",
    yearsOfExperience: "",
    currentRole: "",
    company: "",
    linkedinUrl: "",
    bio: "",
    expertiseTags: [] as string[],
    // Step 2: Expertise & Domains
    primaryDomain: "",
    subSkills: [] as string[],
    // Step 3: Mentorship Offering Setup
    mentorshipTypes: [] as string[],
    mentorshipFormats: [] as string[],
    durationOptions: [] as string[],
    pricingType: "Free", // "Free" or "Paid"
    pricingAmount: "",
    revenueShare: false,
    // Step 4: Readiness Mapping
    minSkills: [] as string[],
    courseCompletion: "",
    internshipExperience: "",
    // Step 6: Availability
    weeklySlots: "",
    maxMentees: "",
    isPaused: false,
  });

  const isEditing = !!mentorId;

  useEffect(() => {
    const loadMentor = async () => {
      if (!isEditing || !mentorId) return;
      try {
        const m = await mentorService.getMentorById(mentorId);
        setFormData(prev => ({
          ...prev,
          fullName: m.fullName || "",
          headline: m.headline || "",
          yearsOfExperience: m.yearsOfExperience || "",
          currentRole: m.currentRole || "",
          company: m.company || "",
          linkedinUrl: m.linkedinUrl || "",
          bio: m.bio || "",
          expertiseTags: Array.isArray(m.expertiseTags) ? m.expertiseTags : [],
          primaryDomain: m.primaryDomain || "",
          subSkills: Array.isArray(m.subSkills) ? m.subSkills : [],
          mentorshipTypes: Array.isArray(m.mentorshipTypes) ? m.mentorshipTypes : [],
          mentorshipFormats: Array.isArray(m.mentorshipFormats) ? m.mentorshipFormats : [],
          durationOptions: Array.isArray(m.durationOptions) ? m.durationOptions : [],
          pricingType: m.pricingType || "Free",
          pricingAmount: m.pricingAmount ? String(m.pricingAmount) : "",
          revenueShare: !!m.revenueShare,
          minSkills: Array.isArray(m.minSkills) ? m.minSkills : [],
          courseCompletion: m.courseCompletion || "",
          internshipExperience: m.internshipExperience || "",
          weeklySlots: m.weeklySlots ? String(m.weeklySlots) : "",
          maxMentees: m.maxMentees ? String(m.maxMentees) : "",
          isPaused: !!m.isPaused,
          profilePhoto: null,
          coverImage: null,
        }));
      } catch (e) {
        console.error("Failed to load mentor", e);
      }
    };
    loadMentor();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mentorId]);

  // Constants for Step 2
  const primaryDomains = [
    { value: "Tech", label: "Technology", text: "Technology" },
    { value: "Finance", label: "Finance", text: "Finance" },
    { value: "Design", label: "Design", text: "Design" },
    { value: "Marketing", label: "Marketing", text: "Marketing" },
    { value: "Operations", label: "Operations", text: "Operations" },
  ];

  const subSkillsOptions = [
    { value: "Excel", text: "Excel" },
    { value: "SQL", text: "SQL" },
    { value: "Power BI", text: "Power BI" },
    { value: "Python", text: "Python" },
    { value: "Interview Prep", text: "Interview Prep" },
    { value: "Data Analysis", text: "Data Analysis" },
    { value: "Product Management", text: "Product Management" },
    { value: "Machine Learning", text: "Machine Learning" },
    { value: "UI/UX Design", text: "UI/UX Design" },
    { value: "Digital Marketing", text: "Digital Marketing" },
  ];

  // Constants for Step 3
  const mentorshipTypesOptions = [
    { value: "Career Guidance", text: "Career Guidance" },
    { value: "Job Preparation", text: "Job Preparation" },
    { value: "Internship Guidance", text: "Internship Guidance" },
    { value: "Skill Review", text: "Skill Review" },
    { value: "Portfolio Review", text: "Portfolio Review" },
  ];

  const formatOptions = [
    { value: "1:1", text: "1:1" },
    { value: "Group", text: "Group" },
    { value: "Chat-based", text: "Chat-based" },
    { value: "Live session", text: "Live session" },
  ];

  const durationOptionsList = [
    { value: "Single session", text: "Single session" },
    { value: "1 month", text: "1 month" },
    { value: "3 months", text: "3 months" },
  ];

  // Constants for Step 4
  const completionOptions = [
    { value: "Optional", label: "Optional", text: "Optional" },
    { value: "Recommended", label: "Recommended", text: "Recommended" },
    { value: "Mandatory", label: "Mandatory", text: "Mandatory" },
  ];

  const experienceOptions = [
    { value: "None", label: "None", text: "None" },
    { value: "0-6 months", label: "0-6 months", text: "0-6 months" },
    { value: "6-12 months", label: "6-12 months", text: "6-12 months" },
    { value: "1+ year", label: "1+ year", text: "1+ year" },
  ];

  // Auto-tagging logic
  useEffect(() => {
    const textToScan = `${formData.headline} ${formData.bio}`.toLowerCase();
    const newTags = new Set<string>();

    if (textToScan.includes("data analyst") || textToScan.includes("analytics")) {
      newTags.add("Data Analysis");
      newTags.add("SQL");
    }
    if (textToScan.includes("fintech") || textToScan.includes("finance")) {
      newTags.add("Finance");
      newTags.add("FinTech");
    }
    if (textToScan.includes("senior") || textToScan.includes("lead")) {
      newTags.add("Leadership");
      newTags.add("Mentoring");
    }
    if (textToScan.includes("python")) newTags.add("Python");
    if (textToScan.includes("excel")) newTags.add("Excel");
    if (textToScan.includes("product")) newTags.add("Product Management");
    if (textToScan.includes("marketing")) newTags.add("Marketing");

    setFormData((prev) => {
      // Only update if tags have changed to avoid infinite loop
      const currentTags = new Set(prev.expertiseTags);
      const tagsArray = Array.from(newTags);
      const isSame = tagsArray.length === currentTags.size && tagsArray.every((tag) => currentTags.has(tag));
      
      if (isSame) return prev;
      return { ...prev, expertiseTags: tagsArray };
    });
  }, [formData.headline, formData.bio]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleProfilePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData((prev) => ({ ...prev, profilePhoto: e.target.files![0] }));
    }
  };

  const handleCoverImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData((prev) => ({ ...prev, coverImage: e.target.files![0] }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (step < 6) {
      setStep(step + 1);
    } else {
      try {
        const data = new FormData();
        // Append all text fields
        Object.keys(formData).forEach(key => {
            const value = formData[key as keyof typeof formData];
            if (key === 'profilePhoto' || key === 'coverImage') return;
            if (Array.isArray(value)) {
                (value as unknown as string[]).forEach(v => data.append(key, v));
            } else {
                data.append(key, String(value));
            }
        });

        // Append files
        if (formData.profilePhoto) {
            data.append('profilePhoto', formData.profilePhoto);
        }
        if (formData.coverImage) {
            data.append('coverImage', formData.coverImage);
        }

        if (isEditing && mentorId) {
          await mentorService.updateMentor(mentorId, data);
        } else {
          await mentorService.createMentor(data);
        }
        if (onSuccess) onSuccess();
      } catch (error) {
        console.error("Failed to create mentor", error);
        alert("Failed to create mentor. Please try again.");
      }
    }
  };

  const handleDomainChange = (value: string) => {
    setFormData((prev) => ({ ...prev, primaryDomain: value }));
  };

  const handleSubSkillsChange = (selected: string[]) => {
    if (selected.length <= 7) {
      setFormData((prev) => ({ ...prev, subSkills: selected }));
    }
  };

  const handleMultiSelectChange = (field: "mentorshipTypes" | "mentorshipFormats" | "durationOptions", selected: string[]) => {
    setFormData((prev) => ({ ...prev, [field]: selected }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Progress Indicator */}
      <div className="flex items-center justify-between mb-6 overflow-x-auto pb-2 no-scrollbar">
        {["Basics", "Expertise", "Offering", "Readiness", "Availability", "Review"].map((label, index) => (
          <div key={index} className="flex items-center">
            <div className={`flex flex-col items-center gap-1 min-w-[60px] cursor-pointer`} onClick={() => step > index + 1 && setStep(index + 1)}>
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
                  step >= index + 1 ? "bg-brand-500 text-white" : "bg-gray-100 text-gray-500 dark:bg-gray-800"
                }`}
              >
                {index + 1}
              </div>
              <span className={`text-[10px] font-medium ${step === index + 1 ? "text-brand-500" : "text-gray-500"}`}>{label}</span>
            </div>
            {index < 5 && <div className={`h-px w-4 sm:w-8 mx-1 transition-colors ${step > index + 1 ? "bg-brand-500" : "bg-gray-200 dark:bg-gray-700"}`}></div>}
          </div>
        ))}
      </div>

      {step === 1 && (
        <div className="space-y-6 animate-fadeIn">
          {/* Header Note */}
          <div className="bg-blue-50 dark:bg-blue-900/10 p-4 rounded-xl border border-blue-100 dark:border-blue-800">
            <h4 className="text-sm font-semibold text-blue-800 dark:text-blue-200 mb-1">Mentor Basics (Trust First)</h4>
            <p className="text-xs text-blue-600 dark:text-blue-300">
              Establish credibility quickly. These details will be visible on the mentor's public profile.
            </p>
          </div>

          {/* Full Name & Profile Photo */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="fullName">Full Name</Label>
              <Input
                type="text"
                id="fullName"
                name="fullName"
                placeholder="e.g. Sarah Jenkins"
                value={formData.fullName}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <Label htmlFor="profilePhoto">Profile Photo</Label>
              <FileInput
                onChange={handleProfilePhotoChange}
                className="pt-2" // Adjust alignment if needed
              />
            </div>
          </div>

          {/* Cover Image */}
          <div>
              <Label htmlFor="coverImage">Cover Image</Label>
              <FileInput
                onChange={handleCoverImageChange}
                className="pt-2"
              />
          </div>

          {/* Headline */}
          <div>
            <Label htmlFor="headline">Headline (1 line)</Label>
            <Input
              type="text"
              id="headline"
              name="headline"
              placeholder="e.g. Senior Data Analyst @ FinTech Startup"
              value={formData.headline}
              onChange={handleInputChange}
            />
          </div>

          {/* Role & Company & Experience */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <Label htmlFor="currentRole">Current Role</Label>
              <Input
                type="text"
                id="currentRole"
                name="currentRole"
                placeholder="e.g. Senior Data Analyst"
                value={formData.currentRole}
                onChange={handleInputChange}
              />
            </div>
             <div>
              <Label htmlFor="company">Company</Label>
              <Input
                type="text"
                id="company"
                name="company"
                placeholder="e.g. FinTech Startup"
                value={formData.company}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <Label htmlFor="yearsOfExperience">Years of Experience</Label>
              <Input
                type="number"
                id="yearsOfExperience"
                name="yearsOfExperience"
                placeholder="e.g. 5"
                value={formData.yearsOfExperience}
                onChange={handleInputChange}
              />
            </div>
          </div>

          {/* LinkedIn URL */}
          <div>
            <Label htmlFor="linkedinUrl">LinkedIn URL (Mandatory)</Label>
            <Input
              type="url"
              id="linkedinUrl"
              name="linkedinUrl"
              placeholder="https://linkedin.com/in/..."
              value={formData.linkedinUrl}
              onChange={handleInputChange}
            />
          </div>

          {/* Short Bio */}
          <div>
            <Label htmlFor="bio">Short Bio (3–4 lines)</Label>
            <TextArea
              placeholder="Tell us about your journey and expertise..."
              rows={4}
              value={formData.bio}
              onChange={(value) => setFormData((prev) => ({ ...prev, bio: value }))}
            />
          </div>

          {/* Auto-tagged Expertise */}
          <div>
            <Label>Auto-detected Expertise</Label>
            <div className="mt-3 p-4 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-white/[0.03]">
              {formData.expertiseTags.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {formData.expertiseTags.map((tag) => (
                    <Badge key={tag} color="success" size="sm" variant="light">
                      {tag}
                    </Badge>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Start typing in Headline or Bio to see auto-detected tags...
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-6 animate-fadeIn">
          {/* Header Note */}
          <div className="bg-blue-50 dark:bg-blue-900/10 p-4 rounded-xl border border-blue-100 dark:border-blue-800">
            <h4 className="text-sm font-semibold text-blue-800 dark:text-blue-200 mb-1">Expertise & Domains</h4>
            <p className="text-xs text-blue-600 dark:text-blue-300">
              Match mentors to the right learners and opportunities. These skills power all recommendations later.
            </p>
          </div>

          {/* Primary Domain */}
          <div>
            <Label>Primary Domain</Label>
            <Select
              options={primaryDomains}
              placeholder="Select Primary Domain"
              onChange={handleDomainChange}
              className="w-full"
            />
          </div>

          {/* Sub-skills */}
          <div>
            <MultiSelect
              label="Sub-skills (Max 5–7)"
              options={subSkillsOptions}
              defaultSelected={formData.subSkills}
              onChange={handleSubSkillsChange}
            />
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              Select key skills like Excel, SQL, Power BI, Interview Prep, etc.
            </p>
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="space-y-6 animate-fadeIn">
          {/* Header Note */}
          <div className="bg-blue-50 dark:bg-blue-900/10 p-4 rounded-xl border border-blue-100 dark:border-blue-800">
            <h4 className="text-sm font-semibold text-blue-800 dark:text-blue-200 mb-1">Mentorship Offering Setup</h4>
            <p className="text-xs text-blue-600 dark:text-blue-300">
              Define how the mentor helps. This will be visible to learners when booking a session.
            </p>
          </div>

          {/* Mentorship Type */}
          <div>
            <MultiSelect
              label="Mentorship Type"
              options={mentorshipTypesOptions}
              defaultSelected={formData.mentorshipTypes}
              onChange={(selected) => handleMultiSelectChange("mentorshipTypes", selected)}
            />
          </div>

          {/* Format & Duration */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <MultiSelect
                label="Format"
                options={formatOptions}
                defaultSelected={formData.mentorshipFormats}
                onChange={(selected) => handleMultiSelectChange("mentorshipFormats", selected)}
              />
            </div>
            <div>
              <MultiSelect
                label="Duration Options"
                options={durationOptionsList}
                defaultSelected={formData.durationOptions}
                onChange={(selected) => handleMultiSelectChange("durationOptions", selected)}
              />
            </div>
          </div>

          {/* Pricing */}
          <div className="p-4 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-white/[0.03] space-y-4">
            <h4 className="text-sm font-medium text-gray-800 dark:text-white/90">Pricing Model</h4>
            
            <div className="flex gap-6">
              <Radio
                id="price-free"
                name="pricingType"
                value="Free"
                label="Free"
                checked={formData.pricingType === "Free"}
                onChange={(val) => setFormData((prev) => ({ ...prev, pricingType: val }))}
              />
              <Radio
                id="price-paid"
                name="pricingType"
                value="Paid"
                label="Paid (₹)"
                checked={formData.pricingType === "Paid"}
                onChange={(val) => setFormData((prev) => ({ ...prev, pricingType: val }))}
              />
            </div>

            {formData.pricingType === "Paid" && (
              <div className="space-y-4 animate-fadeIn">
                <div>
                  <Label htmlFor="pricingAmount">Amount (₹)</Label>
                  <Input
                    type="number"
                    id="pricingAmount"
                    name="pricingAmount"
                    placeholder="e.g. 500"
                    value={formData.pricingAmount}
                    onChange={handleInputChange}
                  />
                </div>
                
                <div>
                  <Switch
                    label="Revenue share toggle (Empedia cut)"
                    defaultChecked={formData.revenueShare}
                    onChange={(checked) => setFormData((prev) => ({ ...prev, revenueShare: checked }))}
                  />
                  <p className="mt-1 text-xs text-gray-500 dark:text-gray-400 ml-14">
                    Enable if Empedia takes a commission from each session.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}



      {step === 4 && (
        <div className="space-y-6 animate-fadeIn">
          <div className="bg-orange-50 dark:bg-orange-900/10 p-4 rounded-xl border border-orange-100 dark:border-orange-800">
            <h4 className="text-sm font-semibold text-orange-800 dark:text-orange-200 mb-1">Readiness Mapping (Optional but 🔥)</h4>
            <p className="text-xs text-orange-600 dark:text-orange-300">
              Define prerequisites to help students gauge their readiness.
            </p>
          </div>

          <div>
            <MultiSelect
              label="Minimum Skill Checklist"
              options={subSkillsOptions}
              defaultSelected={formData.minSkills}
              onChange={(selected) => setFormData((prev) => ({ ...prev, minSkills: selected }))}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label>Course Completion Requirement</Label>
              <Select
                options={completionOptions}
                onChange={(val) => setFormData((prev) => ({ ...prev, courseCompletion: val }))}
                placeholder="Select requirement"
                className="w-full"
              />
            </div>
            <div>
              <Label>Internship Experience Needed</Label>
              <Select
                options={experienceOptions}
                onChange={(val) => setFormData((prev) => ({ ...prev, internshipExperience: val }))}
                placeholder="Select experience level"
                className="w-full"
              />
            </div>
          </div>
        </div>
      )}

      {step === 5 && (
        <div className="space-y-6 animate-fadeIn">
          <div className="bg-green-50 dark:bg-green-900/10 p-4 rounded-xl border border-green-100 dark:border-green-800">
            <h4 className="text-sm font-semibold text-green-800 dark:text-green-200 mb-1">Availability & Limits</h4>
            <p className="text-xs text-green-600 dark:text-green-300">
              Set boundaries to prevent burnout.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="weeklySlots">Weekly Availability Slots</Label>
              <Input
                id="weeklySlots"
                name="weeklySlots"
                type="number"
                placeholder="e.g. 5"
                value={formData.weeklySlots}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <Label htmlFor="maxMentees">Max Mentees at a time</Label>
              <Input
                id="maxMentees"
                name="maxMentees"
                type="number"
                placeholder="e.g. 10"
                value={formData.maxMentees}
                onChange={handleInputChange}
              />
            </div>
          </div>

          <div>
            <Switch
              label="Pause Mentoring (Temporarily Unavailable)"
              defaultChecked={formData.isPaused}
              onChange={(checked) => setFormData((prev) => ({ ...prev, isPaused: checked }))}
            />
          </div>
        </div>
      )}

      {step === 6 && (
        <div className="space-y-6 animate-fadeIn">
          <div className="bg-gray-50 dark:bg-white/[0.03] p-6 rounded-xl border border-gray-200 dark:border-gray-700 text-center">
            <div className="w-20 h-20 bg-gray-200 rounded-full mx-auto mb-4 overflow-hidden">
              {formData.profilePhoto ? (
                <img src={URL.createObjectURL(formData.profilePhoto)} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <div className="flex items-center justify-center h-full text-2xl text-gray-400">?</div>
              )}
            </div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">{formData.fullName || "Mentor Name"}</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">{formData.headline || "Headline"}</p>

            <div className="mt-6 flex flex-wrap justify-center gap-2">
              {formData.expertiseTags.map((tag) => (
                <Badge key={tag} color="success">{tag}</Badge>
              ))}
            </div>
          </div>



          <div className="text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Ready to publish this mentor profile?
            </p>
          </div>
        </div>
      )}

      {/* Navigation Buttons */}
      <div className="flex items-center justify-between pt-6 border-t border-gray-200 dark:border-gray-700">
        <Button type="button" variant="outline" onClick={step === 1 ? onCancel : () => setStep(step - 1)}>
          {step === 1 ? "Cancel" : "Back"}
        </Button>
        
        <Button type="submit" variant="primary">
          {step === 6 ? "Publish Mentor Profile" : "Next Step"}
        </Button>
      </div>

      {/* Debug: Live JSON Payload Preview */}
      <div className="mt-8 border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden">
        <div className="bg-gray-100 dark:bg-gray-800 px-4 py-2 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
          <span className="text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
            Live Data Payload (Step {step}/6)
          </span>
          <span className="text-[10px] text-gray-500 bg-gray-200 dark:bg-gray-700 px-2 py-0.5 rounded-full">
            Debug View
          </span>
        </div>
        <div className="bg-gray-900 p-4 overflow-x-auto max-h-96 custom-scrollbar">
          <pre className="text-xs font-mono text-green-400 whitespace-pre-wrap">
            {JSON.stringify(
              {
                ...formData,
                profilePhoto: formData.profilePhoto 
                  ? `[File Object] Name: ${formData.profilePhoto.name}, Size: ${(formData.profilePhoto.size / 1024).toFixed(2)} KB`
                  : null
              }, 
              null, 
              2
            )}
          </pre>
        </div>
      </div>
    </form>
  );
}
