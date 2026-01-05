
import PageBreadcrumb from "../components/common/PageBreadCrumb";
import PageMeta from "../components/common/PageMeta";
import AddMentorForm from "../components/mentors/AddMentorForm";
import { useNavigate, useParams } from "react-router-dom";

export default function AddMentor() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = !!id;

  return (
    <>
      <PageMeta
        title={isEditing ? "Edit Mentor | Empedia Admin" : "Add New Mentor | Empedia Admin"}
        description={isEditing ? "Edit mentor details on the Empedia platform." : "Add a new mentor to the Empedia platform."}
      />
      <PageBreadcrumb pageTitle={isEditing ? "Edit Mentor" : "Add New Mentor"} />

      <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
        <div className="max-w-3xl mx-auto">
          <AddMentorForm 
            onCancel={() => navigate("/mentors")} 
            onSuccess={() => navigate("/mentors")}
            mentorId={id}
          />
        </div>
      </div>
    </>
  );
}
