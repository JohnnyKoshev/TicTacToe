const cells: NodeListOf<HTMLTableDataCellElement> = document.querySelectorAll('td');

class TicTacToe {
    private cellsArr: HTMLTableDataCellElement[][] = []
    private lastPlayer: string[] = [];

    constructor(private cells: NodeListOf<HTMLTableDataCellElement>) {
        this.intoArray();
    }

    private intoArray() {
        let count: number = 1;
        for (let i = 0; i < this.cells.length; i++) {
            if (count % 3 === 0) {
                this.cellsArr.push([this.cells[i - 2], this.cells[i - 1], this.cells[i]])
            }
            count++;
        }

    }

    private rowEquality(arr: HTMLTableDataCellElement[]): boolean[] | [boolean, string]{
        let check: boolean = false;
        let tempEl: any = document.createElement('td');
        for (let i = 0; i < arr.length; i++) {
            if (i === 0) {
                tempEl = arr[i];
            }
            if (arr[i].innerText === '') {
                return [false];
            }
            check = arr[i].innerText === tempEl.innerText;
            if (!check) {
                break;
            }
        }
        return [check, tempEl.innerText];
    }

    private deleteEvent() {
        for (const cellsRow of this.cellsArr) {
            cellsRow.forEach((cell) => {
                cell.replaceWith(cell.cloneNode(true));
            })
        }
    }

    private checkWin(): void {
        const cols: HTMLTableDataCellElement[][] = [];
        const diagonals: HTMLTableDataCellElement[][] = [[], []];
        for (let i = 0; i < this.cellsArr.length; i++) {
            if (this.rowEquality(this.cellsArr[i])[0]) {
                this.deleteEvent();
            }
            diagonals[0].push(this.cellsArr[i][i]);
            diagonals[1].push(this.cellsArr[i][(this.cellsArr.length - 1) - i]);
            for (let j = 0; j < this.cellsArr[i].length; j++) {
                if (cols.length === 0) {
                    for (let k = 0; k < this.cellsArr[i].length; k++) {
                        cols.push([]);
                    }
                }
                cols[j].push(this.cellsArr[i][j]);
            }
        }
        for (let subCols of cols) {
            if (this.rowEquality(subCols)[0]) {
                this.deleteEvent();
            }
        }
        for (let subDiagonals of diagonals) {
            if (this.rowEquality(subDiagonals)[0]) {
                this.deleteEvent();
            }
        }
    }

    public startGame(): void {
        for (const cellsRow of this.cellsArr) {
            cellsRow.forEach((cell) => {
                cell.addEventListener('click', (): void => {
                    let player: string;
                    if (!cell.innerText) {
                        if (this.lastPlayer.length === 0 || this.lastPlayer[this.lastPlayer.length - 1] === 'O') {
                            cell.innerText = 'X';
                            player = cell.innerText;
                            this.lastPlayer.push(player);
                        } else if (this.lastPlayer[this.lastPlayer.length - 1] === 'X') {
                            cell.innerText = 'O';
                            player = cell.innerText;
                            this.lastPlayer.push(player);
                        }
                        this.checkWin();
                    }
                });
            })
        }
    }
}

const game = new TicTacToe(cells);
game.startGame();