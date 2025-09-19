import { useRef, useState } from 'react';
import { useAvatar } from '../../hooks/useAvatar.js';
import './AvatarUpload.css';

const AvatarUpload = ({ className = '', showName = true }) => {
  const { avatar, loading, error, user, uploadAvatar, deleteAvatar } = useAvatar();
  const fileInputRef = useRef(null);
  const [dragOver, setDragOver] = useState(false);

  const handleFileSelect = async (file) => {
    if (file) {
      await uploadAvatar(file);
    }
  };

  const handleInputChange = (e) => {
    const file = e.target.files[0];
    handleFileSelect(file);
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer votre avatar ?')) {
      await deleteAvatar();
    }
  };

  if (!user) {
    return null;
  }

  return (
    <div className={`avatar-upload ${className}`}>
      <div className="avatar-section">
        {/* Avatar principal */}
        <div 
          className={`avatar-container ${dragOver ? 'drag-over' : ''} ${loading ? 'loading' : ''}`}
          onClick={handleClick}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <div className="avatar-image-wrapper">
            <img 
              src={avatar?.url || '/api/placeholder/200/200'} 
              alt="Avatar" 
              className="avatar-image"
            />
            
            {loading && (
              <div className="avatar-loading">
                <div className="loading-spinner"></div>
              </div>
            )}
            
            <div className="avatar-overlay">
              <div className="avatar-overlay-content">
                <span className="upload-icon">📷</span>
                <span className="upload-text">
                  {avatar?.isDefault ? 'Ajouter' : 'Modifier'}
                </span>
              </div>
            </div>
          </div>
          
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleInputChange}
            className="avatar-input"
          />
        </div>

        {/* Informations utilisateur */}
        {showName && (
          <div className="avatar-info">
            <h3 className="user-name">
              {user.user_metadata?.name || user.email?.split('@')[0] || 'Utilisateur'}
            </h3>
            <p className="avatar-status">
              {avatar?.isDefault ? 'Avatar par défaut' : 'Avatar personnalisé'}
            </p>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="avatar-actions">
        <button 
          onClick={handleClick}
          className="btn-style avatar-btn"
          disabled={loading}
        >
          📷 {avatar?.isDefault ? 'Ajouter un avatar' : 'Changer d\'avatar'}
        </button>

        {!avatar?.isDefault && (
          <button 
            onClick={handleDelete}
            className="btn-style avatar-btn delete-btn"
            disabled={loading}
          >
            🗑️ Supprimer
          </button>
        )}
      </div>

      {/* Messages d'erreur */}
      {error && (
        <div className="avatar-error">
          <span className="error-icon">⚠️</span>
          <span className="error-text">{error}</span>
        </div>
      )}

      {/* Instructions */}
      <div className="avatar-instructions">
        <p>
          📋 <strong>Formats supportés :</strong> JPG, PNG, WebP
        </p>
        <p>
          📏 <strong>Taille maximum :</strong> 5 MB
        </p>
        <p>
          🖱️ <strong>Glissez-déposez</strong> une image ou cliquez pour sélectionner
        </p>
      </div>
    </div>
  );
};

export default AvatarUpload;