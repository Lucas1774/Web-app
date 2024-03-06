package com.lucas.server.components.sudoku;

import java.util.List;

public class Row extends NineNumberPiece {

    public Row(List<Integer> rawData, int index) {
        super(rawData, index);
        for (int place = 0; place < Sudoku.NUMBER_OF_CELLS; place++) {
            if (Sudoku.getRowIndex(place) == index) {
                this.rawData.add(rawData.get(place));
            }
        }
    }
}
