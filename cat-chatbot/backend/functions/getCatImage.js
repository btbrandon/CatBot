const fetch = require("node-fetch");

module.exports = async function getCatImage({ breed = null, count = 1 }) {
  const headers = {
    "x-api-key": process.env.CAT_API_KEY,
  };

  const params = new URLSearchParams();
  if (breed) params.append("breed_ids", breed);
  params.append("limit", count);

  const response = await fetch(
    `https://api.thecatapi.com/v1/images/search?${params}`,
    { headers }
  );
  const data = await response.json();
  return data.map((img) => img.url);
};
