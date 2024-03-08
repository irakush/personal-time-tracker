import React, { useState } from "react";
import { Link } from "react-router-dom";

function Navigation() {
  const [activeItem, setActiveItem] = useState("");

  const handleItemClick = (itemName) => {
    setActiveItem(itemName);
  };

  return (
    <>
      <link
        href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css"
        rel="stylesheet"
        integrity="sha384-T3c6CoIi6uLrA9TneNEoa7RxnatzjcDSCmG1MXxSR1GAsXEV/Dwwykc2MPK8M2HN"
        crossOrigin="anonymous"
      />
      <link
        rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css"
      />

      <script
        src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js"
        integrity="sha384-C6RzsynM9kWDrMNeT87bh95OGNyZPhcTNXj1NW7RuBCsyN/o0jlpcV8Qyq46cDfL"
        crossOrigin="anonymous"
      ></script>

      <aside id="sidebar-wrapper">
        <div className="sidebar-brand">
          <h2>
            Personal <font style={{color:"red"}}>Time</font>Tracker
          </h2>
        </div>
        <ul className="sidebar-nav">
          <li className={activeItem === "time" ? "active" : ""}>
            <Link to="/" onClick={() => handleItemClick("time")}>
              <i className="fa-solid fa-calendar fa-sm"></i>&#160;&#160;&#160;
              Time Planner
            </Link>
          </li>
          <li className={activeItem === "task_table" ? "active" : ""}>
            <Link to="/task_table" onClick={() => handleItemClick("task_table")}>
              <i className="fa-solid fa-calendar-check fa-sm"></i>&#160;&#160;&#160;
              Time Tracker
            </Link>
          </li>
          <li className={activeItem === "charts" ? "active" : ""}>
            <Link to="/bar_chart" onClick={() => handleItemClick("charts")}>
              <i className="fa-solid fa-bar-chart fa-sm"></i>&#160;&#160;&#160;
              Time Charts
            </Link>
          </li>
          <li className={activeItem === "projects" ? "active" : ""}>
            <Link to="/projects" onClick={() => handleItemClick("projects")}>
              <i className="fa-solid fa-briefcase fa-sm"></i>&#160;&#160;&#160;
              Projects
            </Link>
          </li>
          <li className={activeItem === "task_categories" ? "active" : ""}>
            <Link
              to="/task_categories"
              onClick={() => handleItemClick("task_categories")}
            >
              <i className="fa-solid fa-briefcase fa-sm"></i>&#160;&#160;&#160;
              Task Categories
            </Link>
          </li>
          <li className={activeItem === "task_statuses" ? "active" : ""}>
            <Link
              to="/task_statuses"
              onClick={() => handleItemClick("task_statuses")}
            >
              <i className="fa-solid fa-briefcase fa-sm"></i>&#160;&#160;&#160;
              Task Statuses
            </Link>
          </li>
          <li className={activeItem === "users" ? "active" : ""}>
            <Link to="/users" onClick={() => handleItemClick("users")}>
              <i className="fa-solid fa-user-circle fa-sm"></i>&#160;&#160;&#160;
              Users
            </Link>
          </li>
        </ul>
      </aside>

      <div id="navbar-wrapper">
        <nav className="navbar navbar-inverse">
          <div className="container-fluid">
            <div className="navbar-header">
              <a href="" className="navbar-brand" id="sidebar-toggle">
                <i className="fa fa-bars"></i>
              </a>
            </div>
          </div>
        </nav>
      </div>
    </>
  );
}

export default Navigation;
