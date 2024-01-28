package com.timetravellers.backend.repositories;

import com.timetravellers.backend.entities.mongodb.History;
import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface HistoryRepository extends MongoRepository<History, ObjectId> {
    List<History> findByUsernameAndIssuedOnGreaterThan(String username, LocalDateTime issuedOn);
}
