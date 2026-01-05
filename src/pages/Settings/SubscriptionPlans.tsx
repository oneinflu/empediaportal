import React, { useState, useEffect } from "react";
import PageMeta from "../../components/common/PageMeta";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import { Table, TableHeader, TableBody, TableRow, TableCell } from "../../components/ui/table";
import Badge from "../../components/ui/badge/Badge";
import Button from "../../components/ui/button/Button";
import Modal from "../../components/ui/modal/Modal";

interface SubscriptionPlan {
  id: number;
  name: string;
  description: string;
  price: number;
  billingCycle: "Monthly" | "Yearly" | "Quarterly";
  features: string[];
  subscribersCount: number;
  status: "Active" | "Inactive" | "Archived";
  createdAt: string;
  updatedAt: string;
}

interface SubscriptionPlansTableProps {
  plans: SubscriptionPlan[];
  isLoading?: boolean;
  onEdit: (plan: SubscriptionPlan) => void;
  onDelete: (planId: number) => void;
}

const getStatusColor = (status: string) => {
  switch (status) {
    case "Active":
      return "success";
    case "Inactive":
      return "warning";
    case "Archived":
      return "error";
    default:
      return "light";
  }
};

const SubscriptionPlansTable: React.FC<SubscriptionPlansTableProps> = ({ 
  plans,
  onEdit,
  onDelete
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(plans.length / 5); // 5 items per page

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // ... existing table JSX ...
  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
      <div className="max-w-full overflow-x-auto">
        <div className="min-w-[1000px]">
          <Table>
            {/* Table Header */}
            <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
              <TableRow>
                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                  Plan Name
                </TableCell>
                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                  Price
                </TableCell>
                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                  Billing Cycle
                </TableCell>
                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                  Features
                </TableCell>
                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                  Subscribers
                </TableCell>
                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                  Status
                </TableCell>
                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                  Actions
                </TableCell>
              </TableRow>
            </TableHeader>

            {/* Table Body */}
            <TableBody>
              {plans.map((plan) => (
                <TableRow key={plan.id} className="border-b border-gray-100 dark:border-white/[0.05] last:border-b-0">
                  <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                    <div className="flex flex-col">
                      <span className="font-medium text-gray-800 dark:text-white/90">
                        {plan.name}
                      </span>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {plan.description}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                    {plan.price === 0 ? "Free" : `$${plan.price}`}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                    {plan.billingCycle}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                    <div className="flex flex-wrap gap-1">
                      {plan.features.slice(0, 3).map((feature, index) => (
                        <Badge key={index} size="sm" color="light">
                          {feature}
                        </Badge>
                      ))}
                      {plan.features.length > 3 && (
                        <Badge size="sm" color="info">
                          +{plan.features.length - 3} more
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                    {plan.subscribersCount}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                    <Badge size="sm" color={getStatusColor(plan.status)}>
                      {plan.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" onClick={() => onEdit(plan)}>
                        Edit
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        className="border-error-500 text-error-500 hover:bg-error-50 dark:border-error-400 dark:text-error-400 dark:hover:bg-error-900/20"
                        onClick={() => onDelete(plan.id)}
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
              {[...Array(totalPages)].map((_, i) => (
                <Button
                  key={i}
                  variant={currentPage === i + 1 ? "primary" : "outline"}
                  onClick={() => handlePageChange(i + 1)}
                >
                  {i + 1}
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

export default function SubscriptionPlans() {
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [currentPlan, setCurrentPlan] = useState<SubscriptionPlan | null>(null);
  const [formData, setFormData] = useState<{
    name: string;
    description: string;
    price: string;
    billingCycle: SubscriptionPlan["billingCycle"];
    features: string[];
    status: SubscriptionPlan["status"];
    currentFeature: string;
  }>({
    name: "",
    description: "",
    price: "0",
    billingCycle: "Monthly",
    features: [],
    status: "Active",
    currentFeature: "",
  });

  useEffect(() => {
    // Simulate API call
    const fetchPlans = async () => {
      setIsLoading(true);
      try {
        // Mock data
        const mockPlans: SubscriptionPlan[] = [
          // ... existing mock plans ...
        ];
        
        setTimeout(() => {
          setPlans(mockPlans);
          setIsLoading(false);
        }, 1000);
      } catch (error) {
        console.error("Error fetching subscription plans:", error);
        setIsLoading(false);
      }
    };

    fetchPlans();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFeatureKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && formData.currentFeature.trim()) {
      e.preventDefault();
      setFormData(prev => ({
        ...prev,
        features: [...prev.features, prev.currentFeature.trim()],
        currentFeature: ''
      }));
    }
  };

  const handleRemoveFeature = (index: number) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index)
    }));
  };

  const handleAddPlan = () => {
    setFormData({
      name: "",
      description: "",
      price: "0",
      billingCycle: "Monthly",
      features: [],
      status: "Active",
      currentFeature: "",
    });
    setIsAddModalOpen(true);
  };

  const handleEditPlan = (plan: SubscriptionPlan) => {
    setCurrentPlan(plan);
    setFormData({
      name: plan.name,
      description: plan.description,
      price: plan.price.toString(),
      billingCycle: plan.billingCycle,
      features: [...plan.features],
      status: plan.status,
      currentFeature: "",
    });
    setIsEditModalOpen(true);
  };

  const handleDeletePlan = (planId: number) => {
    const plan = plans.find(p => p.id === planId);
    if (plan) {
      setCurrentPlan(plan);
      setIsDeleteModalOpen(true);
    }
  };

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newPlan: SubscriptionPlan = {
      id: plans.length + 1,
      name: formData.name,
      description: formData.description,
      price: parseFloat(formData.price),
      billingCycle: formData.billingCycle,
      features: formData.features,
      subscribersCount: 0,
      status: formData.status,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setPlans(prev => [...prev, newPlan]);
    setIsAddModalOpen(false);
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPlan) return;

    const updatedPlan: SubscriptionPlan = {
      ...currentPlan,
      name: formData.name,
      description: formData.description,
      price: parseFloat(formData.price),
      billingCycle: formData.billingCycle,
      features: formData.features,
      status: formData.status,
      updatedAt: new Date().toISOString(),
    };

    setPlans(prev => prev.map(plan => 
      plan.id === currentPlan.id ? updatedPlan : plan
    ));
    setIsEditModalOpen(false);
  };

  const handleDeleteConfirm = () => {
    if (!currentPlan) return;
    setPlans(prev => prev.filter(plan => plan.id !== currentPlan.id));
    setIsDeleteModalOpen(false);
  };

  const renderPlanForm = (isEdit: boolean) => (
    <form onSubmit={isEdit ? handleEditSubmit : handleAddSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Plan Name
        </label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleInputChange}
          className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 focus:border-primary-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300"
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
          className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 focus:border-primary-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300"
          rows={3}
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Price
          </label>
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleInputChange}
            min="0"
            step="0.01"
            className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 focus:border-primary-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Billing Cycle
          </label>
          <select
            name="billingCycle"
            value={formData.billingCycle}
            onChange={handleInputChange}
            className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 focus:border-primary-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300"
            required
          >
            <option value="Monthly">Monthly</option>
            <option value="Quarterly">Quarterly</option>
            <option value="Yearly">Yearly</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Features
        </label>
        <div className="space-y-2">
          <div className="flex gap-2">
            <input
              type="text"
              name="currentFeature"
              value={formData.currentFeature}
              onChange={handleInputChange}
              onKeyPress={handleFeatureKeyPress}
              placeholder="Type feature and press Enter"
              className="flex-1 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 focus:border-primary-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            {formData.features.map((feature, index) => (
              <Badge
                key={index}
                size="sm"
                color="light"
              >
                {feature}
                <button
                  type="button"
                  onClick={() => handleRemoveFeature(index)}
                  className="ml-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                >
                  ×
                </button>
              </Badge>
            ))}
          </div>
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
          className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 focus:border-primary-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300"
          required
        >
          <option value="Active">Active</option>
          <option value="Inactive">Inactive</option>
          <option value="Archived">Archived</option>
        </select>
      </div>

      <div className="mt-6 flex justify-end space-x-3">
        <Button
          variant="outline"
          onClick={() => isEdit ? setIsEditModalOpen(false) : setIsAddModalOpen(false)}
        >
          Cancel
        </Button>
        <Button type="submit" variant="primary">
          {isEdit ? "Save Changes" : "Add Plan"}
        </Button>
      </div>
    </form>
  );

  return (
    <>
      <PageMeta
        title="Subscription Plans | Empedia Admin"
        description="Manage subscription plans in the Empedia platform"
      />
      <PageBreadcrumb pageTitle="Subscription Plans" />
      
      <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03] mb-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white/90">
              Subscription Plans
            </h2>
            <p className="mt-2 text-gray-500 dark:text-gray-400">
              Configure and manage all subscription plans and pricing.
            </p>
          </div>
          <Button variant="primary" onClick={handleAddPlan}>
            Add New Plan
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      ) : (
        <SubscriptionPlansTable
          plans={plans}
          onEdit={handleEditPlan}
          onDelete={handleDeletePlan}
        />
      )}

      {/* Add Plan Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Add New Plan"
        size="lg"
      >
        {renderPlanForm(false)}
      </Modal>

      {/* Edit Plan Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Edit Plan"
        size="lg"
      >
        {renderPlanForm(true)}
      </Modal>

      {/* Delete Plan Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Delete Plan"
      >
        <div className="mb-6">
          <p className="text-gray-700 dark:text-gray-300">
            Are you sure you want to delete the plan "{currentPlan?.name}"? This action cannot be undone.
          </p>
          {currentPlan && currentPlan.subscribersCount > 0 && (
            <div className="mt-4 rounded-md bg-warning-50 p-3 text-warning-700 dark:bg-warning-900/30 dark:text-warning-400">
              <p>Warning: This plan has {currentPlan.subscribersCount} active subscribers. Deleting it will affect these subscribers.</p>
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
