//Set up listener on the inputs
var inputs = document.querySelectorAll('input');

for (var i = 0; i < inputs.length; i++) {
  // inputs[i].parentElement.addEventListener("click", edit);
  // inputs[i].addEventListener('click', edit);
  inputs[i].addEventListener('focus', edit);
  inputs[i].addEventListener('blur', updateNeededStat);

}


function edit() {
  this.focus();
  //console.log('my current value is', this.value || 0);
  //console.log('testing oneIndexedIndex ', oneIndexedIndex.call(this.parentElement));
  this.setSelectionRange(0, this.value.length);
}

function updateNeededStat() {
  //console.log('testing oneIndexedColumnIndex ', oneIndexedColumnIndex(this.parentNode));

  //Find out which column this is in
  var idx = oneIndexedColumnIndex(this.parentNode);

  //Find out which table this is in
  var table = whichTableIsInputIn(this);

  //Get all inputs in the table 'table' with the column 'idx' using nth-child
  var inputs = document.querySelectorAll('.' + table + ' td:nth-child(' +
      idx + ') > input');

  //Get the needed stat
  var output = calculateNeededStat(inputs);

  //Save the needed state to the webpage
  saveNeededStat(output, idx, table);

}

function saveNeededStat(output, idx, table) {
  //var outputCell = document.querySelector('');
  console.log('output/idx/table is ' + output + '/' + idx + '/' + table);

  //Get output row in table @table
  var row = document.querySelector('.' + table + ' tr.output');

  //Get output cell in column @idx
  var cell = row.children[idx-1]; //-1 because idx is 1-indexed and array is 0-indexed

  //TODO change cell color based on output

  //Write @output to innerHTML
  if (! isNaN(output)) {
    cell.querySelector('.number').innerHTML = output;
  }
  //console.log('innerHTML ' + cell.querySelector('.number').innerHTML);
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
 * Finds out which column the child is in.
 * @param {Node} cell The cell (parent of input)
 * @return {number} the column number 1-indexed instead of 0-indexed.
 */
function oneIndexedColumnIndex(cell) {
  var children = cell.parentNode.children;
  var idx;

  for (var i = 0; i < children.length; i++) {
    if (cell === children[i]) {
      idx = i + 1;
      break;
    }
  }

  return idx;
}

/**
 * Finds out which table this 'input' tag is in
 * @param {Node} input The input
 * @return {string} 'left-table' or 'right-table'
 */
function whichTableIsInputIn(input) {
  //console.log(input.parentNode.parentNode.parentNode.parentNode.className);
  return input.parentNode.parentNode.parentNode.parentNode.className;
}
