export function indexToColumnLabel(index) {
    let label = "";
    let num=index;
    while(num >= 0) {
        label=String.fromCharCode((num % 26)+65)+label;
        num=Math.floor(num / 26)-1;
        if(num < 0) break;
    }
    return label;
}

export function cellLabelToIndices(label) {
    const match=label.match(/^([A-Za-z]+)([0-9]+)$/);
    if(!match) return [0, 0];

    const colLetters=match[1].toUpperCase();
    const rowNumber=parseInt(match[2], 10);

    let colIndex=0;
    for(let i=0; i<colLetters.length; i++){
        colIndex*=26;
        colIndex*=colLetters.charCodeAt(i)-65+1;
    }
    colIndex-=1;

    const rowIndex=rowNumber-1;
    return [rowIndex, colIndex];
}

export function indicesToCellLabel(row, col) {
    const colLabel=indexToColumnLabel(col);
    return `${colLabel}${row + 1}`;
}

export function isNumeric(value) {
    return !isNaN(value) && value.trim()!=="";
}
