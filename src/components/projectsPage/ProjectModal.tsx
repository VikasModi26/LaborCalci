import React, { useState, useMemo } from "react";
import { mockClients } from "../../utils/mockData";

interface Project {
  project: string;
  client: string;
}

interface ProjectModalProps {
  setShowModal: (show: boolean) => void;
  handleNewProject: (newProject: Project) => void;
}

export default function ProjectModal({ setShowModal, handleNewProject }: ProjectModalProps) {
  const [newProject, setNewProject] = useState<Project>({ project: "", client: "" });
  const [clientSearch, setClientSearch] = useState<string>("");
  const [showDropdown, setShowDropdown] = useState<boolean>(false);

  const filteredClients = useMemo(() => {
    return mockClients.filter((client) =>
      client.toLowerCase().includes(clientSearch.toLowerCase())
    );
  }, [clientSearch]);

  const handleClientSelect = (client: string) => {
    setNewProject({ ...newProject, client });
    setClientSearch(client);
    setShowDropdown(false);
  };

  const handleSubmit = () => {
    if (newProject.project && newProject.client) {
      handleNewProject(newProject);
      setShowModal(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md relative">
        <button
          onClick={() => setShowModal(false)}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 dark:text-gray-400"
        >
          ✖
        </button>
        <h2 className="text-xl font-bold mb-6 text-gray-900 dark:text-gray-200">Create New Project</h2>
        <div className="space-y-4">
          <input
            type="text"
            placeholder="Enter Project Name"
            value={newProject.project}
            onChange={(e) => setNewProject({ ...newProject, project: e.target.value })}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none dark:bg-gray-500 dark:placeholder-gray-200 dark:text-white"
          />
          <input
            type="text"
            placeholder="Enter or Select Client"
            value={clientSearch}
            onChange={(e) => {
              setClientSearch(e.target.value);
              setNewProject({ ...newProject, client: e.target.value });
              setShowDropdown(true);
            }}
            onFocus={() => setShowDropdown(true)}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none dark:bg-gray-500 dark:placeholder-gray-200 dark:text-white"
          />
          {showDropdown && filteredClients.length > 0 && (
            <div className="absolute z-10 w-full mt-1 bg-white border rounded-lg shadow-lg">
              {filteredClients.map((client) => (
                <button
                  key={client}
                  onClick={() => handleClientSelect(client)}
                  className="w-full px-3 py-2 text-left hover:bg-gray-100"
                >
                  {client}
                </button>
              ))}
            </div>
          )}
        </div>
        <div className="flex justify-end gap-4 mt-6">
          <button onClick={() => setShowModal(false)} className="cursor-pointer px-4 py-2 text-gray-600 dark:text-gray-300 hover:text-gray-900">
            Cancel
          </button>
          <button onClick={handleSubmit} className="cursor-pointer px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700">
            OK
          </button>
        </div>
      </div>
    </div>
  );
}
