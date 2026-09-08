const API_URL = "http://localhost:5000";

export async function getOffboardings() {
  const response = await fetch(
    `${API_URL}/offboarding`
  );

  if (!response.ok) {
    throw new Error("Failed to fetch offboardings");
  }

  return response.json();
}

export async function getOffboardingById(id) {
  const response = await fetch(
    `${API_URL}/offboarding/${id}`
  );

  if (!response.ok) {
    throw new Error("Failed to fetch offboarding");
  }

  return response.json();
}

export async function createOffboarding(data) {
  const response = await fetch(
    `${API_URL}/offboarding`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    }
  );

  if (!response.ok) {
    throw new Error("Failed to create offboarding");
  }

  return response.json();
}
