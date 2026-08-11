package com.cg.smms.service.impl;

import com.cg.smms.entities.Mall;
import com.cg.smms.repository.MallRepository;
import com.cg.smms.service.MallService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class MallServiceImpl implements MallService {

    @Autowired
    private MallRepository mallRepository;

    @Override
    public Mall addMall(Mall mall) {
        return mallRepository.save(mall);
    }

    @Override
    public Mall updateMall(Mall mall) {
        return mallRepository.save(mall);
    }

    @Override
    public Mall getMall(Long id) {
        Optional<Mall> mall = mallRepository.findById(id);
        return mall.orElse(null);
    }

    @Override
    public List<Mall> getAllMalls() {
        return mallRepository.findAll();
    }
}