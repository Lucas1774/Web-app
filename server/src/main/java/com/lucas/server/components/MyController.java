package com.lucas.server.components;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
public class MyController {
    
    @Autowired
    private DAO dao;

    private Solver solver = new Solver();

    @PostMapping("/ans")
    public String postNumber(@RequestBody String number) {
        String result = solver.solveExpression(number);
        if (result != "Invalid expression") {
            dao.insert(Double.parseDouble(result));
        }
        return result;
    }

    @GetMapping("/ans")
    @ResponseBody
    public Double getInteger() {
        return dao.get();
    }
}
