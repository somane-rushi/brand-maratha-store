"use client";
import React, { useState } from "react";
import { submitQuestion } from "@/utlis/apiService"; // Import API function
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";

export default function AskQuestion() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);
  const [responseMessage, setResponseMessage] = useState("");

  // Handle input changes
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResponseMessage("");

    const response = await submitQuestion(formData);
    setLoading(false);

    if (response.error) {
      toast.error(response.error, { position: "top-right" });
    } else {
      toast.success("Question submitted successfully!", { position: "top-right" });
      setFormData({ name: "", email: "", mobile: "", message: "" }); // Reset form
    }
  };

  return (
    
    <div
      className="modal modalCentered fade modalDemo tf-product-modal modal-part-content"
      id="ask_question"
    >
       <ToastContainer />
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="header">
            <div className="demo-title">Ask a question</div>
            <span
              className="icon-close icon-close-popup"
              data-bs-dismiss="modal"
            />
          </div>
          <div className="overflow-y-auto">
            <form onSubmit={handleSubmit} className="">
              <fieldset className="">
                <label htmlFor="">Name *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </fieldset>
              <fieldset className="">
                <label htmlFor="">Email *</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </fieldset>
              <fieldset className="">
                <label htmlFor="">Phone number</label>
                <input
                  type="number"
                  name="mobile"
                  value={formData.mobile}
                  onChange={handleChange}
                  required
                />
              </fieldset>
              <fieldset className="">
                <label htmlFor="">Message</label>
                <textarea
                  name="message"
                  rows={4}
                  value={formData.message}
                  onChange={handleChange}
                  required
                />
              </fieldset>
              <button type="submit" className="tf-btn w-100 btn-fill justify-content-center fw-6 fs-16 flex-grow-1 animate-hover-btn" disabled={loading}>
                {loading ? "Sending..." : "Send"}
              </button>
              {responseMessage && <p>{responseMessage}</p>}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
 
}
