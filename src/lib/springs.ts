export const springs = {
  zoom: { stiffness: 300, damping: 30, mass: 0.8 },
  check: { stiffness: 400, damping: 15, mass: 0.5 },
  reorder: { stiffness: 250, damping: 25, mass: 0.6 },
  elastic: { stiffness: 200, damping: 20, mass: 1.0 },
  navigate: { stiffness: 350, damping: 35, mass: 0.7 },
  hover: { stiffness: 500, damping: 30, mass: 0.3 },
} as const;
