"use client";
import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
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
  ArrowLeft,
  Download
} from "lucide-react";
import { getOrderDetails, trackOrder, cancelOrder } from "@/store/api/store";
import { colors } from "@/utils/colors";

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
  orderStatus: string;
  paymentStatus: string;
  paymentMethod: string;
  totalAmount: number;
  subtotal: number;
  shippingCharges: number;
  taxAmount: number;
  items: OrderItem[];
  createdAt: string;
  deliveryAddress?: any;
  trackingNumber?: string | null;
  courierName?: string | null;
  trackingUrl?: string | null;
  digitalDownloadLinks?: any[];
  cancellationReason?: string | null;
  cancelledAt?: string | null;
}

export default function OrderDetailsPage() {
  const { user } = useAuth();
  const router = useRouter();
  const params = useParams();
  const orderNumber = params?.orderNumber as string;

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
      if (trackingResponse) setTracking(trackingResponse.tracking);
    } catch (err: any) {
      setError(err?.message || "Failed to load order details");
    } finally {
      setLoading(false);
    }
  };

  // FIX: Re-defined the missing function
  const canCancelOrder = (order: Order) => {
    const status = order.orderStatus.toLowerCase();
    return !["shipped", "out_for_delivery", "delivered", "cancelled", "returned"].includes(status);
  };

  const handleCancelOrder = async () => {
    if (!order) return;
    try {
      setCancellingOrder(true);
      await cancelOrder(order.orderNumber, cancellationReason);
      await fetchOrderDetails();
      setShowCancelModal(false);
      setCancellationReason("");
    } catch (err: any) {
      alert(err?.message || "Failed to cancel order");
    } finally {
      setCancellingOrder(false);
    }
  };

  const getStatusColor = (status: string) => {
    const s = status?.toLowerCase();
    if (s === "pending") return "bg-yellow-100 text-yellow-800";
    if (s === "confirmed") return "bg-blue-100 text-blue-800";
    if (s === "delivered") return "bg-green-100 text-green-800";
    if (s === "cancelled") return "bg-red-100 text-red-800";
    return "bg-gray-100 text-gray-800";
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-IN", {
      day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-yellow-500"></div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gray-50">
        <XCircle className="w-12 h-12 text-red-500 mb-4" />
        <p className="text-gray-600 mb-6 text-center">{error || "Unable to load order details"}</p>
        <Button href="/profile/orders" variant="custom" className="bg-yellow-500 text-white px-8">Back to Orders</Button>
      </div>
    );
  }

  return (
    <div className="w-full bg-gray-50 pb-5">
     
      

      <div className="max-w-4xl mx-auto px-4 pt-6 space-y-6">
        
        {/* Main Order Card */}
        <Card padding="none" className="overflow-hidden border-gray-200 shadow-sm bg-white rounded-2xl">
          <div className="p-5 border-b border-gray-100 flex items-center justify-between bg-white">
            <div>
              <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest mb-1">Order ID</p>
              <Heading level={2} className="text-lg font-black">#{order.orderNumber}</Heading>
              <p className="text-[11px] text-gray-500 font-bold mt-1 uppercase">{formatDate(order.createdAt)}</p>
            </div>
            <span className={`px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${getStatusColor(order.orderStatus)}`}>
              {order.orderStatus.replace("_", " ")}
            </span>
          </div>

          {/* Tracking Timeline */}
          {tracking?.timeline && (
            <div className="p-5 bg-gray-50/50 border-b border-gray-100">
              <div className="space-y-4">
                {tracking.timeline.map((step: any, index: number) => (
                  <div key={index} className="flex gap-3">
                    <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${step.completed ? 'bg-green-500 text-white' : 'bg-gray-200 text-white'}`}>
                      {step.completed ? <CheckCircle className="w-3 h-3" /> : <div className="w-1.5 h-1.5 bg-white rounded-full" />}
                    </div>
                    <div>
                      <p className={`text-xs font-black uppercase tracking-tight ${step.completed ? 'text-gray-900' : 'text-gray-400'}`}>{step.label}</p>
                      {step.timestamp && <p className="text-[10px] text-gray-500 font-bold">{formatDate(step.timestamp)}</p>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Items List */}
          <div className="p-5 divide-y divide-gray-100">
            {order.items.map((item, idx) => (
              <div key={idx} className="flex gap-4 py-4 first:pt-0 last:pb-0">
                <div className="w-16 h-16 bg-gray-50 rounded-xl overflow-hidden border border-gray-100 shrink-0">
                  {item.images?.[0] ? (
                    <img src={item.images[0]} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center"><Package className="text-gray-300 w-6" /></div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-black text-gray-900 line-clamp-1 uppercase">{item.productName}</p>
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-[11px] font-bold text-gray-500 uppercase">Qty: {item.quantity}</span>
                    <span className="text-sm font-black text-gray-900">₹{(item.price * item.quantity).toLocaleString()}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Digital Downloads */}
        {order.digitalDownloadLinks && order.digitalDownloadLinks.length > 0 && (
          <Card className="border-gray-200 rounded-2xl p-5 bg-blue-50/30">
            <h3 className="text-[10px] font-black uppercase text-blue-500 tracking-widest mb-3">Digital Downloads</h3>
            <div className="space-y-3">
              {order.digitalDownloadLinks.map((link: any, index: number) => (
                <a key={index} href={link.downloadUrl} className="flex items-center justify-between p-3 bg-white rounded-xl border border-blue-100 shadow-sm">
                  <span className="text-xs font-bold text-gray-800 truncate pr-4">{link.productName}</span>
                  <Download className="w-4 h-4 text-blue-600 shrink-0" />
                </a>
              ))}
            </div>
          </Card>
        )}

        {/* Delivery & Payment Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Card className="p-5 border-gray-200 rounded-2xl bg-white">
            <div className="flex items-center gap-2 mb-3">
              <MapPin className="w-4 h-4 text-gray-400" />
              <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Delivery Address</p>
            </div>
            <div className="text-[12px] leading-relaxed">
              <p className="font-black text-gray-900">{order.deliveryAddress?.fullName}</p>
              <p className="text-gray-600 font-medium">{order.deliveryAddress?.addressLine1}</p>
              <p className="text-gray-600 font-medium">{order.deliveryAddress?.city}, {order.deliveryAddress?.state}</p>
              <p className="font-black text-gray-900 mt-1">{order.deliveryAddress?.pincode}</p>
            </div>
          </Card>

          <Card className="p-5 border-gray-200 rounded-2xl bg-white">
            <div className="flex items-center gap-2 mb-3">
              <CreditCard className="w-4 h-4 text-gray-400" />
              <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Payment Info</p>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-[11px] font-bold uppercase">
                <span className="text-gray-400">Method</span>
                <span className="text-gray-900">{order.paymentMethod === 'razorpay' ? 'Online' : order.paymentMethod}</span>
              </div>
              <div className="flex justify-between text-[11px] font-bold uppercase">
                <span className="text-gray-400">Status</span>
                <span className={order.paymentStatus === 'completed' ? 'text-green-600' : 'text-yellow-600'}>{order.paymentStatus}</span>
              </div>
            </div>
          </Card>
        </div>

        {/* Totals */}
        <Card className="p-6 border-gray-200 rounded-2xl bg-white">
          <div className="space-y-3">
            <div className="flex justify-between text-[11px] font-bold text-gray-400 uppercase">
              <span>Subtotal</span>
              <span className="text-gray-900">₹{parseFloat(order.subtotal.toString()).toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-[11px] font-bold text-gray-400 uppercase">
              <span>Shipping</span>
              <span className="text-green-600">{order.shippingCharges === 0 ? "FREE" : `₹${order.shippingCharges}`}</span>
            </div>
            <div className="flex justify-between text-[11px] font-bold text-gray-400 uppercase border-b border-gray-100 pb-3">
              <span>Tax (GST)</span>
              <span className="text-gray-900">₹{parseFloat(order.taxAmount.toString()).toFixed(2)}</span>
            </div>
            <div className="flex justify-between pt-1">
              <span className="text-xs font-black text-gray-900 uppercase">Total Amount</span>
              <span className="text-xl font-black text-gray-900">₹{parseFloat(order.totalAmount.toString()).toLocaleString()}</span>
            </div>
          </div>
        </Card>

        {/* Actions */}
        <div className="flex flex-col gap-3">
          {canCancelOrder(order) && (
            <button
              onClick={() => setShowCancelModal(true)}
              disabled={cancellingOrder}
              className="w-full py-4 rounded-xl border-2 border-red-50 text-red-600 text-[11px] font-black uppercase tracking-widest transition-colors active:bg-red-50"
            >
              Cancel Order
            </button>
          )}
          <Button style={{background:colors.primeYellow}} href="/profile/orders" variant="custom" className="w-full py-4  text-white text-[11px] md:text-[16px] font-black uppercase tracking-widest">
            Return to My Orders
          </Button>
        </div>
      </div>

      {/* Cancel Modal */}
      {showCancelModal && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setShowCancelModal(false)} />
          <div className="relative bg-white w-full max-w-md rounded-t-3xl sm:rounded-3xl p-6 shadow-2xl animate-in slide-in-from-bottom duration-300">
            <h2 className="text-lg font-black uppercase mb-2">Cancel Order</h2>
            <p className="text-xs text-gray-500 mb-6 font-bold uppercase tracking-tight leading-relaxed">
              Are you sure? Once cancelled, this action cannot be undone.
            </p>
            <textarea
              value={cancellationReason}
              onChange={(e) => setCancellationReason(e.target.value)}
              placeholder="Reason for cancellation (optional)"
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm mb-6 outline-none focus:ring-2 focus:ring-yellow-500"
              rows={3}
            />
            <div className="flex flex-col gap-2">
              <button onClick={handleCancelOrder} disabled={cancellingOrder} className="w-full py-4 bg-red-600 text-white rounded-xl font-black text-[11px] uppercase tracking-widest">
                {cancellingOrder ? "Processing..." : "Confirm Cancellation"}
              </button>
              <button onClick={() => setShowCancelModal(false)} className="w-full py-4 bg-gray-100 text-gray-600 rounded-xl font-black text-[11px] uppercase tracking-widest">
                Keep My Order
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}