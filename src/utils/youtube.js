// src/utils/youtube.js
const API_KEY = process.env.NEXT_PUBLIC_YOUTUBE_API_KEY;
const BASE_URL = 'https://www.googleapis.com/youtube/v3';

export const fetchYouTubeComments = async (videoId) => {
  // 1. Safety Checks
  if (!API_KEY) {
    console.error("❌ YOUTUBE: Missing API Key in .env.local");
    return null;
  }
  if (!videoId) {
    return null;
  }

  try {
    // 2. Fetch Comments from Google API
    const response = await fetch(
      `${BASE_URL}/commentThreads?part=snippet&videoId=${videoId}&maxResults=20&order=relevance&key=${API_KEY}`
    );

    const data = await response.json();

    // 3. Handle API Errors (like Video Not Found or Quota Exceeded)
    if (data.error) {
      console.warn("⚠️ YouTube API Error:", data.error.message);
      return null; // Return null so the UI shows the "Join Conversation" button instead
    }

    // 4. Map the messy Google data to clean objects for our app
    return data.items.map(item => ({
      id: item.id,
      author: item.snippet.topLevelComment.snippet.authorDisplayName,
      avatar: item.snippet.topLevelComment.snippet.authorProfileImageUrl,
      text: item.snippet.topLevelComment.snippet.textDisplay,
      likes: item.snippet.topLevelComment.snippet.likeCount,
      publishedAt: item.snippet.topLevelComment.snippet.publishedAt,
    }));

  } catch (error) {
    console.error("❌ Network Error fetching comments:", error);
    return null;
  }
};