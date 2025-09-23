"use client";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation"; // For app router in Next.js 13

export default function PaymentConfirmation() {
  const [paymentInfo, setPaymentInfo] = useState({
    razorpay_payment_id: "",
    razorpay_order_id: "",
    razorpay_signature: "",
    date: "",
  });

  const searchParams = useSearchParams();

  useEffect(() => {
    const razorpay_payment_id = searchParams.get("razorpay_payment_id");
    const razorpay_order_id = searchParams.get("razorpay_order_id");
    const razorpay_signature = searchParams.get("razorpay_signature");
    const date = searchParams.get("date");

    if (razorpay_payment_id && razorpay_order_id) {
      setPaymentInfo({
        razorpay_payment_id,
        razorpay_order_id,
        razorpay_signature: razorpay_signature || "",
        date: date || "",
      });
    }
  }, [searchParams]);

  if (!paymentInfo.razorpay_payment_id) return <p>Loading payment details...</p>;

  return (
    <section className="flat-spacing-11">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-6">
            <h5 className="fw-5 mb_20">Payment confirmation</h5>
            <div className="tf-page-cart-checkout">
              <div className="d-flex align-items-center justify-content-between mb_15">
                <div className="fs-18">Date</div>
                <p>{new Date(paymentInfo.date).toLocaleDateString()}</p>
              </div>
              <div className="d-flex align-items-center justify-content-between mb_15">
                <div className="fs-18">Payment ID</div>
                <p>{paymentInfo.razorpay_payment_id}</p>
              </div>
              <div className="d-flex align-items-center justify-content-between mb_15">
                <div className="fs-18">Order ID</div>
                <p>{paymentInfo.razorpay_order_id}</p>
              </div>
              <div className="d-flex align-items-center justify-content-between mb_15">
                <div className="fs-18">Signature</div>
                <p>{paymentInfo.razorpay_signature}</p>
              </div>
              {/* Optional: Add subtotal, user email, or phone if needed */}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
