import React from 'react';
import { Users, Package, Flame } from 'lucide-react';
import { GameResources } from '../types';

interface GameHUDProps {
  resources: GameResources;
  levelTitle: string;
}

const GameHUD: React.FC<GameHUDProps> = ({ resources, levelTitle }) => {
  const getColor = (value: number) => {
    if (value > 60) return 'text-green-400';
    if (value > 30) return 'text-yellow-400';
    return 'text-red-500 animate-pulse';
  };

  return (
    <div className="absolute top-0 left-0 w-full bg-gradient-to-b from-black/90 to-transparent text-white p-4 z-40 pt-4 pb-8">
      <div className="flex flex-col gap-2">
        <h2 className="text-lg font-bold text-red-500 font-serif tracking-widest text-center shadow-black drop-shadow-md">{levelTitle}</h2>
        
        <div className="flex justify-between px-2 bg-black/40 rounded-lg py-2 border border-white/10 backdrop-blur-sm">
          <div className="flex flex-col items-center" title="Soldiers / Health">
            <Users className="w-4 h-4 text-gray-400 mb-1" />
            <span className={`font-mono text-sm font-bold ${getColor(resources.soldiers)}`}>
              {resources.soldiers}%
            </span>
          </div>

          <div className="flex flex-col items-center" title="Supplies / Food">
            <Package className="w-4 h-4 text-gray-400 mb-1" />
            <span className={`font-mono text-sm font-bold ${getColor(resources.supplies)}`}>
              {resources.supplies}%
            </span>
          </div>

          <div className="flex flex-col items-center" title="Morale / Willpower">
            <Flame className="w-4 h-4 text-gray-400 mb-1" />
            <span className={`font-mono text-sm font-bold ${getColor(resources.morale)}`}>
              {resources.morale}%
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameHUD;