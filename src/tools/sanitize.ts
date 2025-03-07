function sanitize (str: string): string {
  return str.replace(/&<>"'`=\/\\]/g, s => {
    return "&#" + s.charCodeAt(0) + ';';
  });
}

export default sanitize;
  