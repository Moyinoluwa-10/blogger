const readingTime = (body) => {
  const noOfWords = body.split(" ").length;
  // assuming the average person reads 180 words a minute
  const reading_time = noOfWords / 180;
  return Math.round(reading_time) === 0 ? 1 : Math.round(reading_time);
};

module.exports = { readingTime };
