export const formatDate = (dateString: string): string => {
  if (!dateString) return '--/--/----';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

export const formatTime = (isoString: string): string => {
  if (!isoString) return '--:--';
  return isoString.split('T')[1]?.substring(0, 5) || '--:--';
};

export const isOverdue = (dueDate: string): boolean => {
  return new Date(dueDate) < new Date();
};
