
import { useState, useEffect } from 'react';

/**
 * Custom hook to fetch the current title from a live stream
 * @param currentAudio The current audio source URL or null if playing live stream
 * @returns The current title of the live stream or null
 */
const useLiveStreamTitle = (currentAudio: string | null): string | null => {
  const [liveTitle, setLiveTitle] = useState<string | null>(null);

  // Fetch the current playing title from the radio stream periodically
  useEffect(() => {
    if (!currentAudio) {
      const fetchCurrentTitle = async () => {
        try {
          // Zeno.FM API endpoint for the stream metadata
          const response = await fetch('https://api.zeno.fm/streams/4d61wprrp7zuv/now_playing', {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json'
            }
          });
          
          if (response.ok) {
            const data = await response.json();
            if (data && data.now_playing) {
              setLiveTitle(data.now_playing.title || data.now_playing.song || null);
            }
          }
        } catch (error) {
          console.error('Error fetching current title:', error);
        }
      };

      // Initial fetch
      fetchCurrentTitle();
      
      // Setup interval to fetch every 30 seconds
      const interval = setInterval(fetchCurrentTitle, 30000);
      
      return () => clearInterval(interval);
    } else {
      // Clear the title if we're not playing the live stream
      setLiveTitle(null);
    }
  }, [currentAudio]);

  return liveTitle;
};

export default useLiveStreamTitle;
