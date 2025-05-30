import React from "react";
import Button from "@/components/common/Button";
import { ICONS } from "@/assets/icons";

const PostHeader = ({ user, onOptionClick, className = "" }) => {
  return (
    <div className={className}>
      <div className="flex items-center gap-4">
        <img
          src={user?.profilePic}
          alt="profilePic"
          className="w-8 h-8 rounded-full object-cover"
        />
        <h2 className="text-white text-xs">{user?.username}</h2>
      </div>
      <Button className="text-white" onClick={onOptionClick}>
        {ICONS.threeDots}
      </Button>
    </div>
  );
};

export default PostHeader;
