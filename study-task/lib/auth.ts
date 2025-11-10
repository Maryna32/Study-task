export const getAuthToken = () => {
  const raw = localStorage.getItem("sb-enwjskgehaagktyijvzj-auth-token");
  if (!raw) return null;

  try {
    const data = JSON.parse(raw);
    return (
      data?.access_token ||
      data?.currentSession?.access_token ||
      data?.session?.access_token
    );
  } catch {
    return null;
  }
};
