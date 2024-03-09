package com.lucas.server.components.connection;

import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Service;

import com.lucas.server.components.sudoku.Sudoku;

@Service
public class SudokuParser {

    public List<Sudoku> fromString(String content) {
        List<Sudoku> sudokus = new ArrayList<>();
        String[] lines = content.replace("\\r\\n", "newLine").split("newLine");
        String newRawData = "";
        for (int i = 0; i < lines.length; i++) {
            if (0 == i % 10) {
                if (!newRawData.equals("")) {
                    sudokus.add(Sudoku.withValues(newRawData.chars()
                            .map(Character::getNumericValue)
                            .collect(ArrayList::new, ArrayList::add, ArrayList::addAll)));
                }
                newRawData = "";
            } else {
                newRawData = newRawData.concat(lines[i]);
            }
        }
        return sudokus;
    }
}
