import React from 'react';
import StreamerCard from './StreamerCard';
import './StreamerList.css';

const StreamerList = ({ streams }) => {
  if (!streams || streams.length === 0) {
    return (
      <div className="empty-list">
        <p>Aucun streamer trouvé pour le moment 🤷‍♂️</p>
      </div>
    );
  }

  return (
    <div className="streamer-list">
      <div className="streamers-grid">
        {streams.map((stream) => (
          <StreamerCard 
            key={stream.id} 
            stream={stream} 
          />
        ))}
      </div>
    </div>
  );
};

export default StreamerList;