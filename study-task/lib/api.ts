type Subject = {
  id: number;
  name: string;
};

export async function fetchSubjects(token: string): Promise<Subject[]> {
  const response = await fetch("/api/subjects", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || "Failed to fetch subjects");
  }

  const data = await response.json();
  return data.subjects;
}
