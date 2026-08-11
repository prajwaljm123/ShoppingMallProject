package com.cg.smms.service.impl;

import com.cg.smms.entities.Item;
import com.cg.smms.repository.ItemRepository;
import com.cg.smms.service.ItemService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ItemServiceImpl implements ItemService {

    @Autowired
    private ItemRepository itemRepository;

    @Override
    public Item addItem(Item item) {
        return itemRepository.save(item);
    }

    @Override
    public Item updateItem(Item item) {
        return itemRepository.save(item);
    }

    @Override
    public Item getItem(Long id) {
        Optional<Item> item = itemRepository.findById(id);
        return item.orElse(null);
    }

    @Override
    public void deleteItem(Long id) {
        itemRepository.deleteById(id);
    }

    @Override
    public List<Item> getAllItems() {
        return itemRepository.findAll();
    }

    @Override
    public List<Item> getItemsByShop(Long shopId) {
        return itemRepository.findAll().stream()
                .filter(item -> item.getShop() != null && item.getShop().getShopId().equals(shopId))
                .toList();
    }

    @Override
    public List<Item> searchItems(String name) {
        return itemRepository.findAll().stream()
                .filter(item -> item.getItemName().toLowerCase().contains(name.toLowerCase()))
                .toList();
    }
}