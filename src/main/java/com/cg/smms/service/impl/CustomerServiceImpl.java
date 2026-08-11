package com.cg.smms.service.impl;

import com.cg.smms.entities.Customer;
import com.cg.smms.entities.Shop;
import com.cg.smms.exception.ResourceNotFoundException;
import com.cg.smms.repository.CustomerRepository;
import com.cg.smms.repository.ShopRepository;
import com.cg.smms.service.CustomerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class CustomerServiceImpl implements CustomerService {

    @Autowired
    private CustomerRepository customerRepository;
    
    @Autowired
    private ShopRepository shopRepository;

    @Override
    public Customer addCustomer(Customer customer) {
        // Fetch and set existing Shop
        if (customer.getShop() != null && customer.getShop().getShopId() != null) {
            Shop shop = shopRepository.findById(customer.getShop().getShopId())
                    .orElseThrow(() -> new ResourceNotFoundException("Shop not found with id: " + customer.getShop().getShopId()));
            customer.setShop(shop);
        }
        return customerRepository.save(customer);
    }

    @Override
    public Customer updateCustomer(Customer customer) {
        // Fetch and set existing Shop
        if (customer.getShop() != null && customer.getShop().getShopId() != null) {
            Shop shop = shopRepository.findById(customer.getShop().getShopId())
                    .orElseThrow(() -> new ResourceNotFoundException("Shop not found with id: " + customer.getShop().getShopId()));
            customer.setShop(shop);
        }
        return customerRepository.save(customer);
    }

    @Override
    public Customer getCustomer(Long id) {
        return customerRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Customer not found with id: " + id));
    }

    @Override
    public void deleteCustomer(Long id) {
        if (!customerRepository.existsById(id)) {
            throw new ResourceNotFoundException("Customer not found with id: " + id);
        }
        customerRepository.deleteById(id);
    }

    @Override
    public List<Customer> getAllCustomers() {
        return customerRepository.findAll();
    }
}