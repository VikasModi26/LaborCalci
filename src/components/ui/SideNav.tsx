import { Link, useNavigate } from "react-router-dom";
import FolderCopyIcon from "@mui/icons-material/FolderCopy";
import FolderOpenIcon from "@mui/icons-material/FolderOpen";
import SettingsIcon from "@mui/icons-material/Settings";
import LogoutIcon from "@mui/icons-material/Logout";
import { useState } from "react";
import { Check, LogOut, Pencil, Plus, Trash2, X } from "lucide-react";

type Room = {
  id: string;
  name: string;
  ceilingHeight: {
    feet: number;
    inches: number;
  };
  laborItems: any[];
};

type SidebarProps = {
  isProjectView?: boolean;
  rooms?: Room[];
  selectedRoom?: string | null;
  setSelectedRoom?: (roomId: string) => void;
  onAddRoom?: (roomName: string) => void;
  onUpdateRoomName?: (roomId: string, newName: string) => void;
  onDeleteRoom?: (roomId: string) => void;
};

export const SideNav = ({
  isProjectView,
  rooms,
  selectedRoom,
  setSelectedRoom,
  onAddRoom,
  onUpdateRoomName,
  onDeleteRoom,
}: SidebarProps) => {
  const navigate = useNavigate();
  const [isAddingRoom, setIsAddingRoom] = useState(false);
  const [newRoomName, setNewRoomName] = useState("");
  const [editingRoom, setEditingRoom] = useState<string | null>(null);
  const [editingRoomName, setEditingRoomName] = useState("");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(
    null
  );

  const handleAddRoom = () => {
    if (newRoomName.trim() && onAddRoom) {
      onAddRoom(newRoomName.trim());
      setIsAddingRoom(false);
      setNewRoomName("");
    }
  };

  const handleUpdateRoomName = (roomId: string, newName: string) => {
    if (newName.trim() && onUpdateRoomName) {
      onUpdateRoomName(roomId, newName.trim());
      setEditingRoom(null);
    }
  };

  const handleDeleteConfirm = (roomId: string) => {
    if (onDeleteRoom) {
      onDeleteRoom(roomId);
      setShowDeleteConfirm(null);
    }
  };

  return (
    <div className="w-64 flex flex-col bg-gray-50 dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700">
      <nav className="mt-8">
        {!isProjectView ? (
          <>
            <a
              href="#"
              className="flex items-center m-2 px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <FolderCopyIcon className="w-5 h-5 mr-2" />
              All Projects
            </a>
            <a
              href="#"
              className="flex items-center m-2 px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <FolderOpenIcon className="w-5 h-5 mr-2" />
              My Projects
            </a>
          </>
        ) : (
          <div className="fixed top-[100px] left-0 w-64 px-4 bg-gray-50 dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700">
            <div className="space-y-2 overflow-y-auto max-h-full">
              {rooms?.map((room) => (
                <div
                  key={room.id}
                  className={`group relative rounded-lg transition-colors ${
                    selectedRoom === room.id
                      ? "bg-purple-100 dark:bg-purple-900/50"
                      : "hover:bg-gray-100 dark:hover:bg-gray-800"
                  }`}
                >
                  {editingRoom === room.id ? (
                    <div className="flex items-center p-2">
                      <input
                        type="text"
                        value={editingRoomName}
                        onChange={(e) => setEditingRoomName(e.target.value)}
                        className="flex-1 px-2 py-1 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded text-gray-900 dark:text-white text-sm"
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            handleUpdateRoomName(room.id, editingRoomName);
                          }
                        }}
                      />
                      <button
                        onClick={() =>
                          handleUpdateRoomName(room.id, editingRoomName)
                        }
                        className="ml-2 p-1 text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300"
                      >
                        <Check className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <div
                      onClick={() =>
                        setSelectedRoom && setSelectedRoom(room.id)
                      }
                      className="w-full p-3 text-left flex items-center justify-between cursor-pointer"
                    >
                      <span className="text-gray-800 dark:text-gray-100">
                        {room.name}
                      </span>
                      <div className="opacity-0 group-hover:opacity-100 flex items-center gap-2 transition-opacity">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setEditingRoom(room.id);
                            setEditingRoomName(room.name);
                          }}
                          className="p-1 text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setShowDeleteConfirm(room.id);
                          }}
                          className="p-1 text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {isAddingRoom ? (
              <div className="mt-2 flex items-center">
                <input
                  type="text"
                  placeholder="Room name"
                  value={newRoomName}
                  onChange={(e) => setNewRoomName(e.target.value)}
                  className="flex-1 px-2 py-1 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded text-gray-900 dark:text-white text-sm"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleAddRoom();
                    }
                  }}
                />
                <button
                  onClick={handleAddRoom}
                  className="ml-2 p-1 text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300"
                >
                  <Check className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setIsAddingRoom(false)}
                  className="ml-1 p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => setIsAddingRoom(true)}
                className="m-2 text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 text-sm flex items-center gap-1"
              >
                <Plus className="w-4 h-4" />
                Add Room
              </button>
            )}
          </div>
        )}

        {/* Global Settings button */}
        <a
          href="/globalSettings"
          className="flex items-center fixed bottom-0 left-0 mt-auto mx-2 mb-2 px-4 py-4 text-gray-700 dark:text-gray-200"
        >
          <SettingsIcon className="w-16 h-5 mr-2" />
          Global Settings
        </a>
      </nav>

      {/* Delete Confirmation */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl w-96">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
              Delete Room
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Are you sure you want to delete this room?
            </p>
            <div className="mt-4 flex justify-end">
              <button
                onClick={() => setShowDeleteConfirm(null)}
                className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteConfirm(showDeleteConfirm)}
                className="ml-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
