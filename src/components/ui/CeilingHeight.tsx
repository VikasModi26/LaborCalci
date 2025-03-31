"use client"

type CeilingHeightInputProps = {
  feet: number
  inches: number
  onUpdateHeight: (field: "feet" | "inches", value: number) => void
  disabled?: boolean
}

const CeilingHeight = ({ feet, inches, onUpdateHeight, disabled = false }: CeilingHeightInputProps) => {
  return (
    <div className="flex items-center gap-4">
      <span className="text-gray-400 whitespace-nowrap">Ceiling Height:</span>
      <div className="flex items-center">
        <input
          type="number"
          value={feet}
          onChange={(e) => onUpdateHeight("feet", Number(e.target.value))}
          disabled={disabled}
          className="w-16 px-2 py-1 bg-gray-100 dark:bg-[#2A2F3B] border border-gray-300 dark:border-gray-600 rounded-md text-gray-900 dark:text-white disabled:opacity-50"
        />
        <span className="text-gray-600 dark:text-gray-400 mx-2">ft</span>
        <input
          type="number"
          value={inches}
          onChange={(e) => onUpdateHeight("inches", Number(e.target.value))}
          disabled={disabled}
          className="w-16 px-2 py-1 bg-gray-100 dark:bg-[#2A2F3B] border border-gray-300 dark:border-gray-600 rounded-md text-gray-900 dark:text-white disabled:opacity-50"
        />
        <span className="text-gray-600 dark:text-gray-400 ml-2">in</span>
      </div>
    </div>
  )
}

export default CeilingHeight;