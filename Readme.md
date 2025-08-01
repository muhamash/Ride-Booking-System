# 🚕 Ride System Backend API

A **scalable ride-booking backend system** built with **TypeScript, Express.js, MongoDB (Mongoose)**, featuring:

- 🔐 Role-based Access Control (ADMIN, DRIVER, RIDER)
- 🛡 JWT + Passport Authentication
- 🧾 Zod schema validation
- 📍 `MOCK` Location tracking
- 🧩 Modular route architecture
- 🛠️ Scheduled jobs (`cron`) for user state updates
- ✅ Robust error handling

---

## 📁 Project Structure

```
src/
├── modules/
│   ├── auth/
│   ├── user/
│   ├── driver/
│   ├── ride/
│   ├── admin/
├── middlewares/
├── utils/
├── routes/
└── config/
```

---

## ⚙️ Tech Stack

| Tech             | Usage                                      |
|------------------|---------------------------------------------|
| **TypeScript**   | Type-safe Node.js runtime                   |
| **Express.js**   | Backend web framework                       |
| **MongoDB + Mongoose** | NoSQL database + ODM                   |
| **Zod**          | Request schema validation                   |
| **JWT + Passport.js** | Secure user authentication             |
| **GeoIP & Location** | Track user/device location via IP        |
| **CRON Jobs**    | Scheduled offline user clean-up             |

---

## 👥 User Roles

| Role     | Description                                  |
|----------|----------------------------------------------|
| `ADMIN`  | Full access to all data and user control     |
| `DRIVER` | Accept and complete rides                    |
| `RIDER`  | Request rides and manage ride status         |

---

## 🧠 User Journey Overview

1. 🔐 **Auth**
   - Login & receive JWT
   - JWT attached to protected requests via `Authorization: Bearer <token>`

2. 🧍 **Rider Flow**
   - Rider logs in
   - Requests a ride `/ride/request`
   - May cancel before it is accepted `/ride/request/cancel/:id`

3. 👨‍✈️ **Driver Flow**
   - Driver logs in
   - Checks for ride requests `/driver/check-ride-request`
   - Accepts `/driver/accept-ride-request/:id`
   - Marks pick-up ➝ in-transit ➝ complete

4. 👮 **Admin Flow**
   - Gets all users, rides, drivers
   - Blocks users, suspends drivers, deletes rides

---

## 📦 API Endpoints

### 🔐 Auth APIs (`/api/auth`)

| Method | Endpoint                  | Description                     |
|--------|---------------------------|---------------------------------|
| POST   | `/login`                  | User login                      |
| POST   | `/logout`                 | Logout & update location        |
| POST   | `/refresh-token`          | Refresh JWT token               |

---

### 👤 User APIs (`/api/user`)

| Method | Endpoint                    | Description              |
|--------|-----------------------------|--------------------------|
| POST   | `/create`                   | Register new user       |
| GET    | `/me`                       | Get current user info   |
| PATCH  | `/update-user/:id`          | Update user profile     |
| GET    | `/user-state/:id`           | Get user current state  |

---

### 🛺 Ride APIs (`/api/ride`)

| Method | Endpoint                    | Description                        |
|--------|-----------------------------|------------------------------------|
| POST   | `/request`                  | Request a new ride (RIDER)         |
| POST   | `/request/cancel/:id`       | Cancel a ride before pickup        |

---

### 🚗 Driver APIs (`/api/driver`)

| Method | Endpoint                          | Description                           |
|--------|-----------------------------------|---------------------------------------|
| GET    | `/check-ride-request`             | View available ride requests          |
| POST   | `/accept-ride-request/:id`        | Accept a ride                         |
| POST   | `/cancel-ride-request/:id`        | Cancel a ride (any role)              |
| PATCH  | `/pick-up/:id`                    | Mark ride as picked up                |
| PATCH  | `/in-transit/:id`                 | Mark ride in progress                 |
| PATCH  | `/complete-ride/:id`              | Mark ride as completed                |
| PATCH  | `/driver-update/:id`              | Update driver info                    |
| GET    | `/driver-state/:id`               | Get driver ride status                |

---

### 🛠️ Admin APIs (`/api/admin`)

| Method | Endpoint                            | Description                          |
|--------|-------------------------------------|--------------------------------------|
| GET    | `/user/all`                         | List all users                       |
| GET    | `/user/:id`                         | Get specific user                    |
| PATCH  | `/block-user/:id/:blockParam`       | Block/unblock user                   |
| DELETE | `/delete-blocked-user/:id`          | Remove blocked user                  |
| GET    | `/driver/all`                       | List all drivers                     |
| GET    | `/driver/:id`                       | Get specific driver                  |
| PATCH  | `/suspend-driver/:id/:suspendParam` | Suspend/unsuspend driver             |
| GET    | `/all-rides`                        | Get all ride requests                |
| GET    | `/ride/:id`                         | Get ride by ID                       |
| DELETE | `/ride/:id`                         | Delete a ride                        |

---

## 📍 Location Tracking

Each protected route uses `updateUserLocationIntoDb` to:

- Reverse geocode IP to city
- Track location changes (admin analytics / driver tracking)

---

## ✅ Validation – Zod

All incoming requests are validated using **Zod schemas** before hitting the business logic layer.

Example:
```ts
const authLogin = z.object({
  email: z.string().email(),
  password: z.string().min(6)
});
```

---

## 🧪 Sample cURL Request

### Registration

```bash
curl -X POST http://localhost:5000/api/user/create \
  -H "Content-Type: application/json" \
  -d '{
  "name": "Ashraful",
  "email": "ashraful.rider@example.com",
  "password": "SecurePass1",
  "role": "rider",
  "username": "ash_rider_1"
}
'
# driver
`{
  "name": "Rafsan the Driver",
  "email": "driver.rafsan@example.com",
  "password": "DriveSafe2024",
  "role": "driver",
  "username": "rafsan_driver_7",
  "vehicleInfo": {
    "license": "ABC123456",
    "model": "Toyota Corolla",
    "plateNumber": "DHK1234"
  },
  "driverStatus": "AVAILABLE"
}`

# admin
`{
  "name": "System Admin",
  "email": "admin@example.com",
  "password": "AdminSecurePass1",
  "role": "admin",
  "username": "admin_ashraful"
}
`



```


### Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "driver@example.com", "password": "123456"}'
```

### Request Ride (RIDER)
```bash
curl -X POST http://localhost:5000/api/ride/request \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"lat": "34.56", "lng": "34.343"}'
```

---

## ⏱ Background Jobs

- 🕛 `scheduleUserOfflineJob()` – Periodically marks users offline if inactive

---

## 🧰 Error Handling

Custom global error middleware:
- API-safe errors
- Consistent response structure
- Handles Zod, JWT, and DB errors 

---

## 🚀 Getting Started

```bash
# Install dependencies
npm install

# Copy env example
cp .env.example .env

# Run dev server
npm run dev
```

---

## 📌 .env Example

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/ride_system
JWT_SECRET=wt_secret
TOKEN_EXPIRES_IN=1d
```

---

---

## 🧑‍💻 Author

**Muhammad Ashraful**  
Full-Stack Developer 

----
