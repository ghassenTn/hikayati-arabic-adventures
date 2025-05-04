// Define a list of system fonts that commonly support Arabic
export const arabicFontFallbacks = [
    'Arial',
    'Tahoma', 
    'Calibri',
    'Verdana',
    'Helvetica',
    'Times New Roman'
  ];
  
  // Function to get the best available Arabic font
  export const getBestArabicFont = () => {
    // In a browser environment, we can't detect which system fonts are available
    // So we'll return the first font in our fallbacks list
    return arabicFontFallbacks[0];
  };