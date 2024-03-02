package com.lucas.server.components.sudoku;

public interface ISolvable {

    public boolean isSolved();
    
    public boolean acceptsNumber(Integer number);

    public Integer get(int i);

    public void set(int index, Integer number);

}
