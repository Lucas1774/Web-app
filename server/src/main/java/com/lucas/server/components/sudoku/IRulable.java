package com.lucas.server.components.sudoku;

import java.util.List;

public interface IRulable {
    
    public boolean acceptsNumber(Integer number);

    public List<Integer> get();

    public void set(int index, Integer number);

}
