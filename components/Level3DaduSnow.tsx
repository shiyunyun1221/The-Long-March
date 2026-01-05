import React, { useState, useEffect, useRef } from 'react';
import { LevelProps } from '../types';
import { Footprints, Flame, AlertTriangle } from 'lucide-react';

const Level3DaduSnow: React.FC<LevelProps> = ({ resources, onUpdateResources, onComplete, onFail }) => {
  const [phase, setPhase] = useState<'bridge' | 'swamp'>('bridge');
  
  // Bridge Phase State
  const [bridgeProgress, setBridgeProgress] = useState(0);
  const [markerPosition, setMarkerPosition] = useState(0);
  const [direction, setDirection] = useState(1);
  const animationRef = useRef<number>(0);

  // Swamp Phase State
  const [swampPath, setSwampPath] = useState<number[]>([0]); // 0 = start
  const [message, setMessage] = useState("铁索寒冷，子弹横飞！当指针进入绿色区域时按下 [空格] 或 [点击] 前进！");

  // Bridge Animation Loop
  useEffect(() => {
    if (phase === 'bridge') {
      const animate = () => {
        setMarkerPosition(prev => {
          if (prev >= 100) setDirection(-1);
          if (prev <= 0) setDirection(1);
          return prev + (direction * 1.5); // Speed
        });
        animationRef.current = requestAnimationFrame(animate);
      };
      animationRef.current = requestAnimationFrame(animate);
      return () => cancelAnimationFrame(animationRef.current);
    }
  }, [phase, direction]);

  const handleBridgeAction = () => {
    // Target zone: 40-60
    if (markerPosition > 40 && markerPosition < 60) {
      const newProgress = bridgeProgress + 20;
      setBridgeProgress(newProgress);
      setMessage("好身手！向对岸移动了一大截！");
      if (newProgress >= 100) {
        setPhase('swamp');
        setMessage("成功夺取泸定桥！前方是茫茫草地，每一步都充满危机。");
        onUpdateResources({...resources, morale: Math.min(100, resources.morale + 10)});
      }
    } else {
      // Miss
      onUpdateResources({
        ...resources,
        soldiers: resources.soldiers - 5,
        morale: resources.morale - 5
      });
      setMessage("没抓稳！敌军火力压制，队伍受损！");
      if (resources.soldiers <= 5) onFail("突击队员全部牺牲在铁索桥上。");
    }
  };

  const handleSwampChoice = (choice: 'safe' | 'risk' | 'rest') => {
    let newResources = { ...resources };
    
    if (choice === 'rest') {
        newResources.supplies -= 5;
        newResources.morale += 10;
        newResources.soldiers += 2; // Heal slightly
        setMessage("点燃篝火，大家手挽手唱起歌，士气恢复了。");
        onUpdateResources(newResources);
        return;
    }

    // Progression logic
    const successChance = choice === 'safe' ? 0.9 : 0.6;
    
    if (Math.random() < successChance) {
        // Success
        setSwampPath(prev => [...prev, prev.length]);
        newResources.morale += 2;
        setMessage("试探出了坚实的地面，队伍继续前进。");
        if (swampPath.length >= 5) {
            onComplete();
        }
    } else {
        // Fail
        newResources.soldiers -= 10;
        newResources.morale -= 10;
        setMessage("有人陷入了沼泽！费了九牛二虎之力才拉出来，大家精疲力竭。");
        if (newResources.soldiers <= 0) onFail("队伍迷失在茫茫草地中。");
    }

    if (choice === 'safe') {
        newResources.supplies -= 5; // Takes longer
    } else {
        newResources.supplies -= 2; // Faster but risky
    }
    
    onUpdateResources(newResources);
  };

  // Keyboard support for Bridge
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
        if (e.code === 'Space' && phase === 'bridge') {
            handleBridgeAction();
        }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [phase, markerPosition, bridgeProgress]);

  return (
    <div className="flex flex-col items-center justify-center h-full w-full max-w-4xl mx-auto p-4">
      
      {/* Narrative */}
      <div className="bg-black/60 p-4 rounded mb-8 w-full text-center border-t-2 border-red-800">
        <h3 className="text-xl text-white font-serif mb-2">
            {phase === 'bridge' ? '第一阶段：飞夺泸定桥' : '第二阶段：过雪山草地'}
        </h3>
        <p className="text-stone-300">{message}</p>
      </div>

      {phase === 'bridge' && (
        <div className="w-full max-w-lg bg-stone-800 p-8 rounded-xl shadow-2xl relative" onClick={handleBridgeAction}>
           <div className="mb-4 text-center text-sm text-stone-400">点击屏幕或按空格键</div>
           
           {/* Progress */}
           <div className="w-full bg-stone-900 h-2 mb-8 rounded">
               <div className="bg-yellow-500 h-full transition-all" style={{width: `${bridgeProgress}%`}}></div>
           </div>

           {/* QTE Bar */}
           <div className="w-full h-12 bg-stone-700 rounded-full relative overflow-hidden border-4 border-stone-600 cursor-pointer">
              {/* Target Zone */}
              <div className="absolute top-0 bottom-0 left-[40%] width-[20%] w-1/5 bg-green-500/50 border-x border-green-400"></div>
              
              {/* Marker */}
              <div 
                className="absolute top-0 bottom-0 w-2 bg-white shadow-[0_0_10px_white]"
                style={{ left: `${markerPosition}%` }}
              ></div>
           </div>
        </div>
      )}

      {phase === 'swamp' && (
        <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-6">
            <button 
                onClick={() => handleSwampChoice('safe')}
                className="bg-stone-800 border-2 border-stone-600 hover:border-green-500 p-6 rounded flex flex-col items-center gap-4 transition-all"
            >
                <Footprints className="w-10 h-10 text-green-500" />
                <div className="text-center">
                    <h4 className="font-bold text-white">探路前行</h4>
                    <p className="text-xs text-stone-400 mt-2">消耗辎重，安全系数高</p>
                </div>
            </button>

            <button 
                 onClick={() => handleSwampChoice('risk')}
                 className="bg-stone-800 border-2 border-stone-600 hover:border-red-500 p-6 rounded flex flex-col items-center gap-4 transition-all"
            >
                <AlertTriangle className="w-10 h-10 text-red-500" />
                <div className="text-center">
                    <h4 className="font-bold text-white">强行穿越</h4>
                    <p className="text-xs text-stone-400 mt-2">节省时间，风险极高</p>
                </div>
            </button>

            <button 
                 onClick={() => handleSwampChoice('rest')}
                 className="bg-stone-800 border-2 border-stone-600 hover:border-yellow-500 p-6 rounded flex flex-col items-center gap-4 transition-all"
            >
                <Flame className="w-10 h-10 text-yellow-500" />
                <div className="text-center">
                    <h4 className="font-bold text-white">篝火休整</h4>
                    <p className="text-xs text-stone-400 mt-2">恢复士气，消耗补给</p>
                </div>
            </button>
            
            <div className="md:col-span-3 text-center mt-4">
                <p className="text-stone-500 uppercase tracking-widest text-sm">距离会师点还剩 {5 - swampPath.length} 个路程</p>
            </div>
        </div>
      )}
    </div>
  );
};

export default Level3DaduSnow;