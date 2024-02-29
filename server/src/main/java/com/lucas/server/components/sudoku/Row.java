package com.lucas.server.components.sudoku;

import java.util.List;

public class Row extends NineNumberPiece {

    public Row(List<Integer> rawData, int i) {
        super(rawData, i);
    }

    @Override
    public boolean acceptsNumber(Integer number) {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'acceptsNumber'");
    }

    @Override
    public void fill(List<Integer> rawData) {
        for (Integer number : rawData) {
            // TODO: implement logic
            if (number == 0 && this.index == 0) {
                this.rawData.add(number);
            }
        }
    }
}
