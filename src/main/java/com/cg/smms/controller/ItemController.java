package com.cg.smms.controller;

import com.cg.smms.entities.Item;
import com.cg.smms.service.ItemService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/items")
public class ItemController {

    @Autowired
    private ItemService itemService;

    @PostMapping
    public ResponseEntity<Item> addItem(@RequestBody Item item) {
        return ResponseEntity.ok(itemService.addItem(item));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Item> updateItem(@PathVariable Long id, @RequestBody Item item) {
        item.setId(id);
        return ResponseEntity.ok(itemService.updateItem(item));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Item> getItem(@PathVariable Long id) {
        Item item = itemService.getItem(id);
        return item != null ? ResponseEntity.ok(item) : ResponseEntity.notFound().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteItem(@PathVariable Long id) {
        itemService.deleteItem(id);
        return ResponseEntity.ok().build();
    }

    @GetMapping
    public ResponseEntity<List<Item>> getAllItems() {
        return ResponseEntity.ok(itemService.getAllItems());
    }

    @GetMapping("/shop/{shopId}")
    public ResponseEntity<List<Item>> getItemsByShop(@PathVariable Long shopId) {
        return ResponseEntity.ok(itemService.getItemsByShop(shopId));
    }

    @GetMapping("/search")
    public ResponseEntity<List<Item>> searchItems(@RequestParam String name) {
        return ResponseEntity.ok(itemService.searchItems(name));
    }
}