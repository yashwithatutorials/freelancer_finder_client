📌 Freelancer Finder
Freelancer Finder is a full-stack MERN (MongoDB, Express.js, React, Node.js) web application that connects freelancers with clients. Clients can post jobs, and freelancers can browse, apply, and manage their profiles.

🌐 Live Demo
Frontend:https://freelancer-finder-client.vercel.app/
Backend: https://freelancer-finder.onrender.com



🧰 Tech Stack
Frontend: React, React Router, Tailwind CSS / CSS

Backend: Node.js, Express.js

Database: MongoDB (with Mongoose)

Hosting: Vercel (frontend), Render (backend)

🔑 Features
✅ For Freelancers
Signup/Login

Upload profile image and resume

Add skills, experience, and bio

Search and filter jobs

Apply to jobs

Chat with clients 

✅ For Clients
Signup/Login

Create and post jobs

Upload company logo

View and manage applicants

Chat with freelancers 

🚀 Getting Started Locally
1. Clone the Repository
bash
Copy
Edit
git clone https://github.com/yashwithatutorials/freelancer_finder_client.git
cd freelancer_finder
2. Frontend Setup
bash
Copy
Edit
cd client
npm install
npm start
3. Backend Setup
bash
Copy
Edit
git clone https://github.com/yashwithatutorials/freelancer_finder_server.git
cd server
npm install
node index.js
Make sure to configure your .env in the backend with:

env
Copy
Edit
MONGODB_URI=your_mongo_uri
📁 Folder Structure
bash
Copy
Edit
freelancer_finder/
├── client/             # React frontend
│   ├── components/
│   ├── pages/
│   └── ...
├── server/             # Express backend
│   ├── models/
│   ├── routes/
│   ├── uploads/
│   └── ...


