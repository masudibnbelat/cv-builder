import Footer from "@/src/components/Footer/Footer";
import Navbar from "@/src/components/Navbar/Navbar";
import React from "react";

const MainLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <main className="container mx-auto">
      <Navbar />
      {children}
      <Footer />
    </main>
  );
};

export default MainLayout;
