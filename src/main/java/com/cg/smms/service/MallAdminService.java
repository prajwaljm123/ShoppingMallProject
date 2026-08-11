package com.cg.smms.service;

import com.cg.smms.entities.MallAdmin;

public interface MallAdminService {
    MallAdmin addMallAdmin(MallAdmin mallAdmin);
    MallAdmin updateMallAdmin(MallAdmin mallAdmin);
    MallAdmin getMallAdmin(Long id);
    void deleteMallAdmin(Long id);
    MallAdmin login(String name, String password);
}