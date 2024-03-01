package com.lucas.server.components.sudoku;

import java.util.List;

public class Column extends NineNumberPiece {

    public Column(List<Integer> rawData, int index) {
        super(rawData, index);
        for (int i = 0; i < rawData.size(); i++) {
            if (i % 9 == index) {
                this.rawData.add(rawData.get(i));
            }
        }
    }
}
