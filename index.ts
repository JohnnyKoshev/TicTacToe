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

    private rowEquality(arr: HTMLTableDataCellElement[]): boolean[] | [boolean, string] {
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

    private noCells(): boolean {
        for (let i = 0; i < this.cellsArr.length; i++) {
            for (let j = 0; j < this.cellsArr[i].length; j++) {
                if (!this.cellsArr[i][j].innerText) {
                    return false;
                }
            }
        }
        return true;
    }

    private botFindCell(): number[] {
        let randomRow = Math.floor(Math.random() * 3);
        let randomCol = Math.floor(Math.random() * 3);
        if (!this.noCells()) {
            while (this.cellsArr[randomRow][randomCol].innerText !== '') {
                randomRow = Math.floor(Math.random() * 3);
                randomCol = Math.floor(Math.random() * 3);
            }
            return [randomRow, randomCol]
        }
        return [-1, -1];
    }

    private botPlay(figure: string, lastPlayerRef: string): void {
        let randomPos: number[] = this.botFindCell();
        if (randomPos[0] !== -1 && randomPos[1] !== -1) {
            this.cellsArr[randomPos[0]][randomPos[1]].innerText = figure;
            lastPlayerRef = figure;
            this.lastPlayer.push(lastPlayerRef);
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

    public startPvP(): void {
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
                        console.log(this.cellsArr);
                        this.checkWin();
                    }
                });
            })
        }
    }

    public startPvB(): void {
        let check: boolean = true;
        let player: string = '';
        let playerChoice: string | null = '';
        while (check) {
            playerChoice = prompt("Choose 'X' or 'O':");
            if (playerChoice === 'X') {
                check = false;
            } else if (playerChoice === 'O') {
                check = false;
                this.botPlay('X', player);
            } else {
                alert('Invalid choice. Please, try again!');
            }
        }
        for (const cellsRow of this.cellsArr) {
            cellsRow.forEach((cell) => {
                cell.addEventListener('click', () => {
                    if (!cell.innerText) {
                        if (playerChoice === 'X') {
                            if (this.lastPlayer.length === 0 || this.lastPlayer[this.lastPlayer.length - 1] === 'O') {
                                cell.innerText = 'X';
                                player = cell.innerText;
                                this.lastPlayer.push(player);
                            }
                            this.checkWin();
                            this.botPlay('O', player);
                        } else if (playerChoice === 'O') {
                            if (this.lastPlayer[this.lastPlayer.length - 1] === 'X') {
                                cell.innerText = 'O';
                                player = cell.innerText;
                                this.lastPlayer.push(player);
                            }
                            this.checkWin();
                            this.botPlay('X', player);

                        }
                        console.log(this.cellsArr);
                        this.checkWin();
                    }

                })

            })
        }

    }

    public chooseGameType(): void {
        let check = true;
        while (check) {
            const selection: string | null = prompt(`Choose a type of game:
                                          1. Player vs Bot (random)
                                          2. Player vs Player`);
            if (selection === '1') {
                check = false;
                this.startPvB();
            } else if (selection === '2') {
                check = false;
                this.startPvP();
            } else {
                alert('Invalid selection. Please, try again!');
            }
        }
    }
}

const game = new TicTacToe(cells);
game.chooseGameType();