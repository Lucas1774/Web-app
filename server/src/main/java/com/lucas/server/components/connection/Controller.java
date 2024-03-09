package com.lucas.server.components.connection;

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
        String result = solver.solveExpression(number);
        if (result != "Invalid expression") {
            dao.insert(Double.parseDouble(result));
        } else {
            dao.insertString(number);
        }
        return result;
    }

    @GetMapping("/ans")
    @ResponseBody
    public String get() {
        return dao.get();
    }

    @PostMapping("/upload/sudoku")
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

    @GetMapping("import/sudoku")
    @ResponseBody
    public String getRandom() {
        // TODO: implement
        return dao.getSudokus().get(new Random().nextInt(dao.getSudokus().size())).serialize();
    }

    @GetMapping("generate/sudoku")
    @ResponseBody
    public String generateRandom(@RequestParam("difficulty") int difficulty) {
        return generator.generate(difficulty).serialize();
    }

    @GetMapping("/solve/sudoku")
    @ResponseBody
    public String solveSudoku(@RequestParam String sudoku) {
        Sudoku s = Sudoku.withValues(Sudoku.deSerialize(sudoku));
        s.solve();
        return s.serialize();
    }

    @GetMapping("/check/sudoku")
    @ResponseBody
    public String checkSudoku(@RequestParam String initialSudoku, @RequestParam String currentSudoku) {
        Sudoku s = Sudoku.withValues(Sudoku.deSerialize(initialSudoku));
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
    }
}
