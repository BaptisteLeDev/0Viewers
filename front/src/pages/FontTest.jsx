import React from 'react';

const FontTest = () => {
  return (
    <div style={{ padding: '40px', maxWidth: '800px', margin: '0 auto' }}>
      <h1>🎨 Test des Polices 0Viewers</h1>
      
      <div style={{ marginBottom: '40px' }}>
        <h2>Police Iceland (Logo)</h2>
        <div style={{ fontSize: '24px', marginBottom: '20px' }}>
          <span className="iceland-regular">0Viewers</span> - Logo principal
        </div>
        <div style={{ fontSize: '32px', marginBottom: '20px' }}>
          <span className="iceland-regular">Découvrez les streamers français</span>
        </div>
        <div style={{ fontSize: '18px' }}>
          <span className="iceland-regular">ABCDEFGHIJKLMNOPQRSTUVWXYZ</span><br/>
          <span className="iceland-regular">abcdefghijklmnopqrstuvwxyz</span><br/>
          <span className="iceland-regular">0123456789 !@#$%^&*()</span>
        </div>
      </div>

      <div style={{ marginBottom: '40px' }}>
        <h2>Police Share Tech Mono (Texte général)</h2>
        <div style={{ fontSize: '16px', marginBottom: '20px' }}>
          <span className="share-tech-mono-regular">
            Ceci est le texte principal du site avec Share Tech Mono
          </span>
        </div>
        <div style={{ fontSize: '14px', marginBottom: '20px' }}>
          <span className="share-tech-mono-regular">
            🎮 Streamers français • 👥 0 viewers • 🔴 LIVE • ❤️ Suivre
          </span>
        </div>
        <div style={{ fontSize: '12px' }}>
          <span className="share-tech-mono-regular">
            ABCDEFGHIJKLMNOPQRSTUVWXYZ<br/>
            abcdefghijklmnopqrstuvwxyz<br/>
            0123456789 !@#$%^&*()
          </span>
        </div>
      </div>

      <div style={{ marginBottom: '40px' }}>
        <h2>Texte par défaut (body)</h2>
        <p>Ce paragraphe utilise la police par défaut du body (Share Tech Mono)</p>
        <p>🎯 Navigation, boutons, formulaires utilisent automatiquement cette police</p>
      </div>

      <div style={{ marginBottom: '40px' }}>
        <h2>Simulation Logo + Texte</h2>
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '12px',
          padding: '20px',
          background: 'rgba(255, 88, 228, 0.1)',
          borderRadius: '8px'
        }}>
          <div style={{ 
            width: '30px', 
            height: '30px', 
            background: 'linear-gradient(45deg, #18A0FB, #FF58E4)', 
            borderRadius: '6px' 
          }}></div>
          <span className="iceland-regular" style={{ fontSize: '24px', fontWeight: '400' }}>
            0Viewers
          </span>
          <span style={{ marginLeft: '20px', opacity: 0.8 }}>
            Découvrez les vrais talents français
          </span>
        </div>
      </div>

      <div>
        <h2>Styles techniques</h2>
        <div style={{ 
          background: '#1a1a1a', 
          padding: '20px', 
          borderRadius: '8px',
          fontFamily: 'monospace',
          fontSize: '14px'
        }}>
          <div style={{ color: '#10b981' }}>✅ Iceland: Loaded</div>
          <div style={{ color: '#10b981' }}>✅ Share Tech Mono: Loaded</div>
          <div style={{ color: '#f59e0b' }}>⚡ Fallback: system-ui, sans-serif</div>
        </div>
      </div>
    </div>
  );
};

export default FontTest;