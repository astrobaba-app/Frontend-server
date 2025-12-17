"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCart } from "@/contexts/CartContext";
import {
  checkout,
  getAllAddresses,
  createAddress,
  setDefaultAddress,
  StoreAddress,
} from "@/store/api/store";
import Button from "@/components/atoms/Button";
import { COUNTRIES } from "@/constants/countries";

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
  const { cartItems, totalPrice } = useCart();

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

  const [paymentMethod, setPaymentMethod] = useState<"wallet" | "razorpay" | "cod">("razorpay");
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAddresses = async () => {
      try {
        const data = await getAllAddresses();
        const addrList = data.addresses || [];
        setAddresses(addrList);

        if (addrList.length > 0) {
          const defaultAddr =
            addrList.find((a) => a.isDefault) || addrList[0];
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

  const handleCheckout = async () => {
    try {
      setProcessing(true);
      setError(null);

      const hasPhysicalProducts = cartItems.some(
        (item) => item.productType === "physical"
      );

      if (hasPhysicalProducts && !selectedAddressId) {
        setError("Please select a delivery address");
        return;
      }

      const orderData: any = {
        paymentMethod,
      };

      if (hasPhysicalProducts) {
        orderData.addressId = selectedAddressId;
      }

      const response = await checkout(orderData);

      // Redirect to success page or payment gateway
      router.push(`/checkout/success?orderNumber=${response.orderNumber}`);
    } catch (err: any) {
      setError(err?.message || "Failed to complete checkout");
    } finally {
      setProcessing(false);
    }
  };

  const handleAddressChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setNewAddress((prev) => ({
      ...prev,
      [name]: value,
    }));
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

          // Reset form for future new addresses
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
        setError(
          err?.message || err?.response?.data?.message || "Failed to save address"
        );
        return;
      }
    } else {
      if (!selectedAddressId) {
        setError("Please select a delivery address");
        return;
      }
    }

    setStep(2);
  };

  if (cartItems.length === 0) {
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
                  step >= 1
                    ? "bg-yellow-500 text-white"
                    : "bg-gray-300 text-gray-600"
                }`}
              >
                1
              </div>
              <p className="font-semibold text-gray-900">Delivery Address</p>

              <div className="flex-1 h-1 bg-gray-300"></div>

              <div
                className={`flex items-center justify-center w-10 h-10 rounded-full font-bold ${
                  step >= 2
                    ? "bg-yellow-500 text-white"
                    : "bg-gray-300 text-gray-600"
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

            {step === 1 && (
              <div className="space-y-6">
                {/* Saved Addresses */}
                <div>
                  <h2 className="text-xl font-bold text-gray-900 mb-4">
                    Saved Addresses
                  </h2>

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
                            <p className="text-sm text-gray-600 mt-1">
                              {address.fullName}
                            </p>
                            <p className="text-sm text-gray-600">
                              {address.addressLine1}
                              {address.addressLine2
                                ? `, ${address.addressLine2}`
                                : ""}
                            </p>
                            <p className="text-sm text-gray-600">
                              {address.state}, {address.pincode},{" "}
                              {address.country}
                            </p>
                            <p className="text-sm text-gray-600 mt-2">
                              Phone: {address.phone}
                            </p>
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

                {/* Add New Address Toggle */}
                <div>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={useNewAddress}
                      onChange={(e) => setUseNewAddress(e.target.checked)}
                      className="w-4 h-4"
                    />
                    <span className="font-semibold text-gray-900">
                      Add a new address
                    </span>
                  </label>
                </div>

                {/* New Address Form */}
                {useNewAddress && (
                  <div className="bg-white rounded-lg p-6 border border-gray-200">
                    <h3 className="font-bold text-gray-900 mb-4">
                      Enter New Address
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <input
                        type="text"
                        name="fullName"
                        placeholder="Full Name"
                        value={newAddress.fullName}
                        onChange={handleAddressChange}
                        className="col-span-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
                      />

                      <input
                        type="tel"
                        name="phone"
                        placeholder="Phone Number"
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
                        placeholder="Address Line 1"
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

                      <input
                        type="text"
                        name="city"
                        placeholder="City"
                        value={newAddress.city}
                        onChange={handleAddressChange}
                        className="col-span-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
                      />

                      <input
                        type="text"
                        name="state"
                        placeholder="State"
                        value={newAddress.state}
                        onChange={handleAddressChange}
                        className="col-span-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
                      />

                      <input
                        type="text"
                        name="pincode"
                        placeholder="Pincode"
                        value={newAddress.pincode}
                        onChange={handleAddressChange}
                        className="col-span-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
                      />

                      <select
                        name="country"
                        value={newAddress.country}
                        onChange={handleAddressChange}
                        className="col-span-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
                      >
                        {COUNTRIES.map((c) => (
                          <option key={c.code} value={c.name}>
                            {c.name}
                          </option>
                        ))}
                      </select>

                      <input
                        type="text"
                        name="landmark"
                        placeholder="Landmark (optional)"
                        value={newAddress.landmark}
                        onChange={handleAddressChange}
                        className="col-span-2 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
                      />
                    </div>
                  </div>
                )}

                {/* Continue Button */}
                <Button
                  fullWidth={true}
                  variant="custom"
                  size="md"
                  onClick={handleContinueToPayment}
                  className=" bg-gradient-to-r from-yellow-500 to-orange-500 text-white py-3 rounded-lg font-bold hover:shadow-lg transition-shadow"
                >
                  Continue to Payment
                </Button>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-6">
                {/* Address Summary */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-sm text-gray-600 mb-1">Delivering to:</p>
                  <p className="font-semibold text-gray-900">
                    {(() => {
                      const addr = addresses.find(
                        (a) => a.id === selectedAddressId
                      );
                      if (!addr) return "";
                      return `${addr.fullName}, ${addr.addressLine1}$${
                        addr.addressLine2 ? `, ${addr.addressLine2}` : ""
                      }, ${addr.city}`;
                    })()}
                  </p>
                  <Button
                    variant="custom"
                    size="sm"
                    onClick={() => setStep(1)}
                    className="text-blue-600 hover:text-blue-700 text-sm font-semibold mt-2"
                  >
                    Change Address
                  </Button>
                </div>

                {/* Payment Methods */}
                <div>
                  <h2 className="text-xl font-bold text-gray-900 mb-4">
                    Choose Payment Method
                  </h2>

                  <div className="space-y-3">
                    {[
                      {
                        id: "credit_card",
                        label: "Credit/Debit Card",
                        icon: "💳",
                      },
                      {
                        id: "upi",
                        label: "UPI (Google Pay, PhonePe, Paytm)",
                        icon: "📱",
                      },
                      {
                        id: "net_banking",
                        label: "Net Banking",
                        icon: "🏦",
                      },
                      {
                        id: "cash_on_delivery",
                        label: "Cash on Delivery",
                        icon: "💵",
                      },
                    ].map((method) => (
                      <label
                        key={method.id}
                        className={`border-2 rounded-lg p-4 cursor-pointer transition-colors flex items-center gap-3 ${
                          paymentMethod === method.id
                            ? "border-yellow-500 bg-yellow-50"
                            : "border-gray-200 hover:border-yellow-300"
                        }`}
                      >
                        <input
                          type="radio"
                          name="payment"
                          value={method.id}
                          checked={paymentMethod === method.id}
                          onChange={(e) => setPaymentMethod(e.target.value)}
                        />
                        <span className="text-2xl">{method.icon}</span>
                        <span className="font-semibold text-gray-900">
                          {method.label}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Payment Info */}
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <p className="text-sm text-gray-600">
                    ✓ Secure payment gateway • SSL encrypted • 100% safe
                    transactions
                  </p>
                </div>

                {/* Buttons */}
                <div className="flex gap-4">
                  <button
                    onClick={() => setStep(1)}
                    className="flex-1 border-2 border-gray-300 text-gray-900 py-3 rounded-lg font-bold hover:bg-gray-50 transition-colors"
                  >
                    Back
                  </button>
                  <Button
                    variant="custom"
                    type="button" 
                    size="md" 
                    onClick={handleCheckout}
                    disabled={processing}
                    className="flex-1 bg-gradient-to-r from-green-500 to-green-600 text-white hover:shadow-lg font-bold"
                    customColors={{
                      backgroundColor: "transparent",

                      textColor: "white",
                    }}
                  >
                    {processing ? "Processing..." : "Place Order"}
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-20">
              <h2 className="text-xl font-bold text-gray-900 mb-6">
                Order Summary
              </h2>

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
                      ₹
                      {(
                        (item.discountPrice || item.price) * item.quantity
                      ).toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>

              {/* Pricing */}
              <div className="space-y-3 mb-6 pb-6 border-b border-gray-200">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>₹{totalPrice.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Shipping</span>
                  <span className="text-green-600 font-semibold">FREE</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Tax (18% GST)</span>
                  <span>₹{(totalPrice * 0.18).toFixed(2)}</span>
                </div>
              </div>

              {/* Total */}
              <div className="flex justify-between items-center">
                <span className="text-lg font-bold text-gray-900">
                  Total Amount
                </span>
                <span className="text-2xl font-bold text-green-600">
                  ₹{(totalPrice + totalPrice * 0.18).toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
