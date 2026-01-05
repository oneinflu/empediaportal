import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SignIn from "./pages/AuthPages/SignIn";
import SignUp from "./pages/AuthPages/SignUp";
import NotFound from "./pages/OtherPage/NotFound";
import UserProfiles from "./pages/UserProfiles";
import Videos from "./pages/UiElements/Videos";
import Images from "./pages/UiElements/Images";
import Alerts from "./pages/UiElements/Alerts";
import Badges from "./pages/UiElements/Badges";
import Avatars from "./pages/UiElements/Avatars";
import Buttons from "./pages/UiElements/Buttons";
import LineChart from "./pages/Charts/LineChart";
import BarChart from "./pages/Charts/BarChart";
import Calendar from "./pages/Calendar";
import BasicTables from "./pages/Tables/BasicTables";
import FormElements from "./pages/Forms/FormElements";
import Blank from "./pages/Blank";
import AppLayout from "./layout/AppLayout";
import { ScrollToTop } from "./components/common/ScrollToTop";
import Home from "./pages/Dashboard/Home";
import Applications from "./pages/Applications";
import Enrollments from "./pages/Enrollments";

// Import the new pages
import Companies from "./pages/Users/Companies";
import JobSeekers from "./pages/Users/JobSeekers";
import Courses from "./pages/Courses";
import AddCourse from "./pages/AddCourse";
import Mentors from "./pages/Mentors";
import AddMentor from "./pages/AddMentor";
import Jobs from "./pages/Jobs";
import AddJob from "./pages/AddJob";
import Internships from "./pages/Internships";
import AddInternship from "./pages/AddInternship";
import Subscribers from "./pages/Subscribers";
import Roles from "./pages/Settings/Roles";
import Permissions from "./pages/Settings/Permissions";
import Categories from "./pages/Settings/Categories";
import SubscriptionPlans from "./pages/Settings/SubscriptionPlans";
import JobDetails from "./pages/JobDetails";
import ApplicantDetails from "./pages/ApplicantDetails";
import InternshipDetails from "./pages/InternshipDetails";
import CourseDetails from "./pages/CourseDetails";
import MentorDetails from "./pages/MentorDetails";
import CompanyDetails from "./pages/CompanyDetails";
import CompanyApplications from "./pages/CompanyApplications";
import JobSeekerDetails from "./pages/JobSeekerDetails";
import AddCompany from "./pages/AddCompany";
import MyBookings from "./pages/MyBookings";

import ProtectedRoute from "./components/auth/ProtectedRoute";

export default function App() {
  return (
    <>
      <Router>
        <ScrollToTop />
        <Routes>
          {/* Dashboard Layout */}
          <Route element={<ProtectedRoute />}>
            <Route element={<AppLayout />}>
              <Route index path="/" element={<Home />} />

              {/* Users Pages */}
              {/* <Route path="/users/system" element={<SystemUsers />} /> */}
              <Route path="/users/companies" element={<Companies />} />
            <Route path="/users/companies/add" element={<AddCompany />} />
            <Route path="/users/companies/edit/:id" element={<AddCompany />} />
            <Route path="/users/companies/:id" element={<CompanyDetails />} />
            <Route path="/users/companies/:id/applications" element={<CompanyApplications />} />
            <Route path="/users/job-seekers" element={<JobSeekers />} />
            <Route path="/users/job-seekers/:id" element={<JobSeekerDetails />} />
            
            {/* Main Navigation Pages */}
            <Route path="/courses" element={<Courses />} />
            <Route path="/courses/:id" element={<CourseDetails />} />
            <Route path="/courses/add" element={<AddCourse />} />
            <Route path="/courses/edit/:id" element={<AddCourse />} />
            <Route path="/mentors" element={<Mentors />} />
            <Route path="/mentors/:id" element={<MentorDetails />} />
            <Route path="/my-bookings" element={<MyBookings />} />
            <Route path="/mentors/add" element={<AddMentor />} />
            <Route path="/mentors/edit/:id" element={<AddMentor />} />
            <Route path="/jobs" element={<Jobs />} />
            <Route path="/jobs/:id" element={<JobDetails />} />
            <Route path="/jobs/add" element={<AddJob />} />
            <Route path="/jobs/edit/:id" element={<AddJob />} />
            <Route path="/applications" element={<Applications />} />
            <Route path="/applications/:id" element={<ApplicantDetails />} />
            <Route path="/internships" element={<Internships />} />
            <Route path="/internships/:id" element={<InternshipDetails />} />
            <Route path="/internships/add" element={<AddInternship />} />
            <Route path="/internships/edit/:id" element={<AddInternship />} />
            <Route path="/enrollments" element={<Enrollments />} />
            <Route path="/subscribers" element={<Subscribers />} />
            
            {/* Settings Pages */}
            <Route path="/settings/roles" element={<Roles />} />
            <Route path="/settings/permissions" element={<Permissions />} />
            <Route path="/settings/categories" element={<Categories />} />
            <Route path="/settings/subscription-plans" element={<SubscriptionPlans />} />

            {/* Others Page */}
            <Route path="/profile" element={<UserProfiles />} />
            <Route path="/calendar" element={<Calendar />} />
            <Route path="/blank" element={<Blank />} />

            {/* Forms */}
            <Route path="/form-elements" element={<FormElements />} />

            {/* Tables */}
            <Route path="/basic-tables" element={<BasicTables />} />

            {/* Ui Elements */}
            <Route path="/alerts" element={<Alerts />} />
            <Route path="/avatars" element={<Avatars />} />
            <Route path="/badge" element={<Badges />} />
            <Route path="/buttons" element={<Buttons />} />
            <Route path="/images" element={<Images />} />
            <Route path="/videos" element={<Videos />} />

            {/* Charts */}
            <Route path="/line-chart" element={<LineChart />} />
            <Route path="/bar-chart" element={<BarChart />} />
          </Route>
          </Route>

          {/* Auth Layout */}
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />

          {/* Fallback Route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </>
  );
}
