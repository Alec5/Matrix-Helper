var a = new Matrix();
var arr = [];
var m, n;

function buildInputTable()
{
  for (var r = 0; r < m; r++)
  {
    var tr = document.createElement("TR");
    for (var c = 0; c < n; c++)
    {
      var td = document.createElement("TD");
      var input = document.createElement("INPUT");
      // TODO: set input class name to something i'll style later
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

  bottomSection.style.display = "block";

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
  displayMatrix();
  stylePage();

}

function stylePage()
{
  leftSection.style.width = (matrixInput.offsetWidth + 25) + "px";
  rightSection.style.width = (topSection.offsetWidth - leftSection.offsetWidth - 50) + "px";
  rightSection.style.left = leftSection.offsetWidth + "px";
  rightSection.style.height = leftSection.offsetHeight + "px";
  rightSection.style.bottom = leftSection.offsetHeight + "px";

  topSection.style.height = (leftSection.offsetHeight + 65) + "px";
  bottomSection.style.height = main.offsetHeight - topSection.offsetHeight;
}

function displayMatrix()
{

  for (var i = matrixTable.childNodes.length - 1; i >= 0 ; i--)
    matrixTable.removeChild(matrixTable.childNodes[i])

  for (var r = 0; r < a.m; r++)
  {
    var tr = document.createElement("TR");
    for (var c = 0; c < a.n; c++)
    {
      var td = document.createElement("TD");
      td.id = "a" + r + "" + c;

      td.innerHTML = formatFraction(a.matrix[r][c]);

      tr.appendChild(td);
    }
    matrixTable.appendChild(tr);
  }
  displayRREFMessage();
}

function updateMatrix()
{
  for (var tr = 0; tr < matrixTable.childNodes.length; tr++)
  {
    for (var td = 0; td < matrixTable.childNodes[tr].childNodes.length; td++)
    {
      matrixTable.childNodes[tr].childNodes[td].innerHTML = formatFraction(a.matrix[tr][td]);
    }
  }
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

interchangeButton.onclick = function()
{
  var r1 = interchangeRow1Input.value;
  var r2 = interchangeRow2Input.value;
  a.swapRows(r1-1, r2-1);
  updateMatrix();

  interchangeRow1Input.value = "";
  interchangeRow2Input.value = "";

  var op = document.createElement("P");
  op.innerHTML = "R" + r1 + " ↔ " + "R" + r2;
  operationsLog.appendChild(op);
}

multiplyRowButton.onclick = function()
{
  var row = multiplyRow1.value;
  var scalar = math.fraction(mulitplyBy.value);
  a.scaleRow(row-1, scalar);
  updateMatrix();

  multiplyRow1.value = "";
  mulitplyBy.value = "";

  var op = document.createElement("P");
  op.innerHTML = "R" + row + " = R" + row + " x " + formatFraction(scalar);
  operationsLog.appendChild(op);
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

  var op = document.createElement("P");
  op.innerHTML = "R" + r2 + " = R" + r2 + " + " + "(" + formatFraction(scalar) + ")R" + r1;
  operationsLog.appendChild(op);
}

function clearOpLog()
{
  for (var i = operationsLog.childNodes.length - 1; i >= 0 ; i--)
    operationsLog.removeChild(operationsLog.childNodes[i])
}

submitMatrixSize();
