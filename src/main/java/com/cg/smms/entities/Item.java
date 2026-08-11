package com.cg.smms.entities;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;

import java.time.LocalDate;

@Entity
public class Item {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String itemName;
    private Double price;
    private LocalDate manufacturingDate;
    private LocalDate expiry;
    
    @Enumerated(EnumType.STRING)
    private Category category;
    
    @ManyToOne
    @JsonIgnore
    private Shop shop;
    
    public enum Category {
        CLOTHING, MOBILES, ACCESSORIES
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getItemName() { return itemName; }
    public void setItemName(String itemName) { this.itemName = itemName; }
    public Double getPrice() { return price; }
    public void setPrice(Double price) { this.price = price; }
    public LocalDate getManufacturingDate() { return manufacturingDate; }
    public void setManufacturingDate(LocalDate manufacturingDate) { this.manufacturingDate = manufacturingDate; }
    public LocalDate getExpiry() { return expiry; }
    public void setExpiry(LocalDate expiry) { this.expiry = expiry; }
    public Category getCategory() { return category; }
    public void setCategory(Category category) { this.category = category; }
    public Shop getShop() { return shop; }
    public void setShop(Shop shop) { this.shop = shop; }
}