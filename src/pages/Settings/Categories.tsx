import React, { useState, useEffect } from "react";
import PageMeta from "../../components/common/PageMeta";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import { Table, TableHeader, TableBody, TableRow, TableCell } from "../../components/ui/table";
import Badge from "../../components/ui/badge/Badge";
import Button from "../../components/ui/button/Button";
import Modal from "../../components/ui/modal/Modal";

// Define the areas where categories can be applied
type ApplicableArea = "Courses" | "Jobs" | "Internships" | "Mentors";

interface Category {
  id: number;
  name: string;
  description: string;
  applicableTo: ApplicableArea[];
  itemsCount: number;
  status: "Active" | "Inactive";
  createdAt: string;
}

interface CategoriesTableProps {
  categories: Category[];
  isLoading: boolean;
  onEdit: (category: Category) => void;
  onDelete: (categoryId: number) => void;
}

const CategoriesTable: React.FC<CategoriesTableProps> = ({ 
  categories, 
  isLoading, 
  onEdit, 
  onDelete 
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(categories.length / 10); // 10 items per page

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
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
                  Name
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  Description
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  Applicable To
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  Items Count
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
            <TableBody>
              {categories.map((category) => (
                <TableRow
                  key={category.id}
                  className="border-b border-gray-100 dark:border-white/[0.05] hover:bg-gray-50 dark:hover:bg-white/[0.02]"
                >
                  <TableCell className="px-4 py-3 text-gray-800 text-start text-theme-sm dark:text-white/90">
                    {category.name}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                    {category.description}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                    <div className="flex flex-wrap gap-1">
                      {category.applicableTo.map((area, index) => (
                        <Badge key={index} size="sm" color={
                          area === "Courses" ? "primary" :
                          area === "Jobs" ? "success" :
                          area === "Internships" ? "warning" :
                          "info"
                        }>
                          {area}
                        </Badge>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                    {category.itemsCount}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                    <Badge
                      size="sm"
                      color={category.status === "Active" ? "success" : "error"}
                    >
                      {category.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                    {category.createdAt}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => onEdit(category)}
                      >
                        Edit
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => onDelete(category.id)}
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

export default function Categories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [currentCategory, setCurrentCategory] = useState<Category | null>(null);
  const [categoryToDelete, setCategoryToDelete] = useState<number | null>(null);
  
  // Form state
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    applicableTo: [] as ApplicableArea[],
    status: "Active" as "Active" | "Inactive"
  });

  useEffect(() => {
    // Simulate API call
    const fetchCategories = async () => {
      setIsLoading(true);
      try {
        // Mock data
        const mockCategories: Category[] = [
          {
            id: 1,
            name: "Web Development",
            description: "Web development technologies and frameworks",
            applicableTo: ["Courses", "Jobs", "Internships"],
            itemsCount: 42,
            status: "Active",
            createdAt: "2023-05-15"
          },
          {
            id: 2,
            name: "Data Science",
            description: "Data analysis, machine learning, and AI",
            applicableTo: ["Courses", "Jobs", "Mentors"],
            itemsCount: 38,
            status: "Active",
            createdAt: "2023-06-02"
          },
          {
            id: 3,
            name: "Mobile Development",
            description: "iOS, Android, and cross-platform development",
            applicableTo: ["Courses", "Jobs", "Internships", "Mentors"],
            itemsCount: 27,
            status: "Active",
            createdAt: "2023-06-10"
          },
          {
            id: 4,
            name: "UI/UX Design",
            description: "User interface and experience design",
            applicableTo: ["Courses", "Jobs", "Mentors"],
            itemsCount: 19,
            status: "Active",
            createdAt: "2023-07-05"
          },
          {
            id: 5,
            name: "DevOps",
            description: "Development operations and infrastructure",
            applicableTo: ["Jobs", "Internships"],
            itemsCount: 15,
            status: "Active",
            createdAt: "2023-07-22"
          },
          {
            id: 6,
            name: "Cybersecurity",
            description: "Network and application security",
            applicableTo: ["Courses", "Jobs", "Mentors"],
            itemsCount: 23,
            status: "Active",
            createdAt: "2023-08-03"
          },
          {
            id: 7,
            name: "Blockchain",
            description: "Blockchain technology and cryptocurrency",
            applicableTo: ["Courses", "Jobs"],
            itemsCount: 8,
            status: "Inactive",
            createdAt: "2023-08-15"
          }
        ];
        
        // Simulate network delay
        setTimeout(() => {
          setCategories(mockCategories);
          setIsLoading(false);
        }, 1000);
      } catch (error) {
        console.error("Error fetching categories:", error);
        setIsLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const handleAddCategory = () => {
    setFormData({
      name: "",
      description: "",
      applicableTo: [],
      status: "Active"
    });
    setIsAddModalOpen(true);
  };

  const handleEditCategory = (category: Category) => {
    setCurrentCategory(category);
    setFormData({
      name: category.name,
      description: category.description,
      applicableTo: [...category.applicableTo],
      status: category.status
    });
    setIsEditModalOpen(true);
  };

  const handleDeleteCategory = (categoryId: number) => {
    setCategoryToDelete(categoryId);
    setIsDeleteModalOpen(true);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleCheckboxChange = (area: ApplicableArea) => {
    setFormData(prev => {
      if (prev.applicableTo.includes(area)) {
        return {
          ...prev,
          applicableTo: prev.applicableTo.filter(a => a !== area)
        };
      } else {
        return {
          ...prev,
          applicableTo: [...prev.applicableTo, area]
        };
      }
    });
  };

  const handleSubmitAdd = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, you would send this to your API
    const newCategory: Category = {
      id: Math.max(...categories.map(c => c.id)) + 1,
      name: formData.name,
      description: formData.description,
      applicableTo: formData.applicableTo,
      itemsCount: 0,
      status: formData.status,
      createdAt: new Date().toISOString().split('T')[0]
    };
    
    setCategories([...categories, newCategory]);
    setIsAddModalOpen(false);
  };

  const handleSubmitEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentCategory) return;
    
    // In a real app, you would send this to your API
    const updatedCategories = categories.map(category => {
      if (category.id === currentCategory.id) {
        return {
          ...category,
          name: formData.name,
          description: formData.description,
          applicableTo: formData.applicableTo,
          status: formData.status
        };
      }
      return category;
    });
    
    setCategories(updatedCategories);
    setIsEditModalOpen(false);
  };

  const handleConfirmDelete = () => {
    if (categoryToDelete === null) return;
    
    // In a real app, you would send this to your API
    const updatedCategories = categories.filter(
      category => category.id !== categoryToDelete
    );
    
    setCategories(updatedCategories);
    setIsDeleteModalOpen(false);
    setCategoryToDelete(null);
  };

  return (
    <>
      <PageMeta
        title="Categories | Empedia Admin"
        description="Manage categories in the Empedia platform"
      />
      <PageBreadcrumb pageTitle="Categories" />
      
      <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03] mb-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white/90">Categories</h2>
            <p className="mt-2 text-gray-500 dark:text-gray-400">
              Manage all categories for courses, jobs, internships, and mentors.
            </p>
          </div>
          <Button variant="primary" onClick={handleAddCategory}>Add New Category</Button>
        </div>
      </div>

      <CategoriesTable 
        categories={categories} 
        isLoading={isLoading} 
        onEdit={handleEditCategory}
        onDelete={handleDeleteCategory}
      />

      {/* Add Category Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Add New Category"
        size="lg"
      >
        <form onSubmit={handleSubmitAdd}>
          <div className="space-y-4">
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
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={3}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Applicable To
              </label>
              <div className="space-y-2">
                {(["Courses", "Jobs", "Internships", "Mentors"] as ApplicableArea[]).map((area) => (
                  <div key={area} className="flex items-center">
                    <input
                      type="checkbox"
                      id={`area-${area}`}
                      checked={formData.applicableTo.includes(area)}
                      onChange={() => handleCheckboxChange(area)}
                      className="h-4 w-4 rounded border-gray-300 text-brand-600 focus:ring-brand-500 dark:border-gray-600 dark:bg-gray-700"
                    />
                    <label htmlFor={`area-${area}`} className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                      {area}
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
                <option value="Inactive">Inactive</option>
              </select>
            </div>
          </div>
          
          <div className="mt-6 flex justify-end space-x-3">
            <Button variant="outline" onClick={() => setIsAddModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              Add Category
            </Button>
          </div>
        </form>
      </Modal>

      {/* Edit Category Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Edit Category"
        size="lg"
      >
        <form onSubmit={handleSubmitEdit}>
          <div className="space-y-4">
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
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={3}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Applicable To
              </label>
              <div className="space-y-2">
                {(["Courses", "Jobs", "Internships", "Mentors"] as ApplicableArea[]).map((area) => (
                  <div key={area} className="flex items-center">
                    <input
                      type="checkbox"
                      id={`edit-area-${area}`}
                      checked={formData.applicableTo.includes(area)}
                      onChange={() => handleCheckboxChange(area)}
                      className="h-4 w-4 rounded border-gray-300 text-brand-600 focus:ring-brand-500 dark:border-gray-600 dark:bg-gray-700"
                    />
                    <label htmlFor={`edit-area-${area}`} className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                      {area}
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
                <option value="Inactive">Inactive</option>
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
        title="Delete Category"
        size="sm"
      >
        <div className="space-y-4">
          <p className="text-gray-700 dark:text-gray-300">
            Are you sure you want to delete this category? This action cannot be undone.
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