"use client";

import { Package, Eye, RotateCcw } from "lucide-react";

const mockOrders = [
  {
    id: "ORD-001",
    date: "2024-01-15",
    status: "delivered",
    total: 299.99,
    items: 3,
  },
  {
    id: "ORD-002",
    date: "2024-01-10",
    status: "shipped",
    total: 149.99,
    items: 2,
  },
  {
    id: "ORD-003",
    date: "2024-01-05",
    status: "processing",
    total: 89.99,
    items: 1,
  },
];

const getStatusBadge = (status: string) => {
  const statusClasses = {
    delivered: "badge-success",
    shipped: "badge-info",
    processing: "badge-warning",
    cancelled: "badge-error",
  };

  return (
    <span
      className={`badge ${statusClasses[status as keyof typeof statusClasses]}`}
    >
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
};

export const OrderHistory = () => {
  return (
    <div className="card bg-base-100 shadow-lg">
      <div className="card-body">
        <h2 className="card-title mb-6">Order History</h2>

        <div className="space-y-4">
          {mockOrders.map((order) => (
            <div
              key={order.id}
              className="border border-base-300 rounded-lg p-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Package className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold">{order.id}</h3>
                    <p className="text-sm text-base-content/70">
                      {new Date(order.date).toLocaleDateString()} •{" "}
                      {order.items} items
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  {getStatusBadge(order.status)}
                  <div className="text-right">
                    <p className="font-semibold">${order.total}</p>
                  </div>
                </div>
              </div>

              <div className="flex gap-2 mt-4">
                <button className="btn btn-outline btn-sm">
                  <Eye className="w-4 h-4" />
                  View Details
                </button>
                {order.status === "delivered" && (
                  <button className="btn btn-outline btn-sm">
                    <RotateCcw className="w-4 h-4" />
                    Reorder
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {mockOrders.length === 0 && (
          <div className="text-center py-8">
            <Package className="w-16 h-16 mx-auto text-base-content/30 mb-4" />
            <h3 className="text-lg font-semibold mb-2">No orders yet</h3>
            <p className="text-base-content/70">
              When you place your first order, it will appear here.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
