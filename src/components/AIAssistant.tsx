
import { useState } from 'react';
import { Sparkles, Send, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

interface AIAssistantProps {
  onSuggestion: (suggestion: string) => void;
  fieldType: 'category' | 'description' | 'item';
  currentValue?: string;
}

const AIAssistant = ({ onSuggestion, fieldType, currentValue }: AIAssistantProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);

  const generateSuggestions = () => {
    setIsGenerating(true);
    
    // Simulate AI response with a delay
    setTimeout(() => {
      let generatedSuggestions: string[] = [];
      
      if (fieldType === 'category') {
        generatedSuggestions = [
          "Best Hiking Trails in National Parks",
          "Top Sci-Fi TV Shows of the Last Decade",
          "Most Influential Tech Gadgets of All Time"
        ];
      } else if (fieldType === 'description') {
        generatedSuggestions = [
          "A comprehensive ranking of the most scenic and memorable hiking trails found within the US National Park system, based on difficulty, views, and overall experience.",
          "This category ranks the most innovative and influential technological devices that have shaped modern society and changed how we live, work, and communicate.",
          "Discover the top-rated coffee brands that provide the perfect balance of flavor, aroma, and value for your morning brew."
        ];
      } else if (fieldType === 'item') {
        generatedSuggestions = [
          "MacBook Pro - Apple's professional-grade laptop known for its powerful performance, stunning Retina display, and sleek aluminum design.",
          "Netflix - The leading streaming platform offering a vast library of movies, TV shows, and original content for a monthly subscription fee.",
          "Spotify - A digital music service that gives you access to millions of songs, podcasts and videos from artists all over the world."
        ];
      }
      
      setSuggestions(generatedSuggestions);
      setIsGenerating(false);
    }, 1500);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;
    
    generateSuggestions();
  };

  const applySuggestion = (suggestion: string) => {
    onSuggestion(suggestion);
    setIsOpen(false);
    setPrompt('');
    setSuggestions([]);
  };

  let placeholderText = "What kind of category would you like to create?";
  let buttonLabel = "Generate category ideas";
  
  if (fieldType === 'description') {
    placeholderText = "Describe the category you'd like help writing about...";
    buttonLabel = "Generate description";
  } else if (fieldType === 'item') {
    placeholderText = "What kind of item are you adding?";
    buttonLabel = "Generate item details";
  }

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button 
          variant="outline" 
          size="sm" 
          className="h-8 gap-1 text-brand-purple border-brand-purple/30 hover:bg-brand-purple/10"
        >
          <Sparkles className="h-3.5 w-3.5" />
          AI Assist
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end">
        <Card className="border-0 shadow-none">
          <CardHeader className="py-3 px-4">
            <CardTitle className="text-sm font-medium flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <Sparkles className="h-4 w-4 text-brand-purple" />
                AI Assistant
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0 rounded-full"
                onClick={() => setIsOpen(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent className="px-4 py-2">
            <form onSubmit={handleSubmit} className="space-y-3">
              <Textarea
                placeholder={placeholderText}
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                className="min-h-24 text-sm"
              />
              <Button 
                type="submit" 
                className="w-full gap-1.5 bg-brand-purple hover:bg-brand-purple/90"
                disabled={isGenerating || !prompt.trim()}
              >
                {isGenerating ? 'Generating...' : buttonLabel}
                {!isGenerating && <Send className="h-3.5 w-3.5" />}
              </Button>
            </form>
            
            {suggestions.length > 0 && (
              <div className="mt-4 space-y-3">
                <h4 className="text-xs font-medium text-gray-500">Suggestions:</h4>
                <div className="space-y-2">
                  {suggestions.map((suggestion, index) => (
                    <div 
                      key={index} 
                      className="bg-gray-50 p-2 rounded-md text-sm cursor-pointer hover:bg-gray-100"
                      onClick={() => applySuggestion(suggestion)}
                    >
                      {suggestion}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
          <CardFooter className="px-4 py-2 text-xs text-gray-500 border-t">
            AI suggestions are for demonstration purposes only
          </CardFooter>
        </Card>
      </PopoverContent>
    </Popover>
  );
};

export default AIAssistant;
