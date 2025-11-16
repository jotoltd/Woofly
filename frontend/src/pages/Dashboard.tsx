import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import './Dashboard.css';

interface Pet {
  id: string;
  name: string;
  species: string;
  breed?: string;
  age?: number;
  description?: string;
  imageUrl?: string;
  qrCode: string;
  nfcId: string;
  userId: string;
  ownerPhone?: string;
  ownerEmail?: string;
  vetName?: string;
  vetPhone?: string;
  medicalInfo?: string;
  createdAt: string;
  updatedAt: string;
}

const Dashboard: React.FC = () => {
  const [pets, setPets] = useState<Pet[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    species: '',
    breed: '',
    age: '',
    sex: '',
    color: '',
    description: '',
    ownerPhone: '',
    ownerEmail: '',
    vetName: '',
    vetPhone: '',
    medicalInfo: '',
  });
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchPets();
  }, []);

  const fetchPets = async () => {
    try {
      const response = await api.get('/pets');
      setPets(response.data);
    } catch (error) {
      console.error('Error fetching pets:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/pets', formData);
      setFormData({
        name: '',
        species: '',
        breed: '',
        age: '',
        sex: '',
        color: '',
        description: '',
        ownerPhone: '',
        ownerEmail: '',
        vetName: '',
        vetPhone: '',
        medicalInfo: '',
      });
      setShowAddForm(false);
      fetchPets();
    } catch (error: any) {
      console.error('Error creating pet:', error);
      alert(error.response?.data?.error || 'Failed to create pet');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <h1>WoofTrace Dashboard</h1>
        <div className="user-info">
          <span>Welcome, {user?.name}!</span>
          <button onClick={handleLogout} className="logout-btn">
            Logout
          </button>
        </div>
      </header>

      <div className="dashboard-content">
        <div className="pets-header">
          <h2>My Pets</h2>
          <button onClick={() => setShowAddForm(!showAddForm)} className="add-pet-btn">
            {showAddForm ? 'Cancel' : '+ Add Pet'}
          </button>
        </div>

        {showAddForm && (
          <div className="add-pet-form">
            <h3>Register New Pet</h3>
            <form onSubmit={handleSubmit}>
              <div className="form-row">
                <div className="form-group">
                  <label>Pet Name *</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Species *</label>
                  <input
                    type="text"
                    value={formData.species}
                    onChange={(e) => setFormData({ ...formData, species: e.target.value })}
                    placeholder="e.g., Dog, Cat"
                    required
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Breed</label>
                  <input
                    type="text"
                    value={formData.breed}
                    onChange={(e) => setFormData({ ...formData, breed: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>Age (years)</label>
                  <input
                    type="number"
                    value={formData.age}
                    onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Sex</label>
                  <select
                    value={formData.sex}
                    onChange={(e) => setFormData({ ...formData, sex: e.target.value })}
                  >
                    <option value="">Select...</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Unknown">Unknown</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Color</label>
                  <input
                    type="text"
                    value={formData.color}
                    onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                    placeholder="e.g., Brown, Black, White"
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                />
              </div>

              <h4>Contact Information</h4>
              <div className="form-row">
                <div className="form-group">
                  <label>Owner Phone</label>
                  <input
                    type="tel"
                    value={formData.ownerPhone}
                    onChange={(e) => setFormData({ ...formData, ownerPhone: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>Owner Email</label>
                  <input
                    type="email"
                    value={formData.ownerEmail}
                    onChange={(e) => setFormData({ ...formData, ownerEmail: e.target.value })}
                  />
                </div>
              </div>

              <h4>Veterinary Information</h4>
              <div className="form-row">
                <div className="form-group">
                  <label>Vet Name</label>
                  <input
                    type="text"
                    value={formData.vetName}
                    onChange={(e) => setFormData({ ...formData, vetName: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>Vet Phone</label>
                  <input
                    type="tel"
                    value={formData.vetPhone}
                    onChange={(e) => setFormData({ ...formData, vetPhone: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Medical Information</label>
                <textarea
                  value={formData.medicalInfo}
                  onChange={(e) => setFormData({ ...formData, medicalInfo: e.target.value })}
                  rows={3}
                  placeholder="Allergies, medications, conditions, etc."
                />
              </div>

              <button type="submit" className="submit-btn">
                Register Pet
              </button>
            </form>
          </div>
        )}

        {loading ? (
          <p>Loading pets...</p>
        ) : pets.length === 0 ? (
          <div className="no-pets">
            <p>No pets registered yet. Click "Add Pet" to get started!</p>
          </div>
        ) : (
          <div className="pets-grid">
            {pets.map((pet) => (
              <div key={pet.id} className="pet-card" onClick={() => navigate(`/pet/${pet.id}`)}>
                {pet.imageUrl ? (
                  <div className="pet-card-image">
                    <img
                      src={pet.imageUrl}
                      alt={pet.name}
                    />
                  </div>
                ) : (
                  <div className="pet-card-placeholder">
                    <span>📷</span>
                  </div>
                )}
                <div className="pet-card-info">
                  <h3>{pet.name}</h3>
                  <p className="pet-species">{pet.species}</p>
                  {pet.breed && <p className="pet-breed">{pet.breed}</p>}
                  {pet.age && <p className="pet-age">{pet.age} years old</p>}
                  <button className="view-btn">View Details</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
