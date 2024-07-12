package com.lucas.server.components;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

@Repository
public class DAO {

    @Autowired
    private JdbcTemplate jdbcTemplate;
    
    public Integer get(){
        try{
            Integer ans = jdbcTemplate.queryForList("SELECT ans FROM my_table WHERE id = (SELECT MAX(id) FROM my_table);", Integer.class).get(0);
            jdbcTemplate.execute("DELETE FROM my_table ORDER BY id DESC LIMIT 1;");
            return ans;
        }
        catch(IndexOutOfBoundsException e){
            System.out.println(0);
            return 0;
        }
    }

    public void insert(int number) {
        jdbcTemplate.update("INSERT INTO my_table (ans) VALUES (?);", number);
    }

}
