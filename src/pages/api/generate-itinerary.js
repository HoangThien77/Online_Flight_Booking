export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  const { destination, num_days } = req.body;

  try {
    const response = await fetch("http://localhost:8000/generate-itinerary", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ destination, num_days }),
    });

    if (!response.ok) {
      throw new Error("Failed to fetch itinerary from AI server");
    }

    const data = await response.json();

    return res.status(200).json(data);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
}
