import React, { useState, useEffect, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  laborItems,
  programmingItems,
  trainingItems,
  rackFabricationItems,
  engineeringItems,
  fieldEngineeringItems,
  qualityAssuranceItems,
} from "../../lib/laborItems";
import "jspdf-autotable";
import {
  Check,
  LogOut,
  Pencil,
  Plus,
  Trash2,
  X,
  ChevronDown,
} from "lucide-react";
import { mockProjects } from "../../lib/mockData";

// Mock rooms data
const mockRooms = [
  "Conference Room",
  "Training Room",
  "Board Room",
  "Huddle Room",
];

type LaborLineItem = {
  id: string;
  name: string;
  hoursPerTask: number;
  qtyPerTask: number;
};

// Update Room type to include ceiling height
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

// Types remain the same, adding ProjectInfo type
type ProjectInfo = {
  id: string;
  project: string;
  client: string;
  createdBy: string;
};

// Add ceiling height type
type CeilingHeight = {
  feet: number;
  inches: number;
};

// Mock data for clients and creators
const mockClients = [
  "Acme Corp",
  "TechGiant Inc",
  "Innovative Solutions",
  "Global Systems",
];
const mockCreators = ["John Doe", "Jane Smith", "Alex Johnson", "Sam Wilson"];

// Update ProjectView props
const ProjectView = ({
  projectId,
  initialData,
}: {
  projectId: string | undefined;
  initialData: ProjectInfo;
}) => {
  const navigate = useNavigate();
  const [rooms, setRooms] = useState<Room[]>([]);
  const [selectedRoom, setSelectedRoom] = useState<string>("");
  const [projectInfo, setProjectInfo] = useState(initialData);
  const [isEditingProject, setIsEditingProject] = useState(false);
  const [editedProjectInfo, setEditedProjectInfo] = useState(initialData);
  const [isAddingRoom, setIsAddingRoom] = useState(false);
  const [newRoomName, setNewRoomName] = useState("");
  const [roomSearch, setRoomSearch] = useState("");
  const [showRoomDropdown, setShowRoomDropdown] = useState(false);

  // New state for client and creator dropdowns
  const [showClientDropdown, setShowClientDropdown] = useState(false);
  const [showCreatorDropdown, setShowCreatorDropdown] = useState(false);
  const [clientSearch, setClientSearch] = useState("");
  const [creatorSearch, setCreatorSearch] = useState("");

  // Add this state at the top of the component
  const [showInfoModal, setShowInfoModal] = useState<string | null>(null);

  // In ProjectView component, remove the global ceiling height state
  // const [ceilingHeight, setCeilingHeight] = useState<CeilingHeight>({ feet: 0, inches: 0 })

  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(
    null
  );

  const [laborLineItems, setLaborLineItems] = useState<{
    [key: string]: { [key: string]: LaborLineItem[] };
  }>({});

  const [selectedProjectManagementOption, setSelectedProjectManagementOption] =
    useState<string | null>(null);

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

  const handleDeleteRoom = (roomId: string) => {
    setRooms(rooms.filter((room) => room.id !== roomId));
    setLaborLineItems((prev) => {
      const newLaborLineItems = { ...prev };
      delete newLaborLineItems[roomId];
      return newLaborLineItems;
    });
    if (selectedRoom === roomId) {
      setSelectedRoom(rooms.length > 1 ? rooms[0].id : "");
    }
    setShowDeleteConfirm(null);
  };

  // Calculate difficulty level
  const calculateDifficulty = useCallback(
    (height: CeilingHeight): { level: number; label: string } => {
      const totalInches = height.feet * 12 + height.inches;
      if (totalInches <= 144) {
        return { level: 0, label: "Basic" };
      } else if (totalInches <= 192) {
        return { level: 5, label: "Intermediate" };
      } else {
        return { level: 10, label: "Advanced" };
      }
    },
    []
  );

  // Calculate next multiple of 8 for total hours
  const getNextMultipleOf8 = (value: number): number => {
    return Math.ceil(value / 8) * 8;
  };

  // Calculate total hours for a category
  const calculateCategoryHours = useCallback(
    (category: string): { hours: number; tooltip: string } => {
      let totalHours = 0;
      const roundingFunction = Math.ceil;
      let roundingBase = 2;

      if (category === "Install") {
        roundingBase = 8;
        totalHours = installSubCategories.reduce(
          (categoryTotal, subCategory) => {
            return (
              categoryTotal +
              (laborLineItems[selectedRoom]?.[subCategory]?.reduce(
                (total, item) => total + item.hoursPerTask * item.qtyPerTask,
                0
              ) || 0)
            );
          },
          0
        );
      } else if (category === "Programming") {
        totalHours = programmingSubCategories.reduce(
          (categoryTotal, subCategory) => {
            return (
              categoryTotal +
              (laborLineItems[selectedRoom]?.[subCategory]?.reduce(
                (total, item) => total + item.hoursPerTask * item.qtyPerTask,
                0
              ) || 0)
            );
          },
          0
        );
      } else if (category === "Training") {
        totalHours =
          laborLineItems[selectedRoom]?.["Training"]?.reduce(
            (total, item) => total + item.hoursPerTask * item.qtyPerTask,
            0
          ) || 0;
      } else if (category === "Rack Fabrication") {
        totalHours = rackFabricationSubCategories.reduce(
          (categoryTotal, subCategory) => {
            return (
              categoryTotal +
              (laborLineItems[selectedRoom]?.[subCategory]?.reduce(
                (total, item) => total + item.hoursPerTask * item.qtyPerTask,
                0
              ) || 0)
            );
          },
          0
        );
      } else if (category === "Engineering") {
        totalHours = engineeringSubCategories.reduce(
          (categoryTotal, subCategory) => {
            return (
              categoryTotal +
              (laborLineItems[selectedRoom]?.[subCategory]?.reduce(
                (total, item) => total + item.hoursPerTask * item.qtyPerTask,
                0
              ) || 0)
            );
          },
          0
        );
      } else if (category === "Field Engineering") {
        totalHours = fieldEngineeringSubCategories.reduce(
          (categoryTotal, subCategory) => {
            return (
              categoryTotal +
              (laborLineItems[selectedRoom]?.[subCategory]?.reduce(
                (total, item) => total + item.hoursPerTask * item.qtyPerTask,
                0
              ) || 0)
            );
          },
          0
        );
      } else if (category === "Quality Assurance") {
        totalHours = qualityAssuranceSubCategories.reduce(
          (categoryTotal, subCategory) => {
            return (
              categoryTotal +
              (laborLineItems[selectedRoom]?.[subCategory]?.reduce(
                (total, item) => total + item.hoursPerTask * item.qtyPerTask,
                0
              ) || 0)
            );
          },
          0
        );
      } else if (category === "Project Management") {
        const installHours = calculateCategoryHours("Install").hours;
        totalHours = Math.ceil((installHours * 0.25) / 2) * 2;
      }

      const roundedHours =
        roundingFunction(totalHours / roundingBase) * roundingBase;

      return {
        hours: roundedHours,
        tooltip:
          category === "Install"
            ? "Total hours have been rounded off to the next multiple of 8"
            : category === "Project Management"
            ? "Total Hours represent 25% of the Install Total Hours"
            : "Total hours have been rounded off to the next multiple of 2",
      };
    },
    [laborLineItems, selectedRoom]
  );

  useEffect(() => {
    // In a real app, fetch project details
    setProjectInfo(initialData);
  }, [initialData]);

  // Filter rooms for dropdown
  const filteredRooms = mockRooms.filter((room) =>
    room.toLowerCase().includes(roomSearch.toLowerCase())
  );

  // Update handleAddRoom to include ceiling height
  const handleAddRoom = () => {
    if (newRoomName.trim()) {
      const newRoom: Room = {
        id: `room-${rooms.length + 1}`,
        name: newRoomName.trim(),
        ceilingHeight: { feet: 0, inches: 0 },
        laborItems: [],
      };
      setRooms([...rooms, newRoom]);
      setSelectedRoom(newRoom.id);
      setIsAddingRoom(false);
      setNewRoomName("");
    }
  };

  const categories = [
    "Install",
    "Programming",
    "Rack Fabrication",
    "Engineering",
    "Field Engineering",
    "Quality Assurance",
    "Project Management",
    "Training",
  ];

  const installSubCategories = [
    "Wall mounted",
    "Ceiling mounted",
    "Surface mounted",
    "Floor mounted",
    "On-Site Equipment Rack",
    "Decommissioning",
  ];

  const rackFabricationSubCategories = ["Equipment Rack"];

  const programmingSubCategories = ["Control", "Network", "Audio"];

  const engineeringSubCategories = [
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

  const fieldEngineeringSubCategories = [
    "Video",
    "Audio",
    "Control",
    "Conferencing",
    "Recording",
    "Network",
  ];

  const qualityAssuranceSubCategories = ["Rack QA"];

  const [expandedCategories, setExpandedCategories] = useState<string[]>([]);
  const [expandedSubCategories, setExpandedSubCategories] = useState<string[]>(
    []
  );

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

  // Update the addLaborLineItem function
  const addLaborLineItem = useCallback(
    (subCategory: string) => {
      const roomId = selectedRoom as string;
      const newItem: LaborLineItem = {
        id: `item-${Date.now()}`,
        name: "",
        hoursPerTask: 0,
        qtyPerTask: 1, // Set default to 1
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

  // Update the useEffect for default room to include ceiling height
  const initializeRooms = useCallback(() => {
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

  useEffect(() => {
    initializeRooms();
  }, [initializeRooms]);

  // Add state for room editing
  const [editingRoom, setEditingRoom] = useState<string | null>(null);
  const [editingRoomName, setEditingRoomName] = useState("");

  // Update room name function
  const updateRoomName = (roomId: string, newName: string) => {
    setRooms(
      rooms.map((room) =>
        room.id === roomId ? { ...room, name: newName } : room
      )
    );
    setEditingRoom(null);
  };

  // Add function to update ceiling height
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

  const renderSubCategories = (category: string) => {
    let subCategories: string[] = [];
    switch (category) {
      case "Install":
        subCategories = installSubCategories;
        break;
      case "Programming":
        subCategories = programmingSubCategories;
        break;
      case "Rack Fabrication":
        subCategories = rackFabricationSubCategories;
        break;
      case "Engineering":
        subCategories = engineeringSubCategories;
        break;
      case "Field Engineering":
        subCategories = fieldEngineeringSubCategories;
        break;
      case "Quality Assurance":
        subCategories = Object.keys(qualityAssuranceItems);
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

  // Update the renderProjectManagement function
  const renderProjectManagement = () => {
    const installHours = calculateCategoryHours("Install").hours;
    const projectManagementHours = Math.ceil((installHours * 0.25) / 2) * 2;

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

  // Remove the useEffect hooks related to the old Project Management options

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

  const wireTypes = [
    "22/2 SH",
    "18/2",
    "16/2",
    "14/2",
    "12/2",
    "10/2",
    "RG8",
    "RG6",
    "CAT6",
    "CAT6 SH",
    "CAT6A SH",
    "CAT7A SH",
    "DZ004",
    "DZ006",
    "18/2 & 22/2 SH",
    "MHR 5C",
    "MHR 2C",
    "RG59",
  ];

  const wireCosts = {
    "22/2 SH": 500,
    "18/2": 200,
    "16/2": 1000,
    "14/2": 200,
    "12/2": 200,
    "10/2": 200,
    RG8: 200,
    RG6: 200,
    CAT6: 200,
    "CAT6 SH": 200,
    "CAT6A SH": 200,
    "CAT7A SH": 200,
    DZ004: 2000,
    DZ006: 2000,
    "18/2 & 22/2 SH": 200,
    "MHR 5C": 200,
    "MHR 2C": 200,
    RG59: 200,
  };

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

  const MaterialsCalculation: React.FC<{
    wires: Array<{
      type: string;
      length: number;
      quantity: number;
      cost: number;
    }>;
    updateWire: (index: number, field: string, value: any) => void;
    addWire: () => void;
    wireTypes: string[];
  }> = ({ wires, updateWire, addWire, wireTypes }) => {
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-4 gap-4 font-medium">
          <div>Wire Type</div>
          <div>Length (Feet)</div>
          <div>Qty. (# in run)</div>
          <div>Cost</div>
        </div>
        {wires.map((wire: any, index: number) => (
          <div key={index} className="grid grid-cols-4 gap-4">
            <select
              value={wire.type}
              onChange={(e) => updateWire(index, "type", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            >
              <option value="">Select Wire Type</option>
              {wireTypes.map((type: string) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
            <input
              type="text"
              inputMode="decimal"
              value={wire.length}
              onChange={(e) => updateWire(index, "length", e.target.value)}
              onBlur={(e) => {
                const value = Number.parseFloat(e.target.value);
                updateWire(
                  index,
                  "length",
                  isNaN(value) ? "" : value.toString()
                );
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            />
            <input
              type="number"
              value={wire.quantity}
              onChange={(e) => updateWire(index, "quantity", e.target.value)}
              min="1"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            />
            <div className="px-3 py-2 bg-gray-100 dark:bg-gray-600 rounded-lg">
              ${wire.cost.toFixed(2)}
            </div>
          </div>
        ))}
        <button
          onClick={addWire}
          className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 dark:bg-purple-500 dark:hover:bg-purple-600"
        >
          Add Wire
        </button>
      </div>
    );
  };

  // Inside the ProjectView component, add this useEffect:
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

  // Add a new useEffect to handle wire cost updates
  useEffect(() => {
    const updateWireCosts = () => {
      setWires((prevWires) =>
        prevWires.map((wire) => ({
          ...wire,
          cost: calculateWireCost(wire),
        }))
      );
    };

    updateWireCosts();
  }, [calculateWireCost]);

  const rackMaterialTypes = [
    "1-space Blank",
    "2-space Blank",
    "3-space Blank",
    "1-space vent",
    "2-space vent",
    "3-space vent",
    "Rack Screw",
    "Lacing Strip",
    "Wire Tie",
    'Flexo 1/2"-1 1/4"',
    'Flexo 1 1/4" - 2 3/4"',
    'PET (velcro) 1 1/2"',
    'PET (velcro) 2"',
    '12" power cord',
    '18" Power Cord',
    '24" Power Cord',
    "Premade",
  ];

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

  const RackMaterialsCalculation: React.FC<{
    materials: Array<{ type: string; quantity: number; cost: number }>;
    updateMaterial: (index: number, field: string, value: any) => void;
    addMaterial: () => void;
    materialTypes: string[];
  }> = ({ materials, updateMaterial, addMaterial, materialTypes }) => {
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-3 gap-4 font-medium">
          <div>Material Type</div>
          <div>Qty.</div>
          <div>Cost</div>
        </div>
        {materials.map((material, index) => (
          <div key={index} className="grid grid-cols-3 gap-4">
            <select
              value={material.type}
              onChange={(e) => updateMaterial(index, "type", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            >
              <option value="">Select Material Type</option>
              {materialTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
            <input
              type="number"
              value={material.quantity}
              onChange={(e) =>
                updateMaterial(index, "quantity", e.target.value)
              }
              min="1"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            />
            <div className="px-3 py-2 bg-gray-100 dark:bg-gray-600 rounded-lg">
              ${material.cost.toFixed(2)}
            </div>
          </div>
        ))}
        <button
          onClick={addMaterial}
          className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 dark:bg-purple-500 dark:hover:bg-purple-600"
        >
          Add Material
        </button>
      </div>
    );
  };

  // Add helper functions for difficulty meter color and width:
  const getDifficultyColor = (label: string) => {
    switch (label) {
      case "Basic":
        return "bg-green-500";
      case "Intermediate":
        return "bg-orange-500";
      case "Advanced":
        return "bg-gradient-to-r from-orange-500 to-red-500";
      default:
        return "bg-gray-600";
    }
  };

  const getDifficultyWidth = (label: string) => {
    switch (label) {
      case "Basic":
        return "25%";
      case "Intermediate":
        return "66%";
      case "Advanced":
        return "100%";
      default:
        return "0%";
    }
  };

  useEffect(() => {
    setEditedProjectInfo(initialData);
  }, [initialData])

  const handleEditProject = () => {
    setIsEditingProject(true);
    setEditedProjectInfo(projectInfo);
    setClientSearch(projectInfo.client);
    setCreatorSearch(projectInfo.createdBy);
  };

  const handleSaveProject = () => {
    setProjectInfo(editedProjectInfo);
    setIsEditingProject(false);
    // Here you would typically update the project info on the server
  };

  const handleCancelEditProject = () => {
    setIsEditingProject(false);
    setEditedProjectInfo(projectInfo);
    setClientSearch("");
    setCreatorSearch("");
  };

  const filteredClients = mockClients.filter((client) =>
    client.toLowerCase().includes(clientSearch.toLowerCase())
  );

  const filteredCreators = mockCreators.filter((creator) =>
    creator.toLowerCase().includes(creatorSearch.toLowerCase())
  );

  // ... (previous code remains unchanged)

  return (
    <div className="flex h-screen overflow-hidden bg-[#1B1E27]">
      {/* Sidebar */}
      <div className="w-64 flex flex-col bg-[#1B1E27] border-r border-gray-700">
        {/* Logo */}
        <div className="p-4">
          <Link
            to="/"
            className="text-xl font-bold text-purple-400 hover:text-purple-300 transition-colors"
          >
            LaborCalci
          </Link>
        </div>

        {/* Rooms Section */}
        <div className="flex-1 px-4">
          <h4 className="text-sm font-medium text-gray-400 mb-3">Rooms</h4>
          <div className="space-y-2">
            {rooms.map((room) => (
              <div
                key={room.id}
                className={`group relative rounded-lg transition-colors ${
                  selectedRoom === room.id
                    ? "bg-purple-900/50"
                    : "hover:bg-gray-800"
                }`}
              >
                {editingRoom === room.id ? (
                  <div className="flex items-center p-2">
                    <input
                      type="text"
                      value={editingRoomName}
                      onChange={(e) => setEditingRoomName(e.target.value)}
                      className="flex-1 px-2 py-1 bg-gray-700 border border-gray-600 rounded text-white text-sm"
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          updateRoomName(room.id, editingRoomName);
                        }
                      }}
                    />
                    <button
                      onClick={() => updateRoomName(room.id, editingRoomName)}
                      className="ml-2 p-1 text-purple-400 hover:text-purple-300"
                    >
                      <Check className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <div
                    onClick={() => setSelectedRoom(room.id)}
                    className="w-full p-3 text-left text-gray-100 flex items-center justify-between cursor-pointer"
                  >
                    <span>{room.name}</span>
                    <div className="opacity-0 group-hover:opacity-100 flex items-center gap-2 transition-opacity">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setEditingRoom(room.id);
                          setEditingRoomName(room.name);
                        }}
                        className="p-1 text-gray-400 hover:text-purple-400 transition-colors"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setShowDeleteConfirm(room.id);
                        }}
                        className="p-1 text-gray-400 hover:text-red-400 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Add Room Button/Form */}
          {isAddingRoom ? (
            <div className="mt-2 flex items-center">
              <input
                type="text"
                placeholder="Room name"
                value={newRoomName}
                onChange={(e) => setNewRoomName(e.target.value)}
                className="flex-1 px-2 py-1 bg-gray-700 border border-gray-600 rounded text-white text-sm"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleAddRoom();
                  }
                }}
              />
              <button
                onClick={handleAddRoom}
                className="ml-2 p-1 text-purple-400 hover:text-purple-300"
              >
                <Check className="w-4 h-4" />
              </button>
              <button
                onClick={() => setIsAddingRoom(false)}
                className="ml-1 p-1 text-gray-400 hover:text-gray-300"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => setIsAddingRoom(true)}
              className="mt-2 text-purple-400 hover:text-purple-300 text-sm flex items-center gap-1"
            >
              <Plus className="w-4 h-4" />
              Add Room
            </button>
          )}
        </div>

        {/* Logout Button */}
        <button
          onClick={() => navigate("/")}
          className="p-4 text-gray-400 hover:text-gray-300 flex items-center gap-2 transition-colors"
        >
          <LogOut className="w-5 h-5" />
          <span>Logout</span>
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Sticky header */}
        <div className="sticky top-0 z-10 bg-[#1B1E27] pb-4 px-8 pt-8 border-b border-gray-700">
          <div className="flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <div className="space-y-2">
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
                      className="text-2xl font-bold text-white bg-[#2A2F3B] border border-gray-600 rounded-md px-2 py-1"
                    />
                    <div className="flex items-center relative">
                      <span className="text-gray-400 mr-2">Client:</span>
                      <div className="relative">
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
                          className="text-white bg-[#2A2F3B] border border-gray-600 rounded-md px-2 py-1 pr-8"
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
                        <ul className="absolute z-10 mt-1 w-full bg-[#2A2F3B] border border-gray-600 rounded-md shadow-lg max-h-60 overflow-auto">
                          {filteredClients.map((client) => (
                            <li
                              key={client}
                              className="px-2 py-1 hover:bg-gray-700 cursor-pointer text-white"
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
                    <div className="flex items-center relative">
                      <span className="text-gray-400 mr-2">Created by:</span>
                      <div className="relative">
                        <input
                          type="text"
                          value={creatorSearch}
                          onChange={(e) => {
                            setCreatorSearch(e.target.value);
                            setEditedProjectInfo({
                              ...editedProjectInfo,
                              createdBy: e.target.value,
                            });
                          }}
                          onFocus={() => setShowCreatorDropdown(true)}
                          className="text-white bg-[#2A2F3B] border border-gray-600 rounded-md px-2 py-1 pr-8"
                        />
                        <button
                          type="button"
                          onClick={() =>
                            setShowCreatorDropdown(!showCreatorDropdown)
                          }
                          className="absolute inset-y-0 right-0 flex items-center px-2 text-gray-400"
                        >
                          <ChevronDown className="w-4 h-4" />
                        </button>
                      </div>
                      {showCreatorDropdown && (
                        <ul className="absolute z-10 mt-1 w-full bg-[#2A2F3B] border border-gray-600 rounded-md shadow-lg max-h-60 overflow-auto">
                          {filteredCreators.map((creator) => (
                            <li
                              key={creator}
                              className="px-2 py-1 hover:bg-gray-700 cursor-pointer text-white"
                              onClick={() => {
                                setCreatorSearch(creator);
                                setEditedProjectInfo({
                                  ...editedProjectInfo,
                                  createdBy: creator,
                                });
                                setShowCreatorDropdown(false);
                              }}
                            >
                              {creator}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </>
                ) : (
                  <>
                    <h1 className="text-2xl font-bold text-white">
                      {projectInfo.project}
                    </h1>
                    <div className="text-gray-400">
                      Client: {projectInfo.client}
                    </div>
                    <div className="text-gray-400">
                      Created by: {projectInfo.createdBy}
                    </div>
                  </>
                )}
                <div className="text-xl font-semibold text-white mt-2">
                  {rooms.find((r) => r.id === selectedRoom)?.name ||
                    "Select Room"}
                </div>
              </div>
              <div className="flex flex-col gap-2">
                {isEditingProject ? (
                  <>
                    <button
                      onClick={handleSaveProject}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                    >
                      Save
                    </button>
                    <button
                      onClick={handleCancelEditProject}
                      className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                    >
                      Cancel
                    </button>
                  </>
                ) : (
                  <button
                    onClick={handleEditProject}
                    className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                  >
                    Edit Project
                  </button>
                )}
                <button className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700">
                  Export to PDF
                </button>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <span className="text-gray-400 whitespace-nowrap">
                  Ceiling Height:
                </span>
                <div className="flex items-center">
                  <input
                    type="number"
                    value={
                      rooms.find((r) => r.id === selectedRoom)?.ceilingHeight
                        .feet || 0
                    }
                    onChange={(e) =>
                      updateCeilingHeight(
                        selectedRoom,
                        "feet",
                        Number(e.target.value)
                      )
                    }
                    className="w-16 px-2 py-1 bg-[#2A2F3B] border border-gray-600 rounded-md text-white"
                  />
                  <span className="text-gray-400 mx-2">ft</span>
                  <input
                    type="number"
                    value={
                      rooms.find((r) => r.id === selectedRoom)?.ceilingHeight
                        .inches || 0
                    }
                    onChange={(e) =>
                      updateCeilingHeight(
                        selectedRoom,
                        "inches",
                        Number(e.target.value)
                      )
                    }
                    className="w-16 px-2 py-1 bg-[#2A2F3B] border border-gray-600 rounded-md text-white"
                  />
                  <span className="text-gray-400 ml-2">in</span>
                </div>
              </div>
              <div className="flex flex-col items-end gap-2">
                <div className="flex items-center gap-2">
                  <span className="text-gray-400">Difficulty Meter:</span>
                  <span className="text-gray-400">
                    {
                      calculateDifficulty(
                        rooms.find((r) => r.id === selectedRoom)
                          ?.ceilingHeight || { feet: 0, inches: 0 }
                      ).label
                    }
                  </span>
                </div>
                <div className="w-40">
                  <div className="w-full bg-gray-600 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all duration-300 ${getDifficultyColor(
                        calculateDifficulty(
                          rooms.find((r) => r.id === selectedRoom)
                            ?.ceilingHeight || { feet: 0, inches: 0 }
                        ).label
                      )}`}
                      style={{
                        width: getDifficultyWidth(
                          calculateDifficulty(
                            rooms.find((r) => r.id === selectedRoom)
                              ?.ceilingHeight || { feet: 0, inches: 0 }
                          ).label
                        ),
                      }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Scrollable content area */}
        <div className="flex-1 overflow-y-auto px-8 py-4">
          {/* Categories */}
          {selectedRoom && rooms.length > 0 && (
            <div className="space-y-8">
              {/* Hours Calculation */}
              <div>
                <h2 className="text-xl font-bold mb-4">Hours Calculation</h2>
                <div className="space-y-4">
                  {categories.map((category) => (
                    <div
                      key={category}
                      className="border border-gray-200 dark:border-gray-700 rounded-lg"
                    >
                      <div className="relative z-20 w-full px-4 py-3 text-left font-semibold text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg flex items-center justify-between">
                        <button
                          onClick={() => toggleCategory(category)}
                          className="flex-grow text-left"
                        >
                          <span>{category}</span>
                        </button>
                        <div className="flex items-center">
                          <span className="px-3 py-1 bg-purple-50 dark:bg-purple-900/50 border border-purple-200 dark:border-purple-800 rounded-lg text-purple-700 dark:text-purple-300 text-sm">
                            Total Hours:{" "}
                            {calculateCategoryHours(category).hours}
                          </span>
                          <div className="relative ml-2 group">
                            <button className="text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300">
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
                                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                />
                              </svg>
                            </button>
                            <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 px-3 py-2 bg-gray-800 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-normal w-48 z-[9999]">
                              {calculateCategoryHours(category).tooltip}
                            </div>
                          </div>
                        </div>
                      </div>

                      {expandedCategories.includes(category) && (
                        <div className="relative z-10 p-4 space-y-4">
                          {renderSubCategories(category)}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Materials Calculation */}
              <div>
                <h2 className="text-xl font-bold mb-4">
                  Materials Calculation
                </h2>
                <div className="space-y-4">
                  {/* Cable Pulls category */}
                  <div className="border border-gray-200 dark:border-gray-700 rounded-lg">
                    <div className="relative z-20 w-full px-4 py-3 text-left font-semibold text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg flex items-center justify-between">
                      <button
                        onClick={() => toggleCategory("Cable Pulls")}
                        className="flex-grow text-left"
                      >
                        <span>Cable Pulls</span>
                      </button>
                      <svg
                        className={`w-5 h-5 transition-transform ${
                          expandedCategories.includes("Cable Pulls")
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
                    </div>

                    {expandedCategories.includes("Cable Pulls") && (
                      <div className="relative z-10 p-4 space-y-4">
                        <MaterialsCalculation
                          wires={wires}
                          updateWire={updateWire}
                          addWire={addWire}
                          wireTypes={wireTypes}
                        />
                      </div>
                    )}
                  </div>

                  {/* Rack Materials category */}
                  <div className="border border-gray-200 dark:border-gray-700 rounded-lg">
                    <div className="relative z-20 w-full px-4 py-3 text-left font-semibold text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg flex items-center justify-between">
                      <button
                        onClick={() => toggleCategory("Rack Materials")}
                        className="flex-grow text-left"
                      >
                        <span>Rack Materials</span>
                      </button>
                      <svg
                        className={`w-5 h-5 transition-transform ${
                          expandedCategories.includes("Rack Materials")
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
                    </div>

                    {expandedCategories.includes("Rack Materials") && (
                      <div className="relative z-10 p-4 space-y-4">
                        <RackMaterialsCalculation
                          materials={rackMaterials}
                          updateMaterial={updateRackMaterial}
                          addMaterial={addRackMaterial}
                          materialTypes={rackMaterialTypes}
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      {showInfoModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl w-96">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
              {showInfoModal === "room"
                ? "Room Information"
                : "Project Information"}
            </h2>
            {showInfoModal === "room" ? (
              <div>
                {/* Room Info */}
                <p className="text-gray-600 dark:text-gray-400">
                  This section allows you to manage the labor items for the
                  selected room.
                </p>
              </div>
            ) : (
              <div>
                {/* Project Info */}
                <p className="text-gray-600 dark:text-gray-400">
                  This section displays the project information. You can edit
                  the project details here.
                </p>
              </div>
            )}
            <div className="mt-4 flex justify-end">
              <button
                onClick={() => setShowInfoModal(null)}
                className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
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
                onClick={() => handleDeleteRoom(showDeleteConfirm)}
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

export default ProjectView;