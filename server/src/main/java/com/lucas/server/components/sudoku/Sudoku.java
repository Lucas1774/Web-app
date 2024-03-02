package com.lucas.server.components.sudoku;

import java.util.ArrayList;
import java.util.List;

public class Sudoku implements ISolvable {
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

    @Override
    public boolean isSolved() {
        return !this.rawData.contains(0);
    }

    @Override
    public boolean acceptsNumber(Integer number) {
        for (int i = 0; i < NUMBER_OF_CELLS; i++) {
            if (this.placeNumber(number, i, false, true)) {
                return true;
            }
        }
        return false;
    }

    @Override
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

    @Override
    public Integer get(int i) {
        return this.rawData.get(i);
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

    // TODO: implement regression
    public boolean solve() {
        final long TIMEOUT_MILLISECONDS = 5000;
        long startTime = System.currentTimeMillis();
        while (!this.isSolved()) {
            if (System.currentTimeMillis() - startTime >= TIMEOUT_MILLISECONDS) {
                System.out.println("Timeout reached. Solution not found.");
                return false;
            }
            for (int place = 0; place < NUMBER_OF_CELLS; place++) {
                for (int digit : DIGITS) {
                    this.placeNumber(digit, place, true, true);
                }
            }
        }
        return true;
    }

    public boolean placeNumber(Integer number, int place, boolean onlyIfSure, boolean commit) {
        if (0 == this.rawData.get(place)) {
            int rowIndex = this.getRowIndex(place);
            int columnIndex = this.getColumnIndex(place);
            Row row = (Row) this.getFromCell(ROW, rowIndex, columnIndex);
            Column column = (Column) this.getFromCell(COLUMN, rowIndex, columnIndex);
            Block block = (Block) this.getFromCell(BLOCK, rowIndex, columnIndex);
            if (row.acceptsNumber(number) && column.acceptsNumber(number) && block.acceptsNumber(number)) {
                if (onlyIfSure) {
                    for (int digit : DIGITS) {
                        if (digit != number && row.acceptsNumber(digit) && column.acceptsNumber(digit)
                                && block.acceptsNumber(digit)) {
                            return false;
                        }
                    }
                }
                if (commit) {
                    this.set(place, number);
                }
                return true;
            }
        }
        return false;
    }

    public NineNumberPiece getFromCell(String what, int row, int column) {
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

    public String serialize() {
        return "\"" + this.rawData.toString().replace("[", "").replace("]", "").replaceAll(", ", "") + "\"";
    }

	public static List<Integer> deSerialize(String sudoku) {
        List<Integer> rawData = new ArrayList<Integer>();
        for (char c : sudoku.toCharArray()) {
            rawData.add(Integer.parseInt(String.valueOf(c)));
        }
        return rawData;
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
