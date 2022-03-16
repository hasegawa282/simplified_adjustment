export const convertDateIntoYMDHM = (date: string | Date | number) => {
    const dt = new Date(date);
    const year = ('0000' + dt.getFullYear()).slice(-4);
    const month = ('00' + (dt.getMonth() + 1)).slice(-2);
    const day = ('00' + dt.getDate()).slice(-2);
    const hour = ('00' + dt.getHours()).slice(-2);
    const minute = ('00' + dt.getMinutes()).slice(-2);
    return `${year}-${month}-${day}T${hour}:${minute}`;
  };
    