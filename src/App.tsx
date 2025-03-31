import React from "react"
import ReactDOM from "react-dom/client"
import { BrowserRouter as Router, Route, Routes, useParams } from "react-router-dom"
import { ThemeProvider } from "./components/ui/ThemeProvider"
import AuthPage from "./components/landingPage/AuthPage"
import ProjectsPage from "./components/projectsPage/ProjectsPage"
import ProjectView from "./components/roomsPage/ProjectView"
import "./App.css"
import { mockProjects } from "./utils/mockData"
import GlobalSettings from "./globalSettingsPage/GlobalSettings"



function App() {


  return (
    <ThemeProvider defaultTheme="system" storageKey="estilabor-theme">
      <Router>
        <Routes>
          <Route path="/" element={<AuthPage />} />
          <Route path="/dashboard" element={<ProjectsPage />} />
          <Route path="/project/:id" element={<ProjectWrapper />} />
          <Route path='/globalSettings' element={<GlobalSettings />} />
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

