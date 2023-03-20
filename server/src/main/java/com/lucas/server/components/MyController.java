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

    @PostMapping("/ans")
    public String postNumber(@RequestBody String number) {
        final String pattern = "\\d+\\[+-*/]\\d+";
        if (number.equals(pattern)){
            System.out.println("accepted pattern: " + number);
        }
        dao.insert(Integer.parseInt(number));
        return "100";
    }

    @GetMapping("/ans")
    @ResponseBody
    public int getInteger() {
        int number = dao.get();
        return number;
    }
}
