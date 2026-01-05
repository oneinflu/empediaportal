import { useState } from "react";
import { Link } from "react-router-dom";
import PageMeta from "../../components/common/PageMeta";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import { Table, TableHeader, TableBody, TableRow, TableCell } from "../../components/ui/table";
import Badge from "../../components/ui/badge/Badge";
import Button from "../../components/ui/button/Button";

interface SystemUser {
  id: number;
  name: string;
  avatar: string;
  email: string;
  role: "Admin" | "Moderator" | "Editor" | "Viewer";
  department: string;
  status: "Active" | "Inactive";
  lastLogin: string;
  createdAt: string;
}

interface SystemUsersTableProps {
  users: SystemUser[];
  isLoading: boolean;
}

const SystemUsersTable: React.FC<SystemUsersTableProps> = ({ users }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = 5; // This would normally be calculated based on total users and page size

  const handlePageChange = (page: number) => {
    console.log(`Navigating to page ${page}`);
    setCurrentPage(page);
    // Here you would fetch the users for the new page
  };

  const handleEditUser = (userId: number) => {
    console.log(`Editing user with ID: ${userId}`);
    // Open edit modal or navigate to edit page
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case "Admin": return "error";
      case "Moderator": return "warning";
      case "Editor": return "info";
      case "Viewer": return "success";
      default: return "light";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active": return "success";
      case "Inactive": return "error";
      default: return "light";
    }
  };

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
                  User
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  Role
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  Department
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
                  Last Login
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  Created At
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
            <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="px-5 py-4 text-start">
                    <div className="flex items-center gap-3">
                      <img 
                        src={user.avatar} 
                        alt={user.name} 
                        className="h-10 w-10 rounded-full object-cover"
                      />
                      <div>
                        <span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
                          {user.name}
                        </span>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {user.email}
                        </span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                    <Badge
                      size="sm"
                      color={getRoleColor(user.role)}
                    >
                      {user.role}
                    </Badge>
                  </TableCell>
                  <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                    {user.department}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                    <Badge
                      size="sm"
                      color={getStatusColor(user.status)}
                    >
                      {user.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                    {new Date(user.lastLogin).toLocaleString()}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                    <div className="flex gap-2">
                      <Link to={`/users/system-users/${user.id}`}>
                        <Button
                          size="sm"
                          variant="outline"
                        >
                          View
                        </Button>
                      </Link>
                      <Button
                        size="sm"
                        variant="primary"
                        onClick={() => handleEditUser(user.id)}
                      >
                        Edit
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
            size="sm"
            onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
          >
            Next
          </Button>
        </div>
        <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
          <div>
            <p className="text-sm text-gray-700 dark:text-gray-400">
              Showing <span className="font-medium">1</span> to{" "}
              <span className="font-medium">{users.length}</span> of{" "}
              <span className="font-medium">{users.length}</span> results
            </p>
          </div>
          <div>
            <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
              >
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
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

export default function SystemUsers() {
  const [isLoading] = useState(false);

  // Sample data
  const sampleUsers: SystemUser[] = [
    {
      id: 1,
      name: "Alex Johnson",
      avatar: "https://randomuser.me/api/portraits/men/21.jpg",
      email: "alex.johnson@empedia.com",
      role: "Admin",
      department: "Engineering",
      status: "Active",
      lastLogin: "2023-05-15T14:30:00",
      createdAt: "2022-01-10"
    },
    {
      id: 2,
      name: "Samantha Lee",
      avatar: "https://randomuser.me/api/portraits/women/22.jpg",
      email: "samantha.lee@empedia.com",
      role: "Moderator",
      department: "Content",
      status: "Active",
      lastLogin: "2023-05-14T09:15:00",
      createdAt: "2022-02-15"
    },
    {
      id: 3,
      name: "Robert Chen",
      avatar: "https://randomuser.me/api/portraits/men/23.jpg",
      email: "robert.chen@empedia.com",
      role: "Editor",
      department: "Marketing",
      status: "Inactive",
      lastLogin: "2023-04-30T11:45:00",
      createdAt: "2022-03-05"
    },
    {
      id: 4,
      name: "Jessica Miller",
      avatar: "https://randomuser.me/api/portraits/women/24.jpg",
      email: "jessica.miller@empedia.com",
      role: "Viewer",
      department: "Sales",
      status: "Active",
      lastLogin: "2023-05-15T10:20:00",
      createdAt: "2022-04-12"
    },
    {
      id: 5,
      name: "Daniel Wilson",
      avatar: "https://randomuser.me/api/portraits/men/25.jpg",
      email: "daniel.wilson@empedia.com",
      role: "Admin",
      department: "Product",
      status: "Active",
      lastLogin: "2023-05-14T16:05:00",
      createdAt: "2022-01-25"
    },
  ];

  return (
    <>
      <PageMeta
        title="System Users | Empedia Admin"
        description="Manage system users and their permissions"
      />
      <PageBreadcrumb pageTitle="System Users" />
      
      <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white/90">System Users</h2>
            <p className="mt-2 text-gray-500 dark:text-gray-400">
              Manage all system users and their permissions.
            </p>
          </div>
          <Link to="/users/system-users/add">
            <Button
              size="md"
              startIcon={<span className="text-lg">+</span>}
            >
              Add New User
            </Button>
          </Link>
        </div>
        
        {isLoading ? (
          <div className="flex justify-center items-center p-4 w-full">
            <div className="animate-spin rounded-full border-4 border-gray-200 border-t-blue-600 w-8 h-8"></div>
          </div>
        ) : (
          <SystemUsersTable users={sampleUsers} isLoading={isLoading} />
        )}
      </div>
    </>
  );
}
