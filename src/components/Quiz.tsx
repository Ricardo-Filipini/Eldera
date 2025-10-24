
import React, { useState } from 'react';
import { quizQuestions } from '../constants';
import { SectionWrapper } from './SectionWrapper';

export const Quiz: React.FC = () => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);

  const question = quizQuestions[currentQuestionIndex];

  const handleAnswerClick = (answer: string) => {
    setSelectedAnswer(answer);
    setShowResult(true);
    if (answer === question.correctAnswer) {
      setScore(score + 1);
    }
  };

  const handleNext = () => {
    setShowResult(false);
    setSelectedAnswer(null);
    setCurrentQuestionIndex(currentQuestionIndex + 1);
  };

  const handleRestart = () => {
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setScore(0);
  };

  if (currentQuestionIndex >= quizQuestions.length) {
    return (
      <SectionWrapper title="Quiz do Eldin" subtitle="Teste seus conhecimentos sobre a lenda.">
        <div className="text-center">
          <h4 className="text-xl font-bold">Quiz Finalizado!</h4>
          <p className="text-2xl my-4">Você acertou {score} de {quizQuestions.length} perguntas!</p>
          <button onClick={handleRestart} className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-6 rounded-lg">
            Jogar Novamente
          </button>
        </div>
      </SectionWrapper>
    );
  }

  return (
    <SectionWrapper title="Quiz do Eldin" subtitle={`Pergunta ${currentQuestionIndex + 1} de ${quizQuestions.length}`}>
        <h4 className="text-lg font-semibold mb-4">{question.question}</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {question.options.map((option) => {
                const isSelected = selectedAnswer === option;
                const isCorrect = question.correctAnswer === option;
                let buttonClass = 'bg-gray-700 hover:bg-gray-600';
                if (showResult) {
                    if(isCorrect) {
                        buttonClass = 'bg-green-600';
                    } else if(isSelected && !isCorrect) {
                        buttonClass = 'bg-red-600';
                    } else {
                         buttonClass = 'bg-gray-700 opacity-50';
                    }
                }

                return (
                    <button
                        key={option}
                        onClick={() => handleAnswerClick(option)}
                        disabled={showResult}
                        className={`p-4 rounded-lg text-left transition-all duration-200 ${buttonClass}`}
                    >
                        {option}
                    </button>
                );
            })}
        </div>
        {showResult && (
            <div className="mt-6 p-4 bg-gray-900 rounded-lg">
                <p className={`font-bold ${selectedAnswer === question.correctAnswer ? 'text-green-400' : 'text-red-400'}`}>
                    {selectedAnswer === question.correctAnswer ? 'Correto!' : 'Errado!'}
                </p>
                <p className="text-gray-300 mt-2">{question.explanation}</p>
                <button onClick={handleNext} className="w-full mt-4 bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-lg">
                    Próxima Pergunta
                </button>
            </div>
        )}
    </SectionWrapper>
  );
};