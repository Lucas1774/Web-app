package com.lucas.server.components.sudoku;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;

import java.util.Random;
import java.util.stream.IntStream;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest
public class SudokuTest {
    private static final int NUM_RUNS = 100000;
    private static final Random random = new Random();
    @Autowired
    Generator generator;

    @Test
    public void Solve() {
        for (int i = 0; i < NUM_RUNS; i++) {
            Sudoku sudoku = generator.generate(random.nextInt(Sudoku.SIZE) + 1);
            sudoku.solve();
            assertTrue(sudoku.isSolved());
        }
    }

    @Test
    public void GenerationConstrains() {
        for (int i = 0; i < NUM_RUNS; i++) {
            int difficulty = random.nextInt(Sudoku.SIZE) + 1;
            Sudoku sudoku = generator.generate(difficulty);
            assertEquals(17 + ((9 - difficulty) * 6), sudoku.get().stream().filter(cell -> cell != 0).count());
            assertTrue(IntStream.rangeClosed(1, 9)
                    .filter(digit -> sudoku.get().contains(digit))
                    .count() >= 8);
        }
    }

    @Test
    public void benchmark() {
        double totalGenerationDuration = 0;
        double totalDuration = 0;
        for (int i = 0; i < NUM_RUNS; i++) {
            int difficulty = random.nextInt(Sudoku.SIZE) + 1;
            long generationStartTime = System.nanoTime();
            Sudoku sudoku = generator.generate(difficulty);
            long startTime = System.nanoTime();
            sudoku.solve();
            long endTime = System.nanoTime();
            totalGenerationDuration += (startTime - generationStartTime);
            totalDuration += (endTime - startTime);
        }
        double averageGenerationDuration = totalGenerationDuration / NUM_RUNS / 1000000;
        double averageDuration = totalDuration / NUM_RUNS / 1000000;
        System.out.println("Average time taken to generate: " + averageGenerationDuration + " milliseconds");
        System.out.println("Average time taken to solve: " + averageDuration + " milliseconds");
    }
}
