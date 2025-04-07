# Real-Time Chat Application with WebSocket

![Chat App](https://img.shields.io/badge/Chat-App-brightgreen)
![Spring Boot](https://img.shields.io/badge/Spring%20Boot-WebSocket-green)
![Next.js](https://img.shields.io/badge/Next.js-Redux-blue)
![PostgreSQL](https://img.shields.io/badge/Database-PostgreSQL-orange)

A real-time chat application using WebSocket, allowing multiple users to connect simultaneously and exchange messages that are stored in a PostgreSQL database.

## ✨ Features

- 💬 Real-time chat with WebSocket
- 👤 User authentication with email & password using Spring Security
- 📅 Message storage in PostgreSQL database
- 📜 Chat history retrieval upon connection
- 🔄 Real-time updates for all connected users
- 🎉 Welcome message for new users
- 📱 Responsive interface built with Next.js and Redux

## 🛠️ Technologies Used

### Backend
- **Spring Boot**: Java framework for rapid application development
- **Spring WebSocket**: For bidirectional real-time communication
- **Spring Security**: For authentication and authorization
- **Spring Data JPA**: For database interaction
- **PostgreSQL**: Relational database management system

### Frontend
- **Next.js**: React framework for server-side rendering and interface development
- **Redux**: For application state management
- **STOMP/stompjs (client-side)**: For establishing WebSocket connection with the server
- **Tailwind CSS**: For styling and layout

## 🚀 Installation

### Prerequisites

- Java 17
- Node.js 22
- PostgreSQL
- Maven

### Database Configuration

1. Create a PostgreSQL database:

```sql
CREATE DATABASE chat;
```

2. Table structure will be automatically created by Hibernate when the application is first launched.

### Backend Configuration

1. Clone the repository:

```bash
git clone https://github.com/mamyDinyah34/Exam-Chat.git
cd Exam-Chat/backend
```

2. Configure the database in `src/main/resources/application.properties`:

```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/chat
spring.datasource.username=postgres
spring.datasource.password=yourpassword
spring.jpa.hibernate.ddl-auto=update
```

3. Launch the Spring Boot application:

```bash
mvn spring-boot:run
```

The server will be available at `http://localhost:8080`.

### Frontend Configuration

1. Access the frontend directory:

```bash
cd ../frontend
```

2. Install dependencies:

```bash
npm install
```

3. Launch the Next.js application:

```bash
npm run dev
```

The application will be available at `http://localhost:3000`.

## 📝 Usage

1. Open the application in your browser at `http://localhost:3000`
2. Register or log in with your email and password
3. Start exchanging messages with other connected users
4. Messages are automatically saved and displayed in real-time for all users


## 🖼️ Screenshots



## 🔧 Possible Improvements

- User presence indicators
- Authentication via third-party services (Google, Facebook, GitHub)
- File and image sharing 
- Support for audio and video messages 
- Offline mode with automatic synchronization 
- End-to-end message encryption

## 👥 Contribution

Contributions are welcome! Feel free to open an issue or submit a pull request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

