package com.cg.smms.service;

import com.cg.smms.entities.Shop;
import java.util.List;

public interface ShopService {
    Shop addShop(Shop shop);
    Shop updateShop(Shop shop);
    Shop getShop(Long id);
    void deleteShop(Long id);
    List<Shop> getAllShops();
    List<Shop> getShopsByMall(Long mallId);
}