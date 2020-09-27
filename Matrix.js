class Matrix
{
  constructor(arr)
  {
    this.matrix = arr;
    this.m = arr.length;
    this.n = arr[0].length;
  }

  setMatrix(arr)
  {
    this.matrix = arr;
    this.m = arr.length;
    this.n = arr[0].length;
  }

  duplicateMatrix()
  {
    var newArray = [];
    for (var r = 0; r < this.m; r++)
    {
      newArray.push([]);
      for (var c = 0; c < this.n; c++)
        newArray[r][c] = this.matrix[r][c];
    }
    return new Matrix(newArray);
  }

  // multiplies every entry in the matrix by amount
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
      this.swapEntries([row1, c], [row2, c]);
  }

  // add a multiple of a row to another row
  addRows(scalar, r1, r2)
  {
    for (var c = 0; c < this.n; c++)
      this.matrix[r2][c] = math.add(this.matrix[r2][c], math.multiply(this.matrix[r1][c], scalar));
  }

  // check if a row is all zeros
  isZeroRow(rowNum)
  {
    for (var c = 0; c < this.n; c++)
      if (this.matrix[rowNum][c] != 0)
        return false;
    return true;
  }

  // finds index of the leading variable in a row
  // returns n if no leading variable is found, indicating a 0 row
  indexOfLeadingVar(rowNum)
  {
    for (var c = 0; c < this.n; c++)
      if (this.matrix[rowNum][c] != 0)
        return c;
    return this.n;
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

  // returns a new matrix, which is the current matrix transposed
  transpose()
  {
    var newArray = [];

    // dimensions are inversed (new matrix has n rows and m columns)
    for (var r = 0; r < this.n; r++)
      newArray.push([]);

    // loop through matrix in column-major order
    // add each element to new matrix in row-major order
    for (var c = 0; c < this.n; c++)
    {
      for (var r = 0; r < this.m; r++)
        newArray[c][r] = this.matrix[r][c];
    }
    return new Matrix(newArray);
  }

  // helper method for finding determinant
  // returns subset of matrix that excludes
  // row i and column j
  subset(i, j)
  {
    var newArray = [];

    for (var r = 0; r < this.m - 1; r++)
      newArray.push([]);

    var newR = 0;
    var newC = 0;

    for (var r = 0; r < this.m; r++)
    {
      if (r != i)
      {
        newC = 0;
        for (var c = 0; c < this.n; c++)
        {
          if (c != j)
          {
            newArray[newR][newC] = this.matrix[r][c];
            newC++;
          }
        }
        newR++;
      }
    }

    return new Matrix(newArray);
  }

  // TODO: remake det() method to be more efficient
  // calculates the determinant
  // Precondition: m == n
  det()
  {
    if (this.m == 1)
      return this.matrix[0][0];

    if (this.m == 2)
    {
      return math.subtract(
               math.multiply(this.matrix[0][0], this.matrix[1][1]),
               math.multiply(this.matrix[0][1], this.matrix[1][0])
      );
    }

    var total = 0;
    var sign = 1;

    // loop through elements of first column
    for (var r = 0; r < this.m; r++)
    {
      // calculate cofactor of each element: (alternating sign) * subset(r, 0).det()
      var cofactor = math.multiply(sign, this.subset(r, 0).det());

      // multiply each element in this column by the cofactor for that element
      var ac = math.multiply(this.matrix[r][0], cofactor);

      // add this to a total
      total = math.add(total, ac);

      sign *= -1;
    }
    return total;
  }

  // returns a new matrix which is the original matrix in RREF
  calcRREF()
  {
    var newMatrix = this.duplicateMatrix();

    var completeRows = 0;
    // repeat until all rows are complete
    while (completeRows < newMatrix.m)
    {
      // find the row with the leftmost leading variable
      // by looping through incomplete rows, finding which has min leadingVar
      var leadingIndex = newMatrix.indexOfLeadingVar(completeRows);
      var leadingRow = completeRows;
      var leadingVar = newMatrix.matrix[completeRows][leadingIndex];

      for (var r = completeRows; r < newMatrix.m; r++)
      {
        var rowIndex = newMatrix.indexOfLeadingVar(r)
        if (rowIndex < leadingIndex)
        {
          leadingIndex = rowIndex;
          leadingRow = r;
          leadingVar = newMatrix.matrix[r][leadingIndex];
        }
      }

      // swap this row with the topmost incomplete row
      if (leadingRow != completeRows)
        newMatrix.swapRows(leadingRow, completeRows);

      // multiply the row by 1/leadingVar
      if (!newMatrix.isZeroRow(completeRows))
      {
        newMatrix.scaleRow(completeRows, math.divide(1, leadingVar));

        // subtract (c * this row) from all other rows,
        // where c = the coefficient in the same column as this row's leading variable
        for (var r = 0; r < newMatrix.m; r++)
          if (r != completeRows)
            newMatrix.addRows(math.multiply(newMatrix.matrix[r][leadingIndex], -1), completeRows, r);
      }

      // increase the complete rows counter by one
      completeRows++;
    }
    return newMatrix;
  }

  // returns a new matrix which is the original matrix inversed
  // Precondition: matrix is square and determinant is not 0
  inverse()
  {
    var newMatrix = this.duplicateMatrix();

    // make an identity matrix with the same dimensions as this matrix
    var identityArr = [];
    for (var r = 0; r < a.m; r++)
    {
      identityArr.push([])
      for (var c = 0; c < a.n; c++)
      {
        if (c == r)
          identityArr[r][c] = 1;
        else
          identityArr[r][c] = 0;
      }
    }

    // run the RREF algorithm and do all the row operations on the identity matrix simultaneously
    var invertedMatrix = new Matrix(identityArr);

    var completeRows = 0;
    // repeat until all rows are complete
    while (completeRows < newMatrix.m)
    {
      // find the row with the leftmost leading variable
      // by looping through incomplete rows, finding which has min leadingVar
      var leadingIndex = newMatrix.indexOfLeadingVar(completeRows);
      var leadingRow = completeRows;
      var leadingVar = newMatrix.matrix[completeRows][leadingIndex];

      for (var r = completeRows; r < newMatrix.m; r++)
      {
        var rowIndex = newMatrix.indexOfLeadingVar(r)
        if (rowIndex < leadingIndex)
        {
          leadingIndex = rowIndex;
          leadingRow = r;
          leadingVar = newMatrix.matrix[r][leadingIndex];
        }
      }

      // swap this row with the topmost incomplete row
      if (leadingRow != completeRows)
      {
        newMatrix.swapRows(leadingRow, completeRows);
        invertedMatrix.swapRows(leadingRow, completeRows);
      }

      if (!newMatrix.isZeroRow(completeRows))
      {
        // multiply the row by 1/leadingVar
        newMatrix.scaleRow(completeRows, math.divide(1, leadingVar));
        invertedMatrix.scaleRow(completeRows, math.divide(1, leadingVar));

        // subtract (c * this row) from all other rows,
        // where c = the coefficient in the same column as this row's leading variable
        for (var r = 0; r < newMatrix.m; r++)
        {
          if (r != completeRows)
          {
            var c = math.multiply(newMatrix.matrix[r][leadingIndex], -1);
            newMatrix.addRows(c, completeRows, r);
            invertedMatrix.addRows(c, completeRows, r);
          }
        }
      }

      // increase the complete rows counter by one
      completeRows++;
    }
    return invertedMatrix;

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
