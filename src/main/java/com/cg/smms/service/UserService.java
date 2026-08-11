package com.cg.smms.service;

import com.cg.smms.entities.User;

public interface UserService {
    User addUser(User user);
    User updateUser(User user);
    User login(String name, String password);
    User getUser(Long id);
    void deleteUser(Long id);
}