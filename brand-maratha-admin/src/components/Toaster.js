import React from "react";
import { Bounce, ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export const notify = (msg) =>
    toast(msg, {
        position: "bottom-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        transition: Bounce,
        theme: 'dark'
    });
const Toaster = () => {
    return <ToastContainer />;
};

export default Toaster;
