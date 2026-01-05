import { useState, useEffect } from "react";
// Removed unused Link import
import PageMeta from "../components/common/PageMeta";
import PageBreadcrumb from "../components/common/PageBreadCrumb";
import { Table, TableHeader, TableBody, TableRow, TableCell } from "../components/ui/table";
import Badge from "../components/ui/badge/Badge";
import Button from "../components/ui/button/Button";
import Modal from "../components/ui/modal/Modal";

interface Subscriber {
  id: number;
  email: string;
  name: string;
  subscribedTo: string[];
  status: "Active" | "Unsubscribed" | "Bounced";
  joinedDate: string;
  lastActivity: string;
  openRate: number;
  clickRate: number;
}

interface SubscribersTableProps {
  subscribers: Subscriber[];
  isLoading: boolean;
  onEdit: (subscriber: Subscriber) => void;
  onDelete: (subscriberId: number) => void;
}

const SubscribersTable: React.FC<SubscribersTableProps> = ({ 
  subscribers, 
  isLoading, 
  onEdit, 
  onDelete 
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(subscribers.length / 10); // 10 items per page

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active": return "success";
      case "Unsubscribed": return "warning";
      case "Bounced": return "error";
      default: return "light";
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 dark:border-white"></div>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
      <div className="max-w-full overflow-x-auto">
        <div className="min-w-[1000px]">
          <Table>
            {/* Table Header */}
            <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
              <TableRow>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  Email
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  Name
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  Subscribed To
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  Status
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  Joined Date
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  Last Activity
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  Engagement
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  Actions
                </TableCell>
              </TableRow>
            </TableHeader>

            {/* Table Body */}
            <TableBody>
              {subscribers.map((subscriber) => (
                <TableRow
                  key={subscriber.id}
                  className="border-b border-gray-100 dark:border-white/[0.05] hover:bg-gray-50 dark:hover:bg-white/[0.02]"
                >
                  <TableCell className="px-4 py-3 text-gray-800 text-start text-theme-sm dark:text-white/90">
                    {subscriber.email}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                    {subscriber.name || "—"}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                    <div className="flex flex-wrap gap-1">
                      {subscriber.subscribedTo.map((list, index) => (
                        <Badge key={index} size="sm" color="primary">
                          {list}
                        </Badge>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                    <Badge
                      size="sm"
                      color={getStatusColor(subscriber.status)}
                    >
                      {subscriber.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                    {subscriber.joinedDate}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                    {subscriber.lastActivity}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                    <div className="flex flex-col">
                      <span>Open: {subscriber.openRate}%</span>
                      <span>Click: {subscriber.clickRate}%</span>
                    </div>
                  </TableCell>
                  <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => onEdit(subscriber)}
                      >
                        Edit
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => onDelete(subscriber.id)}
                      >
                        Delete
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between border-t border-gray-100 px-4 py-3 dark:border-white/[0.05] sm:px-6">
        <div className="flex flex-1 justify-between sm:hidden">
          <Button
            variant="outline"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            Next
          </Button>
        </div>
        <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
          <div>
            <p className="text-sm text-gray-700 dark:text-gray-400">
              Showing page <span className="font-medium">{currentPage}</span> of{" "}
              <span className="font-medium">{totalPages}</span>
            </p>
          </div>
          <div>
            <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
              <Button
                variant="outline"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="rounded-l-md"
              >
                Previous
              </Button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <Button
                  key={page}
                  variant={page === currentPage ? "primary" : "outline"}
                  onClick={() => handlePageChange(page)}
                >
                  {page}
                </Button>
              ))}
              <Button
                variant="outline"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="rounded-r-md"
              >
                Next
              </Button>
            </nav>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function Subscribers() {
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [currentSubscriber, setCurrentSubscriber] = useState<Subscriber | null>(null);
  const [subscriberToDelete, setSubscriberToDelete] = useState<number | null>(null);
  
  // Form state
  const [formData, setFormData] = useState({
    email: "",
    name: "",
    subscribedTo: [] as string[],
    status: "Active" as "Active" | "Unsubscribed" | "Bounced"
  });

  // Available newsletter lists
  const availableLists = ["Weekly Updates", "Product Announcements", "Industry News", "Tips & Tutorials"];

  useEffect(() => {
    // Simulate API call
    const fetchSubscribers = async () => {
      setIsLoading(true);
      try {
        // Mock data
        const mockSubscribers: Subscriber[] = [
          {
            id: 1,
            email: "john.doe@example.com",
            name: "John Doe",
            subscribedTo: ["Weekly Updates", "Product Announcements"],
            status: "Active",
            joinedDate: "2023-05-15",
            lastActivity: "2023-09-20",
            openRate: 68,
            clickRate: 24
          },
          {
            id: 2,
            email: "jane.smith@example.com",
            name: "Jane Smith",
            subscribedTo: ["Weekly Updates", "Industry News", "Tips & Tutorials"],
            status: "Active",
            joinedDate: "2023-06-02",
            lastActivity: "2023-09-18",
            openRate: 82,
            clickRate: 35
          },
          {
            id: 3,
            email: "michael.brown@example.com",
            name: "Michael Brown",
            subscribedTo: ["Product Announcements"],
            status: "Unsubscribed",
            joinedDate: "2023-04-10",
            lastActivity: "2023-08-05",
            openRate: 45,
            clickRate: 12
          },
          {
            id: 4,
            email: "sarah.wilson@example.com",
            name: "Sarah Wilson",
            subscribedTo: ["Weekly Updates", "Tips & Tutorials"],
            status: "Active",
            joinedDate: "2023-07-22",
            lastActivity: "2023-09-21",
            openRate: 75,
            clickRate: 28
          },
          {
            id: 5,
            email: "david.johnson@example.com",
            name: "David Johnson",
            subscribedTo: ["Industry News"],
            status: "Bounced",
            joinedDate: "2023-03-18",
            lastActivity: "2023-07-30",
            openRate: 0,
            clickRate: 0
          }
        ];
        
        // Simulate network delay
        setTimeout(() => {
          setSubscribers(mockSubscribers);
          setIsLoading(false);
        }, 1000);
      } catch (error) {
        console.error("Error fetching subscribers:", error);
        setIsLoading(false);
      }
    };

    fetchSubscribers();
  }, []);

  const handleAddSubscriber = () => {
    setFormData({
      email: "",
      name: "",
      subscribedTo: [],
      status: "Active"
    });
    setIsAddModalOpen(true);
  };

  const handleEditSubscriber = (subscriber: Subscriber) => {
    setCurrentSubscriber(subscriber);
    setFormData({
      email: subscriber.email,
      name: subscriber.name || "",
      subscribedTo: [...subscriber.subscribedTo],
      status: subscriber.status
    });
    setIsEditModalOpen(true);
  };

  const handleDeleteSubscriber = (subscriberId: number) => {
    setSubscriberToDelete(subscriberId);
    setIsDeleteModalOpen(true);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleCheckboxChange = (list: string) => {
    setFormData(prev => {
      if (prev.subscribedTo.includes(list)) {
        return {
          ...prev,
          subscribedTo: prev.subscribedTo.filter(l => l !== list)
        };
      } else {
        return {
          ...prev,
          subscribedTo: [...prev.subscribedTo, list]
        };
      }
    });
  };

  const handleSubmitAdd = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, you would send this to your API
    const newSubscriber: Subscriber = {
      id: Math.max(...subscribers.map(s => s.id)) + 1,
      email: formData.email,
      name: formData.name,
      subscribedTo: formData.subscribedTo,
      status: formData.status,
      joinedDate: new Date().toISOString().split('T')[0],
      lastActivity: new Date().toISOString().split('T')[0],
      openRate: 0,
      clickRate: 0
    };
    
    setSubscribers([...subscribers, newSubscriber]);
    setIsAddModalOpen(false);
  };

  const handleSubmitEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentSubscriber) return;
    
    // In a real app, you would send this to your API
    const updatedSubscribers = subscribers.map(subscriber => {
      if (subscriber.id === currentSubscriber.id) {
        return {
          ...subscriber,
          email: formData.email,
          name: formData.name,
          subscribedTo: formData.subscribedTo,
          status: formData.status
        };
      }
      return subscriber;
    });
    
    setSubscribers(updatedSubscribers);
    setIsEditModalOpen(false);
  };

  const handleConfirmDelete = () => {
    if (subscriberToDelete === null) return;
    
    // In a real app, you would send this to your API
    const updatedSubscribers = subscribers.filter(
      subscriber => subscriber.id !== subscriberToDelete
    );
    
    setSubscribers(updatedSubscribers);
    setIsDeleteModalOpen(false);
    setSubscriberToDelete(null);
  };

  return (
    <>
      <PageMeta
        title="Subscribers | Empedia Admin"
        description="Manage subscribers in the Empedia platform"
      />
      <PageBreadcrumb pageTitle="Subscribers" />
      
      <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03] mb-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white/90">Subscribers</h2>
            <p className="mt-2 text-gray-500 dark:text-gray-400">
              Manage all newsletter subscribers and email campaigns.
            </p>
          </div>
          <Button variant="primary" onClick={handleAddSubscriber}>Add New Subscriber</Button>
        </div>
      </div>

      <SubscribersTable 
        subscribers={subscribers} 
        isLoading={isLoading} 
        onEdit={handleEditSubscriber}
        onDelete={handleDeleteSubscriber}
      />

      {/* Add Subscriber Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Add New Subscriber"
        size="lg"
      >
        <form onSubmit={handleSubmitAdd}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Subscribe To
              </label>
              <div className="space-y-2">
                {availableLists.map((list) => (
                  <div key={list} className="flex items-center">
                    <input
                      type="checkbox"
                      id={`list-${list.replace(/\s+/g, '-').toLowerCase()}`}
                      checked={formData.subscribedTo.includes(list)}
                      onChange={() => handleCheckboxChange(list)}
                      className="h-4 w-4 rounded border-gray-300 text-brand-600 focus:ring-brand-500 dark:border-gray-600 dark:bg-gray-700"
                    />
                    <label 
                      htmlFor={`list-${list.replace(/\s+/g, '-').toLowerCase()}`} 
                      className="ml-2 text-sm text-gray-700 dark:text-gray-300"
                    >
                      {list}
                    </label>
                  </div>
                ))}
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Status
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleInputChange}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              >
                <option value="Active">Active</option>
                <option value="Unsubscribed">Unsubscribed</option>
                <option value="Bounced">Bounced</option>
              </select>
            </div>
          </div>
          
          <div className="mt-6 flex justify-end space-x-3">
            <Button variant="outline" onClick={() => setIsAddModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              Add Subscriber
            </Button>
          </div>
        </form>
      </Modal>

      {/* Edit Subscriber Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Edit Subscriber"
        size="lg"
      >
        <form onSubmit={handleSubmitEdit}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Subscribe To
              </label>
              <div className="space-y-2">
                {availableLists.map((list) => (
                  <div key={list} className="flex items-center">
                    <input
                      type="checkbox"
                      id={`edit-list-${list.replace(/\s+/g, '-').toLowerCase()}`}
                      checked={formData.subscribedTo.includes(list)}
                      onChange={() => handleCheckboxChange(list)}
                      className="h-4 w-4 rounded border-gray-300 text-brand-600 focus:ring-brand-500 dark:border-gray-600 dark:bg-gray-700"
                    />
                    <label 
                      htmlFor={`edit-list-${list.replace(/\s+/g, '-').toLowerCase()}`} 
                      className="ml-2 text-sm text-gray-700 dark:text-gray-300"
                    >
                      {list}
                    </label>
                  </div>
                ))}
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Status
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleInputChange}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              >
                <option value="Active">Active</option>
                <option value="Unsubscribed">Unsubscribed</option>
                <option value="Bounced">Bounced</option>
              </select>
            </div>
          </div>
          
          <div className="mt-6 flex justify-end space-x-3">
            <Button variant="outline" onClick={() => setIsEditModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              Save Changes
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Delete Subscriber"
        size="sm"
      >
        <div className="space-y-4">
          <p className="text-gray-700 dark:text-gray-300">
            Are you sure you want to delete this subscriber? This action cannot be undone.
          </p>
          
          <div className="flex justify-end space-x-3">
            <Button variant="outline" onClick={() => setIsDeleteModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleConfirmDelete}>
              Delete
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
}
