import React, { useState, useEffect, useRef } from "react";
// import axios from "axios";
import Entries from "./Entries";

// Функция-хук для периодического выполнения действия
function useInterval(callback, delay) {
  const savedCallback = useRef();

  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  useEffect(() => {
    function tick() {
      savedCallback.current();
    }
    if (delay !== null) {
      const id = setInterval(tick, delay);
      return () => clearInterval(id);
    }
  }, [delay]);
}

const TasksComponent = () => {
  const [tasks, setTasks] = useState([]);
  const [description, setDescription] = useState("");
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [shouldUpdate, setShouldUpdate] = useState(1);

  const handleUpdateAdditionalTable = () => {
    setShouldUpdate((prevVal) => prevVal + 1);
    // setShouldUpdate(!shouldUpdate);
  };

  const fetchTasks = () => {
    const formattedDate = selectedDate.toISOString().split("T")[0];
    console.log(`http://127.0.0.1:5555/tasks_by_date/${formattedDate}`);
    fetch(`http://127.0.0.1:5555/tasks_by_date/${formattedDate}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      }
    })
    .then((response) => response.json())
    .then((data) => {
      console.log(data)
      setTasks(data);
    })
    .catch((error) => console.error("Error fetching tasks:", error));
  }

  // Используем useEffect для загрузки задач при изменении даты
  useEffect(() => {
    fetchTasks();
  }, [selectedDate]);

  // Используем useInterval для периодического обновления времени каждую секунду
  useInterval(() => {
    // Пересчитываем общее время для каждой задачи
    const updatedTasks = tasks.map((task) => ({
      ...task,
      totalTime: calculateTotalTime(task),
      showStopBtn: isStopBtn(task)
    }));
    // console.log(updatedTasks)
    // Обновляем состояние задач с учетом пересчитанного времени
    setTasks(updatedTasks);
  }, 1000);

  // const fetchTasksA = async () => {
  //   try {
  //     const formattedDate = selectedDate.toISOString().split("T")[0];
  //     console.log(`http://127.0.0.1:5555/tasks_by_date/${formattedDate}`);
  //     const response = await axios.get(
  //       `http://127.0.0.1:5555/tasks_by_date/${formattedDate}`
  //     );
  //     console.log(response.data)
  //     setTasks(response.data);
  //   } catch (error) {
  //     console.error("Error fetching tasks:", error);
  //   }
  // };

  

  // Используем для отображения Старт/Стоп кнопки если есть открытый time_entry
  const isStopBtn = (task) => {
    let isStop = false

    task.time_entries.forEach((entry) => {
      if (entry.end_dt === null) {
        isStop = true
      }
    });

    return isStop
  }

  // проверяем нажимается кнопка Stop или Start
  // если Stop останавливаем счетчик времени
  // если Start останавливаем предыдуший и запускаем новый
  const isNewStart = (taskId) => {
    let newStart = true
    tasks.forEach((task) => {
      if (task.id === taskId && task.showStopBtn) {
        newStart = false
      }
    })
    console.log(newStart)
    return newStart
  }

  // const hideStopBtn = (taskId) => {
  //   setTasks((prevTasks) =>
  //     prevTasks.map((task) =>
  //       task.id === taskId
  //         ? {...task, showStopBtn: false} : task
  //     )
  //   );
  // }

  const handleStart = (taskId) => {
    if (isNewStart(taskId)) {
      stopAllEntries()

      const now = new Date();
      const easternTime = new Date(now.getTime() - (now.getTimezoneOffset() * 60000));
      const startDt = easternTime.toISOString().slice(0, 16);

      fetch("http://127.0.0.1:5555/task_entries", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          description: description,
          start_dt: startDt,
          task_id: taskId,
        })
      }).then((response) => {
        fetchTasks()
        handleUpdateAdditionalTable()
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
      }).catch((error) => console.error("Error starting task:", error));
      
      // console.log("3")
      // fetchTasks()
      // console.log("4")
      // fetchTasks()
      // console.log("5")
      // fetchTasks()
  
      // fetch("http://127.0.0.1:5555/task_entries", {
      //   method: "POST",
      //   headers: {
      //     "Content-Type": "application/json",
      //   },
      //   body: JSON.stringify({
      //     description: description,
      //     start_dt: startDt,
      //     task_id: taskId,
      //   }),
      // })
      //   .then((response) => {
      //     if (!response.ok) {
      //       throw new Error(`HTTP error! Status: ${response.status}`);
      //     }
      //   })
      //   .catch((error) => console.error("Error starting task:", error));
      // };
    
        
    
        // const newTaskEntry = await response.json();
    
        // setTasks((prevTasks) =>
        //   prevTasks.map((task) =>
        //     task.id === taskId
        //       ? { ...task, time_entries: Array.isArray(task.time_entries) ? [...task.time_entries, newTaskEntry] : [newTaskEntry] }
        //       : task
        //   )
        // );
    } else {
      stopAllEntries()
      // hideStopBtn(taskId)
    }
    
    fetchTasks()
    handleUpdateAdditionalTable()
    // fetchTasks()
    // fetchTasks()
  };

  const stopAllEntries = () => {
    const now = new Date();
    const easternTime = new Date(now.getTime() - (now.getTimezoneOffset() * 60000));
    const nowDt = easternTime.toISOString().slice(0, 16);
 
    fetch("http://127.0.0.1:5555/task_entries", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      }
    })
    .then((res) => res.json())
    .then((data) => {
      data.forEach((entry) => {
        if (entry.end_dt === null) {
          // console.log("2")
          // console.log('stop ', entry.id)
          fetch(`http://127.0.0.1:5555/task_entries/${entry.id}`, {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              end_dt: nowDt,
            })
          })
          .then(() => {
            fetchTasks()
            handleUpdateAdditionalTable()
          })
          .catch((error) => console.error("Error:", error));
        }
      })
    })
    .catch((error) => console.error("Error:", error));
  }

  const calculateTotalTime = (task) => {
    if (!task.time_entries || task.time_entries.length === 0) return "0h 00m 00s";

    let totalTime = 0;
    task.time_entries.forEach((entry) => {
      if (entry.start_dt && entry.end_dt && entry.end_dt !== null) {
        const startTime = new Date(entry.start_dt);
        const endTime = new Date(entry.end_dt);
        totalTime += endTime - startTime;
        // console.log(endTime, ' - ', startTime)
        // console.log("Total : ", totalTime)
      } else if (entry.start_dt && entry.end_dt === null) {
        const now = new Date();
        const easternTime = new Date(now.getTime() - (now.getTimezoneOffset() * 60000));
        const nowDt = easternTime.toISOString().slice(0, 19);
        const startTime = new Date(entry.start_dt);
        const endTime = new Date(nowDt);
        totalTime += endTime - startTime;
        // console.log(endTime, ' - ', startTime)
        // console.log("Total : ", totalTime)
      }
    });
    const seconds = Math.floor(totalTime / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    return `${hours}h ${minutes % 60}m ${seconds % 60}s`;
  };

  const calculatePlanTime = (task) => {
    if (!task.start_dt || task.end_dt.length === 0) return "0h 00m";

    let totalPlanTime = 0;
    if (task.start_dt && task.end_dt && task.end_dt !== null) {
      const startTime = new Date(task.start_dt);
      const endTime = new Date(task.end_dt);
      totalPlanTime += endTime - startTime;
      // console.log(endTime, ' - ', startTime)
      // console.log("Plan : ", totalPlanTime)
    }
    const seconds = Math.floor(totalPlanTime / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    return `${hours}h ${minutes % 60}m`;
    // return `${hours}h ${minutes % 60}m ${seconds % 60}s`;
  };

  return (
    <div className="container-fluid">
    <div className="">
    <h2>Time Tracker</h2>
      <br />
      <div className="mb-3">
        {/* <label htmlFor="datePicker">Choose a date:</label> */}
        <input
          type="date"
          id="datePicker"
          value={selectedDate.toISOString().split("T")[0]}
          onChange={(e) => setSelectedDate(new Date(e.target.value))}
        />
      </div>
      <div className="mb-3">
        <label  for="basic-url" className="form-label">Planed work comment: </label>
        <div className="input-group">
          <input
            type="text"
            className="form-control"
            value={description}
            size="100%"
            rows="10" cols="30"
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
      </div>
      <table className="table table-striped">
        <thead>
          <tr>
            <th style={{width: '80px'}}>Start</th>
            <th style={{width: '150px'}}>Task Name</th>
            <th style={{width: '250px'}}>Project Name</th>
            <th style={{width: '150px'}}>Start Time</th>
            <th style={{width: '150px'}}>End Time</th>
            <th style={{width: '150px'}}>Time Planned</th>
            <th style={{width: '150px'}}>Total Time</th>
          </tr>
        </thead>
        <tbody>
          {tasks.map((task) => (
            <tr key={task.id}>
              <td>
                <button type="button" className={task.showStopBtn ? "btn btn-danger btn-sm" : "btn btn-secondary btn-sm"} onClick={() => handleStart(task.id)}>{task.showStopBtn ? "Stop" : "Start"}</button>
              </td>
              <td>{task.name}</td>
              <td>{task.project.name}</td>
              <td>{task.start_dt.split(" ")[1].substring(5, 0)}</td>
              <td>{task.end_dt.split(" ")[1].substring(5, 0)}</td>
              {/* <td>{task.totalTime}</td> */}
              <td>{calculatePlanTime(task)}</td>
              <td>{calculateTotalTime(task)}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <Entries
        selectedDate={selectedDate}
        shouldUpdate={shouldUpdate}
      />
      </div>
    </div>
  );
};

export default TasksComponent;
