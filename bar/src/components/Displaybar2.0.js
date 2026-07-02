import { useEffect, useRef, useState } from 'react';

const positionStyles = {
  top: {
    top: 0,
    left: 0,
    width: '100vw',
  },
  bottom: {
    bottom: 0,
    left: 0,
    width: '100vw',
  },
  center: {
    top: '50%',
    left: '50%',
    width: 'min(720px, calc(100vw - 32px))',
    transform: 'translate(-50%, -50%)',
  },
  right: {
    top: '50%',
    right: 0,
    width: 'min(360px, calc(100vw - 32px))',
    transform: 'translateY(-50%)',
  },
  left: {
    top: '50%',
    left: 0,
    width: 'min(360px, calc(100vw - 32px))',
    transform: 'translateY(-50%)',
  },
};

const shapeStyles = {
  rectangle: {
    borderRadius: 0,
  },
  square: {
    borderRadius: 0,
  },
  rounded: {
    borderRadius: '12px',
  },
  round: {
    borderRadius: '999px',
  },
  pill: {
    borderRadius: '999px',
  },
};

const displayBarKeyframes = `
.display-bar-v2 {
  background: var(--display-bar-bg);
  color: var(--display-bar-text);
  transition: background 180ms ease, color 180ms ease;
}

.display-bar-v2:hover {
  background: var(--display-bar-text);
  color: var(--display-bar-bg);
}

@keyframes displayBarFirstScroll {
  from {
    transform: translateX(var(--first-start));
  }

  to {
    transform: translateX(-100%);
  }
}

@keyframes displayBarLoopScroll {
  from {
    transform: translateX(var(--loop-start));
  }

  to {
    transform: translateX(-100%);
  }
}
`;

function getDisplayPosition(displayPosition) {
  const position = (displayPosition || 'top').toLowerCase();
  return position === 'botton' ? 'bottom' : positionStyles[position] ? position : 'top';
}

function getDisplayDuration(displayTime) {
  if (typeof displayTime === 'number' && displayTime > 0) {
    return {
      milliseconds: displayTime * 1000,
      hasDisplayTime: true,
    };
  }

  if (typeof displayTime === 'string') {
    const time = displayTime.trim().toLowerCase();

    if (/^\d+(\.\d+)?ms$/.test(time)) {
      return {
        milliseconds: Number(time.replace('ms', '')),
        hasDisplayTime: true,
      };
    }

    if (/^\d+(\.\d+)?s$/.test(time)) {
      const seconds = Number(time.replace('s', ''));

      return {
        milliseconds: seconds * 1000,
        hasDisplayTime: true,
      };
    }

    if (/^\d+(\.\d+)?$/.test(time) && Number(time) > 0) {
      return {
        milliseconds: Number(time) * 1000,
        hasDisplayTime: true,
      };
    }
  }

  return {
    milliseconds: 0,
    hasDisplayTime: false,
  };
}

function getDisplayShape(diplayShape) {
  return shapeStyles[(diplayShape || 'rectangle').toLowerCase()] || shapeStyles.rectangle;
}

function getScrollableValue(scrollable) {
  return typeof scrollable === 'string' ? scrollable.toLowerCase() !== 'false' : Boolean(scrollable);
}

function getDisplayValue(display) {
  return typeof display === 'string' ? !['false', 'off', 'no'].includes(display.toLowerCase()) : display !== false;
}

function DisplayBar({
  text,
  msg,
  display = true,
  displayPosition = 'top',
  displayTime,
  diplayShape,
  scrollable = false,
}) {
  const barRef = useRef(null);
  const [hasStartedLoop, setHasStartedLoop] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [barWidth, setBarWidth] = useState(0);
  const displayText = msg || text || '';
  const displayDuration = getDisplayDuration(displayTime);
  const scrollDuration = `${Math.max(12, displayText.length * 0.22)}s`;
  const normalizedPosition = getDisplayPosition(displayPosition);
  const shapeStyle = getDisplayShape(diplayShape);
  const shouldDisplay = getDisplayValue(display);
  const shouldScroll = getScrollableValue(scrollable);

  useEffect(() => {
    const barElement = barRef.current;

    if (!barElement) {
      return undefined;
    }

    const updateWidth = () => {                                                                                                                             
      setBarWidth(barElement.getBoundingClientRect().width);
    };

    updateWidth();

    const observer = new ResizeObserver(updateWidth);
    observer.observe(barElement);

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    setHasStartedLoop(false);
  }, [displayText, scrollable]);

  useEffect(() => {
    setIsVisible(true);

    if (!displayDuration.hasDisplayTime) {
      return undefined;
    }

    const timerId = window.setTimeout(() => {
      setIsVisible(false);
    }, displayDuration.milliseconds);

    return () => window.clearTimeout(timerId);
  }, [displayText, displayTime, displayDuration.hasDisplayTime, displayDuration.milliseconds]);

  if (!shouldDisplay || !isVisible) {
    return null;
  }

  return (
    <>
      <style>{displayBarKeyframes}</style>
      <div
        ref={barRef}
        className="display-bar-v2"
        style={{
          '--display-bar-bg': '#ddd',
          '--display-bar-text': 'var(--ink, #141414)',
          height: 'var(--topbar-height, 48px)',
          display: 'flex',
          alignItems: 'center',
          fontSize: '18px',
          border: '1px solid #606464ba',
          lineHeight: 1,
          overflow: 'hidden',
          position: 'fixed',
          whiteSpace: 'nowrap',
          zIndex: 9999,
          justifyContent: shouldScroll ? undefined : 'center',
          ...positionStyles[normalizedPosition],
          ...shapeStyle,
        }}
      >
        <span
          key={`${scrollDuration}-${displayText}-${shouldScroll}`}
          style={{
            '--scroll-duration': scrollDuration,
            '--first-start': `${barWidth / 2}px`,
            '--loop-start': `${barWidth}px`,
            position: shouldScroll ? 'absolute' : 'static',
            minWidth: 'max-content',
            paddingInline: shouldScroll ? undefined : '12px',
            left: shouldScroll ? 0 : undefined,
            animation: shouldScroll
              ? `${hasStartedLoop ? 'displayBarLoopScroll' : 'displayBarFirstScroll'} var(--scroll-duration) linear ${hasStartedLoop ? 'infinite' : '1'}`
              : undefined,
          }}
          onAnimationEnd={shouldScroll ? () => setHasStartedLoop(true) : undefined}
        >
          {displayText}
        </span>
      </div>
    </>
  );
}

export default DisplayBar;
