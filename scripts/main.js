//Set up listener on the inputs
var inputs = document.querySelectorAll('input');

for (var i = 0; i < inputs.length; i++) {
  inputs[i].addEventListener('focus', edit);
  inputs[i].addEventListener('blur', updateNeededStat);
  inputs[i].addEventListener('paste', pasteItem);
}

const tableColumnLayout = {
  fire: 1,
  cold: 2,
  lightning: 3,
  allResist: 4,
  strength: 6,
  int: 7,
  dex: 8,
  allAttributes: 9
};

/**
 * Puts the input box into focus and preselects its text for fast changing
 */
function edit() {
  this.focus();
  this.setSelectionRange(0, this.value.length);
}

/**
 * Updates the output row at the bottom of the column that 'this' is in
 */
function updateNeededStat(e, columnIndex, tableClass) {
  //Find out which column this is in
  var colIdx = columnIndex || getColumnIndex(this.parentNode);
  //Find out which table this is in
  var table = tableClass || whichTableIsInputIn(this);

  //If I just blurred out of the plus to all column, need to update all 3 stats
  if (colIdx === 4) {
    updateAllOutputs(this, table);
  } else {
    //Just blurred out of a regular column, only update that column
    //Get all inputs in the table 'table' with the column 'colIdx' using nth-child
    var inputs = document.querySelectorAll('.' + table + ' td:nth-child(' +
        (colIdx+1) + ') > input'); //add one because nth-child is 1-indexed

    //Get all inputs in the 'plus to all' column in the table
    var plusToAllInputs = document.querySelectorAll('.' + table + ' td:nth-child('
        + (4+1) + ') > input');  //'plus to all' column is column 4

    inputs = Array.prototype.slice.call(inputs);
    plusToAllInputs = Array.prototype.slice.call(plusToAllInputs);
    inputs = inputs.concat(plusToAllInputs); //Join the two arrays

    //Get the needed stat
    var output = calculateNeededStat(inputs);

    //Save the needed state to the webpage
    saveNeededStat(output, colIdx, table);
  }
}

function pasteItem(e) {
  const pastedStats = getItemStatsFromPastedText(e.clipboardData.getData('text/plain'));
  fillTableWithPastedStats(pastedStats, getRowIndex(this));
  updateTableAfterPaste(pastedStats);
  e.preventDefault();
}

function getItemStatsFromPastedText(text) {
  if (!text) { return; }

  let stats = { fire: 0, cold: 0, lightning: 0, allResist: 0, strength: 0, int: 0, dex: 0, allAttributes: 0 };
  let match;
  let re;

  re = /([-|\+]\d+)%* to .*Fire .*Resistance[s]*/gi;
  while ((match = re.exec(text)) != null) {
    stats.fire += parseInt(match[1]);
  }
  re = /([-|\+]\d+)%* to .*Cold .*Resistance[s]*/gi;
  while ((match = re.exec(text)) != null) {
    stats.cold += parseInt(match[1]);
  }
  re = /([-|\+]\d+)%* to .*Lightning .*Resistance[s]*/gi;
  while ((match = re.exec(text)) != null) {
    stats.lightning += parseInt(match[1]);
  }
  re = /([-|\+]\d+)%* to all \w+ Resistances/gi;
  while ((match = re.exec(text)) != null) {
    stats.allResist += parseInt(match[1]);
  }

  re = /([-|\+]\d+) to .*Strength/gi;
  while ((match = re.exec(text)) != null) {
    stats.strength += parseInt(match[1]);
  }
  re = /([-|\+]\d+) to .*Intelligence/gi;
  while ((match = re.exec(text)) != null) {
    stats.int += parseInt(match[1]);
  }
  re = /([-|\+]\d+) to .*Dexterity/gi;
  while ((match = re.exec(text)) != null) {
    stats.dex += parseInt(match[1]);
  }
  re = /([-|\+]\d+) to all Attributes/gi;
  while ((match = re.exec(text)) != null) {
    stats.allAttributes += parseInt(match[1]);
  }

  return stats;
}

