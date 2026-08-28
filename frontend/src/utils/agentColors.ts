/**
 * Canonical agent accent color map.
 * Commander=blue, Structural=green, Simulation=cyan, Retrofit=purple, Validation=magenta/pink.
 * Used for 3px left-border + box-shadow glow on every agent-attributed element.
 */

export interface AgentColorEntry {
  hex: string;
  borderClass: string;
  glowShadow: string;
  textClass: string;
  bgClass: string;
}

export const AGENT_COLORS: Record<string, AgentColorEntry> = {
  Commander: {
    hex: '#3b82f6',
    borderClass: 'border-l-blue-500',
    glowShadow: '0 0 12px rgba(59, 130, 246, 0.25)',
    textClass: 'text-blue-400',
    bgClass: 'bg-blue-500',
  },
  StructuralAgent: {
    hex: '#22c55e',
    borderClass: 'border-l-green-500',
    glowShadow: '0 0 12px rgba(34, 197, 94, 0.25)',
    textClass: 'text-green-400',
    bgClass: 'bg-green-500',
  },
  SimulationAgent: {
    hex: '#06b6d4',
    borderClass: 'border-l-cyan-500',
    glowShadow: '0 0 12px rgba(6, 182, 212, 0.25)',
    textClass: 'text-cyan-400',
    bgClass: 'bg-cyan-500',
  },
  RetrofitAgent: {
    hex: '#a855f7',
    borderClass: 'border-l-purple-500',
    glowShadow: '0 0 12px rgba(168, 85, 247, 0.25)',
    textClass: 'text-purple-400',
    bgClass: 'bg-purple-500',
  },
  ValidationAgent: {
    hex: '#ec4899',
    borderClass: 'border-l-pink-500',
    glowShadow: '0 0 12px rgba(236, 72, 153, 0.25)',
    textClass: 'text-pink-400',
    bgClass: 'bg-pink-500',
  },
};

/** Get agent color entry with a gray fallback for unknown agents */
export function getAgentColor(agent: string): AgentColorEntry {
  return AGENT_COLORS[agent] ?? {
    hex: '#6b7280',
    borderClass: 'border-l-gray-500',
    glowShadow: '0 0 8px rgba(107, 114, 128, 0.15)',
    textClass: 'text-gray-400',
    bgClass: 'bg-gray-500',
  };
}
