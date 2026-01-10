"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCart } from "@/contexts/CartContext";
import {
  checkout,
  createRazorpayOrder,
  verifyAndCreateOrder,
  getAllAddresses,
  createAddress,
  setDefaultAddress,
  StoreAddress,
} from "@/store/api/store";
import { getStates, getCitiesByState } from "@/store/api/location";
import { getWalletBalance } from "@/utils/wallet";
import Button from "@/components/atoms/Button";
import { COUNTRIES } from "@/constants/countries";

declare global {
  interface Window {
    Razorpay: any;
  }
}

interface FormAddress {
  fullName: string;
  phone: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
  landmark: string;
  addressType: "home" | "work" | "other";
}

const CheckoutPage = () => {
  const router = useRouter();
  const { cartItems, totalPrice, shippingCharges, taxAmount, totalAmount, fetchCart, fetchCartCount } = useCart();

  const [step, setStep] = useState(1); // 1: Address, 2: Payment
  const [selectedAddressId, setSelectedAddressId] = useState<string>("");
  const [useNewAddress, setUseNewAddress] = useState(false);
  const [addresses, setAddresses] = useState<StoreAddress[]>([]);

  const [newAddress, setNewAddress] = useState<FormAddress>({
    fullName: "",
    phone: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    pincode: "",
    country: "India",
    landmark: "",
    addressType: "home",
  });

  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [walletBalance, setWalletBalance] = useState(0);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [orderNumber, setOrderNumber] = useState("");

  const [states, setStates] = useState<string[]>([]);
  const [cities, setCities] = useState<string[]>([]);
  const [loadingCities, setLoadingCities] = useState(false);

  // Calculate order summary (charges come from backend)
  const hasPhysicalProducts = cartItems.some((item) => item.productType === "physical");
  const subtotal = totalPrice;

  useEffect(() => {
    const fetchAddresses = async () => {
      try {
        const data = await getAllAddresses();
        const addrList = data.addresses || [];
        setAddresses(addrList);

        if (addrList.length > 0) {
          const defaultAddr = addrList.find((a) => a.isDefault) || addrList[0];
          setSelectedAddressId(defaultAddr.id);
          setUseNewAddress(false);
        } else {
          setUseNewAddress(true);
        }
      } catch (err: any) {
        console.error("Failed to load addresses", err);
      }
    };

    fetchAddresses();
  }, []);

  useEffect(() => {
    const loadStates = async () => {
      try {
        const response = await getStates();
        if (response.success && response.states) {
          setStates(response.states);
        }
      } catch (error) {
        console.error("Failed to load states:", error);
      }
    };
    loadStates();
  }, []);

  useEffect(() => {
    const fetchWalletBalance = async () => {
      try {
        const walletData = await getWalletBalance();
        setWalletBalance(walletData.balance);
      } catch (err) {
        console.error("Failed to fetch wallet balance", err);
      }
    };

    fetchWalletBalance();
  }, []);

  useEffect(() => {
    // Load Razorpay script
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewAddress((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleStateChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const state = e.target.value;
    setNewAddress((prev) => ({ ...prev, state, city: "" }));
    
    if (!state) {
      setCities([]);
      return;
    }

    try {
      setLoadingCities(true);
      const response = await getCitiesByState(state);
      if (response.success && response.cities) {
        setCities(response.cities);
      }
    } catch (error) {
      console.error("Failed to load cities:", error);
      setCities([]);
    } finally {
      setLoadingCities(false);
    }
  };

  const handleSelectSavedAddress = async (id: string) => {
    setSelectedAddressId(id);
    setUseNewAddress(false);

    try {
      const response = await setDefaultAddress(id);
      if (response.success && response.address) {
        setAddresses((prev) =>
          prev.map((addr) => ({
            ...addr,
            isDefault: addr.id === response.address.id,
          }))
        );
      }
    } catch (err) {
      console.error("Failed to set default address", err);
    }
  };

  const handleContinueToPayment = async () => {
    setError(null);

    // If user chooses to add a new address, create it via API first
    if (useNewAddress) {
      if (
        !newAddress.fullName.trim() ||
        !newAddress.phone.trim() ||
        !newAddress.addressLine1.trim() ||
        !newAddress.city.trim() ||
        !newAddress.state.trim() ||
        !newAddress.pincode.trim()
      ) {
        setError("Please fill all required address fields");
        return;
      }

      try {
        const isFirstAddress = addresses.length === 0;
        const payload = {
          fullName: newAddress.fullName.trim(),
          phone: newAddress.phone.trim(),
          addressLine1: newAddress.addressLine1.trim(),
          addressLine2: newAddress.addressLine2.trim() || null,
          city: newAddress.city.trim(),
          state: newAddress.state.trim(),
          pincode: newAddress.pincode.trim(),
          country: newAddress.country.trim() || "India",
          landmark: newAddress.landmark.trim() || null,
          addressType: newAddress.addressType || "home",
          isDefault: isFirstAddress,
        };

        const response = await createAddress(payload);
        if (response.success && response.address) {
          const newList = [response.address, ...addresses];
          setAddresses(newList);
          setSelectedAddressId(response.address.id);
          setUseNewAddress(false);

          // Reset form
          setNewAddress({
            fullName: "",
            phone: "",
            addressLine1: "",
            addressLine2: "",
            city: "",
            state: "",
            pincode: "",
            country: "India",
            landmark: "",
            addressType: "home",
          });
        }
      } catch (err: any) {
        console.error("Failed to create address", err);
        setError(err?.message || err?.response?.data?.message || "Failed to save address");
        return;
      }
    } else {
      if (hasPhysicalProducts && !selectedAddressId) {
        setError("Please select a delivery address");
        return;
      }
    }

    // Open payment modal
    setShowPaymentModal(true);
  };

  const handleWalletPayment = async () => {
    try {
      setProcessing(true);
      setError(null);

      // Check sufficient balance
      if (walletBalance < totalAmount) {
        setError(
          `Insufficient wallet balance. Required: ₹${totalAmount.toFixed(2)}, Available: ₹${walletBalance.toFixed(2)}`
        );
        setProcessing(false);
        return;
      }

      // Create order via wallet payment
      const orderData: any = {
        paymentMethod: "wallet",
      };

      if (hasPhysicalProducts) {
        orderData.addressId = selectedAddressId;
      }

      const response = await checkout(orderData);

      if (response.success) {
        // Clear cart and show success
        await fetchCart();
        await fetchCartCount();
        setOrderNumber(response.order.orderNumber);
        setShowPaymentModal(false);
        setShowSuccessModal(true);
      }
    } catch (err: any) {
      console.error("Wallet payment error:", err);
      setError(err?.message || "Failed to process wallet payment");
    } finally {
      setProcessing(false);
    }
  };

  const handleRazorpayPayment = async () => {
    try {
      setProcessing(true);
      setError(null);

      // Create Razorpay order
      const addressId = hasPhysicalProducts ? selectedAddressId : undefined;
      const razorpayOrderResponse = await createRazorpayOrder(addressId);

      if (!razorpayOrderResponse.success) {
        throw new Error("Failed to create Razorpay order");
      }

      const { razorpayOrderId, key } = razorpayOrderResponse.data;

      const options = {
        key: key,
        amount: razorpayOrderResponse.data.amountInPaise,
        currency: razorpayOrderResponse.data.currency,
        name: "Graho Store",
        description: "Store Order Payment",
        order_id: razorpayOrderId,
        handler: async function (response: any) {
          try {
            // Verify payment and create order
            const verifyData = {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              addressId: hasPhysicalProducts ? selectedAddressId : undefined,
            };

            const orderResponse = await verifyAndCreateOrder(verifyData);

            if (orderResponse.success) {
              // Clear cart and show success
              await fetchCart();
              await fetchCartCount();
              setOrderNumber(orderResponse.order.orderNumber);
              setShowPaymentModal(false);
              setShowSuccessModal(true);
            }
          } catch (err: any) {
            console.error("Payment verification error:", err);
            setError(err?.message || "Payment verification failed");
          } finally {
            setProcessing(false);
          }
        },
        prefill: {
          name: addresses.find((a) => a.id === selectedAddressId)?.fullName || "",
          contact: addresses.find((a) => a.id === selectedAddressId)?.phone || "",
        },
        theme: {
          color: "#EAB308",
        },
        modal: {
          ondismiss: function () {
            setProcessing(false);
            setError("Payment cancelled");
          },
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err: any) {
      console.error("Razorpay payment error:", err);
      setError(err?.message || "Failed to initiate payment");
      setProcessing(false);
    }
  };

  if (cartItems.length === 0 && !showSuccessModal) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-8">
          <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 px-4 py-3 rounded mb-8">
            Your cart is empty. Please add products before checkout.
          </div>
          <Button
            href="/store/products"
            variant="ghost"
            size="md"
            className="bg-yellow-500 text-white px-6 py-2 hover:bg-yellow-600"
          >
            Continue Shopping
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-8">
          <h1 className="text-4xl font-bold text-gray-900">Checkout</h1>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Checkout Form */}
          <div className="lg:col-span-2">
            {/* Step Indicator */}
            <div className="mb-8 flex items-center gap-4">
              <div
                className={`flex items-center justify-center w-10 h-10 rounded-full font-bold ${
                  step >= 1 ? "bg-yellow-500 text-white" : "bg-gray-300 text-gray-600"
                }`}
              >
                1
              </div>
              <p className="font-semibold text-gray-900">Delivery Address</p>

              <div className="flex-1 h-1 bg-gray-300"></div>

              <div
                className={`flex items-center justify-center w-10 h-10 rounded-full font-bold ${
                  showPaymentModal ? "bg-yellow-500 text-white" : "bg-gray-300 text-gray-600"
                }`}
              >
                2
              </div>
              <p className="font-semibold text-gray-900">Payment</p>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-8">
                {error}
              </div>
            )}

            {/* Address Selection */}
            <div className="space-y-6">
              {/* Saved Addresses */}
              {addresses.length > 0 && (
                <div>
                  <h2 className="text-xl font-bold text-gray-900 mb-4">Saved Addresses</h2>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    {addresses.map((address) => (
                      <label
                        key={address.id}
                        className={`border-2 rounded-lg p-4 cursor-pointer transition-colors ${
                          selectedAddressId === address.id
                            ? "border-yellow-500 bg-yellow-50"
                            : "border-gray-200 hover:border-yellow-300"
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <input
                            type="radio"
                            name="address"
                            value={address.id}
                            checked={selectedAddressId === address.id}
                            onChange={(e) => handleSelectSavedAddress(e.target.value)}
                            className="mt-1"
                          />
                          <div className="flex-1">
                            <p className="font-bold text-gray-900">
                              {address.addressType
                                ? address.addressType.charAt(0).toUpperCase() +
                                  address.addressType.slice(1)
                                : "Address"}
                            </p>
                            <p className="text-sm text-gray-600 mt-1">{address.fullName}</p>
                            <p className="text-sm text-gray-600">
                              {address.addressLine1}
                              {address.addressLine2 ? `, ${address.addressLine2}` : ""}
                            </p>
                            <p className="text-sm text-gray-600">
                              {address.city}, {address.state}, {address.pincode}, {address.country}
                            </p>
                            <p className="text-sm text-gray-600 mt-2">Phone: {address.phone}</p>
                            {address.isDefault && (
                              <span className="inline-block mt-2 bg-blue-100 text-blue-700 px-2 py-1 text-xs rounded font-semibold">
                                Default
                              </span>
                            )}
                          </div>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {/* Add New Address Toggle */}
              <div>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={useNewAddress}
                    onChange={(e) => setUseNewAddress(e.target.checked)}
                    className="w-4 h-4"
                  />
                  <span className="font-semibold text-gray-900">Add a new address</span>
                </label>
              </div>

              {/* New Address Form */}
              {useNewAddress && (
                <div className="bg-white rounded-lg p-6 border border-gray-200">
                  <h3 className="font-bold text-gray-900 mb-4">Enter New Address</h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input
                      type="text"
                      name="fullName"
                      placeholder="Full Name *"
                      value={newAddress.fullName}
                      onChange={handleAddressChange}
                      className="col-span-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
                    />

                    <input
                      type="tel"
                      name="phone"
                      placeholder="Phone Number *"
                      value={newAddress.phone}
                      onChange={handleAddressChange}
                      className="col-span-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
                    />

                    <select
                      name="addressType"
                      value={newAddress.addressType}
                      onChange={handleAddressChange}
                      className="col-span-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
                    >
                      <option value="home">Home</option>
                      <option value="work">Work</option>
                      <option value="other">Other</option>
                    </select>

                    <input
                      type="text"
                      name="addressLine1"
                      placeholder="Address Line 1 *"
                      value={newAddress.addressLine1}
                      onChange={handleAddressChange}
                      className="col-span-2 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
                    />

                    <input
                      type="text"
                      name="addressLine2"
                      placeholder="Address Line 2 (optional)"
                      value={newAddress.addressLine2}
                      onChange={handleAddressChange}
                      className="col-span-2 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
                    />

                    <select
                      name="state"
                      value={newAddress.state}
                      onChange={handleStateChange}
                      className="col-span-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
                    >
                      <option value="">Select State *</option>
                      {states.map((state) => (
                        <option key={state} value={state}>
                          {state}
                        </option>
                      ))}
                    </select>

                    <select
                      name="city"
                      value={newAddress.city}
                      onChange={handleAddressChange}
                      disabled={!newAddress.state || loadingCities}
                      className="col-span-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 disabled:bg-gray-100"
                    >
                      <option value="">
                        {loadingCities ? "Loading cities..." : newAddress.state ? "Select City *" : "Select State First"}
                      </option>
                      {cities.map((city) => (
                        <option key={city} value={city}>
                          {city}
                        </option>
                      ))}
                    </select>

                    <input
                      type="text"
                      name="pincode"
                      placeholder="Pincode *"
                      value={newAddress.pincode}
                      onChange={(e) => {
                        const value = e.target.value.replace(/\D/g, '').slice(0, 6);
                        setNewAddress((prev) => ({ ...prev, pincode: value }));
                      }}
                      maxLength={6}
                      className="col-span-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
                    />

                    <input
                      type="text"
                      name="country"
                      value="India"
                      disabled
                      className="col-span-1 px-4 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-600"
                    />

                    <input
                      type="text"
                      name="landmark"
                      placeholder="Landmark (optional)"
                      value={newAddress.landmark}
                      onChange={handleAddressChange}
                      className="col-span-2 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
                    />
                  </div>
                  <p className="text-sm mt-5 font-italic text-center">
                    Read our <Link href="/policies/shipping_delivery" className="text-blue-500">Shipping & Delivery Policy</Link>
                  </p>
                  
                </div>
              )}

              {/* Continue Button */}
              <Button
                fullWidth={true}
                variant="custom"
                size="md"
                onClick={handleContinueToPayment}
                disabled={processing}
                className="bg-yellow-400 text-white py-3 rounded-lg font-bold hover:shadow-lg transition-shadow"
              >
                Continue to Payment
              </Button>
            </div>
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-20">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Order Summary</h2>

              {/* Items */}
              <div className="space-y-3 mb-6 pb-6 border-b border-gray-200 max-h-64 overflow-y-auto">
                {cartItems.map((item) => (
                  <div key={item._id} className="flex justify-between text-sm">
                    <div className="flex-1">
                      <p className="text-gray-900 font-semibold line-clamp-1">
                        {item.productName}
                      </p>
                      <p className="text-gray-600">Qty: {item.quantity}</p>
                    </div>
                    <p className="text-gray-900 font-semibold">
                      ₹{((item.discountPrice || item.price) * item.quantity).toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>

              {/* Pricing */}
              <div className="space-y-3 mb-6 pb-6 border-b border-gray-200">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>₹{subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Shipping</span>
                  <span className={shippingCharges === 0 ? "text-green-600 font-semibold" : ""}>
                    {shippingCharges === 0 ? "FREE" : `₹${shippingCharges}`}
                  </span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Tax</span>
                  <span>₹{taxAmount.toFixed(2)}</span>
                </div>
              </div>

              {/* Total */}
              <div className="flex justify-between items-center">
                <span className="text-lg font-bold text-gray-900">Total Amount</span>
                <span className="text-2xl font-bold text-green-600">
                  ₹{totalAmount.toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Modal */}
      {showPaymentModal && (
        <div className="fixed inset-0 border-2  bg-white/30 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white border border-gray-500 rounded-lg max-w-md w-full p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Choose Payment Method</h2>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4 text-sm">
                {error}
              </div>
            )}

            <div className="space-y-4 mb-6">
              {/* Wallet Payment */}
              <button
                onClick={handleWalletPayment}
                disabled={processing}
                className="w-full border-2 border-gray-300 rounded-lg p-4 hover:border-yellow-500 hover:bg-yellow-50 transition-colors text-left disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="text-3xl">💰</div>
                    <div>
                      <p className="font-bold text-gray-900">Pay via Wallet</p>
                      <p className="text-sm text-gray-600">
                        Balance: ₹{walletBalance.toFixed(2)}
                      </p>
                    </div>
                  </div>
                  {walletBalance < totalAmount && (
                    <span className="text-xs text-red-600 font-semibold">Insufficient</span>
                  )}
                </div>
              </button>

              {/* Razorpay Payment */}
              <button
                onClick={handleRazorpayPayment}
                disabled={processing}
                className="w-full border-2 border-gray-300 rounded-lg p-4 hover:border-yellow-500 hover:bg-yellow-50 transition-colors text-left disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <div className="flex items-center gap-3">
                  <div className="text-3xl">💳</div>
                  <div>
                    <p className="font-bold text-gray-900">Pay Online (Razorpay)</p>
                    <p className="text-sm text-gray-600">
                      Credit/Debit Card, UPI, Net Banking
                    </p>
                  </div>
                </div>
              </button>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowPaymentModal(false);
                  setError(null);
                }}
                disabled={processing}
                className="flex-1 px-4 py-2 border-2 border-gray-300 text-gray-900 rounded-lg font-semibold hover:bg-gray-50 disabled:opacity-50"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Processing Overlay */}
      {processing && !showPaymentModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-8 text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-yellow-500 mx-auto mb-4"></div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Processing Your Order</h2>
            <p className="text-gray-600">Please wait while we process your payment...</p>
          </div>
        </div>
      )}

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-white/30 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white border-gray-400 rounded-lg max-w-md w-full p-8 text-center">
            <div className="text-6xl mb-4">✅</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Order Placed Successfully!
            </h2>
            <p className="text-gray-600 mb-4">
              Your order <span className="font-semibold">{orderNumber}</span> has been placed
              successfully.
            </p>
            <div className="flex flex-col gap-3">
              <Button
                href="/profile/orders"
                variant="custom"
                size="md"
                className="bg-linear-to-r from-yellow-500 to-orange-500 text-white font-bold"
              >
                View My Orders
              </Button>
              <Button
                href="/store/products"
                variant="ghost"
                size="md"
                className="border-2 border-gray-300 text-gray-900 hover:bg-gray-50"
              >
                Continue Shopping
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CheckoutPage;
