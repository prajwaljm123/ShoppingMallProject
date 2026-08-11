package com.cg.smms.service;

import com.cg.smms.entities.Employee;
import java.util.List;

public interface EmployeeService {
    Employee addEmployee(Employee employee);
    Employee updateEmployee(Employee employee);
    Employee getEmployee(Long id);
    void deleteEmployee(Long id);
    List<Employee> getAllEmployees();
}