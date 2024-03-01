package com.lucas.server.components.sudoku;

import java.util.ArrayList;
import java.util.List;

public class Sudoku implements ISolvable {
    private static final String ROW = "row";
    private static final String COLUMN = "column";
    private static final String BLOCK = "block";
    private List<Integer> rawData;
    private List<Row> rows;
    private List<Column> columns;
    private List<Block> blocks;

    public Sudoku(List<Integer> values) {
        this.rawData = new ArrayList<Integer>(values);
        this.rows = new ArrayList<Row>();
        this.columns = new ArrayList<Column>();
        this.blocks = new ArrayList<Block>();
        for (int i = 0; i < 9; i++) {
            this.rows.add(new Row(rawData, i));
            this.columns.add(new Column(rawData, i));
            this.blocks.add(new Block(rawData, i));
        }
    }

    @Override
    public boolean isSolved() {
        return !this.rawData.contains(0);
    }

    @Override
    public boolean acceptsNumber(Integer number) {
        for (int i = 0; i < this.rawData.size(); i++) {
            if (this.placeNumber(number, i, true)) {
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
        int blockRow = rowIndex / 3;
        int blockColumn = columnIndex / 3;
        this.blocks.get(blockIndex).set(blockRow * 3 + blockColumn, number);
    }

    @Override
    public List<Integer> get() {
        return this.rawData;
    }

    @Override
    public String toString() {
        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < 9; i++) {
            if (i % 3 == 0)
                sb.append("+-------+-------+-------+\n");
            for (int j = 0; j < 9; j++) {
                if (j % 3 == 0)
                    sb.append("| ");
                sb.append(this.rawData.get(i * 9 + j)).append(' ');
            }
            sb.append("|\n");
        }
        sb.append("+-------+-------+-------+\n");
        return sb.toString();
    }

    // TODO: implement regression
    public void solve() {
        while (this.rawData.contains(0)) {
            for (int place = 0; place < this.rawData.size(); place++) {
                for (int number = 1; number <= 0; number++) {
                    this.placeNumber(number, place, true);
                }
            }
        }
    }

    private boolean placeNumber(Integer number, int place, boolean commit) {
        if (0 == this.rawData.get(place)) {
            int rowIndex = this.getRowIndex(place);
            int columnIndex = this.getColumnIndex(place);
            Row row = (Row) this.getFromCell(ROW, rowIndex, columnIndex);
            Column column = (Column) this.getFromCell(COLUMN, rowIndex, columnIndex);
            Block block = (Block) this.getFromCell(BLOCK, rowIndex, columnIndex);
            if (row.acceptsNumber(number) && column.acceptsNumber(number) && block.acceptsNumber(number)) {
                if (commit) {
                    this.set(place, number);
                }
                return true;
            }
        }
        return false;
    }

    public String serialize() {
        // TODO: implement
        return this.rawData.toString();
    }

    public NineNumberPiece getFromCell(String what, int row, int column) {
        switch (what) {
            case ROW:
                return this.rows.get(row);
            case COLUMN:
                return this.columns.get(column);
            case BLOCK:
                int blockRow = (int) (row / 3);
                int blockColumn = (int) (column / 3);
                return this.blocks.get((blockRow * 3 + blockColumn));
            default:
                throw new IllegalArgumentException("Invalid argument: " + what);
        }
    }

    private int getRowIndex(int rawDataIndex) {
        return rawDataIndex / 9;
    }

    private int getColumnIndex(int rawDataIndex) {
        return rawDataIndex % 9;
    }

    private int getBlockIndex(int rawDataIndex) {
        int blockRow = this.getRowIndex(rawDataIndex) / 3;
        int blockColumn = this.getColumnIndex(rawDataIndex) / 3;
        return blockRow * 3 + blockColumn;
    }
}
