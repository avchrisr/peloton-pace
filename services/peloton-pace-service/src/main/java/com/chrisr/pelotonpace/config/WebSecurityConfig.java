package com.chrisr.pelotonpace.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.method.configuration.EnableGlobalMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

// This class extends the WebSecurityConfigurerAdapter, which is a convenience class that allows customization to both WebSecurity and HttpSecurity.

@Configuration
@EnableWebSecurity				// the primary spring security annotation that is used to enable web security in a project.
@EnableGlobalMethodSecurity(	// used to enable method level security based on annotations
	securedEnabled = true,		// ref) https://www.callicoder.com/spring-boot-spring-security-jwt-mysql-react-app-part-2/
	jsr250Enabled = true,
	prePostEnabled = true
)
public class WebSecurityConfig extends WebSecurityConfigurerAdapter {

	// WebSecurityConfigurerAdapter provides default security configurations
	// and allows other classes to extend it and customize the security configurations by overriding its methods.

//	private final UserDetailsServiceImpl userDetailsServiceImpl;
//	private final JwtAuthenticationEntryPoint jwtAuthenticationEntryPoint;
//	private final JwtTokenProvider jwtTokenProvider;

//	private static final String[] AUTH_WHITELIST_SWAGGER = {
//		// swagger
//		"/v2/api-docs",
//		"/swagger-ui.html",
//		"/swagger-resources/**",
//		"/webjars/**"
//	};

//	@Autowired
//	public WebSecurityConfig(UserDetailsServiceImpl userDetailsServiceImpl,
//							 JwtAuthenticationEntryPoint jwtAuthenticationEntryPoint,
//							 JwtTokenProvider jwtTokenProvider) {
//		this.userDetailsServiceImpl = userDetailsServiceImpl;
//		this.jwtAuthenticationEntryPoint = jwtAuthenticationEntryPoint;
//		this.jwtTokenProvider = jwtTokenProvider;
//	}

//	@Bean
//	public JwtAuthenticationFilter jwtAuthenticationFilter() {
//		return new JwtAuthenticationFilter(jwtTokenProvider, userDetailsServiceImpl);
//	}

	// I believe this is where the user credential check is configured.
	// AuthenticationManager in AuthRestControllerImpl uses UsernamePasswordAuthenticationToken,
	// which compares the username/password to DB retrieved user object by userDetailServiceImpl.loadUserByUsername()
//	@Override
//	public void configure(AuthenticationManagerBuilder authenticationManagerBuilder) throws Exception {
//		authenticationManagerBuilder
//				.userDetailsService(userDetailsServiceImpl)
//				.passwordEncoder(passwordEncoder());
//	}

//	@Bean(BeanIds.AUTHENTICATION_MANAGER)
//	@Override
//	public AuthenticationManager authenticationManagerBean() throws Exception {
//		return super.authenticationManagerBean();
//	}

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
				// allow ALL urls
				.antMatchers("/**").permitAll()
////				.antMatchers("/templates/**").permitAll()
////				.antMatchers("/peloton/**").permitAll()
//				.antMatchers(
////				        HttpMethod.GET,
//                        "/",
//						"/favicon.ico",
//						"/**/*.png",
//						"/**/*.gif",
//						"/**/*.svg",
//						"/**/*.jpg",
//						"/**/*.html",
//						"/**/*.css",
//						"/**/*.js").permitAll()
//				.antMatchers("/auth/**").permitAll()
//				.antMatchers("/public/**").permitAll()

				// swagger2 endpoints
//				.antMatchers(AUTH_WHITELIST_SWAGGER).permitAll()

//				.antMatchers("/user/checkUsernameAvailability", "/user/checkEmailAvailability").permitAll()
//				.antMatchers(HttpMethod.GET, "/polls/**", "/users/**").permitAll()

				// all other requests need to be authenticated
//				.anyRequest().authenticated()
				.and()

				// unauthorized handler
//				.exceptionHandling().authenticationEntryPoint(jwtAuthenticationEntryPoint)
//				.and()

				// don't create session. (i.e. use stateless session. session won't be used to store user's state)
				.sessionManagement().sessionCreationPolicy(SessionCreationPolicy.STATELESS);

		// Add a filter to validate the JWT tokens with every request
//		httpSecurity.addFilterBefore(jwtAuthenticationFilter(), UsernamePasswordAuthenticationFilter.class);

		// disable page caching
//        httpSecurity.headers().cacheControl();
	}
}
