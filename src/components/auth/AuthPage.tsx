import type React from "react"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { ModeToggle } from "../ui/ModeToggle"
import { SignInForm } from "./SignInForm"
import { SignUpForm } from "./SignUpForm"

const AuthPage = () => {
  const navigate = useNavigate()
  const [activeForm, setActiveForm] = useState<"signin" | "signup" | null>(null)

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <nav className="flex h-16 items-center px-4 border-b border-gray-200 dark:border-gray-800">
        <a href="/" className="text-3xl font-bold text-purple-600 dark:text-purple-400">
          LaborCalci
        </a>
        <div className="ml-auto flex items-center space-x-4 over">
          <ModeToggle />
          <button
            onClick={() => setActiveForm("signin")}
            className="px-4 py-2 text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
          >
            Sign In
          </button>
          <button
            onClick={() => setActiveForm("signup")}
            className="px-4 py-2 bg-purple-600 text-white inline-block rounded-lg hover:bg-purple-700 dark:bg-purple-500 dark:hover:bg-purple-600"
          >
            Sign Up
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <div className="container mx-auto px-4 flex flex-col items-center justify-center min-h-[calc(100vh-4rem)]">
        <div className="text-center space-y-5 max-w-3xl">
          <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none text-gray-900 dark:text-white">
            Accurate Labor Calculations for Every Audio Visual Job
          </h1>
          <p className="text-gray-600 dark:text-gray-300 md:text-xl">
            Avoid Overestimating or Underestimating to Maximize Margins and Boost Sales.
          </p>
          <button
            onClick={() => setActiveForm("signin")}
            className="px-8 py-3 text-lg bg-purple-600 text-white rounded-lg hover:bg-purple-700 dark:bg-purple-500 dark:hover:bg-purple-600 transition-colors"
          >
            START ESTIMATING
          </button>
        </div>
      </div>

      {/* Sign In Modal */}
      {activeForm === "signin" && (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-8 w-full max-w-md">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Sign In</h2>
              <button
                onClick={() => setActiveForm(null)}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <SignInForm onToggleForm={() => setActiveForm("signup")} />
          </div>
        </div>
      )}

      {/* Sign Up Modal */}
      {activeForm === "signup" && (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center p-4 overflow-visible">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-8 w-full max-w-md">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Sign Up</h2>
              <button
                onClick={() => setActiveForm(null)}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <SignUpForm onToggleForm={() => setActiveForm("signin")} />
          </div>
        </div>
      )}
    </div>
  )
}

export default AuthPage

