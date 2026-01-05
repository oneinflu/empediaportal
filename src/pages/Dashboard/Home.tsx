
import PageMeta from "../../components/common/PageMeta";
import DashboardMetrics from "../../components/dashboard/DashboardMetrics";


export default function Home() {
  return (
    <>
      <PageMeta
        title="Empedia Admin Dashboard"
        description="Admin dashboard for Empedia platform"
      />
      <div className="grid grid-cols-12 gap-4 md:gap-6">
        <div className="col-span-12">
          <DashboardMetrics />
        </div>

       
      </div>
    </>
  );
}
