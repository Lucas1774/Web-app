package com.lucas.server.components.sudoku;

import java.util.List;

public class Column extends NineNumberPiece {

    public Column(List<Integer> rawData, int i) {
        super(rawData, i);
    }

    @Override
    public void fill(List<Integer> rawData) {
        super.fill(rawData);
        for (int i = 0; i < rawData.size(); i++) {
            if (i % 9 == index) {
                this.rawData.add(rawData.get(i));
            }
        }
    }
}
