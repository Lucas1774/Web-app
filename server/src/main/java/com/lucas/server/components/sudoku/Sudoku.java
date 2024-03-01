package com.lucas.server.components.sudoku;

import java.util.ArrayList;
import java.util.List;

public class Sudoku implements IRulable {
    private static final String ROW = "row";
    private static final String COLUMN = "column";
    private static final String BLOCK = "block";
    private List<Integer> rawData;
    private List<Row> rows;
    private List<Column> columns;
    private List<Block> blocks;

    public Sudoku() {
        this.rawData = new ArrayList<Integer>();
        this.rows = new ArrayList<Row>();
        this.columns = new ArrayList<Column>();
        this.blocks = new ArrayList<Block>();
    }

    @Override
    public boolean acceptsNumber(Integer number) {
        return this.acceptsNumber(number, false);
    }

    @Override
    public void fill(List<Integer> rawData) {
        this.rawData = rawData;
        for (int i = 0; i < 9; i++) {
            this.rows.add(new Row(rawData, i));
            this.columns.add(new Column(rawData, i));
            this.blocks.add(new Block(rawData, i));
        }
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

    public void solve() {
        while (this.rawData.contains(0)) {
            int i = 0;
            while (i < 10) {
                this.acceptsNumber(i, true);
                i++;
            }
        }
    }

    private boolean acceptsNumber(Integer number, boolean commit) {
        int cell;
        for (int i = 0; i < this.rawData.size(); i++) {
            cell = this.rawData.get(i);
            if (0 == cell) {
                int rowIndex = this.getRowIndex(cell);
                int columnIndex = this.getColumnIndex(cell);
                Row row = (Row) this.getFromCell(ROW, rowIndex, columnIndex);
                Column column = (Column) this.getFromCell(COLUMN, rowIndex, columnIndex);
                Block block = (Block) this.getFromCell(BLOCK, rowIndex, columnIndex);
                if (row.acceptsNumber(number) && column.acceptsNumber(number) && block.acceptsNumber(number)) {
                    if (commit) {
                        // for (int j = 1; j <= 9; j++) {
                        //     if (number != j && this.acceptsNumber(j)) {
                        //         return false;
                        //     }
                        // }
                        this.set(i, number);
                        System.out.println(this);
                        return true;
                    } else {
                        return true;
                    }
                }
            }
        }
        return false;
    }

    public String serialize() {
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

    public int getRowIndex(int rawDataIndex) {
        return rawDataIndex / 9;
    }

    public int getColumnIndex(int rawDataIndex) {
        return rawDataIndex % 9;
    }

    public int getBlockIndex(int rawDataIndex) {
        int blockRow = this.getRowIndex(rawDataIndex) / 3;
        int blockColumn = this.getColumnIndex(rawDataIndex) / 3;
        return blockRow * 3 + blockColumn;
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
}
