export const swimSeed = {
  goldilocks_zones: {
    hrv: { min: 60, max: 100 },
    stroke: { min: 30, max: 40 },
    drag: { min: 0.4, max: 0.7 }
  },
  initial_entities: [
    { id: 1, orbit: 'metabolic', type: 'hrv', angle: 0, value: 65, inResonance: true },
    { id: 2, orbit: 'metabolic', type: 'stroke', angle: 5, value: 32, inResonance: true },
    { id: 3, orbit: 'ecological', type: 'drag', angle: 10, value: 0.8, inResonance: false }
  ]
};