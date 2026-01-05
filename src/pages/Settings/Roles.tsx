import React, { useState, useEffect } from "react";
import PageMeta from "../../components/common/PageMeta";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import { Table, TableHeader, TableBody, TableRow, TableCell } from "../../components/ui/table";
import Badge from "../../components/ui/badge/Badge";
import Button from "../../components/ui/button/Button";
import Checkbox from "../../components/form/input/Checkbox";

// Interfaces
interface Permission {
  id: number;
  name: string;
  description: string;
  module: string;
}

interface Role {
  id: number;
  name: string;
  description: string;
  permissions: number[];  // Array of permission IDs
  usersCount: number;
  createdAt: string;
  updatedAt: string;
}

interface RolesTableProps {
  roles: Role[];
  isLoading: boolean;
  onEdit: (role: Role) => void;
  onDelete: (roleId: number) => void;
}

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

interface InputProps {
  label: string;
  type?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  required?: boolean;
  name?: string;
}

interface TextareaProps {
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  placeholder?: string;
  required?: boolean;
  name?: string;
}

// Components
const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-auto bg-black bg-opacity-50">
      <div className="relative w-full max-w-2xl rounded-lg bg-white p-6 shadow-lg dark:bg-gray-800">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">{title}</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        {children}
      </div>
    </div>
  );
};

const Input: React.FC<InputProps> = ({
  label,
  type = "text",
  value,
  onChange,
  placeholder = "",
  required = false,
  name,
}) => {
  return (
    <div className="mb-4">
      <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
        {label}
        {required && <span className="text-error-500">*</span>}
      </label>
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        name={name}
        className="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
      />
    </div>
  );
};

const Textarea: React.FC<TextareaProps> = ({
  label,
  value,
  onChange,
  placeholder = "",
  required = false,
  name,
}) => {
  return (
    <div className="mb-4">
      <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
        {label}
        {required && <span className="text-error-500">*</span>}
      </label>
      <textarea
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        name={name}
        rows={3}
        className="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
      />
    </div>
  );
};

