package com.lucas.server.components.connection;

import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Service;

import com.lucas.server.components.sudoku.Sudoku;

@Service
public class SudokuParser {

    /**
     * Dumps a string representing sudoku into a list of sudoku
     * The string is expected to have ten lines per sudoku, with the first one's
     * content being irrelevant
     * It is necessary to escape two backslashes: one for regex one for String
     * 
     * @param content the string to parse
     */
    public List<Sudoku> fromString(String content) {
        try {
            List<Sudoku> sudokus = new ArrayList<>();
            String[] lines = content.split("\\\\r\\\\n|\\\\r|\\\\n");
            String newRawData = "";
            for (int i = 0; i < lines.length; i++) {
                if (0 == i % 10) {
                    if (!newRawData.equals("")) {
                        sudokus.add(Sudoku.withValues(newRawData.chars()
                                .map(Character::getNumericValue)
                                .toArray()));
                    }
                    newRawData = "";
                } else {
                    newRawData = newRawData.concat(lines[i]);
                }
            }
            sudokus.add(Sudoku.withValues(newRawData.chars()
                    .map(Character::getNumericValue)
                    .toArray()));
            return sudokus;
        } catch (Exception e) {
            return null;
        }
    }
}
