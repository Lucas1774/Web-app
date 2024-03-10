package com.lucas.server.components.sudoku;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest
public class SudokuTest {
    private static final int NUM_RUNS = 1000;
    @Autowired
    Generator generator;

    @Test
    public void testSolve() {
        Sudoku sudoku = generator.generate(7);
        System.out.println(sudoku);
        sudoku.solve();
        System.out.println(sudoku);
    }

    @Test
    public void testGenerate() {
        Sudoku sudoku = generator.generate(5);
        System.out.println(sudoku);
    }

    @Test
    public void benchmark() {
        double totalDuration = 0;
        for (int i = 0; i < NUM_RUNS; i++) {
            int difficulty = (int) (Math.random() * Sudoku.SIZE) + 1;
            Sudoku sudoku = generator.generate(difficulty);
            long startTime = System.nanoTime();
            sudoku.solve();
            long endTime = System.nanoTime();
            totalDuration += (endTime - startTime);
        }
        double averageDuration = totalDuration / NUM_RUNS / 1000000;
        System.out.println("Average time taken to solve: " + averageDuration + " milliseconds");
    }
}
