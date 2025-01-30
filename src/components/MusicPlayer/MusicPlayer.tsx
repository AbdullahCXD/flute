import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  IoPlay,
  IoPause,
  IoShuffle,
  IoRepeat,
  IoVolumeHigh,
  IoVolumeMute,
  IoHeartOutline,
  IoHeart,
  IoMusicalNotes,
  IoList,
  IoShareSocial,
  IoInformation,
  IoDownload,
  IoAdd,
  IoTrash,
  IoVolumeMedium,
  IoVolumeLow,
} from 'react-icons/io5';
import { Song } from './types';

interface MusicPlayerProps {
  currentSong: Song | null;
}

interface ContextMenuItem {
  icon: React.ReactNode;
  label: string;
  action: () => void;
  color?: string;
  divider?: boolean;
}

export const MusicPlayer: React.FC<MusicPlayerProps> = ({ currentSong }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(0.7);
  const [isMuted, setIsMuted] = useState(false);
  const [isShuffling, setIsShuffling] = useState(false);
  const [repeatMode, setRepeatMode] = useState<'none' | 'all' | 'one'>('none');
  const [isFavorite, setIsFavorite] = useState(false);
  const [showPlaylist, setShowPlaylist] = useState(false);
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number; } | null>(null);
  
  const audioRef = useRef<HTMLAudioElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (currentSong && audioRef.current) {
      const audio = audioRef.current;
      audio.src = URL.createObjectURL(currentSong.file as File);
      if (isPlaying) {
        audio.play();
      }
    }
  }, [currentSong]);

  useEffect(() => {
    const audio = audioRef.current;
    if (audio) {
      audio.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  const handlePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleProgressBarClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (audioRef.current && progressBarRef.current) {
      const rect = progressBarRef.current.getBoundingClientRect();
      const percent = (e.clientX - rect.left) / rect.width;
      const time = percent * audioRef.current.duration;
      audioRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleRepeatClick = () => {
    setRepeatMode(prev => {
      switch (prev) {
        case 'none': return 'all';
        case 'all': return 'one';
        case 'one': return 'none';
      }
    });
  };

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!currentSong) return;

    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;

    // Ensure the menu doesn't go off screen
    const x = Math.min(e.clientX, window.innerWidth - 220);
    const y = Math.min(e.clientY, window.innerHeight - 300);

    setContextMenu({ x, y });
  };

  const closeContextMenu = () => {
    setContextMenu(null);
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (contextMenu && !containerRef.current?.contains(e.target as Node)) {
        closeContextMenu();
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [contextMenu]);

  const getVolumeIcon = () => {
    if (isMuted || volume === 0) return <IoVolumeMute className="w-5 h-5" />;
    if (volume < 0.3) return <IoVolumeLow className="w-5 h-5" />;
    if (volume < 0.7) return <IoVolumeMedium className="w-5 h-5" />;
    return <IoVolumeHigh className="w-5 h-5" />;
  };

  const contextMenuItems: ContextMenuItem[] = [
    {
      icon: <IoInformation className="w-5 h-5" />,
      label: 'Song Info',
      action: () => {
        // Implement song info modal
        closeContextMenu();
      }
    },
    {
      icon: <IoShareSocial className="w-5 h-5" />,
      label: 'Share',
      action: () => {
        // Implement share functionality
        closeContextMenu();
      }
    },
    {
      icon: <IoDownload className="w-5 h-5" />,
      label: 'Download',
      action: () => {
        // Implement download functionality
        closeContextMenu();
      }
    },
    {
      icon: <IoAdd className="w-5 h-5" />,
      label: 'Add to Playlist',
      action: () => {
        // Implement add to playlist
        closeContextMenu();
      },
      divider: true
    },
    {
      icon: isFavorite ? <IoHeart className="w-5 h-5" /> : <IoHeartOutline className="w-5 h-5" />,
      label: isFavorite ? 'Remove from Favorites' : 'Add to Favorites',
      action: () => {
        setIsFavorite(!isFavorite);
        closeContextMenu();
      }
    },
    {
      icon: <IoTrash className="w-5 h-5" />,
      label: 'Remove from Library',
      action: () => {
        // Implement remove functionality
        closeContextMenu();
      },
      color: 'text-red-400'
    }
  ];

  return (
    <div 
      ref={containerRef}
      onContextMenu={handleContextMenu}
      className="fixed bottom-0 left-0 right-0 bg-violet-950/90 backdrop-blur-xl border-t border-violet-800/20
                 shadow-[0_-4px_20px_rgba(120,0,255,0.15)] z-50"
    >
      <div className="container mx-auto px-4">
        {/* Progress Bar */}
        <div 
          ref={progressBarRef}
          className="h-1 -mt-[1px] bg-violet-800/30 cursor-pointer group relative"
          onClick={handleProgressBarClick}
        >
          <motion.div 
            className="absolute inset-y-0 left-0 bg-gradient-to-r from-violet-500 to-fuchsia-500"
            style={{ width: `${(currentTime / (audioRef.current?.duration || 1)) * 100}%` }}
          />
          <div className="absolute inset-y-0 left-0 right-0 bg-gradient-to-r from-violet-400/0 via-violet-400/20 to-violet-400/0 
                        opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="absolute h-3 w-3 bg-white rounded-full shadow-lg -top-1 -mt-px
                        opacity-0 group-hover:opacity-100 transition-opacity"
               style={{ left: `${(currentTime / (audioRef.current?.duration || 1)) * 100}%`, transform: 'translateX(-50%)' }} />
        </div>

        <div className="h-24 flex items-center justify-between gap-8">
          {/* Song Info */}
          <div className="flex items-center gap-4 flex-1 min-w-0">
            <div className="w-16 h-16 rounded-xl overflow-hidden bg-violet-900/50 border border-violet-800/50
                          group-hover:border-violet-700/50 transition-colors relative">
              {currentSong?.cover ? (
                <img 
                  src={currentSong.cover} 
                  alt={currentSong.title} 
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-violet-900 to-indigo-900">
                  <motion.div
                    animate={{ 
                      scale: [1, 1.2, 1],
                      rotate: [0, 10, -10, 0]
                    }}
                    transition={{ 
                      duration: 4,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  >
                    <IoMusicalNotes className="w-8 h-8 text-violet-300/50" />
                  </motion.div>
                </div>
              )}
            </div>
            <div className="min-w-0">
              <h3 className="font-medium text-lg truncate text-violet-100">
                {currentSong?.title || 'No song selected'}
              </h3>
              <p className="text-sm text-violet-400 truncate">{currentSong?.artist || 'Select a song to play'}</p>
            </div>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setIsFavorite(!isFavorite)}
              className={`p-2 rounded-lg transition-colors ${
                isFavorite ? 'text-pink-500 hover:bg-pink-500/10' : 'text-violet-400 hover:bg-violet-800/20'
              }`}
            >
              {isFavorite ? <IoHeart className="w-5 h-5" /> : <IoHeartOutline className="w-5 h-5" />}
            </motion.button>
          </div>

          {/* Controls */}
          <div className="flex flex-col items-center gap-2">
            <div className="flex items-center gap-3">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsShuffling(!isShuffling)}
                className={`p-2 rounded-lg transition-colors ${
                  isShuffling ? 'text-violet-300 bg-violet-800/30' : 'text-violet-400 hover:bg-violet-800/20'
                }`}
              >
                <IoShuffle className="w-5 h-5" />
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
                onClick={handlePlayPause}
                className="w-12 h-12 flex items-center justify-center bg-violet-500 rounded-full
                         text-white hover:bg-violet-400 transition-colors shadow-lg shadow-violet-500/20"
              >
                {isPlaying ? (
                  <IoPause className="w-6 h-6" />
                ) : (
                  <IoPlay className="w-6 h-6 ml-1" />
                )}
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={handleRepeatClick}
                className={`p-2 rounded-lg transition-colors relative ${
                  repeatMode !== 'none' ? 'text-violet-300 bg-violet-800/30' : 'text-violet-400 hover:bg-violet-800/20'
                }`}
              >
                <IoRepeat className="w-5 h-5" />
                {repeatMode === 'one' && (
                  <span className="absolute -top-1 -right-1 text-[10px] bg-violet-500 rounded-full w-4 h-4 flex items-center justify-center">
                    1
                  </span>
                )}
              </motion.button>
            </div>
            <div className="flex items-center gap-2 text-sm text-violet-400">
              <span>{formatTime(currentTime)}</span>
              <span>/</span>
              <span>{formatTime(audioRef.current?.duration || 0)}</span>
            </div>
          </div>

          {/* Volume & Playlist */}
          <div className="flex items-center gap-4 flex-1 justify-end">
            <div className="flex items-center gap-2">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsMuted(!isMuted)}
                className="p-2 text-violet-400 hover:bg-violet-800/20 rounded-lg transition-colors"
              >
                {getVolumeIcon()}
              </motion.button>
              <div className="w-24 h-1 bg-violet-800/30 rounded-full relative group">
                <div 
                  className="absolute inset-y-0 left-0 bg-gradient-to-r from-violet-500 to-fuchsia-500 rounded-full"
                  style={{ width: `${volume * 100}%` }}
                />
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={volume}
                  onChange={(e) => setVolume(parseFloat(e.target.value))}
                  className="absolute inset-0 w-full opacity-0 cursor-pointer"
                />
              </div>
            </div>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setShowPlaylist(!showPlaylist)}
              className={`p-2 rounded-lg transition-colors ${
                showPlaylist ? 'text-violet-300 bg-violet-800/30' : 'text-violet-400 hover:bg-violet-800/20'
              }`}
            >
              <IoList className="w-5 h-5" />
            </motion.button>
          </div>
        </div>
      </div>

      <audio
        ref={audioRef}
        onTimeUpdate={handleTimeUpdate}
        onEnded={() => setIsPlaying(false)}
        loop={repeatMode === 'one'}
      />

      {/* Context Menu */}
      <AnimatePresence>
        {contextMenu && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.1 }}
            className="fixed bg-violet-950/95 backdrop-blur-xl border border-violet-800/30 rounded-lg shadow-xl
                     p-1 w-52 z-50"
            style={{ 
              left: contextMenu.x,
              top: contextMenu.y,
              transform: 'translateY(-100%)'
            }}
          >
            {contextMenuItems.map((item, index) => (
              <React.Fragment key={index}>
                <motion.button
                  whileHover={{ backgroundColor: 'rgba(139, 92, 246, 0.1)' }}
                  className={`w-full px-3 py-2 flex items-center gap-3 rounded-lg text-left text-sm
                           ${item.color || 'text-violet-200'} hover:bg-violet-800/20 transition-colors`}
                  onClick={item.action}
                >
                  {item.icon}
                  {item.label}
                </motion.button>
                {item.divider && (
                  <div className="my-1 border-t border-violet-800/30" />
                )}
              </React.Fragment>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}; 