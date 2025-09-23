"use client";
import Features from "@/components/homes/home/Features";
import Footer1 from "@/components/footers/Footer1";
import Header from "@/components/headers/Header";
import Topbar1 from "@/components/headers/Topbar1";
import Categories from "@/components/homes/home/Categories";
import Hero from "@/components/homes/home-1/Hero";
import Products from "@/components/homes/home/Products";
import Explore from "@/components/homes/home/explore";
import Collections2 from "@/components/homes/home/Collections2";
import AboutSection from "@/components/homes/home/about";
import Brands from "@/components/homes/home/Brands";
import InstagramDetails from "@/components/homes/home/Instagram";
import { useEffect, useState } from "react";
import { fetchInstagram } from "@/utlis/apiService";

export default function Home() {
    const [products, setProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    useEffect(() => {
        async function handleProducts() {
            setIsLoading(true);

            try {
                const result = await fetchInstagram();
                setProducts(result);
            } catch (err) {
                const { message, error } = err?.response?.data || "";
                setErrorMessage(message || error || "Failed to load");
            } finally {
                setIsLoading(false);
            }
        }

        handleProducts();
    }, []);

    if (isLoading) return;
    return (
        <>
            <div className="homepage-ui">
                <Topbar1 />
                <Header />
                <Hero />
                <Categories />
                <Products />
                <Explore />
                <Collections2 />
                <div className="custom-margin-about-section">
                    <AboutSection
                        headingKey="about_us"
                        contentKey="about_us_content"
                        buttonKey="read_more"
                    />
                </div>
                <InstagramDetails
                    product={products}
                    errorMessage={errorMessage}
                />
                <Brands />
                <Footer1 />
            </div>
        </>
    );
}
