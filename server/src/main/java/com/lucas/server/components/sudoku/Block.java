package com.lucas.server.components.sudoku;

import java.util.List;

public class Block extends NineNumberPiece {

    public Block(List<Integer> rawData, int i) {
        super(rawData, i);
    }

    @Override
    public boolean acceptsNumber(Integer number) {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'acceptsNumber'");
    }

    @Override
    public void fill(List<Integer> rawData) {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'fill'");
    }
    
}
