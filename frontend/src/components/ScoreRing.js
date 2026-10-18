import React, { useEffect, useState } from 'react';
import { getScoreGrade } from '../utils/formatters';

export default function ScoreRing({ score, size = 80, strokeWidth = 7 }) {
  const [animScore, setAnimScore] = useState(0);
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = (animScore / 100) * circumference;
  const grade = getScoreGrade(score);

  useEffect(() => {
    const timer = setTimeout(() => {
      let start = 0;
      const step = () => {
        start += 2;
        if (start >= score) { setAnimScore(score); return; }
        setAnimScore(start);
        requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    }, 300);
    return () => clearTimeout(timer);
  }, [score]);

  return (
    <div className="score-ring" style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        {/* Track */}
        <circle
          cx={size / 2} cy={size / 2} r={radius}
          fill="none" stroke="rgba(59,130,246,0.08)" strokeWidth={strokeWidth}
        />
        {/* Progress */}
        <circle
          cx={size / 2} cy={size / 2} r={radius}
          fill="none" stroke={grade.color} strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={circumference - progress}
          style={{ transition: 'stroke-dashoffset 0.05s linear', filter: `drop-shadow(0 0 6px ${grade.color})` }}
        />
      </svg>
      <div className="score-text" style={{ color: grade.color, fontSize: size * 0.22 }}>
        {animScore}
      </div>
    </div>
  );
}