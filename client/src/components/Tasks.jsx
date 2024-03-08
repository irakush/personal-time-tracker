import React, { useState, useEffect } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import { Container, Modal, Button, Form } from 'react-bootstrap';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import 'bootstrap/dist/css/bootstrap.min.css';

//Setup first day of the week.
moment.locale("es-es", {
	week: {
		dow: 1 //Monday is the first day of the week.
	}
});
const localizer = momentLocalizer(moment);

const TasksComponent = () => {
  // Состояния для хранения данных
  const [tasks, setTasks] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [currentTask, setCurrentTask] = useState({});
  const [statuses, setStatuses] = useState([]);
  const [users, setUsers] = useState([]);
  const [projects, setProjects] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isEditMode, setIsEditMode] = useState(false);

  // При монтировании компонента
  useEffect(() => {
    fetchInitialData();
  }, []);

  // Загрузка начальных данных
  const fetchInitialData = async () => {
    fetchTasks();
    fetchData('http://127.0.0.1:5555/task_statuses', setStatuses);
    fetchData('http://127.0.0.1:5555/users', setUsers);
    fetchData('http://127.0.0.1:5555/projects', setProjects);
    fetchData('http://127.0.0.1:5555/task_categories', setCategories);
  };

  // Универсальная функция для загрузки данных
  const fetchData = async (url, setState) => {
    const response = await fetch(url);
    const data = await response.json();
    setState(data);
  };

  // Загрузка задач
  const fetchTasks = async () => {
    // /user/2
    fetchData('http://127.0.0.1:5555/tasks', data => {
      const formattedTasks = data.map(task => ({
        ...task,
        start: new Date(task.start_dt),
        end: new Date(task.end_dt),
        title: task.name,
      }));
      setTasks(formattedTasks);
    });
  };

  // Открытие модального окна для создания новой задачи
  const handleNewTask = () => {
    setIsEditMode(false);
    setCurrentTask({});
    setShowModal(true);
  };

  // Открытие модального окна для просмотра или редактирования
  const handleSelectTask = (task) => {
    setIsEditMode(true);
    setCurrentTask(task);
    setShowModal(true);
  };

  // Обработка отправки формы
  const handleSubmit = async (event) => {
    event.preventDefault();
    const form = event.target;
    const task = {
      name: form.name.value,
      description: form.description.value,
      status_id: form.status_id.value,
      start_dt: form.start_dt.value,
      end_dt: form.end_dt.value,
      user_id: form.user_id.value,
      project_id: form.project_id.value,
      category_id: form.category_id.value,
    };

    console.log(task)

    const url = isEditMode ? `http://127.0.0.1:5555/tasks/${currentTask.id}` : 'http://127.0.0.1:5555/tasks';
    const method = isEditMode ? 'PATCH' : 'POST';

    await fetch(url, {
      method: method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(task),
    });

    setShowModal(false); 
    fetchTasks();
  };

  // Удаление задачи
  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      await fetch(`http://127.0.0.1:5555/tasks/${currentTask.id}`, {
        method: 'DELETE',
      });
      setShowModal(false);
      fetchTasks();
    }
  };

  return (
    <div class="container-fluid">
    <div class="">
      <h2>Time Planner</h2>
      <Container>
      <br></br>
        <Button variant="btn btn-danger btn-sm" onClick={handleNewTask}>+</Button>
        <br></br><br></br>
        <Calendar
          localizer={localizer}
          events={tasks}
          defaultView='week'
          startAccessor="start"
          endAccessor="end"
          style={{ height: 1200 }}
          onSelectEvent={handleSelectTask}
        />
        <Modal show={showModal} onHide={() => setShowModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>{isEditMode ? 'Task details' : 'New task'}</Modal.Title>
          </Modal.Header>
          <Form onSubmit={handleSubmit}>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>Task</Form.Label>
              <Form.Control type="text" name="name" defaultValue={currentTask.name || ''} required />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control as="textarea" name="description" defaultValue={currentTask.description || ''} />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Task type</Form.Label>
              <Form.Select name="status_id" defaultValue={currentTask.status_id || ''} required>
                {statuses.map(status => (
                  <option key={status.id} value={status.id}>{status.name}</option>
                ))}
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Start date/time</Form.Label>
              <Form.Control type="datetime-local" name="start_dt" defaultValue={currentTask.start_dt ? moment(currentTask.start_dt).format("YYYY-MM-DDTHH:mm") : ''} required />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>End date/time</Form.Label>
              <Form.Control type="datetime-local" name="end_dt" defaultValue={currentTask.end_dt ? moment(currentTask.end_dt).format("YYYY-MM-DDTHH:mm") : ''} required />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>User</Form.Label>
              <Form.Select name="user_id" defaultValue={currentTask.user_id || ''} required>
                {users.map(user => (
                  <option key={user.id} value={user.id}>{user.name}</option>
                ))}
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Project</Form.Label>
              <Form.Select name="project_id" defaultValue={currentTask.project_id || ''} required>
                {projects.map(project => (
                  <option key={project.id} value={project.id}>{project.name}</option>
                ))}
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Category</Form.Label>
              <Form.Select name="category_id" defaultValue={currentTask.category_id || ''} required>
                {categories.map(category => (
                  <option key={category.id} value={category.id}>{category.name}</option>
                ))}
              </Form.Select>
            </Form.Group>
          </Modal.Body>
            <Modal.Footer>
              <Button variant="btn btn-secondary btn-sm" onClick={() => setShowModal(false)}>Cancel</Button>
              {isEditMode && (
                <Button variant="btn btn-danger btn-sm" onClick={handleDelete}>Delete</Button>
              )}
              <Button variant="btn btn-primary btn-sm" type="submit">Save</Button>
            </Modal.Footer>
          </Form>
        </Modal>
      </Container>
    </div>
    </div>
  );
};

export default TasksComponent;