import { useState, useEffect } from "react";
import { mockClients, mockCreators, mockRooms } from "../mockData";

// Define Types
interface ProjectInfo {
  id: string;
  project: string;
  client: string;
  createdBy: string;
}

interface Room {
  id: string;
  name: string;
}

interface DifficultyMeter {
  level: number;
  label: string;
}

interface Wire {
  type: string;
  length: number;
  quantity: number;
  cost: number;
}

const useProjectData = (initialData: ProjectInfo) => {
  const [projectInfo, setProjectInfo] = useState<ProjectInfo>(initialData);
  const [isEditingProject, setIsEditingProject] = useState<boolean>(false);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [selectedRoom, setSelectedRoom] = useState<string>("");
  const [difficultyMeter, setDifficultyMeter] = useState<DifficultyMeter>({ level: 0, label: "Basic" });
  const [wires, setWires] = useState<Wire[]>([]);

  useEffect(() => {
    setProjectInfo(initialData);
    setRooms(mockRooms.map((room: string, index: number) => ({ id: `room-${index + 1}`, name: room })));
  }, [initialData]);

  const handleEditProject = (): void => setIsEditingProject(true);
  const handleSaveProject = (): void => setIsEditingProject(false);
  const handleCancelEditProject = (): void => setIsEditingProject(false);

  const handleAddRoom = (roomName: string): void => {
    const newRoom: Room = { id: `room-${rooms.length + 1}`, name: roomName };
    setRooms([...rooms, newRoom]);
    setSelectedRoom(newRoom.id);
  };

  const handleDeleteRoom = (roomId: string): void => {
    setRooms(rooms.filter((room) => room.id !== roomId));
    if (selectedRoom === roomId) setSelectedRoom(rooms.length > 1 ? rooms[0].id : "");
  };

  return {
    projectInfo, setProjectInfo,
    rooms, setRooms, selectedRoom, setSelectedRoom,
    isEditingProject, setIsEditingProject,
    handleEditProject, handleSaveProject, handleCancelEditProject,
    handleAddRoom, handleDeleteRoom,
    difficultyMeter, setDifficultyMeter,
    wires, setWires
  };
};

export default useProjectData;