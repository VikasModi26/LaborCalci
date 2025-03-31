import type React from "react";
import { categories } from "../../utils/mockData";

type ScrollableContentProps = {
  selectedRoom: string | null;
  rooms: any[];
  laborLineItems: any;
  expandedCategories: string[];
  expandedSubCategories: string[];
  toggleCategory: (category: string) => void;
  toggleSubCategory: (subCategory: string) => void;
  renderSubCategories: (category: string) => React.ReactNode;
  wires: any[];
  updateWire: (index: number, field: string, value: any) => void;
  addWire: () => void;
  wireTypes: string[];
  rackMaterials: any[];
  updateRackMaterial: (index: number, field: string, value: any) => void;
  addRackMaterial: () => void;
  rackMaterialTypes: string[];
};

const ScrollableContent = ({
  selectedRoom,
  rooms,
  laborLineItems,
  expandedCategories,
  expandedSubCategories,
  toggleCategory,
  toggleSubCategory,
  renderSubCategories,
  wires,
  updateWire,
  addWire,
  wireTypes,
  rackMaterials,
  updateRackMaterial,
  addRackMaterial,
  rackMaterialTypes,
}: ScrollableContentProps) => {
  const MaterialsCalculation = ({ wires, updateWire, addWire }: any) => {
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

  const RackMaterialsCalculation = ({
    materials,
    updateMaterial,
    addMaterial,
  }: any) => {
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-3 gap-4 font-medium">
          <div>Material Type</div>
          <div>Qty.</div>
          <div>Cost</div>
        </div>
        {materials.map((material: any, index: number) => (
          <div key={index} className="grid grid-cols-3 gap-4">
            <select
              value={material.type}
              onChange={(e) => updateMaterial(index, "type", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            >
              <option value="">Select Material Type</option>
              {rackMaterialTypes.map((type: string) => (
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

  return (
    <div className="flex-1 overflow-y-auto px-8 py-4 bg-white dark:bg-[#1B1E27] text-gray-900 dark:text-white">
      {/* Categories */}
      {selectedRoom && rooms.length > 0 && (
        <div className="space-y-8">
          {/* Hours Calculation */}
          <div>
            <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">
              Hours Calculation
            </h2>
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
                        Total Hours: {/* This would need to be calculated */}
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
                          {/* Tooltip content would go here */}
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
            <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">
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
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ScrollableContent;