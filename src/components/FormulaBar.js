import React from "react";
const FormulaBar = ({ currentForumla, onChangeFormula }) => {
    return (
        <div className="formula-bar-container">
            <span>fx</span>
            <input
            style={{ marginLeft: "8px", width: "100%"}}
            type="text"
            value={currentForumla}
            onChange={(e) => onChangeFormula(e.target.value)}
            />
        </div>
    );
};

export default FormulaBar;