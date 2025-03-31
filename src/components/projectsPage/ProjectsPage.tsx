import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { SideNav } from "../ui/SideNav";
import SearchBar from "../ui/SearchBar";
import ProjectTable from "./ProjectTable";
import Pagination from "../ui/Pagination";
import ProjectModal from "./ProjectModal";
import useProjects from "../../utils/hooks/useProjects";
import Navbar from "../ui/NavBar";

export default function ProjectsPage() {
  const navigate = useNavigate();
  const {
    projects,
    search,
    setSearch,
    page,
    setPage,
    totalPages,
    handleSort,
    paginatedProjects,
    handleNewProject,
  } = useProjects();

  const [showModal, setShowModal] = useState(false);

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <Navbar />
      <div className="flex min-h-[calc(100vh-4rem)]">
        <SideNav isProjectView={false} />
        <div className="flex-1 p-8">
          <div className="flex items-center gap-4 mb-8">
            <SearchBar search={search} setSearch={setSearch} />
            <button
              onClick={() => setShowModal(true)}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
            >
              + Add New Project
            </button>
          </div>
          <ProjectTable
            projects={paginatedProjects}
            handleSort={handleSort}
            navigate={navigate}
          />
          <Pagination page={page} setPage={setPage} totalPages={totalPages} />
          {showModal && (
            <ProjectModal
              setShowModal={setShowModal}
              handleNewProject={handleNewProject}
            />
          )}
        </div>
      </div>
    </div>
  );
}
