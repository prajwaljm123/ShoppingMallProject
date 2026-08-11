package com.cg.smms.service;

import com.cg.smms.entities.Item;
import java.util.List;

public interface ItemService {
    Item addItem(Item item);
    Item updateItem(Item item);
    Item getItem(Long id);
    void deleteItem(Long id);
    List<Item> getAllItems();
    List<Item> getItemsByShop(Long shopId);
    List<Item> searchItems(String name);
}