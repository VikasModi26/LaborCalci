import { useState, useMemo } from "react";
import { mockProjects } from "../mockData";

// Define the project type
interface Project {
  id: string;
  project: string;
  client: string;
  createdBy: string;
}

// Define the sorting configuration type
interface SortConfig {
  key: keyof Project;
  direction: "asc" | "desc";
}

export default function useProjects() {
  const [projects, setProjects] = useState<Project[]>(mockProjects);
  const [search, setSearch] = useState<string>("");
  const [sortConfig, setSortConfig] = useState<SortConfig | null>(null);
  const [page, setPage] = useState<number>(1);

  const handleSort = (key: keyof Project) => {
    const direction = sortConfig?.key === key && sortConfig.direction === "asc" ? "desc" : "asc";
    setSortConfig({ key, direction });
  };

  const sortedProjects = useMemo(() => {
    if (!sortConfig) return projects;
    return [...projects].sort((a, b) => {
      const aValue = a[sortConfig.key];
      const bValue = b[sortConfig.key];

      if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1;
      if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1;
      return 0;
    });
  }, [projects, sortConfig]);

  const filteredProjects = useMemo(() => {
    return sortedProjects.filter((project) =>
      Object.values(project).some((value) =>
        String(value).toLowerCase().includes(search.toLowerCase())
      )
    );
  }, [sortedProjects, search]);

  const paginatedProjects = useMemo(() => {
    return filteredProjects.slice((page - 1) * 10, page * 10);
  }, [filteredProjects, page]);

  const totalPages = Math.ceil(filteredProjects.length / 10);

  const handleNewProject = (newProject: Omit<Project, "id" | "createdBy">) => {
    setProjects([
      {
        id: (projects.length + 1).toString(),
        ...newProject,
        createdBy: "User", // Automatically adding 'createdBy' here
      },
      ...projects,
    ]);
  };

  return {
    projects,
    search,
    setSearch,
    page,
    setPage,
    totalPages,
    handleSort,
    paginatedProjects,
    handleNewProject,
  };
}
