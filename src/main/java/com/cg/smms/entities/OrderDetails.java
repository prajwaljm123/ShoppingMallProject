package com.cg.smms.entities;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;

import java.time.LocalDateTime;
import java.util.List;

@Entity
public class OrderDetails {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private LocalDateTime dateOfPurchase;
    private Float total;
    
    @Enumerated(EnumType.STRING)
    private PaymentMode paymentMode;
    
    @ManyToOne
    private Customer customer;
    
    @ManyToOne
    private Shop shop;
    
    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL)
    private List<OrderItem> items;
    
    public enum PaymentMode {
        CARD, CASH, UPI, ONLINEBANKING
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public LocalDateTime getDateOfPurchase() { return dateOfPurchase; }
    public void setDateOfPurchase(LocalDateTime dateOfPurchase) { this.dateOfPurchase = dateOfPurchase; }
    public Float getTotal() { return total; }
    public void setTotal(Float total) { this.total = total; }
    public PaymentMode getPaymentMode() { return paymentMode; }
    public void setPaymentMode(PaymentMode paymentMode) { this.paymentMode = paymentMode; }
    public Customer getCustomer() { return customer; }
    public void setCustomer(Customer customer) { this.customer = customer; }
    public Shop getShop() { return shop; }
    public void setShop(Shop shop) { this.shop = shop; }
    public List<OrderItem> getItems() { return items; }
    public void setItems(List<OrderItem> items) { this.items = items; }
}