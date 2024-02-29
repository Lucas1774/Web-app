package com.lucas.server.components.connection;

import java.util.List;
import java.util.stream.Collectors;
import java.util.Arrays;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import com.lucas.server.components.sudoku.Sudoku;

import jakarta.annotation.PostConstruct;

@Repository
public class DAO {

    @Autowired
    private JdbcTemplate jdbcTemplate;
    private String mode = "ans";

    public String get() {
        if (mode == "ans") {
            try {
                Double ans = this.jdbcTemplate.queryForList("CALL get_ans", Double.class).get(0);
                return ans.toString();
            } catch (IndexOutOfBoundsException e) {
                return "0";
            }
        } else {
            try {
                String text = this.jdbcTemplate.queryForList("CALL get_text", String.class).get(0);
                return text;
            } catch (IndexOutOfBoundsException e) {
                return "";
            }
        }
    }

    public void insert(Double number) {
        this.jdbcTemplate.update("CALL update_ans(?)", number);
        this.mode = "ans";
    }

    public void insertString(String string) {
        this.jdbcTemplate.update("CALL update_text(?)", string);
        this.mode = "string";
    }

    @PostConstruct
    public List<Sudoku> getSudokus() {
        // TODO: fix split
        // TODO: impelemnt sql function
        List<Sudoku> sudokus = this.jdbcTemplate.query("CALL get_sudokus", (resultSet, rowNum) -> {
            return new Sudoku(Arrays.stream(resultSet.getString("raw").split(""))
                    .map(Integer::parseInt)
                    .collect(Collectors.toList()));
        });
        return sudokus;
    }
}