const RolesTable: React.FC<RolesTableProps> = ({ roles, isLoading, onEdit, onDelete }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(roles.length / 10);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-gray-900 dark:border-white"></div>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
      <div className="max-w-full overflow-x-auto">
        <div className="min-w-[1000px]">
          <Table>
            <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
              <TableRow>
                <TableCell isHeader className="px-5 py-3 text-start text-theme-xs font-medium text-gray-500 dark:text-gray-400">
                  Role Name
                </TableCell>
                <TableCell isHeader className="px-5 py-3 text-start text-theme-xs font-medium text-gray-500 dark:text-gray-400">
                  Description
                </TableCell>
                <TableCell isHeader className="px-5 py-3 text-start text-theme-xs font-medium text-gray-500 dark:text-gray-400">
                  Permissions
                </TableCell>
                <TableCell isHeader className="px-5 py-3 text-start text-theme-xs font-medium text-gray-500 dark:text-gray-400">
                  Users
                </TableCell>
                <TableCell isHeader className="px-5 py-3 text-start text-theme-xs font-medium text-gray-500 dark:text-gray-400">
                  Created
                </TableCell>
                <TableCell isHeader className="px-5 py-3 text-start text-theme-xs font-medium text-gray-500 dark:text-gray-400">
                  Updated
                </TableCell>
                <TableCell isHeader className="px-5 py-3 text-start text-theme-xs font-medium text-gray-500 dark:text-gray-400">
                  Actions
                </TableCell>
              </TableRow>
            </TableHeader>

            <TableBody>
              {roles.map((role) => (
                <TableRow
                  key={role.id}
                  className="border-b border-gray-100 hover:bg-gray-50 dark:border-white/[0.05] dark:hover:bg-white/[0.02]"
                >
                  <TableCell className="px-4 py-3 text-start text-theme-sm text-gray-800 dark:text-white/90">
                    {role.name}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-start text-theme-sm text-gray-500 dark:text-gray-400">
                    {role.description}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-start text-theme-sm text-gray-500 dark:text-gray-400">
                    <Badge size="sm" color={role.permissions.length > 10 ? "warning" : "info"}>
                      {role.permissions.length} permissions
                    </Badge>
                  </TableCell>
                  <TableCell className="px-4 py-3 text-start text-theme-sm text-gray-500 dark:text-gray-400">
                    {role.usersCount}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-start text-theme-sm text-gray-500 dark:text-gray-400">
                    {role.createdAt}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-start text-theme-sm text-gray-500 dark:text-gray-400">
                    {role.updatedAt}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-start text-theme-sm text-gray-500 dark:text-gray-400">
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" onClick={() => onEdit(role)}>
                        Edit
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-error-500 text-error-500 hover:bg-error-50 dark:border-error-400 dark:text-error-400 dark:hover:bg-error-900/20"
                        onClick={() => onDelete(role.id)}
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
        <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
          <div>
            <p className="text-sm text-gray-700 dark:text-gray-400">
              Showing page <span className="font-medium">{currentPage}</span> of{" "}
              <span className="font-medium">{totalPages}</span>
            </p>
          </div>
          <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm">
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
  );
};

export default function Roles() {
  const [roles, setRoles] = useState<Role[]>([]);
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Modal states
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  
  // Form states
  const [currentRole, setCurrentRole] = useState<Role | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    selectedPermissions: [] as number[]
  });

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle permission checkbox changes
  const handlePermissionChange = (permissionId: number) => {
    setFormData(prev => ({
      ...prev,
      selectedPermissions: prev.selectedPermissions.includes(permissionId)
        ? prev.selectedPermissions.filter(id => id !== permissionId)
        : [...prev.selectedPermissions, permissionId]
    }));
  };

  // Open add modal
  const handleAddRole = () => {
    setFormData({
      name: "",
      description: "",
      selectedPermissions: []
    });
    setIsAddModalOpen(true);
  };

  // Open edit modal
  const handleEditRole = (role: Role) => {
    setCurrentRole(role);
    setFormData({
      name: role.name,
      description: role.description,
      selectedPermissions: role.permissions
    });
    setIsEditModalOpen(true);
  };

  // Open delete modal
  const handleDeleteRole = (roleId: number) => {
    const roleToDelete = roles.find(role => role.id === roleId);
    if (roleToDelete) {
      setCurrentRole(roleToDelete);
      setIsDeleteModalOpen(true);
    }
  };

  // Submit add form
  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newRole: Role = {
      id: Math.max(0, ...roles.map(r => r.id)) + 1,
      name: formData.name,
      description: formData.description,
      permissions: formData.selectedPermissions,
      usersCount: 0,
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0],
    };
    
    setRoles([...roles, newRole]);
    setIsAddModalOpen(false);
  };

  // Submit edit form
  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!currentRole) return;
    
    const updatedRoles = roles.map(role => {
      if (role.id === currentRole.id) {
        return {
          ...role,
          name: formData.name,
          description: formData.description,
          permissions: formData.selectedPermissions,
          updatedAt: new Date().toISOString().split('T')[0],
        };
      }
      return role;
    });
    
    setRoles(updatedRoles);
    setIsEditModalOpen(false);
  };

  // Confirm delete
  const handleDeleteConfirm = () => {
    if (!currentRole) return;
    
    const filteredRoles = roles.filter(role => role.id !== currentRole.id);
    setRoles(filteredRoles);
    setIsDeleteModalOpen(false);
  };

  // Group permissions by module
  const groupedPermissions = permissions.reduce((acc, permission) => {
    const module = permission.module;
    if (!acc[module]) {
      acc[module] = [];
    }
    acc[module].push(permission);
    return acc;
  }, {} as Record<string, Permission[]>);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Mock permissions data
        const mockPermissions: Permission[] = [
          {
            id: 1,
            name: "view_courses",
            description: "View all courses in the system",
            module: "Courses"
          },
          {
            id: 2,
            name: "create_courses",
            description: "Create new courses",
            module: "Courses"
          },
          {
            id: 3,
            name: "edit_courses",
            description: "Edit existing courses",
            module: "Courses"
          },
          {
            id: 4,
            name: "delete_courses",
            description: "Delete courses from the system",
            module: "Courses"
          },
          {
            id: 5,
            name: "view_jobs",
            description: "View all job listings",
            module: "Jobs"
          },
          {
            id: 6,
            name: "create_jobs",
            description: "Create new job listings",
            module: "Jobs"
          },
          {
            id: 7,
            name: "manage_users",
            description: "Manage user accounts",
            module: "Users"
          }
        ];

        // Mock roles data
        const mockRoles: Role[] = [
          {
            id: 1,
            name: "Administrator",
            description: "Full access to all system features and settings",
            permissions: [1, 2, 3, 4, 5, 6, 7],
            usersCount: 3,
            createdAt: "2023-01-15",
            updatedAt: "2023-06-22",
          },
          {
            id: 2,
            name: "Content Manager",
            description: "Can manage all content but not system settings",
            permissions: [1, 2, 3],
            usersCount: 8,
            createdAt: "2023-02-10",
            updatedAt: "2023-05-18",
          }
        ];
        
        setPermissions(mockPermissions);
        setRoles(mockRoles);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <>
      <PageMeta
        title="User Roles | Empedia Admin"
        description="Manage user roles in the Empedia platform"
      />
      <PageBreadcrumb pageTitle="User Roles" />
      
      <div className="mb-6 rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white/90">User Roles</h2>
            <p className="mt-2 text-gray-500 dark:text-gray-400">
              Manage all user roles and their capabilities.
            </p>
          </div>
          <Button variant="primary" onClick={handleAddRole}>Add New Role</Button>
        </div>
      </div>

      <RolesTable 
        roles={roles} 
        isLoading={isLoading} 
        onEdit={handleEditRole}
        onDelete={handleDeleteRole}
      />

      {/* Add Role Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Add New Role"
      >
        <form onSubmit={handleAddSubmit}>
          <Input
            label="Role Name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            placeholder="Enter role name"
            required
          />
          <Textarea
            label="Description"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            placeholder="Enter role description"
          />
          
          {/* Permissions Section */}
          <div className="mb-4">
            <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Permissions
            </label>
            <div className="mt-4 space-y-6 max-h-96 overflow-y-auto pr-4">
              {Object.entries(groupedPermissions).map(([module, modulePermissions]) => (
                <div key={module} className="space-y-3">
                  <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                    {module}
                  </h4>
                  <div className="space-y-3 ml-4">
                    {modulePermissions.map(permission => (
                      <Checkbox
                        key={permission.id}
                        label={permission.name}
                        checked={formData.selectedPermissions.includes(permission.id)}
                        onChange={() => handlePermissionChange(permission.id)}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6 flex justify-end space-x-3">
            <Button
              variant="outline"
              onClick={() => setIsAddModalOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              Add Role
            </Button>
          </div>
        </form>
      </Modal>

      {/* Edit Role Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Edit Role"
      >
        <form onSubmit={handleEditSubmit}>
          <Input
            label="Role Name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            placeholder="Enter role name"
            required
          />
          <Textarea
            label="Description"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            placeholder="Enter role description"
          />
          
          {/* Permissions Section */}
          <div className="mb-4">
            <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Permissions
            </label>
            <div className="mt-4 space-y-6 max-h-96 overflow-y-auto pr-4">
              {Object.entries(groupedPermissions).map(([module, modulePermissions]) => (
                <div key={module} className="space-y-3">
                  <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                    {module}
                  </h4>
                  <div className="space-y-3 ml-4">
                    {modulePermissions.map(permission => (
                      <Checkbox
                        key={permission.id}
                        label={permission.name}
                        checked={formData.selectedPermissions.includes(permission.id)}
                        onChange={() => handlePermissionChange(permission.id)}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6 flex justify-end space-x-3">
            <Button
              variant="outline"
              onClick={() => setIsEditModalOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              Save Changes
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Role Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Delete Role"
      >
        <div className="mb-6">
          <p className="text-gray-700 dark:text-gray-300">
            Are you sure you want to delete the role "{currentRole?.name}"? This action cannot be undone.
          </p>
          {currentRole && currentRole.usersCount > 0 && (
            <div className="mt-4 rounded-md bg-warning-50 p-3 text-warning-700 dark:bg-warning-900/30 dark:text-warning-400">
              <p>Warning: This role is assigned to {currentRole.usersCount} users. Deleting it will affect these users.</p>
            </div>
          )}
        </div>
        <div className="flex justify-end space-x-3">
          <Button
            variant="outline"
            onClick={() => setIsDeleteModalOpen(false)}
          >
            Cancel
          </Button>
          <Button
            variant="outline"
            className="border-error-500 text-error-500 hover:bg-error-50 dark:border-error-400 dark:text-error-400 dark:hover:bg-error-900/20"
            onClick={handleDeleteConfirm}
          >
            Delete
          </Button>
        </div>
      </Modal>
    </>
  );
}
