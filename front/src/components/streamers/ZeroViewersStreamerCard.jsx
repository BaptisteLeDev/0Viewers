import React from 'react';
import { 
  formatStreamDuration, 
  truncateText, 
  getTwitchStreamUrl 
} from '../../utils/helpers';
import './StreamerCard.css';

const ZeroViewersStreamerCard = ({ streamer, featured = false, showEmbed = false }) => {
  const handleWatchStream = () => {
    window.open(getTwitchStreamUrl(streamer.login), '_blank');
  };

  // URL pour l'iframe Twitch
  const embedUrl = `https://player.twitch.tv/?channel=${streamer.login}&parent=localhost&autoplay=false&muted=true`;

  return (
    <div className={`streamer-card ${featured ? 'featured' : ''}`}>
      {/* Iframe Twitch ou image de profil */}
      <div className="stream-thumbnail">
        {showEmbed ? (
          <iframe
            src={embedUrl}
            width="100%"
            height="248"
            frameBorder="0"
            allowFullScreen
            title={`Stream de ${streamer.display_name}`}
            className="twitch-embed"
          />
        ) : (
          <div className="profile-thumbnail">
            <img 
              src={streamer.profile_image_url || 'https://static-cdn.jtvnw.net/user-default-pictures-uv/215b7342-def9-11e9-9a66-784f43822e80-profile_image-300x300.png'}
              alt={`Avatar de ${streamer.display_name}`}
              className="profile-image"
            />
            <div className="live-indicator">🔴 LIVE</div>
          </div>
        )}
        
        <div className="duration-badge">
          {formatStreamDuration(streamer.started_at)}
        </div>
      </div>

      {/* Informations du streamer */}
      <div className="streamer-info">
        <div className="streamer-header">
          <img 
            src={streamer.profile_image_url || 'https://static-cdn.jtvnw.net/user-default-pictures-uv/215b7342-def9-11e9-9a66-784f43822e80-profile_image-300x300.png'}
            alt={`Avatar de ${streamer.display_name}`}
            className="avatar"
          />
          <div className="streamer-details">
            <h3 className="streamer-name">{streamer.display_name}</h3>
            <p className="streamer-login">@{streamer.login}</p>
            <p className="game-name">{streamer.game_name || 'Jeu non spécifié'}</p>
          </div>
        </div>

        <div className="stream-content">
          <h4 className="stream-title">
            {truncateText(streamer.title, featured ? 120 : 80)}
          </h4>
          
          <div className="stream-stats">
            <span className="viewer-count">👥 {streamer.viewer_count} viewers</span>
            <span className="followers">❤️ {streamer.followers} followers</span>
          </div>

          {streamer.description && (
            <p className="streamer-description">
              {truncateText(streamer.description, 100)}
            </p>
          )}
        </div>

        <div className="action-buttons">
          <button 
            onClick={handleWatchStream}
            className="watch-btn"
          >
            🎥 Regarder sur Twitch
          </button>
          
          {!showEmbed && (
            <button 
              onClick={() => window.location.href = `https://twitch.tv/${streamer.login}`}
              className="profile-btn"
            >
              👤 Profil
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ZeroViewersStreamerCard;