import React, { useState, useEffect } from 'react';
import { LevelProps } from '../types';
import { Shield, FastForward, Trees, CloudRain } from 'lucide-react';

const Level1XiangRiver: React.FC<LevelProps> = ({ resources, onUpdateResources, onComplete, onFail }) => {
  const [progress, setProgress] = useState(0);
  const [message, setMessage] = useState<string>("敌军正在逼近！必须尽快突破湘江封锁线。");
  const [isEventActive, setIsEventActive] = useState(false);

  useEffect(() => {
    if (resources.soldiers <= 0) onFail("兵力耗尽，部队溃散。");
    else if (resources.supplies <= 0) onFail("弹尽粮绝，无法继续行军。");
    else if (resources.morale <= 0) onFail("士气低落，军心涣散。");
    else if (progress >= 100) onComplete();
  }, [resources, progress, onFail, onComplete]);

  const handleChoice = (type: 'fight' | 'retreat' | 'hide') => {
    let newResources = { ...resources };
    let msg = "";
    let progressGain = 0;

    // Random Event Chance
    const randomEvent = Math.random();
    let eventHappened = false;

    if (randomEvent > 0.7) {
      eventHappened = true;
      if (Math.random() > 0.5) {
        // Rain
        newResources.supplies -= 5;
        newResources.morale -= 5;
        msg = "突发暴雨！道路泥泞，物资受损。";
      } else {
        // Ambush
        newResources.soldiers -= 8;
        msg = "遭遇敌军伏击！伤亡增加。";
      }
    }

    if (!eventHappened) {
      switch (type) {
        case 'fight':
          // High Soldier Cost, High Progress, Saves Supplies (captured)
          newResources.soldiers -= 15;
          newResources.morale += 5;
          progressGain = 20;
          msg = "血战突围！虽然伤亡惨重，但我们冲破了一道防线！";
          break;
        case 'retreat':
          // High Supply Cost (dumping weight), Med Progress, Saves Soldiers
          newResources.supplies -= 15;
          newResources.soldiers -= 5;
          progressGain = 15;
          msg = "急行军！为了摆脱追兵，我们不得不丢弃部分辎重。";
          break;
        case 'hide':
          // Low Cost, Low Progress, Risk of Morale Drop
          newResources.supplies -= 2;
          newResources.morale -= 5; // Delay hurts morale
          progressGain = 5;
          msg = "在树林中隐蔽待机。敌机飞过，我们暂时安全，但时间紧迫。";
          break;
      }
    } else {
        setIsEventActive(true);
        setTimeout(() => setIsEventActive(false), 2000);
    }

    onUpdateResources(newResources);
    setProgress(prev => Math.min(prev + progressGain, 100));
    setMessage(eventHappened ? `(事件) ${msg}` : msg);
  };

  return (
    <div className="flex flex-col items-center justify-center h-full w-full max-w-4xl mx-auto p-6">
      <div className="bg-stone-900/90 border border-stone-600 p-8 rounded-lg shadow-2xl w-full">
        
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between text-stone-300 mb-2 text-sm uppercase tracking-wider">
            <span>渡江进度</span>
            <span>{progress}%</span>
          </div>
          <div className="w-full bg-stone-700 h-4 rounded-full overflow-hidden">
            <div 
              className="bg-red-600 h-full transition-all duration-500 ease-out" 
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>

        {/* Narrative Box */}
        <div className="min-h-[100px] mb-8 flex items-center justify-center text-center">
            {isEventActive ? (
                 <div className="flex items-center gap-4 text-yellow-400 animate-bounce">
                     <CloudRain size={32} />
                     <p className="text-xl font-bold">{message}</p>
                 </div>
            ) : (
                <p className="text-lg text-stone-200 font-serif leading-relaxed animate-fade-in">
                {message}
                </p>
            )}
        </div>

        {/* Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <button 
            onClick={() => handleChoice('fight')}
            className="group relative p-6 bg-red-900/40 border border-red-700 hover:bg-red-800/60 transition-all rounded-lg text-left"
          >
            <div className="flex items-center gap-3 mb-2 text-red-400 font-bold group-hover:text-white">
              <Shield className="w-6 h-6" />
              <span>强行突围</span>
            </div>
            <p className="text-xs text-stone-400">消耗大量兵力，大幅推进。</p>
          </button>

          <button 
             onClick={() => handleChoice('retreat')}
             className="group relative p-6 bg-orange-900/40 border border-orange-700 hover:bg-orange-800/60 transition-all rounded-lg text-left"
          >
            <div className="flex items-center gap-3 mb-2 text-orange-400 font-bold group-hover:text-white">
              <FastForward className="w-6 h-6" />
              <span>急行军掩护</span>
            </div>
            <p className="text-xs text-stone-400">消耗大量辎重，中幅推进。</p>
          </button>

          <button 
            onClick={() => handleChoice('hide')}
            className="group relative p-6 bg-green-900/40 border border-green-700 hover:bg-green-800/60 transition-all rounded-lg text-left"
          >
            <div className="flex items-center gap-3 mb-2 text-green-400 font-bold group-hover:text-white">
              <Trees className="w-6 h-6" />
              <span>地形隐蔽</span>
            </div>
            <p className="text-xs text-stone-400">消耗少量资源，小幅推进，降低士气。</p>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Level1XiangRiver;