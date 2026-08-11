package com.cg.smms.controller;

import com.cg.smms.entities.ShopOwner;
import com.cg.smms.service.ShopOwnerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/shop-owners")
public class ShopOwnerController {

    @Autowired
    private ShopOwnerService shopOwnerService;

    @PostMapping
    public ResponseEntity<ShopOwner> addShopOwner(@RequestBody ShopOwner shopOwner) {
        return ResponseEntity.ok(shopOwnerService.addShopOwner(shopOwner));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ShopOwner> updateShopOwner(@PathVariable Long id, @RequestBody ShopOwner shopOwner) {
        shopOwner.setId(id);
        return ResponseEntity.ok(shopOwnerService.updateShopOwner(shopOwner));
    }

    @GetMapping
    public ResponseEntity<List<ShopOwner>> getAllShopOwners() {
        return ResponseEntity.ok(shopOwnerService.getAllShopOwners());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ShopOwner> getShopOwner(@PathVariable Long id) {
        ShopOwner shopOwner = shopOwnerService.getShopOwner(id);
        return shopOwner != null ? ResponseEntity.ok(shopOwner) : ResponseEntity.notFound().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteShopOwner(@PathVariable Long id) {
        shopOwnerService.deleteShopOwner(id);
        return ResponseEntity.ok().build();
    }
}