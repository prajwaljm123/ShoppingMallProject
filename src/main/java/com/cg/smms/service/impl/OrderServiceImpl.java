package com.cg.smms.service.impl;

import com.cg.smms.entities.Customer;
import com.cg.smms.entities.OrderDetails;
import com.cg.smms.entities.Shop;
import com.cg.smms.exception.ResourceNotFoundException;
import com.cg.smms.repository.CustomerRepository;
import com.cg.smms.repository.OrderRepository;
import com.cg.smms.repository.ShopRepository;
import com.cg.smms.service.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class OrderServiceImpl implements OrderService {

    @Autowired
    private OrderRepository orderRepository;
    
    @Autowired
    private CustomerRepository customerRepository;
    
    @Autowired
    private ShopRepository shopRepository;

    @Override
    public OrderDetails addOrder(OrderDetails order) {
        // Fetch and set existing Customer
        if (order.getCustomer() != null && order.getCustomer().getId() != null) {
            Customer customer = customerRepository.findById(order.getCustomer().getId())
                    .orElseThrow(() -> new ResourceNotFoundException("Customer not found with id: " + order.getCustomer().getId()));
            order.setCustomer(customer);
        }
        
        // Fetch and set existing Shop
        if (order.getShop() != null && order.getShop().getShopId() != null) {
            Shop shop = shopRepository.findById(order.getShop().getShopId())
                    .orElseThrow(() -> new ResourceNotFoundException("Shop not found with id: " + order.getShop().getShopId()));
            order.setShop(shop);
        }
        
        return orderRepository.save(order);
    }

    @Override
    public OrderDetails updateOrder(OrderDetails order) {
        // Fetch and set existing Customer
        if (order.getCustomer() != null && order.getCustomer().getId() != null) {
            Customer customer = customerRepository.findById(order.getCustomer().getId())
                    .orElseThrow(() -> new ResourceNotFoundException("Customer not found with id: " + order.getCustomer().getId()));
            order.setCustomer(customer);
        }
        
        // Fetch and set existing Shop
        if (order.getShop() != null && order.getShop().getShopId() != null) {
            Shop shop = shopRepository.findById(order.getShop().getShopId())
                    .orElseThrow(() -> new ResourceNotFoundException("Shop not found with id: " + order.getShop().getShopId()));
            order.setShop(shop);
        }
        
        return orderRepository.save(order);
    }

    @Override
    public OrderDetails getOrder(Long id) {
        Optional<OrderDetails> order = orderRepository.findById(id);
        return order.orElse(null);
    }

    @Override
    public void cancelOrder(Long id) {
        orderRepository.deleteById(id);
    }

    @Override
    public List<OrderDetails> getAllOrders() {
        return orderRepository.findAll();
    }

    @Override
    public List<OrderDetails> getOrdersByCustomer(Long customerId) {
        return orderRepository.findAll().stream()
                .filter(order -> order.getCustomer() != null && order.getCustomer().getId().equals(customerId))
                .toList();
    }

    @Override
    public List<OrderDetails> getOrdersByShop(Long shopId) {
        return orderRepository.findAll().stream()
                .filter(order -> order.getShop() != null && order.getShop().getShopId().equals(shopId))
                .toList();
    }
}