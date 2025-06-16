import PostComponent from "./component/PostComponent";
import Modal from "@/components/common/Modal";
import Button from "@/components/common/Button";

const CreatePost = ({ isOpen, onClose }) => {
  return (
    <>
      <Modal
        isOpen={isOpen}
        title="Create Post"
        onClose={onClose} 
      >
        <PostComponent isOpen={isOpen} onClose={onClose} />
      </Modal>
    </>
  );
};

export default CreatePost;
