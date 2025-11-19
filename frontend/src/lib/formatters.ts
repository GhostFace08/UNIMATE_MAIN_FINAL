// Format number with Indian comma system (lakhs/crores)
export const formatIndianNumber = (num: number): string => {
  const numStr = Math.abs(num).toFixed(2);
  const [integer, decimal] = numStr.split('.');
  
  // Add commas in Indian style (last 3 digits, then groups of 2)
  let formatted = '';
  const len = integer.length;
  
  if (len <= 3) {
    formatted = integer;
  } else {
    const lastThree = integer.substring(len - 3);
    const remaining = integer.substring(0, len - 3);
    
    formatted = remaining.replace(/\B(?=(\d{2})+(?!\d))/g, ',') + ',' + lastThree;
  }
  
  return num < 0 ? `-₹${formatted}.${decimal}` : `₹${formatted}.${decimal}`;
};
