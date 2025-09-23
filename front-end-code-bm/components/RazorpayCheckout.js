import { useState } from "react";

const RazorpayCheckout = ({ orderData, onPaymentSuccess }) => {
  const [loading, setLoading] = useState(false);

  const handlePayment = async () => {
    setLoading(true);
    try {
      // Step 1: Call backend to initiate order
      const initiateResponse = await fetch("/api/payment/initiate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderData),
      });

      const initiateData = await initiateResponse.json();
      if (!initiateResponse.ok) throw new Error(initiateData.error);

      const { id: order_id, amount, currency } = initiateData;

      // Step 2: Load Razorpay Checkout
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY, // Public key from Razorpay
        amount,
        currency,
        name: "Brandmaratha",
        description: "Order Payment",
        order_id,
        handler: async function (response) {
          // Step 3: Verify payment on backend
          const verifyResponse = await fetch("/api/payment/verify", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              paymentData: response,
              orderData,
            }),
          });

          const verifyData = await verifyResponse.json();
          if (!verifyResponse.ok) throw new Error(verifyData.error);

          // Step 4: Callback function on successful payment
          onPaymentSuccess(verifyData);
        },
        prefill: {
          name: orderData.customer_name,
          email: orderData.customer_email,
          contact: orderData.customer_phone,
        },
        theme: { color: "#3399cc" },
      };

      const razor = new window.Razorpay(options);
      razor.open();
    } catch (error) {
      console.error("Payment Failed:", error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button onClick={handlePayment} disabled={loading}>
      {loading ? "Processing..." : "Pay with Razorpay"}
    </button>
  );
};

export default RazorpayCheckout;
