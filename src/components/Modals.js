//modals-for_find_and_replace
import React, { useState } from "react";

export const FindReplaceModal = ({ onClose, onFindReplace }) => {
  const [findValue, setFindValue] = useState("");
  const [replaceValue, setReplaceValue] = useState("");

  const handleApply = () => {
    onFindReplace(findValue, replaceValue);
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <h3>Find & Replace</h3>
        <div>
          <label>Find:</label>
          <input
            type="text"
            value={findValue}
            onChange={(e) => setFindValue(e.target.value)}
          />
        </div>
        <div>
          <label>Replace:</label>
          <input
            type="text"
            value={replaceValue}
            onChange={(e) => setReplaceValue(e.target.value)}
          />
        </div>
        <button onClick={handleApply}>Replace All</button>
      </div>
    </div>
  );
};
