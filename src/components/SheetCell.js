import React from "react";
import { TableCell, TextField } from "@mui/material";

const SheetCell = ({
  cellData,
  onChange,
  onSelect,
  isSelected,
  rowIndex,
  colIndex,
  onMouseDown,
  onMouseOver,
  onDragStart,
  onDrop,
}) => {
  const { value, formatting, computed } = cellData;

  const handleChange = (e) => {
    onChange(rowIndex, colIndex, e.target.value);
  };
  const displayedValue = computed ?? value;

  return (
    <TableCell
      sx={{
        border: isSelected ? "2px solid #1a73e8" : "1px solid #ccc",
        padding: "4px",
      }}
      onMouseDown={(e) => onMouseDown(e, rowIndex, colIndex)}
      onMouseOver={(e) => onMouseOver(e, rowIndex, colIndex)}
      draggable
      onDragStart={(e) => onDragStart(e, rowIndex, colIndex)}
      onDrop={(e) => onDrop(e, rowIndex, colIndex)}
      onDragOver={(e) => e.preventDefault()}
      onClick={() => onSelect(rowIndex, colIndex)}
    >
      <TextField
        variant="standard"
        fullWidth
        value={displayedValue}
        onChange={handleChange}
        InputProps={{
          style: {
            fontWeight: formatting.bold ? "bold" : "normal",
            fontStyle: formatting.italic ? "italic" : "normal",
            color: formatting.color || "inherit",
            fontSize: formatting.fontSize ? `${formatting.fontSize}px` : "14px",
          },
        }}
      />
    </TableCell>
  );
};

export default SheetCell;
