import Modal from "./Modal"

type DeleteConfirmationModalProps = {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  itemName?: string
}

const DeleteConfirmationModal = ({
  isOpen,
  onClose,
  onConfirm,
  itemName = "room",
}: DeleteConfirmationModalProps) => {
  const actions = (
    <>
      <button
        onClick={onClose}
        className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600"
      >
        Cancel
      </button>
      <button onClick={onConfirm} className="ml-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">
        Delete
      </button>
    </>
  )

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Delete ${itemName}`} actions={actions}>
      <p className="text-gray-600 dark:text-gray-400">Are you sure you want to delete this {itemName}?</p>
    </Modal>
  )
}

export default DeleteConfirmationModal;