function fillTableWithPastedStats(stats, rowIdx) {
  let cells = getAllCellsFromRow(rowIdx);
  for (let key in stats) {
    cells[tableColumnLayout[key]].children[0].value = stats[key];
  }
}

function getAllCellsFromRow(rowIdx) {
  let leftRow = document.getElementsByClassName('left-table')[0].rows[rowIdx];
  let rightRow = document.getElementsByClassName('right-table')[0].rows[rowIdx];
  let cells = Array.prototype.slice.call(leftRow.cells);
  cells = cells.concat(Array.prototype.slice.call(rightRow.cells));
  return cells;
}

function updateTableAfterPaste(stats) {
  updateNeededStat(null, 1, 'left-table');
  updateNeededStat(null, 2, 'left-table');
  updateNeededStat(null, 3, 'left-table');
  updateNeededStat(null, 1, 'right-table');
  updateNeededStat(null, 2, 'right-table');
  updateNeededStat(null, 3, 'right-table');
}

/**
 * Finds out which column the child is in.
 * @param {Node} cell The cell (parent of input)
 * @return {number} the column number 0-indexed.
 */
function getColumnIndex(cell) {
  var children = cell.parentNode.children;
  var colIdx;

  for (var i = 0; i < children.length; i++) {
    if (cell === children[i]) {
      colIdx = i;
      break;
    }
  }

  return colIdx;
}

function getRowIndex(cell) {
  return cell.parentNode.parentNode.rowIndex;
}

/**
 * Finds out which table this 'input' tag is in
 * @param {Node} input The input
 * @return {string} 'left-table' or 'right-table'
 */
function whichTableIsInputIn(input) {
  return input.parentNode.parentNode.parentNode.parentNode.className;
}

/**
 * Calculates the stats required to reach the target stat
 * @param {array} inputs Array of input nodes
 * @return {number} target stat minus sum of the other stats
 */
function calculateNeededStat(inputs) {
  var target;
  var sum = 0;

  for (var i = 0; i < inputs.length; i++) {
    if (inputs[i].parentNode.parentNode.classList.contains('target-stat')) {
      target = parseFloat(inputs[i].value);
    } else {
      sum += parseFloat(inputs[i].value || 0);
    }
  }

  return target-sum;
}

/**
 * Saves @output to the screen at the position dictated by @colIdx, @table
 * @param {number} output The number to be shown on the screen
 * @param {number} colIdx The colIdx that represents the column to change
 * @param {string} table The class name that represents the table to change
 */
function saveNeededStat(output, colIdx, table) {
  //var outputCell = document.querySelector('');
  console.log('output/colIdx/table is ' + output + '/' + colIdx + '/' + table);

  cell = getOutputCellInnerHtml(table, colIdx);

  //TODO change cell color based on output

  //Write @output to innerHTML if output is a number
  if (! isNaN(output)) {
    cell.innerHTML = output;
  }
}

/**
 * Gets output cell's inner class which holds the needed stat's innerHTML
 * @param {number} colIdx The 0 indexed colIdx that specifies the column
 * @param {string} table The class name that represents the table to change
 */
function getOutputCellInnerHtml(table, colIdx) {
  //Get output row in table @table
  var row = document.querySelector('.' + table + ' tr.output');

  //Get output cell in column @colIdx
  //-1 because colIdx is 1-indexed and array is 0-indexed
  var cell = row.children[colIdx];

  return cell.querySelector('.number');
}

/**
 * Outputs all outputs in a table using an input element's value
 * @param {Node} input The input element to update all the outputs with
 * @param {string} table Which table to update the outputs in
 */
function updateAllOutputs(input, table) {
  //for each output cell (0 indexed output cells are indexed 1, 2, and 3)
  for (var colIdx = 1; colIdx <= 3; colIdx++) {
    var output = parseFloat(getOutputCellInnerHtml(table, colIdx).innerHTML);
    output -= parseFloat(input.value);
    saveNeededStat(output, colIdx, table);
  }
}
