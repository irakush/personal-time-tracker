import React, { useState, useEffect } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import { Container, Button, Modal, Form } from 'react-bootstrap';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import 'bootstrap/dist/css/bootstrap.min.css';

const localizer = momentLocalizer(moment);

const Tasks = () => {
  const [tasks, setTasks] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editableTask, setEditableTask] = useState(null); // Для редактирования задачи
  const [selectedTask, setSelectedTask] = useState(null); // Для просмотра деталей задачи
  const [statuses, setStatuses] = useState([]);
  const [users, setUsers] = useState([]);
  const [projects, setProjects] = useState([]);
  const [categories, setCategories] = useState([]);

  const fetchData = async (url, setState) => {
    try {
      const response = await fetch(url);
      const data = await response.json();
      setState(data);
    } catch (error) {
      console.error(`Ошибка при загрузке данных с ${url}:`, error);
    }
  };
  
  const fetchStatuses = () => fetchData('http://127.0.0.1:5555/task_statuses', setStatuses);
  const fetchUsers = () => fetchData('http://127.0.0.1:5555/users', setUsers);
  const fetchProjects = () => fetchData('http://127.0.0.1:5555/projects', setProjects);
  const fetchCategories = () => fetchData('http://127.0.0.1:5555/task_categories', setCategories);

  // Загрузка задач с сервера
  const fetchTasks = async () => {
    try {
      const response = await fetch('http://127.0.0.1:5555/tasks');
      const data = await response.json();
      const formattedTasks = data.map(task => ({
        ...task,
        start: new Date(task.start_dt),
        end: new Date(task.end_dt),
        title: task.name,
      }));
      setTasks(formattedTasks);
    } catch (error) {
      console.error('Ошибка при загрузке задач:', error);
    }
  };

  useEffect(() => {
    fetchTasks();
    fetchStatuses();
    fetchUsers();
    fetchProjects();
    fetchCategories();
  }, []);

  const handleModalOpen = (task = null, isEditable = false) => {
    if (isEditable) {
      setEditableTask(task);
      setSelectedTask(null);
    } else {
      setSelectedTask(task);
      setEditableTask(null);
    }
    setShowModal(true);
  };

  const handleModalClose = () => {
    setShowModal(false);
    setSelectedTask(null);
    setEditableTask(null);
  };

  const handleSelectEvent = (task) => {
    handleModalOpen(task, false);
  };

  // const handleSubmit = async (event) => {
  //   event.preventDefault();
  //   // Обработка формы для создания/редактирования задачи
  //   handleModalClose();
  //   fetchTasks();
  // };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const taskData = Object.fromEntries(formData.entries());
    // Преобразование дат и времени в формат ISO для совместимости с сервером
    // taskData.start_dt = new Date(taskData.start_dt).toISOString();
    // taskData.end_dt = new Date(taskData.end_dt).toISOString();
  
    // Определение URL и метода для запроса
    const url = editableTask ? `http://127.0.0.1:5555/tasks/${editableTask.id}` : 'http://127.0.0.1:5555/tasks';
    const method = editableTask ? 'PATCH' : 'POST';
  
    try {
      const response = await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(taskData),
      });
  
      if (response.ok) {
        // Если запрос успешен, закрываем модальное окно и обновляем список задач
        handleModalClose();
        fetchTasks();
      } else {
        // Обработка возможных ошибок ответа сервера
        console.error('Ошибка сервера:', await response.text());
      }
    } catch (error) {
      console.error('Ошибка при отправке данных на сервер:', error);
    }
  };

  const handleDelete = async (taskId) => {
    const url = `http://127.0.0.1:5555/tasks/${taskId}`;
    try {
      const response = await fetch(url, {
        method: 'DELETE',
      });
  
      if (response.ok) {
        // Успешное удаление задачи, обновляем список задач
        fetchTasks();
      } else {
        console.error('Ошибка при удалении задачи:', response.statusText);
      }
    } catch (error) {
      console.error('Ошибка при выполнении запроса на удаление:', error);
    }
  };

  return (
    <Container>
      <br></br>
      <Button variant="primary" onClick={() => handleModalOpen(null, true)}>Add task</Button>
      <Calendar
        localizer={localizer}
        events={tasks}
        defaultView='day'
        startAccessor="start"
        endAccessor="end"
        style={{ height: 700, marginTop: 20 }}
        onSelectEvent={handleSelectEvent}
      />

<Modal show={showModal} onHide={handleModalClose}>
  <Modal.Header closeButton>
    <Modal.Title>{editableTask ? 'Редактировать задачу' : 'Новая задача'}</Modal.Title>
  </Modal.Header>
  <Form onSubmit={handleSubmit}>
    <Modal.Body>
      {editableTask ? (
        <>
          {/* Поля для редактирования задачи */}
          <Form.Group className="mb-3">
            <Form.Label>Название</Form.Label>
            <Form.Control type="text" name="name" defaultValue={editableTask.name} required />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Описание</Form.Label>
            <Form.Control as="textarea" name="description" defaultValue={editableTask.description} />
          </Form.Group>
          {/* Дополнительные поля для редактирования */}
        </>
      ) : (
        <>
          {/* Поля для создания новой задачи */}
          <Form.Group className="mb-3">
            <Form.Label>Название</Form.Label>
            <Form.Control type="text" name="name" required />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Описание</Form.Label>
            <Form.Control as="textarea" name="description" />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Status</Form.Label>
            <Form.Select name="status_id" required>
              {statuses.map(status => <option key={status.id} value={status.id}>{status.name}</option>)}
            </Form.Select>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Start Date and Time</Form.Label>
            <Form.Control type="datetime-local" name="start_dt" required />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>End Date and Time</Form.Label>
            <Form.Control type="datetime-local" name="end_dt" required />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>User</Form.Label>
            <Form.Select name="user_id" required>
              {users.map(user => <option key={user.id} value={user.id}>{user.name}</option>)}
            </Form.Select>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Project</Form.Label>
            <Form.Select name="project_id" required>
              {projects.map(project => <option key={project.id} value={project.id}>{project.name}</option>)}
            </Form.Select>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Category</Form.Label>
            <Form.Select name="category_id" required>
              {categories.map(category => <option key={category.id} value={category.id}>{category.name}</option>)}
            </Form.Select>
          </Form.Group>
        </>
      )}
    </Modal.Body>
    <Modal.Footer>
      <Button variant="secondary" onClick={handleModalClose}>Отмена</Button>
      <Button variant="primary" type="submit">{editableTask ? 'Сохранить изменения' : 'Создать задачу'}</Button>
      {editableTask && (
        <Button variant="danger" onClick={() => handleDelete(editableTask.id)}>Удалить задачу</Button>
      )}
    </Modal.Footer>
  </Form>
</Modal>
    </Container>
  );
};

export default Tasks;