export type HelixStream = {
  user_id: string;
  user_login: string;
  user_name: string;
  game_id: string;
  game_name: string;
  title: string;
  tags?: string[];
  viewer_count: number;
  started_at: string;
  thumbnail_url: string;
};

export type HelixUser = {
  id: string;
  login: string;
  display_name: string;
  description?: string;
  profile_image_url: string;
};

export type HelixChannel = { broadcaster_id: string; content_classification_labels: string[] };

export type HelixCategory = { id: string; name: string; box_art_url: string };

export type Category = { id: string; name: string; slug: string; boxArtUrl: string };

export type Streamer0V = {
  id: string;
  login: string;
  displayName: string;
  title: string;
  categoryId: string;
  categoryName: string;
  startedAt: string;
  viewerCount: number;
  thumbnailUrl: string;
  profileImageUrl: string;
  mature: boolean;
};

export type SetAsideReason = "media" | "crypto" | "gambling" | "signalements";

export type SetAsideStream = Pick<Streamer0V, "id" | "login" | "displayName" | "title" | "categoryName" | "viewerCount"> & { reason: SetAsideReason };

export type LivePoint = { at: number; lives: number };
