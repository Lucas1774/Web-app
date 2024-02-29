package com.lucas.server.components.sudoku;

import java.util.List;

public interface IRulable {
    
    public boolean acceptsNumber(Integer number);

    public void fill(List<Integer> rawData);
}
