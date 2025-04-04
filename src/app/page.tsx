import { HeroSectionOne } from "@/components/HeroSectionOne";

export default function Home() {
  return (
    <div className="">
      <main className="">
        <HeroSectionOne />
      </main>
      <footer className="bg-gray-900 text-gray-300 py-10">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand Section */}
          <div>
            <h2 className="text-2xl font-semibold text-white">
              Smart Community
            </h2>
            <p className="mt-2 text-gray-400">
              Empowering communities with smart solutions for better living.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold text-white">Quick Links</h3>
            <ul className="mt-3 space-y-2">
              <li>
                <a href="#" className="hover:text-white transition">
                  Home
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition">
                  Services
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition">
                  Events
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition">
                  Contact Us
                </a>
              </li>
            </ul>
          </div>

          {/* Contact & Social Links */}
          <div>
            <h3 className="text-lg font-semibold text-white">Contact Us</h3>
            <p className="mt-2 text-gray-400">123 Community Lane, Tech City</p>
            <p className="text-gray-400">Email: kumarsipun137@gmail.com</p>
            <p className="text-gray-400">Phone: +91 7008830763</p>

            {/* Social Icons */}
            <div className="mt-4 flex space-x-4">
              <a href="#" className="hover:text-white">
                <i className="fab fa-facebook-f"></i>
              </a>
              <a href="#" className="hover:text-white">
                <i className="fab fa-twitter"></i>
              </a>
              <a href="#" className="hover:text-white">
                <i className="fab fa-instagram"></i>
              </a>
              <a href="#" className="hover:text-white">
                <i className="fab fa-linkedin"></i>
              </a>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 text-center border-t border-gray-700 pt-4 text-gray-500 text-sm">
          © {new Date().getFullYear()} Smart Community Management System. All
          rights reserved.
        </div>
      </footer>
    </div>
  );
}
