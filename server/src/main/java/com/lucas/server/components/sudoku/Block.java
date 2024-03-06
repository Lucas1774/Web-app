package com.lucas.server.components.sudoku;

import java.util.List;

public class Block extends NineNumberPiece {

    public Block(List<Integer> rawData, int index) {
        super(rawData, index);
        for (int place = 0; place < Sudoku.NUMBER_OF_CELLS; place++) {
            if (Sudoku.getBlockIndex(place) == index) {
                this.rawData.add(rawData.get(place));
            }
        }
    }
}
