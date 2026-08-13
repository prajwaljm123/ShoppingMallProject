package com.cg.smms.entities;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OneToOne;

import java.util.List;

@Entity
public class Shop {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long shopId;
    private String shopName;
    
    @Enumerated(EnumType.STRING)
    private ShopCategory shopCategory;
    
    @Enumerated(EnumType.STRING)
    private ShopStatus shopStatus;
    
    @ManyToOne
    @com.fasterxml.jackson.annotation.JsonIgnoreProperties({"shops", "mallAdmin"})
    private Mall mall;
    
    @OneToOne
    @JoinColumn(name = "shop_owner_id", unique = true)
    private ShopOwner shopOwner;
    
    @OneToMany(mappedBy = "shop", cascade = CascadeType.ALL)
    @com.fasterxml.jackson.annotation.JsonIgnoreProperties("shop")
    private List<Employee> shopEmployees;
    
    @OneToMany(mappedBy = "shop", cascade = CascadeType.ALL)
    @com.fasterxml.jackson.annotation.JsonIgnoreProperties("shop")
    private List<Customer> customers;
    
    public enum ShopCategory {
        WHOLESALE, RETAIL
    }
    
    public enum ShopStatus {
        OPEN, CLOSED
    }

    public Long getShopId() { return shopId; }
    public void setShopId(Long shopId) { this.shopId = shopId; }
    public String getShopName() { return shopName; }
    public void setShopName(String shopName) { this.shopName = shopName; }
    public ShopCategory getShopCategory() { return shopCategory; }
    public void setShopCategory(ShopCategory shopCategory) { this.shopCategory = shopCategory; }
    public ShopStatus getShopStatus() { return shopStatus; }
    public void setShopStatus(ShopStatus shopStatus) { this.shopStatus = shopStatus; }
    public Mall getMall() { return mall; }
    public void setMall(Mall mall) { this.mall = mall; }
    public ShopOwner getShopOwner() { return shopOwner; }
    public void setShopOwner(ShopOwner shopOwner) { this.shopOwner = shopOwner; }
    public List<Employee> getShopEmployees() { return shopEmployees; }
    public void setShopEmployees(List<Employee> shopEmployees) { this.shopEmployees = shopEmployees; }
    public List<Customer> getCustomers() { return customers; }
    public void setCustomers(List<Customer> customers) { this.customers = customers; }
}