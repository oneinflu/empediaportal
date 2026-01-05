/* eslint-disable @typescript-eslint/no-explicit-any */
import  { useEffect, useState } from "react";
import Badge from "../ui/badge/Badge";
import { Link } from "react-router";
import { BoxIcon, CalenderIcon, GroupIcon, DocsIcon, UserIcon } from "../../icons";
import { dashboardService } from "../../services/dashboardService";

// Define types for the API response
type MetricBadge = {
  text: string;
  color: string;
};

type MetricTrend = {
  value: number;
  direction: "up" | "down";
};

type Metric = {
  id: string;
  title: string;
  value: number;
  icon: string;
  link?: string;
  suffix?: string;
  badge?: MetricBadge;
  trend?: MetricTrend;
  isClickable: boolean;
};

const DashboardMetrics = () => {
  const [metricsData, setMetricsData] = useState<Metric[]>([]);
  
  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const response = await dashboardService.getMetrics();
        const data = response.data;
        
        const metrics: Metric[] = [
          {
            id: "active_positions",
            title: "Active Jobs",
            value: data.activeJobs || 0,
            icon: "box",
            link: "/jobs",
            isClickable: true
          },
          {
            id: "open_internships",
            title: "Active Internships",
            value: data.activeInternships || 0,
            icon: "calendar",
            link: "/internships",
            isClickable: true
          },
          {
            id: "total_applications",
            title: "Applications",
            value: data.totalApplications || 0,
            icon: "group",
            link: "/applications",
            isClickable: true
          },
          {
            id: "course_enrollments",
            title: "Enrollments",
            value: data.courseEnrollments || 0,
            icon: "docs",
            link: "/enrollments",
            isClickable: true
          },
          {
            id: "total_mentors",
            title: "Mentors",
            value: data.totalMentors || 0,
            icon: "group",
            link: "/mentors",
            isClickable: true
          },
          {
            id: "total_users",
            title: "Users",
            value: data.totalUsers || 0,
            icon: "user",
            link: "/users/system-users",
            isClickable: true
          },
          {
            id: "total_companies",
            title: "Companies",
            value: data.totalCompanies || 0,
            icon: "box",
            link: "/companies",
            isClickable: true
          }
        ];
        
        setMetricsData(metrics);
      } catch (error) {
        console.error("Failed to fetch dashboard metrics", error);
        // Fallback or empty state could be handled here
      }
    };

    fetchMetrics();
  }, []);

  // Function to render the appropriate icon based on the icon name
  const renderIcon = (iconName: string) => {
    switch (iconName) {
      case "box":
        return <BoxIcon className="text-gray-800 size-5 dark:text-white/90" />;
      case "calendar":
        return <CalenderIcon className="text-gray-800 size-5 dark:text-white/90" />;
      case "group":
        return <GroupIcon className="text-gray-800 size-5 dark:text-white/90" />;
      case "docs":
        return <DocsIcon className="text-gray-800 size-5 dark:text-white/90" />;
      case "user":
        return <UserIcon className="text-gray-800 size-5 dark:text-white/90" />;
      default:
        return <BoxIcon className="text-gray-800 size-5 dark:text-white/90" />;
    }
  };

  // Function to render trend indicator
  const renderTrend = (trend?: MetricTrend) => {
    if (!trend) return null;
    
    return (
      <span className={`text-xs font-medium ml-1 ${trend.direction === 'up' ? 'text-success-500' : 'text-error-500'}`}>
        {trend.direction === 'up' ? '+' : '-'}{trend.value}%
      </span>
    );
  };

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 md:gap-6">
      {metricsData.map((metric) => (
        renderMetricCard(metric)
      ))}
    </div>
  );

  // Function to render a metric card
  function renderMetricCard(metric: Metric) {
    const cardContent = (
      <>
        <div className="flex items-center justify-center w-10 h-10 bg-gray-100 rounded-xl dark:bg-gray-800">
          {renderIcon(metric.icon)}
        </div>

        <div className="mt-3">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {metric.title}
            </span>
            {metric.badge && (
              <Badge color={metric.badge.color as any} size="sm">{metric.badge.text}</Badge>
            )}
          </div>
          <h4 className="mt-1 font-bold text-gray-800 text-title-sm dark:text-white/90">
            {metric.value.toLocaleString()}
            {metric.suffix && (
              <span className="text-xs text-gray-500 font-normal ml-1">{metric.suffix}</span>
            )}
            {renderTrend(metric.trend)}
          </h4>
        </div>
      </>
    );

    const cardClasses = "rounded-2xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-white/[0.03] hover:shadow-sm transition-shadow";

    return metric.isClickable && metric.link ? (
      <Link key={metric.id} to={metric.link} className={cardClasses}>
        {cardContent}
      </Link>
    ) : (
      <div key={metric.id} className={cardClasses}>
        {cardContent}
      </div>
    );
  }
};

export default DashboardMetrics;
