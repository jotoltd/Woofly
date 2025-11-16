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

interface Contact {
  id: string;
  name: string;
  relation?: string;
  phone?: string;
  email?: string;
  address?: string;
  facebook?: string;
  instagram?: string;
  priority: number;
}

const PublicPetProfile: React.FC = () => {
  const { qrCode, nfcId } = useParams<{ qrCode?: string; nfcId?: string }>();
  const [pet, setPet] = useState<PublicPet | null>(null);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [sharingLocation, setSharingLocation] = useState(false);
  const [locationShared, setLocationShared] = useState(false);

  useEffect(() => {
    fetchPet();
  }, [qrCode, nfcId]);

  const fetchPet = async () => {
    try {
      const endpoint = qrCode ? `/pets/public/qr/${qrCode}` : `/pets/public/nfc/${nfcId}`;
      const response = await api.get(endpoint);
      setPet(response.data);

      // Fetch contacts for this pet
      if (response.data.id) {
        fetchContacts(response.data.id);
      }
    } catch (error: any) {
      console.error('Error fetching pet:', error);
      setError('This WoofTrace tag is not set up yet or the code is invalid.');
    } finally {
      setLoading(false);
    }
  };

  const fetchContacts = async (petId: string) => {
    try {
      const response = await api.get(`/contacts/public/pet/${petId}`);
      // Sort by priority (higher priority first)
      const sortedContacts = response.data.sort((a: Contact, b: Contact) => b.priority - a.priority);
      setContacts(sortedContacts);
    } catch (error) {
      console.error('Error fetching contacts:', error);
      // Don't show error for contacts, just silently fail
    }
  };

  const shareLocation = async () => {
    if (!pet) return;

    setSharingLocation(true);

    try {
      // Get user's location
      if (!navigator.geolocation) {
        alert('Geolocation is not supported by your browser');
        return;
      }

      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            // Send location to backend
            await api.post(`/location/scan/${pet.id}`, {
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
              accuracy: position.coords.accuracy,
            });

            setLocationShared(true);
            alert('Thank you! Your location has been shared with the pet owner. They will receive an email with your location.');
          } catch (error) {
            console.error('Error sharing location:', error);
            alert('Failed to share location. Please try again.');
          } finally {
            setSharingLocation(false);
          }
        },
        (error) => {
          console.error('Geolocation error:', error);
          alert('Unable to get your location. Please enable location services and try again.');
          setSharingLocation(false);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0,
        }
      );
    } catch (error) {
      console.error('Share location error:', error);
      alert('Failed to share location');
      setSharingLocation(false);
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
          <h2>Tag Not Set Up</h2>
          <p>
            {error || 'This QR or NFC code does not match any registered pets.'}
          </p>
          <p style={{ marginTop: '12px' }}>
            If you are the owner, please go to <strong>wooftrace.com</strong> and tap
            <strong> "Activate Tag"</strong> to create your account and set up your pet.
          </p>
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
                src={pet.imageUrl}
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
            <div className="primary-contact-actions">
              {pet.ownerPhone && (
                <button
                  className="primary-contact-btn call-btn"
                  onClick={() => (window.location.href = `tel:${pet.ownerPhone}`)}
                >
                  📞 Call Owner
                </button>
              )}
              {pet.ownerEmail && (
                <button
                  className="primary-contact-btn email-btn"
                  onClick={() => (window.location.href = `mailto:${pet.ownerEmail}`)}
                >
                  ✉️ Email Owner
                </button>
              )}
            </div>
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

          <div className="location-sharing">
            <p className="location-prompt">
              <strong>Found this pet?</strong> Share your current location with the owner so they can find you!
            </p>
            <button
              onClick={shareLocation}
              disabled={sharingLocation || locationShared}
              className="share-location-btn"
            >
              {sharingLocation ? 'Sharing Location...' : locationShared ? 'Location Shared ✓' : '📍 Share My Location'}
            </button>
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

        {contacts.length > 0 && (
          <div className="contacts-card">
            <h3>Additional Emergency Contacts</h3>
            <div className="contacts-list">
              {contacts.map((contact) => (
                <div key={contact.id} className="contact-item">
                  <div className="contact-header">
                    <h4>{contact.name}</h4>
                    {contact.relation && <span className="contact-relation">{contact.relation}</span>}
                  </div>
                  <div className="contact-info">
                    <div className="primary-contact-actions">
                      {contact.phone && (
                        <button
                          className="primary-contact-btn call-btn"
                          onClick={() => (window.location.href = `tel:${contact.phone}`)}
                        >
                          📞 Call
                        </button>
                      )}
                      {contact.email && (
                        <button
                          className="primary-contact-btn email-btn"
                          onClick={() => (window.location.href = `mailto:${contact.email}`)}
                        >
                          ✉️ Email
                        </button>
                      )}
                    </div>
                    {contact.phone && (
                      <p>
                        <strong>Phone:</strong>{' '}
                        <a href={`tel:${contact.phone}`}>{contact.phone}</a>
                      </p>
                    )}
                    {contact.email && (
                      <p>
                        <strong>Email:</strong>{' '}
                        <a href={`mailto:${contact.email}`}>{contact.email}</a>
                      </p>
                    )}
                    {contact.address && (
                      <p>
                        <strong>Address:</strong> {contact.address}
                      </p>
                    )}
                    {contact.facebook && (
                      <p>
                        <strong>Facebook:</strong>{' '}
                        <a href={contact.facebook.startsWith('http') ? contact.facebook : `https://facebook.com/${contact.facebook}`} target="_blank" rel="noopener noreferrer">
                          {contact.facebook}
                        </a>
                      </p>
                    )}
                    {contact.instagram && (
                      <p>
                        <strong>Instagram:</strong>{' '}
                        <a href={contact.instagram.startsWith('http') ? contact.instagram : `https://instagram.com/${contact.instagram}`} target="_blank" rel="noopener noreferrer">
                          @{contact.instagram}
                        </a>
                      </p>
                    )}
                  </div>
                </div>
              ))}
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
