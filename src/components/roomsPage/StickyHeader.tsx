import { Check, ChevronDown, Pencil, X } from "lucide-react";
import CeilingHeight from "../ui/CeilingHeight";
import DifficultyMeter from "../ui/DifficultyMeter";
import RoomHeaderActions from "./RoomHeaderActions";
import { useState } from "react";

type ProjectInfo = {
  id: string;
  project: string;
  client: string;
  createdBy: string;
};

type Room = {
  id: string;
  name: string;
  ceilingHeight: {
    feet: number;
    inches: number;
  };
  laborItems: any[];
};

type StickyHeaderProps = {
  projectInfo: ProjectInfo;
  editedProjectInfo: ProjectInfo;
  isEditingProject: boolean;
  selectedRoom: string | null;
  rooms: Room[];
  onEditProject: () => void;
  onSaveProject: () => void;
  onCancelEditProject: () => void;
  onUpdateCeilingHeight: (
    roomId: string,
    field: "feet" | "inches",
    value: number
  ) => void;
  setEditedProjectInfo: (info: ProjectInfo) => void;
  setClientSearch: (search: string) => void;
  setCreatorSearch: (search: string) => void;
  clientSearch: string;
  creatorSearch: string;
  showClientDropdown: boolean;
  showCreatorDropdown: boolean;
  setShowClientDropdown: (show: boolean) => void;
  setShowCreatorDropdown: (show: boolean) => void;
  filteredClients: string[];
  filteredCreators: string[];
};

const StickyHeader = ({
  projectInfo,
  editedProjectInfo,
  isEditingProject,
  selectedRoom,
  rooms,
  onEditProject,
  onSaveProject,
  onCancelEditProject,
  onUpdateCeilingHeight,
  setEditedProjectInfo,
  setClientSearch,
  setCreatorSearch,
  clientSearch,
  creatorSearch,
  showClientDropdown,
  showCreatorDropdown,
  setShowClientDropdown,
  setShowCreatorDropdown,
  filteredClients,
  filteredCreators,
}: StickyHeaderProps) => {
  const selectedRoomData = rooms.find((r) => r.id === selectedRoom);
  const [isHovering, setIsHovering] = useState(false);

  // Handler for ceiling height updates
  const handleUpdateCeilingHeight = (
    field: "feet" | "inches",
    value: number
  ) => {
    if (selectedRoom) {
      onUpdateCeilingHeight(selectedRoom, field, value);
    }
  };

  // Handler for PDF export
  const handleExportPdf = () => {
    console.log("Exporting to PDF...");
    // Implement PDF export logic here
  };

  return (
    <div className="sticky top-0 z-10 bg-white dark:bg-[#1B1E27] pb-4 px-8 pt-4 border-b border-gray-200 dark:border-gray-700">
      <div className="flex flex-col">
        <div className="flex justify-between mb-4">
          <div className="space-y-2 relative group">
            <div
              onMouseEnter={() => setIsHovering(true)}
              onMouseLeave={() => setIsHovering(false)}
            >
              {isEditingProject ? (
                <>
                  <input
                    type="text"
                    value={editedProjectInfo.project}
                    onChange={(e) =>
                      setEditedProjectInfo({
                        ...editedProjectInfo,
                        project: e.target.value,
                      })
                    }
                    className="text-2xl font-bold text-gray-900 dark:text-white bg-transparent border border-gray-300 dark:border-gray-600 rounded-md px-2 py-1 w-full mb-2"
                  />
                  <div className="flex items-center relative">
                    <span className="text-gray-400 mr-2">Client:</span>
                    <div className="relative flex-1">
                      <input
                        type="text"
                        value={clientSearch}
                        onChange={(e) => {
                          setClientSearch(e.target.value);
                          setEditedProjectInfo({
                            ...editedProjectInfo,
                            client: e.target.value,
                          });
                        }}
                        onFocus={() => setShowClientDropdown(true)}
                        className="w-full text-gray-900 dark:text-white bg-transparent border border-gray-300 dark:border-gray-600 rounded-md px-2 py-1 pr-8 mb-2"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setShowClientDropdown(!showClientDropdown)
                        }
                        className="absolute inset-y-0 right-0 flex items-center px-2 text-gray-400"
                      >
                        <ChevronDown className="w-4 h-4" />
                      </button>
                    </div>
                    {showClientDropdown && (
                      <ul className="absolute z-10 mt-1 w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md shadow-lg max-h-60 overflow-auto top-full left-16">
                        {filteredClients.map((client) => (
                          <li
                            key={client}
                            className="px-2 py-1 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer text-gray-900 dark:text-white"
                            onClick={() => {
                              setClientSearch(client);
                              setEditedProjectInfo({
                                ...editedProjectInfo,
                                client,
                              });
                              setShowClientDropdown(false);
                            }}
                          >
                            {client}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                  <div className="absolute right-0 top-0 flex gap-2">
                    <button
                      onClick={onSaveProject}
                      className="py-3 px-1 text-green-500 hover:text-green-600 dark:text-green-400 dark:hover:text-green-300"
                      title="Save changes"
                    >
                      <Check className="w-5 h-5" />
                    </button>
                    <button
                      onClick={onCancelEditProject}
                      className="py-3 px-2 text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-300"
                      title="Cancel changes"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <h1 className="text-2xl font-bold text-gray-900 dark:text-white pr-8 mb-2">
                    {projectInfo.project}
                  </h1>
                  <div className="text-gray-600 dark:text-gray-400 mb-2">
                    Client: {projectInfo.client}
                  </div>
                  {isHovering && !isEditingProject && (
                    <button
                      onClick={onEditProject}
                      className="absolute right-0 top-1 p-1 ml-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                      title="Edit project details"
                    >
                      <Pencil className="w-5 h-5" />
                    </button>
                  )}
                </>
              )}
            </div>
            <div className="text-gray-600 dark:text-gray-400 mb-2">
              Created by: {projectInfo.createdBy}
            </div>
            <div className="text-xl font-semibold text-gray-900 dark:text-white mt-2">
              {selectedRoomData?.name || "Select Room"}
            </div>
          </div>

          {/* Project Actions Component */}
          <RoomHeaderActions onExportPdf={handleExportPdf} />
        </div>

        <div className="flex items-center justify-between">
          {/* Ceiling Height Input Component */}
          <CeilingHeight
            feet={selectedRoomData?.ceilingHeight.feet || 0}
            inches={selectedRoomData?.ceilingHeight.inches || 0}
            onUpdateHeight={handleUpdateCeilingHeight}
            disabled={!selectedRoom}
          />

          {/* Difficulty Meter Component */}
          <DifficultyMeter
            ceilingHeight={
              selectedRoomData?.ceilingHeight || { feet: 0, inches: 0 }
            }
          />
        </div>
      </div>
    </div>
  );
};

export default StickyHeader;
