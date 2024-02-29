package com.lucas.server.components.sudoku;

import java.util.List;

public class Sudoku {
    private List<Integer> rawData;
    private List<Row> rows;
    private List<Column> columns;
    private List<Block> blocks;

    public Sudoku(List<Integer> list) {
        this.rawData = list;
        this.build();
    }

    public void build() {
        for (int i = 0; i < 9; i++) {
            this.rows.add(new Row(rawData, i));
            this.columns.add(new Column(rawData, i));
            this.blocks.add(new Block(rawData, i));
        }
    }

    public String serialize() {
        return this.rawData.toString();
    }
}
