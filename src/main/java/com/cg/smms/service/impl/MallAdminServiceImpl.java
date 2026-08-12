package com.cg.smms.service.impl;

import com.cg.smms.entities.MallAdmin;
import com.cg.smms.repository.MallAdminRepository;
import com.cg.smms.service.MallAdminService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class MallAdminServiceImpl implements MallAdminService {

    @Autowired
    private MallAdminRepository mallAdminRepository;

    @Override
    public MallAdmin addMallAdmin(MallAdmin mallAdmin) {
        return mallAdminRepository.save(mallAdmin);
    }

    @Override
    public MallAdmin updateMallAdmin(MallAdmin mallAdmin) {
        return mallAdminRepository.save(mallAdmin);
    }

    @Override
    public MallAdmin getMallAdmin(Long id) {
        Optional<MallAdmin> mallAdmin = mallAdminRepository.findById(id);
        return mallAdmin.orElse(null);
    }

    @Override
    public List<MallAdmin> getAllMallAdmins() {
        return mallAdminRepository.findAll();
    }

    @Override
    public void deleteMallAdmin(Long id) {
        mallAdminRepository.deleteById(id);
    }

    @Override
    public MallAdmin login(String name, String password) {
        return mallAdminRepository.findAll().stream()
                .filter(admin -> admin.getName().equals(name) && admin.getPassword().equals(password))
                .findFirst()
                .orElse(null);
    }
}