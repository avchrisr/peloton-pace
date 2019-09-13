package com.chrisr.pelotonpace.repository;

import com.chrisr.pelotonpace.repository.entity.PelotonUserSession;
import com.chrisr.pelotonpace.exception.AppException;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.postgresql.util.PGobject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.stereotype.Repository;

import java.io.IOException;

@Repository
public class PelotonRepository extends RepositoryBase {

    private static final Logger logger = LoggerFactory.getLogger(PelotonRepository.class);

    private final ObjectMapper objectMapper;

    @Autowired
    public PelotonRepository(@Qualifier("postgresJdbcTemplate") NamedParameterJdbcTemplate namedParameterJdbcTemplate,
                             ObjectMapper objectMapper) {
        super(namedParameterJdbcTemplate);
        this.objectMapper = objectMapper;
    }

    public PelotonUserSession getPelotonUserSessionByUsername(String username) {
//        String errorMessage = String.format("Peloton User Session not found with username = %s", username);

        MapSqlParameterSource params = new MapSqlParameterSource();
        params.addValue("username", username);

        // TODO: add index on username

        try {
            PGobject pgObject = namedParameterJdbcTemplate.queryForObject(GET_PELOTON_USER_SESSION_BY_USERNAME_QUERY, params, PGobject.class);
            if (pgObject == null) {
//                throw new ResourceNotFoundException(errorMessage);
                return null;
            }
            return objectMapper.readValue(pgObject.getValue(), PelotonUserSession.class);
        } catch (EmptyResultDataAccessException ex) {
//            throw new ResourceNotFoundException(errorMessage, ex);
            return null;
        } catch (IOException ex) {
            throw new AppException(ex.getMessage(), ex);
        }
    }

    public void addPelotonUserSession(PelotonUserSession pelotonUserSession) {
        try {
            MapSqlParameterSource params = new MapSqlParameterSource();
            params.addValue("pelotonUserSession", objectMapper.writeValueAsString(pelotonUserSession));
            namedParameterJdbcTemplate.update(INSERT_PELOTON_USER_SESSION_QUERY, params);
        } catch (JsonProcessingException e) {
            throw new AppException(e.getMessage(), e);
        }
    }

    public void updatePelotonUserSession(PelotonUserSession pelotonUserSession) {
        try {
            MapSqlParameterSource params = new MapSqlParameterSource();
            params.addValue("pelotonUserSession", objectMapper.writeValueAsString(pelotonUserSession));
            params.addValue("id", pelotonUserSession.getId());
            namedParameterJdbcTemplate.update(UPDATE_PELOTON_USER_SESSION_QUERY, params);
        } catch (JsonProcessingException e) {
            throw new AppException(e.getMessage(), e);
        }
    }

    // ---------------------------
    // SQL QUERIES AND MAPPERS
    // ---------------------------

    private static final String GET_PELOTON_USER_SESSION_BY_USERNAME_QUERY = "SELECT data FROM peloton_user_session WHERE data->>'username' = :username";
    private static final String INSERT_PELOTON_USER_SESSION_QUERY = "INSERT INTO peloton_user_session (data) VALUES (:pelotonUserSession::jsonb)";
    private static final String UPDATE_PELOTON_USER_SESSION_QUERY = "UPDATE peloton_user_session SET data = (:pelotonUserSession::jsonb) WHERE (data->>'id')::bigint = :id";
}
