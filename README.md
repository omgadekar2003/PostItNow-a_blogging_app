# 📝 Blog API with User Authentication

This is a **RESTful API** built using **Node.js**, **Express.js**, and **MongoDB** that allows users to create, read, update, and delete (CRUD) blog posts. Users can register, log in, and manage their posts with authentication and authorization.

## 🚀 Features
- User Authentication (Register, Login, Logout)
- CRUD operations on blog posts
- View all posts or specific posts by users
- Uses **JWT (JSON Web Tokens)** for secure authentication
- Database storage with **MongoDB & Mongoose**
- File uploads using **Multer**
- API testing with **Postman & Thunder Client**

## 🛠️ Technologies Used
- **Node.js** - Backend runtime
- **Express.js** - Web framework
- **MongoDB & Mongoose** - Database & ODM
- **JSON Web Token (JWT)** - Authentication
- **Bcrypt.js** - Password hashing
- **Multer** - File uploads
- **Thunder Client / Postman** - API testing

## 📂 API Endpoints

### 🔹 Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/register` | Register a new user |
| POST | `/login` | Log in a user |
| POST | `/logout` | Log out a user |

### 🔹 User Management
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/users` | Get all users |
| GET | `/users/:email` | Get user by email |
| PATCH | `/users/:email` | Update user by email |
| DELETE | `/users/:email` | Delete user by email |

### 🔹 Blog Posts
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/posts` | Create a new post |
| GET | `/posts` | Get all posts |
| GET | `/posts/:id` | Get a specific post |
| PATCH | `/posts/:id` | Update a post |
| DELETE | `/posts/:id` | Delete a post |

## 🛠️ Installation & Setup
1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/your-repo-name.git
   cd your-repo-name
