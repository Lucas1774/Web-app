package com.lucas.server.components;

import java.io.IOException;
import java.util.Arrays;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.*;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.*;
import org.springframework.web.filter.CorsFilter;

@Configuration
public class Config {
    @Value("${spring.IPAddress.privateAddress}")
    private String privateAddress;
    @Value("${spring.IPAddress.publicAddress}")
    private String publicAddress;

    @Bean
    public CorsConfigurationSource corsConfigurationSource() throws IOException {

        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(Arrays.asList(
                "http://localhost:3000", "https://localhost:3000",
                "http://" + privateAddress + ":3000", "https://" + privateAddress + ":3000",
                "http://" + publicAddress + ":3000", "https://" + publicAddress + ":3000"));
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE"));
        configuration.setAllowedHeaders(Arrays.asList("Content-Type", "Authorization"));
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }

    @Bean
    @DependsOn("corsConfigurationSource")
    public CorsFilter corsFilter() throws IOException {
        return new CorsFilter(corsConfigurationSource());
    }

    @Bean
    @DependsOn("corsFilter")
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                .csrf()
                .disable()
                .authorizeHttpRequests()
                .anyRequest().authenticated()
                .and()
                .addFilterBefore(corsFilter(), UsernamePasswordAuthenticationFilter.class)
                .httpBasic()
                .and()
                .formLogin();
        return http.build();
    }
}
