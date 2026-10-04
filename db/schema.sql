CREATE TABLE IF NOT EXISTS viewer (
  twitch_id    text PRIMARY KEY,
  login        text NOT NULL,
  display_name text NOT NULL,
  avatar_url   text NOT NULL DEFAULT '',
  created_at   timestamptz NOT NULL DEFAULT now()
);

-- broadcaster id, not stream id: stream id changes each broadcast.
-- value 1 = Soutien (like), -1 = Signalement (dislike).
CREATE TABLE IF NOT EXISTS vote (
  viewer_id      text NOT NULL REFERENCES viewer (twitch_id) ON DELETE CASCADE,
  broadcaster_id text NOT NULL,
  value          smallint NOT NULL CHECK (value IN (-1, 1)),
  voted_at       timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (viewer_id, broadcaster_id)
);

CREATE INDEX IF NOT EXISTS vote_broadcaster_idx ON vote (broadcaster_id);

CREATE OR REPLACE VIEW broadcaster_score AS
SELECT broadcaster_id,
       count(*) FILTER (WHERE value = 1)  AS soutiens,
       count(*) FILTER (WHERE value = -1) AS signalements
FROM vote
GROUP BY broadcaster_id;
