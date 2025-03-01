import React, { useEffect, useState, useCallback } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";

import SheetCell from "./SheetCell";
import { evaluateFormula } from "../utils/formulaParser";
import { indicesToCellLabel, isNumeric } from "../utils/helpers";

const INITIAL_ROWS = 10;
const INITIAL_COLS = 8;

const createEmptyCell = () => ({
  value: "",
  computed: "",
  formatting: {
    bold: false,
    italic: false,
    color: "",
    fontSize: 14,
  },
});

const createInitialData = (rows, cols) => {
  const data = [];
  for (let r = 0; r < rows; r++) {
    const row = [];
    for (let c = 0; c < cols; c++) {
      row.push(createEmptyCell());
    }
    data.push(row);
  }
  return data;
};

const Spreadsheet = () => {
  const [data, setData] = useState(() => createInitialData(INITIAL_ROWS, INITIAL_COLS));

  const [selectedCell, setSelectedCell] = useState({ row: 0, col: 0 });

  const [isSelecting, setIsSelecting] = useState(false);


  const [currentFormula, setCurrentFormula] = useState("");

  const [showFindReplace, setShowFindReplace] = useState(false);

  const recalcAllCells = useCallback(
    (grid) => {
      const newGrid = grid.map((row) => row.map((cell) => ({ ...cell })));

      for (let r = 0; r < newGrid.length; r++) {
        for (let c = 0; c < newGrid[r].length; c++) {
          const cell = newGrid[r][c];
          if (typeof cell.value === "string" && cell.value.trim().startsWith("=")) {
            cell.computed = evaluateFormula(cell.value.trim(), newGrid);
          } else {
            cell.computed = null;
          }
        }
      }
      return newGrid;
    },
    []
  );

  useEffect(() => {
    const onToggleBold = () => toggleBold();
    const onToggleItalic = () => toggleItalic();
    const onChangeColor = (e) => changeColor(e.detail);
    const onChangeFontSize = (e) => changeFontSize(e.detail);
    const onAddRowEvent = () => addRow();
    const onDeleteRowEvent = () => deleteRow();
    const onAddColumnEvent = () => addColumn();
    const onDeleteColumnEvent = () => deleteColumn();
    const onRemoveDuplicatesEvent = () => removeDuplicates();
    const onFindReplaceEvent = (e) => {
      handleFindReplace(e.detail.find, e.detail.replace);
    };

    document.addEventListener("toggleBold", onToggleBold);
    document.addEventListener("toggleItalic", onToggleItalic);
    document.addEventListener("changeColor", onChangeColor);
    document.addEventListener("changeFontSize", onChangeFontSize);
    document.addEventListener("addRow", onAddRowEvent);
    document.addEventListener("deleteRow", onDeleteRowEvent);
    document.addEventListener("addColumn", onAddColumnEvent);
    document.addEventListener("deleteColumn", onDeleteColumnEvent);
    document.addEventListener("removeDuplicates", onRemoveDuplicatesEvent);
    document.addEventListener("findReplace", onFindReplaceEvent);

    return () => {
      document.removeEventListener("toggleBold", onToggleBold);
      document.removeEventListener("toggleItalic", onToggleItalic);
      document.removeEventListener("changeColor", onChangeColor);
      document.removeEventListener("changeFontSize", onChangeFontSize);
      document.removeEventListener("addRow", onAddRowEvent);
      document.removeEventListener("deleteRow", onDeleteRowEvent);
      document.removeEventListener("addColumn", onAddColumnEvent);
      document.removeEventListener("deleteColumn", onDeleteColumnEvent);
      document.removeEventListener("removeDuplicates", onRemoveDuplicatesEvent);
      document.removeEventListener("findReplace", onFindReplaceEvent);
    };
  }, []);

  const handleCellChange = (row, col, newValue) => {
    setData((prev) => {
      const copy = prev.map((r) => r.map((cell) => ({ ...cell })));
      copy[row][col].value = newValue;
      return recalcAllCells(copy);
    });
  };

  const handleSelectCell = (row, col) => {
    setSelectedCell({ row, col });
    const cellValue = data[row][col].value;
    setCurrentFormula(cellValue);
  };

  const handleChangeFormula = (val) => {
    setCurrentFormula(val);
    setData((prev) => {
      const copy = prev.map((r) => r.map((cell) => ({ ...cell })));
      copy[selectedCell.row][selectedCell.col].value = val;
      return recalcAllCells(copy);
    });
  };

  const handleMouseDown = (e, row, col) => {
    setIsSelecting(true);
    handleSelectCell(row, col);
  };

  const handleMouseOver = (e, row, col) => {
    if (isSelecting) {
      handleSelectCell(row, col);
    }
  };

  const handleMouseUp = () => {
    setIsSelecting(false);
  };


  const handleDragStart = (e, row, col) => {
    const cell = data[row][col];
    e.dataTransfer.setData("text/plain", JSON.stringify(cell));
  };

  const handleDrop = (e, row, col) => {
    e.preventDefault(); 
    const droppedCell = JSON.parse(e.dataTransfer.getData("text/plain"));
    setData((prev) => {
      const copy = prev.map((r) => r.map((cell) => ({ ...cell })));
      copy[row][col] = { ...droppedCell };
      return recalcAllCells(copy);
    });
  };

  const toggleBold = () => {
    setData((prev) => {
      const copy = prev.map((r) => r.map((cell) => ({ ...cell })));
      const cell = copy[selectedCell.row][selectedCell.col];
      cell.formatting.bold = !cell.formatting.bold;
      return copy;
    });
  };

  const toggleItalic = () => {
    setData((prev) => {
      const copy = prev.map((r) => r.map((cell) => ({ ...cell })));
      const cell = copy[selectedCell.row][selectedCell.col];
      cell.formatting.italic = !cell.formatting.italic;
      return copy;
    });
  };

  const changeColor = (color) => {
    setData((prev) => {
      const copy = prev.map((r) => r.map((cell) => ({ ...cell })));
      const cell = copy[selectedCell.row][selectedCell.col];
      cell.formatting.color = color;
      return copy;
    });
  };

  const changeFontSize = (size) => {
    const numericSize = parseInt(size, 10);
    if (isNaN(numericSize)) return;
    setData((prev) => {
      const copy = prev.map((r) => r.map((cell) => ({ ...cell })));
      const cell = copy[selectedCell.row][selectedCell.col];
      cell.formatting.fontSize = numericSize;
      return copy;
    });
  };


  const addRow = () => {
    setData((prev) => {
      const cols = prev[0].length;
      const newRow = [];
      for (let i = 0; i < cols; i++) {
        newRow.push(createEmptyCell());
      }
      return [...prev, newRow];
    });
  };

  const deleteRow = () => {
    setData((prev) => {
      if (prev.length <= 1) return prev;
      const newData = [...prev];
      newData.splice(selectedCell.row, 1);
      return newData;
    });
  };

  const addColumn = () => {
    setData((prev) => {
      return prev.map((row) => [...row, createEmptyCell()]);
    });
  };

  const deleteColumn = () => {
    setData((prev) => {
      if (prev[0].length <= 1) return prev;
      return prev.map((row) => {
        const newRow = [...row];
        newRow.splice(selectedCell.col, 1);
        return newRow;
      });
    });
  };

  const removeDuplicates = () => {
    setData((prev) => {
      const uniqueRows = [];
      const seen = new Set();
      for (let r = 0; r < prev.length; r++) {
        const rowString = JSON.stringify(prev[r].map((cell) => cell.value));
        if (!seen.has(rowString)) {
          seen.add(rowString);
          uniqueRows.push(prev[r]);
        }
      }
      return uniqueRows;
    });
  };


  const handleFindReplace = (findStr, replaceStr) => {
    setData((prev) => {
      const copy = prev.map((row) =>
        row.map((cell) => {
          const newCell = { ...cell };
          if (typeof cell.value === "string" && cell.value.includes(findStr)) {
            newCell.value = cell.value.split(findStr).join(replaceStr);
          }
          return newCell;
        })
      );
      return copy;
    });
  };


  const renderColumnHeaders = () => {
    const cols = data[0].length;
    return (
      <TableRow>
        {/* top-left empty cell for row/column label intersection */}
        <TableCell />
        {Array.from({ length: cols }, (_, c) => {
          const colLabel = String.fromCharCode(65 + c); 
          return (
            <TableCell key={c}>
              <strong>{colLabel}</strong>
            </TableCell>
          );
        })}
      </TableRow>
    );
  };

  const renderRows = () => {
    return data.map((row, r) => {
      const rowLabel = r + 1;
      return (
        <TableRow key={r}>
          {/* Row header cell */}
          <TableCell>
            <strong>{rowLabel}</strong>
          </TableCell>
          {/* Actual Sheet cells */}
          {row.map((cell, c) => {
            const isSelected = selectedCell.row === r && selectedCell.col === c;
            return (
              <SheetCell
                key={`${r}-${c}`}
                cellData={cell}
                onChange={handleCellChange}
                onSelect={handleSelectCell}
                isSelected={isSelected}
                rowIndex={r}
                colIndex={c}
                onMouseDown={handleMouseDown}
                onMouseOver={handleMouseOver}
                onDragStart={handleDragStart}
                onDrop={handleDrop}
              />
            );
          })}
        </TableRow>
      );
    });
  };

  return (
    <div
      className="spreadsheet-container"
      onMouseUp={handleMouseUp}
      style={{ padding: "8px" }}
    >
      <TableContainer component={Paper}>
        <Table aria-label="Google Sheets Clone Table">
          <TableHead>{renderColumnHeaders()}</TableHead>
          <TableBody>{renderRows()}</TableBody>
        </Table>
      </TableContainer>

      {/* Optionally render your find & replace modal here if needed */}
      {showFindReplace && <div></div>}
    </div>
  );
};

export default Spreadsheet;
