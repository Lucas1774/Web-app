package com.lucas.server.components.sudoku;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

public class Sudoku {
    public static final int SIZE = 9;
    public static final List<Integer> DIGITS = Arrays.asList(1, 2, 3, 4, 5, 6, 7, 8, 9);
    static final String ROW = "row";
    static final String COLUMN = "column";
    private static final String BLOCK = "block";
    public static final int NUMBER_OF_CELLS = 81;
    private List<Integer> rawData;
    private List<Row> rows;
    private List<Column> columns;
    private List<Block> blocks;

    private Sudoku(List<Integer> rawData) {
        this.rawData = new ArrayList<Integer>(rawData);
        this.rows = new ArrayList<Row>();
        this.columns = new ArrayList<Column>();
        this.blocks = new ArrayList<Block>();
        for (int i = 0; i < SIZE; i++) {
            this.rows.add(new Row(rawData, i));
            this.columns.add(new Column(rawData, i));
            this.blocks.add(new Block(rawData, i));
        }
    }

    public static Sudoku withValues(List<Integer> values) {
        return new Sudoku(values);
    }

    public static Sudoku withZeros() {
        List<Integer> zeros = new ArrayList<Integer>();
        for (int i = 0; i < NUMBER_OF_CELLS; i++) {
            zeros.add(0);
        }
        return new Sudoku(zeros);
    }

    public static Sudoku withDefaultValues() {
        List<Integer> rawData = new ArrayList<Integer>();
        for (int i = 0; i < NUMBER_OF_CELLS; i++) {
            rawData.add(((i % SIZE) + 3 * (i / SIZE) + (i / 27)) % SIZE + 1);
        }
        return new Sudoku(rawData);
    }

    public boolean isSolved() {
        return !this.rawData.contains(0);
    }

    public void set(int cell, Integer number) {
        int rowIndex = getRowIndex(cell);
        int columnIndex = getColumnIndex(cell);
        int blockIndex = getBlockIndex(cell);
        this.rawData.set(cell, number);
        this.rows.get(rowIndex).set(columnIndex, number);
        this.columns.get(columnIndex).set(rowIndex, number);
        int blockRow = rowIndex % 3;
        int blockColumn = columnIndex % 3;
        this.blocks.get(blockIndex).set(blockRow * 3 + blockColumn, number);
    }

    public List<Integer> get() {
        return this.rawData;
    }

    @Override
    public String toString() {
        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < SIZE; i++) {
            if (i % 3 == 0)
                sb.append("+-------+-------+-------+\n");
            for (int j = 0; j < SIZE; j++) {
                if (j % 3 == 0)
                    sb.append("| ");
                sb.append(this.rawData.get(i * SIZE + j)).append(' ');
            }
            sb.append("|\n");
        }
        sb.append("+-------+-------+-------+\n");
        return sb.toString();
    }

    public void solve() {
        int maxRisk = 2;
        while (!this.isSolved()) {
            this.doSolve(maxRisk);
            maxRisk++;
        }
    }

    /**
     * Using a copy of the sudoku is more efficient than editing and rolling back
     * even trivially-placed numbers
     * Likewise, keeping count of digits attempted to place is slower than checking
     * all 9
     * 
     * @param maxRisk forces the program to come back if filling a number doesn't
     *                clear others
     */
    private boolean doSolve(int maxRisk) {
        if (this.isSolved()) {
            return true;
        }
        for (int i = 0; i <= maxRisk; i++) {
            List<Integer> promisingCells = this.getPromisingCells(i);
            if (!promisingCells.isEmpty()) {
                if (0 == i) {
                    return false;
                }
                if (1 == i) {
                    for (int promisingCell : promisingCells) {
                        for (int digit : DIGITS) {
                            if (this.acceptsNumberInPlace(promisingCell, digit)) {
                                this.set(promisingCell, digit);
                                break;
                            }
                        }
                    }
                    return this.doSolve(maxRisk);
                } else {
                    for (int promisingCell : promisingCells) {
                        for (int digit : DIGITS) {
                            if (this.acceptsNumberInPlace(promisingCell, digit)) {
                                Sudoku sudoku = withValues(this.rawData);
                                sudoku.set(promisingCell, digit);
                                if (sudoku.doSolve(maxRisk--)) {
                                    this.rawData = sudoku.rawData;
                                    return true;
                                }
                            }
                        }
                    }
                }
            }
        }
        return false;
    }

    public String serialize() {
        return "\"" + this.rawData.toString().replace("[", "").replace("]", "").replaceAll(", ", "") + "\"";
    }

    public static List<Integer> deserialize(String sudoku) {
        List<Integer> rawData = new ArrayList<Integer>();
        for (char c : sudoku.toCharArray()) {
            rawData.add(Character.getNumericValue(c));
        }
        return rawData;
    }

    private List<Integer> getPromisingCells(int i) {
        List<Integer> promisingCells = new ArrayList<>();
        for (int place = 0; place < NUMBER_OF_CELLS; place++) {
            if (0 == this.rawData.get(place)) {
                int count = 0;
                for (int digit : DIGITS) {
                    if (this.acceptsNumberInPlace(place, digit)) {
                        count++;
                    }
                }
                if (count == i) {
                    promisingCells.add(place);
                }
            }
        }
        return promisingCells;
    }

    boolean acceptsNumberInPlace(Integer place, int digit) {
        int rowIndex = getRowIndex(place);
        int columnIndex = getColumnIndex(place);
        Row row = (Row) this.getFromCell(ROW, rowIndex, columnIndex);
        Column column = (Column) this.getFromCell(COLUMN, rowIndex, columnIndex);
        Block block = (Block) this.getFromCell(BLOCK, rowIndex, columnIndex);
        if (row.acceptsNumber(digit) && column.acceptsNumber(digit) && block.acceptsNumber(digit)) {
            return true;
        }
        return false;
    }

    private NineNumberPiece getFromCell(String what, int row, int column) {
        switch (what) {
            case ROW:
                return this.rows.get(row);
            case COLUMN:
                return this.columns.get(column);
            case BLOCK:
                int blockRow = row / 3;
                int blockColumn = column / 3;
                return this.blocks.get((blockRow * 3 + blockColumn));
            default:
                throw new IllegalArgumentException("Invalid argument: " + what);
        }
    }

    static int getRowIndex(int rawDataIndex) {
        return rawDataIndex / SIZE;
    }

    static int getColumnIndex(int rawDataIndex) {
        return rawDataIndex % SIZE;
    }

    static int getBlockIndex(int rawDataIndex) {
        int blockRow = getRowIndex(rawDataIndex) / 3;
        int blockColumn = getColumnIndex(rawDataIndex) / 3;
        return blockRow * 3 + blockColumn;
    }
}
