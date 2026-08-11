package com.cg.smms.service.impl;

import com.cg.smms.entities.Mall;
import com.cg.smms.entities.Shop;
import com.cg.smms.entities.ShopOwner;
import com.cg.smms.exception.ResourceNotFoundException;
import com.cg.smms.repository.MallRepository;
import com.cg.smms.repository.ShopOwnerRepository;
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
    
    @Autowired
    private MallRepository mallRepository;
    
    @Autowired
    private ShopOwnerRepository shopOwnerRepository;

    @Override
    public Shop addShop(Shop shop) {
        // Fetch and set existing Mall
        if (shop.getMall() != null && shop.getMall().getId() != null) {
            Mall mall = mallRepository.findById(shop.getMall().getId())
                    .orElseThrow(() -> new ResourceNotFoundException("Mall not found with id: " + shop.getMall().getId()));
            shop.setMall(mall);
        }
        
        // Fetch and set existing ShopOwner
        if (shop.getShopOwner() != null && shop.getShopOwner().getId() != null) {
            ShopOwner shopOwner = shopOwnerRepository.findById(shop.getShopOwner().getId())
                    .orElseThrow(() -> new ResourceNotFoundException("ShopOwner not found with id: " + shop.getShopOwner().getId()));
            shop.setShopOwner(shopOwner);
        }
        
        return shopRepository.save(shop);
    }

    @Override
    public Shop updateShop(Shop shop) {
        // Fetch and set existing Mall
        if (shop.getMall() != null && shop.getMall().getId() != null) {
            Mall mall = mallRepository.findById(shop.getMall().getId())
                    .orElseThrow(() -> new ResourceNotFoundException("Mall not found with id: " + shop.getMall().getId()));
            shop.setMall(mall);
        }
        
        // Fetch and set existing ShopOwner
        if (shop.getShopOwner() != null && shop.getShopOwner().getId() != null) {
            ShopOwner shopOwner = shopOwnerRepository.findById(shop.getShopOwner().getId())
                    .orElseThrow(() -> new ResourceNotFoundException("ShopOwner not found with id: " + shop.getShopOwner().getId()));
            shop.setShopOwner(shopOwner);
        }
        
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