package com.lucas.server.components.sudoku;

import java.util.List;

public class Row extends NineNumberPiece {

    public Row(List<Integer> rawData, int index) {
        super(rawData, index);
        for (int i = 0; i < rawData.size(); i++) {
            if (i / 9 == index) {
                this.rawData.add(rawData.get(i));
            }
        }
    }
}
