package com.lucas.server.components.connection;

import java.util.List;
import java.util.Random;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.lucas.server.components.calculator.Solver;
import com.lucas.server.components.sudoku.Generator;
import com.lucas.server.components.sudoku.Sudoku;

@RestController
@RequestMapping("/api")
public class Controller {

    @Autowired
    private DAO dao;
    @Autowired
    private Generator generator;
    @Autowired
    private Solver solver;
    @Autowired
    private SudokuParser sudokuParser;

    @PostMapping("/ans")
    @ResponseBody
    public String post(@RequestBody String number) {
        try {
            String result = solver.solveExpression(number);
            if (result != "Invalid expression") {
                dao.insert(Double.parseDouble(result));
            } else {
                dao.insertString(number);
            }
            return result;
        } catch (NumberFormatException e) {
            e.printStackTrace();
            return "Invalid expression";
        }
    }

    @GetMapping("/ans")
    @ResponseBody
    public String get() {
        try {
            return dao.get();
        } catch (Exception e) {
            e.printStackTrace();
            return "Invalid expression";
        }
    }

    @PostMapping("/upload/sudokus")
    @ResponseBody
    public String handleFileUpload(@RequestBody String file) {
        try {
            sudokuParser.fromString(file.replace("\"", "")).forEach(dao::insertSudoku);
            return "1";
        } catch (Exception e) {
            e.printStackTrace();
            return "0";
        }
    }

    @GetMapping("fetch/sudoku")
    @ResponseBody
    public String getRandom() {
        try {
            List<Sudoku> sudokus = dao.getSudokus();
            return sudokus.get(new Random().nextInt(sudokus.size())).serialize();
        } catch (Exception e) {
            e.printStackTrace();
            return "";
        }
    }

    @GetMapping("generate/sudoku")
    @ResponseBody
    public String generateRandom(@RequestParam("difficulty") int difficulty) {
        try {
            return generator.generate(difficulty).serialize();
        } catch (Exception e) {
            e.printStackTrace();
            return "";
        }
    }

    @GetMapping("/solve/sudoku")
    @ResponseBody
    public String solveSudoku(@RequestParam String sudoku) {
        try {
            Sudoku s = Sudoku.withValues(Sudoku.deserialize(sudoku));
            s.solve();
            return s.serialize();
        } catch (Exception e) {
            e.printStackTrace();
            return "";
        }
    }

    @GetMapping("/check/sudoku")
    @ResponseBody
    public String checkSudoku(@RequestParam String initialSudoku, @RequestParam String currentSudoku) {
        try {
            Sudoku s = Sudoku.withValues(Sudoku.deserialize(initialSudoku));
            s.solve();
            String serialized = s.serialize().replaceAll("\"", "");
            String solvable = "1";
            for (int i = 0; i < Sudoku.NUMBER_OF_CELLS; i++) {
                if (currentSudoku.charAt(i) != '0' && serialized.charAt(i) != currentSudoku.charAt(i)) {
                    solvable = "0";
                    break;
                }
            }
            return solvable;
        } catch (Exception e) {
            e.printStackTrace();
            return "0";
        }
    }
}
