"use client";

import React, { useState } from "react";

export default function AskReview() {
  const [formData, setFormData] = useState({
    name: "",
    date: new Date().toISOString().split("T")[0], // Default current date
    rating: 0,
    comment: "",
    photo: null,
  });

  const [hover, setHover] = useState(null); // For hover effect
  const [preview, setPreview] = useState(null); // For image preview
  const [reviews, setReviews] = useState([]); // Simulate API by storing reviews

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFormData({ ...formData, photo: file });

    // Create a preview for the uploaded image
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setPreview(null);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Create a review object with unique ID and default values for missing fields
    const newReview = {
      id: Date.now(), // Unique ID
      name: formData.name.trim() || null,
      date: formData.date || null, // Defaulted to current date
      rating: formData.rating || null,
      comment: formData.comment.trim() || null,
      photo: formData.photo || null,
    };

    // Add the new review to the reviews array
    setReviews([...reviews, newReview]);

    // Log the submitted data
    console.log("Submitted Data:", newReview);

    // Reset the form
    setFormData({
      name: "",
      date: new Date().toISOString().split("T")[0], // Reset to current date
      rating: 0,
      comment: "",
      photo: null,
    });
    setPreview(null);

    // Close the modal
    const modalElement = document.getElementById("ask_review");
    if (modalElement) {
      const bootstrap = require("bootstrap");
      const modalInstance = bootstrap.Modal.getInstance(modalElement);
      if (modalInstance) {
        modalInstance.hide(); // Close the modal
      }
    }
  };

  return (
    <div
      className="modal modalCentered fade modalDemo tf-product-modal modal-part-content"
      id="ask_review"
    >
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="header">
            <div className="demo-title">Write a Review</div>
            <span
              className="icon-close icon-close-popup"
              data-bs-dismiss="modal"
            />
          </div>
          <div className="overflow-y-auto">
            <form onSubmit={handleSubmit}>
              {/* Photo Upload */}
              <div className="form-group mb-24">
                <label>Upload Photo (Optional):</label>
                <input type="file" onChange={handleFileChange} />
                {preview && (
                  <div style={{ marginTop: "10px" }}>
                    <img
                      src={preview}
                      alt="Preview"
                      style={{
                        width: "100px",
                        height: "100px",
                        objectFit: "cover",
                      }}
                    />
                  </div>
                )}
              </div>

              {/* Name */}
              <div className="form-group mb-24">
                <label>Your Name:</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Enter your name"
                  required
                  className="form-control"
                />
              </div>

              {/* Star Rating */}
              <div className="form-group mb-24">
                <label>Rating:</label>
                <div
                  style={{ display: "flex", gap: "5px", marginTop: "5px" }}
                >
                  {[...Array(5)].map((_, index) => {
                    const ratingValue = index + 1;
                    return (
                      <label key={index} style={{ cursor: "pointer" }}>
                        <input
                          type="radio"
                          name="rating"
                          value={ratingValue}
                          style={{ display: "none" }}
                          onClick={() =>
                            setFormData({ ...formData, rating: ratingValue })
                          }
                        />
                        <i
                          className={`icon-start ${
                            ratingValue <= (hover || formData.rating)
                              ? "filled"
                              : "unfilled"
                          }`}
                          onMouseEnter={() => setHover(ratingValue)}
                          onMouseLeave={() => setHover(null)}
                        ></i>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* Comment */}
              <div className="form-group mb-24">
                <label>Comment:</label>
                <textarea
                  name="comment"
                  value={formData.comment}
                  onChange={handleInputChange}
                  placeholder="Write your comment here"
                  required
                  className="form-control"
                  rows="4"
                ></textarea>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="btn btn-primary"
                style={{ marginTop: "10px" }}
              >
                Submit Review
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
