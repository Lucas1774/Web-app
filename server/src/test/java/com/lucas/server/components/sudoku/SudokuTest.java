package com.lucas.server.components.sudoku;

import static org.junit.jupiter.api.Assertions.assertEquals;

import java.util.Random;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest
public class SudokuTest {
    @Autowired
    Generator generator;

    @Test
    void testgetFromCell() {
        Sudoku sudoku = generator.generateDefault(1);
        int result = sudoku.getFromCell("block", 0, 0).getIndex();
        assertEquals(0, result);
        result = sudoku.getFromCell("block", 2, 3).getIndex();
        assertEquals(1, result);
        result = sudoku.getFromCell("block", 1, 7).getIndex();
        assertEquals(2, result);
        result = sudoku.getFromCell("block", 4, 2).getIndex();
        assertEquals(3, result);
        result = sudoku.getFromCell("block", 4, 3).getIndex();
        assertEquals(4, result);
        result = sudoku.getFromCell("block", 5, 8).getIndex();
        assertEquals(5, result);
        result = sudoku.getFromCell("block", 6, 2).getIndex();
        assertEquals(6, result);
        result = sudoku.getFromCell("block", 6, 5).getIndex();
        assertEquals(7, result);
        result = sudoku.getFromCell("block", 8, 8).getIndex();
        assertEquals(8, result);

    }

    @Test
    void testFillSudokuAndGetRulables() {
        Sudoku sudoku = generator.generateDefault(4);
        Random random = new Random();
        int randomRow = random.nextInt(9);
        int randomCol = random.nextInt(9);
        System.out.println("Cell " + (randomRow + 1) + ", " + (randomCol + 1));
        System.out.println(sudoku.getFromCell("row", randomRow, randomCol));
        System.out.println(sudoku.getFromCell("column", randomRow, randomCol));
        System.out.println(sudoku.getFromCell("block", randomRow, randomCol));

        randomRow = random.nextInt(9);
        randomCol = random.nextInt(9);
        System.out.println("Cell " + (randomRow + 1) + ", " + (randomCol + 1));
        System.out.println(sudoku.getFromCell("row", randomRow, randomCol));
        System.out.println(sudoku.getFromCell("column", randomRow, randomCol));
        System.out.println(sudoku.getFromCell("block", randomRow, randomCol));

        randomCol = random.nextInt(9);
        randomRow = random.nextInt(9);
        System.out.println("Cell " + (randomRow + 1) + ", " + (randomCol + 1));
        System.out.println(sudoku.getFromCell("row", randomRow, randomCol));
        System.out.println(sudoku.getFromCell("column", randomRow, randomCol));
        System.out.println(sudoku.getFromCell("block", randomRow, randomCol));
    }

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
}
