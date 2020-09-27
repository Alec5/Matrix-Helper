var arr = [[0]];
var a = new Matrix(arr);
var m, n;
var initCalcHeight = calculatorContainer.offsetHeight;

function buildInputTable()
{
  for (var r = 0; r < m; r++)
  {
    var tr = document.createElement("TR");
    for (var c = 0; c < n; c++)
    {
      var td = document.createElement("TD");
      var input = document.createElement("INPUT");
      input.id = "i" + r + "" + c;

      td.appendChild(input);

      tr.appendChild(td);
    }
    matrixInput.appendChild(tr);
  }
  stylePage();
}

function validateNumber(e, value)
{
  if (e.keyCode == 8)
    return true;
  if (!((e.keyCode > 95 && e.keyCode < 106)
    || (e.keyCode > 47 && e.keyCode < 58)))
    return false;

  var num = (value * 10) + parseInt(e.key);
  return (num > 0 && num <= 10);
}


mInput.onkeydown = function(e)
{
  return validateNumber(e, this.value);
}
nInput.onkeydown = function(e)
{
  return validateNumber(e, this.value);
}

mInput.oninput = function()
{
  if (mInput.value > 0)
    submitMatrixSize();
}
nInput.oninput = function()
{
  if (nInput.value > 0)
    submitMatrixSize();
}


function submitMatrixSize()
{
  for (var i = matrixInput.childNodes.length - 1; i >= 0 ; i--)
    matrixInput.removeChild(matrixInput.childNodes[i])
  m = mInput.value;
  n = nInput.value;
  buildInputTable();
}

function createMatrix()
{
  //TODO: check to make sure inputs are valid

  matrixTable.style.borderColor = "black";

  arr= [];
  for (var r = 0; r < m; r++)
  {
    arr.push([])
    for (var c = 0; c < n; c++)
    {
      arr[r][c] = math.fraction(document.getElementById("i" + r + "" + c).value);
    }
  }
  a.setMatrix(arr);
  displayMatrix(matrixTable, a);
  stylePage();
}

function stylePage()
{
  leftSection.style.width = (matrixInput.offsetWidth + 25) + "px";
  leftSection.style.height = Math.max((matrixInput.offsetHeight + inputSizeSection.offsetHeight + 50), matrixTable.offsetHeight) + "px";
  rightSection.style.width = (topSection.offsetWidth - leftSection.offsetWidth - 50) + "px";
  rightSection.style.left = leftSection.offsetWidth + "px";
  rightSection.style.height = leftSection.offsetHeight + "px";
  rightSection.style.bottom = leftSection.offsetHeight + "px";

  topSection.style.height = (leftSection.offsetHeight + 65) + "px";

  resizeCalc();
  styleMatrixBorder(matrixTable, matrixBorder);
  styleMatrixBorder(calcMatrixTable, calcMatrixBorder);
}

function styleMatrixBorder(table, border)
{
  border.style.width = (table.offsetWidth - 30) + "px";
  border.style.left = (table.offsetLeft + 15) + "px";
  border.style.height = (table.offsetHeight + 1) + "px";
}

function displayMatrix(table, matrix)
{
  for (var i = table.childNodes.length - 1; i >= 0 ; i--)
    table.removeChild(table.childNodes[i])

  for (var r = 0; r < matrix.m; r++)
  {
    var tr = document.createElement("TR");
    for (var c = 0; c < matrix.n; c++)
    {
      var td = document.createElement("TD");
      td.innerHTML = formatFraction(matrix.matrix[r][c]);

      tr.appendChild(td);
    }
    table.appendChild(tr);
  }

  displayRREFMessage();
}

function updateMatrix()
{
  for (var tr = 0; tr < matrixTable.childNodes.length; tr++)
    for (var td = 0; td < matrixTable.childNodes[tr].childNodes.length; td++)
      matrixTable.childNodes[tr].childNodes[td].innerHTML = formatFraction(a.matrix[tr][td]);
  displayRREFMessage();
}

function displayRREFMessage()
{
  if (a.isRREF())
  {
    rrefMessage.style.display = "block";
    rrefMessage.style.color = "rgb(20, 220, 130)";
    rrefMessage.innerHTML = "Matrix is in reduced row-echelon form!";
  }
  else if (a.isREF())
  {
    rrefMessage.style.display = "block";
    rrefMessage.style.color = "rgb(220, 200, 40)";
    rrefMessage.innerHTML = "Matrix is in row-echelon form!"
  }
  else
  {
    rrefMessage.style.display = "none";
  }
}

