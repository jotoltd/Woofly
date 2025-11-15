import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api/axios';
import './PublicPetProfile.css';

interface PublicPet {
  id: string;
  name: string;
  species: string;
  breed?: string;
  age?: number;
  description?: string;
  imageUrl?: string;
  ownerName: string;
  ownerPhone?: string;
  ownerEmail?: string;
  vetName?: string;
  vetPhone?: string;
  medicalInfo?: string;
  isLost?: boolean;
  lostDate?: string;
  lastSeenLocation?: string;
}

const PublicPetProfile: React.FC = () => {
  const { qrCode, nfcId } = useParams<{ qrCode?: string; nfcId?: string }>();
  const [pet, setPet] = useState<PublicPet | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchPet();
  }, [qrCode, nfcId]);

  const fetchPet = async () => {
    try {
      const endpoint = qrCode ? `/pets/public/qr/${qrCode}` : `/pets/public/nfc/${nfcId}`;
      const response = await api.get(endpoint);
      setPet(response.data);
    } catch (error: any) {
      console.error('Error fetching pet:', error);
      setError('Pet not found or QR/NFC code is invalid');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="public-profile">
        <div className="loading">Loading pet information...</div>
      </div>
    );
  }

  if (error || !pet) {
    return (
      <div className="public-profile">
        <div className="error-message">
          <h2>Pet Not Found</h2>
          <p>{error || 'This QR or NFC code does not match any registered pets.'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="public-profile">
      {pet.isLost && (
        <div className="lost-alert-banner">
          <h2>⚠️ THIS PET IS REPORTED LOST ⚠️</h2>
          <div className="lost-info">
            <p><strong>Lost Date:</strong> {pet.lostDate ? new Date(pet.lostDate).toLocaleDateString() : 'Unknown'}</p>
            {pet.lastSeenLocation && (
              <p><strong>Last Seen:</strong> {pet.lastSeenLocation}</p>
            )}
          </div>
          <p className="urgent-message">Please contact the owner immediately if you have found this pet!</p>
        </div>
      )}

      <div className="public-header">
        <h1>Found Pet!</h1>
        <p>If you found this pet, please contact the owner below</p>
      </div>

      <div className="public-content">
        <div className="pet-info-card">
          {pet.imageUrl && (
            <div className="public-pet-image">
              <img
                src={`http://localhost:3000${pet.imageUrl}`}
                alt={pet.name}
              />
            </div>
          )}
          <h2>{pet.name}</h2>
          <div className="pet-details">
            <p>
              <strong>Species:</strong> {pet.species}
            </p>
            {pet.breed && (
              <p>
                <strong>Breed:</strong> {pet.breed}
              </p>
            )}
            {pet.age && (
              <p>
                <strong>Age:</strong> {pet.age} years
              </p>
            )}
            {pet.description && (
              <p>
                <strong>Description:</strong> {pet.description}
              </p>
            )}
          </div>
        </div>

        <div className="contact-card">
          <h3>Owner Contact Information</h3>
          <div className="contact-details">
            <p>
              <strong>Owner:</strong> {pet.ownerName}
            </p>
            {pet.ownerPhone && (
              <p>
                <strong>Phone:</strong>{' '}
                <a href={`tel:${pet.ownerPhone}`}>{pet.ownerPhone}</a>
              </p>
            )}
            {pet.ownerEmail && (
              <p>
                <strong>Email:</strong>{' '}
                <a href={`mailto:${pet.ownerEmail}`}>{pet.ownerEmail}</a>
              </p>
            )}
          </div>
        </div>

        {(pet.vetName || pet.vetPhone || pet.medicalInfo) && (
          <div className="medical-card">
            <h3>Medical Information</h3>
            <div className="medical-details">
              {pet.vetName && (
                <p>
                  <strong>Veterinarian:</strong> {pet.vetName}
                </p>
              )}
              {pet.vetPhone && (
                <p>
                  <strong>Vet Phone:</strong>{' '}
                  <a href={`tel:${pet.vetPhone}`}>{pet.vetPhone}</a>
                </p>
              )}
              {pet.medicalInfo && (
                <p>
                  <strong>Medical Notes:</strong> {pet.medicalInfo}
                </p>
              )}
            </div>
          </div>
        )}

        <div className="emergency-notice">
          <h3>Emergency Contact</h3>
          <p>
            If this pet needs immediate medical attention, please contact the
            veterinarian listed above or take them to the nearest emergency vet
            clinic.
          </p>
        </div>
      </div>
    </div>
  );
};

export default PublicPetProfile;
