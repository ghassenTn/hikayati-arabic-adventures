
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { Puzzle } from "lucide-react";

interface WordSearchPuzzleProps {
  storyContent: string;
  onGeneratePuzzle: () => Promise<{grid: string[][], words: string[]}>;
}

const WordSearchPuzzle = ({ storyContent, onGeneratePuzzle }: WordSearchPuzzleProps) => {
  const { toast } = useToast();
  const [isGenerating, setIsGenerating] = useState(false);
  const [puzzle, setPuzzle] = useState<{grid: string[][], words: string[]} | null>(null);
  const [selectedCells, setSelectedCells] = useState<number[][]>([]);
  const [foundWords, setFoundWords] = useState<string[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [startCell, setStartCell] = useState<number[] | null>(null);
  
  const generateNewPuzzle = async () => {
    setIsGenerating(true);
    try {
      const newPuzzle = await onGeneratePuzzle();
      setPuzzle(newPuzzle);
      setSelectedCells([]);
      setFoundWords([]);
      toast({
        title: "تم إنشاء اللغز بنجاح",
        description: `ابحث عن ${newPuzzle.words.length} كلمات مخفية`,
      });
    } catch (error) {
      console.error("Error generating puzzle:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  useEffect(() => {
    // Generate puzzle on component mount if not already generated
    if (!puzzle && storyContent) {
      generateNewPuzzle();
    }
  }, [storyContent]);

  const handleCellMouseDown = (rowIndex: number, colIndex: number) => {
    setIsDragging(true);
    setStartCell([rowIndex, colIndex]);
    setSelectedCells([[rowIndex, colIndex]]);
  };

  const handleCellMouseEnter = (rowIndex: number, colIndex: number) => {
    if (!isDragging || !startCell) return;
    
    // Determine direction from start cell to current cell
    const [startRow, startCol] = startCell;
    
    // Calculate direction vector
    const rowDir = Math.sign(rowIndex - startRow) || 0;
    const colDir = Math.sign(colIndex - startCol) || 0;
    
    // Only select cells in a straight line (horizontal, vertical, or diagonal)
    if (rowDir !== 0 && colDir !== 0) {
      // Diagonal selection
      if (Math.abs(rowIndex - startRow) !== Math.abs(colIndex - startCol)) return;
    }
    
    // Create new selection path from start to current position
    const newSelectedCells = [[startRow, startCol]];
    let currentRow = startRow;
    let currentCol = startCol;
    
    while (currentRow !== rowIndex || currentCol !== colIndex) {
      currentRow += rowDir;
      currentCol += colDir;
      newSelectedCells.push([currentRow, currentCol]);
    }
    
    setSelectedCells(newSelectedCells);
  };

  const handleCellMouseUp = () => {
    if (isDragging && puzzle) {
      // Check if selection matches a word
      const selectedWord = getSelectedWord(selectedCells, puzzle.grid);
      
      // Check if the selection matches a word in the puzzle
      const foundWord = puzzle.words.find(word => 
        word === selectedWord || word === selectedWord.split('').reverse().join('')
      );
      
      if (foundWord && !foundWords.includes(foundWord)) {
        setFoundWords([...foundWords, foundWord]);
        toast({
          title: "أحسنت!",
          description: `لقد وجدت كلمة: ${foundWord}`,
        });
        
        // Check if all words are found
        if (foundWords.length + 1 === puzzle.words.length) {
          toast({
            title: "تهانينا! 🎉",
            description: "لقد وجدت جميع الكلمات في اللغز!",
          });
        }
      } else {
        // Clear selection if no word found
        setSelectedCells([]);
      }
    }
    
    setIsDragging(false);
  };

  const getSelectedWord = (cells: number[][], grid: string[][]) => {
    return cells.map(([row, col]) => grid[row][col]).join('');
  };

  const isCellSelected = (rowIndex: number, colIndex: number) => {
    return selectedCells.some(([row, col]) => row === rowIndex && col === colIndex);
  };

  const isCellInFoundWord = (rowIndex: number, colIndex: number) => {
    if (!puzzle) return false;
    
    for (const word of foundWords) {
      // Find all possible positions of this word in the grid
      for (let r = 0; r < puzzle.grid.length; r++) {
        for (let c = 0; c < puzzle.grid[0].length; c++) {
          // Check in all 8 directions
          const directions = [
            [-1, 0], [1, 0], [0, -1], [0, 1], [-1, -1], [-1, 1], [1, -1], [1, 1]
          ];
          
          for (const [dr, dc] of directions) {
            let matches = true;
            
            for (let i = 0; i < word.length; i++) {
              const nr = r + i * dr;
              const nc = c + i * dc;
              
              if (nr < 0 || nr >= puzzle.grid.length || nc < 0 || nc >= puzzle.grid[0].length) {
                matches = false;
                break;
              }
              
              if (puzzle.grid[nr][nc] !== word[i]) {
                matches = false;
                break;
              }
            }
            
            if (matches) {
              // Check if the current cell is part of this word
              for (let i = 0; i < word.length; i++) {
                const nr = r + i * dr;
                const nc = c + i * dc;
                if (nr === rowIndex && nc === colIndex) {
                  return true;
                }
              }
            }
          }
        }
      }
    }
    
    return false;
  };

  return (
    <Card className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-bold">لغز البحث عن الكلمات</h3>
        
        <Button 
          onClick={generateNewPuzzle}
          disabled={isGenerating}
          variant="outline"
          className="flex items-center"
        >
          {isGenerating ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-primary mr-2 rtl:ml-2 rtl:mr-0"></div>
              جاري إنشاء اللغز...
            </>
          ) : (
            <>
              <Puzzle className="mr-2 h-4 w-4 rtl:ml-2 rtl:mr-0" />
              لغز جديد
            </>
          )}
        </Button>
      </div>
      
      {puzzle ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="word-search-grid">
            <div 
              className="grid gap-1 bg-secondary/20 p-4 rounded-lg" 
              style={{ gridTemplateColumns: `repeat(${puzzle.grid[0].length}, 1fr)` }}
              onMouseLeave={handleCellMouseUp}
            >
              {puzzle.grid.map((row, rowIndex) => (
                row.map((cell, colIndex) => (
                  <div 
                    key={`${rowIndex}-${colIndex}`}
                    className={`
                      w-8 h-8 md:w-10 md:h-10 flex items-center justify-center 
                      text-lg md:text-xl font-bold rounded cursor-pointer
                      transition-colors duration-200
                      ${isCellInFoundWord(rowIndex, colIndex) ? 'bg-green-500/20' : ''}
                      ${isCellSelected(rowIndex, colIndex) ? 'bg-primary/50 text-primary-foreground' : 'bg-background hover:bg-primary/10'}
                    `}
                    onMouseDown={() => handleCellMouseDown(rowIndex, colIndex)}
                    onMouseEnter={() => handleCellMouseEnter(rowIndex, colIndex)}
                    onMouseUp={handleCellMouseUp}
                  >
                    {cell}
                  </div>
                ))
              ))}
            </div>
          </div>
          
          <div className="word-list">
            <h4 className="text-lg font-semibold mb-4">الكلمات المطلوب إيجادها:</h4>
            <ul className="grid grid-cols-2 gap-2">
              {puzzle.words.map((word, index) => (
                <li 
                  key={index}
                  className={`px-3 py-2 rounded-lg text-center text-lg ${
                    foundWords.includes(word) ? 'bg-green-500/20 line-through' : 'bg-secondary/20'
                  }`}
                >
                  {word}
                </li>
              ))}
            </ul>
          </div>
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-lg">جاري تحميل اللغز...</p>
        </div>
      )}
    </Card>
  );
};

export default WordSearchPuzzle;
