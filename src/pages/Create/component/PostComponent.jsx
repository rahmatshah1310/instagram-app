import React, { useRef, useState, useEffect } from "react";
import { usePost } from "@features/context/PostContext";
import InputField from "@/components/common/InputField";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import Button from "@/components/common/Button";
import Modal from "@/components/common/Modal";
import { ICONS } from "@/assets/icons";
import Spinner from "@/components/common/Spinner";

const postComponent = ({ isOpen, onClose }) => {
  const { uploading, uploadedImageUrl, error, uploadImage } = usePost();
  const fileInputRef = useRef(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [showCancelContainer, setShowCancelContainer] = useState(false);
  const [isPending, setIsPending] = useState(false);

  useEffect(() => {
    if (selectedFile) {
      const objectUrl = URL.createObjectURL(selectedFile);
      setPreviewUrl(objectUrl);

      return () => URL.revokeObjectURL(objectUrl);
    }
  }, [selectedFile]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("image/")) {
      setSelectedFile(file);
    } else {
      console.error("Invalid file type.");
    }
  };

  const openFilePicker = () => {
    fileInputRef.current.click();
  };

  const handleUpload = () => {
    if (selectedFile) {
      uploadImage(selectedFile);
      uploading(selectedFile);
      setShowCancelContainer(false);
    }
  };

  const toggleCancelContainer = () => {
    setShowCancelContainer(!showCancelContainer);
  };

  return (
    <section className="w-full h-auto m-0">
      {/* <---------------------------------------- Modal For Discard and Cancel -----------------------------------------> */}
      <Modal
        isOpen={showCancelContainer}
        className="bg-[#262626]"
        onClose={() => setShowCancelContainer(false)}
      >
        <div className="flex flex-col items-center justify-center space-y-2 p-6 rounded-lg shadow-md">
          <h2 className="text-white">Discard post? </h2>
          <p className="text-[#A8A8A8]">
            If you leave, your edits won't be saved.
          </p>
          <div className="flex justify-center space-x-4 ">
            <Button
              onClick={() => {
                setSelectedFile(null);
                setPreviewUrl(null);
                setShowCancelContainer(false);
              }}
              className="bg-red-500 text-white px-4 py-2 rounded"
            >
              Discard
            </Button>

            <Button
              onClick={() => setShowCancelContainer(false)}
              className="bg-gray-300 text-black px-4 py-2 rounded"
            >
              Cancel
            </Button>
          </div>
        </div>
      </Modal>

      <h2 className="text-xl font-bold mb-4 text-white text-center">
        Create a Post
      </h2>

      {/* <---------------------------------------- Adding Back and Next Button -----------------------------------------> */}
      {selectedFile && (
        <div className="flex justify-between mt-4 py-2">
          <Button
            onClick={toggleCancelContainer}
            className="text-white text-3xl"
          >
            {ICONS.backArrow}
          </Button>
          <Button onClick={handleUpload} className="text-blue-500">
            {uploading ? <Spinner type="beat" color="blue" /> : "Next"}
          </Button>
        </div>
      )}

      {/* <---------------------------------------- Drag and Drop Area For Image -----------------------------------------> */}
      <div className="w-full sm:w-[90%] md:w-[700px] mx-auto h-[300px] sm:h-[500px] md:h-[700px] bg-[#262626] flex flex-col justify-center relative">
        <div
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault();
            const file = e.dataTransfer.files[0];
            if (file && file.type.startsWith("image/")) {
              setSelectedFile(file);
              setIsPending(true);
            } else {
              console.error("Invalid file type.");
            }
          }}
          className={`relative p-6 text-center h-[700px] flex items-center justify-center `}
        >
          {previewUrl ? (
            <img
              src={previewUrl}
              alt="Preview"
              className="absolute top-0 left-0 w-full h-full object-cover"
            />
          ) : (
            <div className="flex flex-col items-center space-y-1.5">
              <span className="text-gra-700">{ICONS.photoVideo}</span>
              <p className="text-gray-500">Drag Photos and Videos here</p>
              {!selectedFile && (
                <Button
                  onClick={openFilePicker}
                  disabled={uploading}
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600  mx-auto"
                >
                  Upload Post
                </Button>
              )}
            </div>
          )}
        </div>

        {/* <---------------------------------------- Input for selcting file -----------------------------------------> */}
        <InputField
          type="file"
          accept="image/*"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
        />
        {error && <p className="text-red-500 mt-2">{error}</p>}
      </div>
    </section>
  );
};

export default postComponent;
