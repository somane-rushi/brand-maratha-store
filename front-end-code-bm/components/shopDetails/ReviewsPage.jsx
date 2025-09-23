"use client";

import React, { useState } from "react";
import AskReview from "../modals/AskReview";
import WriteReview from "./WriteReview";

export default function ReviewsPage() {
  const [reviews, setReviews] = useState([]); // Shared state for reviews

  // Function to add a new review
  const addReview = (newReview) => {
    setReviews((prevReviews) => [...prevReviews, newReview]);
  };

  return (
    <div>
      {/* Pass reviews and addReview function to child components */}
      <WriteReview reviews={reviews} />
      <AskReview addReview={addReview} />
    </div>
  );
}
