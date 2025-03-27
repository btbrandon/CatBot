import fetch from "node-fetch";
import { getBreedIdFromName } from "../utils/catBreedUtils.js";

export default async function getCatImage({ breed = null, count = 1 }) {
  const headers = {
    "x-api-key": process.env.CAT_API_KEY,
  };

  const breedId = getBreedIdFromName(breed);

  const params = new URLSearchParams();
  if (breedId) params.append("breed_ids", breedId);
  params.append("limit", count);

  const response = await fetch(
    `https://api.thecatapi.com/v1/images/search?${params}`,
    { headers }
  );
  const data = await response.json();
  return data.map((img) => img.url);
}
