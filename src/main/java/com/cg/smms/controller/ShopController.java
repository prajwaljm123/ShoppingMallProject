package com.cg.smms.controller;

import com.cg.smms.entities.Shop;
import com.cg.smms.service.ShopService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/shops")
public class ShopController {

    @Autowired
    private ShopService shopService;

    @PostMapping
    public ResponseEntity<Shop> addShop(@RequestBody Shop shop) {
        return ResponseEntity.ok(shopService.addShop(shop));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Shop> updateShop(@PathVariable Long id, @RequestBody Shop shop) {
        shop.setShopId(id);
        return ResponseEntity.ok(shopService.updateShop(shop));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Shop> getShop(@PathVariable Long id) {
        Shop shop = shopService.getShop(id);
        return shop != null ? ResponseEntity.ok(shop) : ResponseEntity.notFound().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteShop(@PathVariable Long id) {
        shopService.deleteShop(id);
        return ResponseEntity.ok().build();
    }

    @GetMapping
    public ResponseEntity<List<Shop>> getAllShops() {
        return ResponseEntity.ok(shopService.getAllShops());
    }

    @GetMapping("/mall/{mallId}")
    public ResponseEntity<List<Shop>> getShopsByMall(@PathVariable Long mallId) {
        return ResponseEntity.ok(shopService.getShopsByMall(mallId));
    }
}