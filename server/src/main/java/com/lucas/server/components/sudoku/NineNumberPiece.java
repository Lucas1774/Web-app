package com.lucas.server.components.sudoku;

import java.util.List;

public abstract class NineNumberPiece implements IRulable{
    protected List<Integer> rawData;
    protected int index;

    public NineNumberPiece(List<Integer> rawData, int index) {
        this.index = index;
        this.fill(rawData);
    }
}
