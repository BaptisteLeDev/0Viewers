import React, { useEffect, useRef } from 'react';

const TwitchEmbed = ({ channel, width = "100%", height = 400, autoplay = false, muted = true }) => {
  const playerRef = useRef(null);
  const embedRef = useRef(null);

  useEffect(() => {
    if (!channel || !window.Twitch) return;

    // Générer un ID unique pour le player
    const playerId = `twitch-embed-${channel}-${Date.now()}`;
    
    // Nettoyer le player précédent s'il existe
    if (playerRef.current) {
      try {
        // Le SDK Twitch ne fournit pas de méthode destroy directe
        // On va simplement vider le conteneur
        if (embedRef.current) {
          embedRef.current.innerHTML = '';
        }
      } catch (error) {
        console.warn('Erreur lors du nettoyage du player Twitch:', error);
      }
    }

    // Créer le div pour le player
    if (embedRef.current) {
      embedRef.current.innerHTML = `<div id="${playerId}"></div>`;
    }

    // Déterminer les domaines parents
    const getParentDomains = () => {
      if (typeof window !== 'undefined') {
        const hostname = window.location.hostname;
        if (hostname === 'localhost' || hostname === '127.0.0.1') {
          return ['localhost'];
        }
        return [hostname];
      }
      return ['localhost'];
    };

    try {
      // Créer le player Twitch avec le SDK
      const options = {
        width: typeof width === 'string' ? width : `${width}px`,
        height: height,
        channel: channel,
        parent: getParentDomains(),
        autoplay: autoplay,
        muted: muted,
        // Autres options disponibles
        controls: true,
        time: '0s'
      };

      const player = new window.Twitch.Player(playerId, options);
      
      // Configuration du volume
      player.addEventListener(window.Twitch.Player.READY, () => {
        console.log(`✅ Player Twitch prêt pour ${channel}`);
        if (muted) {
          player.setVolume(0);
        } else {
          player.setVolume(0.5);
        }
      });

      // Gestion des événements
      player.addEventListener(window.Twitch.Player.PLAY, () => {
        console.log(`▶️ Lecture du stream ${channel}`);
      });

      player.addEventListener(window.Twitch.Player.PAUSE, () => {
        console.log(`⏸️ Pause du stream ${channel}`);
      });

      player.addEventListener(window.Twitch.Player.OFFLINE, () => {
        console.log(`📴 Stream ${channel} hors ligne`);
      });

      player.addEventListener(window.Twitch.Player.ONLINE, () => {
        console.log(`🔴 Stream ${channel} en ligne`);
      });

      // Stocker la référence du player
      playerRef.current = player;

    } catch (error) {
      console.error('Erreur lors de la création du player Twitch:', error);
    }

    // Nettoyage lors du démontage
    return () => {
      if (embedRef.current) {
        embedRef.current.innerHTML = '';
      }
      playerRef.current = null;
    };

  }, [channel, width, height, autoplay, muted]);

  return (
    <div 
      ref={embedRef}
      className="twitch-embed-container"
      style={{ 
        width: typeof width === 'string' ? width : `${width}px`,
        height: `${height}px`,
        borderRadius: '8px',
        overflow: 'hidden',
        background: '#000'
      }}
    />
  );
};

export default TwitchEmbed;