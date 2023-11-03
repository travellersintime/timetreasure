package com.timetravellers.backend.repositories;

import com.timetravellers.backend.entities.mongodb.Message;
import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface MessageRepository extends MongoRepository<Message, ObjectId> {
    Optional<Message> findById(ObjectId id);
    List<Message> findByRecipient(String recipient);
    List<Message> findByIsPublic(boolean isPublic);
}
