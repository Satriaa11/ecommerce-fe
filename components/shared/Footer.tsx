import { FaGithub, FaLinkedinIn, FaTwitter } from "react-icons/fa";
import MaxWidthWrapperNavbar from "@/components/MaxWidthWrapperNavbar";

const socialLinks = [
  {
    name: "github",
    logo: FaGithub,
    url: "https://github.com/yourusername",
  },
  {
    name: "twitter",
    logo: FaTwitter,
    url: "https://twitter.com/yourusername",
  },
  {
    name: "linkedin",
    logo: FaLinkedinIn,
    url: "https://linkedin.com/in/yourusername",
  },
];

export const Footer = () => {
  const date = new Date();
  const year = date.getFullYear();

  return (
    <footer className="footer footer-center bg-base-200 text-base-content rounded p-10 mt-auto">
      <MaxWidthWrapperNavbar>
        <div className="divider"></div>

        <nav className="grid grid-flow-col gap-4">
          {socialLinks.map((link, index) => (
            <a
              key={index}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-ghost btn-circle"
              title={`Visit my ${link.name} profile`}
            >
              <link.logo size={20} />
            </a>
          ))}
        </nav>

        <aside>
          <p className="text-sm">
            © {year} Satria Wira Bakti. All rights reserved.
          </p>
        </aside>
      </MaxWidthWrapperNavbar>
    </footer>
  );
};
