Here's a `README.md` file for your project:  


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
   bash
   git clone https://github.com/omgadekar2003/PostItNow-a_blogging_app.git)
   cd your-repo-name
  
3. **Install dependencies**
   bash
   npm install
 
4. **Create a `.env` file and add the following variables**
 
   PORT=5000
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_secret_key
  
5. **Run the server**
  bash
   npm start
 
   or with **nodemon**:
   bash
   npm run dev


## 🎯 Testing with Thunder Client / Postman
- Import the API collection into **Postman** or **Thunder Client**
- Use JSON body format for requests
- Set `Authorization` header with `Bearer <token>` for protected routes

## 🏆 Special Thanks
I never wanted to learn backend development, but **Harsh Sharma** inspired me to dive into it. Huge shoutout to **Sheryians Coding School**. **APPRECIATED!** 🎉

---

💡 *Feel free to contribute, open issues, or fork this repository!*  
📌 **Author:** *Your Name*  
📌 **GitHub:** [omgadekar2003](https://github.com/omgadekar2003)  
📌 **LinkedIn:** [om gadekar](https://linkedin.com/in/omgadekar)


Replace `yourusername`, `your-repo-name`, and `your-profile` with your actual details. Let me know if you need modifications! 🚀
