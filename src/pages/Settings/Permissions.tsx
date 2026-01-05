import React, { useState, useEffect } from "react";
import PageMeta from "../../components/common/PageMeta";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import { Table, TableHeader, TableBody, TableRow, TableCell } from "../../components/ui/table";
import Badge from "../../components/ui/badge/Badge";
import Button from "../../components/ui/button/Button";

// Interfaces
interface Permission {
  id: number;
  name: string;
  description: string;
  module: string;
  assignedRoles: string[];
  createdAt: string;
  updatedAt: string;
}

interface PermissionsTableProps {
  permissions: Permission[];
  isLoading: boolean;
  onEdit: (permission: Permission) => void;
  onDelete: (permissionId: number) => void;
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
      <div className="relative w-full max-w-md rounded-lg bg-white p-6 shadow-lg dark:bg-gray-800">
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

const PermissionsTable: React.FC<PermissionsTableProps> = ({ permissions, isLoading, onEdit, onDelete }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(permissions.length / 10); // 10 items per page

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
                  Permission Name
                </TableCell>
                <TableCell isHeader className="px-5 py-3 text-start text-theme-xs font-medium text-gray-500 dark:text-gray-400">
                  Description
                </TableCell>
                <TableCell isHeader className="px-5 py-3 text-start text-theme-xs font-medium text-gray-500 dark:text-gray-400">
                  Module
                </TableCell>
                <TableCell isHeader className="px-5 py-3 text-start text-theme-xs font-medium text-gray-500 dark:text-gray-400">
                  Assigned Roles
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
              {permissions.map((permission) => (
                <TableRow
                  key={permission.id}
                  className="border-b border-gray-100 hover:bg-gray-50 dark:border-white/[0.05] dark:hover:bg-white/[0.02]"
                >
                  <TableCell className="px-4 py-3 text-start text-theme-sm text-gray-800 dark:text-white/90">
                    {permission.name}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-start text-theme-sm text-gray-500 dark:text-gray-400">
                    {permission.description}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-start text-theme-sm text-gray-500 dark:text-gray-400">
                    <Badge size="sm" color="info">
                      {permission.module}
                    </Badge>
                  </TableCell>
                  <TableCell className="px-4 py-3 text-start text-theme-sm text-gray-500 dark:text-gray-400">
                    <div className="flex flex-wrap gap-1">
                      {permission.assignedRoles.map((role, index) => (
                        <Badge key={index} size="sm" color="light">
                          {role}
                        </Badge>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell className="px-4 py-3 text-start text-theme-sm text-gray-500 dark:text-gray-400">
                    {permission.createdAt}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-start text-theme-sm text-gray-500 dark:text-gray-400">
                    {permission.updatedAt}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-start text-theme-sm text-gray-500 dark:text-gray-400">
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" onClick={() => onEdit(permission)}>
                        Edit
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-error-500 text-error-500 hover:bg-error-50 dark:border-error-400 dark:text-error-400 dark:hover:bg-error-900/20"
                        onClick={() => onDelete(permission.id)}
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

const AVAILABLE_MODULES = ["Courses", "Jobs", "Users", "Settings", "Reports"];

export default function Permissions() {
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Modal states
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  
  // Form states
  const [currentPermission, setCurrentPermission] = useState<Permission | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    module: AVAILABLE_MODULES[0]
  });

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  // Open add modal
  const handleAddPermission = () => {
    setFormData({
      name: "",
      description: "",
      module: AVAILABLE_MODULES[0]
    });
    setIsAddModalOpen(true);
  };

  // Open edit modal
  const handleEditPermission = (permission: Permission) => {
    setCurrentPermission(permission);
    setFormData({
      name: permission.name,
      description: permission.description,
      module: permission.module
    });
    setIsEditModalOpen(true);
  };

  // Open delete modal
  const handleDeletePermission = (permissionId: number) => {
    const permissionToDelete = permissions.find(permission => permission.id === permissionId);
    if (permissionToDelete) {
      setCurrentPermission(permissionToDelete);
      setIsDeleteModalOpen(true);
    }
  };

  // Submit add form
  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newPermission: Permission = {
      id: Math.max(0, ...permissions.map(p => p.id)) + 1,
      name: formData.name,
      description: formData.description,
      module: formData.module,
      assignedRoles: [],
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0],
    };
    
    setPermissions([...permissions, newPermission]);
    setIsAddModalOpen(false);
  };

  // Submit edit form
  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!currentPermission) return;
    
    const updatedPermissions = permissions.map(permission => {
      if (permission.id === currentPermission.id) {
        return {
          ...permission,
          name: formData.name,
          description: formData.description,
          module: formData.module,
          updatedAt: new Date().toISOString().split('T')[0],
        };
      }
      return permission;
    });
    
    setPermissions(updatedPermissions);
    setIsEditModalOpen(false);
  };

  // Confirm delete
  const handleDeleteConfirm = () => {
    if (!currentPermission) return;
    
    const filteredPermissions = permissions.filter(permission => permission.id !== currentPermission.id);
    setPermissions(filteredPermissions);
    setIsDeleteModalOpen(false);
  };

  useEffect(() => {
    const fetchPermissions = async () => {
      setIsLoading(true);
      try {
        // Mock data
        const mockPermissions: Permission[] = [
          {
            id: 1,
            name: "view_courses",
            description: "View all courses in the system",
            module: "Courses",
            assignedRoles: ["Administrator", "Content Manager", "Course Creator", "Viewer"],
            createdAt: "2023-01-15",
            updatedAt: "2023-09-22"
          },
          // ... other permissions
        ];
        
        setTimeout(() => {
          setPermissions(mockPermissions);
          setIsLoading(false);
        }, 1000);
      } catch (error) {
        console.error("Error fetching permissions:", error);
        setIsLoading(false);
      }
    };

    fetchPermissions();
  }, []);

  return (
    <>
      <PageMeta
        title="Permissions | Empedia Admin"
        description="Manage permissions in the Empedia platform"
      />
      <PageBreadcrumb pageTitle="Permissions" />
      
      <div className="mb-6 rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white/90">Permissions</h2>
            <p className="mt-2 text-gray-500 dark:text-gray-400">
              Configure detailed permissions for each role.
            </p>
          </div>
          <Button variant="primary" onClick={handleAddPermission}>Add New Permission</Button>
        </div>
      </div>

      <PermissionsTable 
        permissions={permissions} 
        isLoading={isLoading}
        onEdit={handleEditPermission}
        onDelete={handleDeletePermission}
      />

      {/* Add Permission Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Add New Permission"
      >
        <form onSubmit={handleAddSubmit}>
          <Input
            label="Permission Name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            placeholder="Enter permission name"
            required
          />
          <Textarea
            label="Description"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            placeholder="Enter permission description"
            required
          />
          <div className="mb-4">
            <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Module
            </label>
            <select
              name="module"
              value={formData.module}
              onChange={handleInputChange}
              className="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            >
              {AVAILABLE_MODULES.map(module => (
                <option key={module} value={module}>
                  {module}
                </option>
              ))}
            </select>
          </div>
          <div className="mt-6 flex justify-end space-x-3">
            <Button
              variant="outline"
              onClick={() => setIsAddModalOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              Add Permission
            </Button>
          </div>
        </form>
      </Modal>

      {/* Edit Permission Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Edit Permission"
      >
        <form onSubmit={handleEditSubmit}>
          <Input
            label="Permission Name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            placeholder="Enter permission name"
            required
          />
          <Textarea
            label="Description"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            placeholder="Enter permission description"
            required
          />
          <div className="mb-4">
            <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Module
            </label>
            <select
              name="module"
              value={formData.module}
              onChange={handleInputChange}
              className="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            >
              {AVAILABLE_MODULES.map(module => (
                <option key={module} value={module}>
                  {module}
                </option>
              ))}
            </select>
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

      {/* Delete Permission Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Delete Permission"
      >
        <div className="mb-6">
          <p className="text-gray-700 dark:text-gray-300">
            Are you sure you want to delete the permission "{currentPermission?.name}"? This action cannot be undone.
          </p>
          {currentPermission && currentPermission.assignedRoles.length > 0 && (
            <div className="mt-4 rounded-md bg-warning-50 p-3 text-warning-700 dark:bg-warning-900/30 dark:text-warning-400">
              <p>Warning: This permission is assigned to {currentPermission.assignedRoles.length} roles. Deleting it will affect these roles.</p>
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
