import React, { useState, useEffect, useRef } from 'react';
import { Button } from "@/components/ui/button"; // Assuming shadcn/ui Button
import { Card } from "@/components/ui/card"; // Assuming shadcn/ui Card
import { useToast } from "@/components/ui/use-toast"; // Assuming shadcn/ui useToast
import { Puzzle, Maximize2, Minimize2, TimerIcon } from "lucide-react"; // Added TimerIcon
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"; // Assuming shadcn/ui Dialog components

// --- Mock Components (Replace with your actual implementations) ---
// These are placeholders if you don't have shadcn/ui set up in this environment.
// Remove these if you have the actual components imported.

const MockButton = ({ children, ...props }) => <button {...props}>{children}</button>;
const MockCard = ({ children, className }) => <div className={`border rounded-lg shadow p-4 ${className}`}>{children}</div>;
const MockDialog = ({ children, open, onOpenChange }) => open ? <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center" onClick={() => onOpenChange(false)}><div onClick={e => e.stopPropagation()}>{children}</div></div> : null;
const MockDialogContent = ({ children, className }) => <div className={`bg-white rounded-lg shadow-xl p-6 ${className}`}>{children}</div>;
const MockDialogHeader = ({ children }) => <div className="mb-4">{children}</div>;
const MockDialogTitle = ({ children }) => <h2 className="text-xl font-semibold">{children}</h2>;
// Ensure TimerIcon is available or provide a mock
const MockTimerIcon = (props) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>;


const ShadcnButton = typeof Button !== 'undefined' ? Button : MockButton;
const ShadcnCard = typeof Card !== 'undefined' ? Card : MockCard;
const ShadcnDialog = typeof Dialog !== 'undefined' ? Dialog : MockDialog;
const ShadcnDialogContent = typeof DialogContent !== 'undefined' ? DialogContent : MockDialogContent;
const ShadcnDialogHeader = typeof DialogHeader !== 'undefined' ? DialogHeader : MockDialogHeader;
const ShadcnDialogTitle = typeof DialogTitle !== 'undefined' ? DialogTitle : MockDialogTitle;
const LucideTimerIcon = typeof TimerIcon !== 'undefined' ? TimerIcon : MockTimerIcon;


// Mock useToast hook
const mockToast = ({ title, description }) => {
  console.log(`Toast: ${title} - ${description}`);
  // In a real app, you'd display this message to the user
  const toastElement = document.createElement('div');
  toastElement.style.position = 'fixed';
  toastElement.style.top = '20px';
  toastElement.style.right = '20px';
  toastElement.style.backgroundColor = '#333';
  toastElement.style.color = 'white';
  toastElement.style.padding = '10px 20px';
  toastElement.style.borderRadius = '5px';
  toastElement.style.zIndex = '1000';
  toastElement.innerHTML = `<strong>${title}</strong><br>${description}`;
  document.body.appendChild(toastElement);
  setTimeout(() => {
    if (document.body.contains(toastElement)) {
        document.body.removeChild(toastElement);
    }
  }, 3000);
};

const useShadcnToast = typeof useToast !== 'undefined' ? useToast : () => ({ toast: mockToast });

// --- End Mock Components ---


interface WordSearchPuzzleProps {
  storyContent: string; // Content used to derive words (or trigger generation)
  onGeneratePuzzle: () => Promise<{grid: string[][], words: string[]}>; // Async function to get puzzle data
}

// Helper function to format seconds into MM:SS
const formatTime = (totalSeconds: number): string => {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
};

