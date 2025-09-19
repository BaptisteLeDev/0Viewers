import { useEffect, useState } from 'react';
import TwitchEmbed from '../components/streamers/TwitchEmbed';

const TwitchTest = () => {
  const [twitchLoaded, setTwitchLoaded] = useState(false);

  useEffect(() => {
    // Vérifier si le SDK Twitch est chargé
    const checkTwitch = () => {
      if (window.Twitch && window.Twitch.Player) {
        setTwitchLoaded(true);
        console.log('✅ SDK Twitch chargé avec succès');
      } else {
        console.log('⏳ Attente du SDK Twitch...');
        setTimeout(checkTwitch, 100);
      }
    };

    checkTwitch();
  }, []);

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <h2>🧪 Test du SDK Twitch Player</h2>
      
      <div style={{ marginBottom: '20px' }}>
        <p><strong>Status SDK:</strong> {twitchLoaded ? '✅ Chargé' : '⏳ En cours...'}</p>
        <p><strong>Window.Twitch:</strong> {window.Twitch ? '✅ Disponible' : '❌ Non disponible'}</p>
      </div>

      {twitchLoaded ? (
        <div>
          <h3>Test avec un streamer populaire (exemple)</h3>
          <TwitchEmbed 
            channel="gotaga" // Remplace par un nom de streamer français connu
            width="100%"
            height={400}
            autoplay={false}
            muted={true}
          />
        </div>
      ) : (
        <div style={{ 
          padding: '40px', 
          textAlign: 'center', 
          background: '#f0f0f0', 
          borderRadius: '8px' 
        }}>
          <p>Chargement du SDK Twitch...</p>
        </div>
      )}
    </div>
  );
};

export default TwitchTest;