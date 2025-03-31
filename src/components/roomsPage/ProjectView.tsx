import { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  laborItems,
  programmingItems,
  trainingItems,
  rackFabricationItems,
  engineeringItems,
  fieldEngineeringItems,
  qualityAssuranceItems,
} from "../../utils/laborItems";
import StickyHeader from "./StickyHeader";
import ScrollableContent from "./ScrollableContent";
import DeleteConfirmationModal from "./DeleteConfirmationModal";
import Modal from "./Modal";
import {
  mockClients,
  mockCreators,
  wireTypes,
  wireCosts,
  rackMaterialTypes,
} from "../../utils/mockData";
import { SideNav } from "../ui/SideNav";
import Navbar from "../ui/NavBar";

type LaborLineItem = {
  id: string;
  name: string;
  hoursPerTask: number;
  qtyPerTask: number;
};

type Room = {
  id: string;
  name: string;
  ceilingHeight: {
    feet: number;
    inches: number;
  };
  laborItems: {
    category: string;
    subCategory: string;
    items: LaborLineItem[];
  }[];
};

type ProjectInfo = {
  id: string;
  project: string;
  client: string;
  createdBy: string;
};

const ProjectView = ({
  projectId,
  initialData,
}: {
  projectId: string;
  initialData: ProjectInfo;
}) => {
  const navigate = useNavigate();
  const [rooms, setRooms] = useState<Room[]>([]);
  const [selectedRoom, setSelectedRoom] = useState<string>(" ");
  const [projectInfo, setProjectInfo] = useState(initialData);
  const [isEditingProject, setIsEditingProject] = useState(false);
  const [editedProjectInfo, setEditedProjectInfo] = useState(initialData);
  const [showInfoModal, setShowInfoModal] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(
    null
  );
  const [clientSearch, setClientSearch] = useState("");
  const [creatorSearch, setCreatorSearch] = useState("");
  const [showClientDropdown, setShowClientDropdown] = useState(false);
  const [showCreatorDropdown, setShowCreatorDropdown] = useState(false);

  const [laborLineItems, setLaborLineItems] = useState<{
    [key: string]: { [key: string]: LaborLineItem[] };
  }>({});

  type Wire = {
    type: string;
    length: number;
    quantity: number;
    cost: number;
  };

  const [wires, setWires] = useState<Wire[]>([]);
  const [rackMaterials, setRackMaterials] = useState<
    Array<{ type: string; quantity: number; cost: number }>
  >([]);
  const [expandedCategories, setExpandedCategories] = useState<string[]>([]);
  const [expandedSubCategories, setExpandedSubCategories] = useState<string[]>(
    []
  );

  const editRef = useRef<HTMLDivElement>(null); // Ref for detecting outside clicks

  // Close edit mode when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (editRef.current && !editRef.current.contains(event.target as Node)) {
        setIsEditingProject(false);
        setEditedProjectInfo(projectInfo); // Retain original values
      }
    };

    if (isEditingProject) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isEditingProject, projectInfo]);

  // Filter clients and creators for dropdowns
  const filteredClients = mockClients.filter((client) =>
    client.toLowerCase().includes(clientSearch.toLowerCase())
  );
  const filteredCreators = mockCreators.filter((creator) =>
    creator.toLowerCase().includes(creatorSearch.toLowerCase())
  );

  // Initialize rooms
  useEffect(() => {
    if (rooms.length === 0) {
      const defaultRoom: Room = {
        id: "room-1",
        name: "Room 1",
        ceilingHeight: { feet: 0, inches: 0 },
        laborItems: [],
      };
      setRooms([defaultRoom]);
      setSelectedRoom(defaultRoom.id);
    }
  }, [rooms.length]);

  // Handle project editing
  const handleEditProject = () => {
    setIsEditingProject(true);
    setEditedProjectInfo(projectInfo);
    setClientSearch(projectInfo.client);
    setCreatorSearch(projectInfo.createdBy);
  };

  const handleSaveProject = () => {
    setProjectInfo(editedProjectInfo);
    setIsEditingProject(false);
    setShowClientDropdown(false);
  };

  const handleCancelEditProject = () => {
    setIsEditingProject(false);
    setEditedProjectInfo(projectInfo);
    setClientSearch("");
    setCreatorSearch("");
    setShowClientDropdown(false);
  };

  // Room management functions
  const handleAddRoom = (roomName: string) => {
    const newRoom: Room = {
      id: `room-${rooms.length + 1}`,
      name: roomName,
      ceilingHeight: { feet: 0, inches: 0 },
      laborItems: [],
    };
    setRooms([...rooms, newRoom]);
    setSelectedRoom(newRoom.id);
  };

  const updateRoomName = (roomId: string, newName: string) => {
    setRooms(
      rooms.map((room) =>
        room.id === roomId ? { ...room, name: newName } : room
      )
    );
  };

  const updateCeilingHeight = (
    roomId: string,
    field: "feet" | "inches",
    value: number
  ) => {
    setRooms(
      rooms.map((room) => {
        if (room.id === roomId) {
          return {
            ...room,
            ceilingHeight: {
              ...room.ceilingHeight,
              [field]:
                field === "feet"
                  ? Math.max(0, value)
                  : Math.min(11, Math.max(0, value)),
            },
          };
        }
        return room;
      })
    );
  };

  const handleDeleteRoom = (roomId: string) => {
    setRooms(rooms.filter((room) => room.id !== roomId));
    setLaborLineItems((prev) => {
      const newLaborLineItems = { ...prev };
      delete newLaborLineItems[roomId];
      return newLaborLineItems;
    });
    if (selectedRoom === roomId) {
      setSelectedRoom(rooms.length > 1 ? rooms[0].id : " ");
    }
  };

  // Category and subcategory management
  const toggleCategory = (category: string) => {
    setExpandedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };

  const toggleSubCategory = (subCategory: string) => {
    setExpandedSubCategories((prev) =>
      prev.includes(subCategory)
        ? prev.filter((sc) => sc !== subCategory)
        : [...prev, subCategory]
    );
  };

  // Labor line item functions
  const getLaborItemHours = useCallback(
    (category: string, subCategory: string, itemName: string): number => {
      if (category === "Programming") {
        return programmingItems[subCategory]?.[itemName] || 0;
      }
      if (category === "Training") {
        return trainingItems[itemName] || 0;
      }
      if (category === "Rack Fabrication") {
        return rackFabricationItems[itemName] || 0;
      }
      if (category === "Engineering") {
        return engineeringItems[subCategory]?.[itemName] || 0;
      }
      if (category === "Field Engineering") {
        return fieldEngineeringItems[subCategory]?.[itemName] || 0;
      }
      if (category === "Quality Assurance") {
        return qualityAssuranceItems[subCategory]?.[itemName] || 0;
      }
      if (subCategory === "Decommissioning") {
        const originalHours = Object.values(laborItems).reduce(
          (acc, subcategory) => {
            return acc + (subcategory[itemName] || 0);
          },
          0
        );
        return originalHours * 0.25;
      }
      return laborItems[subCategory]?.[itemName] || 0;
    },
    []
  );

  const addLaborLineItem = useCallback(
    (subCategory: string) => {
      const roomId = selectedRoom as string;
      const newItem: LaborLineItem = {
        id: `item-${Date.now()}`,
        name: "",
        hoursPerTask: 0,
        qtyPerTask: 1,
      };

      setLaborLineItems((prev) => ({
        ...prev,
        [roomId]: {
          ...prev[roomId],
          [subCategory]: [...(prev[roomId]?.[subCategory] || []), newItem],
        },
      }));
    },
    [selectedRoom]
  );

  const updateLaborLineItem = useCallback(
    (
      category: string,
      subCategory: string,
      itemId: string,
      updates: Partial<LaborLineItem>
    ) => {
      const roomId = selectedRoom as string;
      setLaborLineItems((prev) => ({
        ...prev,
        [roomId]: {
          ...prev[roomId],
          [subCategory]: prev[roomId]?.[subCategory].map((item) =>
            item.id === itemId
              ? {
                  ...item,
                  ...updates,
                  hoursPerTask:
                    updates.name &&
                    getLaborItemHours(category, subCategory, updates.name)
                      ? getLaborItemHours(category, subCategory, updates.name)
                      : updates.hoursPerTask ?? item.hoursPerTask ?? 0,
                }
              : item
          ),
        },
      }));
    },
    [selectedRoom, getLaborItemHours]
  );

  const deleteLaborLineItem = useCallback(
    (subCategory: string, itemId: string) => {
      const roomId = selectedRoom as string;
      setLaborLineItems((prev) => ({
        ...prev,
        [roomId]: {
          ...prev[roomId],
          [subCategory]: prev[roomId]?.[subCategory].filter(
            (item) => item.id !== itemId
          ),
        },
      }));
    },
    [selectedRoom]
  );

  const getLaborItems = useCallback((category: string, subCategory: string) => {
    if (category === "Programming") {
      return Object.keys(programmingItems[subCategory] || {});
    }
    if (category === "Training") {
      return Object.keys(trainingItems || {});
    }
    if (category === "Rack Fabrication") {
      return Object.keys(rackFabricationItems || {});
    }
    if (category === "Engineering") {
      return Object.keys(engineeringItems[subCategory] || {});
    }
    if (category === "Field Engineering") {
      return Object.keys(fieldEngineeringItems[subCategory] || {});
    }
    if (category === "Quality Assurance") {
      return Object.keys(qualityAssuranceItems[subCategory] || {});
    }
    if (subCategory === "Decommissioning") {
      return Object.keys(laborItems).flatMap((subcategory) =>
        Object.keys(laborItems[subcategory])
      );
    }
    return Object.keys(laborItems[subCategory] || {});
  }, []);

  // Wire and rack material functions
  const addWire = useCallback(() => {
    setWires((prevWires) => [
      ...prevWires,
      { type: "", length: 0, quantity: 1, cost: 0 },
    ]);
  }, []);

  const calculateWireCost = (wire: Wire) => {
    if (wire.type in wireCosts) {
      const costPer1000Feet = wireCosts[wire.type as keyof typeof wireCosts];
      return (wire.length / 1000) * costPer1000Feet * wire.quantity;
    }
    return 0; // Default to 0 cost if type is invalid
  };

  const updateWire = useCallback(
    (index: number, field: string, value: any) => {
      setWires((prevWires) => {
        const updatedWires = [...prevWires];
        updatedWires[index] = { ...updatedWires[index], [field]: value };

        if (field === "length") {
          // Allow any input for length, including partial numbers
          updatedWires[index].length = value;
        } else if (field === "quantity") {
          // Ensure quantity is always a positive integer
          updatedWires[index].quantity = Math.max(
            1,
            Number.parseInt(value) || 1
          );
        }

        // Recalculate cost
        updatedWires[index].cost = calculateWireCost(updatedWires[index]);

        return updatedWires;
      });
    },
    [calculateWireCost]
  );

  const addRackMaterial = useCallback(() => {
    setRackMaterials((prevMaterials) => [
      ...prevMaterials,
      { type: "", quantity: 1, cost: 0 },
    ]);
  }, []);

  const updateRackMaterial = useCallback(
    (index: number, field: string, value: any) => {
      setRackMaterials((prevMaterials) => {
        const updatedMaterials = [...prevMaterials];
        updatedMaterials[index] = {
          ...updatedMaterials[index],
          [field]: value,
        };

        if (field === "quantity") {
          updatedMaterials[index].quantity = Math.max(
            1,
            Number.parseInt(value) || 1
          );
        }

        // Here you would typically calculate the cost based on the material type and quantity
        // For now, we'll just set a placeholder calculation
        updatedMaterials[index].cost = updatedMaterials[index].quantity * 10; // Placeholder: $10 per unit

        return updatedMaterials;
      });
    },
    []
  );

  // Update wire costs when needed
  useEffect(() => {
    setWires((prevWires) =>
      prevWires.map((wire) => {
        const newCost = calculateWireCost(wire);
        return Math.abs(wire.cost - newCost) > 0.01
          ? { ...wire, cost: newCost }
          : wire;
      })
    );
  }, [calculateWireCost]);

  // Initialize labor line items for new rooms
  useEffect(() => {
    if (selectedRoom && !laborLineItems[selectedRoom]) {
      setLaborLineItems((prev) => ({
        ...prev,
        [selectedRoom]: {
          "Project Management": [
            {
              id: "pm-1",
              name: "",
              hoursPerTask: 0,
              qtyPerTask: 1,
            },
          ],
        },
      }));
    }
  }, [selectedRoom, laborLineItems]);

  // Render subcategories for labor items
  const renderSubCategories = (category: string) => {
    let subCategories: string[] = [];
    switch (category) {
      case "Install":
        subCategories = [
          "Wall mounted",
          "Ceiling mounted",
          "Surface mounted",
          "Floor mounted",
          "On-Site Equipment Rack",
          "Decommissioning",
        ];
        break;
      case "Programming":
        subCategories = ["Control", "Network", "Audio"];
        break;
      case "Rack Fabrication":
        subCategories = ["Equipment Rack"];
        break;
      case "Engineering":
        subCategories = [
          "Video",
          "Audio",
          "Conferencing",
          "Recording",
          "Control",
          "Network",
          "Extensions",
          "Storage",
          "Cables",
          "Materials",
        ];
        break;
      case "Field Engineering":
        subCategories = [
          "Video",
          "Audio",
          "Control",
          "Conferencing",
          "Recording",
          "Network",
        ];
        break;
      case "Quality Assurance":
        subCategories = ["Rack QA"];
        break;
      case "Training":
        subCategories = ["Training"];
        break;
      case "Project Management":
        return renderProjectManagement();
      default:
        return null;
    }

    return subCategories.map((subCategory) => (
      <div
        key={subCategory}
        className="border border-gray-200 dark:border-gray-700 rounded-lg"
      >
        <button
          onClick={() => toggleSubCategory(subCategory)}
          className="w-full px-4 py-2 text-left text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg flex items-center justify-between"
        >
          {subCategory}
          <svg
            className={`w-5 h-5 transition-transform ${
              expandedSubCategories.includes(subCategory)
                ? "transform rotate-180"
                : ""
            }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </button>

        {expandedSubCategories.includes(subCategory) && (
          <div className="relative z-10 p-4 space-y-4">
            {(laborLineItems[selectedRoom]?.[subCategory] || []).length > 0 && (
              <div className="grid grid-cols-[2fr,1fr,1fr,1fr] gap-4 mb-2">
                <div className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Task
                </div>
                <div className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Hours per Task
                </div>
                <div className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Qty per Task
                </div>
                <div className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Subtotal per Task
                </div>
              </div>
            )}

            {(laborLineItems[selectedRoom]?.[subCategory] || []).map((item) => (
              <div
                key={item.id}
                className="relative z-0 grid grid-cols-[2fr,1fr,1fr,1fr] gap-4 items-center"
              >
                <div className="relative">
                  <input
                    type="text"
                    value={item.name}
                    onChange={(e) => {
                      const value = e.target.value;
                      updateLaborLineItem(category, subCategory, item.id, {
                        name: value,
                        hoursPerTask: getLaborItemHours(
                          category,
                          subCategory,
                          value
                        ),
                      });
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                    placeholder="Enter or select task"
                    list={`${subCategory}-tasks`}
                  />
                  <datalist id={`${subCategory}-tasks`}>
                    {getLaborItems(category, subCategory).map((name) => (
                      <option key={name} value={name} />
                    ))}
                  </datalist>
                </div>
                <input
                  type="number"
                  value={item.hoursPerTask ?? 0}
                  onChange={(e) =>
                    updateLaborLineItem(category, subCategory, item.id, {
                      hoursPerTask: Number.parseFloat(e.target.value) || 0,
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                />
                <input
                  type="number"
                  value={item.qtyPerTask || ""}
                  onChange={(e) =>
                    updateLaborLineItem(category, subCategory, item.id, {
                      qtyPerTask: Number.parseFloat(e.target.value) || 0,
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                />
                <div className="flex items-center gap-2">
                  <div className="flex-1 px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300">
                    {(item.hoursPerTask * item.qtyPerTask).toFixed(2)}
                  </div>
                  <button
                    onClick={() => deleteLaborLineItem(subCategory, item.id)}
                    className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            ))}

            <button
              onClick={() => addLaborLineItem(subCategory)}
              className="w-full px-3 py-2 text-purple-600 hover:bg-purple-50 dark:text-purple-400 dark:hover:bg-purple-900/50 rounded-lg"
            >
              + Add Labor Item
            </button>
            <div className="flex justify-end items-center gap-2 mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
              <div className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Combined Subtotal:
              </div>
              <div className="px-3 py-2 bg-purple-50 dark:bg-purple-900/50 border border-purple-200 dark:border-purple-800 rounded-lg text-purple-700 dark:text-purple-300 font-medium">
                {(
                  laborLineItems[selectedRoom]?.[subCategory]?.reduce(
                    (total, item) =>
                      total + item.hoursPerTask * item.qtyPerTask,
                    0
                  ) || 0
                ).toFixed(2)}
              </div>
            </div>
          </div>
        )}
      </div>
    ));
  };

  // Render project management section
  const renderProjectManagement = () => {
    // This would need to be calculated based on install hours
    const projectManagementHours = 0; // Placeholder

    return (
      <div className="space-y-4">
        <div className="flex items-center gap-4">
          <span className="text-gray-600 dark:text-gray-400">
            25% of Install Time
          </span>
          <span className="text-gray-600 dark:text-gray-400">
            {projectManagementHours} hours
          </span>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <Navbar />
      <div className="flex min-h-[calc(100vh-4rem)]">
        {/* Sidebar */}
        <SideNav
          isProjectView={true}
          rooms={rooms}
          selectedRoom={selectedRoom}
          setSelectedRoom={setSelectedRoom}
          onAddRoom={handleAddRoom}
          onUpdateRoomName={updateRoomName}
          onDeleteRoom={handleDeleteRoom}
        />
        <div className="flex-1 p-4">
          {/* Main Content */}
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Sticky header */}
            <div ref={editRef}>
              <StickyHeader
                projectInfo={projectInfo}
                editedProjectInfo={editedProjectInfo}
                isEditingProject={isEditingProject}
                selectedRoom={selectedRoom}
                rooms={rooms}
                onEditProject={handleEditProject}
                onSaveProject={handleSaveProject}
                onCancelEditProject={handleCancelEditProject}
                onUpdateCeilingHeight={updateCeilingHeight}
                setEditedProjectInfo={setEditedProjectInfo}
                setClientSearch={setClientSearch}
                setCreatorSearch={setCreatorSearch}
                clientSearch={clientSearch}
                creatorSearch={creatorSearch}
                showClientDropdown={showClientDropdown}
                showCreatorDropdown={showCreatorDropdown}
                setShowClientDropdown={setShowClientDropdown}
                setShowCreatorDropdown={setShowCreatorDropdown}
                filteredClients={filteredClients}
                filteredCreators={filteredCreators}
              />
            </div>

            {/* Scrollable content area */}
            <ScrollableContent
              selectedRoom={selectedRoom}
              rooms={rooms}
              laborLineItems={laborLineItems}
              expandedCategories={expandedCategories}
              expandedSubCategories={expandedSubCategories}
              toggleCategory={toggleCategory}
              toggleSubCategory={toggleSubCategory}
              renderSubCategories={renderSubCategories}
              wires={wires}
              updateWire={updateWire}
              addWire={addWire}
              wireTypes={wireTypes}
              rackMaterials={rackMaterials}
              updateRackMaterial={updateRackMaterial}
              addRackMaterial={addRackMaterial}
              rackMaterialTypes={rackMaterialTypes}
            />
          </div>

          {/* Info Modal */}
          {showInfoModal && (
            <Modal
              isOpen={!!showInfoModal}
              onClose={() => setShowInfoModal(null)}
              title={
                showInfoModal === "room"
                  ? "Room Information"
                  : "Project Information"
              }
            >
              {showInfoModal === "room" ? (
                <p className="text-gray-600 dark:text-gray-400">
                  This section allows you to manage the labor items for the
                  selected room.
                </p>
              ) : (
                <p className="text-gray-600 dark:text-gray-400">
                  This section displays the project information. You can edit
                  the project details here.
                </p>
              )}
            </Modal>
          )}

          {/* Delete Confirmation Modal */}
          <DeleteConfirmationModal
            isOpen={!!showDeleteConfirm}
            onClose={() => setShowDeleteConfirm(null)}
            onConfirm={() => {
              if (showDeleteConfirm) {
                handleDeleteRoom(showDeleteConfirm);
                setShowDeleteConfirm(null);
              }
            }}
            itemName="room"
          />
        </div>
      </div>
    </div>
  );
};

export default ProjectView;
