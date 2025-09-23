import Footer1 from "@/components/footers/Footer1";
import Header2 from "@/components/headers/Header2";
import PaymentConfirmation from "@/components/othersPages/PaymentConfirmation";
import React from "react";
import { Suspense } from "react";

export const metadata = {
  title: "Payment Confirmation || Brand Maratha",
  description: "Brand Maratha",
};
export default function page() {
  return (
    <>
      <Header2 />
      <div className="tf-page-title">
        <div className="container-full">
          <div className="heading text-center">Payment Successfull</div>
        </div>
      </div>
      <Suspense fallback={<p>Loading payment details...</p>}>
      <PaymentConfirmation />
      </Suspense>
      <Footer1 />
    </>
  );
}
