import React, { useState } from 'react';
import { QuizQuestion } from '../types';
import { QUIZ_QUESTIONS } from '../constants';
import { CheckCircle, XCircle, BookOpen, RotateCcw } from 'lucide-react';

interface HistoricalQuizProps {
  onBackToTitle: () => void;
}

const HistoricalQuiz: React.FC<HistoricalQuizProps> = ({ onBackToTitle }) => {
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [showExplanation, setShowExplanation] = useState(false);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isFinished, setIsFinished] = useState(false);

  const currentQuestion = QUIZ_QUESTIONS[currentQIndex];

  const handleOptionClick = (index: number) => {
    if (selectedOption !== null) return; // Prevent changing answer
    setSelectedOption(index);
    setShowExplanation(true);
    
    if (index === currentQuestion.correctAnswer) {
      setScore(prev => prev + 1);
    }
  };

  const handleNext = () => {
    if (currentQIndex < QUIZ_QUESTIONS.length - 1) {
      setCurrentQIndex(prev => prev + 1);
      setSelectedOption(null);
      setShowExplanation(false);
    } else {
      setIsFinished(true);
    }
  };

  if (isFinished) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-8 text-center bg-stone-900/90 animate-fade-in">
        <BookOpen className="w-16 h-16 text-yellow-500 mb-6" />
        <h2 className="text-3xl font-bold text-white mb-4 font-serif">答题结束</h2>
        <div className="text-6xl font-bold text-red-500 mb-2 font-calligraphy">
            {score * 20}分
        </div>
        <p className="text-stone-400 mb-8">
            共 {QUIZ_QUESTIONS.length} 题，答对 {score} 题
        </p>
        <p className="text-stone-300 mb-8 italic text-sm border-t border-b border-stone-700 py-4 max-w-xs">
           "历史是最好的教科书，也是最好的清醒剂。"
        </p>
        <button 
          onClick={onBackToTitle}
          className="bg-stone-700 hover:bg-stone-600 text-white px-8 py-3 rounded flex items-center gap-2"
        >
          <RotateCcw size={18} /> 返回主菜单
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-stone-900/95 relative z-20">
      {/* Header */}
      <div className="p-4 border-b border-stone-700 flex justify-between items-center bg-stone-950">
        <div className="text-stone-400 text-sm">历史知识问答</div>
        <div className="text-yellow-500 font-bold font-mono">
            {currentQIndex + 1} / {QUIZ_QUESTIONS.length}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6 flex flex-col">
        <h3 className="text-xl font-serif font-bold text-white mb-8 leading-relaxed">
          {currentQuestion.question}
        </h3>

        <div className="space-y-4 mb-8">
          {currentQuestion.options.map((option, index) => {
            let buttonClass = "w-full p-4 rounded text-left border transition-all relative ";
            
            if (selectedOption === null) {
                buttonClass += "border-stone-600 bg-stone-800 text-stone-300 hover:bg-stone-700";
            } else {
                if (index === currentQuestion.correctAnswer) {
                    buttonClass += "border-green-600 bg-green-900/30 text-green-400";
                } else if (index === selectedOption) {
                    buttonClass += "border-red-600 bg-red-900/30 text-red-400";
                } else {
                    buttonClass += "border-stone-700 bg-stone-900 text-stone-600 opacity-50";
                }
            }

            return (
              <button
                key={index}
                onClick={() => handleOptionClick(index)}
                disabled={selectedOption !== null}
                className={buttonClass}
              >
                <div className="flex justify-between items-center">
                    <span>{['A', 'B', 'C', 'D'][index]}. {option}</span>
                    {selectedOption !== null && index === currentQuestion.correctAnswer && <CheckCircle className="w-5 h-5 text-green-500"/>}
                    {selectedOption !== null && index === selectedOption && index !== currentQuestion.correctAnswer && <XCircle className="w-5 h-5 text-red-500"/>}
                </div>
              </button>
            );
          })}
        </div>

        {/* Explanation & Next Button */}
        {showExplanation && (
          <div className="mt-auto animate-slide-up">
            <div className="bg-stone-800 p-4 rounded border-l-4 border-yellow-600 mb-6">
                <span className="text-yellow-500 font-bold text-xs block mb-1">历史解析</span>
                <p className="text-stone-300 text-sm leading-relaxed">{currentQuestion.explanation}</p>
            </div>
            
            <button 
                onClick={handleNext}
                className="w-full bg-red-700 hover:bg-red-600 text-white py-3 rounded font-bold tracking-wider shadow-lg"
            >
                {currentQIndex < QUIZ_QUESTIONS.length - 1 ? '下一题' : '查看成绩'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default HistoricalQuiz;