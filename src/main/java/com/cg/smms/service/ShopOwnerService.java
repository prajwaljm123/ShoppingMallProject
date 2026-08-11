package com.cg.smms.service;

import com.cg.smms.entities.ShopOwner;
import java.util.List;

public interface ShopOwnerService {
    ShopOwner addShopOwner(ShopOwner shopOwner);
    ShopOwner updateShopOwner(ShopOwner shopOwner);
    ShopOwner getShopOwner(Long id);
    void deleteShopOwner(Long id);
    List<ShopOwner> getAllShopOwners();
}