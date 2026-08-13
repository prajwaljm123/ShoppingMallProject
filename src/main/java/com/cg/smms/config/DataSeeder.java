package com.cg.smms.config;

import com.cg.smms.entities.*;
import com.cg.smms.repository.*;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

@Configuration
public class DataSeeder {

    @Bean
    CommandLineRunner initDatabase(
            MallRepository mallRepo, 
            ShopOwnerRepository ownerRepo, 
            ShopRepository shopRepo,
            ItemRepository itemRepo,
            CustomerRepository customerRepo,
            OrderRepository orderRepo,
            EmployeeRepository employeeRepo,
            MallAdminRepository mallAdminRepo) {
        return args -> {
            // Seed data only if the database is missing the professional data
            if (mallRepo.count() < 4 || employeeRepo.count() == 0) {
                System.out.println("Cleaning up old data to ensure a fresh set of professional data...");
                orderRepo.deleteAll();
                itemRepo.deleteAll();
                customerRepo.deleteAll();
                employeeRepo.deleteAll();
                shopRepo.deleteAll();
                ownerRepo.deleteAll();
                mallAdminRepo.deleteAll();
                mallRepo.deleteAll();
                
                // 1. Create Professional Malls in Bengaluru
                Mall m1 = new Mall(); m1.setMallName("Phoenix Marketcity"); m1.setLocation("Whitefield, Bengaluru"); m1.setCategory(Mall.Category.SUPERREGIONAL);
                Mall m2 = new Mall(); m2.setMallName("Orion Mall"); m2.setLocation("Rajajinagar, Bengaluru"); m2.setCategory(Mall.Category.REGIONAL);
                Mall m3 = new Mall(); m3.setMallName("UB City"); m3.setLocation("Vittal Mallya Road, Bengaluru"); m3.setCategory(Mall.Category.REGIONAL);
                Mall m4 = new Mall(); m4.setMallName("Mantri Square"); m4.setLocation("Malleshwaram, Bengaluru"); m4.setCategory(Mall.Category.SUPERREGIONAL);
                List<Mall> savedMalls = mallRepo.saveAll(Arrays.asList(m1, m2, m3, m4));

                // 2. Mall Admins
                String[] adminNames = {"Rajeev Kumar", "Sunita L", "Kiran Desai", "Aarti Patel"};
                for (int i=0; i<4; i++) {
                     MallAdmin ma = new MallAdmin();
                     ma.setName(adminNames[i]);
                     ma.setPassword("admin123");
                     ma.setPhone("990000000" + i);
                     ma.setMall(savedMalls.get(i));
                     mallAdminRepo.save(ma);
                }

                // 3. 10 Professional Shops and Shop Owners in Bengaluru context
                String[][] shopData = {
                    {"Zara", "Ramesh Kumar", "Koramangala, Bengaluru", "RETAIL", "OPEN", "0"},
                    {"Apple Store", "Suresh Menon", "Indiranagar, Bengaluru", "RETAIL", "OPEN", "2"},
                    {"H&M", "Anita Reddy", "Whitefield, Bengaluru", "RETAIL", "OPEN", "0"},
                    {"Starbucks", "Rahul Sharma", "Jayanagar, Bengaluru", "RETAIL", "OPEN", "3"},
                    {"Croma", "Vikram Singh", "Marathahalli, Bengaluru", "RETAIL", "CLOSED", "1"},
                    {"Reliance Digital", "Priya Desai", "Rajajinagar, Bengaluru", "WHOLESALE", "OPEN", "1"},
                    {"Shoppers Stop", "Anil K", "Malleshwaram, Bengaluru", "RETAIL", "OPEN", "3"},
                    {"Louis Vuitton", "Deepa N", "Vasanth Nagar, Bengaluru", "RETAIL", "OPEN", "2"},
                    {"Nike", "John D'Souza", "HSR Layout, Bengaluru", "RETAIL", "OPEN", "1"},
                    {"Puma", "Kavya S", "BTM Layout, Bengaluru", "RETAIL", "OPEN", "0"}
                };

                int year = 1978;
                List<Shop> savedShops = new ArrayList<>();
                for (String[] data : shopData) {
                    ShopOwner owner = new ShopOwner();
                    owner.setName(data[1]);
                    owner.setAddress(data[2]);
                    owner.setDob(LocalDate.of(year++, (year % 12) + 1, 15));
                    owner = ownerRepo.save(owner);

                    Shop shop = new Shop();
                    shop.setShopName(data[0]);
                    shop.setShopCategory(Shop.ShopCategory.valueOf(data[3]));
                    shop.setShopStatus(Shop.ShopStatus.valueOf(data[4]));
                    int mallIndex = Integer.parseInt(data[5]);
                    shop.setMall(savedMalls.get(mallIndex));
                    shop.setShopOwner(owner);
                    savedShops.add(shopRepo.save(shop));
                }

                // 4. Employees for shops
                String[] empNames = {"Ravi", "Sita", "Laxman", "Gita", "Rahul", "Priya", "Vikram", "Anjali", "Suresh", "Mahesh"};
                for (int i=0; i<10; i++) {
                     Employee emp = new Employee();
                     emp.setName(empNames[i]);
                     emp.setDob(LocalDate.of(1990 + (i%10), (i%12)+1, 10));
                     emp.setSalary(25000f + (i * 1000f));
                     emp.setAddress("Bengaluru Area " + i);
                     emp.setDesignation("Sales Associate");
                     emp.setShop(savedShops.get(i));
                     employeeRepo.save(emp);
                }

                // 5. Customers
                String[] custNames = {"Amit Patel", "Neha Gupta", "Karthik R", "Sneha Iyer", "Rajesh V", "Pooja Hegde", "Varun M", "Swathi K", "Harish N", "Bhavya S"};
                List<Customer> savedCustomers = new ArrayList<>();
                for (int i = 0; i < 10; i++) {
                    Customer c = new Customer();
                    c.setName(custNames[i]);
                    c.setEmail(custNames[i].split(" ")[0].toLowerCase() + i + "@gmail.com");
                    c.setPhone(9876543000L + i);
                    c.setShop(savedShops.get(i % savedShops.size())); // associate randomly
                    savedCustomers.add(customerRepo.save(c));
                }

                // 6. Items for shops
                List<Item> savedItems = new ArrayList<>();
                String[][] itemData = {
                    {"Graphic T-Shirt", "999.0", "CLOTHING"}, {"Slim Fit Jeans", "2499.0", "CLOTHING"}, 
                    {"iPhone 15", "79900.0", "MOBILES"}, {"MacBook Air M2", "114900.0", "MOBILES"},
                    {"Hoodie", "1999.0", "CLOTHING"}, {"Coffee Mug", "499.0", "ACCESSORIES"},
                    {"Sony TV 55", "64990.0", "ACCESSORIES"}, {"JBL Speaker", "3499.0", "ACCESSORIES"},
                    {"Running Shoes", "5999.0", "CLOTHING"}, {"Sneakers", "4999.0", "CLOTHING"}
                };
                for (int i = 0; i < 10; i++) {
                    Item item = new Item();
                    item.setItemName(itemData[i][0]);
                    item.setPrice(Double.parseDouble(itemData[i][1]));
                    item.setCategory(Item.Category.valueOf(itemData[i][2]));
                    item.setManufacturingDate(LocalDate.now().minusMonths(i + 1));
                    item.setExpiry(LocalDate.now().plusYears(1));
                    item.setShop(savedShops.get(i % savedShops.size()));
                    savedItems.add(itemRepo.save(item));
                }

                // 7. Orders for customers
                for (int i = 0; i < 10; i++) {
                    OrderDetails order = new OrderDetails();
                    order.setDateOfPurchase(LocalDateTime.now().minusDays(i));
                    order.setPaymentMode(OrderDetails.PaymentMode.values()[i % 4]);
                    order.setCustomer(savedCustomers.get(i));
                    order.setShop(savedShops.get(i));

                    OrderItem oi = new OrderItem();
                    oi.setItem(savedItems.get(i));
                    oi.setQuantity((i % 3) + 1);
                    oi.setPrice(savedItems.get(i).getPrice() * oi.getQuantity());
                    oi.setOrder(order);

                    order.setTotal(oi.getPrice().floatValue());
                    order.setItems(Arrays.asList(oi));

                    orderRepo.save(order);
                }
                
                System.out.println("✅ Database seeded with professional Bengaluru-based data (ALL entities included and related!)");
            } else {
                System.out.println("✅ Database already contains professional data. Seeding skipped.");
            }
        };
    }
}
