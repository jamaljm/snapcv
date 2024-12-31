export const createFileName = () => {
  const date = new Date();
  return `github-wrap-${date.getFullYear()}-${
    date.getMonth() + 1
  }-${date.getDate()}.png`;
};
