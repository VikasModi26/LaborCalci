import React from "react";

interface Project {
  id: string;
  project: string;
  client: string;
  createdBy: string;
}

interface ProjectTableProps {
  projects: Project[];
  handleSort: (key: keyof Project) => void;
  navigate: (path: string) => void;
}

export default function ProjectTable({ projects, handleSort, navigate }: ProjectTableProps) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
      <table className="w-full">
        <thead className="bg-gray-50 dark:bg-gray-700">
          <tr>
            {["project", "client", "createdBy"].map((key) => (
              <th
                key={key}
                onClick={() => handleSort(key as keyof Project)}
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600"
              >
                {key.charAt(0).toUpperCase() + key.slice(1)}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
          {projects.map((project) => (
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
  );
}
