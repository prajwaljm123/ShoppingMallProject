package com.cg.smms.entities;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OneToOne;

import java.util.List;

@Entity
public class Mall {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String mallName;
    private String location;
    
    @Enumerated(EnumType.STRING)
    private Category category;
    
    @OneToOne(mappedBy = "mall", cascade = CascadeType.ALL)
    private MallAdmin mallAdmin;
    
    @OneToMany(mappedBy = "mall", cascade = CascadeType.ALL)
    @JsonIgnore
    private List<Shop> shops;
    
    public enum Category {
        REGIONAL, SUPERREGIONAL
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getMallName() { return mallName; }
    public void setMallName(String mallName) { this.mallName = mallName; }
    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }
    public Category getCategory() { return category; }
    public void setCategory(Category category) { this.category = category; }
    public MallAdmin getMallAdmin() { return mallAdmin; }
    public void setMallAdmin(MallAdmin mallAdmin) { this.mallAdmin = mallAdmin; }
    public List<Shop> getShops() { return shops; }
    public void setShops(List<Shop> shops) { this.shops = shops; }
}