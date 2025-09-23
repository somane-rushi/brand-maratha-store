"use client";
import { useContextElement } from "@/context/Context";
import Image from "next/image";
import { useRouter } from "next/router";
import Link from "next/link";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useState, useEffect } from "react";
import {
    fetchcartproducts,
    initiateOrder,
    verifyPayment,
    fetchproducts,
    fetchAddresses,
} from "@/utlis/apiService";
import { removeItemFromCart, updateCartQuantity } from "@/utlis/apiService";
import APP_BASE_URL from "@/utlis/apiService";
import APP_URL from "@/utlis/config";

export default function Checkout() {
    const { setCartProducts, totalPrice } = useContextElement();
    const [cartItems, setCartItems] = useState([]);
    const [cart, setCart] = useState([]);
    const [loading, setLoading] = useState(false);
    // const [orderId, setOrderId] = useState(null);
    const [addresses, setAddresses] = useState([]);
    const [selectedAddress, setSelectedAddress] = useState(null);
    const [isChecked, setIsChecked] = useState(false);
    const [awbNumber, setAwbNumber] = useState("");

    const userId =
        typeof window !== "undefined" ? localStorage.getItem("id") : "";

    useEffect(() => {
        const fetchCartItems = async () => {
            const items = await fetchcartproducts(userId);
            setCartItems(items);
        };
        fetchCartItems();
    }, []);

    const calculateTotalPrice = (cartItems) => {
        return cartItems.reduce((total, item) => {
            return total + item.quantity * parseFloat(item.price);
        }, 0);
    };

    const getCartProductss = async () => {
        const id = localStorage.getItem("id");
        if (!id) return;

        try {
            const data = await fetchcartproducts(id);

            // Fetch product details for each cart item
            const updatedCart = await Promise.all(
                data.map(async (item) => {
                    const productDetails = await fetchproducts(item.product_id);
                    return {
                        ...item,
                        name: productDetails.name,
                        imgSrc: productDetails.thumbnail_image,
                    };
                })
            );
            console.log("Fetched cart data:", data);
            setCart(updatedCart);
        } catch (error) {
            console.error("Error fetching cart products:", error);
        }
    };
    const removeItemm = async (id) => {
        const userId = localStorage.getItem("id");
        console.log("👉 Trying to remove item with ID:", id); // Log the value
        if (!userId || !id) {
            console.error("❌ Missing userId or cart item ID:", { userId, id });
            return;
        }

        const result = await removeItemFromCart(userId, id);

        console.log("🧾 Remove API Result:", result);

        if (result.message) {
            const updatedCart = cart.filter((item) => item.id !== id);
            setCart(updatedCart);
            setCartProducts(updatedCart);
            getCartProductss();
        } else {
            console.error("❌ Failed to remove item:", result.message);
        }
    };

    useEffect(() => {
        const getAddresses = async () => {
            const data = await fetchAddresses(userId);
            setAddresses(data);
            if (data.length > 0) {
                setSelectedAddress(data[0].id); // Default selection
            }
        };
        getAddresses();
    }, [userId]);

    const totalPricee = calculateTotalPrice(cartItems);

    const loadRazorpayScript = () => {
        return new Promise((resolve) => {
            if (window.Razorpay) {
                resolve(true);
                return;
            }

            const script = document.createElement("script");
            script.src = "https://checkout.razorpay.com/v1/checkout.js";
            script.onload = () => resolve(true);
            script.onerror = () => resolve(false);
            document.body.appendChild(script);
        });
    };

    const getCartProducts = async () => {
        const id = localStorage.getItem("id");
        if (!id) return;

        try {
            const data = await fetchcartproducts(id);

            // Fetch product details for each cart item
            const updatedCart = await Promise.all(
                data.map(async (item) => {
                    const productDetails = await fetchproducts(item.product_id);
                    return {
                        ...item,
                        name: productDetails.name,
                        imgSrc: productDetails.thumbnail_image,
                    };
                })
            );

            setCart(updatedCart);
        } catch (error) {
            console.error("Error fetching cart products:", error);
        }
    };

    useEffect(() => {
        getCartProducts();
        getCartProductss();
    }, []);

    // const handlePayment = async () => {
    //     if (!cartItems.length) {
    //         alert("Your cart is empty!");
    //         return;
    //     }
    //     const fetchAWB = async () => {
    //         try {
    //             const res = await fetch(`${APP_BASE_URL}/getNextAwb`);
    //             const data = await res.json();

    //             if (data.success) {
    //                 setAwbNumber(data.awb_number);
    //                 return data.awb_number;
    //             } else {
    //                 setError(data.message || "Failed to get AWB");
    //             }
    //         } catch (err) {
    //             console.error("Error fetching AWB:", err);
    //             setError("Something went wrong while fetching AWB");
    //         } finally {
    //             setLoading(false);
    //         }
    //     };
    //     const awb = await fetchAWB();
    //     console.log("AWB :", awb);
    //     if (!awb) {
    //         toast.error("AWB number is not yet available.");
    //         return;
    //     }

    //     setLoading(true);
    //     try {
    //         // Step 1: Prepare Order Payload
    //         const razorpayLoaded = await loadRazorpayScript();
    //         if (!razorpayLoaded) {
    //             throw new Error("Failed to load Razorpay SDK.");
    //         }
    //         const selectedAddressDetails = addresses.find(
    //             (addr) => addr.id === selectedAddress
    //         );
    //         if (!selectedAddressDetails) {
    //             alert("Please select a valid address.");
    //             return;
    //         }
    //         const orderData = {
    //             user_id: userId,
    //             address_id: selectedAddress,
    //             full_name: selectedAddressDetails.full_name, // Extract from address
    //             phone: selectedAddressDetails.phone,
    //             total_price: totalPricee,
    //             status: "Processing",
    //             courier: "Xbees",
    //             courier_description: "Standard delivery",
    //             courier_tracking_id: awb,
    //             products: [{
    //                 product_id: item.product_id,
    //                 size: item.size,
    //                 color: item.color,
    //                 quantity: item.quantity,
    //             }],
    //         };

    //         // Step 2: Initiate Order
    //         console.log("🚀 Initiating Order with:", orderData);
    //         const initiateData = await initiateOrder(orderData);
    //         console.log("✅ Order Initiation Response:", initiateData);

    //         // **Check if response contains `razorpayOrder`**
    //         if (!initiateData || !initiateData.razorpayOrder) {
    //             console.error(
    //                 "❌ Missing `razorpayOrder` in response:",
    //                 initiateData
    //             );
    //             throw new Error("Invalid order response");
    //         }

    //         // **Extract order details from `razorpayOrder`**
    //         const {
    //             id: order_id,
    //             amount,
    //             currency,
    //         } = initiateData.razorpayOrder;
    //         console.log("✅ Extracted Order ID:", order_id);
    //         console.log("✅ Extracted Amount:", amount);
    //         console.log("✅ Extracted Currency:", currency);

    //         setOrderId(order_id);
    //         const paymentDate = new Date().toISOString();
    //         // Step 3: Razorpay Checkout
    //         const options = {
    //             key: process.env.NEXT_PUBLIC_RAZORPAY_KEY,
    //             amount: amount,
    //             currency,
    //             name: "Brandmaratha",
    //             description: "Order Payment",
    //             order_id,
    //             handler: async function (response) {
    //                 console.log("✅ Razorpay Response:", response);
    //                 const paymentData = {
    //                     razorpay_payment_id: response.razorpay_payment_id,
    //                     razorpay_order_id: response.razorpay_order_id,
    //                     razorpay_signature: response.razorpay_signature,
    //                 };

    //                 try {
    //                     const verifyResponse = await verifyPayment(
    //                         paymentData,
    //                         orderData
    //                     );
    //                     console.log("✅ Payment Verified:", verifyResponse);
    //                     const getEmailFromToken = () => {
    //                         const token = localStorage.getItem("token"); // or whatever key you use
    //                         if (!token) return null;

    //                         try {
    //                             const base64Payload = token.split('.')[1];
    //                             const decodedPayload = JSON.parse(atob(base64Payload));
    //                             return decodedPayload.email || null;
    //                         } catch (err) {
    //                             console.error("Failed to decode token:", err);
    //                             return null;
    //                         }
    //                     };

    //                     const email = getEmailFromToken();
    //                     const dropAddress = {
    //                         Address: selectedAddressDetails.street_address,
    //                         City: selectedAddressDetails.city,
    //                         EmailID: email,
    //                         Name: selectedAddressDetails.full_name,
    //                         PinCode: selectedAddressDetails.zip_code,
    //                         State: selectedAddressDetails.state,
    //                         Type: "Primary",
    //                     };
    //                     console.log(dropAddress)

    //                     const dropContact = {
    //                         PhoneNo: selectedAddressDetails.phone,
    //                         Type: "Primary",
    //                         VirtualNumber: null,
    //                     };
    //                     const shipmentPayload = {
    //                         AirWayBillNO: awbNumber,
    //                         BusinessAccountName: "BRANDMARATHA",
    //                         OrderNo: order_id,
    //                         SubOrderNo: order_id,
    //                         OrderType: "PrePaid",
    //                         CollectibleAmount: "0",
    //                         DeclaredValue: orderData.total_price,
    //                         PickupType: "Vendor",
    //                         Quantity: "1",
    //                         ServiceType: "SD",
    //                         DropDetails: {
    //                             Addresses: [dropAddress],
    //                             ContactDetails: [dropContact],
    //                         },
    //                         PickupDetails: {
    //                             Addresses: [
    //                                 {
    //                                     Address: "Insignia, S K Bole Road",
    //                                     City: "Dadar(W), Mumbai",
    //                                     EmailID: "",
    //                                     Name: "Brandmaratha Studio Pvt. Ltd",
    //                                     PinCode: "400028",
    //                                     State: "Maharashtra",
    //                                     Type: "Primary",
    //                                 },
    //                             ],
    //                             ContactDetails: [
    //                                 {
    //                                     PhoneNo: "2231645644",
    //                                     Type: "Primary",
    //                                 },
    //                             ],
    //                             PickupVendorCode: "ORUF1THL3Y0SJ",
    //                         },
    //                         RTODetails: {
    //                             Addresses: [
    //                                 {
    //                                     Address: "Kalyan",
    //                                     City: "Kalyan",
    //                                     EmailID: "gautamjethe@gmail.com",
    //                                     Name: "Test",
    //                                     PinCode: "421301",
    //                                     State: "Maharashtra",
    //                                     Type: "Primary",
    //                                 },
    //                             ],
    //                             ContactDetails: [
    //                                 {
    //                                     PhoneNo: "2231645644",
    //                                     Type: "Primary",
    //                                 },
    //                             ],
    //                         },
    //                         Instruction: "",
    //                         ManifestID: order_id,
    //                         GSTMultiSellerInfo: [
    //                             {
    //                                 BuyerGSTRegNumber: "29AAACU1901H1ZK",

    //                                 SellerAddress: "Police station Karol bagh",
    //                                 SellerGSTRegNumber: "06ATESTD8136E1ZV",
    //                                 SellerName: "Excellent Traders",
    //                                 SellerPincode: "411001",

    //                                 HSNDetails: [
    //                                     {
    //                                         ProductCategory: "Electronics",
    //                                         ProductDesc: "Mobile",
    //                                         HSNCode: "76",

    //                                     },
    //                                 ],
    //                             },
    //                         ],
    //                     };

    //                     // 3. Make API Call to Your Backend
    //                     try {
    //                         const shipmentResponse = await fetch(`${APP_BASE_URL}/shipment/create-shipment`, {
    //                             method: "POST",
    //                             headers: {
    //                                 "Content-Type": "application/json",
    //                             },
    //                             body: JSON.stringify(shipmentPayload),
    //                         });

    //                         const shipmentResult = await shipmentResponse.json();
    //                         console.log("✅ Shipment Created:", shipmentResult);
    //                     } catch (err) {
    //                         console.error("❌ Error Creating Shipment:", err);
    //                     }
    //                     const query = new URLSearchParams({
    //                         razorpay_payment_id: response.razorpay_payment_id,
    //                         razorpay_order_id: response.razorpay_order_id,
    //                         razorpay_signature: response.razorpay_signature,
    //                         date: paymentDate,
    //                     }).toString();
    //                     cartItems.map((item) => removeItemm(item.id));
    //                     window.location.href = `/payment-confirmation?${query}`;
    //                     // Clear the cart
    //                 } catch (error) {
    //                     console.error("❌ Payment Verification Failed:", error);
    //                     toast.error("Payment verification failed! Contact support.");
    //                 }
    //             },
    //             theme: { color: "#3399cc" },
    //         };

    //         console.log("✅ Razorpay Checkout Options:", options);
    //         const razor = new window.Razorpay(options);
    //         razor.open();
    //     } catch (error) {
    //         console.error("❌ Error in Payment:", error);
    //         alert("Payment failed, please try again.");
    //     } finally {
    //         setLoading(false);
    //     }
    // };

    //     const handlePayment = async () => {
    //     if (!cartItems.length) return toast.error("Cart is empty");

    //     const selectedAddressDetails = addresses.find(addr => addr.id === selectedAddress);
    //     if (!selectedAddressDetails) return toast.error("Invalid address");

    //     //const totalAmount = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    //     const email = (() => {
    //         try {
    //             const token = localStorage.getItem("token");
    //             if (!token) return null;
    //             const payload = JSON.parse(atob(token.split('.')[1]));
    //             return payload.email;
    //         } catch {
    //             return null;
    //         }
    //     })();

    //     setLoading(true);

    //     try {
    //         await loadRazorpayScript();

    //         // Create Razorpay order for total cart
    //         const razorpayOrder = await initiateOrder({ amount: totalPricee });
    //         const { id: order_id, amount, currency } = razorpayOrder;

    //         const options = {
    //             key: process.env.NEXT_PUBLIC_RAZORPAY_KEY,
    //             amount,
    //             currency,
    //             name: "Brandmaratha",
    //             description: "Cart Payment",
    //             order_id,
    //             handler: async function (response) {
    //                 try {
    //                     const paymentData = {
    //                         razorpay_payment_id: response.razorpay_payment_id,
    //                         razorpay_order_id: response.razorpay_order_id,
    //                         razorpay_signature: response.razorpay_signature,
    //                     };

    //                     // Verify payment
    //                     await verifyPayment(paymentData);

    //                     // Loop through each cart item and:
    //                     for (const item of cartItems) {
    //                         // Step 1: Get AWB
    //                         const awbRes = await fetch(`${APP_BASE_URL}/getNextAwb`);
    //                         const awbData = await awbRes.json();
    //                         const awbNumber = awbData.data.awb_number;

    //                         // Step 2: Create system order
    //                         const orderData = {
    //                             user_id: userId,
    //                             address_id: selectedAddress,
    //                             full_name: selectedAddressDetails.full_name,
    //                             phone: selectedAddressDetails.phone,
    //                             total_price: parseFloat(item.price) * item.quantity,
    //                             status: "Processing",
    //                             courier: "Xbees",
    //                             courier_description: "Standard delivery",
    //                             courier_tracking_id: awbNumber,
    //                             products: [{
    //                                 product_id: item.product_id,
    //                                 size: item.size,
    //                                 color: item.color,
    //                                 quantity: item.quantity,
    //                             }],
    //                         };

    //                         await fetch(`${APP_BASE_URL}/order/create`, {
    //                             method: "POST",
    //                             headers: { "Content-Type": "application/json" },
    //                             body: JSON.stringify(orderData),
    //                         });

    //                         // Step 3: Create shipment
    //                         // const shipmentPayload = {
    //                         //     AirWayBillNO: awbNumber,
    //                         //     BusinessAccountName: "BRANDMARATHA",
    //                         //     OrderNo: order_id,
    //                         //     SubOrderNo: order_id,
    //                         //     OrderType: "PrePaid",
    //                         //     CollectibleAmount: "0",
    //                         //     DeclaredValue: orderData.total_price,
    //                         //     PickupType: "Vendor",
    //                         //     Quantity: "1",
    //                         //     ServiceType: "SD",
    //                         //     DropDetails: {
    //                         //         Addresses: [{
    //                         //             Address: selectedAddressDetails.street_address,
    //                         //             City: selectedAddressDetails.city,
    //                         //             EmailID: email,
    //                         //             Name: selectedAddressDetails.full_name,
    //                         //             PinCode: selectedAddressDetails.zip_code,
    //                         //             State: selectedAddressDetails.state,
    //                         //             Type: "Primary",
    //                         //         }],
    //                         //         ContactDetails: [{
    //                         //             PhoneNo: selectedAddressDetails.phone,
    //                         //             Type: "Primary",
    //                         //         }],
    //                         //     },
    //                         //     PickupDetails: {
    //                         //         Addresses: [{
    //                         //             Address: "Insignia, S K Bole Road",
    //                         //             City: "Dadar(W), Mumbai",
    //                         //             EmailID: "",
    //                         //             Name: "Brandmaratha Studio Pvt. Ltd",
    //                         //             PinCode: "400028",
    //                         //             State: "Maharashtra",
    //                         //             Type: "Primary",
    //                         //         }],
    //                         //         ContactDetails: [{
    //                         //             PhoneNo: "2231645644",
    //                         //             Type: "Primary",
    //                         //         }],
    //                         //         PickupVendorCode: "ORUF1THL3Y0SJ",
    //                         //     },
    //                         //     RTODetails: {
    //                         //         Addresses: [{
    //                         //             Address: "Kalyan",
    //                         //             City: "Kalyan",
    //                         //             EmailID: "gautamjethe@gmail.com",
    //                         //             Name: "Test",
    //                         //             PinCode: "421301",
    //                         //             State: "Maharashtra",
    //                         //             Type: "Primary",
    //                         //         }],
    //                         //         ContactDetails: [{
    //                         //             PhoneNo: "2231645644",
    //                         //             Type: "Primary",
    //                         //         }],
    //                         //     },
    //                         //     Instruction: "",
    //                         //     ManifestID: order_id,
    //                         //     GSTMultiSellerInfo: [{
    //                         //         BuyerGSTRegNumber: "29AAACU1901H1ZK",
    //                         //         SellerAddress: "Police station Karol bagh",
    //                         //         SellerGSTRegNumber: "06ATESTD8136E1ZV",
    //                         //         SellerName: "Excellent Traders",
    //                         //         SellerPincode: "411001",
    //                         //         HSNDetails: [{
    //                         //             ProductCategory: "Electronics",
    //                         //             ProductDesc: "Mobile",
    //                         //             HSNCode: "76",
    //                         //         }],
    //                         //     }],
    //                         // };

    //                         await removeItemm(item.id);
    //                     }

    //                     // Redirect after successful handling
    //                     const query = new URLSearchParams({
    //                         razorpay_payment_id: response.razorpay_payment_id,
    //                         razorpay_order_id: response.razorpay_order_id,
    //                         razorpay_signature: response.razorpay_signature,
    //                         date: new Date().toISOString(),
    //                     }).toString();

    //                     window.location.href = `/payment-confirmation?${query}`;
    //                 } catch (err) {
    //                     console.error("Post-payment error:", err);
    //                     toast.error("Something went wrong after payment.");
    //                 }
    //             },
    //             theme: { color: "#3399cc" },
    //         };

    //         const razor = new window.Razorpay(options);
    //         razor.open();
    //     } catch (err) {
    //         console.error("Razorpay Error:", err);
    //         toast.error("Failed to initiate payment.");
    //     } finally {
    //         setLoading(false);
    //     }
    // };
    const handlePayment = async () => {
        if (!cartItems.length) {
            alert("Cart is empty!");
            return;
        }

        setLoading(true);

        try {
            const razorpayLoaded = await loadRazorpayScript();
            if (!razorpayLoaded) {
                alert("Razorpay SDK failed to load");
                return;
            }

            const selectedAddressDetails = addresses.find(
                (addr) => addr.id === selectedAddress
            );
            if (!selectedAddressDetails) {
                alert("Please select an address.");
                return;
            }

            // ✅ Step 1: Prepare combined order payload
            const totalAmount = cartItems.reduce(
                (acc, item) => acc + item.price * item.quantity,
                0
            );
            const productData = cartItems.map((item) => ({
                product_id: item.product_id,
                size: item.size,
                color: item.color,
                quantity: item.quantity,
            }));

            const combinedOrderData = {
                total_price: totalAmount,
                products: productData,
            };

            const response = await initiateOrder(combinedOrderData);

            if (!response.razorpayOrder) {
                toast.error(
                    response.message || "Failed to initiate Razorpay order"
                );
                setLoading(false);
                return;
            }
            const { razorpayOrder } = response;

            const options = {
                key: process.env.NEXT_PUBLIC_RAZORPAY_KEY,
                amount: razorpayOrder.amount,
                currency: razorpayOrder.currency,
                name: "Brandmaratha",
                description: "Payment for your order",
                order_id: razorpayOrder.id,
                handler: async function (rzpResponse) {
                    try {
                        console.log(
                            "🧾 Razorpay Payment Response:",
                            rzpResponse
                        );

                        const paymentData = {
                            razorpay_payment_id:
                                rzpResponse.razorpay_payment_id,
                            razorpay_order_id: rzpResponse.razorpay_order_id,
                            razorpay_signature: rzpResponse.razorpay_signature,
                        };

                        // Check if paymentData has all values
                        if (
                            !paymentData.razorpay_payment_id ||
                            !paymentData.razorpay_order_id ||
                            !paymentData.razorpay_signature
                        ) {
                            throw new Error("Incomplete payment data");
                        }

                        const selectedAddressDetails = addresses.find(
                            (addr) => addr.id === selectedAddress
                        );
                        if (!selectedAddressDetails) {
                            throw new Error("Selected address not found");
                        }
                        const fetchAWB = async () => {
                            try {
                                const res = await fetch(
                                    `${APP_BASE_URL}/getNextAwb`
                                );
                                const data = await res.json();

                                if (data.success) {
                                    setAwbNumber(data.awb_number);
                                    return data.awb_number;
                                } else {
                                    setError(
                                        data.message || "Failed to get AWB"
                                    );
                                }
                            } catch (err) {
                                console.error("Error fetching AWB:", err);
                                setError(
                                    "Something went wrong while fetching AWB"
                                );
                            } finally {
                                setLoading(false);
                            }
                        };

                        for (const item of cartItems) {
                            const awb = await fetchAWB();

                            const orderData = {
                                user_id: userId,
                                address_id: selectedAddress,
                                full_name: selectedAddressDetails.full_name,
                                phone: selectedAddressDetails.phone,
                                total_price: item.price * item.quantity,
                                status: "Processing",
                                courier: "Xbees",
                                courier_description: "Standard delivery",
                                courier_tracking_id: awb,
                                products: [
                                    {
                                        product_id: item.product_id,
                                        size: item.size,
                                        color: item.color,
                                        quantity: item.quantity,
                                    },
                                ],
                            };

                            await verifyPayment(paymentData, orderData);

                            removeItemm(item.id);
                            const query = new URLSearchParams({
                                razorpay_payment_id:
                                    rzpResponse.razorpay_payment_id,
                                razorpay_order_id:
                                    rzpResponse.razorpay_order_id,
                                razorpay_signature:
                                    rzpResponse.razorpay_signature,
                                date: new Date().toISOString(),
                            }).toString();

                            window.location.href = `/payment-confirmation?${query}`;
                        }

                        toast.success("Payment successful and orders placed");
                    } catch (error) {
                        toast.error(
                            "Something went wrong during order creation"
                        );
                    }
                },

                theme: { color: "#3399cc" },
            };

            const rzp = new window.Razorpay(options);
            rzp.open();
        } catch (err) {
            console.error("Payment initiation failed", err);
            toast.error("Failed to start payment");
        } finally {
            setLoading(false);
        }
    };

    return (
        <section className="flat-spacing-11">
            <div className="container">
                <div className="tf-page-cart-wrap layout-2">
                    <div className="tf-page-cart-item">
                        <h5 className="fw-5 mb_20">Billing details</h5>

                        {addresses.length > 0 ? (
                            <ul>
                                {addresses.map((address) => (
                                    <li
                                        key={address.id}
                                        className="billing-address-item"
                                    >
                                        <input
                                            type="radio"
                                            id={`address-${address.id}`}
                                            name="billingAddress"
                                            value={address.id}
                                            checked={
                                                selectedAddress === address.id
                                            }
                                            onChange={() =>
                                                setSelectedAddress(address.id)
                                            }
                                        />
                                        <label
                                            htmlFor={`address-${address.id}`}
                                        >
                                            {address.street_address},{" "}
                                            {address.city}, {address.state} -{" "}
                                            {address.zip_code}
                                        </label>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p>No saved addresses. Please add an address.</p>
                        )}
                    </div>
                    <div className="tf-page-cart-footer bs-checkout">
                        <div className="tf-cart-footer-inner">
                            <h5 className="fw-5 mb_20">Your order</h5>
                            <form
                                onSubmit={(e) => e.preventDefault()}
                                className="tf-page-cart-checkout widget-wrap-checkout"
                            >
                                <ul className="wrap-checkout-product">
                                    {cart.map((item, i) => (
                                        <li
                                            key={i}
                                            className="checkout-product-item"
                                        >
                                            <figure className="img-product">
                                                <Image
                                                    alt="product"
                                                    src={`${APP_URL}/${item.imgSrc}`}
                                                    width={720}
                                                    height={1005}
                                                />
                                                <span className="quantity">
                                                    {item.quantity}
                                                </span>
                                            </figure>
                                            <div className="content">
                                                <div className="info">
                                                    <p className="name fw-5">
                                                        {item.name}
                                                    </p>
                                                    <span className="variant">
                                                        {item.color} /{" "}
                                                        {item.size}
                                                    </span>
                                                </div>
                                                <span className="price">
                                                    Rs{" "}
                                                    {(
                                                        item.price *
                                                        item.quantity
                                                    ).toFixed(2)}
                                                </span>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                                {!cartItems.length && (
                                    <div className="container">
                                        <div className="row align-items-center mt-5 mb-5">
                                            <div className="col-12 fs-18">
                                                Your shop cart is empty
                                            </div>
                                            <div className="col-12 mt-3">
                                                <Link
                                                    href={`/shop-default`}
                                                    className="tf-btn btn-fill animate-hover-btn radius-3 w-100 justify-content-center"
                                                    style={{
                                                        width: "fit-content",
                                                    }}
                                                >
                                                    Explore Products!
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                )}
                                <div className="d-flex justify-content-between line pb_20">
                                    <h6 className="fw-5">Total</h6>
                                    <h6 className="total fw-5">
                                        Rs {totalPricee.toFixed(2)}
                                    </h6>
                                </div>
                                <div className="wd-check-payment">
                                    <div className="fieldset-radio mb_20">
                                        <input
                                            required
                                            type="radio"
                                            name="payment"
                                            id="bank"
                                            className="tf-check"
                                            defaultChecked
                                        />
                                        <label htmlFor="bank">Razorpay</label>
                                    </div>
                                    <p className="text_black-2 mb_20">
                                        Your personal data will be used to
                                        process your order, support your
                                        experience throughout this website, and
                                        for other purposes described in our
                                        <Link
                                            href={`/privacy-policy`}
                                            className="text-decoration-underline"
                                        >
                                            privacy policy
                                        </Link>
                                        .
                                    </p>
                                    <div className="box-checkbox fieldset-radio mb_20">
                                        <input
                                            required
                                            type="checkbox"
                                            id="check-agree"
                                            className="tf-check"
                                            checked={isChecked}
                                            onChange={() =>
                                                setIsChecked(!isChecked)
                                            }
                                        />
                                        <label
                                            htmlFor="check-agree"
                                            className="text_black-2"
                                        >
                                            I have read and agree to the website
                                            <Link
                                                href={`/terms-conditions`}
                                                className="text-decoration-underline"
                                            >
                                                {" "}
                                                terms and conditions{" "}
                                            </Link>
                                            .
                                        </label>
                                    </div>
                                </div>

                                <button
                                    type="button"
                                    className="tf-btn radius-3 btn-fill btn-icon animate-hover-btn justify-content-center"
                                    onClick={handlePayment}
                                    disabled={!isChecked}
                                >
                                    {loading ? "Processing..." : "Place Order"}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
