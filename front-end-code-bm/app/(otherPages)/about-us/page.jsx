import Footer1 from "@/components/footers/Footer1";
import Header from "@/components/headers/Header";
import About from "@/components/othersPages/about/About";
import Features from "@/components/othersPages/about/Features";
import FlatTitle from "@/components/othersPages/about/FlatTitle";
import Hero from "@/components/othersPages/about/Hero";
// import ShopGram from "@/components/othersPages/about/ShopGram";
import Testimonials from "@/components/othersPages/about/Testimonials";
import AboutSection from "@/components/homes/home/about";
// import Brands from "@/components/homes/home/Brands";
// import InstagramDetails from "@/components/homes/home/Instagram";
import React from "react";
import Topbar1 from "@/components/headers/Topbar1";

export const metadata = {
    title: "About Us || Brand Maratha ",
    description: "Brand Maratha",
};

export default function page() {
    return (
        <>
            <Topbar1 />
            <Header />
            <Hero />
            <FlatTitle />
            <About />
            <div className="custom-margin-about-section removeBtn">
                <AboutSection
                    headingKey="our_mission"
                    contentKey="our_mission_content"
                    buttonKey="read_more"
                />
            </div>
            <Testimonials />
            <Features />
            {/* <InstagramDetails /> */}
            {/* <Brands /> */}
            {/* <ShopGram /> */}
            <Footer1 />
        </>
    );
}
