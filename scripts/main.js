//Set up listener on the inputs
var inputs = document.querySelectorAll('input');

for (var i = 0; i < inputs.length; i++) {
  // inputs[i].parentElement.addEventListener("click", edit);
  // inputs[i].addEventListener('click', edit);
  inputs[i].addEventListener('focus', edit);
  inputs[i].addEventListener('blur', calculateNeededStat);

}


function edit() {
  this.focus();
  console.log('my current value is', this.value || 0);
  //console.log('testing oneIndexedIndex ', oneIndexedIndex.call(this.parentElement));
  this.setSelectionRange(0, this.value.length);
}

function calculateNeededStat() {
  console.log('testing oneIndexedColumnIndex ', oneIndexedColumnIndex(this.parentNode));

  //Find out which column this is in
  var idx = oneIndexedColumnIndex(this.parentNode);

  //Find out which table this is in
  var table = whichTableIsInputIn(this);

  //.right-table td:nth-child(4n) > input

}



/**
 * Finds out which column the child is in.
 *
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
 *
 * @param {Node} input The input
 * @return {string} 'left-table' or 'right-table'
 */
function whichTableIsInputIn(input) {
  console.log(input.parentNode.parentNode.parentNode.parentNode.className);
  return input.parentNode.parentNode.parentNode.parentNode.className;
}
