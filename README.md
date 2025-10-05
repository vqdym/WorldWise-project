# WorldWise

**WorldWise** is an interactive web application that allows users to track and visualize the places they've visited around the globe. Built with React, it leverages technologies such as the React Context API, Leaflet for maps, and JSON Server for simulating a backend.

---

## Features

- **Interactive Map**: Click on the map to add cities you've visited.
- **Geolocation Support**: Automatically center the map on your current location.
- **City List**: View a list of cities you've added, along with their countries.
- **Routing**: Navigate between different views using React Router.
- **State Management**: Manage global state with the Context API and `useReducer`.
- **Map Integration**: Utilize Leaflet for interactive maps.
- **Mock Backend**: Simulate API calls with JSON Server.
- **Fake Login**: Users can "log in" and "log out" with a fake authentication system for testing purposes.
- **Real‑time Location Tracking**: Continuously monitor your current position on the map.
- **Share Location**: Send your current location or any point on the map to friends via a shareable link.

---

## Technologies Used

- HTML5
- CSS Modules
- JavaScript
- React
- React Router
- Context API

---

## Installation

1. Clone the repository:  
   ```bash
   git clone https://github.com/vqdym/WorldWise-project.git
   ```

2. Navigate to the project directory:
   ```bash
   cd WorldWise
   ```

3. Install dependencies:
   ```bash
   npm install
   ```

4. Start the fake API server:
   ```bash
   npm run server
   ```

5. In another terminal, start the development server:
   ```bash
   npm run dev
   ```
