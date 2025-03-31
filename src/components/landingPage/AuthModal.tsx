import React from "react";
import { SignInForm } from "./SignInForm";
import { SignUpForm } from "./SignUpForm";

interface AuthModalProps {
  activeForm: "signin" | "signup";
  setActiveForm: (form: "signin" | "signup" | null) => void;
}

const AuthModal: React.FC<AuthModalProps> = ({ activeForm, setActiveForm }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-8 w-full max-w-md">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            {activeForm === "signin" ? "Sign In" : "Sign Up"}
          </h2>
          <button
            onClick={() => setActiveForm(null)}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            ✖
          </button>
        </div>
        {activeForm === "signin" ? (
          <SignInForm onToggleForm={() => setActiveForm("signup")} />
        ) : (
          <SignUpForm onToggleForm={() => setActiveForm("signin")} />
        )}
      </div>
    </div>
  );
};

export default AuthModal;
