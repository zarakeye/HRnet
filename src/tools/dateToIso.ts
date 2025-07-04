const dateToISO = (dateString: string) => {
  const [day, month, year] = dateString.split('/');
  return new Date(`${year}-${month}-${day}`).toISOString(); // ⚠️ attention à l'ordre
};

export default dateToISO;