package com.cg.smms.service;

import com.cg.smms.entities.OrderDetails;
import java.util.List;

public interface OrderService {
    OrderDetails addOrder(OrderDetails order);
    OrderDetails updateOrder(OrderDetails order);
    OrderDetails getOrder(Long id);
    void cancelOrder(Long id);
    List<OrderDetails> getAllOrders();
    List<OrderDetails> getOrdersByCustomer(Long customerId);
    List<OrderDetails> getOrdersByShop(Long shopId);
}