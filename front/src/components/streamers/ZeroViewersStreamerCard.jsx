import {useEffect, useState} from 'react';
import { 
  formatStreamDuration, 
  truncateText, 
  getTwitchStreamUrl 
} from '../../utils/helpers';
import TwitchEmbed from './TwitchEmbed';
import './StreamerCard.css';
import supabase from "../../../../back/supabase.js";
import {getProfil} from "../../../../back/auth.js";

const ZeroViewersStreamerCard = ({ streamer, featured = false, showEmbed = false }) => {


    const [profil, setProfil] = useState(null);
    useEffect(() => {
        // Récupération du profil de manière asynchrone
        async function fetchProfil() {
            const data = await getProfil();
            setProfil(data);
        }

        fetchProfil();
    }, []);

    const handleWatchStream = async () => {
        try {
            // 1. Appel à Supabase pour insérer en base
            const { error } = await supabase
                .from('profil_streamers_view')
                .insert([
                    {
                        id_streamer: streamer.id,
                        id_user: profil[0].id,
                    },
                ]);

            if (error) {
                console.error('Erreur lors de l’insertion Supabase:', error.message);
            } else {
                console.log(`Streameur ${streamer.id} sauvegardé avec succès`);
            }

            // 2. Ouvre la page Twitch
            window.open(getTwitchStreamUrl(streamer.login), '_blank');
        } catch (err) {
            console.error('Erreur inattendue:', err);
        }
    };


      return (
          <div className={`streamer-card ${featured ? 'featured' : ''}`}>
              {/* Twitch Embed interactif (seulement pour featured sur Home) ou image de profil */}
              <div className="stream-thumbnail">
                  {showEmbed && featured ? (
                      <TwitchEmbed
                          channel={streamer.login}
                          width="100%"
                          height={featured ? 394 : 248}
                          autoplay={false}
                          muted={true}
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
            <p 
              className="game-name" 
              title={streamer.game_name || 'Non spécifié'}
            >
              {streamer.game_name && streamer.game_name.length > 20 
                ? `${streamer.game_name.substring(0, 20)}...` 
                : streamer.game_name || 'Non spécifié'
              }
            </p>
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
                          className="btn-style"
                      >
                          🎥 Regarder sur Twitch
                      </button>
                  </div>
              </div>
          </div>
      );
  };

export default ZeroViewersStreamerCard;