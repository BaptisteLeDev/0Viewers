import React, { useState, useEffect } from 'react';
import StreamerList from '../components/streamers/StreamerList';
import Loading from '../components/common/Loading';
import { useTwitchStreams } from '../hooks/useTwitchStreams';
import './Streamers.css';

const Streamers = () => {
  const { streams, loading, error, refreshStreams } = useTwitchStreams();
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Filtrage des streams
  const filteredStreams = streams.filter(stream => {
    const matchesSearch = stream.user_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         stream.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         stream.game_name.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (filter === 'all') return matchesSearch;
    if (filter === 'recent') {
      const startTime = new Date(stream.started_at);
      const now = new Date();
      const diffHours = (now - startTime) / (1000 * 60 * 60);
      return matchesSearch && diffHours <= 2; // Streams commencés il y a moins de 2h
    }
    
    return matchesSearch;
  });

  if (loading) {
    return <Loading message="Chargement des streamers à 0 viewers..." />;
  }

  if (error) {
    return (
      <div className="error-container">
        <h2>Erreur de chargement 😞</h2>
        <p>Impossible de récupérer la liste des streamers.</p>
        <button onClick={refreshStreams} className="retry-btn">
          Réessayer
        </button>
      </div>
    );
  }

  return (
    <div className="streamers-page">
      <header className="page-header">
        <h1>🎮 Streamers à 0 viewers</h1>
        <p>Découvrez {streams.length} streamers en live qui méritent votre attention</p>
      </header>

      <div className="filters-section">
        <div className="search-container">
          <input
            type="text"
            placeholder="Rechercher par nom, jeu ou titre..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>

        <div className="filter-buttons">
          <button 
            className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
            onClick={() => setFilter('all')}
          >
            Tous ({streams.length})
          </button>
          <button 
            className={`filter-btn ${filter === 'recent' ? 'active' : ''}`}
            onClick={() => setFilter('recent')}
          >
            Récents
          </button>
        </div>

        <button onClick={refreshStreams} className="refresh-btn">
          🔄 Actualiser
        </button>
      </div>

      <div className="results-info">
        <p>{filteredStreams.length} streamers trouvés</p>
      </div>

      {filteredStreams.length > 0 ? (
        <StreamerList streams={filteredStreams} />
      ) : (
        <div className="no-results">
          <h3>Aucun streamer trouvé 🤷‍♂️</h3>
          <p>Essayez de modifier vos critères de recherche ou revenez plus tard.</p>
        </div>
      )}
    </div>
  );
};

export default Streamers;