import React, { useState, useEffect } from 'react';
import { LevelProps } from '../types';
import { Ship, Megaphone, Eye, Clock } from 'lucide-react';

const Level2JinshaRiver: React.FC<LevelProps> = ({ resources, onUpdateResources, onComplete, onFail }) => {
  const [enemyDistance, setEnemyDistance] = useState(100); // Kilometers away
  const [troopsCrossed, setTroopsCrossed] = useState(0); // Percentage
  const [boats, setBoats] = useState(3);
  const [log, setLog] = useState<string[]>(["敌军主力距离 100 公里。我们必须在他们到达前渡江。"]);

  useEffect(() => {
    if (enemyDistance <= 0) onFail("敌军主力已到达，背水一战失败。");
    else if (resources.morale <= 0) onFail("部队因疲劳过度，无法执行战术命令。");
    else if (troopsCrossed >= 100) onComplete();
  }, [enemyDistance, troopsCrossed, resources.morale, onFail, onComplete]);

  const addLog = (msg: string) => {
    setLog(prev => [msg, ...prev].slice(0, 3));
  };

  const handleAction = (action: 'ferry' | 'distract' | 'scout') => {
    let newResources = { ...resources };
    let newEnemyDist = enemyDistance;
    let newCrossed = troopsCrossed;

    switch (action) {
      case 'ferry':
        // Core Loop: Costs time (Enemy gets closer), gains progress
        // Efficiency depends on boats
        const crossedAmount = 15 + (boats * 2); 
        newCrossed = Math.min(100, newCrossed + crossedAmount);
        newEnemyDist -= 15; // Takes time
        newResources.supplies -= 2; // Consumes food
        addLog(`船队全力运送，${crossedAmount}% 部队成功抵达对岸。`);
        break;

      case 'distract':
        // Costs Morale (dangerous mission), Gains Time (Enemy slowed)
        newResources.morale -= 10;
        newResources.soldiers -= 2; // Small casualty risk
        newEnemyDist += 20; // Enemy delayed
        addLog("小分队制造佯攻，成功吸引敌军注意！争取到了宝贵时间。");
        break;

      case 'scout':
        // Find more boats or safe paths
        newResources.morale -= 5;
        newEnemyDist -= 5; // Takes a little time
        if (Math.random() > 0.4) {
            setBoats(prev => prev + 1);
            addLog("侦察兵在下游村庄找到了一条隐藏的船只！渡河效率提升。");
        } else {
            addLog("侦察兵无功而返，但确认了附近没有伏兵。");
        }
        break;
    }

    onUpdateResources(newResources);
    setTroopsCrossed(newCrossed);
    setEnemyDistance(newEnemyDist);
  };

  return (
    <div className="flex flex-col items-center justify-center h-full w-full max-w-5xl mx-auto p-4">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 w-full">
        
        {/* Status Panel */}
        <div className="bg-stone-900/90 border border-stone-600 p-6 rounded-lg shadow-xl flex flex-col justify-between">
          <div>
            <h3 className="text-xl text-yellow-500 font-serif mb-6 border-b border-stone-700 pb-2">战况情报</h3>
            
            <div className="space-y-6">
              <div>
                <div className="flex justify-between text-sm text-stone-400 mb-1">
                  <span>已渡江部队</span>
                  <span>{troopsCrossed}%</span>
                </div>
                <div className="w-full bg-stone-800 h-3 rounded-full">
                  <div className="bg-blue-500 h-full transition-all duration-500" style={{ width: `${troopsCrossed}%` }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-sm text-stone-400 mb-1">
                  <span className="flex items-center gap-2"><Clock size={14}/> 敌军主力距离</span>
                  <span className={enemyDistance < 30 ? "text-red-500 animate-pulse font-bold" : "text-green-400"}>
                    {enemyDistance} km
                  </span>
                </div>
                <div className="w-full bg-stone-800 h-3 rounded-full relative overflow-hidden">
                    {/* Enemy bar moves from right to left conceptually, but let's just fill it inverse to show danger */}
                   <div className={`h-full transition-all duration-500 ${enemyDistance < 30 ? 'bg-red-600' : 'bg-red-900'}`} style={{ width: `${Math.max(0, 100 - enemyDistance)}%` }}></div>
                </div>
              </div>

               <div className="flex items-center gap-2 text-stone-300 bg-stone-800 p-3 rounded">
                  <Ship className="text-blue-400" />
                  <span>当前可用船只: <span className="text-white font-bold">{boats}</span> 艘</span>
               </div>
            </div>
          </div>

          <div className="mt-6 bg-black/40 p-4 rounded text-sm text-stone-300 font-mono min-h-[100px]">
            {log.map((l, i) => (
                <p key={i} className={`mb-1 ${i === 0 ? 'text-white' : 'text-gray-500'}`}>{i === 0 ? '> ' : ''}{l}</p>
            ))}
          </div>
        </div>

        {/* Command Panel */}
        <div className="flex flex-col gap-4">
          <button 
            onClick={() => handleAction('ferry')}
            className="flex-1 bg-blue-900/30 border border-blue-700 hover:bg-blue-800/50 p-6 rounded-lg text-left transition-all group"
          >
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <Ship className="w-8 h-8 text-blue-400" />
                    <div>
                        <h4 className="font-bold text-lg text-blue-100">组织渡江</h4>
                        <p className="text-sm text-blue-300">利用现有船只运输部队。</p>
                    </div>
                </div>
                <span className="text-xs bg-black/50 px-2 py-1 rounded text-red-300">-15km 敌距 / -2 辎重</span>
            </div>
          </button>

          <button 
            onClick={() => handleAction('distract')}
            className="flex-1 bg-orange-900/30 border border-orange-700 hover:bg-orange-800/50 p-6 rounded-lg text-left transition-all group"
          >
             <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <Megaphone className="w-8 h-8 text-orange-400" />
                    <div>
                        <h4 className="font-bold text-lg text-orange-100">声东击西</h4>
                        <p className="text-sm text-orange-300">制造噪音佯攻，拖延敌军。</p>
                    </div>
                </div>
                <span className="text-xs bg-black/50 px-2 py-1 rounded text-green-300">+20km 敌距 / -10 士气</span>
            </div>
          </button>

          <button 
            onClick={() => handleAction('scout')}
            className="flex-1 bg-purple-900/30 border border-purple-700 hover:bg-purple-800/50 p-6 rounded-lg text-left transition-all group"
          >
             <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <Eye className="w-8 h-8 text-purple-400" />
                    <div>
                        <h4 className="font-bold text-lg text-purple-100">化装侦察</h4>
                        <p className="text-sm text-purple-300">寻找更多船只或情报。</p>
                    </div>
                </div>
                 <span className="text-xs bg-black/50 px-2 py-1 rounded text-yellow-300">概率获得船只 / -5km 敌距</span>
            </div>
          </button>
        </div>

      </div>
    </div>
  );
};

export default Level2JinshaRiver;