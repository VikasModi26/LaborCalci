export const mockProjects = [
    { id: "1", project: "Website Redesign", client: "Acme Corp", createdBy: "John Doe" },
    { id: "2", project: "Mobile App", client: "Beta Inc", createdBy: "Jane Smith" },
    { id: "3", project: "Cloud Migration", client: "Gamma LLC", createdBy: "Bob Wilson" },
    { id: "4", project: "Database Migration", client: "Delta Systems", createdBy: "Alice Johnson" },
    { id: "5", project: "API Development", client: "Epsilon Tech", createdBy: "Charlie Brown" },
  ]
  
  export const mockClients = ["Acme Corp", "Beta Inc", "Gamma LLC", "Delta Systems", "Epsilon Tech", "TechGiant Inc", "Innovative Solutions", "Global Systems"]
  
  export const mockCreators = [
    "John Doe", "Jane Smith", "Alex Johnson", "Sam Wilson"
  ];
  
  export const mockRooms = [
    "Conference Room", "Training Room", "Board Room", "Huddle Room"
  ];

  export const categories = [
    "Install",
    "Programming",
    "Rack Fabrication",
    "Engineering",
    "Field Engineering",
    "Quality Assurance",
    "Project Management",
    "Training",
  ];


// Wire types and costs
export const wireTypes = [
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
]

export const wireCosts: Record<string, number> = {
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
}

// Rack material types
export const rackMaterialTypes = [
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
]


// Connector types
export const connectorTypes = [
  { type: "XLR", price: 5 },
  { type: "RCA", price: 2 },
  { type: "BNC", price: 3 },
  { type: "HDMI", price: 10 },
  { type: "USB", price: 4 },
]

// Hardware types
export const hardwareTypes = [
  { type: "Wall Mount", price: 15 },
  { type: "Ceiling Mount", price: 25 },
  { type: "Floor Stand", price: 30 },
  { type: "Desk Mount", price: 20 },
  { type: "Rack Mount", price: 35 },
]

