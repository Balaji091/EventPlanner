import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { RxHamburgerMenu } from "react-icons/rx";
import { IoMdNotificationsOutline } from "react-icons/io";
import { FaUser } from "react-icons/fa";
import { CiSearch, CiHeart } from "react-icons/ci";
import { AiOutlineLogout } from "react-icons/ai";
import { CgProfile } from "react-icons/cg";
import { MdEvent } from "react-icons/md";
import Cookies from "js-cookie";
import socket from "../../socket/connection";
import "./index.css";

const Header = () => {
    const [isDisplay, setIsDisplay] = useState(false);
    const [userEmail, setUserEmail] = useState("");
    const [unreadCount, setUnreadCount] = useState(0);
    const [notifications, setNotifications] = useState([]);
    const [isNotificationOpen, setIsNotificationOpen] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await axios.get("http://localhost:5001/auth/user", { withCredentials: true });
                setUserEmail(response.data.email);
            } catch (error) {
                console.error("Error fetching user details:", error);
            }
        };

        fetchUserData();
    }, []);

    useEffect(() => {
        if (!Cookies.get("authenticated")) {
            return;
        }
        socket.connect();
        socket.on("connected", (msg) => {
            console.log("Connection success");
        });

        socket.emit("join-notification", Cookies.get("authenticated"));

        socket.on("notification-in", () => {
            fetchUnreadCount();
            fetchAllNotifications();
        });

        return () => {
            socket.off("join-notification");
            socket.disconnect();
        };
    }, []);

    const fetchUnreadCount = async () => {
        try {
            const response = await axios.get(`http://localhost:5001/notifications/users/unread-count`, { withCredentials: true });
            setUnreadCount(response.data.unreadCount);
        } catch (error) {
            console.error("Error fetching unread notifications count:", error);
        }
    };

    const readMessages = async () => {
        try {
            const response = await axios.get(`http://localhost:5001/notifications/read`, { withCredentials: true });
            fetchUnreadCount()
        } catch (error) {
            console.error("Error fetching unread notifications count:", error);
        }
    };


    const fetchAllNotifications = async () => {
        try {
            const response = await axios.get("http://localhost:5001/notifications/users/notifications", { withCredentials: true });
            setNotifications(response.data.notifications);
        } catch (error) {
            console.error("Error fetching notifications:", error);
        }
    };

    useEffect(() => {
        fetchUnreadCount();
        fetchAllNotifications();
    }, []);

    const handleNotificationClick = async () => {
        setIsNotificationOpen(!isNotificationOpen);
        readMessages()
    };

    const displayProfile = () => {
        setIsDisplay(!isDisplay);
    };

    const handleLogout = async () => {
        try {
            await axios.get("http://localhost:5001/auth/logout", { withCredentials: true });
            toast.success("Logged out successfully!");
            Cookies.remove("authenticated");
            setTimeout(() => navigate("/login"), 1500);
        } catch (error) {
            toast.error("Logout failed. Try again.");
        }
    };

    return (
        <div className="header">
            <div className="header-left" onClick={() => navigate("/home")}>
                <img src="https://i.postimg.cc/JhBzS7fG/nexbook-mb-bg.jpg" className="header-logo-mb" alt="logo" />
                <h1 id="header-title">EventSphere</h1>
            </div>
            <div className="header-middle">
                <div className="search-container">
                    <div className="search-icon-container">
                        <CiSearch className="search-icon" />
                    </div>
                    <div className="search-input-container">
                        <input type="search" className="header-search" placeholder="Search" />
                    </div>
                </div>
            </div>
            <div className="header-right">
                <div className="notification-container" onClick={handleNotificationClick}>
                    <IoMdNotificationsOutline className="notification" />
                    {unreadCount > 0 && <span className="notification-badge">{unreadCount}</span>}
                </div>
                <FaUser className="user" onClick={displayProfile} />
            </div>
            <div className="header-right-mobile">
                <RxHamburgerMenu className="options-icon" onClick={displayProfile} />
            </div>

            {/* Notifications Popup */}
            {isNotificationOpen && (
                <div className="notifications-popup">
                    <h3 className="notifications-title">Notifications</h3>
                    <div className="notifications-list">
                        {notifications.length > 0 ? (
                            notifications.map((notification, index) => (
                                <div key={index} className={`notification-item ${notification.read ? "" : "unread"}`}>
                                    <p className="notification-message">{notification.message}</p>
                                </div>
                            ))
                        ) : (
                            <p className="no-notifications">No notifications available</p>
                        )}
                    </div>
                </div>
            )}

            {/* Profile Popup */}
            {isDisplay && (
                <div className="profile-container">
                    <div className="profile-popup-top-container">
                        <CgProfile className="profile-icon" />
                        <div className="profile-popup-details-container">
                            <p className="profile-popup-mail">{userEmail || "Loading..."}</p>
                        </div>
                    </div>
                    <div className="profile-popup-bottom-container">
                        <div className="profile-popup-text-container" onClick={() => navigate("/myevent-dashboard")}>
                            <MdEvent className="profile-popup-notification" />
                            <p className="profile-popup-text">My Events</p>
                        </div>
                        <div className="profile-popup-text-container" onClick={() => navigate("/interested-events")}>
                            <CiHeart className="profile-popup-notification" />
                            <p className="profile-popup-text">Interested</p>
                        </div>
                        <hr />
                        <div className="profile-popup-text-container" onClick={handleLogout}>
                            <AiOutlineLogout className="popup-logout-icon" />
                            <p className="profile-popup-text">Logout</p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Header;
