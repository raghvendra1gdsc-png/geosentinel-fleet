import { useEffect, useState, useCallback, useRef } from 'react';
import { getAgentColor } from '../utils/agentColors';

interface ChallengeConnectorProps {
  stage: string;
  hasChallenge: boolean;
}

/**
 * Draws an animated SVG arrow from ValidationAgent card to Commander card.
 * Uses getBoundingClientRect on data-agent-id elements.
 * Hidden on mobile (< md) — relies on pulse effect alone there.
 */
export function ChallengeConnector({ stage, hasChallenge }: ChallengeConnectorProps) {
  const [path, setPath] = useState<string>('');
  const [arrowPoints, setArrowPoints] = useState<string>('');
  const [visible, setVisible] = useState(false);
  const svgRef = useRef<SVGSVGElement>(null);
  const [dims, setDims] = useState({ width: 0, height: 0, top: 0, left: 0 });

  const computePath = useCallback(() => {
    const valCard = document.querySelector('[data-agent-id="ValidationAgent"]');
    const cmdCard = document.querySelector('[data-agent-id="Commander"]');
    if (!valCard || !cmdCard) return;

    const valRect = valCard.getBoundingClientRect();
    const cmdRect = cmdCard.getBoundingClientRect();

    // We need a coordinate system relative to the fleet container
    const fleetContainer = valCard.closest('[data-fleet-container]');
    if (!fleetContainer) return;
    const containerRect = fleetContainer.getBoundingClientRect();

    const startX = valRect.left - containerRect.left + valRect.width / 2;
    const startY = valRect.top - containerRect.top;
    const endX = cmdRect.left - containerRect.left + cmdRect.width / 2;
    const endY = cmdRect.top - containerRect.top + cmdRect.height;

    // Curved path
    const midY = Math.min(startY, endY) - 35;
    const d = `M ${startX} ${startY} Q ${(startX + endX) / 2} ${midY} ${endX} ${endY}`;
    setPath(d);

    // Arrow head
    const arrowSize = 8;
    const angle = Math.atan2(endY - midY, endX - (startX + endX) / 2);
    const ax = endX - arrowSize * Math.cos(angle - 0.4);
    const ay = endY - arrowSize * Math.sin(angle - 0.4);
    const bx = endX - arrowSize * Math.cos(angle + 0.4);
    const by = endY - arrowSize * Math.sin(angle + 0.4);
    setArrowPoints(`${endX},${endY} ${ax},${ay} ${bx},${by}`);

    setDims({
      width: containerRect.width,
      height: containerRect.height,
      top: 0,
      left: 0,
    });
  }, []);

  useEffect(() => {
    const shouldShow = hasChallenge && (stage === 'REPLANNING' || stage === 'VALIDATION');
    if (shouldShow) {
      // Small delay to let cards render
      const timer = setTimeout(() => {
        computePath();
        setVisible(true);
      }, 200);
      return () => clearTimeout(timer);
    } else if (stage === 'COMPLETE') {
      // Keep visible briefly after completion
      const timer = setTimeout(() => setVisible(false), 3000);
      return () => clearTimeout(timer);
    } else {
      setVisible(false);
    }
  }, [stage, hasChallenge, computePath]);

  // Recompute on resize
  useEffect(() => {
    if (!visible) return;
    const handleResize = () => computePath();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [visible, computePath]);

  if (!visible || !path) return null;

  return (
    <svg
      ref={svgRef}
      className="absolute inset-0 pointer-events-none z-20 hidden md:block"
      width={dims.width}
      height={dims.height}
      style={{ overflow: 'visible' }}
    >
      <path
        d={path}
        fill="none"
        stroke={getAgentColor('ValidationAgent').hex}
        strokeWidth="2"
        strokeDasharray="200"
        strokeDashoffset="200"
        className="challenge-connector-line"
        opacity="0.8"
      />
      <polygon
        points={arrowPoints}
        fill={getAgentColor('ValidationAgent').hex}
        opacity="0"
        className="challenge-connector-arrow"
      />
    </svg>
  );
}
