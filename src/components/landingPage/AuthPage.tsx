import { useState } from "react";
import AuthModal from "./AuthModal";
import Navbar from "../ui/NavBar";

const AuthPage = () => {
  const [activeForm, setActiveForm] = useState<"signin" | "signup" | null>(
    null
  );

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <Navbar showAuthButtons={true} setActiveForm={setActiveForm} />
      {/* Main Content */}
      <div className="container mx-auto px-4 flex flex-col items-center justify-center min-h-[calc(100vh-4rem)]">
        <div className="text-center space-y-5 max-w-3xl">
          <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl xl:text-6xl text-gray-900 dark:text-white">
            Accurate Labor Calculations for Every Audio Visual Job
          </h1>
          <p className="text-gray-600 dark:text-gray-300 md:text-xl">
            Avoid Overestimating or Underestimating to Maximize Margins and
            Boost Sales.
          </p>
          <button
            onClick={() => setActiveForm("signin")}
            className="px-8 py-3 text-lg bg-purple-600 text-white rounded-lg hover:bg-purple-700 dark:bg-purple-500 dark:hover:bg-purple-600 transition-colors"
          >
            START ESTIMATING
          </button>
        </div>
      </div>
      {/* Authentication Modal */}
      {activeForm && (
        <AuthModal activeForm={activeForm} setActiveForm={setActiveForm} />
      )}
    </div>
  );
};

export default AuthPage;
