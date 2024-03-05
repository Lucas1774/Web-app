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

    public Sudoku generateDefault(int difficulty){
        Sudoku sudoku = Sudoku.withDefaultValues();
        this.setDifficulty(sudoku, difficulty);
        return sudoku;
    }

    public Sudoku generate(int difficulty) {
        Sudoku sudoku = null;
        while (null == sudoku) {
            sudoku = doGenerate();
        }
        this.setDifficulty(sudoku, difficulty);
        return sudoku;
    }

    private Sudoku doGenerate() {
        Sudoku sudoku = Sudoku.withZeros();
        List<Integer> digits = new ArrayList<>();
        for (int digit : Sudoku.DIGITS) {
            digits.add(digit);
        }
            Collections.shuffle(digits, random);
        while (!sudoku.isSolved()) {
            for (int place = 0; place < Sudoku.NUMBER_OF_CELLS; place++) {
                boolean success = false;
                for (int digit : digits) {
                    if (sudoku.acceptsNumberInPlace(place, digit)) {
                        sudoku.set(place, digit);
                        Collections.shuffle(digits, random);
                        success = true;
                        break;
                    }
                }
                if (!success) {
                    return null;
                }
            }
        }
        return sudoku;
    }

    private void setDifficulty(Sudoku sudoku, int difficulty) {
        for (int i = 0; i < Sudoku.NUMBER_OF_CELLS; i++) {
            double chanceToFill = (1 - (difficulty / 10.0)) / 1.3;
            if (!this.fills(1 - (chanceToFill))) {
                sudoku.set(i, 0);
            }
        }
    }

    private boolean fills(double chanceToFill) {
        return random.nextDouble() > chanceToFill;
    }
}
