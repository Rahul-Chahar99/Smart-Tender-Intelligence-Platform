import React from "react";
import { Link } from "react-router-dom";

function Footer() {
  return (
    <section className="relative overflow-hidden py-10 bg-[#111111] border-t border-[#2a2a2a]">
      <div className="relative z-10 mx-auto max-w-7xl px-4">
        <div className="flex flex-wrap justify-between">
          <div className="w-full p-6 lg:w-3/12"></div>
          <div className="w-full p-6 lg:w-3/12">
            <div className="h-full">
              <h3 className="tracking-px mb-9 text-xs font-semibold uppercase text-[#a3a3a3]">
                Company
              </h3>
              <ul>
                <li className="mb-4">
                  <Link className="text-base font-medium text-[#f5f5f0] hover:text-white transition" to="/">Features</Link>
                </li>
                <li className="mb-4">
                  <Link className="text-base font-medium text-[#f5f5f0] hover:text-white transition" to="/">Pricing</Link>
                </li>
                <li className="mb-4">
                  <Link className="text-base font-medium text-[#f5f5f0] hover:text-white transition" to="/">Affiliate Program</Link>
                </li>
                <li className="mb-4">
                  <Link className="text-base font-medium text-[#f5f5f0] hover:text-white transition" to="/about">About Us</Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="w-full p-6 lg:w-3/12">
            <div className="h-full">
              <h3 className="tracking-px mb-9 text-xs font-semibold uppercase text-[#a3a3a3]">
                Support
              </h3>
              <ul>
                <li className="mb-4">
                  <Link className="text-base font-medium text-[#f5f5f0] hover:text-white transition" to="/">Account</Link>
                </li>
                <li className="mb-4">
                  <Link className="text-base font-medium text-[#f5f5f0] hover:text-white transition" to="/">Help</Link>
                </li>
                <li className="mb-4">
                  <Link className="text-base font-medium text-[#f5f5f0] hover:text-white transition" to="/contact">Contact US</Link>
                </li>
                <li className="mb-4">
                  <Link className="text-base font-medium text-[#f5f5f0] hover:text-white transition" to="/">Customer Support</Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="w-full p-6 lg:w-3/12">
            <div className="h-full">
              <h3 className="tracking-px mb-9 text-xs font-semibold uppercase text-[#a3a3a3]">
                Legal
              </h3>
              <ul>
                <li className="mb-4">
                  <Link className="text-base font-medium text-[#f5f5f0] hover:text-white transition" to="/">Terms & Conditions</Link>
                </li>
                <li className="mb-4">
                  <Link className="text-base font-medium text-[#f5f5f0] hover:text-white transition" to="/">Privacy Policy</Link>
                </li>
                <li className="mb-4">
                  <Link className="text-base font-medium text-[#f5f5f0] hover:text-white transition" to="/">Licensing</Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div className="border-t border-[#2a2a2a] pt-6 mt-6">
          <p className="text-sm text-[#a3a3a3] text-center">
            &copy; Copyright 2025. All Rights Reserved by Rahul Chahar.
          </p>
        </div>
      </div>
    </section>
  );
}

export default Footer;
