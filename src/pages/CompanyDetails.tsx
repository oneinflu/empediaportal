import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import PageMeta from "../components/common/PageMeta";
import PageBreadcrumb from "../components/common/PageBreadCrumb";
import Badge from "../components/ui/badge/Badge";
import Button from "../components/ui/button/Button";
import { companyService, Company } from "../services/companyService";

export default function CompanyDetails() {
  const { id } = useParams();
  const [company, setCompany] = useState<Company | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCompany = async () => {
      if (!id) return;
      setLoading(true);
      try {
        const data = await companyService.getCompanyById(id);
        setCompany(data);
      } catch {
        setCompany(null);
      } finally {
        setLoading(false);
      }
    };
    fetchCompany();
  }, [id]);

  const handleDelete = async () => {
    if (!id) return;
    const confirm = window.confirm("Are you sure you want to delete this company?");
    if (!confirm) return;
    try {
      await companyService.deleteCompany(id);
      alert("Company deleted");
      navigate("/users/companies");
    } catch {
      alert("Failed to delete company");
    }
  };

  return (
    <>
      <PageMeta title="Company Details | Empedia Admin" description="View company details" />
      <PageBreadcrumb pageTitle="Company Details" />
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <Link to="/users/companies">
            <Button variant="outline">Back</Button>
          </Link>
          {company && (
            <Button variant="outline" onClick={handleDelete}>Delete</Button>
          )}
        </div>
        {loading ? (
          <div className="flex justify-center items-center p-8">
            <div className="animate-spin rounded-full border-4 border-gray-200 border-t-blue-600 w-8 h-8"></div>
          </div>
        ) : company ? (
          <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
            <div className="flex gap-6 items-center">
              {company.logo_url ? (
                <img
                  src={`https://empediaapis-w7dq6.ondigitalocean.app/${company.logo_url}`}
                  alt={company.company_name}
                  className="w-20 h-20 rounded-full object-cover"
                />
              ) : (
                <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 font-bold">
                  {company.company_name?.charAt(0)}
                </div>
              )}
              <div className="flex-1">
                <h1 className="text-2xl font-semibold text-gray-800 dark:text-white/90">{company.company_name}</h1>
                <div className="mt-2 flex flex-wrap gap-2">
                  {company.industry && <Badge size="sm" color="light">{company.industry}</Badge>}
                  <Badge size="sm" color={company.verified ? "success" : "dark"}>
                    {company.verified ? "Verified" : "Unverified"}
                  </Badge>
                </div>
                {company.website && (
                  <div className="mt-2 text-sm text-blue-600">
                    <a href={company.website} target="_blank" rel="noreferrer">{company.website}</a>
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
            <div className="text-center text-gray-600 dark:text-gray-400">Company not found</div>
          </div>
        )}
      </div>
    </>
  );
}
