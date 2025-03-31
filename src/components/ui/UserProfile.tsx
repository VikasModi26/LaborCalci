import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import UserLogo from "../../assets/images.png";

const UserProfile: React.FC = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const dropdownRef = useRef<HTMLDivElement>(null); // Ref for dropdown

  const handleLogout = () => {
    // Perform logout actions here (e.g., clearing session, API call)
    navigate("/"); // Navigate to login page
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    };

    if (menuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [menuOpen]);

  return (
    <div className="relative" ref={dropdownRef}>
      {/* User Avatar */}
      <button
        onClick={() => setMenuOpen((prev) => !prev)}
        className="flex items-center space-x-2 focus:outline-none"
      >
        <img
          src={UserLogo}
          alt="User"
          className="w-10 h-10 rounded-full border border-gray-300 dark:border-gray-700"
        />
      </button>

      {/* Dropdown Menu */}
      {menuOpen && (
        <div className="absolute right-0 mt-2 w-40 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-2">
          <p className="px-3 py-2 text-gray-700 dark:text-gray-300 font-medium">John Doe</p>
          <button
            onClick={handleLogout}
            className="w-full px-3 py-2 text-left text-red-600 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
          >
            Logout
          </button>
        </div>
      )}
    </div>
  );
};

export default UserProfile;
