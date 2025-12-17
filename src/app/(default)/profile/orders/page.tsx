"use client";
import React, { useState, useEffect } from "react";
import ProfileSidebar from "@/components/layout/UserProfileSidebar";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import Card from "@/components/atoms/Card";
import Heading from "@/components/atoms/Heading";
import Button from "@/components/atoms/Button";
import { ShoppingBag, Package, Truck, CheckCircle, XCircle, Calendar, MapPin } from "lucide-react";
import { IoIosMore } from "react-icons/io";
import { RxCross2 } from "react-icons/rx";
import { getMyOrders, cancelOrder } from "@/store/api/store";

interface OrderItem {
  productId: string;
  productName: string;
  quantity: number;
  price: number;
  productType: string;
  images?: string[];
}

interface Order {
  id: string;
  orderNumber: string;
  orderType: string;
  orderStatus: string;
  paymentStatus: string;
  totalAmount: number;
  items: OrderItem[];
  createdAt: string;
  deliveredAt?: string | null;
  deliveryAddress?: any;
}

type FilterStatus = "all" | "pending" | "confirmed" | "processing" | "shipped" | "delivered" | "cancelled";

export default function OrdersPage() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<FilterStatus>("all");
  const [cancellingOrderId, setCancellingOrderId] = useState<string | null>(null);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [cancellationReason, setCancellationReason] = useState("");

  useEffect(() => {
    fetchOrders();
  }, [filterStatus]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const params: any = {};
      if (filterStatus !== "all") {
        params.orderStatus = filterStatus;
      }

      const response = await getMyOrders(params);
      setOrders(response.orders || []);
    } catch (err: any) {
      console.error("Failed to fetch orders:", err);
      setError(err?.message || "Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  const handleCancelOrder = async () => {
    if (!selectedOrder) return;

    try {
      setCancellingOrderId(selectedOrder.id);
      await cancelOrder(selectedOrder.orderNumber, cancellationReason);
      
      // Refresh orders
      await fetchOrders();
      
      setShowCancelModal(false);
      setSelectedOrder(null);
      setCancellationReason("");
    } catch (err: any) {
      console.error("Failed to cancel order:", err);
      alert(err?.message || "Failed to cancel order");
    } finally {
      setCancellingOrderId(null);
    }
  };

  const openCancelModal = (order: Order) => {
    setSelectedOrder(order);
    setShowCancelModal(true);
  };

  const closeCancelModal = () => {
    setShowCancelModal(false);
    setSelectedOrder(null);
    setCancellationReason("");
  };

  const handleLogout = async () => {
    await logout();
    router.push("/");
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "confirmed":
        return "bg-blue-100 text-blue-800";
      case "processing":
        return "bg-purple-100 text-purple-800";
      case "packed":
        return "bg-indigo-100 text-indigo-800";
      case "shipped":
        return "bg-cyan-100 text-cyan-800";
      case "out_for_delivery":
        return "bg-teal-100 text-teal-800";
      case "delivered":
        return "bg-green-100 text-green-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
      case "confirmed":
        return <Package className="w-4 h-4" />;
      case "processing":
      case "packed":
        return <Package className="w-4 h-4" />;
      case "shipped":
      case "out_for_delivery":
        return <Truck className="w-4 h-4" />;
      case "delivered":
        return <CheckCircle className="w-4 h-4" />;
      case "cancelled":
        return <XCircle className="w-4 h-4" />;
      default:
        return <Package className="w-4 h-4" />;
    }
  };

  const canCancelOrder = (order: Order) => {
    return !["shipped", "out_for_delivery", "delivered", "cancelled"].includes(order.orderStatus);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const filteredOrders = orders;

  return (
    <div className="min-h-screen py-6 sm:py-8 bg-gray-50 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Mobile header with menu button */}
        <div className="flex items-center justify-between mb-4 lg:hidden">
          <button
            type="button"
            onClick={() => setIsSidebarOpen(true)}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors"
            aria-label="Open menu"
          >
            <IoIosMore className="w-6 h-6 text-gray-800" />
          </button>
          <span className="w-6" aria-hidden="true" />
        </div>

        <div className="grid gap-6 lg:grid-cols-[300px_1fr] lg:gap-8 items-start">
          {/* Sidebar - Desktop view */}
          <div className="hidden lg:block">
            <ProfileSidebar
              userName={user?.fullName || "User"}
              userEmail={user?.email || "Not provided"}
              onLogout={handleLogout}
            />
          </div>

          {/* Main Content */}
          <div className="space-y-6">
            <Card padding="lg">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                <Heading level={2}>My Orders</Heading>
                <div className="flex items-center gap-2 overflow-x-auto">
                  {["all", "confirmed", "shipped", "delivered", "cancelled"].map((status) => (
                    <button
                      key={status}
                      onClick={() => setFilterStatus(status as FilterStatus)}
                      className={`px-4 py-2 rounded-lg font-medium text-sm whitespace-nowrap transition-colors ${
                        filterStatus === status
                          ? "bg-yellow-500 text-white"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      {status.charAt(0).toUpperCase() + status.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
                  {error}
                </div>
              )}

              {loading ? (
                <div className="text-center py-16">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500 mx-auto"></div>
                  <p className="text-gray-600 mt-4">Loading orders...</p>
                </div>
              ) : filteredOrders.length === 0 ? (
                <div className="text-center py-16">
                  <ShoppingBag className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                  <p className="text-gray-600 text-lg mb-2">No orders found</p>
                  <p className="text-gray-500 mb-6">
                    {filterStatus === "all"
                      ? "You haven't placed any orders yet"
                      : `No ${filterStatus} orders found`}
                  </p>
                  <Button
                    href="/store/products"
                    variant="custom"
                    size="md"
                    className="bg-yellow-500 text-white hover:bg-yellow-600"
                  >
                    Start Shopping
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredOrders.map((order) => (
                    <div
                      key={order.id}
                      className="border border-gray-200 rounded-lg p-4 sm:p-6 hover:shadow-md transition-shadow bg-white"
                    >
                      {/* Order Header */}
                      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-4 pb-4 border-b border-gray-200">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="text-lg font-bold text-gray-900">
                              Order #{order.orderNumber}
                            </h3>
                            <span
                              className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 ${getStatusColor(
                                order.orderStatus
                              )}`}
                            >
                              {getStatusIcon(order.orderStatus)}
                              {order.orderStatus.replace("_", " ").toUpperCase()}
                            </span>
                          </div>
                          <div className="flex items-center gap-4 text-sm text-gray-600">
                            <div className="flex items-center gap-1">
                              <Calendar className="w-4 h-4" />
                              {formatDate(order.createdAt)}
                            </div>
                            <div className="text-gray-400">|</div>
                            <div className="font-semibold text-gray-900">
                              ₹{parseFloat(order.totalAmount.toString()).toLocaleString()}
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            href={`/profile/orders/${order.orderNumber}`}
                            variant="ghost"
                            size="sm"
                            className="border border-gray-300 text-gray-700 hover:bg-gray-50"
                          >
                            View Details
                          </Button>
                          {canCancelOrder(order) && (
                            <button
                              onClick={() => openCancelModal(order)}
                              disabled={cancellingOrderId === order.id}
                              className="px-4 py-2 text-sm font-medium text-red-600 border border-red-300 rounded-lg hover:bg-red-50 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              {cancellingOrderId === order.id ? "Cancelling..." : "Cancel"}
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Order Items */}
                      <div className="space-y-3">
                        {order.items.slice(0, 2).map((item, index) => (
                          <div key={index} className="flex items-center gap-4">
                            {item.images && item.images.length > 0 ? (
                              <img
                                src={item.images[0]}
                                alt={item.productName}
                                className="w-16 h-16 rounded-lg object-cover border border-gray-200"
                              />
                            ) : (
                              <div className="w-16 h-16 rounded-lg bg-gray-100 flex items-center justify-center">
                                <Package className="w-8 h-8 text-gray-400" />
                              </div>
                            )}
                            <div className="flex-1">
                              <p className="font-medium text-gray-900 line-clamp-1">
                                {item.productName}
                              </p>
                              <p className="text-sm text-gray-600">
                                Qty: {item.quantity} × ₹{item.price.toLocaleString()}
                              </p>
                            </div>
                          </div>
                        ))}
                        {order.items.length > 2 && (
                          <p className="text-sm text-gray-600 italic">
                            +{order.items.length - 2} more item(s)
                          </p>
                        )}
                      </div>

                      {/* Delivery Address (for physical orders) */}
                      {order.deliveryAddress && (
                        <div className="mt-4 pt-4 border-t border-gray-200">
                          <div className="flex items-start gap-2 text-sm">
                            <MapPin className="w-4 h-4 text-gray-500 mt-0.5 flex-shrink-0" />
                            <div className="text-gray-600">
                              <span className="font-medium text-gray-900">
                                {order.deliveryAddress.fullName}
                              </span>
                              <br />
                              {order.deliveryAddress.addressLine1}
                              {order.deliveryAddress.addressLine2 && `, ${order.deliveryAddress.addressLine2}`}
                              <br />
                              {order.deliveryAddress.city}, {order.deliveryAddress.state},{" "}
                              {order.deliveryAddress.pincode}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </div>
        </div>
      </div>

      {/* Mobile sidebar overlay */}
      {isSidebarOpen && (
        <div className="fixed inset-0 z-40 flex lg:hidden">
          <div className="flex-1 bg-black/40" onClick={() => setIsSidebarOpen(false)} />
          <div className="w-80 max-w-full bg-transparent h-full flex flex-col">
            <div className="bg-white shadow-xl h-full p-4 border-l border-[#FFD700] flex flex-col transition-transform duration-300 transform translate-x-0">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold">Menu</h2>
                <button
                  type="button"
                  onClick={() => setIsSidebarOpen(false)}
                  className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                  aria-label="Close menu"
                >
                  <RxCross2 className="w-5 h-5 text-gray-700" />
                </button>
              </div>
              <div className="overflow-y-auto">
                <ProfileSidebar
                  userName={user?.fullName || "User"}
                  userEmail={user?.email || "Not provided"}
                  onLogout={handleLogout}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Cancel Order Modal */}
      {showCancelModal && selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Cancel Order</h2>
            <p className="text-gray-600 mb-4">
              Are you sure you want to cancel order #{selectedOrder.orderNumber}?
            </p>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Reason for cancellation (optional)
              </label>
              <textarea
                value={cancellationReason}
                onChange={(e) => setCancellationReason(e.target.value)}
                placeholder="Please tell us why you're cancelling..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
                rows={3}
              />
            </div>

            <p className="text-sm text-gray-500 mb-6">
              {selectedOrder.paymentStatus === "completed" 
                ? "The amount will be refunded to your wallet within 5-7 business days."
                : "Your order will be cancelled immediately."}
            </p>

            <div className="flex gap-3">
              <button
                onClick={closeCancelModal}
                disabled={cancellingOrderId === selectedOrder.id}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 disabled:opacity-50"
              >
                No, Keep Order
              </button>
              <button
                onClick={handleCancelOrder}
                disabled={cancellingOrderId === selectedOrder.id}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {cancellingOrderId === selectedOrder.id ? "Cancelling..." : "Yes, Cancel Order"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
