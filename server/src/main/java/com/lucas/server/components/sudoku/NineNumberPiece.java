package com.lucas.server.components.sudoku;

import java.util.ArrayList;
import java.util.List;

public abstract class NineNumberPiece implements IRulable {
    protected List<Integer> rawData;
    protected int index;

    public NineNumberPiece(List<Integer> rawData, int index) {
        this.index = index;
        this.rawData = new ArrayList<>();
    }

    public int getIndex() {
        return this.index;
    }

    @Override
    public boolean acceptsNumber(Integer number) {
        return !this.rawData.contains(number);
    }

    @Override
    public String toString() {
        return this.getClass().getSimpleName() + " = " + rawData;
    }

    @Override
    public List<Integer> get() {
        return this.rawData;
    }

    @Override
    public void set(int index, Integer number) {
        this.rawData.set(index, number)        ;
    }

}
