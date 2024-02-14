export function capitalize(str) {
  return str?.charAt(0).toUpperCase() + str?.slice(1);
}

export function formatDate(inputDate) {
  let date = new Date(inputDate).toString().split(' ');
  return date[2] + ' ' + date[1] + ' ' + date[3];
}