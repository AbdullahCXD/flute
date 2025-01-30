import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MusicPlayer } from '../components/MusicPlayer/MusicPlayer';
import { Playlist } from '../components/MusicPlayer/Playlist';
import { FileUpload } from '../components/MusicPlayer/FileUpload';
import { Song } from '../components/MusicPlayer/types';
import {
  IoClose,
  IoRemove,
  IoExpand,
  IoContract,
  IoMenu,
  IoSearch,
  IoSettingsSharp,
  IoGrid,
  IoList,
  IoMusicalNotes,
  IoTrendingUp,
} from 'react-icons/io5';

const App: React.FC = () => {
  const [songs, setSongs] = useState<Song[]>([]);
  const [currentSong, setCurrentSong] = useState<Song | null>(null);
  const [isMaximized, setIsMaximized] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    // Check initial window state
    if (window.electron) {
      window.electron.isMaximized().then(setIsMaximized);

      // Listen for window maximize/unmaximize events
      window.electron.ipcRenderer.on('window-maximized', () => setIsMaximized(true));
      window.electron.ipcRenderer.on('window-unmaximized', () => setIsMaximized(false));
    }

    return () => {
      if (window.electron) {
        window.electron.ipcRenderer.removeListener('window-maximized', () => setIsMaximized(true));
        window.electron.ipcRenderer.removeListener('window-unmaximized', () => setIsMaximized(false));
      }
    };
  }, []);

  const handleFilesSelected = async (files: FileList) => {
    const newSongs: Song[] = [];
    
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (file.type.startsWith('audio/')) {
        // Create object URL for the file
        const fileUrl = URL.createObjectURL(file);
        
        // Create audio element to get duration
        const audio = new Audio(fileUrl);
        await new Promise((resolve) => {
          audio.addEventListener('loadedmetadata', () => {
            resolve(audio.duration);
          });
        });

        // Extract metadata from filename
        const title = file.name.replace(/\.[^/.]+$/, '');
        const artist = 'Unknown Artist';

        newSongs.push({
          id: `local-${Date.now()}-${i}`,
          title,
          artist,
          cover: null,
          file,
          duration: audio.duration,
          localFile: true
        });
      }
    }

    setSongs(prev => [...prev, ...newSongs]);
  };

  const handleSongSelect = (song: Song) => {
    setCurrentSong(song);
  };

  const handleWindowControls = (action: 'minimize' | 'maximize' | 'close') => {
    if (window.electron) {
      window.electron.ipcRenderer.send(`window-${action}`);
    }
  };

  const filteredSongs = songs.filter(song => 
    song.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    song.artist.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="h-screen no-scrollbar flex flex-col bg-gradient-to-br from-indigo-950 via-purple-900 to-violet-950 text-white">
      {/* Custom Title Bar */}
      <div className="bg-violet-950/90 backdrop-blur-xl border-b border-violet-800/20 select-none">
        <div className="flex items-center justify-between h-10 px-4 -mr-[1px] app-drag">
          {/* Left Section */}
          <div className="flex items-center gap-3 app-no-drag">
            <button className="p-1.5 hover:bg-violet-800/20 rounded-lg transition-colors">
              <IoMenu className="w-5 h-5 text-violet-300" />
            </button>
            <div className="h-4 w-[1px] bg-violet-800/30" />
            <div className="flex items-center gap-1">
              <button 
                className={`p-1.5 rounded-lg transition-colors ${viewMode === 'grid' ? 'bg-violet-800/30 text-violet-200' : 'text-violet-400 hover:bg-violet-800/20'}`}
                onClick={() => setViewMode('grid')}
              >
                <IoGrid className="w-5 h-5" />
              </button>
              <button 
                className={`p-1.5 rounded-lg transition-colors ${viewMode === 'list' ? 'bg-violet-800/30 text-violet-200' : 'text-violet-400 hover:bg-violet-800/20'}`}
                onClick={() => setViewMode('list')}
              >
                <IoList className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Center Section */}
          <div className="flex items-center gap-4 app-no-drag">
            <div className="relative group">
              <input
                type="text"
                placeholder="Search music..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-violet-900/20 border border-violet-800/30 rounded-lg px-4 py-1.5 pl-9 text-sm 
                         text-violet-100 placeholder-violet-400/60 outline-none w-80
                         focus:border-violet-700 focus:bg-violet-900/30 transition-all
                         group-hover:border-violet-700/50"
              />
              <IoSearch className="w-4 h-4 text-violet-400/80 absolute left-3 top-1/2 -translate-y-1/2 
                                 group-hover:text-violet-300 transition-colors" />
            </div>
          </div>

          {/* Right Section */}
          <div className="flex items-center app-no-drag">
            <button className="p-1.5 hover:bg-violet-800/20 rounded-lg transition-colors">
              <IoSettingsSharp className="w-5 h-5 text-violet-300" />
            </button>
            <div className="h-4 w-[1px] bg-violet-800/30 mx-2" />
            <button
              onClick={() => handleWindowControls('minimize')}
              className="p-1.5 hover:bg-violet-800/20 rounded-lg transition-colors"
            >
              <IoRemove className="w-5 h-5 text-violet-300" />
            </button>
            <button
              onClick={() => handleWindowControls('maximize')}
              className="p-1.5 hover:bg-violet-800/20 rounded-lg transition-colors"
            >
              {isMaximized ? (
                <IoContract className="w-5 h-5 text-violet-300" />
              ) : (
                <IoExpand className="w-5 h-5 text-violet-300" />
              )}
            </button>
            <button
              onClick={() => handleWindowControls('close')}
              className="p-1.5 hover:bg-red-500/80 rounded-lg transition-colors ml-1"
            >
              <IoClose className="w-5 h-5 text-violet-300 hover:text-white" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto no-scrollbar">
        {/* Enhanced Background Effects */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(120,0,255,0.15),rgba(0,0,0,0))] pointer-events-none" />
        <div className="absolute inset-0 bg-[conic-gradient(from_180deg_at_50%_50%,rgba(120,0,255,0.1)_0deg,transparent_60deg,transparent_300deg,rgba(120,0,255,0.1)_360deg)] animate-[spin_20s_linear_infinite] opacity-50 pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(120,0,255,0.1),transparent_50%)] pointer-events-none" />
        
        <div className="container mx-auto px-4 py-8 pb-28 relative">
          <div className="flex flex-col gap-8">
            {/* Enhanced Header Section */}
            <div className="text-center relative">
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="absolute -top-20 left-1/2 -translate-x-1/2 w-40 h-40 bg-violet-500/10 rounded-full blur-3xl" 
              />
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.5 }}
                transition={{ delay: 0.2 }}
                className="absolute -top-10 left-1/2 -translate-x-1/2 w-20 h-20 bg-indigo-500/10 rounded-full blur-2xl"
              />
              <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-6xl md:text-7xl font-bold bg-gradient-to-r from-violet-300 via-purple-300 to-indigo-300 bg-clip-text text-transparent
                         [text-shadow:0_4px_8px_rgba(120,0,255,0.1)] relative"
              >
                Flute
              </motion.h1>
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-violet-300/80 mt-2 text-lg"
              >
                Your Personal Music Sanctuary
              </motion.p>
            </div>
            
            {/* Enhanced Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-8">
              <div className="space-y-8">
                <FileUpload onFilesSelected={handleFilesSelected} />
                
                {/* Enhanced Stats Section */}
                {songs.length > 0 && (
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="grid grid-cols-3 gap-4 mb-8"
                  >
                    <motion.div 
                      whileHover={{ scale: 1.02 }}
                      className="bg-violet-900/20 backdrop-blur-sm rounded-xl p-4 border border-violet-800/20
                               hover:border-violet-700/40 hover:bg-violet-900/30 transition-all duration-300
                               shadow-[0_0_20px_rgba(120,0,255,0.05)]"
                    >
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-violet-800/30 rounded-lg">
                          <IoMusicalNotes className="w-5 h-5 text-violet-300" />
                        </div>
                        <div>
                          <p className="text-violet-300/60 text-sm">Total Songs</p>
                          <p className="text-violet-100 text-lg font-medium">{songs.length}</p>
                        </div>
                      </div>
                    </motion.div>
                    <motion.div 
                      whileHover={{ scale: 1.02 }}
                      className="bg-violet-900/20 backdrop-blur-sm rounded-xl p-4 border border-violet-800/20
                               hover:border-violet-700/40 hover:bg-violet-900/30 transition-all duration-300
                               shadow-[0_0_20px_rgba(120,0,255,0.05)]"
                    >
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-violet-800/30 rounded-lg">
                          <IoTrendingUp className="w-5 h-5 text-violet-300" />
                        </div>
                        <div>
                          <p className="text-violet-300/60 text-sm">Total Duration</p>
                          <p className="text-violet-100 text-lg font-medium">
                            {Math.floor(songs.reduce((acc, song) => acc + (song.duration || 0), 0) / 60)} mins
                          </p>
                        </div>
                      </div>
                    </motion.div>
                    <motion.div 
                      whileHover={{ scale: 1.02 }}
                      className="bg-violet-900/20 backdrop-blur-sm rounded-xl p-4 border border-violet-800/20
                               hover:border-violet-700/40 hover:bg-violet-900/30 transition-all duration-300
                               shadow-[0_0_20px_rgba(120,0,255,0.05)]"
                    >
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-violet-800/30 rounded-lg">
                          <IoGrid className="w-5 h-5 text-violet-300" />
                        </div>
                        <div>
                          <p className="text-violet-300/60 text-sm">View Mode</p>
                          <p className="text-violet-100 text-lg font-medium capitalize">{viewMode}</p>
                        </div>
                      </div>
                    </motion.div>
                  </motion.div>
                )}

                <AnimatePresence mode="wait">
                  <motion.div
                    key={viewMode}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                  >
                    <Playlist
                      songs={filteredSongs}
                      currentSong={currentSong}
                      onSongSelect={handleSongSelect}
                      viewMode={viewMode}
                    />
                  </motion.div>
                </AnimatePresence>
              </div>
              
              {/* Enhanced Now Playing Section */}
              <div className="hidden lg:block">
                <motion.div 
                  className="sticky top-8"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                >
                  <div className="rounded-2xl overflow-hidden shadow-[0_0_40px_rgba(120,0,255,0.15)] border border-white/5 
                               group transition-all duration-500 hover:scale-[1.02] hover:shadow-[0_0_60px_rgba(120,0,255,0.2)]">
                    <div className="relative">
                      {currentSong?.cover ? (
                        <img 
                          src={currentSong.cover} 
                          alt={currentSong.title}
                          className="w-full aspect-square object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                      ) : (
                        <div className="w-full aspect-square bg-gradient-to-br from-violet-900 to-indigo-900 flex items-center justify-center relative overflow-hidden">
                          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(120,0,255,0.2),rgba(0,0,0,0))]" />
                          <motion.div 
                            className="text-violet-300/50 text-8xl"
                            animate={{ 
                              scale: [1, 1.1, 1],
                              rotate: [0, 5, -5, 0]
                            }}
                            transition={{ 
                              duration: 4,
                              repeat: Infinity,
                              ease: "easeInOut"
                            }}
                          >
                            ♪
                          </motion.div>
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    </div>
                  </div>
                  <div className="mt-6 text-center">
                    <motion.h3 
                      className="text-lg font-medium bg-gradient-to-r from-violet-200 to-indigo-200 bg-clip-text text-transparent"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                    >
                      Now Playing
                    </motion.h3>
                    <motion.p 
                      className="text-sm text-violet-300/60 mt-1"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                    >
                      Experience the melody
                    </motion.p>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <MusicPlayer currentSong={currentSong} />
    </div>
  );
};

export default App;
