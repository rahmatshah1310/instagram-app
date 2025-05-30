import { Link } from "react-router-dom";

const AppFooter = () => {
  const footerLinks = [
    "Meta",
    "About",
    "Blog",
    "Jobs",
    "Help",
    "API",
    "Privacy",
    "Terms",
    "Locations",
    "Instagram Lite",
    "Threads",
    "Contact Uploading",
    "Non-Users",
    "Meta Verified",
  ];

  return (
    <footer className="hidden md:flex flex-col justify-center">
      <div className="flex justify-center gap-3 mb-4">
        {footerLinks.map((links, index) => (
          <div key={index} className="flex gap-2">
            <Link
              key={index}
              to="/"
              className="text-sm text-[#A8A8A8] hover:underline transition duration-200"
            >
              {links}
            </Link>
          </div>
        ))}
      </div>

      <div>
        <div className="flex flex-col md:flex-row justify-center items-center gap-4">
          <select
            className="bg-transparent py-1 text-sm text-[#A8A8A8] "
            defaultValue="en"
          >
            <option value="en">English</option>
            <option value="es">Español</option>
            <option value="fr">Français</option>
          </select>

          <div className="text-s text-center text-[#A8A8A8] ">
            <span>© {new Date().getFullYear()} Instagram from Meta</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default AppFooter;
