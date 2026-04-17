import { getAdminRoute } from "@/lib/admin-path";

export const mainNav = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/catalog", label: "Catalog" },
  { href: "/projects", label: "Projects" },
  { href: "/gallery", label: "Gallery" },
  { href: "/contact", label: "Contact" },
  { href: "/quote", label: "Request Quote" },
];

export const legalNav = [
  { href: "/privacy", label: "Privacy" },
  { href: "/terms", label: "Terms" },
];

export const adminNav = [
  { href: getAdminRoute(), label: "Dashboard" },
  { href: getAdminRoute("/products"), label: "Products" },
  { href: getAdminRoute("/categories"), label: "Categories" },
  { href: getAdminRoute("/inquiries"), label: "Inquiries" },
];
