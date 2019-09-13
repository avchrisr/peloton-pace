package com.chrisr.pelotonpace.repository;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.stereotype.Repository;

@Repository
public abstract class RepositoryBase {

    private static final Logger logger = LoggerFactory.getLogger(RepositoryBase.class);

    final NamedParameterJdbcTemplate namedParameterJdbcTemplate;

    public RepositoryBase(NamedParameterJdbcTemplate namedParameterJdbcTemplate) {
        this.namedParameterJdbcTemplate = namedParameterJdbcTemplate;
    }

    public Long getNextSequence() {
        return namedParameterJdbcTemplate.queryForObject(GET_NEXT_SEQUENCE, new MapSqlParameterSource(), Long.class);
    }

    // ---------------------------
    // SQL QUERIES AND MAPPERS
    // ---------------------------

    private static final String GET_NEXT_SEQUENCE = "SELECT nextval('sequence_number')";
}
