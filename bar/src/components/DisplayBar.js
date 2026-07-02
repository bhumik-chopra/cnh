import { useEffect, useRef, useState } from 'react';

function DisplayBar({ text }) {
  const barRef = useRef(null);
  const [hasStartedLoop, setHasStartedLoop] = useState(false);
  const [barWidth, setBarWidth] = useState(0);
  const displayText = text || '';
  const duration = Math.max(12, displayText.length * 0.22);

  useEffect(() => {
    if (!barRef.current) {
      return undefined;
    }

    const updateWidth = () => {                                                                                                                             
      setBarWidth(barRef.current.getBoundingClientRect().width);
    };

    updateWidth();

    const observer = new ResizeObserver(updateWidth);
    observer.observe(barRef.current);

    return () => observer.disconnect();
  }, []);

  return (
    <div className="display-bar" ref={barRef}>
      <span
        className={`display-bar-text ${hasStartedLoop ? 'display-bar-text-loop' : 'display-bar-text-first'}`}
        style={{
          '--scroll-duration': `${duration}s`,
          '--first-start': `${barWidth / 2}px`,
          '--loop-start': `${barWidth}px`,
        }}
        onAnimationEnd={() => setHasStartedLoop(true)}
      >
        {displayText}
      </span>
    </div>
  );
}

export default DisplayBar;
