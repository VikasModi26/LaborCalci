import React from "react"
import ReactDOM from "react-dom/client"
import { BrowserRouter as Router, Route, Routes, useParams } from "react-router-dom"
import { ThemeProvider } from "./components/ThemeProvider"
import AuthPage from "./components/auth/AuthPage"
import ProjectsPage from "./components/projects/ProjectsPage"
import ProjectView from "./components/projects/ProjectView"
import "./App.css"
import { mockProjects } from "./lib/mockData"



function App() {


  return (
    <ThemeProvider defaultTheme="system" storageKey="estilabor-theme">
      <Router>
        <Routes>
          <Route path="/" element={<AuthPage />} />
          <Route path="/dashboard" element={<ProjectsPage />} />
          <Route path="/project/:id" element={<ProjectWrapper />} />
        </Routes>
      </Router>
    </ThemeProvider>
  )
}

// Wrapper Component to Fetch Project Data
function ProjectWrapper() {
  const { id } = useParams();
  const projectData = mockProjects.find((p) => p.id === id);

  if (!projectData) {
    return <div>Project not found</div>;
  }

  return <ProjectView projectId={id} initialData={projectData} />;
}


// Create root and render app
const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement)

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)

export default App

