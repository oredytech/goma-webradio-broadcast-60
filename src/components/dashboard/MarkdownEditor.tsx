import React, { useState, useRef } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Bold, Italic, List, ListOrdered } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface MarkdownEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

const MarkdownEditor = ({ value, onChange, placeholder, className }: MarkdownEditorProps) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const getSelection = () => {
    const textarea = textareaRef.current;
    if (!textarea) return { start: 0, end: 0, text: "" };
    
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = value.substring(start, end);
    
    return { start, end, text };
  };

  const replaceSelection = (startChar: string, endChar: string = startChar) => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    
    const { start, end, text } = getSelection();
    
    // If text is already wrapped with the formatting, remove it
    if (
      value.substring(start - startChar.length, start) === startChar &&
      value.substring(end, end + endChar.length) === endChar
    ) {
      const newValue = 
        value.substring(0, start - startChar.length) + 
        text + 
        value.substring(end + endChar.length);
        
      onChange(newValue);
      
      // Reset selection
      setTimeout(() => {
        textarea.focus();
        textarea.setSelectionRange(
          start - startChar.length,
          end - startChar.length
        );
      }, 0);
    } else {
      // Add the formatting
      const newValue = 
        value.substring(0, start) + 
        startChar + text + endChar + 
        value.substring(end);
        
      onChange(newValue);
      
      // Reset selection
      setTimeout(() => {
        textarea.focus();
        textarea.setSelectionRange(
          start + startChar.length,
          end + startChar.length
        );
      }, 0);
    }
  };
  
  const insertList = (ordered: boolean) => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    
    const { start, end, text } = getSelection();
    const lines = text.split("\n");
    const prefix = ordered ? (index: number) => `${index + 1}. ` : () => "- ";
    
    // Format each line with the appropriate list marker
    const formattedLines = lines.map((line, index) => {
      // Check if the line is already a list item and if it's the same type
      const isOrderedList = /^\d+\.\s/.test(line);
      const isUnorderedList = /^-\s/.test(line);
      
      // If the line is already the same type of list, remove the marker
      if ((ordered && isOrderedList) || (!ordered && isUnorderedList)) {
        return line.replace(/^(\d+\.\s|-\s)/, "");
      }
      // If the line is a different type of list, replace the marker
      else if (isOrderedList || isUnorderedList) {
        return prefix(index) + line.replace(/^(\d+\.\s|-\s)/, "");
      }
      // Otherwise, add the marker
      else {
        return prefix(index) + line;
      }
    });
    
    const newText = formattedLines.join("\n");
    const newValue = value.substring(0, start) + newText + value.substring(end);
    
    onChange(newValue);
    
    // Reset selection
    setTimeout(() => {
      textarea.focus();
      const newSelectionEnd = start + newText.length;
      textarea.setSelectionRange(start, newSelectionEnd);
    }, 0);
  };

  const handleBold = () => replaceSelection("**");
  const handleItalic = () => replaceSelection("*");
  const handleUnorderedList = () => insertList(false);
  const handleOrderedList = () => insertList(true);

  return (
    <div className="space-y-2">
      <TooltipProvider>
        <div className="flex justify-start bg-muted/20 p-1 rounded-md">
          <ToggleGroup type="multiple" className="flex-wrap">
            <Tooltip>
              <TooltipTrigger asChild>
                <ToggleGroupItem value="bold" aria-label="Gras" onClick={handleBold}>
                  <Bold size={16} />
                </ToggleGroupItem>
              </TooltipTrigger>
              <TooltipContent>
                <p>Gras (Ctrl+B)</p>
              </TooltipContent>
            </Tooltip>
            
            <Tooltip>
              <TooltipTrigger asChild>
                <ToggleGroupItem value="italic" aria-label="Italique" onClick={handleItalic}>
                  <Italic size={16} />
                </ToggleGroupItem>
              </TooltipTrigger>
              <TooltipContent>
                <p>Italique (Ctrl+I)</p>
              </TooltipContent>
            </Tooltip>
            
            <Tooltip>
              <TooltipTrigger asChild>
                <ToggleGroupItem value="unordered-list" aria-label="Liste à puces" onClick={handleUnorderedList}>
                  <List size={16} />
                </ToggleGroupItem>
              </TooltipTrigger>
              <TooltipContent>
                <p>Liste à puces</p>
              </TooltipContent>
            </Tooltip>
            
            <Tooltip>
              <TooltipTrigger asChild>
                <ToggleGroupItem value="ordered-list" aria-label="Liste numérotée" onClick={handleOrderedList}>
                  <ListOrdered size={16} />
                </ToggleGroupItem>
              </TooltipTrigger>
              <TooltipContent>
                <p>Liste numérotée</p>
              </TooltipContent>
            </Tooltip>
          </ToggleGroup>
        </div>
      </TooltipProvider>
      
      <Textarea
        ref={textareaRef}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={`min-h-[400px] resize-y font-mono ${className}`}
        onKeyDown={(e) => {
          // Handle keyboard shortcuts
          if (e.ctrlKey || e.metaKey) {
            switch (e.key.toLowerCase()) {
              case 'b':
                e.preventDefault();
                handleBold();
                break;
              case 'i':
                e.preventDefault();
                handleItalic();
                break;
            }
          }
        }}
      />
    </div>
  );
};

export default MarkdownEditor;
