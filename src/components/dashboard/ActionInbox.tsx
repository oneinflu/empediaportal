import  { useState, useEffect } from "react";
import { BoxIcon, FolderIcon, AlertIcon, TimeIcon } from "../../icons";
import Badge from "../ui/badge/Badge";

type ActionItem = {
  id: string;
  type: "flag" | "payout" | "dispute" | "approval";
  title: string;
  source: string;
  timestamp: string;
  priority: "high" | "medium" | "low";
};

const ActionInbox = () => {
  const [items, setItems] = useState<ActionItem[]>([
    {
      id: "1",
      type: "flag",
      title: "Inappropriate content in job posting",
      source: "Jobs/Senior Developer",
      timestamp: "2 hours ago",
      priority: "high",
    },
    {
      id: "2",
      type: "payout",
      title: "KYC verification pending",
      source: "Mentors/John Smith",
      timestamp: "1 day ago",
      priority: "medium",
    },
   
  ]);

  useEffect(() => {
    // Example of API response structure for action inbox
    const actionInboxApiResponse = {
      status: "success",
      data: {
        items: [
          {
            id: "1",
            type: "flag", // flag, payout, dispute, approval
            title: "Inappropriate content in job posting",
            source: "Jobs/Senior Developer",
            timestamp: "2023-06-15T14:30:00Z", // ISO format timestamp
            timestampFormatted: "2 hours ago", // Pre-formatted for display
            priority: "high", // high, medium, low
            actions: ["resolve", "snooze", "escalate"]
          },
        
        ],
        pagination: {
          total: 15,
          page: 1,
          limit: 5,
          hasMore: true
        }
      }
    };

    console.log("ActionInbox API Response:", actionInboxApiResponse);
  }, []);

  const handleAction = (id: string, action: string) => {
    console.log(`Action ${action} on item ${id}`);
    // In a real implementation, this would handle the action and update the state
    if (action === "snooze") {
      setItems(items.filter(item => item.id !== id));
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "flag":
        return <AlertIcon className="text-error-500 size-5" />;
      case "payout":
        return <BoxIcon className="text-warning-500 size-5" />;
      case "dispute":
        return <FolderIcon className="text-brand-500 size-5" />;
      case "approval":
        return <TimeIcon className="text-info-500 size-5" />;
      default:
        return <AlertIcon className="text-gray-500 size-5" />;
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "high":
        return <Badge color="error" size="sm">High</Badge>;
      case "medium":
        return <Badge color="warning" size="sm">Medium</Badge>;
      case "low":
        return <Badge color="info" size="sm">Low</Badge>;
      default:
        return null;
    }
  };

  return (
    <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
      <div className="border-b border-gray-200 p-5 dark:border-gray-800 md:p-6">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
          Action Inbox
        </h3>
        <p className="mt-1 text-gray-500 text-theme-sm dark:text-gray-400">
          Pending items requiring attention
        </p>
      </div>

      <div className="divide-y divide-gray-200 dark:divide-gray-800">
        {items.map((item) => (
          <div key={item.id} className="flex items-center justify-between p-5 hover:bg-gray-50 dark:hover:bg-white/[0.02] md:p-6">
            <div className="flex items-center space-x-4">
              <div className="flex-shrink-0">
                {getTypeIcon(item.type)}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="font-medium text-gray-800 dark:text-white/90">
                    {item.title}
                  </h4>
                  {getPriorityBadge(item.priority)}
                </div>
                <div className="mt-1 flex items-center text-sm text-gray-500 dark:text-gray-400">
                  <span>{item.source}</span>
                  <span className="mx-2">•</span>
                  <span>{item.timestamp}</span>
                </div>
              </div>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => handleAction(item.id, "review")}
                className="rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-white/[0.05] dark:text-white/80 dark:hover:bg-white/[0.08]"
              >
                Review
              </button>
              <button
                onClick={() => handleAction(item.id, "snooze")}
                className="rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-white/[0.05] dark:text-white/80 dark:hover:bg-white/[0.08]"
              >
                Snooze
              </button>
              <button
                onClick={() => handleAction(item.id, "assign")}
                className="rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-white/[0.05] dark:text-white/80 dark:hover:bg-white/[0.08]"
              >
                Assign
              </button>
            </div>
          </div>
        ))}
      </div>

      {items.length === 0 && (
        <div className="p-6 text-center text-gray-500 dark:text-gray-400">
          No pending items requiring attention
        </div>
      )}
    </div>
  );
};

export default ActionInbox;