type DifficultyLevel = "Basic" | "Intermediate" | "Advanced" | "Unknown"

type DifficultyMeterProps = {
  ceilingHeight: {
    feet: number
    inches: number
  }
}

const DifficultyMeter = ({ ceilingHeight }: DifficultyMeterProps) => {
  // Calculate difficulty based on ceiling height
  const calculateDifficulty = (height: { feet: number; inches: number }): { level: number; label: DifficultyLevel } => {
    const totalInches = height.feet * 12 + height.inches
    if (totalInches <= 144) {
      return { level: 0, label: "Basic" }
    } else if (totalInches <= 192) {
      return { level: 5, label: "Intermediate" }
    } else {
      return { level: 10, label: "Advanced" }
    }
  }

  const getDifficultyColor = (label: DifficultyLevel) => {
    switch (label) {
      case "Basic":
        return "bg-green-500"
      case "Intermediate":
        return "bg-orange-500"
      case "Advanced":
        return "bg-gradient-to-r from-orange-500 to-red-500"
      default:
        return "bg-gray-600"
    }
  }

  const getDifficultyWidth = (label: DifficultyLevel) => {
    switch (label) {
      case "Basic":
        return "25%"
      case "Intermediate":
        return "66%"
      case "Advanced":
        return "100%"
      default:
        return "0%"
    }
  }

  const difficultyInfo = calculateDifficulty(ceilingHeight)

  return (
    <div className="flex flex-col items-end gap-2">
      <div className="flex items-center gap-2">
        <span className="text-gray-400">Difficulty Meter:</span>
        <span className="text-gray-400">{difficultyInfo.label}</span>
      </div>
      <div className="w-40">
        <div className="w-full bg-gray-600 rounded-full h-2">
          <div
            className={`h-2 rounded-full transition-all duration-300 ${getDifficultyColor(difficultyInfo.label)}`}
            style={{ width: getDifficultyWidth(difficultyInfo.label) }}
          ></div>
        </div>
      </div>
    </div>
  )
}

export default DifficultyMeter;