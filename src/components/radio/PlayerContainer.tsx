
import React from 'react';
import ProgressBar from './ProgressBar';
import { useScrollDirection } from '@/hooks/useScrollDirection';

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
  const { isAtTop } = useScrollDirection();
  
  return (
    <div 
      className={`fixed bottom-0 left-0 right-0 bg-secondary/95 backdrop-blur-sm border-t border-border dark:border-primary/20 h-[64px] p-2 z-50 transition-all duration-500 ease-in-out ${
        isAtTop ? 'translate-y-0' : 'translate-y-full'
      }`}
    >
      <div className="max-w-7xl mx-auto h-full">
        <ProgressBar 
          progress={progress} 
          handleSeek={handleSeek} 
          showProgress={Boolean(currentAudio)}
        />
        <div className="flex items-center justify-between h-full px-4 sm:px-6 text-foreground">
          {children}
        </div>
      </div>
    </div>
  );
};

export default PlayerContainer;
