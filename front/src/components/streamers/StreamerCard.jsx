import React from 'react';
import { 
  formatStreamDuration, 
  truncateText, 
  getTwitchStreamUrl,
  getAvatarUrl 
} from '../../utils/helpers';
import './StreamerCard.css';

const StreamerCard = ({ stream, featured = false }) => {
  const handleWatchStream = () => {
    window.open(getTwitchStreamUrl(stream.user_login), '_blank');
  };

  return (
    <div className={`streamer-card ${featured ? 'featured' : ''}`}>
      {/* Miniature du stream */}
      <div className="stream-thumbnail">
        <img 
          src={stream.thumbnail_url.replace('{width}', '440').replace('{height}', '248')}
          alt={`Stream de ${stream.user_name}`}
          className="thumbnail-image"
        />
        <div className="live-indicator">🔴 LIVE</div>
        <div className="duration-badge">
          {formatStreamDuration(stream.started_at)}
        </div>
      </div>

      {/* Informations du streamer */}
      <div className="streamer-info">
        <div className="streamer-header">
          <img 
            src={getAvatarUrl(stream.user_profile_image_url, 50)}
            alt={`Avatar de ${stream.user_name}`}
            className="avatar"
          />
          <div className="streamer-details">
            <h3 className="streamer-name">{stream.user_name}</h3>
            <p className="game-name">{stream.game_name || 'Non spécifié'}</p>
          </div>
        </div>

        <div className="stream-content">
          <h4 className="stream-title">
            {truncateText(stream.title, featured ? 120 : 80)}
          </h4>
          
          <div className="stream-stats">
            <span className="viewer-count">👥 {stream.viewer_count} viewers</span>
            <span className="language">🌐 {stream.language.toUpperCase()}</span>
          </div>

          {stream.tag_ids && stream.tag_ids.length > 0 && (
            <div className="tags">
              {stream.tag_ids.slice(0, 3).map((tag, index) => (
                <span key={index} className="tag">#{tag}</span>
              ))}
            </div>
          )}
        </div>

        <button 
          onClick={handleWatchStream}
          className="watch-btn"
        >
          🎥 Regarder sur Twitch
        </button>
      </div>
    </div>
  );
};

export default StreamerCard;