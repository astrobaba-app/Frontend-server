"use client";
import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import ProfileSidebar from "@/components/layout/UserProfileSidebar";
import { useAuth } from "@/contexts/AuthContext";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import Heading from "@/components/atoms/Heading";
import { 
  Package, 
  Truck, 
  CheckCircle, 
  XCircle, 
  Calendar, 
  MapPin, 
  CreditCard,
  Download,
  ArrowLeft
} from "lucide-react";
import { IoIosMore } from "react-icons/io";
import { RxCross2 } from "react-icons/rx";
import { getOrderDetails, trackOrder, cancelOrder } from "@/store/api/store";

interface OrderItem {
  productId: string;
  productName: string;
  quantity: number;
  price: number;
  productType: string;
  images?: string[];
  digitalFileUrl?: string;
}

interface Order {
  id: string;
  orderNumber: string;
  orderType: string;
  orderStatus: string;
  paymentStatus: string;
  paymentMethod: string;
  totalAmount: number;
  subtotal: number;
  shippingCharges: number;
  taxAmount: number;
  items: OrderItem[];
  createdAt: string;
  confirmedAt?: string | null;
  shippedAt?: string | null;
  deliveredAt?: string | null;
  cancelledAt?: string | null;
  cancellationReason?: string | null;
  deliveryAddress?: any;
  trackingNumber?: string | null;
  courierName?: string | null;
  trackingUrl?: string | null;
  digitalDownloadLinks?: any[];
  customerNotes?: string | null;
}

