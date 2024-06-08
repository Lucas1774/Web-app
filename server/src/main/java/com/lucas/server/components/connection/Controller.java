package com.lucas.server.components.connection;

import java.util.List;
import java.util.Random;
import java.util.stream.Collectors;

import org.springframework.dao.DataAccessException;
import org.springframework.web.bind.annotation.*;

import com.lucas.server.components.calculator.Solver;
import com.lucas.server.components.sudoku.Generator;
import com.lucas.server.components.sudoku.Sudoku;

@RestController
@RequestMapping("/api")
public class Controller {
    private DAO dao;
    private Generator generator;
    private Solver solver;
    private SudokuParser sudokuParser;

    public Controller(DAO dao, Generator generator, Solver solver, SudokuParser sudokuParser) {
        this.dao = dao;
        this.generator = generator;
        this.solver = solver;
        this.sudokuParser = sudokuParser;
    }

    @PostMapping("/ans")
    public String post(@RequestBody String number) {
        String result = solver.solveExpression(number);
        if (!"Invalid expression".equals(result)) {
            dao.insert(Double.parseDouble(result));
        } else {
            dao.insertString(number);
        }
        return result;
    }

    @GetMapping("/ans")
    public String get() {
        try {
            return dao.get();
        } catch (DataAccessException e) {
            return e.getMessage();
        }
    }

    @PostMapping("/upload/sudokus")
    public String handleFileUpload(@RequestBody String file) {
        try {
            List<Sudoku> sudokus = sudokuParser.fromString(file.replace("\"", "")).stream()
                    .filter(s -> {
                        Sudoku copy = Sudoku.withValues(s.get());
                        return s.isValid(-1) && copy.solveWithTimeout();
                    })
                    .collect(Collectors.toList());
            if (!sudokus.isEmpty()) {
                dao.insertSudokus(sudokus);
                return "1";
            } else {
                return "No sudokus were inserted";
            }
        } catch (DataAccessException e) {
            return e.getMessage();
        }
    }

    @GetMapping("fetch/sudoku")
    public String getRandom() {
        try {
            List<Sudoku> sudokus = dao.getSudokus();
            if (sudokus.isEmpty()) {
                return "No sudokus found";
            } else {
                return sudokus.get(new Random().nextInt(sudokus.size())).serialize();
            }
        } catch (DataAccessException e) {
            e.printStackTrace();
            return e.getMessage();
        }
    }

    @GetMapping("generate/sudoku")
    public String generateRandom(@RequestParam("difficulty") int difficulty) {
        if (difficulty < 1 || difficulty > 9) {
            return "Invalid difficulty";
        } else {
            return generator.generate(difficulty).serialize();
        }
    }

    @GetMapping("/solve/sudoku")
    public String solveSudoku(@RequestParam String sudoku) {
        int[] values = Sudoku.deserialize(sudoku);
        if (0 == values.length) {
            return "Invalid sudoku";
        } else {
            Sudoku s = Sudoku.withValues(values);
            if (!s.isValid(-1)) {
                return "Sudoku might have more than one solution";
            } else {
                if (!s.solveWithTimeout()) {
                    return "Unsolvable sudoku";
                } else {
                    return s.serialize();
                }
            }
        }
    }

    @GetMapping("/check/sudoku")
    public String checkSudoku(@RequestParam String initialSudoku, @RequestParam String currentSudoku) {
        int[] values = Sudoku.deserialize(initialSudoku);
        if (0 == values.length) {
            return "Invalid sudoku";
        } else {
            Sudoku s = Sudoku.withValues(values);
            if (!s.isValid(-1)) {
                return "Sudoku might have more than one solution";
            } else {
                if (!s.solveWithTimeout()) {
                    return "Unsolvable sudoku";
                } else {
                    String serialized = s.serialize().replace("\"", "");
                    String solvable = "1";
                    for (int i = 0; i < Sudoku.NUMBER_OF_CELLS; i++) {
                        if (currentSudoku.charAt(i) != '0' && serialized.charAt(i) != currentSudoku.charAt(i)) {
                            solvable = "0";
                            break;
                        }
                    }
                    return solvable;
                }
            }
        }
    }
}
