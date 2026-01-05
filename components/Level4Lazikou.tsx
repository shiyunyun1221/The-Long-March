import React, { useEffect, useRef, useState } from 'react';
import { LevelProps, GameResources } from '../types';
import { ShieldAlert, Timer } from 'lucide-react';

const Level4Lazikou: React.FC<LevelProps> = ({ resources, onUpdateResources, onComplete, onFail }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [timeLeft, setTimeLeft] = useState(30); // Survive for 30 seconds
  const [gameStarted, setGameStarted] = useState(false);
  
  // Game State Refs (for loop performance)
  const gameState = useRef({
    playerX: 50, // Percent 0-100
    bullets: [] as { x: number; y: number; speed: number; type: 'bullet' | 'grenade' }[],
    lastSpawn: 0,
    isGameOver: false,
    width: 0,
    height: 0,
    hitCooldown: 0
  });

  // Timer Logic
  useEffect(() => {
    if (!gameStarted || gameState.current.isGameOver) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          onComplete();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [gameStarted, onComplete]);

  // Main Game Loop
  useEffect(() => {
    if (!gameStarted) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Resize handler
    const resize = () => {
        const parent = canvas.parentElement;
        if (parent) {
            canvas.width = parent.clientWidth;
            canvas.height = parent.clientHeight;
            gameState.current.width = canvas.width;
            gameState.current.height = canvas.height;
        }
    };
    resize();
    window.addEventListener('resize', resize);

    let animationFrameId: number;

    const render = (timestamp: number) => {
        if (gameState.current.isGameOver) return;

        const { width, height } = gameState.current;
        
        // Clear screen
        ctx.clearRect(0, 0, width, height);

        // Spawn Bullets
        if (timestamp - gameState.current.lastSpawn > 400) { // Spawn rate
            gameState.current.bullets.push({
                x: Math.random() * width,
                y: -20,
                speed: 3 + Math.random() * 4, // Random speed
                type: Math.random() > 0.8 ? 'grenade' : 'bullet'
            });
            gameState.current.lastSpawn = timestamp;
        }

        // Update & Draw Bullets
        gameState.current.bullets.forEach((b, index) => {
            b.y += b.speed;
            
            ctx.beginPath();
            if (b.type === 'bullet') {
                ctx.fillStyle = '#fca5a5'; // Light red
                ctx.arc(b.x, b.y, 4, 0, Math.PI * 2);
            } else {
                ctx.fillStyle = '#4b5563'; // Gray grenade
                ctx.arc(b.x, b.y, 8, 0, Math.PI * 2);
            }
            ctx.fill();

            // Collision Detection
            // Player is a box at bottom center
            const playerW = 40;
            const playerH = 40;
            const playerXPx = (gameState.current.playerX / 100) * width - playerW / 2;
            const playerYPx = height - 80;

            const dist = Math.hypot(b.x - (playerXPx + playerW/2), b.y - (playerYPx + playerH/2));
            const hitboxRadius = b.type === 'grenade' ? 20 : 15;

            if (dist < hitboxRadius && gameState.current.hitCooldown <= 0) {
                // Hit!
                gameState.current.hitCooldown = 60; // Frames of invincibility
                
                // Update React state safely via callback ref pattern if complex, but here we just trigger props
                // Since we are in a requestAnimationFrame, we need to be careful calling React state setters too often.
                // We will handle "Game Over" inside the loop to stop it, then call the prop.
                
                const damage = b.type === 'grenade' ? 20 : 10;
                
                // Accessing current resources is tricky in closure. 
                // We will just dispatch a fail event if "virtual health" drops, 
                // or rely on the parent updating resources.
                // For simplicity in this loop: we call a ref-stored callback or just trigger a prop that handles logic.
                // But `onUpdateResources` causes re-render.
                // Solution: We won't update global resources continuously. We track local health or just call "Fail" immediately if too many hits.
                
                // Let's assume 1 hit = significant morale/soldier loss.
                onUpdateResources((prev: GameResources) => {
                    const next = {
                        ...prev,
                        soldiers: prev.soldiers - damage,
                        morale: prev.morale - 5
                    };
                    if (next.soldiers <= 0) {
                        gameState.current.isGameOver = true;
                        onFail("突击队员全部牺牲在腊子口隘口。");
                    }
                    return next;
                });
            }
        });

        // Cooldown tick
        if (gameState.current.hitCooldown > 0) gameState.current.hitCooldown--;

        // Draw Player
        const playerW = 40;
        const playerH = 40;
        const playerXPx = (gameState.current.playerX / 100) * width - playerW / 2;
        const playerYPx = height - 80;

        ctx.save();
        if (gameState.current.hitCooldown > 0 && Math.floor(timestamp / 100) % 2 === 0) {
            ctx.globalAlpha = 0.5; // Flash effect
        }
        
        // Draw Star (Red Army)
        ctx.translate(playerXPx + playerW/2, playerYPx + playerH/2);
        ctx.fillStyle = '#ef4444';
        ctx.beginPath();
        for (let i = 0; i < 5; i++) {
            ctx.lineTo(Math.cos((18 + i * 72) * 0.0174533) * 20, 
                      -Math.sin((18 + i * 72) * 0.0174533) * 20);
            ctx.lineTo(Math.cos((54 + i * 72) * 0.0174533) * 8, 
                      -Math.sin((54 + i * 72) * 0.0174533) * 8);
        }
        ctx.closePath();
        ctx.fill();
        ctx.restore();

        // Cleanup bullets off screen
        gameState.current.bullets = gameState.current.bullets.filter(b => b.y < height + 50);

        animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
        cancelAnimationFrame(animationFrameId);
        window.removeEventListener('resize', resize);
    };
  }, [gameStarted]); // Dependencies minimal to avoid restarting loop

  // Input Handling
  const handleTouchMove = (e: React.TouchEvent) => {
      if (!canvasRef.current) return;
      const rect = canvasRef.current.getBoundingClientRect();
      const touchX = e.touches[0].clientX - rect.left;
      const percent = (touchX / rect.width) * 100;
      gameState.current.playerX = Math.max(5, Math.min(95, percent));
  };

  const handleMouseMove = (e: React.MouseEvent) => {
      if (!canvasRef.current) return;
      const rect = canvasRef.current.getBoundingClientRect();
      const touchX = e.clientX - rect.left;
      const percent = (touchX / rect.width) * 100;
      gameState.current.playerX = Math.max(5, Math.min(95, percent));
  };

  return (
    <div className="flex flex-col items-center justify-center h-full w-full relative overflow-hidden">
      
      {!gameStarted ? (
        <div className="absolute inset-0 z-30 flex items-center justify-center bg-black/80 p-6 text-center">
            <div className="animate-fade-in">
                <ShieldAlert className="w-16 h-16 text-red-500 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-white mb-2">准备冲锋</h3>
                <p className="text-stone-300 mb-6">
                    敌军火力封锁了隘口！<br/>
                    左右滑动屏幕躲避子弹和手榴弹。<br/>
                    <span className="text-yellow-500 font-bold">坚持 30 秒即可突围！</span>
                </p>
                <button 
                    onClick={() => setGameStarted(true)}
                    className="bg-red-700 hover:bg-red-600 text-white px-8 py-4 rounded-full font-bold text-xl shadow-[0_0_20px_rgba(220,38,38,0.6)] animate-pulse"
                >
                    开始突围
                </button>
            </div>
        </div>
      ) : (
         <div className="absolute top-20 left-0 w-full flex justify-center pointer-events-none z-20">
             <div className="bg-black/60 px-4 py-2 rounded-full border border-yellow-600 flex items-center gap-2">
                 <Timer className="text-yellow-500 w-5 h-5" />
                 <span className="text-2xl font-mono text-white font-bold">{timeLeft}s</span>
             </div>
         </div>
      )}

      {/* Game Canvas */}
      <canvas
        ref={canvasRef}
        className="w-full h-full touch-none cursor-crosshair"
        onTouchMove={handleTouchMove}
        onMouseMove={handleMouseMove}
      />
      
      {/* Visual Overlay for Atmosphere */}
      <div className="absolute inset-0 pointer-events-none opacity-20 bg-[radial-gradient(circle_at_center,_transparent_0%,_#000_100%)]"></div>
    </div>
  );
};

export default Level4Lazikou;