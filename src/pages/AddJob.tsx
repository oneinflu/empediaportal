import PageMeta from "../components/common/PageMeta";
import AddJobForm from "../components/jobs/AddJobForm";
import Breadcrumb from "../components/common/PageBreadCrumb";
import { useNavigate } from "react-router";
import { useParams } from "react-router-dom";

export default function AddJob() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = !!id;

  return (
    <>
      <PageMeta
        title={isEditing ? "Edit Job | Empedia Panel" : "Add New Job | Empedia Panel"}
        description={isEditing ? "Edit a job position on the Empedia platform." : "Add a new job position to the Empedia platform."}
      />
      <div className="mx-auto w-full max-w-[1080px]">
        <Breadcrumb pageTitle={isEditing ? "Edit Job" : "Add New Job"} />

        <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
          <AddJobForm
            onCancel={() => navigate("/jobs")}
            onSuccess={() => {
              console.log("Job added!");
              navigate("/jobs");
            }}
            jobId={id}
          />
        </div>
      </div>
    </>
  );
}
