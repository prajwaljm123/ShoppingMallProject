package com.cg.smms.service;

import com.cg.smms.entities.Customer;
import java.util.List;

public interface CustomerService {
    Customer addCustomer(Customer customer);
    Customer updateCustomer(Customer customer);
    Customer getCustomer(Long id);
    void deleteCustomer(Long id);
    List<Customer> getAllCustomers();
}