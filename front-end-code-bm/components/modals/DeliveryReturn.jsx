import React from "react";
import { useEffect, useState } from "react";
import { fetchdelivery } from "@/utlis/apiService";


export default function DeliveryReturn() {

  const [delivery, SetDelivery] = useState([]);

  const getdelivery = async () => {
      const data = await fetchdelivery();
      SetDelivery(data);
    };
  
    useEffect(() => {
      getdelivery();
    }, []);
  return (
    <div
      className="modal modalCentered fade modalDemo tf-product-modal modal-part-content"
      id="delivery_return"
    >
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="header">
            <div className="demo-title">Shipping &amp; Delivery</div>
            <span
              className="icon-close icon-close-popup"
              data-bs-dismiss="modal"
            />
          </div>
          <div className="overflow-y-auto">
            {delivery.content}
          </div>
        </div>
      </div>
    </div>
  );
}
