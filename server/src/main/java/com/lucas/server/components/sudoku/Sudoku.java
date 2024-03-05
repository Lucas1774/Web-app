package com.lucas.server.components.sudoku;

import java.util.ArrayList;
import java.util.List;

public class Sudoku {
    public static final int SIZE = 9;
    public static final int[] DIGITS = { 1, 2, 3, 4, 5, 6, 7, 8, 9 };
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
            rawData.add(((i % 9) + 3 * (i / 9) + (i / 27)) % 9 + 1);
        }
        return new Sudoku(rawData);
    }

    public boolean isSolved() {
        return !this.rawData.contains(0);
    }

    public void set(int cell, Integer number) {
        int rowIndex = this.getRowIndex(cell);
        int columnIndex = this.getColumnIndex(cell);
        int blockIndex = this.getBlockIndex(cell);
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
        int maxDepth = 4;
        while (!this.isSolved()) {
            this.solve(maxDepth);
            maxDepth++;
        }
    }

    public boolean solve(int maxDepth) {
        if (this.isSolved()) {
            return true;
        }
        if (!this.getPromisingCells(0).isEmpty()) {
            return false;
        }
        this.fillTrivial();
        if (this.isSolved()) {
            return true;
        }
        for (int i = 2; i < maxDepth; i++) {
            List<Integer> promisingCells = this.getPromisingCells(i);
            if (!promisingCells.isEmpty()) {
                for (int promisingCell : promisingCells) {
                    for (int digit : DIGITS) {
                        if (this.acceptsNumberInPlace(promisingCell, digit)) {
                            Sudoku sudoku = Sudoku.withValues(this.rawData);
                            sudoku.set(promisingCell, digit);
                            if (sudoku.solve(maxDepth--)) {
                                this.rawData = sudoku.rawData;
                                return true;
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

    public static List<Integer> deSerialize(String sudoku) {
        List<Integer> rawData = new ArrayList<Integer>();
        for (char c : sudoku.toCharArray()) {
            rawData.add(Character.getNumericValue(c));
        }
        return rawData;
    }

    private void fillTrivial() {
        boolean changesMade = true;
        while (changesMade) {
            List<Integer> promisingCells = this.getPromisingCells(1);
            changesMade = false;
            if (!promisingCells.isEmpty()) {
                for (int promisingCell : promisingCells) {
                    for (int digit : DIGITS) {
                        if (this.acceptsNumberInPlace(promisingCell, digit)) {
                            this.set(promisingCell, digit);
                            changesMade = true;
                            break;
                        }
                    }
                }
            }
        }
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
        if (0 == this.rawData.get(place)) {
            int rowIndex = this.getRowIndex(place);
            int columnIndex = this.getColumnIndex(place);
            Row row = (Row) this.getFromCell(ROW, rowIndex, columnIndex);
            Column column = (Column) this.getFromCell(COLUMN, rowIndex, columnIndex);
            Block block = (Block) this.getFromCell(BLOCK, rowIndex, columnIndex);
            if (row.acceptsNumber(digit) && column.acceptsNumber(digit) && block.acceptsNumber(digit)) {
                return true;
            }
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

    private int getRowIndex(int rawDataIndex) {
        return rawDataIndex / SIZE;
    }

    private int getColumnIndex(int rawDataIndex) {
        return rawDataIndex % SIZE;
    }

    private int getBlockIndex(int rawDataIndex) {
        int blockRow = this.getRowIndex(rawDataIndex) / 3;
        int blockColumn = this.getColumnIndex(rawDataIndex) / 3;
        return blockRow * 3 + blockColumn;
    }
}
