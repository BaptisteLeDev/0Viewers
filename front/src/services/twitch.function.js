filterZeroViewers = (streams) => {
  return streams.filter(stream => stream.viewer_count === 0);
};
