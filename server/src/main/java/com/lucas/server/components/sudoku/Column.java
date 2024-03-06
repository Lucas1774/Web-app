package com.lucas.server.components.sudoku;

import java.util.List;

public class Column extends NineNumberPiece {

    public Column(List<Integer> rawData, int index) {
        super(rawData, index);
        for (int place = 0; place < Sudoku.NUMBER_OF_CELLS; place++) {
            if (Sudoku.getColumnIndex(place) == index) {
                this.rawData.add(rawData.get(place));
            }
        }
    }
}
