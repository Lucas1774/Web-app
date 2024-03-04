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

    @PostMapping("/ans")
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
    public String handleFileUpload(@RequestBody String file) {
        // TODO: implement
        return "sudokus imported";
    }

    @GetMapping("import/sudoku")
    @ResponseBody
    public String getRandom() {
        return dao.getSudokus().get(new Random().nextInt(dao.getSudokus().size())).serialize();
    }

    @GetMapping("generate/sudoku")
    @ResponseBody
    public String generateRandom(@RequestParam("difficulty") int difficulty) {
        return generator.generate(difficulty).serialize();
    }

    @GetMapping("/solve/sudoku")
    public String solveSudoku(@RequestParam String sudoku) {
        Sudoku s = Sudoku.withValues(Sudoku.deSerialize(sudoku));
        s.solve();
        return s.serialize();
    }
}
