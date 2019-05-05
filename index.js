class Sudoku {
    constructor(puzzle) {
        this.data = puzzle.map(function(row) {
            return row.slice();
        });
        this.rows=function(){return this.data};
        this.columns=function(){
            let arr = [];
            for (let i = 0;i<9;i++){
                arr.push([]);
                for (let j = 0;j<9;j++){
                    arr[i].push(this.data[j][i])
                }
            }
            return arr;
        };
        this.squares=function() {
            let arr = [];
            for (let i = 0; i < 9; i++) {
                arr.push([]);
                let n = Math.floor(i / 3) * 3;
                let m = (i % 3) * 3;
                arr[i].push(this.data[n][m]);
                arr[i].push(this.data[n][m + 1]);
                arr[i].push(this.data[n][m + 2]);
                arr[i].push(this.data[n + 1][m]);
                arr[i].push(this.data[n + 1][m + 1]);
                arr[i].push(this.data[n + 1][m + 2]);
                arr[i].push(this.data[n + 2][m]);
                arr[i].push(this.data[n + 2][m + 1]);
                arr[i].push(this.data[n + 2][m + 2]);
            }
            return arr;
        };
    }
    static generatev1(cells = 30){
        if (cells<0) cells = 0;
        if (cells>81) cells = 81;
        let puzzle = new Sudoku([]);
        for (let i=0;i<9;i++) puzzle.data.push([0,0,0,0,0,0,0,0,0]);
        let count=cells;
        while (count) {
            let i = Math.floor(Math.random() * 9);
            let j = Math.floor(Math.random() * 9);
            if (!puzzle.possibleCellValues(i, j)) continue;
            if (puzzle.possibleCellValues(i, j).length===0) return this.generatev1(cells);
                puzzle.data[i][j] = puzzle.possibleCellValues(i, j)[Math.floor(Math.random() * puzzle.possibleCellValues(i, j).length)];
            count--;
        }
        if (!puzzle.smartSolve()) return this.generatev1(cells);
        if (cells+puzzle.smartSolve().solvedCells<50) return this.generatev1(cells);
        /*
        puzzle = new Sudoku(puzzle.smartSolve().result);
        if (!puzzle.bruteForceSolve(2**10)) return this.generatev1(cells);
        if (!puzzle.bruteForceSolve().solved) return this.generatev1(cells);
        */
        return puzzle;
    }
    static generatev2(cells = 30) {
        if (cells<0) cells = 0;
        if (cells>81) cells = 81;
        let puzzle = new Sudoku(this.generatev1(30).smartSolve().result).randomSolve();
        if (puzzle.solved===false) return this.generatev2(cells);
        else puzzle = puzzle.result;
        let count=81-cells;
        while (count) {
            let i = Math.floor(Math.random() * 9);
            let j = Math.floor(Math.random() * 9);
            if (puzzle[i][j] === 0) continue;
            puzzle[i][j] = 0;
            count--;
        }
        console.log('Gegerated:');
        console.log(puzzle.data);
        return puzzle
    }
    check(){
        for (let row of this.rows()){
            let i = 0;
            let copy = [...row].sort((a,b)=>a-b);
            while (copy[i]===i+1) i++;
            if (i!==9) return false;
        }
        for (let column of this.columns()){
            let i = 0;
            let copy = [...column].sort((a,b)=>a-b);
            while (copy[i]===i+1) i++;
            if (i!==9) return false;
        }
        for (let square of this.squares()){
            let i = 0;
            let copy = [...square].sort((a,b)=>a-b);
            while (copy[i]===i+1) i++;
            if (i!==9) return false;
        }
        return true;
    }
    possibleCellValues(i,j){
        if (this.data[i][j]) return null;
        let impossibleCellValues = [];
        let squareNumber = Math.floor(i/3)*3 + Math.floor(j/3);
        this.rows()[i].forEach((num)=>impossibleCellValues.push(num));
        this.columns()[j].forEach((num)=>impossibleCellValues.push(num));
        this.squares()[squareNumber].forEach((num)=>impossibleCellValues.push(num));
        return [1,2,3,4,5,6,7,8,9].filter((num)=>!impossibleCellValues.includes(num));
    }
    smartSolve() {
        let timer0 = new Date();
        let next = true;
        let solvedCells = 0;
        let start = this.data.map(function(row) {
            return row.slice();
        });
        while (next){
            next = false;
            for (let i = 0; i < 9; i++) {
                for (let j = 0; j < 9; j++) {
                    if (!this.data[i][j]) {
                        if (this.possibleCellValues(i, j).length === 0) {
                            return false;
                        } else
                        if (this.possibleCellValues(i, j).length === 1) {
                            this.data[i][j] = this.possibleCellValues(i, j)[0];
                            solvedCells++;
                            next = true;
                        }
                    }
                }
            }
            for (let squareNumber=0;squareNumber<8;squareNumber++) {
                let n = Math.floor(squareNumber / 3) * 3;
                let m = (squareNumber % 3) * 3;
                let possibleCells = [];
                for (let i=n;i<n+3;i++){
                    for (let j=m;j<m+3;j++){
                        if (!this.possibleCellValues(i,j)) continue;
                        for (const num of this.possibleCellValues(i,j)) {
                            possibleCells.push(num);
                        }
                    }
                }
                let counts = {};
                for (let i = 0; i < possibleCells.length; i++) {
                    let num = possibleCells[i];
                    counts[num] = counts[num] ? counts[num] + 1 : 1;
                }
                for (let key in counts) {
                    if (counts[key]===1) {
                        for (let i=n;i<n+3;i++){
                            for (let j=m;j<m+3;j++){
                                if (!this.possibleCellValues(i,j)) continue;
                                if (this.possibleCellValues(i,j).includes(parseInt(key))) {
                                    this.data[i][j] = parseInt(key);
                                    solvedCells++;
                                    next = true;
                                }
                            }
                        }
                    }
                }
            }
        }
        let time = new Date()-timer0+'ms';
        let solved = this.check();
        //disable side effects
        let result = this.data.map(function(row) {
            return row.slice();
        });
        this.data = start.map(function(row) {
            return row.slice();
        });
        return {
            method: 'smartSolve',
            //start,
            result,
            solved,
            solvedCells,
            time
        }
    }
    randomSolve() {
        const MAX_TRIES = 2**15;
        let timer0 = new Date();
        this.data = this.smartSolve().result;
        let start = this.data.map(function(row) {
            return row.slice();
        });
        let n = MAX_TRIES;
        loop: while (!this.check()){
            for (let i = 0; i < 9; i++) {
                for (let j = 0; j < 9; j++) {
                    if (!this.data[i][j]) {
                        if (this.possibleCellValues(i, j).length === 0) {
                            if (--n<1) break loop;
                            this.data = start.map(function(row) {
                                return row.slice();
                            });
                        } else if (this.possibleCellValues(i, j).length === 1) {
                            this.data[i][j] = this.possibleCellValues(i, j)[0];
                        } else if (this.possibleCellValues(i, j).length > 1) {
                            this.data[i][j] = this.possibleCellValues(i, j)[Math.floor(Math.random() * this.possibleCellValues(i, j).length)];
                        }
                    }
                }
            }
        }
        let time = new Date()-timer0+'ms';
        let solved = this.check();
        //disable side effects
        let result = this.data.map(function(row) {
            return row.slice();
        });
        this.data = start.map(function(row) {
            return row.slice();
        });
        return {
            method: 'randomSolve',
            //start,
            result,
            solved,
            time,
            tries:MAX_TRIES-n,
        }
    }
    bruteForceSolve() {
        const MAX_PATHS = 2**22;
        let solutions = [];
        let timer0 = new Date();
        this.data = this.smartSolve().result;
        function paths(list, n = 0, result = [], current = []){
            if (result.length>MAX_PATHS) return false;
            if (n === list.length) result.push(current);
            else list[n].forEach(item => paths(list, n+1, result, [...current, item]));
            return result;
        }
        let start = this.data.map(function(row) {
            return row.slice();
        });
        let possibleCells = [];
        for (let i = 0; i < 9; i++) {
            for (let j = 0; j < 9; j++) {
                if (!this.data[i][j]) {
                    if (this.possibleCellValues(i, j).length > 0) {
                        possibleCells.push(this.possibleCellValues(i, j));
                    }
                }
            }
        }
        /*if (possibleCells.length>25) {
           //console.log('Too deep');
            return false;
        }*/
        let possiblePaths = paths(possibleCells);
        for (const path of possiblePaths) {
            for (let i = 8; i >= 0; i--) {
                for (let j = 8; j >= 0; j--) {
                    if (!this.data[i][j]) {
                        this.data[i][j]=path.pop();
                    }
                }
            }
            if (this.check()) {
                solutions.push(this.data);
            }
            this.data = start.map(function(row) {
                return row.slice();
            });
        }
        let time = new Date()-timer0+'ms';
        return {
            method: 'bruteForceSolve',
            //start,
            solutions:solutions.length,
            //result:solutions,
            solved:(!!solutions.length),
            time,
            tries:Math.min(MAX_PATHS,possiblePaths.length-1)
        }
    }
}

//node --max-old-space-size=8192 --stack-size=80000  index.js
/*const puzzle = [
  [ 3, 9, 4, 1, 5, 2, 6, 8, 7 ],
  [ 7, 6, 2, 3, 9, 8, 5, 4, 1 ],
  [ 1, 5, 8, 4, 6, 7, 9, 3, 2 ],
  [ 9, 2, 1, 8, 3, 4, 7, 5, 6 ],
  [ 8, 7, 3, 5, 2, 6, 1, 9, 4 ],
  [ 5, 4, 6, 9, 7, 1, 3, 2, 8 ],
  [ 2, 3, 7, 6, 4, 5, 8, 1, 9 ],
  [ 6, 1, 9, 2, 8, 3, 4, 7, 5 ],
  [ 4, 8, 5, 7, 1, 9, 2, 6, 3 ] ]
let game = new Sudoku(puzzle);
*/


let generate = Sudoku.generatev2(29);
let game = new Sudoku(generate);
console.log(game.smartSolve());
console.log(game.randomSolve());
console.log(game.bruteForceSolve());


