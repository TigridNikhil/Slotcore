import {
  FaCreditCard,
  FaHeadset,
  FaGlobe,
  FaBars,
  FaTimes,
} from "react-icons/fa";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-gradient-to-b from-neutral-900 to-black text-white pt-20 pb-10">
      <div className="container mx-auto px-6">
        <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-12 mb-16">
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-6">
              <img src="/logo.png" alt="Slotcore" className="h-10" />
              <span className="text-2xl font-bold text-white">Slotcore</span>
            </div>
            <p className="text-neutral-400 mb-8 max-w-md">
              The world's most advanced booking platform for modern businesses.
              Built with cutting-edge technology and designed for exceptional
              user experiences.
            </p>
            <div className="flex gap-4">
              <SocialIcon />
              <SocialIcon />
              <SocialIcon />
              <SocialIcon />
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-6 text-white">Product</h3>
            <ul className="space-y-4">
              <FooterLink href="/#features">Features</FooterLink>
              <FooterLink href="/pricing">Pricing</FooterLink>
              <FooterLink href="/api-docs">API Docs</FooterLink>
              <FooterLink href="/changelog">Changelog</FooterLink>
              <FooterLink href="/status">Status</FooterLink>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-6 text-white">Company</h3>
            <ul className="space-y-4">
              <FooterLink href="/about">About</FooterLink>
              <FooterLink href="/careers">Careers</FooterLink>
              <FooterLink href="/blog">Blog</FooterLink>
              <FooterLink href="/press">Press</FooterLink>
              <FooterLink href="/contact">Contact</FooterLink>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-6 text-white">Resources</h3>
            <ul className="space-y-4">
              <FooterLink href="/docs">Documentation</FooterLink>
              <FooterLink href="/help">Help Center</FooterLink>
              <FooterLink href="/community">Community</FooterLink>
              <FooterLink href="/partners">Partners</FooterLink>
              <FooterLink href="/security">Security</FooterLink>
            </ul>
          </div>
        </div>

        <div className="border-t border-neutral-800 pt-10">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="text-neutral-400 text-sm">
              © {new Date().getFullYear()} Slotcore Inc. All rights reserved.
            </div>

            <div className="flex gap-6 text-sm text-neutral-400">
              <Link
                to="/privacy"
                className="hover:text-white transition-colors"
              >
                Privacy Policy
              </Link>
              <Link to="/terms" className="hover:text-white transition-colors">
                Terms of Service
              </Link>
              <Link
                to="/cookies"
                className="hover:text-white transition-colors"
              >
                Cookie Policy
              </Link>
              <Link to="#" className="hover:text-white transition-colors">
                GDPR
              </Link>
            </div>

            <div className="flex items-center gap-4 text-neutral-400">
              <FaCreditCard />
              <FaHeadset />
              <FaGlobe />
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

// Helper Components
function FooterLink({ href, children }) {
  // Check if it's an external link or hash link vs internal route
  const isInternal = href.startsWith("/") && !href.startsWith("//");

  if (isInternal) {
    return (
      <li>
        <Link
          to={href}
          className="text-neutral-400 hover:text-white transition-colors hover:pl-2 block duration-200"
        >
          {children}
        </Link>
      </li>
    );
  }

  return (
    <li>
      <a
        href={href}
        className="text-neutral-400 hover:text-white transition-colors hover:pl-2 block duration-200"
      >
        {children}
      </a>
    </li>
  );
}

function SocialIcon() {
  return (
    <div className="w-10 h-10 rounded-lg bg-neutral-800 hover:bg-neutral-700 flex items-center justify-center cursor-pointer transition-colors">
      <div className="w-4 h-4 bg-neutral-400 rounded-full"></div>
    </div>
  );
}
