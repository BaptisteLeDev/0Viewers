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

-- one row per UTC hour (max FR live count), purged after 1 year.
CREATE TABLE IF NOT EXISTS live_count (
  crawled_at timestamptz PRIMARY KEY,
  lives      integer NOT NULL CHECK (lives >= 0)
);

-- Boîte à idées: proposals sent by signed-in viewers, triaged by hand.
CREATE TABLE IF NOT EXISTS suggestion (
  id         bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  viewer_id  text NOT NULL REFERENCES viewer (twitch_id) ON DELETE CASCADE,
  kind       text NOT NULL CHECK (kind IN ('feature', 'bug', 'algo', 'autre')),
  body       text NOT NULL CHECK (char_length(body) BETWEEN 10 AND 2000),
  status     text NOT NULL DEFAULT 'nouvelle' CHECK (status IN ('nouvelle', 'lue', 'faite', 'refusee')),
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS suggestion_viewer_idx ON suggestion (viewer_id, created_at);
