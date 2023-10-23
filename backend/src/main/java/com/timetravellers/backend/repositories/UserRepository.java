package com.timetravellers.backend.repositories;

import com.timetravellers.backend.entities.User;
import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.Optional;

public interface UserRepository extends MongoRepository<User, ObjectId> {
    // insert already implemented in MongoRepository interface
    // deleteById already implemented in CrudRepository interface

    Optional<User> findById(ObjectId id);
    boolean changePassword(String userId, String oldPassword, String newPassword);

}
