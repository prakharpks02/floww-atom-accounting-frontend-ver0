export const getFileNameFromURL = (url) => {
  const fullUrl = url;
  if (!fullUrl) return;

  // Get last part after '/'
  let fileName = fullUrl.substring(fullUrl.lastIndexOf("/") + 1);

  // Remove everything before and including 2nd hyphen (-)
  const secondDashIndex = fileName.indexOf("-", fileName.indexOf("-") + 1);
  fileName = fileName.substring(secondDashIndex + 1);

  // Remove extension (after last '.')
  fileName = fileName.substring(0, fileName.lastIndexOf("."));

  return fileName;
};
