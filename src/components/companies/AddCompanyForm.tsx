import React, { useState } from "react";
import Label from "../form/Label";
import Input from "../form/input/InputField";
import FileInput from "../form/input/FileInput";
import Checkbox from "../form/input/Checkbox";
import Button from "../ui/button/Button";
import { companyService, Company } from "../../services/companyService";

interface AddCompanyFormProps {
  onCancel?: () => void;
  onSuccess?: () => void;
  initialData?: Company;
  isEdit?: boolean;
}

export default function AddCompanyForm({ onCancel, onSuccess, initialData, isEdit = false }: AddCompanyFormProps) {
  const [formData, setFormData] = useState({
    company_name: "",
    industry: "",
    website: "",
    verified: false,
  });
  
  React.useEffect(() => {
    if (initialData) {
      setFormData({
        company_name: initialData.company_name || "",
        industry: initialData.industry || "",
        website: initialData.website || "",
        verified: initialData.verified || false,
      });
    }
  }, [initialData]);

  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleVerifiedChange = (checked: boolean) => {
    setFormData((prev) => ({ ...prev, verified: checked }));
  };

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setLogoFile(e.target.files[0]);
    }
  };

  const handleCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setCoverFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return;
    setSubmitting(true);
    try {
      const data = new FormData();
      data.append("company_name", formData.company_name);
      if (formData.industry) data.append("industry", formData.industry);
      if (formData.website) data.append("website", formData.website);
      data.append("verified", String(formData.verified));
      if (logoFile) data.append("logo", logoFile);
      if (coverFile) data.append("coverImage", coverFile);
      
      if (isEdit && initialData?._id) {
        await companyService.updateCompany(initialData._id, data);
      } else {
        await companyService.createCompany(data);
      }

      if (onSuccess) onSuccess();
    } catch (error) {
      alert(isEdit ? "Failed to update company" : "Failed to create company");
      console.error(error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-6">
        <div>
          <Label htmlFor="company_name">Company Name</Label>
          <Input
            type="text"
            id="company_name"
            name="company_name"
            placeholder="e.g. Empedia Inc."
            value={formData.company_name}
            onChange={handleInputChange}
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Label htmlFor="industry">Industry</Label>
            <Input
              type="text"
              id="industry"
              name="industry"
              placeholder="e.g. Education, FinTech"
              value={formData.industry}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <Label htmlFor="website">Website</Label>
            <Input
              type="url"
              id="website"
              name="website"
              placeholder="https://example.com"
              value={formData.website}
              onChange={handleInputChange}
            />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Label>Logo</Label>
            <FileInput onChange={handleLogoChange} />
          </div>
          <div>
            <Label>Cover Image</Label>
            <FileInput onChange={handleCoverChange} />
          </div>
        </div>
        <div>
          <Checkbox
            checked={formData.verified}
            onChange={handleVerifiedChange}
            label="Verified"
          />
        </div>
      </div>
      <div className="flex items-center justify-end gap-3">
        <Button variant="outline" onClick={onCancel} type="button">
          Cancel
        </Button>
        <Button variant="primary" type="submit" disabled={submitting || !formData.company_name}>
          {submitting ? "Submitting..." : (isEdit ? "Update Company" : "Create Company")}
        </Button>
      </div>
    </form>
  );
}
