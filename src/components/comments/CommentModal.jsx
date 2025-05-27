// components/CommentModal.jsx
import React from "react";
import Modal from "@/components/common/Modal";
import Button from "@/components/common/Button";

const CommentModal = ({ isOpen, onClose, onDelete }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="bg-[#262626] p-4 rounded-md text-white w-96  flex flex-col space-y-4">
        <Button className="text-red-500" onClick={onDelete}>
          Delete
        </Button>
        <Button className="text-gray-300" onClick={onClose}>
          Cancel
        </Button>
      </div>
    </Modal>
  );
};

export default CommentModal;
