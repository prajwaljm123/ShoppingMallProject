package com.cg.smms.entities;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;

@Entity
public class OrderItem {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private Integer quantity;
    private Double price;
    
    @ManyToOne
    @JsonIgnore
    private Item item;
    
    @ManyToOne
    @JsonIgnore
    private OrderDetails order;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Integer getQuantity() { return quantity; }
    public void setQuantity(Integer quantity) { this.quantity = quantity; }
    public Double getPrice() { return price; }
    public void setPrice(Double price) { this.price = price; }
    public Item getItem() { return item; }
    public void setItem(Item item) { this.item = item; }
    public OrderDetails getOrder() { return order; }
    public void setOrder(OrderDetails order) { this.order = order; }
}