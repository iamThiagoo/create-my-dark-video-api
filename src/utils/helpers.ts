export const generateUniqueId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substring(2);
};

export const getStoryChunks = (story): [string] => {
  return story
    .split(/\n\n|\.\s/)
    .map((chunk) => chunk.trim())
    .filter((chunk) => chunk.length > 0);
};
