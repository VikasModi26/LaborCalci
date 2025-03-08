import type React from "react"
import { useState } from "react"
import { useNavigate } from "react-router-dom"

export function SignInForm({ onToggleForm }: { onToggleForm: () => void }) {
  const navigate = useNavigate()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Here you would typically handle the sign-in logic
    // For now, we'll just navigate to the dashboard
    navigate("/dashboard")
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <input
          type="email"
          placeholder="Email Address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
        />
      </div>
      <div>
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
        />
      </div>
      <button
        type="submit"
        className="w-full py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 dark:bg-purple-500 dark:hover:bg-purple-600"
      >
        Sign In
      </button>
      <div className="mt-4 text-center text-gray-600 dark:text-gray-300">
        Not a member?{" "}
        <button
          onClick={onToggleForm}
          className="text-purple-600 hover:text-purple-700 dark:text-purple-400 dark:hover:text-purple-300"
        >
          Sign Up
        </button>
      </div>
    </form>
  )
}

