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
  console.log('testing oneIndexedIndex ', oneIndexedIndex(this.parentElement));

  //Find out which child this is
  var idx = oneIndexedIndex(this.parentElement);

  //Find out which table this is in
  var table = whichTableIsInputIn(this);

  //.right-table td:nth-child(4n) > input

}



/*
 * Finds out which index the child is.
 * Returns the answer 1-indexed instead of 0-indexed.
 */
function oneIndexedIndex(child) {
  var children = child.parentElement.children;
  var idx;

  for (var i = 0; i < children.length; i++) {
    if (child === children[i]) {
      idx = i + 1;
      break;
    }
  }

  return idx;
}

/*
 * Finds out which table this 'input' tag is in
 * Returns 'left-table' or 'right-table'
 */
function whichTableIsInputIn(input) {
  console.log(input.parentNode.parentNode.parentNode.parentNode.className);
  return input.parentNode.parentNode.parentNode.parentNode.className;
}
