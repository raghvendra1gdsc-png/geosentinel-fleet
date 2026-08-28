import { useEffect, useRef } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

interface AnimatedNumberProps {
  value: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  className?: string;
  /** Duration hint in seconds (controls spring stiffness) */
  duration?: number;
}

/**
 * Renders a <span> whose text tweens smoothly from old value to new value.
 * Drop-in replacement for raw numeric text.
 */
export function AnimatedNumber({
  value,
  decimals = 0,
  prefix = '',
  suffix = '',
  className = '',
  duration = 0.7,
}: AnimatedNumberProps) {
  const motionValue = useMotionValue(0);
  const springValue = useSpring(motionValue, {
    stiffness: 80,
    damping: 20,
    duration,
  });
  const spanRef = useRef<HTMLSpanElement>(null);
  const initialized = useRef(false);

  // Drive the spring toward the target value
  useEffect(() => {
    if (!initialized.current) {
      motionValue.jump(value);
      initialized.current = true;
    } else {
      motionValue.set(value);
    }
  }, [value, motionValue]);

  // Update DOM text on every spring tick
  useEffect(() => {
    const unsubscribe = springValue.on('change', (latest) => {
      if (spanRef.current) {
        spanRef.current.textContent = `${prefix}${latest.toFixed(decimals)}${suffix}`;
      }
    });
    return unsubscribe;
  }, [springValue, prefix, suffix, decimals]);

  return (
    <motion.span ref={spanRef} className={className}>
      {prefix}{value.toFixed(decimals)}{suffix}
    </motion.span>
  );
}
