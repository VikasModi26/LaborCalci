type LaborItemsType = {
    [category: string]: {
      [item: string]: number
    }
  }
  
  export const laborItems: LaborItemsType = {
    "Wall mounted": {
      'Wall Mounted Display 43"': 6,
      'Wall Mounted Display 55"': 6,
      'Wall Mounted Display 65"': 6,
      'Wall Mounted Display 75"': 6,
      'Wall Mounted Display 85"': 8,
      'Wall Mounted Display 98"': 8,
      'Wall Mounted Display 105"': 12,
      "Video Wall Per Module": 4,
      "Wall Mounted PTZ Camera": 2,
      "Wall Mount Videobar/Soundbar": 2,
      "Wall Plate - Transmitter": 1.5,
      "Wall Plate - Receiver": 1.5,
      "Wall Mounted Projector": 6,
      "Wall Mounted Electric Projection Screen": 8,
      "Wall Mounted Manual Projection Screen": 4,
      "Wall Mounted Short Throw Projector": 8,
      "Surface Wall Mount Speaker": 2,
      "Flushed Wall Speakers": 4,
      "Line Array Speaker": 4,
      "Wall Mounted Antenna": 1,
      "Wall Mounted WAP": 1,
      "Wall Mounted ALS": 1,
      "Wall Mount TouchPanel": 2,
      "Wall Mount Button Panel": 1.5,
      "Wall Mount Room Scheduler": 2,
      "Mullion Mount Room Scheduler": 3,
      "Switch/Keypad": 1,
      "Wall mounted rack": 6,
      "Custom Wallplate 1G": 1,
      "Custom Wallplate 2G": 1,
      "Custom Wallplate 3G": 1,
      "Custom Wallplate 4G": 1,
      "Custom Wallplate XL": 3,
    },
    "Ceiling mounted": {
      'Ceiling Mounted Display 43"': 6,
      'Ceiling Mounted Display 55"': 6,
      'Ceiling Mounted Display 65"': 6,
      'Ceiling Mounted Display 75"': 6,
      'Ceiling Mounted Display 86"': 8,
      'Ceiling Mounted Display 98"': 8,
      'Ceiling Mounted Display 105"': 12,
      "Ceiling Grid Mount Projector": 12,
      "Ceiling Stucture Mount Projector": 16,
      "Ceiling Electric Projection Screen": 12,
      "Ceiling Manual Projection Screen": 6,
      "Ceiling Mount Camera": 2,
      "Pole Mount Camera": 4,
      "In-ceiling Speakers": 1,
      "Ceiling Surface Speaker": 1.5,
      "Ceiling Pendant Speaker": 1.5,
      "Ceiling Line Array Speaker": 4,
      "Ceiling Grid Mount Microphone": 2,
      "Ceiling Stucture Mount Microphone": 4,
      "Ceiling Pendant Microphone": 1.5,
      "Ceiling Mount Antenna": 1.5,
      "Ceiling Mount WAP": 1.5,
      "Ceiling Mount ALS": 1.5,
      "Ceiling Mount Partition Sensor": 1,
      "Ceiling Mount Occupancy Sensor": 1,
      "Ceiling Box": 2,
    },
    "Surface mounted": {
      "Table Top Camera": 1,
      "Table Top Microphone": 1,
      "Table Mount Microphone": 2,
      "Table Gooseneck Microphone": 2,
      "Mute Button/Button": 1.5,
      "Table Top Touch Panel": 1,
      "Cable Cubby": 4,
      "Cable Cubby Accessories": 0.25,
      "Under Table Equipment": 1,
      "Furniture Rack": 4,
      "Behind Display": 0.5,
    },
    "Floor mounted": {
      'Cart Mounted Display <=75"': 6,
      'Cart Mounted Display >75"': 8,
      "Floor Box": 2,
      "Plates on Floorbox": 1.5,
    },
    "On-Site Equipment Rack": {
      "Assemble Per RU": 1,
    },
    Decommissioning: {
      // This will be dynamically calculated as 0.25 times the original values
    },
  }
  
  export const programmingItems: {
    [category: string]: {
      [item: string]: number
    }
  } = {
    Control: {
      "Fixed Switcher": 4,
      "Modular Switcher": 8,
      "RS-232/ IP Device": 2,
      "Additional RS-232/IP Device from same Manufacturer": 1,
      "Relay Device": 1,
      "I/O Device": 1,
      "IR Device": 1,
      "Additional IR Device from same Manufacturer": 0.5,
      "Codec/Conferencing PC": 4,
      "Audio DSP": 2,
      "Lighting Control per Zone": 1,
      "AVoIP Decoders": 0.25,
      "Button Panel": 4,
      "Touch Panel": 8,
    },
    Network: {
      "Network Switch Configuration": 4,
    },
    Audio: {
      "Fixed DSP": 8,
      "Modular DSP": 12,
    },
  }
  
  export const rackFabricationItems: {
    [item: string]: number
  } = {
    "Assemble Equipment Rack": 2,
    "Assemble per RU": 1,
    "Install Blanks or Vents": 0.25,
  }
  
  export const engineeringItems: {
    [category: string]: {
      [item: string]: number
    }
  } = {
    Video: {
      "Flat Panel Display & Mount": 1,
      "Additional Similar Flat Panel Display & Mount": 0.5,
      "Video Wall": 2,
      "LED Wall": 2,
      "Video Source": 1,
      "Additional Similar Video Source": 0.5,
      Camera: 1,
      "Additional Similar Camera": 0.5,
      Projector: 1,
      "Additional Similar Projector": 1,
      "Projection Screen": 1,
      "Additional Similar Projection Screen": 0.5,
      "Video Switcher": 1,
    },
    Audio: {
      "Distributed Ceiling Speaker System": 1,
      "Additional Similar Distributed Ceiling Speaker System": 0.25,
      "Full Range Speaker": 2,
      "Additional Similar Full Range Speaker": 1,
      Subwoofer: 2,
      "Additional Similar Subwoofer": 1,
      Amplifier: 1,
      "Additional Similar Amplifier": 0.5,
      DSP: 1,
      "Additional Similar DSP": 0.5,
      Microphone: 1,
      "Additional Similar Microphone": 0.5,
    },
    Conferencing: {
      PC: 1,
      Codec: 1,
      BYOD: 1,
    },
    Recording: {
      Recorder: 1,
    },
    Control: {
      "Control Processor": 1,
      "Control Expansion": 0.5,
      "Touch Panel": 0.5,
      "Additional Similar Touch Panel": 0.25,
    },
    Network: {
      "AVoIP Network Switch": 1,
      "Control Switch": 0.5,
    },
    Extensions: {
      "Transmitter/Receiver pair": 0.5,
      "Additional Similar Transmitter/Receiver pair": 0.25,
    },
    Storage: {
      "Equipment Rack": 1,
      "Shelves/Vents/Blanks": 1,
      "Behind Display Storage Shelves": 0.5,
    },
    Cables: {
      "Premade Cables": 1,
      "Bulk Cables": 1,
    },
    Materials: {
      Materials: 1,
    },
  }
  
  export const fieldEngineeringItems: {
    [category: string]: {
      [item: string]: number
    }
  } = {
    Video: {
      "Display set up": 0.5,
      "Projector set up": 0.5,
      "Camera set up": 0.5,
      "Multiple Camera Automatic Preset control Configuration": 4,
    },
    Control: {
      "Control Program Uploading & Adjustments": 2,
    },
    Audio: {
      "DSP Program Uploading & Adjustments": 2,
      "Wired Microphone Configuration": 0.5,
      "Wireless Microphone Configuration": 0.5,
      "Voice Lift configuration": 0.5,
      "Mix-Minus Configuration": 1,
    },
    Conferencing: {
      "Enable & Test Conferencing": 1,
    },
    Recording: {
      "Enable & Test Recording": 1,
    },
    Network: {
      Troubleshooting: 2,
      "Network Configuration": 1,
    },
  }
  
  export const qualityAssuranceItems: {
    [category: string]: {
      [item: string]: number
    }
  } = {
    "Rack QA": {
      "Rack Device excluding Power Supplies": 0.5,
    },
  }
  
  export const trainingItems: {
    [item: string]: number
  } = {
    "Basic Turn Over": 2,
    "Dedicated Half Day": 4,
    "Dedicated Full Day": 8,
  }
  
  // Export all items
  
  