function formatFraction(num)
{
  var rtn = num.n;

  if (num.d != 1)
    rtn +=  ("/" + num.d);

  if (num.s == -1)
    rtn = "-" + rtn;

  return rtn;
}

function addRowOp(eq)
{
  var op = document.createElement("P");
  op.innerHTML = eq;
  operationsLog.appendChild(op);
}

function resizeCalc()
{
  calculatorContainer.style.height = Math.max(calcMatrixTable.offsetHeight + 60, initCalcHeight) + "px";
  main.style.height = (topSection.offsetHeight + calculatorContainer.offsetHeight * 2) + "px";
  bottomSection.style.height = main.offsetHeight - topSection.offsetHeight;
}

interchangeButton.onclick = function()
{
  var r1 = interchangeRow1Input.value;
  var r2 = interchangeRow2Input.value;
  a.swapRows(r1-1, r2-1);
  updateMatrix();

  interchangeRow1Input.value = "";
  interchangeRow2Input.value = "";

  addRowOp("R" + r1 + " ↔ " + "R" + r2);
}

multiplyRowButton.onclick = function()
{
  var row = multiplyRow1.value;
  var scalar = math.fraction(mulitplyBy.value);
  a.scaleRow(row-1, scalar);
  updateMatrix();

  multiplyRow1.value = "";
  mulitplyBy.value = "";

  addRowOp("R" + row + " = R" + row + " x " + formatFraction(scalar));
}

addRowsButton.onclick = function()
{
  var scalar = math.fraction(addRowScalar.value);
  var r1 = addRow1.value;
  var r2 = addRow2.value;
  a.addRows(scalar, r1-1, r2-1);
  updateMatrix();

  addRowScalar.value = "";
  addRow1.value = "";
  addRow2.value = "";

  addRowOp("R" + r2 + " = R" + r2 + " + " + "(" + formatFraction(scalar) + ")R" + r1);
}

clearButton.onclick = function()
{
  for (var i = operationsLog.childNodes.length - 1; i >= 0 ; i--)
    operationsLog.removeChild(operationsLog.childNodes[i])
}

detButton.onclick = function()
{
  calcMatrixBorder.style.display = "none";
  calcMatrixTable.style.display = "none";
  calculatorOutput.style.display = "block";
  if (a.m == a.n)
  {
    calculatorOutput.innerHTML = formatFraction(a.det());
  }
  else
  {
    calculatorOutput.innerHTML = "Matrix is not square"
  }
}

rrefButton.onclick = function()
{
  calcMatrixBorder.style.display = "block";
  calcMatrixTable.style.display = "inline-block";
  calculatorOutput.style.display = "none";
  calcMatrixTable.style.borderColor = "black";

  var rrefMatrix = a.calcRREF();

  displayMatrix(calcMatrixTable, rrefMatrix);
  styleMatrixBorder(calcMatrixTable, calcMatrixBorder);
  resizeCalc();
}

transposeButton.onclick = function()
{
  calcMatrixBorder.style.display = "block";
  calcMatrixTable.style.display = "inline-block";
  calculatorOutput.style.display = "none";
  calcMatrixTable.style.borderColor = "black";

  var transposedMatrix = a.transpose();

  displayMatrix(calcMatrixTable, transposedMatrix);
  styleMatrixBorder(calcMatrixTable, calcMatrixBorder);
  resizeCalc();
}

inverseButton.onclick = function()
{
  if (a.m == a.n && a.det() != 0)
  {
    calcMatrixBorder.style.display = "block";
    calcMatrixTable.style.display = "inline-block";
    calculatorOutput.style.display = "none";
    calcMatrixTable.style.borderColor = "black";

    var inverseMatrix = a.inverse();

    displayMatrix(calcMatrixTable, inverseMatrix);
    styleMatrixBorder(calcMatrixTable, calcMatrixBorder);
    resizeCalc();
  }
  else
  {
    calcMatrixBorder.style.display = "none";
    calcMatrixTable.style.display = "none";
    calculatorOutput.style.display = "block";
    calculatorOutput.innerHTML = "Matrix is not invertible"
  }
}

submitMatrixSize();
