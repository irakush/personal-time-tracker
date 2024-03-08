import React, { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";

function UsersList() {
  const url = 'http://127.0.0.1:5555'
  const userObj = {
    "name": "",
    "password":"",
    "email":"",
    "ntfy_url":""
  }

  const [users, setUsers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [newUser, setNewUser] = useState(userObj);

  useEffect(() => {
    fetch(`${url}/users`)
    .then((response) => response.json())
    .then((data) => setUsers(data))
  }, [])

  const handleChanges = (e) => {
    console.log(e.target.value)
    let {name, value} = e.target
    // name === "password" ? value = Number(value) : value = value
    console.log(newUser)
    setNewUser({...newUser, [name]:value})
  }

  const handleShow = () => setShowModal(true);
  const handleClose = () => setShowModal(false);

  const handleSaveUser = (e) => {
    e.preventDefault();
    // const user = { name: newUser };
    fetch("http://127.0.0.1:5555/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newUser),
    })
      .then((response) => response.json())
      .then((addedUser) => {
        setUsers([...users, addedUser]); // Используйте ответ сервера для добавления пользователя
        handleClose();
        setNewUser(userObj);
      })
      .catch((error) => console.error("Error:", error));
  };

  const handleDeleteUser = (userId) => {
    fetch(`http://127.0.0.1:5555/users/${userId}`, {
      method: "DELETE",
    }) 
      .then(() => {
        setUsers(users.filter((user) => user.id !== userId));
      })
      .catch((error) => console.error("Error:", error));
  };


  return (
    <div id="wrapper">
      <br></br>
      <h2>Users</h2>
      <Button variant="btn btn-primary btn-sm" onClick={handleShow}>
        +
      </Button>
      <div className="d-flex flex-wrap">
        {users.map((user) => (
          <div className="card m-2" style={{ width: "18rem" }} key={user.id}>
            <div className="card-body">
              <h5 className="card-title">{user.name}</h5>
              <h5 className="card-title">{user.email}</h5>
              <p className="card-title">Created at: {user.created_at}</p>
              <Button
                variant="btn btn-danger btn-sm"
                onClick={() => handleDeleteUser(user.id)}
              >
                Delete
              </Button>
            </div>
          </div>
        ))}
      </div>

      <Modal show={showModal} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Add New User</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSaveUser}>
            <Form.Group>
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                name="name"
                // onChange={(e) => setNewUser(e.target.value)}
                onChange={handleChanges}
                value={newUser.name}
                placeholder="User name"
                required
              />
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                name="password"
                // onChange={(e) => setNewUser(e.target.value)}
                onChange={handleChanges}
                value={newUser.password}
                placeholder="Password"
                required
              />
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                name="email"
                // onChange={(e) => setNewUser(e.target.value)}
                onChange={handleChanges}
                value={newUser.email}
                placeholder="email@email.com"
                required
              />
              <Form.Label>Ntfy Url</Form.Label>
              <Form.Control
                type="text"
                name="ntfy_url"
                // onChange={(e) => setNewUser(e.target.value)}
                onChange={handleChanges}
                value={newUser.ntfy_url}
                placeholder="url://"
                required
              />
            </Form.Group>
            <br></br>
            <Button variant="btn btn-primary btn-sm" type="submit">
              Save
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  )
}

export default UsersList;