const WordSearchPuzzle = ({ storyContent, onGeneratePuzzle }: WordSearchPuzzleProps) => {
  const { toast } = useShadcnToast(); // Use the actual or mock hook
  const [isGenerating, setIsGenerating] = useState(false);
  const [puzzle, setPuzzle] = useState<{grid: string[][], words: string[]} | null>(null);
  const [selectedCells, setSelectedCells] = useState<number[][]>([]);
  const [foundWords, setFoundWords] = useState<string[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [startCell, setStartCell] = useState<number[] | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false); // State to control the dialog

  // Timer State
  const [elapsedTime, setElapsedTime] = useState(0); // Time in seconds
  const [timerActive, setTimerActive] = useState(false);
  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null); // Ref to store interval ID

  // Function to start the timer
  const startTimer = () => {
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current); // Clear existing interval if any
    }
    setElapsedTime(0); // Reset time
    setTimerActive(true);
    timerIntervalRef.current = setInterval(() => {
      setElapsedTime(prevTime => prevTime + 1);
    }, 1000);
  };

  // Function to stop the timer
  const stopTimer = () => {
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = null;
    }
    setTimerActive(false);
  };

    // Function to reset the timer
    const resetTimer = () => {
        stopTimer();
        setElapsedTime(0);
    };

  // Function to generate a new puzzle
  const generateNewPuzzle = async () => {
    setIsGenerating(true);
    resetTimer(); // Reset timer when starting generation
    setPuzzle(null); // Clear old puzzle while generating
    setSelectedCells([]);
    setFoundWords([]);
    try {
      const newPuzzle = await onGeneratePuzzle();
      setPuzzle(newPuzzle);
      startTimer(); // Start timer after puzzle is generated
      toast({
        title: "تم إنشاء اللغز بنجاح", // Puzzle generated successfully
        description: `ابحث عن ${newPuzzle.words.length} كلمات مخفية`, // Find X hidden words
      });
    } catch (error) {
      console.error("Error generating puzzle:", error);
      toast({
        title: "خطأ", // Error
        description: "حدث خطأ أثناء إنشاء اللغز.", // An error occurred while generating the puzzle.
        variant: "destructive", // Use destructive variant for errors if available
      });
    } finally {
      setIsGenerating(false);
    }
  };

  // Effect to generate puzzle when component mounts or storyContent changes (if no puzzle exists)
  useEffect(() => {
    if (storyContent && !puzzle && !isGenerating) {
      generateNewPuzzle();
    }
  }, [storyContent]); // Removed onGeneratePuzzle from deps to avoid potential loops if it's not stable

  // Effect to handle timer cleanup on component unmount
  useEffect(() => {
    return () => {
      stopTimer(); // Clear interval when component unmounts
    };
  }, []);

  // Effect to stop timer when all words are found
  useEffect(() => {
    if (puzzle && foundWords.length === puzzle.words.length && timerActive) {
      stopTimer();
      toast({
        title: "تهانينا! 🎉", // Congratulations!
        description: `لقد وجدت جميع الكلمات في ${formatTime(elapsedTime)}!`, // You found all words in MM:SS!
      });
    }
  }, [foundWords, puzzle, timerActive, elapsedTime]); // Added elapsedTime to deps for the toast message

  // --- Grid Interaction Handlers ---
  // (Keep existing handlers: handleCellMouseDown, handleCellMouseEnter, handleCellMouseUp)
  const handleCellMouseDown = (rowIndex: number, colIndex: number) => {
    if (isGenerating || !puzzle || !timerActive) return; // Don't interact if timer not active
    setIsDragging(true);
    setStartCell([rowIndex, colIndex]);
    setSelectedCells([[rowIndex, colIndex]]);
  };

  const handleCellMouseEnter = (rowIndex: number, colIndex: number) => {
    if (!isDragging || !startCell || !puzzle || !timerActive) return;

    const [startRow, startCol] = startCell;
    const endRow = rowIndex;
    const endCol = colIndex;
    const deltaRow = endRow - startRow;
    const deltaCol = endCol - startCol;
    const rowDir = Math.sign(deltaRow);
    const colDir = Math.sign(deltaCol);
    const isStraight = rowDir === 0 || colDir === 0;
    const isDiagonal = Math.abs(deltaRow) === Math.abs(deltaCol);

    if (!isStraight && !isDiagonal) return;

    const newSelectedCells = [];
    const steps = Math.max(Math.abs(deltaRow), Math.abs(deltaCol));
    for (let i = 0; i <= steps; i++) {
        const cellRow = startRow + i * rowDir;
        const cellCol = startCol + i * colDir;
         if (cellRow >= 0 && cellRow < puzzle.grid.length && cellCol >= 0 && cellCol < puzzle.grid[0].length) {
             newSelectedCells.push([cellRow, cellCol]);
         }
    }
    setSelectedCells(newSelectedCells);
  };

  const handleCellMouseUp = () => {
    if (isDragging && puzzle && selectedCells.length > 0 && timerActive) {
      const selectedWord = getSelectedWord(selectedCells, puzzle.grid);
      const reversedSelectedWord = selectedWord.split('').reverse().join('');

      const foundWord = puzzle.words.find(word =>
        !foundWords.includes(word) && (word === selectedWord || word === reversedSelectedWord)
      );

      if (foundWord) {
        const newFoundWords = [...foundWords, foundWord];
        setFoundWords(newFoundWords);
        setSelectedCells([]);

        toast({
          title: "أحسنت!",
          description: `لقد وجدت كلمة: ${foundWord}`,
        });

        // Note: The "all words found" toast is now handled in the useEffect hook
        // based on foundWords length change.

      } else {
        setSelectedCells([]);
      }
    } else {
        setSelectedCells([]);
    }
    setIsDragging(false);
    setStartCell(null);
  };


  // Helper to get the string from selected cell coordinates
  const getSelectedWord = (cells: number[][], grid: string[][]): string => {
    return cells.map(([row, col]) => {
        if (row >= 0 && row < grid.length && col >= 0 && col < grid[0].length) {
            return grid[row][col];
        }
        return '';
    }).join('');
  };

  // --- Cell State Checkers ---
  // (Keep existing checkers: isCellSelected, isCellInFoundWord, findWordLocations)
  const isCellSelected = (rowIndex: number, colIndex: number): boolean => {
    return selectedCells.some(([row, col]) => row === rowIndex && col === colIndex);
  };

  const findWordLocations = (grid: string[][], word: string): number[][][] => {
      const locations: number[][][] = [];
      if (!grid || grid.length === 0 || !word) return locations;
      const numRows = grid.length;
      const numCols = grid[0].length;
      const wordLen = word.length;
      const directions = [ { dr: 0, dc: 1 }, { dr: 0, dc: -1 }, { dr: 1, dc: 0 }, { dr: -1, dc: 0 }, { dr: 1, dc: 1 }, { dr: 1, dc: -1 }, { dr: -1, dc: 1 }, { dr: -1, dc: -1 }];

      for (let r = 0; r < numRows; r++) {
          for (let c = 0; c < numCols; c++) {
              if (grid[r][c] === word[0]) {
                  for (const { dr, dc } of directions) {
                      const currentPath: number[][] = [];
                      let match = true;
                      for (let i = 0; i < wordLen; i++) {
                          const nr = r + i * dr;
                          const nc = c + i * dc;
                          if (nr < 0 || nr >= numRows || nc < 0 || nc >= numCols || grid[nr][nc] !== word[i]) {
                              match = false;
                              break;
                          }
                          currentPath.push([nr, nc]);
                      }
                      if (match) locations.push(currentPath);
                  }
              }
          }
      }
      return locations;
  };

   const isCellInFoundWord = (rowIndex: number, colIndex: number): boolean => {
     if (!puzzle) return false;
     // Optimization: Memoize found locations if performance becomes an issue
     for (const word of foundWords) {
         const locations = findWordLocations(puzzle.grid, word);
         for (const location of locations) {
             if (location.some(([r, c]) => r === rowIndex && c === colIndex)) {
                 return true;
             }
         }
     }
     return false;
  };


  // --- Rendering Functions ---

  // Renders the word search grid itself
  const renderPuzzleGrid = ({ isFullscreenView = false }: { isFullscreenView?: boolean } = {}) => {
    if (!puzzle) return null;

    const cellSize = isFullscreenView ? 'w-12 h-12 md:w-14 md:h-14' : 'w-10 h-10 md:w-12 md:h-12';
    const textSize = isFullscreenView ? 'text-xl md:text-2xl' : 'text-lg md:text-xl';

    return (
      <div className={`word-search-grid-container ${isFullscreenView ? 'p-4 flex justify-center items-center' : ''}`}>
        <div
          className="grid border border-muted rounded-lg shadow-sm bg-secondary/10 p-2 md:p-4 gap-1"
          style={{
            gridTemplateColumns: `repeat(${puzzle.grid[0]?.length || 0}, minmax(0, 1fr))`,
            aspectRatio: `${puzzle.grid[0]?.length || 1} / ${puzzle.grid.length || 1}`,
            maxWidth: isFullscreenView ? '85vh' : '100%', // Adjusted max width slightly
            maxHeight: isFullscreenView ? '85vh' : 'auto',
            touchAction: 'none',
          }}
          onMouseLeave={handleCellMouseUp}
          onTouchEnd={handleCellMouseUp}
          onTouchCancel={handleCellMouseUp}
        >
          {puzzle.grid.map((row, rowIndex) => (
            row.map((cell, colIndex) => {
              const isFound = isCellInFoundWord(rowIndex, colIndex);
              const isSelected = isCellSelected(rowIndex, colIndex);
              const cellBg = isFound ? 'bg-green-500/30' : isSelected ? 'bg-primary/50 text-primary-foreground' : 'bg-background hover:bg-primary/10';

              // Determine cursor style based on state
              let cursorStyle = 'cursor-pointer';
              if (isDragging) {
                cursorStyle = 'cursor-grabbing';
              } else if (!timerActive || isGenerating) {
                cursorStyle = 'cursor-not-allowed';
              }

              return (
                <div
                  key={`${rowIndex}-${colIndex}`}
                  className={`
                    ${cellSize} ${textSize}
                    flex items-center justify-center
                    font-medium rounded-sm select-none
                    transition-colors duration-100 ease-in-out
                    border border-transparent
                    ${isFound ? 'font-bold' : ''}
                    ${cellBg}
                    ${cursorStyle}
                  `}
                  onMouseDown={() => handleCellMouseDown(rowIndex, colIndex)}
                  onMouseEnter={() => handleCellMouseEnter(rowIndex, colIndex)}
                  onMouseUp={handleCellMouseUp}
                  onTouchStart={(e) => {
                      // Basic touch start handling
                      if (!timerActive || isGenerating) return;
                      const touch = e.touches[0];
                      // Add data attributes to cell divs if more precise touch mapping needed
                      handleCellMouseDown(rowIndex, colIndex);
                  }}
                  onTouchMove={(e) => {
                      if (!isDragging || !timerActive || isGenerating) return;
                      const touch = e.touches[0];
                      // More robust touch move handling needed here
                      // For now, relies on mouseEnter logic triggered by touch move over elements
                       handleCellMouseEnter(rowIndex, colIndex); // Placeholder
                  }}
                >
                  {cell}
                </div>
              );
            })
          ))}
        </div>
      </div>
    );
  };


  // Renders the list of words to find and the timer
  const renderWordListAndTimer = () => (
    <div className="word-list-timer-container mt-6 md:mt-0 flex flex-col">
        {/* Timer Display */}
        <div className="flex items-center justify-center md:justify-end gap-2 mb-4 text-lg font-semibold text-primary">
            <LucideTimerIcon className="h-5 w-5" />
            <span>{formatTime(elapsedTime)}</span>
        </div>

        {/* Word List */}
        <div className="word-list">
            <h4 className="text-lg font-semibold mb-4 text-center md:text-right rtl:md:text-left">الكلمات المطلوب إيجادها:</h4>
            <ul className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-2 lg:grid-cols-3 gap-2">
                {puzzle?.words.map((word, index) => (
                <li
                    key={index}
                    className={`px-3 py-1.5 rounded text-center text-base md:text-lg transition-colors duration-300 ${
                    foundWords.includes(word)
                        ? 'bg-green-100 dark:bg-green-900/50 line-through text-muted-foreground'
                        : 'bg-secondary/50 dark:bg-secondary/30'
                    }`}
                >
                    {word}
                </li>
                ))}
            </ul>
            {puzzle && <p className="text-sm text-muted-foreground mt-4 text-center md:text-right rtl:md:text-left">
                {foundWords.length} / {puzzle.words.length} كلمات تم إيجادها {/* X / Y words found */}
                </p>}
        </div>
    </div>
  );

  // --- Main Component Return ---

  return (
    <ShadcnCard className="p-4 md:p-6 relative overflow-hidden">
      {/* Header section */}
      <div className="flex justify-between items-center mb-4 gap-4">
        <h3 className="text-xl md:text-2xl font-bold flex items-center">
          <Puzzle className="mr-2 rtl:ml-2 rtl:mr-0 h-6 w-6 text-primary" />
          لغز البحث عن الكلمات {/* Word Search Puzzle */}
        </h3>
        <div className="flex gap-2">
           {/* Button to open fullscreen dialog */}
           <ShadcnButton
                onClick={() => setIsFullscreen(true)}
                variant="ghost"
                size="icon"
                className="p-2 h-8 w-8 md:h-9 md:w-9"
                title="تكبير اللغز" // Tooltip: Enlarge Puzzle
                disabled={!puzzle || isGenerating} // Disable if no puzzle or generating
            >
                <Maximize2 className="h-4 w-4 md:h-5 md:w-5" />
            </ShadcnButton>

          {/* Button to generate a new puzzle */}
          <ShadcnButton
            onClick={generateNewPuzzle}
            disabled={isGenerating}
            variant="outline"
            size="sm"
            className="flex items-center text-xs md:text-sm"
          >
            {isGenerating ? (
              <>
                <div className="animate-spin rounded-full h-3 w-3 md:h-4 md:w-4 border-t-2 border-b-2 border-primary mr-2 rtl:ml-2 rtl:mr-0"></div>
                جاري الإنشاء... {/* Generating... */}
              </>
            ) : (
              <>
                <Puzzle className="mr-1 md:mr-2 h-3 w-3 md:h-4 md:w-4 rtl:ml-1 md:ml-2 rtl:mr-0" />
                لغز جديد {/* New Puzzle */}
              </>
            )}
          </ShadcnButton>
        </div>
      </div>

      {/* Puzzle Content Area */}
      {puzzle ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-8 items-start">
          {/* Grid takes more space on medium screens and up */}
          <div className="md:col-span-2">
             {renderPuzzleGrid()}
          </div>
          {/* Word list and Timer */}
          <div className="md:col-span-1">
            {renderWordListAndTimer()}
          </div>
        </div>
      ) : (
        // Loading/Placeholder State
        <div className="text-center py-12 min-h-[200px] flex flex-col justify-center items-center">
          {isGenerating ? (
            <>
              <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-base text-muted-foreground">جاري إنشاء اللغز...</p> {/* Generating puzzle... */}
            </>
          ) : (
             <p className="text-base text-muted-foreground">انقر فوق "لغز جديد" للبدء.</p> // Click "New Puzzle" to start.
          )}
        </div>
      )}

      {/* Fullscreen Dialog */}
      <ShadcnDialog open={isFullscreen} onOpenChange={setIsFullscreen}>
        <ShadcnDialogContent className="max-w-[95vw] max-h-[95vh] w-auto h-auto flex flex-col p-0 sm:max-w-4xl lg:max-w-6xl"> {/* Increased max width slightly */}
          {/* Dialog Header */}
          <ShadcnDialogHeader className="flex flex-row justify-between items-center p-4 border-b">
            <ShadcnDialogTitle className="text-xl md:text-2xl">
                لغز البحث عن الكلمات {/* Word Search Puzzle */}
            </ShadcnDialogTitle>
            <div className="flex gap-2 items-center"> {/* Added items-center */}
                 {/* Timer Display in Dialog Header */}
                <div className="flex items-center gap-1 text-base font-semibold text-primary mr-2">
                    <LucideTimerIcon className="h-4 w-4" />
                    <span>{formatTime(elapsedTime)}</span>
                </div>
                {/* Regenerate button inside dialog */}
                 <ShadcnButton
                    onClick={() => {
                        generateNewPuzzle(); // Generate new one inside fullscreen
                        // Keep fullscreen open after generating
                    }}
                    disabled={isGenerating}
                    variant="outline"
                    size="sm"
                    className="flex items-center text-xs md:text-sm"
                >
                    {isGenerating ? (
                    <>
                        <div className="animate-spin rounded-full h-3 w-3 md:h-4 md:w-4 border-t-2 border-b-2 border-primary mr-2 rtl:ml-2 rtl:mr-0"></div>
                        جاري الإنشاء...
                    </>
                    ) : (
                    <>
                        <Puzzle className="mr-1 md:mr-2 h-3 w-3 md:h-4 md:w-4 rtl:ml-1 md:ml-2 rtl:mr-0" />
                        لغز جديد
                    </>
                    )}
                </ShadcnButton>
                {/* Close button */}
                <ShadcnButton
                    onClick={() => setIsFullscreen(false)}
                    variant="ghost"
                    size="icon"
                    className="p-2 h-8 w-8 md:h-9 md:w-9"
                    title="تصغير" // Tooltip: Minimize
                >
                    <Minimize2 className="h-4 w-4 md:h-5 md:w-5" />
                </ShadcnButton>
            </div>
          </ShadcnDialogHeader>

          {/* Dialog Body: Grid and Word List side-by-side */}
          <div className="flex-1 overflow-auto grid grid-cols-1 lg:grid-cols-5 gap-4 md:gap-6 p-4 md:p-6">
            {/* Puzzle Grid takes more space */}
            <div className="lg:col-span-3 flex justify-center items-start">
              {puzzle ? renderPuzzleGrid({ isFullscreenView: true }) : <p>جاري تحميل اللغز...</p>}
            </div>
            {/* Word List (Timer is now in header) */}
            <div className="lg:col-span-2">
              {puzzle ? renderWordListAndTimer() : null} {/* Use combined render function */}
            </div>
          </div>
        </ShadcnDialogContent>
      </ShadcnDialog>
    </ShadcnCard>
  );
};

