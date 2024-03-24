package com.lucas.server.components.connection;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataAccessException;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import com.lucas.server.components.sudoku.Sudoku;

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
        try {
            this.jdbcTemplate.update("CALL update_ans(?)", number);
            this.mode = "ans";
        } catch (DataAccessException e) {
            e.printStackTrace();
        }
    }

    public void insertString(String string) {
        try {
            this.jdbcTemplate.update("CALL update_text(?)", string);
            this.mode = "string";
        } catch (DataAccessException e) {
            e.printStackTrace();
        }
    }

    public void insertSudoku(Sudoku sudoku) {
        try {
            this.jdbcTemplate.update("CALL insert_sudoku(?)", sudoku.serialize());
        } catch (DataAccessException e) {
            e.printStackTrace();
        }
    }

    public List<Sudoku> getSudokus() {
        try {
            List<Sudoku> sudokus = this.jdbcTemplate.query("CALL get_sudokus", (resultSet, rowNum) -> {
                return Sudoku.withValues(resultSet.getString("state").replace("\"", "")
                        .chars()
                        .map(Character::getNumericValue)
                        .toArray());
            });
            return sudokus;
        } catch (DataAccessException e) {
            e.printStackTrace();
            return null;
        }
    }
}
