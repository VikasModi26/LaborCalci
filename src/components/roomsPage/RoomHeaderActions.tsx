type RoomHeaderActionsProps = {
  onExportPdf?: () => void;
};

const RoomHeaderActions = ({
  onExportPdf = () => console.log("Export to PDF clicked"),
}: RoomHeaderActionsProps) => {
  return (
    <div className="flex flex-col gap-2">
      <button
        onClick={onExportPdf}
        className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
      >
        Export to PDF
      </button>
    </div>
  );
};

export default RoomHeaderActions;
