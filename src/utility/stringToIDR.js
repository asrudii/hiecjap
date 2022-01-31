export const stringToIDR = (text) => {
  new Intl.NumberFormat("id-ID", { maximumSignificantDigits: 3 }).format(text);
};
