package com.lucas.server.components.connection;

import java.io.File;
import java.util.Random;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.lucas.server.components.calculator.Solver;

@RestController
@RequestMapping("/api")
public class Controller {
    
    @Autowired
    private DAO dao;
    private Solver solver = new Solver();

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
    public String handleFileUpload(@RequestParam("file") File file) {
        // TODO: implement
        return "sudokus imported";
    }

    @GetMapping("/sudoku")
    @ResponseBody
    public String getRandom() {
        return dao.getSudokus().get(new Random().nextInt(dao.getSudokus().size())).serialize();
    }
}
