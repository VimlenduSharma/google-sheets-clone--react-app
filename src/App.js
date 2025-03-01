import React, { useState } from "react";
import { ThemeProvider } from "@mui/material/styles";
import { AppBar, Toolbar as MuiToolbar, Typography, Box, Button } from "@mui/material";

import "./index.css";    
import "./App.css";       

import Spreadsheet from "./components/Spreadsheet";
import SheetToolbar from "./components/Toolbar";  
import FormulaBar from "./components/FormulaBar";
import { FindReplaceModal } from "./components/Modals";
import theme from "./theme";                     

function App() {
  const [showFindReplace, setShowFindReplace] = useState(false);
  const [currentFormula, setCurrentFormula] = useState("");

  const handleBold = () => {
    document.dispatchEvent(new Event("toggleBold"));
  };

  const handleItalic = () => {
    document.dispatchEvent(new Event("toggleItalic"));
  };
  const handleColorChange = (color) => {
    const event = new CustomEvent("changeColor", { detail: color });
    document.dispatchEvent(event);
  };

  const handleFontSizeChange = (size) => {
    const event = new CustomEvent("changeFontSize", { detail: size });
    document.dispatchEvent(event);
  };

  const handleAddRow = () => {
    document.dispatchEvent(new Event("addRow"));
  };

  const handleDeleteRow = () => {
    document.dispatchEvent(new Event("deleteRow"));
  };

  const handleAddColumn = () => {
    document.dispatchEvent(new Event("addColumn"));
  };

  const handleDeleteColumn = () => {
    document.dispatchEvent(new Event("deleteColumn"));
  };

  const handleRemoveDuplicates = () => {
    document.dispatchEvent(new Event("removeDuplicates"));
  };

  const handleFindReplace = () => {
    setShowFindReplace(true);
  };

  return (
    <ThemeProvider theme={theme}>
      {}
      <AppBar position="static" color="primary">
        <MuiToolbar>
          <Typography variant="h6">Google Sheets Clone</Typography>
          <Box sx={{ marginLeft: "auto" }}>
            {}
            <Button color="inherit" onClick={handleBold}>
              Bold
            </Button>
            <Button color="inherit" onClick={handleItalic}>
              Italic
            </Button>
            <Button color="inherit" onClick={handleFindReplace}>
              Find &amp; Replace
            </Button>
          </Box>
        </MuiToolbar>
      </AppBar>

      {}
      <div className="app-container">
        {/* Your custom “Toolbar” below the AppBar (if you still want it) */}
        <SheetToolbar
          onBold={handleBold}
          onItalic={handleItalic}
          onColorChange={handleColorChange}
          onFontSizeChange={handleFontSizeChange}
          onAddRow={handleAddRow}
          onDeleteRow={handleDeleteRow}
          onAddColumn={handleAddColumn}
          onDeleteColumn={handleDeleteColumn}
          onRemoveDuplicates={handleRemoveDuplicates}
          onFindReplace={handleFindReplace}
        />

        {}
        <FormulaBar
          currentFormula={currentFormula}
          onChangeFormula={setCurrentFormula}
        />

        {}
        <Spreadsheet />

        {}
        {showFindReplace && (
          <FindReplaceModal
            onClose={() => setShowFindReplace(false)}
            onFindReplace={(f, r) => {
              const event = new CustomEvent("findReplace", {
                detail: { find: f, replace: r },
              });
              document.dispatchEvent(event);
            }}
          />
        )}
      </div>
    </ThemeProvider>
  );
}

export default App;
