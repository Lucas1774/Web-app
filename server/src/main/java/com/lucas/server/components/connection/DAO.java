package com.lucas.server.components.connection;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.dao.DataAccessException;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import com.lucas.server.components.sudoku.Sudoku;

@Repository
public class DAO {
    private JdbcTemplate jdbcTemplate;
    private String mode = "ans";

    public DAO(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
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

    public String get() {
        try {
            return "ans".equals(mode)
                    ? this.jdbcTemplate.queryForList("CALL get_ans", Double.class).get(0).toString()
                    : this.jdbcTemplate.queryForList("CALL get_text", String.class).get(0);
        } catch (IndexOutOfBoundsException e) {
            return "ans".equals(mode) ? "0" : "";
        } catch (DataAccessException e) {
            e.printStackTrace();
            throw e;
        }
    }

    public void insertSudokus(List<Sudoku> sudokus) {
        try {
            this.jdbcTemplate.batchUpdate("CALL insert_sudoku(?)", sudokus.stream()
                    .map(sudoku -> new Object[] { sudoku.serialize() })
                    .collect(Collectors.toList()));
        } catch (DataAccessException e) {
            e.printStackTrace();
            throw e;
        }
    }

    public List<Sudoku> getSudokus() {
        try {
            return this.jdbcTemplate.query("CALL get_sudokus",
                    (resultSet, rowNum) -> Sudoku.withValues(resultSet.getString("state").replace("\"", "")
                            .chars()
                            .map(Character::getNumericValue)
                            .toArray()));
        } catch (DataAccessException e) {
            e.printStackTrace();
            throw e;
        }
    }
}
