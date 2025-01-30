import React from 'react';
import { motion } from 'framer-motion';
import { IoMusicalNotes, IoPlay, IoPause, IoTime, IoHeart } from 'react-icons/io5';
import { Song } from './types';

interface PlaylistProps {
  songs: Song[];
  currentSong: Song | null;
  onSongSelect: (song: Song) => void;
  viewMode: 'grid' | 'list';
}

export const Playlist: React.FC<PlaylistProps> = ({ songs, currentSong, onSongSelect, viewMode }) => {
  const formatDuration = (duration: number = 0) => {
    const minutes = Math.floor(duration / 60);
    const seconds = Math.floor(duration % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  if (viewMode === 'grid') {
    return (
      <div className="bg-violet-950/20 backdrop-blur-sm rounded-2xl p-6 border border-violet-900/50 
                    shadow-[0_0_20px_rgba(120,0,255,0.05)] hover:shadow-[0_0_30px_rgba(120,0,255,0.1)] transition-all duration-500">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold bg-gradient-to-r from-violet-200 to-indigo-200 bg-clip-text text-transparent
                       [text-shadow:0_2px_4px_rgba(120,0,255,0.1)]">
            Your Library
          </h3>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {songs.map((song) => (
            <motion.div
              key={song.id}
              className={`group relative rounded-xl cursor-pointer overflow-hidden backdrop-blur-sm
                         ${currentSong?.id === song.id 
                           ? 'ring-2 ring-violet-500 ring-offset-2 ring-offset-violet-950/50' 
                           : 'hover:ring-1 hover:ring-violet-500/50 hover:ring-offset-1 hover:ring-offset-violet-950/30'}`}
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => onSongSelect(song)}
            >
              <div className="aspect-square bg-violet-900/30 relative group">
                {song.cover ? (
                  <img 
                    src={song.cover} 
                    alt={song.title} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-violet-900 to-indigo-900 relative overflow-hidden">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(120,0,255,0.2),rgba(0,0,0,0))]" />
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
                      <IoMusicalNotes className="w-12 h-12 text-violet-300/50" />
                    </motion.div>
                  </div>
                )}
                
                {/* Enhanced Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent 
                              opacity-0 group-hover:opacity-100 transition-all duration-300">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <motion.button
                      className="w-12 h-12 flex items-center justify-center bg-violet-500/80 rounded-full
                               text-white transform scale-0 group-hover:scale-100 transition-transform
                               hover:bg-violet-400/80 shadow-lg shadow-violet-950/50"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      {currentSong?.id === song.id ? (
                        <IoPause className="w-6 h-6" />
                      ) : (
                        <IoPlay className="w-6 h-6 ml-1" />
                      )}
                    </motion.button>
                  </div>
                </div>

                {/* Enhanced Duration Badge */}
                <div className="absolute top-2 right-2 px-2 py-1 bg-black/50 backdrop-blur-sm rounded-md
                              text-xs text-violet-200 opacity-0 group-hover:opacity-100 transition-all duration-300
                              shadow-lg shadow-violet-950/20">
                  {formatDuration(song.duration)}
                </div>

                {/* Enhanced Playing Indicator */}
                {currentSong?.id === song.id && (
                  <div className="absolute bottom-0 left-0 right-0 flex justify-center gap-1 p-2 bg-gradient-to-t from-black/40 to-transparent">
                    <div className="w-1 h-4 bg-violet-400/80 rounded-full animate-[soundbar_0.5s_ease-in-out_infinite_alternate] shadow-lg shadow-violet-950/50"></div>
                    <div className="w-1 h-4 bg-violet-400/80 rounded-full animate-[soundbar_0.5s_ease-in-out_infinite_alternate_0.2s] shadow-lg shadow-violet-950/50"></div>
                    <div className="w-1 h-4 bg-violet-400/80 rounded-full animate-[soundbar_0.5s_ease-in-out_infinite_alternate_0.4s] shadow-lg shadow-violet-950/50"></div>
                  </div>
                )}
              </div>

              <div className="p-3 bg-violet-950/40 backdrop-blur-sm">
                <h4 className="font-medium truncate text-violet-100 group-hover:text-violet-200 transition-colors">
                  {song.title}
                </h4>
                <p className="text-sm text-violet-400 truncate mt-0.5 group-hover:text-violet-300 transition-colors">
                  {song.artist}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {songs.length === 0 && (
          <motion.div 
            className="text-center py-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <p className="text-violet-300">No songs in your library</p>
            <p className="text-sm text-violet-400/60 mt-2">Drop some music files to get started</p>
          </motion.div>
        )}
      </div>
    );
  }

  return (
    <div className="bg-violet-950/20 backdrop-blur-sm rounded-2xl p-6 border border-violet-900/50 
                  shadow-[0_0_20px_rgba(120,0,255,0.05)] hover:shadow-[0_0_30px_rgba(120,0,255,0.1)] transition-all duration-500">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold bg-gradient-to-r from-violet-200 to-indigo-200 bg-clip-text text-transparent
                     [text-shadow:0_2px_4px_rgba(120,0,255,0.1)]">
          Your Library
        </h3>
        <div className="flex items-center gap-2 text-violet-400">
          <IoTime className="w-5 h-5" />
          <span className="text-sm">Duration</span>
        </div>
      </div>

      <div className="space-y-2">
        {songs.map((song, index) => (
          <motion.div
            key={song.id}
            className={`group flex items-center gap-4 p-3 rounded-xl cursor-pointer backdrop-blur-sm
                       ${currentSong?.id === song.id 
                         ? 'bg-violet-500/10 hover:bg-violet-500/20' 
                         : 'hover:bg-violet-900/30'}`}
            whileHover={{ scale: 1.01, x: 4 }}
            whileTap={{ scale: 0.99 }}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => onSongSelect(song)}
          >
            <span className="w-6 text-center text-sm text-violet-400 group-hover:hidden">
              {index + 1}
            </span>
            <motion.button 
              className="w-6 h-6 text-violet-200 hidden group-hover:flex items-center justify-center"
              whileHover={{ scale: 1.1, rotate: 5 }}
              whileTap={{ scale: 0.9, rotate: -5 }}
            >
              {currentSong?.id === song.id ? (
                <IoPause className="w-5 h-5" />
              ) : (
                <IoPlay className="w-5 h-5 ml-0.5" />
              )}
            </motion.button>

            <div className="w-10 h-10 rounded-lg overflow-hidden bg-violet-900/50 flex-shrink-0 border border-violet-800/50
                          group-hover:border-violet-700/50 transition-colors">
              {song.cover ? (
                <img src={song.cover} alt={song.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-violet-900 to-indigo-900">
                  <IoMusicalNotes className="w-5 h-5 text-violet-300" />
                </div>
              )}
            </div>

            <div className="flex-1 min-w-0">
              <h4 className={`font-medium truncate transition-colors ${
                currentSong?.id === song.id ? 'text-violet-300' : 'text-violet-100 group-hover:text-violet-200'
              }`}>
                {song.title}
              </h4>
              <p className="text-sm text-violet-400 truncate group-hover:text-violet-300 transition-colors">{song.artist}</p>
            </div>

            {currentSong?.id === song.id && (
              <div className="flex space-x-1">
                <div className="w-1 h-4 bg-violet-400/80 rounded-full animate-[soundbar_0.5s_ease-in-out_infinite_alternate] shadow-lg shadow-violet-950/50"></div>
                <div className="w-1 h-4 bg-violet-400/80 rounded-full animate-[soundbar_0.5s_ease-in-out_infinite_alternate_0.2s] shadow-lg shadow-violet-950/50"></div>
                <div className="w-1 h-4 bg-violet-400/80 rounded-full animate-[soundbar_0.5s_ease-in-out_infinite_alternate_0.4s] shadow-lg shadow-violet-950/50"></div>
              </div>
            )}

            <span className="text-sm text-violet-400 w-16 text-right group-hover:text-violet-300 transition-colors">
              {formatDuration(song.duration)}
            </span>
          </motion.div>
        ))}

        {songs.length === 0 && (
          <motion.div 
            className="text-center py-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <p className="text-violet-300">No songs in your library</p>
            <p className="text-sm text-violet-400/60 mt-2">Drop some music files to get started</p>
          </motion.div>
        )}
      </div>
    </div>
  );
}; 