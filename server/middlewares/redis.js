import { redis } from "../index.js";

export const cachedData = (keys) => async (req, res, next) => {
  let data = await redis.get(keys);
  if (data) {
    return res.json(JSON.parse(data));
  }

  next();
};

export const rateLimiter =
  ({ timer, count, key }) =>
  async (req, res, next) => {
    const clientIp = req.ip;
    const fullKey = `${clientIp}:${key}:request_count`;

    const requestCount = await redis.incr(fullKey);

    if (requestCount === 1) {
      await redis.expire(fullKey, timer);
    }

    const timeRemaining = await redis.ttl(fullKey);

    if (requestCount > count) {
      return res.status(429).send(`Too Many Requests, 
      Try again after ${timeRemaining}`);
    }

    next();
  };
