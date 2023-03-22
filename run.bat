git switch main
cd server
start "" /B cmd /C ".\mvnw spring-boot:run"
cd ..
cd client
npm start