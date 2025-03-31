import React, {useState} from "react";
import { Link } from "react-router-dom";
import { ModeToggle } from "./ModeToggle";
import UserProfile from "./UserProfile"; 


interface NavbarProps {
  showAuthButtons?: boolean;
  setActiveForm?: (form: "signin" | "signup" | null) => void;
}

const Navbar: React.FC<NavbarProps> = ({ showAuthButtons = false, setActiveForm }) => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 flex items-center justify-between h-16 px-4 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
      {/* Logo */}
      <Link to="/" className="text-2xl font-bold text-purple-600 dark:text-purple-400">
        LaborCalci
      </Link>

      {/* Menu Section */}
      <div className="flex items-center space-x-4">
        <ModeToggle />
        {showAuthButtons ? (
          <div className="hidden md:flex space-x-4">
            <button
              onClick={() => setActiveForm?.("signin")}
              className="px-4 py-2 text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
            >
              Sign In
            </button>
            <button
              onClick={() => setActiveForm?.("signup")}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 dark:bg-purple-500 dark:hover:bg-purple-600"
            >
              Sign Up
            </button>
          </div>
        ) : (
          <UserProfile />
        )}
      </div>
    </nav>
  );
};

export default Navbar;