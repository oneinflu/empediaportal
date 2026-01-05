import PageMeta from "../components/common/PageMeta";
import AddCourseForm from "../components/courses/AddCourseForm";
import Breadcrumb from "../components/common/PageBreadCrumb";
import { useNavigate } from "react-router";
import { useParams } from "react-router-dom";

export default function AddCourse() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = !!id;

  return (
    <>
      <PageMeta
        title={isEditing ? "Edit Course | Empedia Panel" : "Add New Course | Empedia Panel"}
        description={isEditing ? "Edit a course in the Empedia catalog." : "Add a new course to the Empedia catalog."}
      />
      <div className="mx-auto w-full max-w-[1080px]">
        <Breadcrumb pageTitle={isEditing ? "Edit Course" : "Add New Course"} />

        <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
          <AddCourseForm
            onCancel={() => navigate("/courses")}
            onSuccess={() => {
              console.log("Course added!");
              navigate("/courses");
            }}
            courseId={id}
          />
        </div>
      </div>
    </>
  );
}
