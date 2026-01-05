import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import PageMeta from "../components/common/PageMeta";
import PageBreadcrumb from "../components/common/PageBreadCrumb";
import Badge from "../components/ui/badge/Badge";
import Button from "../components/ui/button/Button";
import { mentorService, Mentor } from "../services/mentorService";
import { mentorshipService, MentorshipProgram } from "../services/mentorshipService";
import Modal from "../components/ui/modal/Modal";

export default function MentorDetails() {
  const { id } = useParams();
  const [mentor, setMentor] = useState<Mentor | null>(null);
  const [programs, setPrograms] = useState<MentorshipProgram[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Booking State
  const [selectedProgram, setSelectedProgram] = useState<MentorshipProgram | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [bookingNote, setBookingNote] = useState("");
  const [bookingStatus, setBookingStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;
      setLoading(true);
      try {
        const [mentorData, programsData] = await Promise.all([
          mentorService.getMentorById(id),
          mentorshipService.getProgramsByMentor(id)
        ]);
        setMentor(mentorData);
        setPrograms(programsData);
      } catch (error) {
        console.error("Failed to fetch mentor details", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const handleBookSlot = (program: MentorshipProgram, slotId: string) => {
    setSelectedProgram(program);
    setSelectedSlot(slotId);
    setBookingStatus('idle');
    setBookingNote("");
    setIsBookingModalOpen(true);
  };

  const confirmBooking = async () => {
    if (!selectedProgram || !selectedSlot) return;
    
    setBookingStatus('loading');
    try {
      await mentorshipService.bookSlot(selectedProgram._id, selectedSlot, bookingNote);
      setBookingStatus('success');
      
      // Refresh programs to update slot status
      if (id) {
        const programsData = await mentorshipService.getProgramsByMentor(id);
        setPrograms(programsData);
      }
      
      setTimeout(() => {
        setIsBookingModalOpen(false);
        setBookingStatus('idle');
      }, 2000);
    } catch (error) {
      console.error("Booking failed", error);
      setBookingStatus('error');
    }
  };

  const handleDelete = async () => {
    if (!id) return;
    const confirm = window.confirm("Are you sure you want to delete this mentor?");
    if (!confirm) return;
    try {
      await mentorService.deleteMentor(id);
      alert("Mentor deleted");
      navigate("/mentors");
    } catch {
      alert("Failed to delete mentor");
    }
  };

  return (
    <>
      <PageMeta title="Mentor Details | Empedia" description="View mentor details and book sessions" />
      <PageBreadcrumb pageTitle="Mentor Details" />
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <Link to="/mentors">
            <Button variant="outline">Back</Button>
          </Link>
          {mentor && (
            <Button variant="outline" onClick={handleDelete}>Delete</Button>
          )}
        </div>
        
        {loading ? (
          <div className="flex justify-center items-center p-8">
            <div className="animate-spin rounded-full border-4 border-gray-200 border-t-blue-600 w-8 h-8"></div>
          </div>
        ) : mentor ? (
          <>
            {/* Mentor Profile */}
            <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
              <div className="flex gap-6">
                {mentor.profilePhoto && (
                  <img
                    src={`https://empediaapis-w7dq6.ondigitalocean.app/${mentor.profilePhoto}`}
                    alt={mentor.fullName || ""}
                    className="w-24 h-24 rounded-full object-cover"
                  />
                )}
                <div className="flex-1">
                  <h1 className="text-2xl font-semibold text-gray-800 dark:text-white/90">{mentor.fullName || ""}</h1>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {mentor.status && (
                      <Badge
                        size="sm"
                        color={mentor.status === "Approved" || mentor.status === "Active" ? "success" : mentor.status === "Pending" ? "warning" : "error"}
                      >
                        {mentor.status}
                      </Badge>
                    )}
                    {mentor.isVerified && <Badge size="sm" color="primary">Verified</Badge>}
                  </div>
                  <div className="mt-2 text-sm text-gray-700 dark:text-gray-300">{mentor.headline || ""}</div>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h2 className="text-lg font-medium text-gray-800 dark:text-white/90">Details</h2>
                  <div className="mt-3 space-y-2 text-sm text-gray-700 dark:text-gray-300">
                    {mentor.company && <div>Company: {mentor.company}</div>}
                    {mentor.currentRole && <div>Role: {mentor.currentRole}</div>}
                    {mentor.hourlyRate && <div>Hourly Rate: ${mentor.hourlyRate}</div>}
                    {mentor.linkedinUrl && <div>LinkedIn: {mentor.linkedinUrl}</div>}
                  </div>
                </div>
                <div>
                  <h2 className="text-lg font-medium text-gray-800 dark:text-white/90">Expertise</h2>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {(mentor.expertiseTags || []).map((s, i) => (
                      <Badge key={i} size="sm" color="light">
                        {s}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Mentorship Programs */}
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-gray-800 dark:text-white">Mentorship Programs</h2>
              {programs.length === 0 ? (
                <div className="text-gray-500">No active programs available.</div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {programs.map((program) => (
                    <div key={program._id} className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03] shadow-sm hover:shadow-md transition-shadow">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{program.title}</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{program.duration} mins • {program.currency} {program.price}</p>
                      <p className="mt-3 text-gray-700 dark:text-gray-300">{program.description}</p>
                      
                      <div className="mt-4">
                        <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">Available Slots:</h4>
                        <div className="flex flex-wrap gap-2">
                          {program.availableSlots && program.availableSlots.filter(s => !s.isBooked).length > 0 ? (
                            program.availableSlots
                              .filter(slot => !slot.isBooked)
                              .map((slot) => (
                                <button
                                  key={slot._id}
                                  onClick={() => handleBookSlot(program, slot._id)}
                                  className="px-3 py-1 text-xs font-medium bg-blue-50 text-blue-700 rounded-full border border-blue-200 hover:bg-blue-100 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800 transition-colors"
                                >
                                  {new Date(slot.date).toLocaleDateString()} {slot.startTime}
                                </button>
                              ))
                          ) : (
                            <span className="text-sm text-gray-500">No slots available</span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Recommended Content */}
            {(mentor.recommendedCourses?.length || mentor.recommendedJobs?.length || mentor.recommendedInternships?.length) ? (
              <div className="space-y-6 pt-6 border-t border-gray-200 dark:border-gray-800">
                <h2 className="text-xl font-bold text-gray-800 dark:text-white">Recommended Growth</h2>
                
                {mentor.recommendedCourses && mentor.recommendedCourses.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold mb-3 text-gray-700 dark:text-gray-200">Courses</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {mentor.recommendedCourses.map(course => (
                        <div key={course._id} className="p-4 border rounded-lg bg-white dark:bg-gray-800 dark:border-gray-700">
                          <h4 className="font-medium text-gray-900 dark:text-white">{course.title}</h4>
                          <p className="text-sm text-gray-500">{course.level}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {mentor.recommendedJobs && mentor.recommendedJobs.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold mb-3 text-gray-700 dark:text-gray-200">Jobs</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {mentor.recommendedJobs.map(job => (
                        <div key={job._id} className="p-4 border rounded-lg bg-white dark:bg-gray-800 dark:border-gray-700">
                          <h4 className="font-medium text-gray-900 dark:text-white">{job.title}</h4>
                          <p className="text-sm text-gray-500">{typeof job.company === 'string' ? job.company : job.company.company_name}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {mentor.recommendedInternships && mentor.recommendedInternships.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold mb-3 text-gray-700 dark:text-gray-200">Internships</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {mentor.recommendedInternships.map(internship => (
                        <div key={internship._id} className="p-4 border rounded-lg bg-white dark:bg-gray-800 dark:border-gray-700">
                          <h4 className="font-medium text-gray-900 dark:text-white">{internship.title}</h4>
                          <p className="text-sm text-gray-500">{typeof internship.company === 'string' ? internship.company : internship.company.company_name}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : null}
          </>
        ) : (
          <div className="text-center py-8 text-gray-500">Mentor not found</div>
        )}
      </div>

      {/* Booking Modal */}
      <Modal
        isOpen={isBookingModalOpen}
        onClose={() => setIsBookingModalOpen(false)}
        title="Confirm Booking"
        size="md"
      >
        <div className="space-y-4">
          {bookingStatus === 'success' ? (
             <div className="text-center py-4">
               <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
                 <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                 </svg>
               </div>
               <h3 className="mt-2 text-lg font-medium text-gray-900 dark:text-white">Booking Confirmed!</h3>
               <p className="text-sm text-gray-500">You will receive a confirmation email shortly.</p>
             </div>
          ) : (
            <>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  You are booking <strong>{selectedProgram?.title}</strong>
                </p>
                {selectedSlot && selectedProgram && (
                   <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                     Time: {(() => {
                        const slot = selectedProgram.availableSlots.find(s => s._id === selectedSlot);
                        return slot ? `${new Date(slot.date).toLocaleDateString()} at ${slot.startTime}` : '';
                     })()}
                   </p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Notes for Mentor (Optional)
                </label>
                <textarea
                  className="w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2 text-sm text-gray-900 focus:border-blue-500 focus:outline-none dark:border-gray-700 dark:text-white"
                  rows={3}
                  value={bookingNote}
                  onChange={(e) => setBookingNote(e.target.value)}
                  placeholder="Introduce yourself or share what you'd like to discuss..."
                />
              </div>

              {bookingStatus === 'error' && (
                <div className="text-sm text-red-600 bg-red-50 p-2 rounded">
                  Booking failed. Please try again.
                </div>
              )}

              <div className="flex justify-end gap-3 mt-4">
                <Button variant="outline" onClick={() => setIsBookingModalOpen(false)}>
                  Cancel
                </Button>
                <Button 
                  variant="primary" 
                  onClick={confirmBooking}
                  disabled={bookingStatus === 'loading'}
                >
                  {bookingStatus === 'loading' ? 'Booking...' : 'Confirm Booking'}
                </Button>
              </div>
            </>
          )}
        </div>
      </Modal>
    </>
  );
}
