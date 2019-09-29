package com.chrisr.userservice.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.method.configuration.EnableGlobalMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
@EnableWebSecurity              // the primary spring security annotation that is used to enable web security in a project.
@EnableGlobalMethodSecurity(    // used to enable method level security based on annotations
    securedEnabled = true,		// ref) https://www.callicoder.com/spring-boot-spring-security-jwt-mysql-react-app-part-2/
    jsr250Enabled = true,
    prePostEnabled = true
)
public class WebSecurityConfig extends WebSecurityConfigurerAdapter {

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Override
    protected void configure(HttpSecurity httpSecurity) throws Exception {
        httpSecurity
                .cors()
                .and()
                .csrf().disable()

                // don't authenticate requests from following URL patterns. (i.e. allow anonymous resource requests)
                .authorizeRequests()
//                // allow ALL urls
				.antMatchers("/**").permitAll()
////				.antMatchers("/templates/**").permitAll()
////				.antMatchers("/peloton/**").permitAll()
//                .antMatchers(
////				        HttpMethod.GET,
//                        "/",
//                        "/favicon.ico",
//                        "/**/*.png",
//                        "/**/*.gif",
//                        "/**/*.svg",
//                        "/**/*.jpg",
//                        "/**/*.html",
//                        "/**/*.css",
//                        "/**/*.js").permitAll()
//                .antMatchers("/auth/**").permitAll()
//                .antMatchers("/public/**").permitAll()
//                .antMatchers("/actuator/**").permitAll()
//                .antMatchers("/users/**").permitAll()
////				.antMatchers("/user/checkUsernameAvailability", "/user/checkEmailAvailability").permitAll()
////				.antMatchers(HttpMethod.GET, "/polls/**", "/users/**").permitAll()
//
////                .anyRequest().authenticated()
                .and()

                // unauthorized handler
//                .exceptionHandling().authenticationEntryPoint(jwtAuthenticationEntryPoint)
//                .and()

                // don't create session. (i.e. use stateless session. session won't be used to store user's state)
                .sessionManagement().sessionCreationPolicy(SessionCreationPolicy.STATELESS);

        // disable page caching
//        httpSecurity.headers().cacheControl();
    }
}
