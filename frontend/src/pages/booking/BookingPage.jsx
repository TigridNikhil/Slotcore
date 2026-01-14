import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchPublicTenant,
  fetchPublicServices,
  fetchPublicSlots,
  createPublicBooking,
  fetchPublicLocations,
} from "../../operations/publicBooking/publicBookingAction";
import {
  resetBookingState,
  setBookingSuccess,
  setCreatedBooking,
} from "../../operations/publicBooking/publicBookingSlice";
import { AnimatePresence } from "framer-motion";

import WizardLayout from "./WizardLayout";
import ServiceSelection from "./Steps/ServiceSelection";
import DateTimeSelection from "./Steps/DateTimeSelection";
import UserDetails from "./Steps/UserDetails";
import SuccessStep from "./Steps/SuccessStep";
import LocationSelection from "./Steps/LocationSelection";
import PaymentStep from "./Steps/PaymentStep"; // New
import { axiosInstance } from "../../utils/baseurl";
import { showNotification } from "../../utils/toastmessage";
import config from "../../utils/config";

export default function BookingPage() {
  const dispatch = useDispatch();
  const {
    tenant,
    services,
    locations,
    slots,
    loading,
    error,
    bookingSuccess,
    createdBooking,
  } = useSelector((state) => state.publicBooking);

  const [step, setStep] = useState(1);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [selectedServices, setSelectedServices] = useState([]);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedSlot, setSelectedSlot] = useState(null);

  // New: Hold customer data until payment
  const [customerData, setCustomerData] = useState(null);

  // 1. Fetch Tenant, Services & Locations on Mount
  useEffect(() => {
    dispatch(fetchPublicTenant());
    dispatch(fetchPublicServices());
    dispatch(fetchPublicLocations());
  }, [dispatch]);

  // Determine initial step based on locations
  useEffect(() => {
    if (
      locations.length > 0 &&
      !selectedLocation &&
      step < 4 &&
      !bookingSuccess
    ) {
      setStep(0);
    } else if (locations.length === 0 && step === 0) {
      setStep(1);
    }
  }, [locations, selectedLocation, bookingSuccess]);

  // Handle successful booking
  useEffect(() => {
    if (bookingSuccess) {
      // Step 5 is Success, Step 4 is Payment
      const successStepIndex = locations.length > 0 ? 5 : 4;
      setStep(successStepIndex);
    }
  }, [bookingSuccess, locations]);

  const handleDateChange = (date) => {
    setSelectedDate(date);
    if (selectedServices.length > 0 && date) {
      const serviceIds = selectedServices.map((s) => s.id).join(",");
      dispatch(fetchPublicSlots(date, serviceIds));
    }
  };

  // Load Razorpay SDK
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  // Step 3 Submit -> Go to Payment
  const handleUserDetailsSubmit = (data) => {
    setCustomerData(data);
    const nextStep = locations.length > 0 ? 4 : 3;
    setStep(nextStep);
  };

  // Step 4 Payment Submit -> Actual Create
  const handlePaymentSubmit = async ({ paymentMethod }) => {
    const bookingPayload = {
      locationId: selectedLocation?.id,
      serviceIds: selectedServices.map((s) => s.id),
      startTime: selectedSlot,
      customerName: customerData.name,
      customerEmail: customerData.email,
      customerMobile: customerData.mobile,
      notes: customerData.notes,
      paymentMethod,
    };

    const result = await dispatch(createPublicBooking(bookingPayload));

    if (result && result.success) {
      // check result exists and success
      if (paymentMethod === "online" && result.data.summary?.paymentRequired) {
        // Handle Razorpay with Backend Provided Details
        handleRazorpay(result.data.summary);
      } else {
        // If venue or Free, success is handled by slice/effect or we force it here?
        // Dispatch setBookingSuccess handled by effect if bookingSuccess state is true?
        // createPublicBooking thunk usually dispatches success.
        // If payment required, the thunk might set 'loading' false but not 'success' true fully?
        // We rely on 'handleRazorpay' to finalize.
        // If NOT online, we assume confirmed.
      }
    }
  };

  const handleRazorpay = async (summary) => {
    try {
      // summary contains: { paymentRequired, totalPayable, bookings: [...] }
      const booking = summary.bookings[0];
      const amount = summary.totalPayable;

      // 1. Create Order
      const orderRes = await axiosInstance.post("/payment/order", {
        bookingId: booking.id, // Use ID from backend response
        amount, // redundant if backend re-calcs, but helpful
      });

      const { order_id, amount: orderAmount, currency, key_id } = orderRes.data;

      const options = {
        key: key_id || config.RazorpayKey, // Use backend provided key if avail
        amount: orderAmount,
        currency: currency,
        name: tenant.name,
        description: "Booking Payment",
        order_id: order_id,
        handler: async function (response) {
          // 3. Verify Payment
          try {
            const verifyRes = await axiosInstance.post("/payment/verify", {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });

            if (verifyRes.data.success) {
              dispatch(setCreatedBooking(booking)); // Ensure booking is set
              dispatch(setBookingSuccess(true));
              showNotification({
                type: "SUCCESS",
                message: "Payment Successful!",
              });
            }
          } catch (err) {
            showNotification({
              type: "ERROR",
              message: "Payment Verification Failed",
            });
            console.error(err);
          }
        },
        prefill: {
          name: customerData.name,
          email: customerData.email,
          contact: customerData.mobile,
        },
        theme: {
          color: tenant.primaryColor,
        },
      };

      const rzp1 = new window.Razorpay(options);
      rzp1.open();
    } catch (err) {
      console.error("Payment Init Error", err);
      showNotification({
        type: "ERROR",
        message: "Could not initiate payment",
      });
    }
  };

  const handleReset = () => {
    dispatch(resetBookingState());
    setSelectedLocation(null);
    setSelectedServices([]);
    setSelectedDate("");
    setSelectedSlot(null);
    setCustomerData(null);
    setStep(0);
  };

  // Filter services
  const filteredServices = selectedLocation
    ? services.filter((s) => {
        if (!s.locations || s.locations.length === 0) return true;
        return s.locations.some(
          (l) => String(l.id) === String(selectedLocation.id)
        );
      })
    : services;

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center bg-white p-8 rounded-xl shadow-lg">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Unavailable</h1>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  if (!tenant)
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );

  const totalSteps = locations.length > 0 ? 5 : 4; // Loc, Srv, Date, User, Pay
  const displayStep = locations.length > 0 ? step + 1 : step;

  return (
    <WizardLayout tenant={tenant} step={displayStep} totalSteps={totalSteps}>
      <AnimatePresence mode="wait">
        {step === 0 && (
          <LocationSelection
            key="step0"
            locations={locations}
            onContinue={(loc) => {
              setSelectedLocation(loc);
              setStep(1);
            }}
            primaryColor={tenant.primaryColor}
          />
        )}
        {step === 1 && (
          <ServiceSelection
            key="step1"
            services={filteredServices}
            onContinue={(selected) => {
              setSelectedServices(selected);
              setStep(2);
            }}
            onBack={locations.length > 0 ? () => setStep(0) : null}
            primaryColor={tenant.primaryColor}
          />
        )}
        {step === 2 && (
          <DateTimeSelection
            key="step2"
            slots={slots}
            selectedDate={selectedDate}
            onDateChange={handleDateChange}
            onSlotSelect={(slot) => {
              setSelectedSlot(slot);
              setStep(3);
            }}
            onBack={() => setStep(1)}
            loading={loading}
            primaryColor={tenant.primaryColor}
          />
        )}
        {step === 3 && (
          <UserDetails
            key="step3"
            services={selectedServices}
            slot={selectedSlot}
            onSubmit={handleUserDetailsSubmit} // Changed
            onBack={() => setStep(2)}
            loading={loading}
            primaryColor={tenant.primaryColor}
          />
        )}
        {step === 4 && ( // New Payment Step
          <PaymentStep
            key="step4"
            services={selectedServices}
            slot={selectedSlot}
            customerData={customerData}
            onSubmit={handlePaymentSubmit}
            onBack={() => setStep(3)}
            loading={loading}
            primaryColor={tenant.primaryColor}
          />
        )}
        {step === 5 && ( // Success
          <SuccessStep
            key="step5"
            onReset={handleReset}
            primaryColor={tenant.primaryColor}
            booking={createdBooking}
          />
        )}
      </AnimatePresence>
    </WizardLayout>
  );
}
