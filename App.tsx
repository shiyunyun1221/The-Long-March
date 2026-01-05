import React, { useState } from 'react';
import { GameStatus, GameResources } from './types';
import { LEVELS, INITIAL_RESOURCES } from './constants';
import GameHUD from './components/GameHUD';
import Level1XiangRiver from './components/Level1XiangRiver';
import Level2JinshaRiver from './components/Level2JinshaRiver';
import Level3DaduSnow from './components/Level3DaduSnow';
import Level4Lazikou from './components/Level4Lazikou';
import HistoricalQuiz from './components/HistoricalQuiz';
import { Play, RotateCcw, Award, BookOpen } from 'lucide-react';

const App: React.FC = () => {
  const [status, setStatus] = useState<GameStatus>(GameStatus.START_SCREEN);
  const [levelIndex, setLevelIndex] = useState(0);
  const [resources, setResources] = useState<GameResources>(INITIAL_RESOURCES);
  const [failReason, setFailReason] = useState("");

  const currentLevel = LEVELS[levelIndex];

  const startGame = () => {
    setStatus(GameStatus.LEVEL_INTRO);
    setResources(INITIAL_RESOURCES);
    setLevelIndex(0);
  };

  const startLevel = () => {
    setStatus(GameStatus.PLAYING);
  };

  const nextLevel = () => {
    if (levelIndex < LEVELS.length - 1) {
      setLevelIndex(prev => prev + 1);
      setStatus(GameStatus.LEVEL_VICTORY);
    } else {
      setStatus(GameStatus.VICTORY);
    }
  };

  const startQuiz = () => {
      setStatus(GameStatus.QUIZ);
  };

  const handleGameOver = (reason: string) => {
    setFailReason(reason);
    setStatus(GameStatus.GAME_OVER);
  };

  // 9:16 Aspect Ratio Container logic (Vertical Phone style)
  // On desktop: Fixed width based on height to maintain 9:16
  // On mobile: Full screen
  const containerClass = "historical-filter relative w-full h-full md:aspect-[9/16] md:h-[90vh] md:w-auto bg-[#1c1917] overflow-hidden md:rounded-[2rem] shadow-2xl md:border-8 md:border-[#292524] flex flex-col";

  const renderStartScreen = () => (
    <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center">
      {/* Background with heavy filters */}
      <div 
        className="absolute inset-0 bg-cover bg-center transition-transform duration-[30s] hover:scale-110" 
        style={{ 
            backgroundImage: `url(https://loremflickr.com/540/960/landscape,china,ink)`,
            filter: 'sepia(80%) grayscale(50%) contrast(120%) brightness(60%)'
        }}
      ></div>
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-black/20"></div>
      
      {/* Border Decoration */}
      <div className="absolute inset-4 border border-[#e5e5e5]/20 pointer-events-none"></div>
      <div className="absolute inset-5 border border-[#e5e5e5]/10 pointer-events-none"></div>

      <div className="relative z-10 animate-fade-in flex flex-col items-center h-full justify-between py-12 w-full">
        <div className="mt-16 flex flex-col items-center">
            <div className="bg-red-900/80 text-white px-3 py-1 text-xs tracking-[0.3em] uppercase mb-4 border border-red-500/50">Historical Game</div>
            <h1 className="text-6xl font-calligraphy text-red-600 mb-2 drop-shadow-[0_4px_4px_rgba(0,0,0,1)] text-stroke">万里长征</h1>
            <div className="h-0.5 w-32 bg-gradient-to-r from-transparent via-red-600 to-transparent my-4"></div>
            <p className="text-stone-300 font-serif italic text-sm">Survival • Strategy • History</p>
        </div>

        <div className="w-full space-y-6 mb-12">
            <button 
            onClick={startGame}
            className="group w-full relative bg-red-900/90 hover:bg-red-800 text-white py-5 px-6 clip-path-polygon shadow-lg transition-all active:scale-95 flex items-center justify-center gap-3 border border-red-600/50"
            style={{ clipPath: 'polygon(5% 0, 100% 0, 95% 100%, 0% 100%)' }}
            >
                <div className="absolute left-0 top-0 h-full w-1 bg-red-500"></div>
                <Play fill="currentColor" className="w-5 h-5 text-yellow-500" /> 
                <span className="text-xl font-bold tracking-[0.2em] font-serif">开始征程</span>
            </button>
            
            <p className="text-stone-400 text-xs font-serif leading-loose opacity-70">
                1934 - 1936 <br/>
                一场改变中国命运的战略大转移
            </p>
        </div>
      </div>
    </div>
  );

  const renderLevelIntro = () => (
    <div className="absolute inset-0 flex flex-col bg-stone-950">
      <div 
        className="absolute inset-0 bg-cover bg-center" 
        style={{ 
            backgroundImage: `url(${currentLevel.backgroundUrl})`,
            filter: 'sepia(60%) grayscale(60%) contrast(110%) brightness(40%)'
        }}
      ></div>
      
      <div className="relative z-10 flex flex-col h-full p-6 animate-fade-in overflow-y-auto">
        <div className="mt-8 border-l-4 border-red-700 pl-4 mb-8">
            <div className="text-red-500 text-xs font-bold uppercase tracking-widest mb-1">Chapter {levelIndex + 1}</div>
            <h2 className="text-4xl font-calligraphy text-white">{currentLevel.title}</h2>
        </div>

        <div className="flex-1 space-y-6">
            <div className="bg-black/60 p-6 backdrop-blur-sm border border-stone-700/50">
                <p className="text-xl text-stone-200 font-serif italic text-center leading-relaxed font-bold text-shadow-sm">
                    "{currentLevel.poemLine}"
                </p>
            </div>

            <div className="space-y-4">
                <div className="flex gap-4 items-start">
                    <div className="w-1 h-full min-h-[40px] bg-stone-700 mt-1"></div>
                    <div>
                        <strong className="block text-stone-400 text-xs uppercase tracking-wider mb-1">History Background</strong>
                        <p className="text-stone-300 text-sm leading-relaxed">{currentLevel.description}</p>
                    </div>
                </div>
                
                <div className="flex gap-4 items-start pt-4 border-t border-stone-800">
                    <div className="w-1 h-full min-h-[40px] bg-yellow-700 mt-1"></div>
                    <div>
                        <strong className="block text-yellow-600 text-xs uppercase tracking-wider mb-1">Mission Objective</strong>
                        <p className="text-yellow-100/80 text-sm leading-relaxed">{currentLevel.objective}</p>
                    </div>
                </div>
            </div>
        </div>

        <button 
          onClick={startLevel}
          className="mt-8 w-full bg-stone-800 hover:bg-stone-700 text-white py-5 uppercase tracking-[0.2em] font-bold transition-all border-y border-stone-600"
        >
          整装出发
        </button>
      </div>
    </div>
  );

  const renderPlaying = () => {
    const commonProps = {
      resources,
      onUpdateResources: setResources,
      onComplete: nextLevel,
      onFail: handleGameOver
    };

    return (
      <div className="absolute inset-0 flex flex-col bg-stone-900">
        <div 
            className="absolute inset-0 bg-cover bg-center transition-all duration-1000" 
            style={{ 
                backgroundImage: `url(${currentLevel.backgroundUrl})`,
                filter: 'sepia(40%) grayscale(40%) contrast(90%) brightness(25%)'
            }}
        ></div>
        
        {/* Game HUD */}
        <GameHUD resources={resources} levelTitle={currentLevel.title} />
        
        {/* Content Area */}
        <div className="relative z-10 flex-1 overflow-y-auto pt-24 pb-6 px-4">
            {levelIndex === 0 && <Level1XiangRiver {...commonProps} />}
            {levelIndex === 1 && <Level2JinshaRiver {...commonProps} />}
            {levelIndex === 2 && <Level3DaduSnow {...commonProps} />}
            {levelIndex === 3 && <Level4Lazikou {...commonProps} />}
        </div>
      </div>
    );
  };

  const renderLevelVictory = () => (
    <div className="absolute inset-0 flex flex-col items-center justify-center bg-stone-900/95 text-center p-6">
         <div className="w-full max-w-sm animate-slide-up">
             <div className="mb-6 flex justify-center">
                 <div className="relative">
                    <div className="absolute inset-0 bg-green-500 blur-xl opacity-20"></div>
                    <Award className="w-16 h-16 text-green-500 relative z-10" />
                 </div>
             </div>
             
             <h2 className="text-3xl font-bold text-white mb-2 font-serif">突破重围</h2>
             <p className="text-green-500 text-xs uppercase tracking-widest mb-8">Mission Accomplished</p>
             
             <div className="bg-stone-800/50 p-6 border-l-2 border-green-600 mb-8 text-left">
                <p className="text-stone-300 text-sm leading-relaxed">
                    部队成功完成了本阶段的战略转移。休整片刻，准备迎接下一阶段的挑战。
                </p>
             </div>

             <button 
                onClick={() => setStatus(GameStatus.LEVEL_INTRO)}
                className="w-full bg-green-900 hover:bg-green-800 text-white py-4 rounded font-bold tracking-wider shadow-lg flex items-center justify-center gap-2"
             >
                继续进军 <Play size={16} />
             </button>
         </div>
    </div>
  );

  const renderVictory = () => (
    <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6">
         <div 
            className="absolute inset-0 bg-cover bg-center"
            style={{ 
                backgroundImage: `url(https://loremflickr.com/540/960/china,flag,vintage)`,
                filter: 'sepia(60%) contrast(120%) brightness(40%)' 
            }}
         ></div>
         
         <div className="relative z-10 w-full max-w-sm animate-fade-in flex flex-col h-full py-12">
             <div className="mt-8 mb-auto">
                <Award className="w-20 h-20 text-yellow-500 mx-auto mb-6 drop-shadow-[0_0_15px_rgba(234,179,8,0.6)]" />
                <h1 className="text-5xl font-calligraphy text-white mb-4">长征胜利</h1>
                <div className="w-16 h-1 bg-red-600 mx-auto mb-8"></div>
                <p className="text-lg text-stone-200 font-serif italic mb-2">
                    "更喜岷山千里雪，<br/>三军过后尽开颜。"
                </p>
             </div>
             
             <div className="space-y-4 mb-8">
                 <button 
                    onClick={startQuiz}
                    className="w-full bg-yellow-700/90 hover:bg-yellow-600 text-white py-4 rounded border border-yellow-500/30 flex items-center justify-center gap-3 shadow-lg"
                 >
                    <BookOpen size={20} /> 长征历史答题
                 </button>

                 <button 
                    onClick={() => setStatus(GameStatus.START_SCREEN)}
                    className="w-full bg-stone-800/90 hover:bg-stone-700 text-stone-300 py-4 rounded border border-stone-600 flex items-center justify-center gap-3"
                 >
                    <RotateCcw size={18} /> 返回主标题
                 </button>
             </div>
         </div>
    </div>
  );

  const renderGameOver = () => (
    <div className="absolute inset-0 flex flex-col items-center justify-center bg-black p-6">
         <div 
            className="absolute inset-0 bg-cover bg-center opacity-20 grayscale"
            style={{ backgroundImage: `url(https://loremflickr.com/540/960/ruins,war)`}}
         ></div>
         
         <div className="relative z-10 w-full max-w-sm p-8 bg-stone-900/90 border-y-4 border-stone-800 animate-fade-in text-center">
             <h2 className="text-3xl font-bold text-stone-500 mb-2 font-serif">征途受阻</h2>
             <div className="h-px w-full bg-stone-800 my-6"></div>
             <p className="text-red-500 text-lg mb-6 leading-relaxed font-bold">{failReason}</p>
             <p className="text-stone-500 text-xs mb-8 italic">"革命尚未成功，同志仍需努力。"</p>
             
             <button 
                onClick={startGame}
                className="w-full bg-stone-800 hover:bg-stone-700 text-stone-200 py-3 rounded flex items-center justify-center gap-2 transition-colors border border-stone-600"
             >
                <RotateCcw size={16} /> 重新开始
             </button>
         </div>
    </div>
  );

  return (
    <div className={containerClass}>
      {status === GameStatus.START_SCREEN && renderStartScreen()}
      {status === GameStatus.LEVEL_INTRO && renderLevelIntro()}
      {status === GameStatus.PLAYING && renderPlaying()}
      {status === GameStatus.LEVEL_VICTORY && renderLevelVictory()}
      {status === GameStatus.VICTORY && renderVictory()}
      {status === GameStatus.GAME_OVER && renderGameOver()}
      {status === GameStatus.QUIZ && <HistoricalQuiz onBackToTitle={() => setStatus(GameStatus.START_SCREEN)} />}
    </div>
  );
};

export default App;