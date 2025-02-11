import React from "react";
import { ToastContainer } from "react-toastify";
import {  BrowserRouter as Router,Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import Signup from "./components/SignUp";
import EventCardDetails from "./components/HomePage/EventCardDetails";
import Home from "./components/HomePage/Home";
import EventDashboard from "./components/ MyDashBoard Page/MyEventsDashBoard";
import AddEvent from "./components/ MyDashBoard Page/AddEvent";
import InterestedEvents from "./components/IntrestedPage/IntrestedEvents";
import MyEventDetailsCard from "./components/ MyDashBoard Page/MyEventDetails";
import ProtectedRoute from "./components/ProtectedRoute";
import Header from "./components/Header";
import LiveRoom from "./components/LiveEvent/liveroom";
import GuestProtectedRoute from "./components/GuestProtectedRoute"

function App() {
  return (
    <Router>
      <div className="App">
        <ToastContainer position="top-right" autoClose={3000} />
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          <Route element={<GuestProtectedRoute />}>
              <Route path="/" element={<Home />} />
              <Route path="/home" element={<Home />} />
              <Route path="/events/:event_id" element={<EventCardDetails />} />
              <Route path="/live-event/:event_id" element={<LiveRoom />}/>
              {/* Protected Routes (Only for logged-in users) */}
              <Route element={<ProtectedRoute />}>
              <Route path="/interested-events" element={<InterestedEvents />} />
                <Route path="/myevent-dashboard" element={<EventDashboard />} />
                <Route path="/my-events/:event_id" element={<MyEventDetailsCard />} />
                <Route path="/add-event" element={<AddEvent />} />
              </Route>
          </Route>
        </Routes>
      </div>
    </Router>
  );
}

export default App;
