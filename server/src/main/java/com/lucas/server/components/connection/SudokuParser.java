package com.lucas.server.components.connection;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.lucas.server.components.sudoku.Sudoku;

@Service
public class SudokuParser {

    public List<Sudoku> fromString(String content) {
        try {
            List<Sudoku> sudokus = new ArrayList<>();
            String[] lines = content.replace("\\r\\n", "newLine").split("newLine");
            String newRawData = "";
            for (int i = 0; i < lines.length; i++) {
                if (0 == i % 10) {
                    if (!newRawData.equals("")) {
                        sudokus.add(Sudoku.withValues(newRawData.chars()
                                .mapToObj(Character::getNumericValue)
                                .collect(Collectors.toList())));
                    }
                    newRawData = "";
                } else {
                    newRawData = newRawData.concat(lines[i]);
                }
            }
            return sudokus;
        } catch (Exception e) {
            return null;
        }
    }
}