export default WordSearchPuzzle;

// // --- Example Usage (if needed for testing) ---
// /*
// import React from 'react';
// import ReactDOM from 'react-dom/client'; // Use createRoot for React 18+

// // Mock function for generating puzzle data
// const generateMockPuzzle = async () => {
//   console.log("Generating mock puzzle...");
//   await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate network delay
//   const words = ["REACT", "PUZZLE", "CODE", "SEARCH", "WORD", "GRID", "TIMER", "STATE"];
//   // Simple 12x12 grid generation
//   const gridSize = 12;
//   const grid = Array(gridSize).fill(null).map(() => Array(gridSize).fill(''));
//   const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

//   // Function to try placing a word
//   const placeWord = (word, grid) => {
//       const directions = [ { dr: 0, dc: 1 }, { dr: 1, dc: 0 }, { dr: 1, dc: 1 }]; // Right, Down, Diag Down-Right
//       const len = word.length;
//       let placed = false;
//       for (let attempt = 0; attempt < 20; attempt++) { // Try multiple positions/directions
//           const dir = directions[Math.floor(Math.random() * directions.length)];
//           const startRow = Math.floor(Math.random() * gridSize);
//           const startCol = Math.floor(Math.random() * gridSize);

//           let canPlace = true;
//           const cellsToFill = [];
//           for (let i = 0; i < len; i++) {
//               const r = startRow + i * dir.dr;
//               const c = startCol + i * dir.dc;
//               if (r < 0 || r >= gridSize || c < 0 || c >= gridSize || (grid[r][c] !== '' && grid[r][c] !== word[i])) {
//                   canPlace = false;
//                   break;
//               }
//               cellsToFill.push({ r, c, char: word[i] });
//           }

