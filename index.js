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

    /*check(){
        for (let row of this.rows){
            if (row.length!== new Set(row).size) return false;
        }
        for (let column of this.columns){
            if (column.length!== new Set(column).size) return false;
        }
        for (let square of this.squares){
            if (square.length!== new Set(square).size) return false;
        }
            return true;
    }*/
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

    /*solve(){
            for (let i=0;i<9;i++) {
                for (let j=0; j<9; j++) {
                    if (!this.data[i][j]) {
                        if (!this.possibleCellValues(i,j).length) {return 0;}
                        for (const num of this.possibleCellValues(i,j)) {
                            let copy = new Sudoku(this.data);
                            copy.data[i][j] = num;
                            if (!copy.check()) copy.solve();
                            else console.log(copy.data);
                        }
                    }
                }
            }
    }*/
    lightSolve() {
        let next = true;
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
                            next = true;
                        } /*else
                        if (this.possibleCellValues(i, j).length > 1) {
                            possibleCells.push({i,j,nums:this.possibleCellValues(i, j)});
                        }*/
                    }
                }
            }
        }
        return this.check();
    }
    randomSolve() {
        let timer0 = new Date();
        if (this.lightSolve()) return this.data;
        let start = this.data.map(function(row) {
            return row.slice();
        });
        while (!this.check()){
            for (let i = 0; i < 9; i++) {
            for (let j = 0; j < 9; j++) {
                if (!this.data[i][j]) {
                    if (this.possibleCellValues(i, j).length === 0) {
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
        console.log(this.data);
        console.log(new Date()-timer0);
        this.data = start;
        return true;
    }
    bruteForceSolve() {
        function paths(list, n = 0, result = [], current = []){
            if (n === list.length) result.push(current);
            else list[n].forEach(item => paths(list, n+1, result, [...current, item]));
            return result;
        }
        if (this.lightSolve()) return this.data;
        let start = this.data.map(function(row) {
            return row.slice();
        });
        let possibleCells = [];
        for (let i = 0; i < 9; i++) {
            for (let j = 0; j < 9; j++) {
                if (!this.data[i][j]) {
                    if (this.possibleCellValues(i, j).length > 1) {
                        possibleCells.push(this.possibleCellValues(i, j));
                    }
                }
            }
        }
        return paths(possibleCells);
    }
}

const puzzle = [
    [5,3,0,0,7,0,0,0,0],
    [6,0,0,1,9,5,0,0,0],
    [0,9,8,0,0,0,0,6,0],
    [8,0,0,0,6,0,0,0,3],
    [4,0,0,8,0,3,0,0,1],
    [7,0,0,0,2,0,0,0,6],
    [0,6,0,0,0,0,2,8,0],
    [0,0,0,4,1,9,0,0,5],
    [0,0,0,0,8,0,0,0,9]];
let game = new Sudoku(puzzle);
console.log(game.bruteForceSolve())
//game.randomSolve();
