export interface Comment {
  id: number;
  discussion_id: string;
  parent_id: number | null; // null if it's a top-level comment, or the ID of the comment it's replying to.
  author: string;
  text: string;
  avatar: string | null; // URL to the author's profile picture. Can be null.
  date: string; // This will be an ISO 8601 date string from the backend (e.g., "2024-05-21T10:00:00").
  
  /**
   * The total number of likes for this comment.
   * This is a computed property from the backend.
   */
  like_count: number; 
  
  /**
   * A boolean flag indicating if the currently authenticated user has liked this comment.
   * This is dynamically added by the backend based on the user's session.
   * It will be `false` for all comments if the user is not logged in.
   */
  is_liked_by_current_user: boolean; 
}