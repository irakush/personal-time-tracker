import React, { useState, useEffect } from 'react';

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [projectsPerPage] = useState(5);
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('create'); // 'create', 'edit', 'delete'
  const [selectedProject, setSelectedProject] = useState(null);
  const [newProjectName, setNewProjectName] = useState('');
  const [newProjectDescription, setNewProjectDescription] = useState('');

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const response = await fetch('http://127.0.0.1:5555/projects');
      const data = await response.json();
      data.sort((a, b) => a.name.localeCompare(b.name)); // Сортировка проектов по имени
      setProjects(data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleModalOpen = (mode, project = null) => {
    setShowModal(true);
    setModalMode(mode);
    if (mode === 'edit' && project) {
      setSelectedProject(project);
      setNewProjectName(project.name);
      setNewProjectDescription(project.description);
    }
  };

  const handleModalClose = () => {
    setShowModal(false);
    setModalMode('create');
    setSelectedProject(null);
    setNewProjectName('');
    setNewProjectDescription('');
  };

  const handleNewProjectSubmit = async () => {
    try {
      const response = await fetch('http://127.0.0.1:5555/projects', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: newProjectName,
          description: newProjectDescription,
        }),
      });
      if (response.ok) {
        fetchProjects();
        handleModalClose();
      } else {
        console.error('Failed to create new project');
      }
    } catch (error) {
      console.error('Failed to create new project:', error);
    }
  };

  const handleEditProjectSubmit = async () => {
    try {
      const response = await fetch(`http://127.0.0.1:5555/projects/${selectedProject.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: newProjectName,
          description: newProjectDescription,
        }),
      });
      if (response.ok) {
        fetchProjects();
        handleModalClose();
      } else {
        console.error(`Failed to edit project with id ${selectedProject.id}`);
      }
    } catch (error) {
      console.error(`Failed to edit project with id ${selectedProject.id}:`, error);
    }
  };

  const handleDeleteProjectSubmit = async () => {
    try {
      const response = await fetch(`http://127.0.0.1:5555/projects/${selectedProject.id}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        fetchProjects();
        handleModalClose();
      } else {
        console.error(`Failed to delete project with id ${selectedProject.id}`);
      }
    } catch (error) {
      console.error(`Failed to delete project with id ${selectedProject.id}:`, error);
    }
  };

  const indexOfLastProject = currentPage * projectsPerPage;
  const indexOfFirstProject = indexOfLastProject - projectsPerPage;
  const currentProjects = projects.slice(indexOfFirstProject, indexOfLastProject);

  const paginate = pageNumber => setCurrentPage(pageNumber);

  return (
    <div class="container-fluid">
    <div class="">
      <h2>Projects</h2>
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
          {currentProjects.map(project => (
            <tr key={project.id}>
              <td>
                <button className="btn btn-primary btn-sm" onClick={() => handleModalOpen('edit', project)}>Edit</button>&nbsp;
                <button className="btn btn-danger btn-sm" onClick={() => { setSelectedProject(project); setModalMode('delete'); setShowModal(true); }}>Delete</button>
              </td>
              <td>{project.name}</td>
              <td>{project.description}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <nav>
        <ul className="pagination">
          {Array.from({ length: Math.ceil(projects.length / projectsPerPage) }, (_, i) => (
            <li key={i} className={`page-item ${currentPage === i + 1 ? 'active' : ''}`}>
              <button className="page-link" onClick={() => paginate(i + 1)}>
                {i + 1}
              </button>
            </li>
          ))}
        </ul>
      </nav>

      {/* Модальное окно подтверждения удаления */}
      {showModal && modalMode === 'delete' && (
        <div className="modal" tabIndex="-1" role="dialog" style={{ display: 'block' }}>
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Confirm Delete</h5>
                <button type="button" className="close" onClick={handleModalClose} aria-label="Close">
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div className="modal-body">
                <p>Are you sure you want to delete this category?</p>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary btn-sm" onClick={handleModalClose}>Cancel</button>
                <button type="button" className="btn btn-danger btn-sm" onClick={handleDeleteProjectSubmit}>Delete</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Модальное окно создания/редактирования */}
      {showModal && (modalMode === 'create' || modalMode === 'edit') && (
        <div className="modal" tabIndex="-1" role="dialog" style={{ display: 'block' }}>
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">{modalMode === 'create' ? 'Создание проекта' : 'Редактирование проекта'}</h5>
                <button type="button" className="close" onClick={handleModalClose} aria-label="Close">
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div className="modal-body">
                <div className="form-group">
                  <label htmlFor="newProjectName">Name:</label>
                  <input type="text" className="form-control" id="newProjectName" value={newProjectName} onChange={e => setNewProjectName(e.target.value)} />
                </div>
                <div className="form-group">
                  <label htmlFor="newProjectDescription">Description:</label>
                  <textarea className="form-control" id="newProjectDescription" rows="3" value={newProjectDescription} onChange={e => setNewProjectDescription(e.target.value)}></textarea>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary btn-sm" onClick={handleModalClose}>Cancel</button>
                <button type="button" className="btn btn-primary btn-sm" onClick={modalMode === 'create' ? handleNewProjectSubmit : handleEditProjectSubmit}>
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

export default Projects;
