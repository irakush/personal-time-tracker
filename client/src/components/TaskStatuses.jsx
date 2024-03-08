import React, { useState, useEffect } from 'react';

const TaskStatuses = () => {
  const [taskStatuses, setTaskStatuses] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [statusesPerPage] = useState(5);
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('create'); // 'create', 'edit', 'delete'
  const [selectedStatus, setSelectedStatus] = useState(null);
  const [newStatusName, setNewStatusName] = useState('');
  const [newStatusDescription, setNewStatusDescription] = useState('');

  useEffect(() => {
    fetchTaskStatuses();
  }, []);

  const fetchTaskStatuses = async () => {
    try {
      const response = await fetch('http://127.0.0.1:5555/task_statuses');
      const data = await response.json();
      data.sort((a, b) => a.name.localeCompare(b.name)); // Sort statuses by name
      setTaskStatuses(data);
    } catch (error) {
      console.error('Error fetching task statuses:', error);
    }
  };

  const handleModalOpen = (mode, status = null) => {
    setShowModal(true);
    setModalMode(mode);
    if (mode === 'edit' && status) {
      setSelectedStatus(status);
      setNewStatusName(status.name);
      setNewStatusDescription(status.description);
    }
  };

  const handleModalClose = () => {
    setShowModal(false);
    setModalMode('create');
    setSelectedStatus(null);
    setNewStatusName('');
    setNewStatusDescription('');
  };

  const handleNewStatusSubmit = async () => {
    try {
      const response = await fetch('http://127.0.0.1:5555/task_statuses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: newStatusName,
          description: newStatusDescription,
        }),
      });
      if (response.ok) {
        fetchTaskStatuses();
        handleModalClose();
      } else {
        console.error('Error creating new task status');
      }
    } catch (error) {
      console.error('Error creating new task status:', error);
    }
  };

  const handleEditStatusSubmit = async () => {
    try {
      const response = await fetch(`http://127.0.0.1:5555/task_statuses/${selectedStatus.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: newStatusName,
          description: newStatusDescription,
        }),
      });
      if (response.ok) {
        fetchTaskStatuses(); // Update statuses after successful edit
        handleModalClose(); // Close the modal after editing
      } else {
        console.error(`Error editing task status with ID ${selectedStatus.id}`);
      }
    } catch (error) {
      console.error(`Error editing task status with ID ${selectedStatus.id}:`, error);
    }
  };

  const handleDeleteStatusSubmit = async () => {
    try {
      const response = await fetch(`http://127.0.0.1:5555/task_statuses/${selectedStatus.id}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        fetchTaskStatuses();
        handleModalClose();
      } else {
        console.error(`Error deleting task status with ID ${selectedStatus.id}`);
      }
    } catch (error) {
      console.error(`Error deleting task status with ID ${selectedStatus.id}:`, error);
    }
  };

  const indexOfLastStatus = currentPage * statusesPerPage;
  const indexOfFirstStatus = indexOfLastStatus - statusesPerPage;
  const currentStatuses = taskStatuses.slice(indexOfFirstStatus, indexOfLastStatus);

  const paginate = pageNumber => setCurrentPage(pageNumber);

  return (
    <div class="container-fluid">
    <div class="">
      <h2>Task Statuses</h2>
      <button className="btn btn-primary btn-sm" onClick={() => handleModalOpen('create')}>+</button>
      <table class="table table-striped">
        <thead>
          <tr>
            <th style={{width: '150px'}}>Actions</th>
            <th style={{width: '200px'}}>Name</th>
            <th>Description</th>
          </tr>
        </thead>
        <tbody>
          {currentStatuses.map(status => (
            <tr key={status.id}>
              <td>
                <button className="btn btn-primary btn-sm" onClick={() => handleModalOpen('edit', status)}>Edit</button>&nbsp;
                <button className="btn btn-danger btn-sm" onClick={() => { setSelectedStatus(status); setModalMode('delete'); setShowModal(true); }}>Delete</button>
              </td>
              <td>{status.name}</td>
              <td>{status.description}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <nav>
        <ul className="pagination">
          {Array.from({ length: Math.ceil(taskStatuses.length / statusesPerPage) }, (_, i) => (
            <li key={i} className={`page-item ${currentPage === i + 1 ? 'active' : ''}`}>
              <button className="page-link" onClick={() => paginate(i + 1)}>
                {i + 1}
              </button>
            </li>
          ))}
        </ul>
      </nav>

      {/* Delete Confirmation Modal */}
      {showModal && modalMode === 'delete' && (
        <div className="modal" tabIndex="-1" role="dialog" style={{ display: 'block' }}>
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Delete Confirmation</h5>
                <button type="button" className="close" onClick={handleModalClose} aria-label="Close">
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div className="modal-body">
                <p>Are you sure you want to delete this task status?</p>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary btn-sm" onClick={handleModalClose}>Cancel</button>
                <button type="button" className="btn btn-danger btn-sm" onClick={handleDeleteStatusSubmit}>Delete</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Create/Edit Modal */}
      {showModal && (modalMode === 'create' || modalMode === 'edit') && (
        <div className="modal" tabIndex="-1" role="dialog" style={{ display: 'block' }}>
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">{modalMode === 'create' ? 'Create Task Status' : 'Edit Task Status'}</h5>
                <button type="button" className="close" onClick={handleModalClose} aria-label="Close">
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div className="modal-body">
                <div className="form-group">
                  <label htmlFor="newStatusName">Name:</label>
                  <input type="text" className="form-control" id="newStatusName" value={newStatusName} onChange={e => setNewStatusName(e.target.value)} />
                </div>
                <div className="form-group">
                  <label htmlFor="newStatusDescription">Description:</label>
                  <textarea className="form-control" id="newStatusDescription" rows="3" value={newStatusDescription} onChange={e => setNewStatusDescription(e.target.value)}></textarea>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary btn-sm" onClick={handleModalClose}>Cancel</button>
                <button type="button" className="btn btn-primary btn-sm" onClick={modalMode === 'create' ? handleNewStatusSubmit : handleEditStatusSubmit}>
                  {modalMode === 'create' ? 'Create' : 'Save Changes'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      </div>
    </div>
  );
};

export default TaskStatuses;
