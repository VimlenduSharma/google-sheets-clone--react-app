import { cellLabelToIndices } from "./helpers";

export function evaluateFormula(formula, dataGrid) {
    if(!formula.startsWith("=")) {
        return formula;
    }

    let expr=formula.slice(1).trim().toUpperCase();
    
    const openParenIndex=expr.indexOf("(");
    const closeParenIndex=expr.lastIndexOf(")");

    if(openParenIndex===-1 || closeParenIndex===-1) {
        return "ERROR";
    }

    const functionName=expr.substring(0, openParenIndex).trim();
    const argsString=expr.substring(openParenIndex+1, closeParenIndex).trim();

    let args=argsString.split(/,(?![^\(]*\))/).map((a) => a.trim());

    switch(functionName) {
        case "SUM":
            return sumFunction(args, dataGrid);
        
        case "AVERAGE":
            return averageFunction(args, dataGrid);
        
        case "MAX":
            return maxFunction(args, dataGrid);

        case "MIN":
            return minFunction(args, dataGrid);

        case "COUNT":
            return countFunction(args, dataGrid);
        
        case "TRIM":
            return trimFunction(args, dataGrid);

        case "UPPER":
            return upperFunction(args, dataGrid);

        case "LOWER":
            return lowerFunction(args, dataGrid);

        case "REMOVE_DUPLICATES":
            return "Use the 'Remove Duplicates' toolbar action";
        
        case "FIND_AND_REPLACE":
            return "Use the 'Find & Replace' toolbar action";

        default:
            return "UNKNOWN FUNCTION";
    }
}

function getValuesFromReference(ref, dataGrid) {
    const rangeMatch=ref.match(/^([A-Za-z0-9]+):([A-Za-z0-9]+)$/);
    if(rangeMatch) {
        const start=rangeMatch[1];
        const end=rangeMatch[2];
        const [startRow, startCol]=cellLabelToIndices(start);
        const [endRow, endCol]=cellLabelToIndices(end);

        let values=[];
        for(let r=startRow; r<=endRow; r++) {
            for(let c=startCol; c<=endCol; c++) {
                const val=parseFloat(dataGrid[r][c].computed || dataGrid[r][c].value) || 0;
                values.push(val);
            }
        }
        return values;
    } else {
        const [rowIndex, colIndex]=cellLabelToIndices(ref);
        const val=parseFloat(dataGrid[rowIndex][colIndex].computed || dataGrid[rowIndex][colIndex].value) || 0;
        return [val];
    }
}

function sumFunction(args, dataGrid) {
    let total=0;
    args.forEach((arg) => {
        getValuesFromReference(arg, dataGrid).forEach((v) =>{
            total+=v;
        });
    });
    return total;
}

function averageFunction(args, dataGrid) {
    let allValues=[];
    args.forEach((arg) => {
        allValues=allValues.concat(getValuesFromReference(arg, dataGrid));
    
    });
    if(allValues.length===0) return 0;
    const sum=allValues.reduce((acc, cur) => acc+cur, 0);
    return sum / allValues.length;
}

function maxFunction(args, dataGrid) {
    let allValues=[];
    args.forEach((arg) => {
        allValues=allValues.concat(getValuesFromReference(arg, dataGrid));

    });
    return allValues.length===0 ? 0:Math.max(...allValues);

}

function minFunction(args, dataGrid) {
    let allValues=[];
    args.forEach((arg) => {
        allValues=allValues.concat(getValuesFromReference(arg, dataGrid));

    });
    return allValues.length === 0 ? 0:Math.min(...allValues);

}

function countFunction(args, dataGrid) {
    let count=0;
    args.forEach((arg) => {
        getValuesFromReference(arg, dataGrid).forEach((val) =>{
            if(!isNaN(val)) count++;
        });
    });
    return count;
}

function trimFunction(args, dataGrid) {
    if(args.length!==1) return "ERROR";
    const [rowIndex, colIndex]=cellLabelToIndices(args[0]);
    const cellValue=dataGrid[rowIndex][colIndex].value || "";
    return cellValue.trim();
}

function upperFunction(args, dataGrid) {
    if(args.length!==1) return "ERROR";
    const [rowIndex, colIndex]=cellLabelToIndices(args[0]);
    const cellValue=dataGrid[rowIndex][colIndex].value || "";
    return cellValue.toUpperCase();
}

function lowerFunction(args, dataGrid) {
    if(args.length!==1) return "ERROR";
    const [rowIndex, colIndex]=cellLabelToIndices(args[0]);
    const cellValue=dataGrid[rowIndex][colIndex].value || "";
    return cellValue.toLowerCase();
}

