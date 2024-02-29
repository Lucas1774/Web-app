package com.lucas.server.components.calculator;

import net.objecthunter.exp4j.Expression;
import net.objecthunter.exp4j.ExpressionBuilder;

public class Solver {
    
    public String solveExpression(String expression) {
        try{
            Double.parseDouble(expression);
            return String.valueOf(Double.parseDouble(expression));
        } catch(NumberFormatException e1){
            try{
                expression = expression.substring(1, expression.length() - 1).replaceAll("\\s+", "");
                Expression exp = new ExpressionBuilder(expression).build();
                return String.valueOf(exp.evaluate());
            } catch (IllegalArgumentException e2){
                return "Invalid expression";
            }
        }
    }
}
    