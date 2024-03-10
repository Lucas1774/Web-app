package com.lucas.server.components.sudoku;

import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Random;
import java.util.Collections;

@Service
public class Generator {
    private Random random;

    public Generator() {
        this.random = new Random();
    }

    public Sudoku generateDefault(int difficulty) {
        Sudoku sudoku = Sudoku.withDefaultValues();
        this.setDifficulty(sudoku, difficulty);
        return sudoku;
    }

    public Sudoku generate(int difficulty) {
        Sudoku sudoku = Sudoku.withZeros();
        this.doGenerate(sudoku);
        this.setDifficulty(sudoku, difficulty);
        return sudoku;
    }

    public boolean doGenerate(Sudoku sudoku) {
        List<Integer> digits = new ArrayList<>(Sudoku.DIGITS);
        for (int place = 0; place < Sudoku.NUMBER_OF_CELLS; place++) {
            if (sudoku.get().get(place) == 0) {
                Collections.shuffle(digits, random);
                for (int digit : digits) {
                    if (sudoku.acceptsNumberInPlace(place, digit)) {
                        sudoku.set(place, digit);
                        if (doGenerate(sudoku)) {
                            return true;
                        }
                        sudoku.set(place, 0);
                    }
                }
                return false;
            }
        }
        return true;
    }

    private void setDifficulty(Sudoku sudoku, int difficulty) {
        int cellsToSetToZero = (int) (Sudoku.NUMBER_OF_CELLS - (17 + ((9 - difficulty) * 6)));
        List<Integer> possibleCells = new ArrayList<>();
        for (int i = 0; i < Sudoku.NUMBER_OF_CELLS; i++) {
            possibleCells.add(i);
        }
        List<Integer> digits = new ArrayList<>(Sudoku.DIGITS);
        Collections.shuffle(digits, random);
        for (int i = 0; i < digits.size() - 1; i++) {
            boolean success = false;
            while (!success) {
                int randomCellIndex = random.nextInt(possibleCells.size());
                if (digits.get(i) == sudoku.get().get(possibleCells.get(randomCellIndex))) {
                    possibleCells.remove(randomCellIndex);
                    success = true;
                }
            }
        }
        for (int i = 0; i < cellsToSetToZero; i++) {
            int randomCellIndex = random.nextInt(possibleCells.size());
            sudoku.set(possibleCells.get(randomCellIndex), 0);
            possibleCells.remove(randomCellIndex);
        }
    }
}
