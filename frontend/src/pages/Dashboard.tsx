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

interface Tag {
  id: string;
  tagCode: string;
  activationCode: string;
  isActivated: boolean;
  activatedAt?: string;
  petId?: string;
  pet?: {
    id: string;
    name: string;
    species: string;
    imageUrl?: string;
  };
}

const Dashboard: React.FC = () => {
  const [pets, setPets] = useState<Pet[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    tagId: '',
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
    fetchTags();
  }, []);

  // When there is exactly one available activated tag and the form is open,
  // auto-select it to make the flow easier for most users.
  const availableTags = tags.filter(t => !t.petId);

  useEffect(() => {
    if (showAddForm && availableTags.length === 1 && !formData.tagId) {
      setFormData(prev => ({
        ...prev,
        tagId: availableTags[0].id,
      }));
    }
  }, [showAddForm, availableTags.length]);

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

  const fetchTags = async () => {
    try {
      const response = await api.get('/tags');
      setTags(response.data);
    } catch (error) {
      console.error('Error fetching tags:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/pets', formData);
      setFormData({
        tagId: '',
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
      fetchTags(); // Refresh tags list since one is now linked
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
        {/* Onboarding Checklist */}
        {pets.length === 0 && tags.length > 0 && (
          <div className="onboarding-checklist glass-card">
            <h3>🎉 Welcome to WoofTrace!</h3>
            <p style={{ marginBottom: '20px', color: 'var(--cloud-gray)' }}>
              Complete these steps to get your pet protected:
            </p>
            <div className="checklist">
              <div className="checklist-item completed">
                <span className="checkmark">✓</span>
                <span>Activate your tag</span>
              </div>
              <div className="checklist-item">
                <span className="checkmark">○</span>
                <span><strong>Add your pet's profile</strong> (name, photo, details)</span>
              </div>
              <div className="checklist-item">
                <span className="checkmark">○</span>
                <span>Add emergency contacts</span>
              </div>
              <div className="checklist-item">
                <span className="checkmark">○</span>
                <span>Download and attach QR code to tag</span>
              </div>
            </div>
            <button 
              onClick={() => setShowAddForm(true)} 
              className="btn" 
              style={{ marginTop: '20px', width: '100%' }}
            >
              Add Pet Now →
            </button>
          </div>
        )}

        <div className="pets-header">
          <h2>My Pets</h2>
          <button onClick={() => setShowAddForm(!showAddForm)} className="add-pet-btn">
            {showAddForm ? 'Cancel' : '+ Add Pet'}
          </button>
        </div>

        {showAddForm && (
          <div className="add-pet-form glass-card">
            <h3>Register New Pet</h3>
            {availableTags.length === 0 ? (
              <div className="no-tags-message">
                <p>⚠️ You need to activate a tag before you can register a pet.</p>
                <button
                  type="button"
                  className="btn"
                  onClick={() => navigate('/activate')}
                >
                  Activate Tag Now
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label>Select Tag *</label>
                  <select
                    value={formData.tagId}
                    onChange={(e) => setFormData({ ...formData, tagId: e.target.value })}
                    required
                  >
                    <option value="">Choose a tag...</option>
                    {availableTags.map(tag => (
                      <option key={tag.id} value={tag.id}>
                        Tag {tag.tagCode} (Activated {new Date(tag.activatedAt!).toLocaleDateString()})
                      </option>
                    ))}
                  </select>
                  <p className="help-text">
                    Each pet requires its own unique tag.
                    {availableTags.length === 1 && formData.tagId && (
                      <> Wea0automatically selected your only available tag for you.</>
                    )}
                  </p>
                </div>

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
            )}
          </div>
        )}

        {loading ? (
          <p>Loading pets...</p>
        ) : pets.length === 0 && tags.length === 0 ? (
          <div className="no-pets glass-card">
            <h3>👋 Get Started with WoofTrace</h3>
            <p style={{ marginBottom: '20px' }}>You haven't activated any tags yet!</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', alignItems: 'center' }}>
              <p>🏷️ <strong>Step 1:</strong> Get your WoofTrace tag and find the activation code</p>
              <p>✅ <strong>Step 2:</strong> Click below to activate your tag</p>
              <p>🐾 <strong>Step 3:</strong> Add your pet's profile</p>
              <button onClick={() => navigate('/activate')} className="btn" style={{ marginTop: '10px' }}>
                Activate Your First Tag
              </button>
            </div>
          </div>
        ) : pets.length === 0 ? (
          <div className="no-pets glass-card">
            <p>No pets registered yet. Click "Add Pet" to get started!</p>
          </div>
        ) : (
          <div className="pets-grid">
            {pets.map((pet) => (
              <div key={pet.id} className="pet-card glass-card" onClick={() => navigate(`/pet/${pet.id}`)}>
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
