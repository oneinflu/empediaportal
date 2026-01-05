import  { useState, useEffect } from "react";
import PageMeta from "../components/common/PageMeta";
import Breadcrumb from "../components/common/PageBreadCrumb";
import { useNavigate, useParams } from "react-router";
import AddCompanyForm from "../components/companies/AddCompanyForm";
import { companyService, Company } from "../services/companyService";

export default function AddCompany() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);
  const [initialData, setInitialData] = useState<Company | undefined>(undefined);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isEdit && id) {
      setLoading(true);
      companyService.getCompanyById(id)
        .then((data) => {
          setInitialData(data);
        })
        .catch((err) => {
          console.error("Failed to fetch company details:", err);
          navigate("/users/companies");
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [id, isEdit, navigate]);

  return (
    <>
      <PageMeta
        title={isEdit ? "Edit Company | Empedia Panel" : "Add New Company | Empedia Panel"}
        description={isEdit ? "Edit company details." : "Add a new company to the Empedia platform."}
      />
      <div className="mx-auto w-full max-w-[1080px]">
        <Breadcrumb pageTitle={isEdit ? "Edit Company" : "Add New Company"} />
        <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
          {loading ? (
             <div className="flex justify-center p-8">Loading...</div>
          ) : (
            <AddCompanyForm
              onCancel={() => navigate("/users/companies")}
              onSuccess={() => navigate("/users/companies")}
              isEdit={isEdit}
              initialData={initialData}
            />
          )}
        </div>
      </div>
    </>
  );
}
