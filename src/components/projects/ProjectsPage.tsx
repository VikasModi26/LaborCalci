import { useState, useMemo } from "react"
import { useNavigate } from "react-router-dom"
import { SideNav } from "./SideNav"
import { mockProjects, mockClients } from "../../lib/mockData"

export default function ProjectsPage() {
  const navigate = useNavigate()
  const [projects, setProjects] = useState(mockProjects)
  const [search, setSearch] = useState("")
  const [sortConfig, setSortConfig] = useState<{
    key: keyof (typeof mockProjects)[0]
    direction: "asc" | "desc"
  } | null>(null)
  const [page, setPage] = useState(1)
  const [showModal, setShowModal] = useState(false)
  const [clientSearch, setClientSearch] = useState("")
  const [showDropdown, setShowDropdown] = useState(false)
  const [newProject, setNewProject] = useState({
    project: "",
    client: "",
  })

  // Filter clients based on search input
  const filteredClients = useMemo(() => {
    return mockClients.filter((client) => client.toLowerCase().includes(clientSearch.toLowerCase()))
  }, [clientSearch])

  const handleSort = (key: keyof (typeof mockProjects)[0]) => {
    const direction = sortConfig?.key === key && sortConfig.direction === "asc" ? "desc" : "asc"
    setSortConfig({ key, direction })
  }

  const sortedProjects = useMemo(() => {
    if (!sortConfig) return projects

    return [...projects].sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key]) {
        return sortConfig.direction === "asc" ? -1 : 1
      }
      if (a[sortConfig.key] > b[sortConfig.key]) {
        return sortConfig.direction === "asc" ? 1 : -1
      }
      return 0
    })
  }, [projects, sortConfig])

  const filteredProjects = sortedProjects.filter((project) =>
    Object.values(project).some((value) => value.toString().toLowerCase().includes(search.toLowerCase())),
  )

  const paginatedProjects = filteredProjects.slice((page - 1) * 10, page * 10)
  const totalPages = Math.ceil(filteredProjects.length / 10)

  const handleNewProject = () => {
    if (newProject.project && newProject.client) {
      setProjects([
        {
          id: (projects.length + 1).toString(),
          ...newProject,
          createdBy: "User", //Hardcoded for now
        },
        ...projects,
      ])
      handleCloseModal()
    }
  }

  const handleCloseModal = () => {
    setShowModal(false)
    setNewProject({ project: "", client: "" })
    setClientSearch("")
    setShowDropdown(false)
  }

  const handleClientSelect = (client: string) => {
    setNewProject({ ...newProject, client })
    setClientSearch(client)
    setShowDropdown(false)
  }

  return (
    <div className="flex min-h-screen bg-white dark:bg-gray-900">
      <SideNav />

      {/* Main Content */}
      <div className="flex-1 p-8">
        <div className="flex items-center gap-4 mb-8">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Search projects..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            />
            <svg
              className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 dark:bg-purple-500 dark:hover:bg-purple-600"
          >
            + Add New Project
          </button>
        </div>

        {/* Projects Table */}
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th
                  onClick={() => handleSort("project")}
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600"
                >
                  Project {sortConfig?.key === "project" && (sortConfig.direction === "asc" ? "↑" : "↓")}
                </th>
                <th
                  onClick={() => handleSort("client")}
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600"
                >
                  Client {sortConfig?.key === "client" && (sortConfig.direction === "asc" ? "↑" : "↓")}
                </th>
                <th
                  onClick={() => handleSort("createdBy")}
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600"
                >
                  Created By {sortConfig?.key === "createdBy" && (sortConfig.direction === "asc" ? "↑" : "↓")}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {paginatedProjects.map((project) => (
                <tr
                  key={project.id}
                  className="hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer"
                  onClick={() => navigate(`/project/${project.id}`)}
                >
                  <td className="px-6 py-4 whitespace-nowrap text-gray-900 dark:text-white">{project.project}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-900 dark:text-white">{project.client}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-900 dark:text-white">{project.createdBy}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-center space-x-2 py-4">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-3 py-1 border border-gray-300 rounded-md text-sm disabled:opacity-50 disabled:cursor-not-allowed dark:border-gray-600 dark:text-gray-300"
          >
            Previous
          </button>
          <span className="text-sm text-gray-600 dark:text-gray-300">
            Page {page} of {totalPages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="px-3 py-1 border border-gray-300 rounded-md text-sm disabled:opacity-50 disabled:cursor-not-allowed dark:border-gray-600 dark:text-gray-300"
          >
            Next
          </button>
        </div>

        {/* Add Project Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md relative">
              <button
                onClick={handleCloseModal}
                className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              <h2 className="text-xl font-bold mb-6 text-gray-900 dark:text-white">Create New Project</h2>

              <div className="space-y-4">
                <div>
                  <input
                    type="text"
                    placeholder="Enter Project Name"
                    value={newProject.project}
                    onChange={(e) => setNewProject({ ...newProject, project: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                  />
                </div>

                <div className="relative">
                  <input
                    type="text"
                    placeholder="Enter or Select Client"
                    value={clientSearch}
                    onChange={(e) => {
                      setClientSearch(e.target.value)
                      setNewProject({ ...newProject, client: e.target.value })
                      setShowDropdown(true)
                    }}
                    onFocus={() => setShowDropdown(true)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                  />
                  {showDropdown && filteredClients.length > 0 && (
                    <div className="absolute z-10 w-full mt-1 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg shadow-lg max-h-48 overflow-auto">
                      {filteredClients.map((client) => (
                        <button
                          key={client}
                          onClick={() => handleClientSelect(client)}
                          className="w-full px-3 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-white"
                        >
                          {client}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="flex justify-end gap-4 mt-6">
                <button
                  onClick={handleCloseModal}
                  className="px-4 py-2 text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
                >
                  Cancel
                </button>
                <button
                  onClick={handleNewProject}
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 dark:bg-purple-500 dark:hover:bg-purple-600"
                >
                  OK
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

