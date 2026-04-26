export const formatPrice = (rawPrice) => {
  if (!rawPrice) return '';

  if (rawPrice >= 10000000) {
    return `Rs. ${(rawPrice / 10000000).toFixed(2).replace(/\.00$/, '')} Cr`;
  }

  if (rawPrice >= 100000) {
    return `Rs. ${(rawPrice / 100000).toFixed(2).replace(/\.00$/, '')} Lakh`;
  }

  return `Rs. ${rawPrice.toLocaleString('en-IN')}`;
};
