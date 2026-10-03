import React from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import {
  FaCar,
  FaShieldAlt,
  FaDollarSign,
  FaHeadset,
  FaCheckCircle,
  FaStar,
} from "react-icons/fa";

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-24 md:pt-32 pb-8 md:pb-16 bg-[#14213D] text-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-[0.9fr_1.1fr] gap-7 lg:gap-14 items-center">
            <div className="text-center md:text-left py-4 md:py-8">
              <p className="text-sm uppercase tracking-[0.18em] text-[#FCA311] font-semibold mb-5">Car rental, made simple</p>
              <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight text-white">
                The right car for
                <span className="block text-[#FCA311]">every road ahead.</span>
              </h1>
              <p className="text-lg mb-8 text-white leading-relaxed max-w-xl">
                Experience the freedom of the road with our premium fleet.
                Affordable prices, flexible terms, and excellent service.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                <Link
                  to="/vehicles"
                  className="bg-[#FCA311] text-[#14213D] px-7 py-3.5 rounded-md text-base font-bold hover:bg-white transition shadow-lg"
                >
                  Browse Vehicles
                </Link>
                <Link
                  to="/register"
                  className="border border-[#E5E5E5] text-white px-7 py-3.5 rounded-md text-base font-semibold hover:bg-white hover:text-[#14213D] transition"
                >
                  Get Started
                </Link>
              </div>
            </div>

            <div className="relative aspect-[16/10] md:aspect-auto md:min-h-[420px] overflow-hidden rounded-lg border border-[#E5E5E5]">
              <img
                src="https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1400&q=85"
                alt="Premium car ready for a road trip"
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div className="absolute bottom-5 left-5 right-5 flex items-center justify-between rounded-md bg-white px-4 py-3 text-[#14213D] shadow-lg">
                <span className="font-semibold">Choose your next drive</span>
                <FaCar className="text-[#FCA311] text-xl" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-[#14213D] mb-4">
              Why Choose Us?
            </h2>
            <p className="text-lg text-black/70">
              We provide the best car rental experience in Ethiopia
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center group">
              <div className="bg-[#E5E5E5] w-16 h-16 rounded-md flex items-center justify-center mx-auto mb-4 group-hover:bg-[#FCA311] transition">
                <FaCar className="text-3xl text-[#14213D] transition" />
              </div>
              <h3 className="text-xl font-bold mb-2">Premium Fleet</h3>
              <p className="text-gray-600">
                Wide selection of well-maintained vehicles
              </p>
            </div>

            <div className="text-center group">
              <div className="bg-[#E5E5E5] w-16 h-16 rounded-md flex items-center justify-center mx-auto mb-4 group-hover:bg-[#FCA311] transition">
                <FaDollarSign className="text-3xl text-[#14213D] transition" />
              </div>
              <h3 className="text-xl font-bold mb-2">Best Prices</h3>
              <p className="text-gray-600">
                Competitive rates with no hidden fees
              </p>
            </div>

            <div className="text-center group">
              <div className="bg-[#E5E5E5] w-16 h-16 rounded-md flex items-center justify-center mx-auto mb-4 group-hover:bg-[#FCA311] transition">
                <FaShieldAlt className="text-3xl text-[#14213D] transition" />
              </div>
              <h3 className="text-xl font-bold mb-2">Safe & Insured</h3>
              <p className="text-gray-600">All vehicles are fully insured</p>
            </div>

            <div className="text-center group">
              <div className="bg-[#E5E5E5] w-16 h-16 rounded-md flex items-center justify-center mx-auto mb-4 group-hover:bg-[#FCA311] transition">
                <FaHeadset className="text-3xl text-[#14213D] transition" />
              </div>
              <h3 className="text-xl font-bold mb-2">24/7 Support</h3>
              <p className="text-gray-600">
                Customer support available anytime
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-xl text-gray-600">Rent a car in 3 easy steps</p>
          </div>

          <div className="grid md:grid-cols-3 gap-5">
            <div className="bg-white p-7 rounded-lg border border-[#E5E5E5] shadow-sm hover:shadow-md transition">
              <div className="bg-[#FCA311] text-[#14213D] w-10 h-10 rounded-md flex items-center justify-center mb-4 text-lg font-bold">
                1
              </div>
              <h3 className="text-2xl font-bold mb-3">Choose Your Car</h3>
              <p className="text-gray-600">
                Browse our fleet and select the perfect vehicle for your needs
              </p>
            </div>

            <div className="bg-white p-7 rounded-lg border border-[#E5E5E5] shadow-sm hover:shadow-md transition">
              <div className="bg-[#FCA311] text-[#14213D] w-10 h-10 rounded-md flex items-center justify-center mb-4 text-lg font-bold">
                2
              </div>
              <h3 className="text-2xl font-bold mb-3">Book & Verify</h3>
              <p className="text-gray-600">
                Submit your booking with required documents. Wait for admin
                approval
              </p>
            </div>

            <div className="bg-white p-7 rounded-lg border border-[#E5E5E5] shadow-sm hover:shadow-md transition">
              <div className="bg-[#FCA311] text-[#14213D] w-10 h-10 rounded-md flex items-center justify-center mb-4 text-lg font-bold">
                3
              </div>
              <h3 className="text-2xl font-bold mb-3">Pay & Drive</h3>
              <p className="text-gray-600">
                Once approved, choose your payment method and hit the road!
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Payment Methods */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Flexible Payment Options
            </h2>
            <p className="text-xl text-gray-600">
              Pay your way with multiple payment methods
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-6">
            <div className="bg-[#E5E5E5] text-[#14213D] p-6 rounded-lg text-center border border-[#E5E5E5]">
              <h3 className="text-2xl font-bold mb-2">Telebirr</h3>
              <p className="text-[#14213D]">Mobile Payment</p>
            </div>
            <div className="bg-white text-[#14213D] p-6 rounded-lg text-center border border-[#E5E5E5]">
              <h3 className="text-2xl font-bold mb-2">CBE Birr</h3>
              <p className="text-[#14213D]">Mobile Banking</p>
            </div>
            <div className="bg-[#14213D] text-white p-6 rounded-lg text-center">
              <h3 className="text-2xl font-bold mb-2">E-Birr</h3>
              <p className="text-white">Digital Wallet</p>
            </div>
            <div className="bg-[#FCA311] text-[#14213D] p-6 rounded-lg text-center">
              <h3 className="text-2xl font-bold mb-2">Stripe</h3>
              <p className="text-[#14213D]">Card Payment</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-blue-800 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold mb-6">
            Ready to Start Your Journey?
          </h2>
          <p className="text-xl mb-8 text-blue-100">
            Join thousands of satisfied customers and rent your perfect car
            today
          </p>
          <Link
            to="/vehicles"
            className="inline-block bg-yellow-400 text-blue-900 px-10 py-4 rounded-lg text-xl font-bold hover:bg-yellow-300 transition shadow-xl"
          >
            View Our Fleet
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <FaCar className="text-3xl text-yellow-400" />
                <span className="text-2xl font-bold">CarRental</span>
              </div>
              <p className="text-gray-400">
                Your trusted partner for car rentals in Ethiopia
              </p>
            </div>

            <div>
              <h4 className="font-bold text-lg mb-4">Quick Links</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link to="/vehicles" className="hover:text-white">
                    Vehicles
                  </Link>
                </li>
                <li>
                  <Link to="/register" className="hover:text-white">
                    Sign Up
                  </Link>
                </li>
                <li>
                  <Link to="/login" className="hover:text-white">
                    Login
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-lg mb-4">Contact</h4>
              <ul className="space-y-2 text-gray-400">
                <li>Email: info@carrental.com</li>
                <li>Phone: +251 11 123 4567</li>
                <li>Addis Ababa, Ethiopia</li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-lg mb-4">Payment Methods</h4>
              <p className="text-gray-400 text-sm">
                We accept Telebirr, CBE Birr, E-Birr, and Card payments
              </p>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2025 CarRental. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
