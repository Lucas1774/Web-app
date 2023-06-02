package com.lucas.server.components;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

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
        this.jdbcTemplate.update("UPDATE my_table SET ans = (?) WHERE id = 1;", number);
        this.mode = "ans";
    }

    public void insertString(String string) {
        this.jdbcTemplate.update("UPDATE my_table SET text = (?) WHERE id = 1;", string);
        this.mode = "string";
    }
}
