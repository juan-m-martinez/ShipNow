const AppError = require("../errors/app.error");

const DEFAULT_LIMIT = 20;
const MAX_LIMIT = 100;

const parsePagination = (query = {}) => {
  const rawPage = query.page ?? "1";
  const rawLimit = query.limit ?? String(DEFAULT_LIMIT);
  const page = Number(rawPage);
  const limit = Number(rawLimit);

  if (
    !Number.isSafeInteger(page) ||
    page < 1 ||
    !Number.isSafeInteger(limit) ||
    limit < 1 ||
    limit > MAX_LIMIT
  ) {
    throw new AppError("INVALID_PAGINATION");
  }

  const skip = (page - 1) * limit;
  if (!Number.isSafeInteger(skip)) throw new AppError("INVALID_PAGINATION");
  return { page, limit, skip };
};

const buildPagination = ({ page, limit, total }) => ({
  page,
  limit,
  total,
  totalPages: Math.ceil(total / limit),
});

module.exports = { parsePagination, buildPagination, DEFAULT_LIMIT, MAX_LIMIT };
