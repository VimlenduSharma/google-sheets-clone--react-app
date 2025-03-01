//simple_toolbar_with_basic_formatting_and_data_quality_actions
import React from "react";
const Toolbar = ({
    onBold,
    onItalic,
    onColorChange,
    onFontSizeChange,
    onAddRow,
    onDeleteRow,
    onAddColumn,
    onDeleteColumn,
    onRemoveDuplicates,
    onFindReplace,
}) => {
    return (
        <div className="toolbar-container">
            <button className="bold-button" onClick={onBold}>
                B
            </button>
            <button className="italic-button" onClick={onItalic}>
                I
            </button>
            <input
            type="color"
            className="color-button"
            onChange={(e) => onColorChange(e.target.value)}
            />
            <input
            type="number"
            min="8"
            max="48"
            className="size-button"
            placeholder="Font Size"
            onChange={(e) => onFontSizeChange(e.target.value)}
            style={{width: "60px"}}
            />
            <button onClick={onAddRow}>+ Row</button>
            <button onClick={onDeleteRow}>- Row</button>
            <button onClick={onAddColumn}>+ Col</button>
            <button onClick={onDeleteColumn}>- Col</button>
            <button className="remove-duplicates-button" onClick={onRemoveDuplicates}>
                Remove Duplicates
            </button>
            <button className="find-replace-button" onClick={onFindReplace}>
                Find & Replace
            </button>
        </div>
    );
};

export default Toolbar;