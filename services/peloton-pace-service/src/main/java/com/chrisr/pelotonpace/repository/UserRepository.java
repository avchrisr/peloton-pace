package com.chrisr.pelotonpace.repository;

import com.chrisr.pelotonpace.exception.AppException;
import com.chrisr.pelotonpace.exception.UserNotFoundException;
import com.chrisr.pelotonpace.repository.entity.User;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.postgresql.util.PGobject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.stereotype.Repository;

import java.io.IOException;
import java.util.List;

@Repository
public class UserRepository extends RepositoryBase {

    private static final Logger logger = LoggerFactory.getLogger(UserRepository.class);
    private static final ObjectMapper objectMapper = new ObjectMapper();

    @Autowired
    public UserRepository(@Qualifier("postgresJdbcTemplate") NamedParameterJdbcTemplate namedParameterJdbcTemplate) {
        super(namedParameterJdbcTemplate);
    }

    public List<User> getUsers() {
        return namedParameterJdbcTemplate.query(GET_USERS_QUERY, new MapSqlParameterSource(), USER_ROW_MAPPER);
    }

    public User getUserById(long id) {
        String errorMessage = String.format("User not found with id = %s", id);

        MapSqlParameterSource params = new MapSqlParameterSource();
        params.addValue("id", id);

        try {
            PGobject pgObject = namedParameterJdbcTemplate.queryForObject(GET_USER_BY_ID_QUERY, params, PGobject.class);
            if (pgObject == null) {
                throw new UserNotFoundException(errorMessage);
            }
            return objectMapper.readValue(pgObject.getValue(), User.class);
        } catch (EmptyResultDataAccessException ex) {
            throw new UserNotFoundException(errorMessage, ex);
        } catch (IOException ex) {
            throw new AppException(ex.getMessage(), ex);
        }
    }

    public User getUserByUsername(String username) {
        MapSqlParameterSource params = new MapSqlParameterSource();
        params.addValue("username", username);

        // TODO: add index on username

        try {
            PGobject pgObject = namedParameterJdbcTemplate.queryForObject(GET_USER_BY_USERNAME_QUERY, params, PGobject.class);
            if (pgObject == null) {
                String errorMessage = String.format("User not found with username = %s", username);
                throw new UserNotFoundException(errorMessage);
            }
            return objectMapper.readValue(pgObject.getValue(), User.class);
        } catch (EmptyResultDataAccessException ex) {
            String errorMessage = String.format("User not found with username = %s", username);
            throw new UserNotFoundException(errorMessage, ex);
        } catch (IOException ex) {
            throw new AppException(ex.getMessage(), ex);
        }
    }

    public boolean existsByUsername(String username) {
        Integer result;

        MapSqlParameterSource params = new MapSqlParameterSource();
        params.addValue("username", username);

        try {
            result = namedParameterJdbcTemplate.queryForObject(USER_EXISTS_BY_USERNAME_QUERY, params, Integer.class);
        } catch (EmptyResultDataAccessException ex) {
            result = null;
        }

        return result != null;
    }

    public void addUser(User user) {
        try {
            MapSqlParameterSource params = new MapSqlParameterSource();
            params.addValue("user", objectMapper.writeValueAsString(user));
            namedParameterJdbcTemplate.update(INSERT_USER_QUERY, params);
        } catch (JsonProcessingException e) {
            throw new AppException(e.getMessage(), e);
        }
    }

    public void updateUserById(long id, User user) {
        // check if user with id exists
        User existingUser = getUserById(id);

        if (user.getPelotonUsername() != null && !user.getPelotonUsername().isBlank()) {
            existingUser.setPelotonUsername(user.getPelotonUsername());
        }
        if (user.getPelotonPassword() != null && !user.getPelotonPassword().isBlank()) {
            existingUser.setPelotonPassword(user.getPelotonPassword());
        }

        if (user.getUsername() != null && !user.getUsername().isBlank()) {
            existingUser.setUsername(user.getUsername());
        }
        if (user.getEmail() != null && !user.getEmail().isBlank()) {
            existingUser.setEmail(user.getEmail());
        }
        if (user.getFirstname() != null && !user.getFirstname().isBlank()) {
            existingUser.setFirstname(user.getFirstname());
        }
        if (user.getLastname() != null && !user.getLastname().isBlank()) {
            existingUser.setLastname(user.getLastname());
        }
        if (user.getDob() != null && !user.getDob().isBlank()) {
            existingUser.setDob(user.getDob());
        }

        // TODO: password change workflow


        try {
            MapSqlParameterSource params = new MapSqlParameterSource();
            params.addValue("user", objectMapper.writeValueAsString(existingUser));
            params.addValue("id", id);
            namedParameterJdbcTemplate.update(UPDATE_USER_QUERY, params);
        } catch (JsonProcessingException e) {
            throw new AppException(e.getMessage(), e);
        }
    }

    public void deleteUserById(long id) {
        // check if user with id exists
        getUserById(id);

        MapSqlParameterSource params = new MapSqlParameterSource();
        params.addValue("id", id);
        namedParameterJdbcTemplate.update(DELETE_USER_BY_ID_QUERY, params);
    }

    // ---------------------------
    // SQL QUERIES AND MAPPERS
    // ---------------------------

    private static final String GET_USERS_QUERY = "SELECT data FROM users";
    private static final String GET_USER_BY_ID_QUERY = "SELECT data FROM users WHERE (data->>'id')::bigint = :id";
    private static final String GET_USER_BY_USERNAME_QUERY = "SELECT data FROM users WHERE data->>'username' = :username";
    private static final String USER_EXISTS_BY_USERNAME_QUERY = "SELECT 1 FROM users WHERE data->>'username' = :username";
    private static final String INSERT_USER_QUERY = "INSERT INTO users (data) VALUES (:user::jsonb)";
    private static final String UPDATE_USER_QUERY = "UPDATE users SET data = (:user::jsonb) WHERE (data->>'id')::bigint = :id";
    private static final String DELETE_USER_BY_ID_QUERY = "DELETE FROM users WHERE (data->>'id')::bigint = :id";

    private final RowMapper<User> USER_ROW_MAPPER = (rs, i) -> {
        User user;

        try {
            user = objectMapper.readValue(rs.getString("data"), User.class);
        } catch (IOException ex) {
            throw new AppException(ex.getMessage(), ex);
        }

        return user;
    };
}
