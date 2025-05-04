import { useEffect, useRef } from 'react';

const useAutoResizeTextarea = () => {
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  useEffect(() => {
    if (textareaRef.current) {
      const resize = () => {
        textareaRef.current!.style.height = 'auto';
        textareaRef.current!.style.height = `${textareaRef.current!.scrollHeight}px`;
      };
      
      textareaRef.current.addEventListener('input', resize);
      resize(); // Initial resize
      
      return () => {
        textareaRef.current!.removeEventListener('input', resize);
      };
    }
  }, []);

  return textareaRef;
};

export default useAutoResizeTextarea;