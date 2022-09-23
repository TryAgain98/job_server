exports.getPagination = (page, size) => {
    const limit = size ? +size : 10;
    if (page <= 0) {
      page = 1;
    }
    const offset = page ? (page - 1) * limit : 0;
  
    return { limit, offset };
  };

exports.getPagingData = (data, page, limit) => {
const { count: totalItems, rows: items } = data;
if (page <= 0) {
  page = 1;
}
const currentPage = page ? + page : 0;
const totalPages = Math.ceil(totalItems / limit);

return { totalItems, items, totalPages, currentPage };
};