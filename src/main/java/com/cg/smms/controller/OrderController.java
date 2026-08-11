package com.cg.smms.controller;

import com.cg.smms.entities.OrderDetails;
import com.cg.smms.service.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
public class OrderController {

    @Autowired
    private OrderService orderService;

    @PostMapping
    public ResponseEntity<OrderDetails> addOrder(@RequestBody OrderDetails order) {
        return ResponseEntity.ok(orderService.addOrder(order));
    }

    @PutMapping("/{id}")
    public ResponseEntity<OrderDetails> updateOrder(@PathVariable Long id, @RequestBody OrderDetails order) {
        order.setId(id);
        return ResponseEntity.ok(orderService.updateOrder(order));
    }

    @GetMapping("/{id}")
    public ResponseEntity<OrderDetails> getOrder(@PathVariable Long id) {
        OrderDetails order = orderService.getOrder(id);
        return order != null ? ResponseEntity.ok(order) : ResponseEntity.notFound().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> cancelOrder(@PathVariable Long id) {
        orderService.cancelOrder(id);
        return ResponseEntity.ok().build();
    }

    @GetMapping
    public ResponseEntity<List<OrderDetails>> getAllOrders() {
        return ResponseEntity.ok(orderService.getAllOrders());
    }

    @GetMapping("/customer/{customerId}")
    public ResponseEntity<List<OrderDetails>> getOrdersByCustomer(@PathVariable Long customerId) {
        return ResponseEntity.ok(orderService.getOrdersByCustomer(customerId));
    }

    @GetMapping("/shop/{shopId}")
    public ResponseEntity<List<OrderDetails>> getOrdersByShop(@PathVariable Long shopId) {
        return ResponseEntity.ok(orderService.getOrdersByShop(shopId));
    }
}