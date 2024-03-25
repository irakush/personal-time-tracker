import React, { useState, useEffect } from "react";

const Entries = ({ selectedDate, shouldUpdate }) => {
  const url = 'http://192.168.12.144:5555'
  const [entries, setEntries] = useState([]);

  useEffect(() => {
    const fetchEntries = async () => {
      try {
        // const formattedDate = selectedDate.toISOString().split("T")[0];
        const formattedDate = selectedDate;
        const response = await fetch(`${url}/task_entries_by_date/${formattedDate}`);
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        console.log("entries ", data)
        setEntries(data);
      } catch (error) {
        console.error("Error fetching entries:", error);
      }
    };

    if (shouldUpdate) {
      fetchEntries();
    }
  }, [selectedDate, shouldUpdate]);

  return (
    <div>
      <br></br>
      <h2>Time entry list</h2>
      <table className="table table-striped">
        <thead>
          <tr>
            <th>ID</th>
            <th>Task Name</th>
            <th>Description</th>
            <th>Start Time</th>
            <th>End Time</th>
          </tr>
        </thead>
        <tbody>
          {entries.map((entry) => (
            <tr key={entry.id}>
              <td>{entry.id}</td>
              <td>{entry.task.name}</td>
              <td>{entry.description}</td>
              <td>{entry.start_dt}</td>
              <td>{entry.end_dt}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Entries;
