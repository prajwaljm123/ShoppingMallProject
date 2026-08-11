package com.cg.smms.service;

import com.cg.smms.entities.ShopOwner;

public interface ShopOwnerService {
    ShopOwner addShopOwner(ShopOwner shopOwner);
    ShopOwner updateShopOwner(ShopOwner shopOwner);
    ShopOwner getShopOwner(Long id);
    void deleteShopOwner(Long id);
}