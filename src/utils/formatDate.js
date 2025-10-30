export const formatDate = (isoDate) => {
  const date = new Date(isoDate);
  
  const dateString = date.toLocaleDateString('id-ID', { 
    day: 'numeric', 
    month: 'long', 
    year: 'numeric' 
  });
  
  const timeString = date.toLocaleTimeString('id-ID', {
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23'
  });

  return `${dateString} | ${timeString}`;
};