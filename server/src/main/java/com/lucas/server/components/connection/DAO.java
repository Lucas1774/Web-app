package com.lucas.server.components.connection;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.dao.DataAccessException;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import com.lucas.server.components.sudoku.Sudoku;

@Repository
public class DAO {

    private String schemaName;
    private JdbcTemplate jdbcTemplate;

    public DAO(JdbcTemplate jdbcTemplate, @Value("${spring.datasource.url}") String datasourceUrl) {
        this.jdbcTemplate = jdbcTemplate;
        this.schemaName = this.extractSchemaFromUrl(datasourceUrl);
    }

    public void insert(Double number) {
        try {
            this.jdbcTemplate.update("{call " + sanitizePorcedureName("update_ans") + "(?)}", String.valueOf(number));
        } catch (DataAccessException e) {
            e.printStackTrace();
        }
    }

    public void insertString(String string) {
        try {
            this.jdbcTemplate.update("{call " + sanitizePorcedureName("update_text") + "(?)" + "}", string);
        } catch (DataAccessException e) {
            e.printStackTrace();
        }
    }

    public String get() {
        try {
            return this.jdbcTemplate.queryForObject("{call " + sanitizePorcedureName("get_calculator_data") + "}",
                    (rs, rowNum) -> rs.getBoolean("text_mode")
                            ? Optional.ofNullable(rs.getString("text")).orElse("Nothing here yet")
                            : Optional.ofNullable(rs.getString("ans")).orElse(String.valueOf(0)));
        } catch (DataAccessException e) {
            e.printStackTrace();
            throw e;
        }
    }

    public void insertSudokus(List<Sudoku> sudokus) {
        try {
            this.jdbcTemplate.batchUpdate("{call " + sanitizePorcedureName("insert_sudoku") + "(?) }",
                    sudokus.stream()
                            .map(sudoku -> new Object[] { sudoku.serialize() })
                            .collect(Collectors.toList()));
        } catch (DataAccessException e) {
            e.printStackTrace();
            throw e;
        }
    }

    public List<Sudoku> getSudokus() {
        try {
            return this.jdbcTemplate.query("{call " + sanitizePorcedureName("get_sudokus") + "}",
                    (resultSet, rowNum) -> Sudoku.withValues(resultSet.getString("state").replace("\"", "")
                            .chars()
                            .map(Character::getNumericValue)
                            .toArray()));
        } catch (DataAccessException e) {
            e.printStackTrace();
            throw e;
        }
    }

    private String extractSchemaFromUrl(String url) {
        String[] parts = url.split(";database=");
        if (parts.length > 1) {
            return parts[1].split(";")[0];
        } else {
            return null;
        }
    }

    private String sanitizePorcedureName(String procName) {
        if (this.schemaName == null) {
            return procName;
        } else {
            return this.schemaName + "." + procName;
        }
    }
}
