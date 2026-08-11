package com.cg.smms.service.impl;

import com.cg.smms.entities.Shop;
import com.cg.smms.repository.ShopRepository;
import com.cg.smms.service.ShopService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ShopServiceImpl implements ShopService {

    @Autowired
    private ShopRepository shopRepository;

    @Override
    public Shop addShop(Shop shop) {
        return shopRepository.save(shop);
    }

    @Override
    public Shop updateShop(Shop shop) {
        return shopRepository.save(shop);
    }

    @Override
    public Shop getShop(Long id) {
        Optional<Shop> shop = shopRepository.findById(id);
        return shop.orElse(null);
    }

    @Override
    public void deleteShop(Long id) {
        shopRepository.deleteById(id);
    }

    @Override
    public List<Shop> getAllShops() {
        return shopRepository.findAll();
    }

    @Override
    public List<Shop> getShopsByMall(Long mallId) {
        return shopRepository.findAll().stream()
                .filter(shop -> shop.getMall() != null && shop.getMall().getId().equals(mallId))
                .toList();
    }
}