class Matrix
{
  constructor()
  {
    this.matrix = [[0]];
    this.m = this.matrix.length;
    this.n = this.matrix[0].length;
  }

  setMatrix(arr)
  {
    this.matrix = arr;
    this.m = arr.length;
    this.n = arr[0].length;
  }

  // multiplies every entry in the matrix by amount
  // precondition: amount is not 0
  scale(amount)
  {
    // call scaleRow on each row
    for (var r = 0; r < this.m; r++)
      this.scaleRow(r, amount);
  }

  // takes two coordinate pairs and swaps the entires at these locations
  swapEntries(rc1, rc2)
  {
    var r1 = rc1[0];
    var c1 = rc1[1];
    var r2 = rc2[0];
    var c2 = rc2[1];

    var temp = this.matrix[r1][c1];
    this.matrix[r1][c1] = this.matrix[r2][c2];
    this.matrix[r2][c2] = temp;
  }

  // next three mehtods are the elementary row operations:

  // scales a given row of the matrix by amount
  // precondition: amount is not 0
  scaleRow(row, amount)
  {
    for (var c = 0; c < this.n; c++)
      this.matrix[row][c] = math.multiply(this.matrix[row][c], amount);
  }

  // swapRows takes two rows and swaps them
  swapRows(row1, row2)
  {
    for (var c = 0; c < this.n; c++)
    {
      this.swapEntries([row1, c], [row2, c]);
    }
  }

  // add a multiple of a row to another row
  addRows(scalar, r1, r2)
  {
    for (var c = 0; c < this.n; c++)
    {
      this.matrix[r2][c] = math.add(this.matrix[r2][c], math.multiply(this.matrix[r1][c], scalar));
    }
  }

  // check if a row is all zeros
  isZeroRow(rowNum)
  {
    for (var c = 0; c < this.n; c++)
    {
      if (this.matrix[rowNum][c] != 0)
        return false;
    }
    return true;
  }

  // finds index of the leading variable in a row
  indexOfLeadingVar(rowNum)
  {
    for (var c = 0; c < this.n; c++)
    {
      if (this.matrix[rowNum][c] != 0)
        return c;
    }
    return null;
  }

  // returns true if matrix is in REF
  isREF()
  {
    // check if all zero rows are at the bottom
    var zeroFlag = false;
    for (var r = 0; r < this.m; r++)
    {
      if (this.isZeroRow(r))
        zeroFlag = true;
      if (zeroFlag)
      {
        // check if a nonzero row is found after a zero row
        if (!this.isZeroRow(r))
          return false;
      }
    }

    // check if each leading variable is to the right of the one above it
    var prevLeadingVar = this.indexOfLeadingVar(0);
    for (var r = 1; r < this.m; r++)
    {
      if (!this.isZeroRow(r))
      {
        if (this.indexOfLeadingVar(r) > prevLeadingVar)
          prevLeadingVar = this.indexOfLeadingVar(r)
        else
          return false;
      }
    }

    return true;
  }

  // returns true if matrix is in RREF
  isRREF()
  {
    if (!this.isREF())
      return false;

    // check if each leading variable is the only nonzero entry in that column
    for (var r = 0; r < this.m; r++)
    {
      if (this.isZeroRow(r))
        break;

      // find column with leading variable to check
      var c = this.indexOfLeadingVar(r);

      // search through entries of this column for any other nonzero entries
      var varCount = 0;
      for (var j = 0; j < this.m; j++)
      {
        if (this.matrix[j][c] != 0)
          varCount++;
      }
      if (varCount > 1)
        return false;
    }

    // check if every leading variable is 1
    for (var r = 0; r < this.m; r++)
    {
      if (this.isZeroRow(r))
        break;
      if (this.matrix[r][this.indexOfLeadingVar(r)] != 1)
        return false;
    }

    return true;
  }

  printToConsole()
  {
    var output = ""
    for (var r = 0; r < this.m; r++)
    {
      var row = "["
      for (var c = 0; c < this.n; c++)
      {
        row += " " + this.matrix[r][c] + " "
      }
      row += "]";
      output += row + "\n"
    }
    console.log(output);
  }


}
