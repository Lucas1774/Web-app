package com.lucas.server.components;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

@Repository
public class DAO {

    @Autowired
    private JdbcTemplate jdbcTemplate;
    
    public Double get(){
        try{
            Double ans = jdbcTemplate.queryForList("SELECT ans FROM my_table WHERE id = 1", Double.class).get(0);
            return ans;
        }
        catch(IndexOutOfBoundsException e){
            System.out.println(0);
            return 0.0;
        }
    }

    public void insert(Double number) {
        jdbcTemplate.update("UPDATE my_table SET ans = (?) WHERE id = 1;", number);
    }

}
