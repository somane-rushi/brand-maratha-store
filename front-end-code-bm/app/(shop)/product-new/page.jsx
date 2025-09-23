// app/(shop)/product-new/page.jsx
import { Suspense } from "react";
import ProductListing from "./ProductListing"; // or from wherever you're importing

export default function Page() {
  return (
    <Suspense fallback={<div>Loading products...</div>}>
      <ProductListing />
    </Suspense>
  );
}
