# Shopping Mall Management System

A Spring Boot REST API for managing shopping mall operations including malls, shops, customers, orders, and inventory.

## Tech Stack

### Backend
- **Java 17**
- **Spring Boot 3.2.0**
- **Spring Data JPA / Hibernate**
- **PostgreSQL** (Production) / **H2** (Testing)
- **Maven**

### Frontend
- **React 18**
- **TypeScript**
- **Vite**
- **Tailwind CSS** (for styling and glassmorphism UI)
- **Framer Motion** (for page transitions and animations)

## Features
- Mall management (CRUD)
- Shop management with categories (WHOLESALE/RETAIL) and status (OPEN/CLOSED)
- Shop Owner management
- Mall Admin authentication
- Customer management
- Employee management
- Item/Inventory management with categories (CLOTHING, MOBILES, ACCESSORIES)
- Order management with payment modes (CARD, CASH, UPI, ONLINEBANKING)
- RESTful API with global exception handling
- **Modern React Admin Dashboard** with animations and premium glassmorphism UI

## Project Structure
```
src/main/java/com/cg/smms/
├── ShoppingMallManagementSystemApplication.java
├── controller/          # REST Controllers
├── service/             # Service interfaces
├── service/impl/        # Service implementations
├── repository/          # JPA Repositories
├── entities/            # JPA Entities
├── exception/           # Custom exceptions & global handler
```

## API Endpoints

| Resource | Endpoints |
|----------|-----------|
| Malls | `GET/POST /api/malls`, `GET/PUT /api/malls/{id}` |
| Shops | `GET/POST /api/shops`, `GET/PUT /api/shops/{id}`, `GET /api/shops/mall/{mallId}` |
| Shop Owners | `GET/POST /api/shop-owners`, `GET/PUT /api/shop-owners/{id}` |
| Mall Admins | `GET/POST /api/mall-admins`, `GET/PUT /api/mall-admins/{id}`, `POST /api/mall-admins/login` |
| Customers | `GET/POST /api/customers`, `GET/PUT /api/customers/{id}` |
| Employees | `GET/POST /api/employees`, `GET/PUT /api/employees/{id}` |
| Items | `GET/POST /api/items`, `GET/PUT /api/items/{id}`, `GET /api/items/shop/{shopId}`, `GET /api/items/search?name=` |
| Orders | `GET/POST /api/orders`, `GET/PUT /api/orders/{id}`, `DELETE /api/orders/{id}`, `GET /api/orders/customer/{id}`, `GET /api/orders/shop/{id}` |
| Users | `GET/POST /api/users`, `GET/PUT /api/users/{id}`, `POST /api/users/login` |

## Database Setup

### PostgreSQL (Production)
```sql
CREATE DATABASE shoppingmalldb;
```

Update `src/main/resources/application.properties`:
```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/shoppingmalldb
spring.datasource.username=postgres
spring.datasource.password=postgres
```

### H2 (Development/Testing)
Default configuration uses in-memory H2. Access console at `http://localhost:8080/h2-console`

## Running the Application

### 1. Start the Backend

```bash
# Clone the repository
git clone https://github.com/prajwaljm123/ShoppingMallProject.git
cd ShoppingMallProject

# Run with Maven
mvn spring-boot:run

# Or build JAR and run
mvn clean package -DskipTests
java -jar target/ShoppingMallManagementSystem-1.0.0.jar
```
Backend starts at `http://localhost:8082`

### 2. Start the Frontend

```bash
# Navigate to the frontend directory
cd frontend

# Install dependencies
npm install

# Start the Vite development server
npm run dev
```
Frontend starts at `http://localhost:5173` (or the port specified by Vite in your terminal).

## Testing API

```bash
# Create a mall
curl -X POST http://localhost:8080/api/malls \
  -H "Content-Type: application/json" \
  -d '{"mallName":"Phoenix Mall","location":"Bangalore","category":"REGIONAL"}'

# List all malls
curl http://localhost:8080/api/malls
```

## Database Schema

Key entities and relationships:
- **Mall** 1→N **Shop**
- **Shop** 1→1 **ShopOwner**
- **Shop** 1→N **Employee**
- **Shop** 1→N **Customer**
- **Shop** 1→N **Item**
- **Customer** 1→N **OrderDetails**
- **OrderDetails** 1→N **OrderItem**
- **Item** 1→N **OrderItem**
- **Mall** 1→1 **MallAdmin**

## License
MIT