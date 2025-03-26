export const catBreeds = {
  siamese: "siam",
  "maine coon": "mcoo",
  persian: "pers",
  ragdoll: "ragd",
  sphynx: "sphy",
};

export function getBreedIdFromName(name) {
  if (!name) return null;
  const key = name.toLowerCase().trim();
  return catBreeds[key] || null;
}
