import { useEffect, useState } from 'react';
import { mentorshipService, Booking } from '../services/mentorshipService';
import PageMeta from '../components/common/PageMeta';
import PageBreadcrumb from '../components/common/PageBreadCrumb';
import Badge from '../components/ui/badge/Badge';
import { Link } from 'react-router-dom';

export default function MyBookings() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const data = await mentorshipService.getMyBookings();
        setBookings(data);
      } catch (error) {
        console.error("Failed to fetch bookings", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  return (
    <>
      <PageMeta title="My Bookings | Empedia" description="View your mentorship sessions" />
      <PageBreadcrumb pageTitle="My Mentorship Bookings" />
      
      <div className="space-y-6">
        {loading ? (
          <div className="flex justify-center items-center p-8">
            <div className="animate-spin rounded-full border-4 border-gray-200 border-t-blue-600 w-8 h-8"></div>
          </div>
        ) : bookings.length === 0 ? (
          <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg shadow">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">No bookings yet</h3>
            <p className="mt-2 text-gray-500 dark:text-gray-400">Browse mentors to book your first session.</p>
            <div className="mt-6">
              <Link to="/mentors" className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700">
                Find a Mentor
              </Link>
            </div>
          </div>
        ) : (
          <div className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden">
            <ul className="divide-y divide-gray-200 dark:divide-gray-700">
              {bookings.map((booking) => (
                <li key={booking._id} className="p-6 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="flex-shrink-0">
                        <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-xl font-bold">
                           {booking.mentor.fullName.charAt(0)}
                        </div>
                      </div>
                      <div>
                        <h4 className="text-lg font-medium text-gray-900 dark:text-white">
                          {booking.mentorship.title}
                        </h4>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          with {booking.mentor.fullName}
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-col items-end space-y-2">
                      <Badge 
                        size="md" 
                        color={booking.status === 'Confirmed' ? 'success' : booking.status === 'Cancelled' ? 'error' : 'warning'}
                      >
                        {booking.status}
                      </Badge>
                      <div className="text-sm text-gray-700 dark:text-gray-300">
                        {new Date(booking.slot_date).toLocaleDateString()} at {booking.slot_time}
                      </div>
                    </div>
                  </div>
                  {booking.meeting_link && (
                    <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
                      <a 
                        href={booking.meeting_link} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-sm text-blue-600 hover:text-blue-500 font-medium flex items-center"
                      >
                        <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                        Join Meeting
                      </a>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </>
  );
}
