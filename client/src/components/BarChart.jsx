import React, { useState, useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';

const BarChartComponent = () => {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [data, setData] = useState([]);
  const [taskEntriesData, setTaskEntriesData] = useState([]);
  const chartRef = useRef(null);
  const taskEntriesChartRef = useRef(null);

  // Загрузка данных для первого графика
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`http://127.0.0.1:5555/tasks_by_date/${selectedDate}`);
        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }
        const jsonData = await response.json();
        setData(jsonData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, [selectedDate]);

  // Загрузка данных для второго графика
  useEffect(() => {
    const fetchTaskEntriesData = async () => {
      try {
        const response = await fetch(`http://127.0.0.1:5555/task_entries_by_date/${selectedDate}`);
        if (!response.ok) {
          throw new Error('Failed to fetch task entries data');
        }
        const jsonData = await response.json();
        setTaskEntriesData(jsonData);
      } catch (error) {
        console.error('Error fetching task entries data:', error);
      }
    };
    fetchTaskEntriesData();
  }, [selectedDate]);

  // Создание первого графика (как в исходном коде)
  useEffect(() => {
    if (!data || data.length === 0) {
      console.log("No data to display for tasks");
      return;
    }

    const categories = {};
    data.forEach(item => {
      const projectName = item.project.name;
      const startTime = new Date(item.start_dt);
      const endTime = new Date(item.end_dt);
      const duration = (endTime - startTime) / (1000 * 60 * 60); // Convert milliseconds to hours

      if (!categories[projectName]) {
        categories[projectName] = 0;
      }
      categories[projectName] += duration;
    });

    const labels = Object.keys(categories);
    const durations = Object.values(categories);

    const ctx = chartRef.current.getContext('2d');
    if (chartRef.current.chartInstance) {
      chartRef.current.chartInstance.destroy();
    }
    chartRef.current.chartInstance = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [{
          label: 'Total Time by Project (hours)',
          data: durations,
          backgroundColor: 'rgba(54, 162, 235, 0.2)',
          borderColor: 'rgba(54, 162, 235, 1)',
          borderWidth: 1
        }]
      },
      options: {
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });
  }, [data]);

  // Создание второго графика
  useEffect(() => {
    if (!taskEntriesData || taskEntriesData.length === 0) {
      console.log("No task entries data to display");
      return;
    }

    const projectTime = {};

    taskEntriesData.forEach(entry => {
      if (entry.end_dt != null) {
        const projectName = entry.task.project.name;
        const startTime = new Date(entry.start_dt);
        const endTime = new Date(entry.end_dt);
        const duration = (endTime - startTime) / (1000 * 60 * 60); // Convert milliseconds to hours

        if (!projectTime[projectName]) {
          projectTime[projectName] = 0;
        }
        projectTime[projectName] += duration;
      }
    });

    const labels = Object.keys(projectTime);
    const durations = Object.values(projectTime);

    const ctx = taskEntriesChartRef.current.getContext('2d');
    if (taskEntriesChartRef.current.chartInstance) {
      taskEntriesChartRef.current.chartInstance.destroy();
    }
    taskEntriesChartRef.current.chartInstance = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [{
          label: 'Total Time by Project (hours)',
          data: durations,
          backgroundColor: 'rgba(255, 99, 132, 0.2)',
          borderColor: 'rgba(255, 99, 132, 1)',
          borderWidth: 1
        }]
      },
      options: {
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });
  }, [taskEntriesData]);

  const handleDateChange = (e) => {
    setSelectedDate(e.target.value);
  };

  return (
    <div class="container-fluid">
    <div class="">
      <h2>Time Charts</h2>
      <br></br>
      <div style={{ marginBottom: '20px' }}>
        {/* <label htmlFor="datePicker">Select Date:</label> */}
        <input 
          type="date" 
          id="datePicker" 
          value={selectedDate} 
          onChange={handleDateChange} 
        />
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center' }}>
        <div style={{ width: '400px', height: 'auto', textAlign: 'center' }}>
          <h2>Plan</h2>
          <canvas ref={chartRef} width="400" height="400"></canvas>
        </div>
        <div style={{ width: '400px', height: 'auto', textAlign: 'center' }}>
          <h2>Fact</h2>
          <canvas ref={taskEntriesChartRef} width="400" height="400"></canvas>
        </div>
      </div>
      </div>
    </div>
  );
};

export default BarChartComponent;