//           if (canPlace) {
//               cellsToFill.forEach(({ r, c, char }) => grid[r][c] = char);
//               placed = true;
//               break;
//           }
//       }
//       return placed;
//   };

//   // Place words
//   words.forEach(word => {
//       if (!placeWord(word, grid)) {
//           console.warn(`Could not place word: ${word}`);
//           // Optionally remove word from list if it couldn't be placed
//       }
//   });


//   // Fill remaining cells with random letters
//   for (let r = 0; r < gridSize; r++) {
//     for (let c = 0; c < gridSize; c++) {
//       if (grid[r][c] === '') {
//         grid[r][c] = letters[Math.floor(Math.random() * letters.length)];
//       }
//     }
//   }
//   console.log("Mock puzzle generated:", { grid, words });
//   // Filter words list to only include those actually placed if needed
//   return { grid, words };
// };


// const App = () => {
//   const mockStory = "This is a story about React code and word search puzzles with timers.";

//   return (
//     <div className="p-4 font-sans">
//       <h1 className="text-3xl font-bold mb-6 text-center">Word Search Game</h1>
//       <WordSearchPuzzle
//         storyContent={mockStory}
//         onGeneratePuzzle={generateMockPuzzle}
//       />
//       {/* <Toaster /> */}
//     </div>
//   );
// };

// // --- Rendering the App ---
// // const rootElement = document.getElementById('root');
// // if (rootElement) {
// //   const root = ReactDOM.createRoot(rootElement);
// //   root.render(
// //     <React.StrictMode>
// //       <App />
// //     </React.StrictMode>
// //   );
// // } else {
// //   console.error("Root element not found");
// // }
// */
