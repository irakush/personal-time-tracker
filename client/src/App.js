import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./App.css";
import Navigation from "./components/Navigation";
import UsersList from "./components/UsersList";
import Home from "./components/Home";
import Tasks from "./components/Tasks";
import TaskCategories from "./components/TaskCategories";
import Projects from "./components/Projects";
import TaskStatuses from "./components/TaskStatuses";
import TaskTable from "./components/TaskTable";
import BarChart from "./components/BarChart";

import "bootstrap/dist/css/bootstrap.min.css";
import "./lib/styles/nav.css";

function App() {
  const [sidebar, setSidebar] = useState(false);
  const showSidebar = () => setSidebar(!sidebar);
  const toggle = sidebar ? "toggled" : "";

  // const []
  useEffect(() => {
    const button = document.querySelector("#sidebar-toggle");
    const wrapper = document.querySelector("#wrapper");

    // if (button === null) {
    //   console.log("nullllll");
    //   return;
    // }

    button.addEventListener("click", (e) => {
      e.preventDefault();
      showSidebar();
      // console.log(wrapper.classList);
      // wrapper.classList.toggle("toggled");
    });
  });

  return (
    <Router>
      <div id="wrapper" className={toggle}>
        <Navigation />
        <Routes>
          <Route path="/home" element={<Home />} />
          <Route path="/" element={<Tasks />} />
          <Route path="/users" element={<UsersList />} />
          <Route path="/task_categories" element={<TaskCategories />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/task_statuses" element={<TaskStatuses />} />
          <Route path="/task_table" element={<TaskTable />} />
          <Route path="/bar_chart" element={<BarChart />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
