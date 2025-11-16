import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import './PetProfile.css';

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
  isLost?: boolean;
  lostDate?: string;
  lastSeenLocation?: string;
  createdAt: string;
  updatedAt: string;
}

const PetProfile: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [pet, setPet] = useState<Pet | null>(null);
  const [qrCodeImage, setQrCodeImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [showQR, setShowQR] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [showLostForm, setShowLostForm] = useState(false);
  const [lostFormData, setLostFormData] = useState({
    lastSeenLocation: '',
  });
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [nfcSupported, setNfcSupported] = useState(false);
  const [nfcWriting, setNfcWriting] = useState(false);
  const [editForm, setEditForm] = useState({
    name: '',
    species: '',
    breed: '',
    age: '',
    description: '',
    ownerPhone: '',
    ownerEmail: '',
    vetName: '',
    vetPhone: '',
    medicalInfo: '',
  });

  useEffect(() => {
    fetchPet();
    // Check if Web NFC is supported
    if ('NDEFReader' in window) {
      setNfcSupported(true);
    }
  }, [id]);

  const fetchPet = async () => {
    try {
      const response = await api.get(`/pets/${id}`);
      const petData = response.data;
      setPet(petData);
      setEditForm({
        name: petData.name || '',
        species: petData.species || '',
        breed: petData.breed || '',
        age: petData.age?.toString() || '',
        description: petData.description || '',
        ownerPhone: petData.ownerPhone || '',
        ownerEmail: petData.ownerEmail || '',
        vetName: petData.vetName || '',
        vetPhone: petData.vetPhone || '',
        medicalInfo: petData.medicalInfo || '',
      });
    } catch (error) {
      console.error('Error fetching pet:', error);
      alert('Failed to load pet details');
      navigate('/dashboard');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    if (pet) {
      setEditForm({
        name: pet.name || '',
        species: pet.species || '',
        breed: pet.breed || '',
        age: pet.age?.toString() || '',
        description: pet.description || '',
        ownerPhone: pet.ownerPhone || '',
        ownerEmail: pet.ownerEmail || '',
        vetName: pet.vetName || '',
        vetPhone: pet.vetPhone || '',
        medicalInfo: pet.medicalInfo || '',
      });
    }
    setIsEditing(false);
  };

  const handleSaveEdit = async () => {
    try {
      const response = await api.put(`/pets/${id}`, editForm);
      setPet(response.data);
      setIsEditing(false);
      alert('Pet information updated successfully!');
    } catch (error) {
      console.error('Error updating pet:', error);
      alert('Failed to update pet information');
    }
  };

  const generateQRCode = async () => {
    try {
      const response = await api.get(`/pets/${id}/qrcode`);
      setQrCodeImage(response.data.qrCodeImage);
      setShowQR(true);
    } catch (error) {
      console.error('Error generating QR code:', error);
      alert('Failed to generate QR code');
    }
  };

  const downloadQRCode = () => {
    if (qrCodeImage) {
      const link = document.createElement('a');
      link.href = qrCodeImage;
      link.download = `${pet?.name}-qr-code.png`;
      link.click();
    }
  };

  const copyNFCId = () => {
    if (pet?.nfcId) {
      navigator.clipboard.writeText(pet.nfcId);
      alert('NFC ID copied to clipboard!');
    }
  };

  const copyQRLink = () => {
    if (pet?.qrCode) {
      const link = `${window.location.origin}/pet/qr/${pet.qrCode}`;
      navigator.clipboard.writeText(link);
      alert('QR link copied to clipboard!');
    }
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      alert('Image size must be less than 5MB');
      return;
    }

    setUploadingImage(true);
    const formData = new FormData();
    formData.append('image', file);

    try {
      const response = await api.post(`/pets/${id}/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setPet(response.data.pet);
      alert('Image uploaded successfully!');
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Failed to upload image');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleMarkAsLost = async () => {
    if (!lostFormData.lastSeenLocation.trim()) {
      alert('Please enter the last seen location');
      return;
    }

    try {
      const response = await api.patch(`/pets/${id}/lost-status`, {
        isLost: true,
        lastSeenLocation: lostFormData.lastSeenLocation,
        lostDate: new Date().toISOString(),
      });
      setPet(response.data);
      setShowLostForm(false);
      setLostFormData({ lastSeenLocation: '' });
      alert('Pet marked as lost');
    } catch (error) {
      console.error('Error marking pet as lost:', error);
      alert('Failed to update lost status');
    }
  };

  const handleMarkAsFound = async () => {
    try {
      const response = await api.patch(`/pets/${id}/lost-status`, {
        isLost: false,
      });
      setPet(response.data);
      alert('Pet marked as found!');
    } catch (error) {
      console.error('Error marking pet as found:', error);
      alert('Failed to update found status');
    }
  };

  const handleDelete = async () => {
    try {
      await api.delete(`/pets/${id}`);
      alert('Pet deleted successfully');
      navigate('/dashboard');
    } catch (error) {
      console.error('Error deleting pet:', error);
      alert('Failed to delete pet');
    }
  };

  const writeNFC = async () => {
    if (!pet || !nfcSupported) {
      alert('NFC is not supported on this device');
      return;
    }

    try {
      setNfcWriting(true);
      // @ts-ignore - Web NFC API types may not be available
      const ndef = new NDEFReader();

      const nfcUrl = `${window.location.origin}/pet/nfc/${pet.nfcId}`;

      await ndef.write({
        records: [
          { recordType: "url", data: nfcUrl },
          { recordType: "text", data: `Woofly Pet: ${pet.name}` }
        ]
      });

      alert('NFC tag written successfully! Tap your NFC tag to the device now.');
    } catch (error: any) {
      console.error('NFC write error:', error);
      if (error.name === 'NotAllowedError') {
        alert('NFC permission denied. Please allow NFC access in your browser settings.');
      } else if (error.name === 'NotSupportedError') {
        alert('NFC is not supported on this device.');
      } else {
        alert(`Failed to write NFC tag: ${error.message}`);
      }
    } finally {
      setNfcWriting(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (!pet) {
    return <div className="error">Pet not found</div>;
  }

  return (
    <div className="pet-profile">
      <div className="profile-header">
        <button onClick={() => navigate('/dashboard')} className="back-btn">
          ← Back to Dashboard
        </button>
        <h1>{pet.name}'s Profile</h1>
      </div>

      <div className="profile-content">
        <div className="profile-section">
          <div className="section-header">
            <h2>Pet Information</h2>
            {!isEditing && (
              <button onClick={handleEdit} className="edit-btn">
                Edit Info
              </button>
            )}
          </div>

          {/* Pet Photo */}
          <div className="pet-photo-section">
            {pet.imageUrl ? (
              <div className="pet-photo-container">
                <img
                  src={pet.imageUrl}
                  alt={pet.name}
                  className="pet-photo"
                />
              </div>
            ) : (
              <div className="no-photo">No photo uploaded</div>
            )}
            <div className="upload-button-container">
              <input
                type="file"
                id="image-upload"
                accept="image/*"
                onChange={handleImageUpload}
                style={{ display: 'none' }}
              />
              <label htmlFor="image-upload" className="upload-label">
                <button
                  className="action-btn upload-btn"
                  onClick={() => document.getElementById('image-upload')?.click()}
                  disabled={uploadingImage}
                  type="button"
                >
                  {uploadingImage ? 'Uploading...' : pet.imageUrl ? 'Change Photo' : 'Upload Photo'}
                </button>
              </label>
            </div>
          </div>

          {isEditing ? (
            <div className="edit-form">
              <div className="form-row">
                <div className="form-group">
                  <label>Name *</label>
                  <input
                    type="text"
                    value={editForm.name}
                    onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Species *</label>
                  <input
                    type="text"
                    value={editForm.species}
                    onChange={(e) => setEditForm({ ...editForm, species: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Breed</label>
                  <input
                    type="text"
                    value={editForm.breed}
                    onChange={(e) => setEditForm({ ...editForm, breed: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>Age</label>
                  <input
                    type="number"
                    value={editForm.age}
                    onChange={(e) => setEditForm({ ...editForm, age: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Description</label>
                <textarea
                  value={editForm.description}
                  onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                  rows={3}
                />
              </div>

              <div className="edit-actions">
                <button onClick={handleSaveEdit} className="save-btn">Save Changes</button>
                <button onClick={handleCancelEdit} className="cancel-btn">Cancel</button>
              </div>
            </div>
          ) : (
            <div className="info-grid">
              <div className="info-item">
                <label>Name:</label>
                <span>{pet.name}</span>
              </div>
              <div className="info-item">
                <label>Species:</label>
                <span>{pet.species}</span>
              </div>
              {pet.breed && (
                <div className="info-item">
                  <label>Breed:</label>
                  <span>{pet.breed}</span>
                </div>
              )}
              {pet.age && (
                <div className="info-item">
                  <label>Age:</label>
                  <span>{pet.age} years</span>
                </div>
              )}
              {pet.description && (
                <div className="info-item full-width">
                  <label>Description:</label>
                  <span>{pet.description}</span>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="profile-section">
          <h2>Contact Information</h2>
          {isEditing ? (
            <div className="edit-form">
              <div className="form-row">
                <div className="form-group">
                  <label>Owner Phone</label>
                  <input
                    type="tel"
                    value={editForm.ownerPhone}
                    onChange={(e) => setEditForm({ ...editForm, ownerPhone: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>Owner Email</label>
                  <input
                    type="email"
                    value={editForm.ownerEmail}
                    onChange={(e) => setEditForm({ ...editForm, ownerEmail: e.target.value })}
                  />
                </div>
              </div>
            </div>
          ) : (
            <div className="info-grid">
              {pet.ownerPhone && (
                <div className="info-item">
                  <label>Owner Phone:</label>
                  <span>{pet.ownerPhone}</span>
                </div>
              )}
              {pet.ownerEmail && (
                <div className="info-item">
                  <label>Owner Email:</label>
                  <span>{pet.ownerEmail}</span>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="profile-section">
          <h2>Veterinary Information</h2>
          {isEditing ? (
            <div className="edit-form">
              <div className="form-row">
                <div className="form-group">
                  <label>Vet Name</label>
                  <input
                    type="text"
                    value={editForm.vetName}
                    onChange={(e) => setEditForm({ ...editForm, vetName: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>Vet Phone</label>
                  <input
                    type="tel"
                    value={editForm.vetPhone}
                    onChange={(e) => setEditForm({ ...editForm, vetPhone: e.target.value })}
                  />
                </div>
              </div>
              <div className="form-group">
                <label>Medical Information</label>
                <textarea
                  value={editForm.medicalInfo}
                  onChange={(e) => setEditForm({ ...editForm, medicalInfo: e.target.value })}
                  rows={3}
                  placeholder="Allergies, medications, conditions, etc."
                />
              </div>
            </div>
          ) : (
            <div className="info-grid">
              {pet.vetName && (
                <div className="info-item">
                  <label>Vet Name:</label>
                  <span>{pet.vetName}</span>
                </div>
              )}
              {pet.vetPhone && (
                <div className="info-item">
                  <label>Vet Phone:</label>
                  <span>{pet.vetPhone}</span>
                </div>
              )}
              {pet.medicalInfo && (
                <div className="info-item full-width">
                  <label>Medical Information:</label>
                  <span>{pet.medicalInfo}</span>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="profile-section">
          <h2>QR Code & NFC</h2>
          <div className="qr-nfc-section">
            <div className="action-buttons">
              <button onClick={generateQRCode} className="action-btn">
                Generate QR Code
              </button>
              <button onClick={copyQRLink} className="action-btn">
                Copy QR Link
              </button>
              <button onClick={copyNFCId} className="action-btn">
                Copy NFC ID
              </button>
              {nfcSupported && (
                <button
                  onClick={writeNFC}
                  className="action-btn"
                  disabled={nfcWriting}
                  style={{ background: nfcWriting ? '#999' : '#28a745' }}
                >
                  {nfcWriting ? 'Writing NFC...' : 'Write to NFC Tag'}
                </button>
              )}
            </div>

            {showQR && qrCodeImage && (
              <div className="qr-code-display">
                <img src={qrCodeImage} alt="QR Code" />
                <button onClick={downloadQRCode} className="download-btn">
                  Download QR Code
                </button>
                <p className="qr-instructions">
                  Print this QR code and attach it to your pet's collar or tag.
                  Anyone who scans it will be able to see your pet's information.
                </p>
              </div>
            )}

            <div className="nfc-info">
              <h3>NFC ID</h3>
              <p className="nfc-id">{pet.nfcId}</p>
              <p className="nfc-instructions">
                {nfcSupported ? (
                  <>
                    Tap "Write to NFC Tag" above to program an NFC tag directly from your mobile device.
                    Hold your NFC tag near your phone when prompted.
                    <br />
                    Alternatively, you can manually write this URL to an NFC tag:
                  </>
                ) : (
                  'Write this URL to an NFC tag and attach it to your pet\'s collar:'
                )}
                <br />
                <code>{window.location.origin}/pet/nfc/{pet.nfcId}</code>
              </p>
            </div>
          </div>
        </div>

        <div className="profile-section">
          <h2>Lost Pet Status</h2>
          {pet.isLost ? (
            <div className="lost-status-active">
              <div className="alert alert-danger">
                <strong>This pet is marked as LOST</strong>
                <p>Lost Date: {pet.lostDate ? new Date(pet.lostDate).toLocaleDateString() : 'N/A'}</p>
                <p>Last Seen: {pet.lastSeenLocation}</p>
              </div>
              <button onClick={handleMarkAsFound} className="action-btn found-btn">
                Mark as Found
              </button>
            </div>
          ) : (
            <div className="lost-status-inactive">
              {!showLostForm ? (
                <button onClick={() => setShowLostForm(true)} className="action-btn lost-btn">
                  Mark as Lost
                </button>
              ) : (
                <div className="lost-form">
                  <div className="form-group">
                    <label>Last Seen Location *</label>
                    <input
                      type="text"
                      value={lostFormData.lastSeenLocation}
                      onChange={(e) => setLostFormData({ lastSeenLocation: e.target.value })}
                      placeholder="e.g., Central Park, near the fountain"
                    />
                  </div>
                  <div className="form-actions">
                    <button onClick={handleMarkAsLost} className="save-btn">
                      Confirm Lost
                    </button>
                    <button onClick={() => setShowLostForm(false)} className="cancel-btn">
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="profile-section danger-zone">
          <h2>Danger Zone</h2>
          {!showDeleteConfirm ? (
            <button onClick={() => setShowDeleteConfirm(true)} className="delete-btn">
              Delete Pet Profile
            </button>
          ) : (
            <div className="delete-confirmation">
              <p className="warning-text">
                Are you sure you want to delete {pet.name}'s profile? This action cannot be undone.
              </p>
              <div className="confirmation-actions">
                <button onClick={handleDelete} className="confirm-delete-btn">
                  Yes, Delete
                </button>
                <button onClick={() => setShowDeleteConfirm(false)} className="cancel-btn">
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PetProfile;