export default function OrderDetailsPage() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const params = useParams();
  const orderNumber = params?.orderNumber as string;

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [order, setOrder] = useState<Order | null>(null);
  const [tracking, setTracking] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [cancellingOrder, setCancellingOrder] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancellationReason, setCancellationReason] = useState("");

  useEffect(() => {
    if (orderNumber) {
      fetchOrderDetails();
    }
  }, [orderNumber]);

  const fetchOrderDetails = async () => {
    try {
      setLoading(true);
      setError(null);

      const [orderResponse, trackingResponse] = await Promise.all([
        getOrderDetails(orderNumber),
        trackOrder(orderNumber).catch(() => null),
      ]);

      setOrder(orderResponse.order);
      if (trackingResponse) {
        setTracking(trackingResponse.tracking);
      }
    } catch (err: any) {
      console.error("Failed to fetch order details:", err);
      setError(err?.message || "Failed to load order details");
    } finally {
      setLoading(false);
    }
  };

  const handleCancelOrder = async () => {
    if (!order) return;

    try {
      setCancellingOrder(true);
      await cancelOrder(order.orderNumber, cancellationReason);

      // Refresh order details
      await fetchOrderDetails();

      setShowCancelModal(false);
      setCancellationReason("");
    } catch (err: any) {
      console.error("Failed to cancel order:", err);
      alert(err?.message || "Failed to cancel order");
    } finally {
      setCancellingOrder(false);
    }
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

  const canCancelOrder = (order: Order) => {
    return !["shipped", "out_for_delivery", "delivered", "cancelled"].includes(order.orderStatus);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen py-6 sm:py-8 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-16">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500 mx-auto"></div>
            <p className="text-gray-600 mt-4">Loading order details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen py-6 sm:py-8 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-16">
            <XCircle className="w-16 h-16 mx-auto mb-4 text-red-500" />
            <p className="text-gray-900 text-lg mb-2">Order not found</p>
            <p className="text-gray-600 mb-6">{error || "Unable to load order details"}</p>
            <Button href="/profile/orders" variant="custom" size="md" className="bg-yellow-500 text-white">
              Back to Orders
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-6 sm:py-8 bg-gray-50 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Mobile header */}
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
          {/* Sidebar - Desktop */}
          <div className="hidden lg:block">
            <ProfileSidebar
              userName={user?.fullName || "User"}
              userEmail={user?.email || "Not provided"}
              onLogout={handleLogout}
            />
          </div>

          {/* Main Content */}
          <div className="space-y-6">
            {/* Back Button */}
            <Button
              href="/profile/orders"
              variant="ghost"
              size="sm"
              className="flex items-center gap-2 text-gray-700 hover:text-gray-900"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Orders
            </Button>

            {/* Order Header */}
            <Card padding="lg">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
                <div>
                  <Heading level={2} className="mb-2">
                    Order #{order.orderNumber}
                  </Heading>
                  <div className="flex items-center gap-3 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {formatDate(order.createdAt)}
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(
                        order.orderStatus
                      )}`}
                    >
                      {order.orderStatus.replace("_", " ").toUpperCase()}
                    </span>
                  </div>
                </div>
                {canCancelOrder(order) && (
                  <button
                    onClick={() => setShowCancelModal(true)}
                    disabled={cancellingOrder}
                    className="px-4 py-2 text-sm font-medium text-red-600 border border-red-300 rounded-lg hover:bg-red-50 disabled:opacity-50"
                  >
                    Cancel Order
                  </button>
                )}
              </div>

              {/* Order Timeline */}
              {tracking && tracking.timeline && (
                <div className="mb-6 pb-6 border-b border-gray-200">
                  <h3 className="font-bold text-gray-900 mb-4">Order Timeline</h3>
                  <div className="space-y-4">
                    {tracking.timeline.map((step: any, index: number) => (
                      <div key={index} className="flex items-start gap-3">
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                            step.completed ? "bg-green-100 text-green-600" : "bg-gray-100 text-gray-400"
                          }`}
                        >
                          {step.completed ? <CheckCircle className="w-5 h-5" /> : <Package className="w-5 h-5" />}
                        </div>
                        <div className="flex-1">
                          <p
                            className={`font-medium ${
                              step.completed ? "text-gray-900" : "text-gray-500"
                            }`}
                          >
                            {step.label}
                          </p>
                          {step.timestamp && (
                            <p className="text-sm text-gray-600">{formatDate(step.timestamp)}</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Tracking Info */}
              {order.trackingNumber && (
                <div className="mb-6 pb-6 border-b border-gray-200">
                  <h3 className="font-bold text-gray-900 mb-3">Tracking Information</h3>
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Truck className="w-5 h-5 text-blue-600" />
                      <span className="font-medium text-gray-900">{order.courierName || "Courier"}</span>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">
                      Tracking Number: <span className="font-mono font-semibold">{order.trackingNumber}</span>
                    </p>
                    {order.trackingUrl && (
                      <a
                        href={order.trackingUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-blue-600 hover:text-blue-700 underline"
                      >
                        Track Package →
                      </a>
                    )}
                  </div>
                </div>
              )}

              {/* Order Items */}
              <div className="mb-6">
                <h3 className="font-bold text-gray-900 mb-4">Order Items</h3>
                <div className="space-y-4">
                  {order.items.map((item, index) => (
                    <div key={index} className="flex items-center gap-4 pb-4 border-b border-gray-200 last:border-0">
                      {item.images && item.images.length > 0 ? (
                        <img
                          src={item.images[0]}
                          alt={item.productName}
                          className="w-20 h-20 rounded-lg object-cover border border-gray-200"
                        />
                      ) : (
                        <div className="w-20 h-20 rounded-lg bg-gray-100 flex items-center justify-center">
                          <Package className="w-10 h-10 text-gray-400" />
                        </div>
                      )}
                      <div className="flex-1">
                        <p className="font-semibold text-gray-900">{item.productName}</p>
                        <p className="text-sm text-gray-600">
                          Qty: {item.quantity} × ₹{item.price.toLocaleString()}
                        </p>
                        <p className="text-sm text-gray-500 capitalize">{item.productType}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-gray-900">
                          ₹{(item.price * item.quantity).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Digital Downloads */}
              {order.digitalDownloadLinks && order.digitalDownloadLinks.length > 0 && (
                <div className="mb-6 pb-6 border-b border-gray-200">
                  <h3 className="font-bold text-gray-900 mb-3">Digital Downloads</h3>
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <p className="text-sm text-gray-700 mb-3">
                      Your digital products are ready to download:
                    </p>
                    <div className="space-y-2">
                      {order.digitalDownloadLinks.map((link: any, index: number) => (
                        <a
                          key={index}
                          href={link.downloadUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700"
                        >
                          <Download className="w-4 h-4" />
                          {link.productName}
                        </a>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Price Breakdown */}
              <div className="mb-6 pb-6 border-b border-gray-200">
                <h3 className="font-bold text-gray-900 mb-3">Price Details</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal</span>
                    <span>₹{parseFloat(order.subtotal.toString()).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Shipping Charges</span>
                    <span className={order.shippingCharges === 0 ? "text-green-600 font-semibold" : ""}>
                      {order.shippingCharges === 0 ? "FREE" : `₹${order.shippingCharges}`}
                    </span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Tax (18% GST)</span>
                    <span>₹{parseFloat(order.taxAmount.toString()).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-lg font-bold text-gray-900 pt-2 border-t border-gray-200">
                    <span>Total Amount</span>
                    <span>₹{parseFloat(order.totalAmount.toString()).toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {/* Payment Info */}
              <div className="mb-6 pb-6 border-b border-gray-200">
                <h3 className="font-bold text-gray-900 mb-3">Payment Information</h3>
                <div className="flex items-center gap-2 text-sm">
                  <CreditCard className="w-4 h-4 text-gray-500" />
                  <span className="text-gray-600">Payment Method:</span>
                  <span className="font-semibold text-gray-900 capitalize">
                    {order.paymentMethod === "razorpay" ? "Online Payment" : order.paymentMethod}
                  </span>
                  <span
                    className={`ml-2 px-2 py-1 rounded text-xs font-semibold ${
                      order.paymentStatus === "completed"
                        ? "bg-green-100 text-green-800"
                        : order.paymentStatus === "failed"
                        ? "bg-red-100 text-red-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {order.paymentStatus.toUpperCase()}
                  </span>
                </div>
              </div>

              {/* Delivery Address */}
              {order.deliveryAddress && (
                <div>
                  <h3 className="font-bold text-gray-900 mb-3">Delivery Address</h3>
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                    <div className="flex items-start gap-2">
                      <MapPin className="w-5 h-5 text-gray-500 mt-0.5 flex-shrink-0" />
                      <div className="text-sm text-gray-700">
                        <p className="font-semibold text-gray-900 mb-1">
                          {order.deliveryAddress.fullName}
                        </p>
                        <p>{order.deliveryAddress.addressLine1}</p>
                        {order.deliveryAddress.addressLine2 && <p>{order.deliveryAddress.addressLine2}</p>}
                        <p>
                          {order.deliveryAddress.city}, {order.deliveryAddress.state},{" "}
                          {order.deliveryAddress.pincode}
                        </p>
                        <p>{order.deliveryAddress.country}</p>
                        <p className="mt-2 text-gray-600">Phone: {order.deliveryAddress.phone}</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Cancellation Info */}
              {order.orderStatus === "cancelled" && (
                <div className="mt-6">
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <div className="flex items-start gap-2">
                      <XCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="font-semibold text-red-900 mb-1">Order Cancelled</p>
                        {order.cancelledAt && (
                          <p className="text-sm text-red-700 mb-2">
                            Cancelled on {formatDate(order.cancelledAt)}
                          </p>
                        )}
                        {order.cancellationReason && (
                          <p className="text-sm text-red-700">Reason: {order.cancellationReason}</p>
                        )}
                      </div>
                    </div>
                  </div>
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
            <div className="bg-white shadow-xl h-full p-4 border-l border-[#FFD700] flex flex-col">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold">Menu</h2>
                <button
                  type="button"
                  onClick={() => setIsSidebarOpen(false)}
                  className="p-2 rounded-full hover:bg-gray-100 transition-colors"
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
      {showCancelModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Cancel Order</h2>
            <p className="text-gray-600 mb-4">
              Are you sure you want to cancel order #{order.orderNumber}?
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
              {order.paymentStatus === "completed"
                ? "The amount will be refunded to your wallet within 5-7 business days."
                : "Your order will be cancelled immediately."}
            </p>

            <div className="flex gap-3">
              <button
                onClick={() => setShowCancelModal(false)}
                disabled={cancellingOrder}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 disabled:opacity-50"
              >
                No, Keep Order
              </button>
              <button
                onClick={handleCancelOrder}
                disabled={cancellingOrder}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 disabled:opacity-50"
              >
                {cancellingOrder ? "Cancelling..." : "Yes, Cancel Order"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
