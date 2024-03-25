import React, { useState, useEffect } from 'react';

const TaskCategories = () => {
  const url = 'http://192.168.12.144:5555'

  const [categories, setCategories] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [categoriesPerPage] = useState(5);
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('create'); // 'create', 'edit', 'delete'
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newCategoryDescription, setNewCategoryDescription] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await fetch(`${url}/task_categories`);
      const data = await response.json();
      data.sort((a, b) => a.name.localeCompare(b.name)); // Sort categories by name
      setCategories(data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleModalOpen = (mode, category = null) => {
    setShowModal(true);
    setModalMode(mode);
    if (mode === 'edit' && category) {
      setSelectedCategory(category);
      setNewCategoryName(category.name);
      setNewCategoryDescription(category.description);
    }
  };

  const handleModalClose = () => {
    setShowModal(false);
    setModalMode('create');
    setSelectedCategory(null);
    setNewCategoryName('');
    setNewCategoryDescription('');
  };

  const handleNewCategorySubmit = async () => {
    try {
      const response = await fetch(`${url}/task_categories`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: newCategoryName,
          description: newCategoryDescription,
        }),
      });
      if (response.ok) {
        fetchData();
        handleModalClose();
      } else {
        console.error('Failed to create new category');
      }
    } catch (error) {
      console.error('Error creating new category:', error);
    }
  };

  const handleEditCategorySubmit = async () => {
    try {
      const response = await fetch(`${url}/task_categories/${selectedCategory.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: newCategoryName,
          description: newCategoryDescription,
        }),
      });
      if (response.ok) {
        fetchData();
        handleModalClose();
      } else {
        console.error(`Failed to edit category with id ${selectedCategory.id}`);
      }
    } catch (error) {
      console.error(`Error editing category with id ${selectedCategory.id}:`, error);
    }
  };

  const handleDeleteCategorySubmit = async () => {
    try {
      const response = await fetch(`${url}/task_categories/${selectedCategory.id}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        fetchData();
        handleModalClose();
      } else {
        console.error(`Failed to delete category with id ${selectedCategory.id}`);
      }
    } catch (error) {
      console.error(`Error deleting category with id ${selectedCategory.id}:`, error);
    }
  };

  const indexOfLastCategory = currentPage * categoriesPerPage;
  const indexOfFirstCategory = indexOfLastCategory - categoriesPerPage;
  const currentCategories = categories.slice(indexOfFirstCategory, indexOfLastCategory);

  const paginate = pageNumber => setCurrentPage(pageNumber);

  return (
    <div class="container-fluid">
    <div class="">
      <h2>Task Categories</h2>
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
          {currentCategories.map(category => (
            <tr key={category.id}>
              <td>
                <button className="btn btn-primary btn-sm" onClick={() => handleModalOpen('edit', category)}>Edit</button>&nbsp;
                <button className="btn btn-danger btn-sm" onClick={() => { setSelectedCategory(category); setModalMode('delete'); setShowModal(true); }}>Delete</button>
              </td>
              <td>{category.name}</td>
              <td>{category.description}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <nav>
        <ul className="pagination">
          {Array.from({ length: Math.ceil(categories.length / categoriesPerPage) }, (_, i) => (
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
                <button type="button" className="btn btn-danger btn-sm" onClick={handleDeleteCategorySubmit}>Delete</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="modal" tabIndex="-1" role="dialog" style={{ display: 'block' }}>
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  {modalMode === 'create' ? 'Create New Category' : modalMode === 'edit' ? 'Edit Category' : 'Delete Category'}
                </h5>
                <button type="button" className="close" onClick={handleModalClose} aria-label="Close">
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div className="modal-body">
                {modalMode === 'delete' ? (
                  <p>Are you sure you want to delete this category?</p>
                ) : (
                  <div>
                    <div className="mb-3">
                      <label htmlFor="newCategoryName" className="form-label">Name</label>
                      <input type="text" className="form-control" id="newCategoryName" value={newCategoryName} onChange={e => setNewCategoryName(e.target.value)} />
                    </div>
                    <div className="mb-3">
                      <label htmlFor="newCategoryDescription" className="form-label">Description</label>
                      <input type="text" className="form-control" id="newCategoryDescription" value={newCategoryDescription} onChange={e => setNewCategoryDescription(e.target.value)} />
                    </div>
                  </div>
                )}
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary btn-sm" onClick={handleModalClose}>Close</button>
                {modalMode === 'delete' ? (
                  <button type="button" className="btn btn-danger btn-sm" onClick={handleDeleteCategorySubmit}>Delete</button>
                ) : (
                  <button type="button" className="btn btn-primary btn-sm" onClick={modalMode === 'create' ? handleNewCategorySubmit : handleEditCategorySubmit}>{modalMode === 'create' ? 'Create' : 'Save Changes'}</button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
      </div>
    </div>
  );
};

export default TaskCategories;
