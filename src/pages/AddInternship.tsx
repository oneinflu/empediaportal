import PageMeta from "../components/common/PageMeta";
import AddInternshipForm from "../components/internships/AddInternshipForm";
import Breadcrumb from "../components/common/PageBreadCrumb";
import { useNavigate } from "react-router";
import { useParams } from "react-router-dom";

export default function AddInternship() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = !!id;

  return (
    <>
      <PageMeta
        title={isEditing ? "Edit Internship | Empedia Panel" : "Add New Internship | Empedia Panel"}
        description={isEditing ? "Edit an internship position on the Empedia platform." : "Add a new internship position to the Empedia platform."}
      />
      <div className="mx-auto w-full max-w-[1080px]">
        <Breadcrumb pageTitle={isEditing ? "Edit Internship" : "Add New Internship"} />

        <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
          <AddInternshipForm
            onCancel={() => navigate("/internships")}
            onSuccess={() => {
              console.log("Internship added!");
              navigate("/internships");
            }}
            internshipId={id}
          />
        </div>
      </div>
    </>
  );
}
