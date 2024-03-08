import React, { useState, useEffect } from 'react';
import { Container, Button, Modal, Form } from 'react-bootstrap';

const Tasks = () => {
  const [tasks, setTasks] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editableTask, setEditableTask] = useState(null); // Для хранения редактируемой задачи

  // Функция для загрузки задач с сервера
  const fetchTasks = async () => {
    try {
      const response = await fetch('http://127.0.0.1:5555/tasks');
      const data = await response.json();
      setTasks(data);
    } catch (error) {
      console.error('Ошибка при загрузке задач:', error);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  // Открытие и закрытие модального окна
  const handleModal = (task = null) => {
    setEditableTask(task); // Если task не null, значит редактируем существующую задачу
    setShowModal(!showModal);
  };

  // Обработка отправки формы
  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const taskData = Object.fromEntries(formData.entries());

    if (editableTask) {
      // Редактирование существующей задачи
    } else {
      // Добавление новой задачи
    }

    handleModal(); // Закрыть модальное окно
    fetchTasks(); // Перезагрузить задачи
  };

  return (
    <Container>
      <Button variant="primary" onClick={() => handleModal()}>Добавить задачу</Button>
      
      {/* Модальное окно для создания/редактирования задач */}
      <Modal show={showModal} onHide={handleModal}>
        <Form onSubmit={handleSubmit}>
          <Modal.Header closeButton>
            <Modal.Title>{editableTask ? 'Редактировать задачу' : 'Новая задача'}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>Название</Form.Label>
              <Form.Control type="text" name="name" defaultValue={editableTask?.name} required />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Описание</Form.Label>
              <Form.Control as="textarea" name="description" defaultValue={editableTask?.description} />
            </Form.Group>
            {/* Добавьте другие поля формы по необходимости */}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleModal}>Отмена</Button>
            <Button variant="primary" type="submit">Сохранить</Button>
          </Modal.Footer>
        </Form>
      </Modal>

      {/* Здесь будет отображение задач */}
    </Container>
  );
};

export default Tasks;