"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import APP_URL from "@/utlis/config";
import { useParams } from "next/navigation";
import API_BASE_URL, { getOrderDetails, fetchShipmentTracking } from "@/utlis/apiService";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Link from "next/link";
import { toast } from "react-toastify";
export default function OrderDetails() {

  const [order, Setorder] = useState([]);
  const [trackingLogs, setTrackingLogs] = useState([]);
  const { id } = useParams();
  useEffect(() => {
    const tabs = () => {
      document.querySelectorAll(".widget-tabs").forEach((widgetTab) => {
        const titles = widgetTab.querySelectorAll(
          ".widget-menu-tab .item-title"
        );

        titles.forEach((title, index) => {
          title.addEventListener("click", () => {
            // Remove active class from all menu items
            titles.forEach((item) => item.classList.remove("active"));
            // Add active class to the clicked item
            title.classList.add("active");

            // Remove active class from all content items
            const contentItems = widgetTab.querySelectorAll(
              ".widget-content-tab > *"
            );
            contentItems.forEach((content) =>
              content.classList.remove("active")
            );

            // Add active class and fade-in effect to the matching content item
            const contentActive = contentItems[index];
            contentActive.classList.add("active");
            contentActive.style.display = "block";
            contentActive.style.opacity = 0;
            setTimeout(() => (contentActive.style.opacity = 1), 0);

            // Hide all siblings' content
            contentItems.forEach((content, idx) => {
              if (idx !== index) {
                content.style.display = "none";
              }
            });
          });
        });
      });
    };

    // Call the function to initialize the tabs
    tabs();

    // Clean up event listeners when the component unmounts
    return () => {
      document
        .querySelectorAll(".widget-menu-tab .item-title")
        .forEach((title) => {
          title.removeEventListener("click", () => { });
        });
    };
  }, []);

  const fetchOrder = async () => {
    try {
      const data = await getOrderDetails(id); // API endpoint

      console.log("Fetched Order Data:", data); // Debugging
      Setorder(data);
    } catch (error) {
      console.error("Error fetching order:", error);
    } finally {

    }
  };
  useEffect(() => {
    fetchOrder();
  }, []);
  useEffect(() => {
    if (order?.courier_tracking_id) {
      fetchData();
    }
  }, [order]);

  const fetchData = async () => {
    const awbNumber = order?.courier_tracking_id;
    const res = await fetchShipmentTracking(awbNumber);
    console.log("Tracking API Response:", res); // 👈 ADD THIS
    console.log("Tracking id:", awbNumber)

    if (res?.ShipmentLogDetails) {
      setTrackingLogs(res.ShipmentLogDetails);
    } else {
      setTrackingLogs([]); // fallback if no data
    }
  };

  useEffect(() => {

    fetchData(); // If fetchData depends on dropaddress, consider passing it

  }, []);

  const getEmailFromToken = () => {
    const token = localStorage.getItem("token"); // or whatever key you use
    if (!token) return null;

    try {
      const base64Payload = token.split('.')[1];
      const decodedPayload = JSON.parse(atob(base64Payload));
      return decodedPayload.email || null;
    } catch (err) {
      console.error("Failed to decode token:", err);
      return null;
    }
  };
  const name = () => {
    const token = localStorage.getItem("token"); // or whatever key you use
    if (!token) return null;

    try {
      const base64Payload = token.split('.')[1];
      const decodedPayload = JSON.parse(atob(base64Payload));
      return decodedPayload.name || null;
    } catch (err) {
      console.error("Failed to decode token:", err);
      return null;
    }
  };
  const mobile = () => {
    const token = localStorage.getItem("token"); // or whatever key you use
    if (!token) return null;

    try {
      const base64Payload = token.split('.')[1];
      const decodedPayload = JSON.parse(atob(base64Payload));
      return decodedPayload.mobile || null;
    } catch (err) {
      console.error("Failed to decode token:", err);
      return null;
    }
  };
  console.log(mobile)

  const email = getEmailFromToken();
  const namee = name();
  const mob = mobile();
  const pickupAddress = {
    Address: order?.address?.street_address,
    City: order?.address?.city,
    EmailID: email,
    Name: namee,
    PinCode: order?.address?.zip_code,
    State: order?.address?.state,
    Type: "Primary",
  };
  console.log(pickupAddress)
  const pickupContact = {
    PhoneNo: mob,
    Type: "Primary",
    VirtualNumber: null,
  };


  const handleReverseShipment = async (pickupDetails) => {
    const brand = order?.order_products[0]?.brand;
    const pp = brand?.contact_phone;
    const dropaddress = {
      Address: brand?.pickup_address || '',
      City: brand?.pickup_city || '',
      EmailID: brand?.contact_email || '',
      Name: brand?.brand_name || '',
      PinCode: brand?.pickup_pincode || '',
      State: brand?.pickup_state || '',
      Type: "Primary",
    };

    console.log("Drop addr", dropaddress);
    const shipmentPayload = {
      AirWayBillNO: order?.courier_tracking_id,
      OrderNo: order?.courier_tracking_id,
      BusinessAccountName: "BRANDMARATHA",
      ProductID: order?.order_products?.product_id,
      Quantity: "1",
      ProductName: order?.order_products?.name,
      DropDetails: {
        Addresses: [dropaddress],
        ContactDetails: [
          {
            Type: "Primary",
            PhoneNo: pp,
          },
        ],
      },
      PickupDetails: {
        Addresses: [pickupAddress],
        ContactDetails: [pickupContact],

      },
      GSTMultiSellerInfo: [
        {
          SellerName: brand?.brand_name,
          SellerAddress: brand?.pickup_address,
          SellerPincode: brand?.pickup_pincode,
          HSNDetails: [
            {
              HSNCode: order?.order_products?.hsn_code,
              ProductCategory: order?.order_products?.category_title,
              ProductDesc: order?.order_products?.desc,
            },
          ],
        },
      ],
    };
    console.log(shipmentPayload);

    try {
      const response = await fetch(`${API_BASE_URL}/shipment/reverse-shipment`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(shipmentPayload),
      });

      const result = await response.json();
      console.log("📦 Reverse Shipment Result:", result);

      if (result.ReturnCode === 100) {
        toast.success("Reverse shipment created successfully!");
      } else {
        toast.error(` Failed: ${result.ReturnMessage || "Something went wrong"}`);
      }
    } catch (error) {
      console.error(" Reverse shipment error:", error);
      toast.error(" Network or server error");
    }
  };


  return (
    <div className="wd-form-order">
      <div className="order-head">
        <ToastContainer position="top-right" autoClose={3000} />
        <figure className="img-product">
          {order?.order_products?.length > 0 ? (
            <Image
              alt="product"
              src={`${APP_URL}/${order.order_products[0].thumbnail_image}`}
              width="313"
              height="437"
            />
          ) : (
            <p>No Image Available</p> // Fallback text if no product exists
          )}
        </figure>
        <div className="content">
          <div className="badge">{order.status}</div>
          <h6 className="mt-8 fw-5">#{order.id}</h6>
        </div>
      </div>
      <div className="tf-grid-layout md-col-2 gap-15">
        <div className="item">
          <div className="text-2 text_black-2">Courier Description</div>
          <div className="text-2 mt_4 fw-6">{order.courier_description}</div>
        </div>
        <div className="item">
          <div className="text-2 text_black-2">Courier</div>
          <div className="text-2 mt_4 fw-6">{order.courier}</div>
        </div>
        <div className="item">
          <div className="text-2 text_black-2">Order Date</div>
          <div className="text-2 mt_4 fw-6">{new Date(order.created_at).toLocaleDateString()}</div>
        </div>
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault(); // prevent page reload
            handleReverseShipment();
          }}
          className="tf-btn btn-fill animate-hover-btn rounded-0 justify-content-center"
        >
          <span>Return Product</span>
        </a>

        <div className="item">
          <div className="text-2 text_black-2">Address</div>
          <div className="text-2 mt_4 fw-6">
            {order?.address?.street_address}, {order?.address?.city}, {order?.address?.state} - {order?.address?.zip_code}, {order?.address?.country}
          </div>
        </div>
      </div>
      <div className="widget-tabs style-has-border widget-order-tab">
        <ul className="widget-menu-tab">
          <li className="item-title active">
            <span className="inner">Order History</span>
          </li>
          <li className="item-title">
            <span className="inner">Item Details</span>
          </li>
          <li className="item-title">
            <span className="inner">Courier</span>
          </li>
          <li className="item-title">
            <span className="inner">Receiver</span>
          </li>
        </ul>
        <div className="widget-content-tab">
          <div className="widget-content-inner active">
            <div className="widget-timeline">
              <ul className="timeline">
                {trackingLogs?.length > 0 ? (
                  trackingLogs?.map((log, idx) => (
                    <li key={idx}>
                      <div className={`timeline-badge ${idx === 0 ? "success" : ""}`} />
                      <div className="timeline-box">
                        <a className="timeline-panel" href="#">
                          <div className="text-2 fw-6">{log.Process}</div>
                          <span>{log.ShipmentStatusDateTime}</span>
                        </a>
                        <p>
                          <strong>Description:</strong> {log.Description}
                        </p>
                        <p>
                          <strong>Location:</strong> {log.City}, {log.State}
                        </p>
                        <p>
                          <strong>Hub:</strong> {log.HubLocation}
                        </p>
                      </div>
                    </li>
                  ))
                ) : (
                  <li>
                    <div className="timeline-box">
                      <p>No tracking data available.</p>
                    </div>
                  </li>
                )}
              </ul>
            </div>
          </div>
          <div className="widget-content-inner">
            <div className="order-products">
              {order.order_products && order.order_products.length > 0 ? (
                order.order_products.map((product, index) => (
                  <div className="order-head" key={index}>
                    <figure className="img-product">
                      <img
                        alt="product-image"
                        src={`${APP_URL}/${product.thumbnail_image}`} // Dynamic Image
                        width="720"
                        height="1005"
                      />
                    </figure>
                    <div className="content">
                      <div className="text-2 fw-6">{product.name}</div>
                      <div className="mt_4">
                        <span className="fw-6">Price :</span> Rs. {product.price}
                      </div>
                      <div className="mt_4">
                        <span className="fw-6">Size :</span> {product.size}
                      </div>
                      <div className="mt_4">
                        <span className="fw-6">Color :</span> {product.color}
                      </div>
                      <div className="mt_4">
                        <span className="fw-6">Quantity :</span> {product.quantity}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p>No products found.</p>
              )}
            </div>

            <ul>
              {/* <li className="d-flex justify-content-between text-2">
                <span>Total Price</span>
                <span className="fw-6">Rs.28.95</span>
              </li> */}
              {/* <li className="d-flex justify-content-between text-2 mt_4 pb_8 line">
                <span>Total Discounts</span>
                <span className="fw-6">Rs.10.00</span>
              </li> */}
              <li className="d-flex justify-content-between text-2 mt_8">
                <span>Order Total</span>
                <span className="fw-6">
                  Rs.{" "}
                  {order?.order_products?.reduce(
                    (total, product) => total + product.quantity * parseFloat(product.price),
                    0
                  ).toFixed(2)}
                </span>
              </li>

            </ul>
          </div>
          <div className="widget-content-inner">
            <p>
              Our courier service is dedicated to providing fast, reliable, and
              secure delivery solutions tailored to meet your needs. Whether
              you're sending documents, parcels, or larger shipments, our team
              ensures that your items are handled with the utmost care and
              delivered on time. With a commitment to customer satisfaction,
              real-time tracking, and a wide network of routes, we make it easy
              for you to send and receive packages both locally and
              internationally. Choose our service for a seamless and efficient
              delivery experience.
            </p>
          </div>
          <div className="widget-content-inner">
            <p className="text-2 text_success">
              Thank you Your order has been received
            </p>
            <ul className="mt_20">
              <li>
                Order Number : <span className="fw-7">#{order.id}</span>
              </li>
              <li>
                Date : <span className="fw-7"> {new Date(order.created_at).toLocaleDateString()}</span>
              </li>
              <li>
                Total : <span className="fw-7">Rs.{" "}
                  {order?.order_products?.reduce(
                    (total, product) => total + product.quantity * parseFloat(product.price),
                    0
                  ).toFixed(2)}</span>
              </li>
              <li>
                Payment Methods : <span className="fw-7">Prepaid</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}