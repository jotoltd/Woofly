import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdmin } from '../context/AdminContext';
import api from '../api/axios';
import './FactoryPanel.css';

interface Tag {
  id: string;
  tagCode: string;
  activationCode: string;
  batchNumber: string;
  isActivated: boolean;
  activatedAt?: string;
  user?: { name: string; email: string };
  pet?: { name: string; species: string };
}

interface Stats {
  total: number;
  activated: number;
  linked: number;
  available: number;
  batches: { batchNumber: string; count: number }[];
}

const FactoryPanel: React.FC = () => {
  const { admin, adminLogout } = useAdmin();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'generate' | 'tags' | 'stats'>('generate');

  // Generate form
  const [quantity, setQuantity] = useState('10');
  const [batchNumber, setBatchNumber] = useState('');
  const [generating, setGenerating] = useState(false);
  const [generatedTags, setGeneratedTags] = useState<Tag[]>([]);

  // Tags list
  const [tags, setTags] = useState<Tag[]>([]);
  const [loadingTags, setLoadingTags] = useState(false);

  // Stats
  const [stats, setStats] = useState<Stats | null>(null);
  const [loadingStats, setLoadingStats] = useState(false);

  // Selected tag for programming
  const [_selectedTag, setSelectedTag] = useState<Tag | null>(null);
  const [programmingData, setProgrammingData] = useState<any>(null);

  useEffect(() => {
    if (activeTab === 'tags') {
      fetchTags();
    } else if (activeTab === 'stats') {
      fetchStats();
    }
  }, [activeTab]);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setGenerating(true);

    try {
      const response = await api.post('/admin/factory/generate', {
        quantity: parseInt(quantity),
        batchNumber: batchNumber || undefined,
      });

      setGeneratedTags(response.data.tags);
      alert(`Successfully generated ${response.data.quantity} tags!`);

      // Clear form
      setQuantity('10');
      setBatchNumber('');
    } catch (error: any) {
      alert(error.response?.data?.error || 'Failed to generate tags');
    } finally {
      setGenerating(false);
    }
  };

  const fetchTags = async () => {
    setLoadingTags(true);
    try {
      const response = await api.get('/admin/factory/tags?limit=100');
      setTags(response.data.tags);
    } catch (error) {
      console.error('Failed to fetch tags:', error);
    } finally {
      setLoadingTags(false);
    }
  };

  const fetchStats = async () => {
    setLoadingStats(true);
    try {
      const response = await api.get('/admin/factory/stats');
      setStats(response.data);
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    } finally {
      setLoadingStats(false);
    }
  };

  const fetchProgrammingData = async (tag: Tag) => {
    try {
      const response = await api.get(`/admin/factory/program/${tag.id}`);
      setProgrammingData(response.data);
      setSelectedTag(tag);
    } catch (error: any) {
      alert(error.response?.data?.error || 'Failed to fetch programming data');
    }
  };

  const handleLogout = () => {
    adminLogout();
    navigate('/admin/login');
  };

  const exportTags = () => {
    if (generatedTags.length === 0) {
      alert('No tags to export');
      return;
    }

    const csv = [
      ['Tag Code', 'Activation Code', 'Batch Number', 'QR URL', 'NFC URL'].join(','),
      ...generatedTags.map(tag =>
        [
          tag.tagCode,
          tag.activationCode,
          tag.batchNumber,
          `https://wooftrace.com/pet/qr/${tag.tagCode}`,
          `https://wooftrace.com/pet/nfc/${tag.tagCode}`,
        ].join(',')
      ),
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `wooftrace-tags-${generatedTags[0].batchNumber}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="factory-panel">
      <header className="factory-header">
        <div>
          <h1>🏭 WoofTrace Factory</h1>
          <p>Manufacturing Portal</p>
        </div>
        <div className="header-right">
          <span>Welcome, {admin?.name}</span>
          <button onClick={handleLogout} className="logout-btn">
            Logout
          </button>
        </div>
      </header>

      <div className="factory-content">
        <div className="tabs">
          <button
            className={`tab ${activeTab === 'generate' ? 'active' : ''}`}
            onClick={() => setActiveTab('generate')}
          >
            Generate Tags
          </button>
          <button
            className={`tab ${activeTab === 'tags' ? 'active' : ''}`}
            onClick={() => setActiveTab('tags')}
          >
            All Tags
          </button>
          <button
            className={`tab ${activeTab === 'stats' ? 'active' : ''}`}
            onClick={() => setActiveTab('stats')}
          >
            Statistics
          </button>
        </div>

        {activeTab === 'generate' && (
          <div className="tab-content">
            <div className="generate-section glass-card">
              <h2>Generate New Tags</h2>
              <form onSubmit={handleGenerate}>
                <div className="form-row">
                  <div className="form-group">
                    <label>Quantity (1-1000)</label>
                    <input
                      type="number"
                      min="1"
                      max="1000"
                      value={quantity}
                      onChange={(e) => setQuantity(e.target.value)}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Batch Number (optional)</label>
                    <input
                      type="text"
                      value={batchNumber}
                      onChange={(e) => setBatchNumber(e.target.value)}
                      placeholder="Leave empty for auto-generation"
                    />
                  </div>
                </div>
                <button type="submit" className="btn" disabled={generating}>
                  {generating ? 'Generating...' : 'Generate Tags'}
                </button>
              </form>

              {generatedTags.length > 0 && (
                <div className="generated-tags">
                  <div className="tags-header">
                    <h3>Generated {generatedTags.length} Tags</h3>
                    <button onClick={exportTags} className="btn btn-secondary">
                      Export to CSV
                    </button>
                  </div>
                  <div className="tags-table-container">
                    <table className="tags-table">
                      <thead>
                        <tr>
                          <th>Tag Code</th>
                          <th>Activation Code</th>
                          <th>Batch</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {generatedTags.map((tag) => (
                          <tr key={tag.id}>
                            <td><code>{tag.tagCode}</code></td>
                            <td><strong>{tag.activationCode}</strong></td>
                            <td>{tag.batchNumber}</td>
                            <td>
                              <button
                                className="btn-small"
                                onClick={() => fetchProgrammingData(tag)}
                              >
                                Program NFC
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'tags' && (
          <div className="tab-content">
            <div className="tags-section glass-card">
              <h2>All Tags</h2>
              {loadingTags ? (
                <p>Loading tags...</p>
              ) : (
                <div className="tags-table-container">
                  <table className="tags-table">
                    <thead>
                      <tr>
                        <th>Tag Code</th>
                        <th>Activation Code</th>
                        <th>Batch</th>
                        <th>Status</th>
                        <th>Owner</th>
                        <th>Pet</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {tags.map((tag) => (
                        <tr key={tag.id}>
                          <td><code>{tag.tagCode}</code></td>
                          <td><strong>{tag.activationCode}</strong></td>
                          <td>{tag.batchNumber}</td>
                          <td>
                            {tag.isActivated ? (
                              <span className="badge badge-success">Activated</span>
                            ) : (
                              <span className="badge badge-warning">Pending</span>
                            )}
                          </td>
                          <td>{tag.user ? tag.user.name : '-'}</td>
                          <td>{tag.pet ? `${tag.pet.name} (${tag.pet.species})` : '-'}</td>
                          <td>
                            <button
                              className="btn-small"
                              onClick={() => fetchProgrammingData(tag)}
                            >
                              View
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'stats' && (
          <div className="tab-content">
            <div className="stats-section">
              {loadingStats ? (
                <p>Loading statistics...</p>
              ) : stats ? (
                <>
                  <div className="stats-grid">
                    <div className="stat-card glass-card">
                      <h3>Total Tags</h3>
                      <p className="stat-value">{stats.total}</p>
                    </div>
                    <div className="stat-card glass-card">
                      <h3>Activated</h3>
                      <p className="stat-value">{stats.activated}</p>
                    </div>
                    <div className="stat-card glass-card">
                      <h3>Linked to Pets</h3>
                      <p className="stat-value">{stats.linked}</p>
                    </div>
                    <div className="stat-card glass-card">
                      <h3>Available</h3>
                      <p className="stat-value">{stats.available}</p>
                    </div>
                  </div>

                  <div className="batches-section glass-card">
                    <h2>Batches</h2>
                    <table className="tags-table">
                      <thead>
                        <tr>
                          <th>Batch Number</th>
                          <th>Count</th>
                        </tr>
                      </thead>
                      <tbody>
                        {stats.batches.map((batch, i) => (
                          <tr key={i}>
                            <td><strong>{batch.batchNumber}</strong></td>
                            <td>{batch.count}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </>
              ) : null}
            </div>
          </div>
        )}
      </div>

      {programmingData && (
        <div className="modal-overlay" onClick={() => setProgrammingData(null)}>
          <div className="modal glass-card" onClick={(e) => e.stopPropagation()}>
            <h2>NFC Programming Data</h2>
            <div className="programming-data">
              <div className="data-item">
                <label>Tag Code:</label>
                <code>{programmingData.tagCode}</code>
              </div>
              <div className="data-item">
                <label>Activation Code:</label>
                <strong>{programmingData.activationCode}</strong>
              </div>
              <div className="data-item">
                <label>Batch:</label>
                <span>{programmingData.batchNumber}</span>
              </div>
              <div className="data-item">
                <label>QR Code URL:</label>
                <code>{programmingData.qrData}</code>
              </div>
              <div className="data-item">
                <label>NFC URL:</label>
                <code>{programmingData.nfcData.url}</code>
              </div>
            </div>
            <button className="btn" onClick={() => setProgrammingData(null)}>
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FactoryPanel;
