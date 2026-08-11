package com.cg.smms.service.impl;

import com.cg.smms.entities.ShopOwner;
import com.cg.smms.repository.ShopOwnerRepository;
import com.cg.smms.service.ShopOwnerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ShopOwnerServiceImpl implements ShopOwnerService {

    @Autowired
    private ShopOwnerRepository shopOwnerRepository;

    @Override
    public ShopOwner addShopOwner(ShopOwner shopOwner) {
        return shopOwnerRepository.save(shopOwner);
    }

    @Override
    public ShopOwner updateShopOwner(ShopOwner shopOwner) {
        return shopOwnerRepository.save(shopOwner);
    }

    @Override
    public ShopOwner getShopOwner(Long id) {
        Optional<ShopOwner> shopOwner = shopOwnerRepository.findById(id);
        return shopOwner.orElse(null);
    }

    @Override
    public void deleteShopOwner(Long id) {
        shopOwnerRepository.deleteById(id);
    }

    @Override
    public List<ShopOwner> getAllShopOwners() {
        return shopOwnerRepository.findAll();
    }
}