"use client";

import Image from "next/image";
import React, { useEffect, useState } from "react";
import { getCustomerReviews, fetchratings } from "@/utlis/apiService";
import { useParams } from "next/navigation";
// import ReviewModal from '../modals/reviewModal';

const WriteReview = () => {
  const { id } = useParams();
  const [reviews, setReviews] = useState([]);  
  const [rating, setRating] = useState([]);

  const fetchCustomerReviews = async () => {
    const data = await getCustomerReviews(id);
    setReviews(data);
  };

  useEffect(() => {
    fetchCustomerReviews();
  }, []);

  const getratings = async () => {
        const data = await fetchratings(id);
        setRating(data);
      };
    
      useEffect(() => {
        getratings();
      }, []);
  return (
    <>
      <div className="bs-write-review">
        <div className="container">
          <div className="col-md-12">
            <div className="bs-title-section">
              <div className="d-block text-center">
                <h2 className="fw-4">Customer Reviews</h2>
              </div>
            </div>
            <div className="review-btn-divider">
              <div className="star-section">
                <div className="rating">
                  <i className="icon-start" />
                  <i className="icon-start" />
                  <i className="icon-start" />
                  <i className="icon-start" />
                  <i className="icon-start" />
                </div>
                <h5 className="text-number">
                  <span>{rating.total_reviews}</span> reviews
                </h5>
              </div>
              <div className="write-comment">
                {/* <a href="#ask_review" data-bs-toggle="modal" className="tf-btn-loading tf-loading-default style-2 btn-loadmore text-center btn-center">
                  <span className="  text fw-6">
                    Write a Review
                  </span>
                </a> */}
              </div>
            </div>
          </div>
          <div className="col-md-12">
      <div className="bs-grid">
        <div className="popup-gallery grid-wrapper">
          {reviews.length > 0 ? (
            reviews.map((review) => (
              <div className="grid-item" key={review.id}>
                <div className="reviewCard">
                  <div className="img-box overflow-hidden">
                    <Image
                      className="lazyload self-img"
                      src="/images/brand-maratha/customer/default.jpg" // Placeholder image
                      layout="responsive"
                      width={100}
                      height={0}
                      alt="Customer Review"
                    />
                    <div className="card-body">
                      <div className="name">{review.user_name}</div>
                      <div className="date">{new Date(review.created_at).toLocaleDateString()}</div>
                      <div className="rating">
  {[...Array(review.rating)].map((_, index) => (
    <i key={index} className="icon-start" />
  ))}
</div>
                      <div className="comment">{review.review}</div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p>No reviews available</p>
          )}
        </div>
      </div>
    </div>
          <div className="col-md-12">
            <div class="tf-pagination-wrap view-more-button text-center">
              {/* <button class="tf-btn-loading tf-loading-default style-2 btn-loadmore  ">
                <span class="text">View All Review</span>
              </button> */}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default WriteReview;
