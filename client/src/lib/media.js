const API_ORIGIN = import.meta.env.VITE_API_ORIGIN || "http://localhost:3000";

export const getMediaUrl = (value) => {
  if (!value) return "";
  if (typeof value !== "string") return "";
  if (value.startsWith("http://") || value.startsWith("https://") || value.startsWith("data:")) {
    return value;
  }
  if (value.startsWith("/")) {
    return `${API_ORIGIN}${value}`;
  }
  return `${API_ORIGIN}/${value}`;
};
