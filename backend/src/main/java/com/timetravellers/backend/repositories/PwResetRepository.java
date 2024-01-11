package com.timetravellers.backend.repositories;

import com.timetravellers.backend.entities.mongodb.Message;
import com.timetravellers.backend.entities.mongodb.PwReset;
import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface PwResetRepository extends MongoRepository<PwReset, ObjectId> {
    Optional<PwReset> findByUsername(String username);
    Optional<PwReset> findByCode(String code);
    void deleteByUsername(String username);
}
