package com.chrisr.pelotonpace.service;

import com.chrisr.pelotonpace.repository.PelotonRepository;
import com.chrisr.pelotonpace.repository.entity.PelotonUserSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class PelotonService {

    private final PelotonRepository pelotonRepository;

    @Autowired
    public PelotonService(PelotonRepository pelotonRepository) {
        this.pelotonRepository = pelotonRepository;
    }

    @Transactional(readOnly = true)
    public PelotonUserSession getPelotonUserSessionByUsername(String username) {
        return pelotonRepository.getPelotonUserSessionByUsername(username);
    }

    @Transactional
    public void addPelotonUserSession(PelotonUserSession pelotonUserSession) {
        pelotonUserSession.setId(pelotonRepository.getNextSequence());
        pelotonRepository.addPelotonUserSession(pelotonUserSession);
    }

    @Transactional
    public void updatePelotonUserSessionById(PelotonUserSession pelotonUserSession) {
        pelotonRepository.updatePelotonUserSession(pelotonUserSession);
    }
}
