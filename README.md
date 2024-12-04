# Libaas-by-Fahad-Noor
## How to set up
1. **Ensure Node.js and npm are installed**: Before you begin, make sure you have Node.js and npm (Node Package Manager) installed on your system. You can check this by running the following commands in your terminal:
```
node -v
npm -v
```
2. **Navigate to your project directory**: Open your terminal and change to the directory where your MERN stack project is located. You can do this by using the cd command:
```
cd /path/to/your/project
```
3. **Install dependencies**: This project requires some dependencies. To install these, run:
```
npm install concurrently --save-dev
npm install chart.js react-chartjs-2 express-async-handler bcryptjs jsonwebtoken
```
4. **Configure .env**: Create a `.env` file and place it in same place as `.env.example`. Then enter port, mongo uri and secret key 
5. **Start**: Run the project:
```
npm start
```
To run only backend:
```
npm run server
```
To run only frontend
```
npm run client
```
