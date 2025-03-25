
import React from 'react';
import ProgressBar from './ProgressBar';

interface PlayerContainerProps {
  progress: number;
  currentAudio: string | null;
  handleSeek: (value: number) => void;
  children: React.ReactNode;
}

const PlayerContainer = ({ 
  progress, 
  currentAudio, 
  handleSeek, 
  children 
}: PlayerContainerProps) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-accent/95 backdrop-blur-sm border-t border-primary/20 h-[80px] p-2 z-50">
      <div className="max-w-7xl mx-auto h-full">
        <ProgressBar 
          progress={progress} 
          handleSeek={handleSeek} 
          showProgress={Boolean(currentAudio)}
        />
        <div className="flex items-center justify-between h-full px-4 sm:px-6">
          {children}
        </div>
      </div>
    </div>
  );
};

export default PlayerContainer;
