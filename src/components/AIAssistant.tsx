
import { useState } from 'react';
import { Sparkles, Send, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Input } from '@/components/ui/input';

interface AIAssistantProps {
  onSuggestion: (suggestion: string) => void;
  fieldType: 'category' | 'description' | 'item' | 'completeCategory';
  currentValue?: string;
  onCategoryWithItems?: (data: {
    name: string;
    description: string;
    items: Array<{name: string; description: string}>
  }) => void;
}

const AIAssistant = ({ onSuggestion, fieldType, currentValue, onCategoryWithItems }: AIAssistantProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [completeSuggestions, setSuggestionsComplete] = useState<Array<{
    name: string;
    description: string;
    items: Array<{name: string; description: string}>
  }>>([]);

  const generateSuggestions = () => {
    setIsGenerating(true);
    
    // Simulate AI response with a delay
    setTimeout(() => {
      let generatedSuggestions: string[] = [];
      
      if (fieldType === 'category') {
        const keyword = prompt.toLowerCase().trim();
        if (keyword.includes('food') || keyword.includes('meal')) {
          generatedSuggestions = [
            "Best Breakfast Foods of All Time",
            "Top Fast Food Restaurants in the US",
            "Most Popular International Cuisines"
          ];
        } else if (keyword.includes('tech') || keyword.includes('gadget')) {
          generatedSuggestions = [
            "Best Smartphones of 2023",
            "Most Innovative Tech Gadgets",
            "Top Laptops for Professionals"
          ];
        } else if (keyword.includes('travel') || keyword.includes('vacation')) {
          generatedSuggestions = [
            "Most Beautiful Beach Destinations",
            "Best European Cities to Visit",
            "Top Adventure Travel Destinations"
          ];
        } else {
          generatedSuggestions = [
            "Best " + (prompt || "Items") + " of All Time",
            "Top " + (prompt || "Products") + " to Try in 2023",
            "Most Popular " + (prompt || "Options") + " Ranked"
          ];
        }
      } else if (fieldType === 'description') {
        const baseDescriptions = [
          `A comprehensive ranking of the most popular ${prompt || "items"} based on user reviews, expert opinions, and overall quality.`,
          `Discover the top-rated ${prompt || "options"} that provide the best experience, value, and satisfaction.`,
          `This category showcases the best ${prompt || "selections"} currently available, ranked by actual user experiences and critical acclaim.`
        ];
        generatedSuggestions = baseDescriptions;
      } else if (fieldType === 'item') {
        generatedSuggestions = [
          prompt + " - A top choice known for its exceptional quality and reliability.",
          prompt + " - Popular option that offers great value for the price.",
          prompt + " - Highly rated by users for its outstanding performance."
        ];
      } else if (fieldType === 'completeCategory') {
        // Generate complete category with items
        const categoryKeyword = prompt.toLowerCase().trim();
        let categoryData = [];
        
        if (categoryKeyword.includes('breakfast')) {
          categoryData = [{
            name: "Best Breakfast Foods",
            description: "A ranking of the most delicious and popular breakfast options that start your day right.",
            items: [
              {name: "Avocado Toast", description: "Creamy avocado spread on artisanal toast, often topped with eggs, spices, or vegetables."},
              {name: "Greek Yogurt with Honey", description: "Creamy protein-rich yogurt topped with sweet honey and optional fruits or nuts."},
              {name: "Breakfast Burrito", description: "Savory wrap filled with eggs, cheese, beans, and vegetables for a hearty start."},
              {name: "Oatmeal", description: "Nutritious whole grain cereal that can be customized with fruits, nuts, and sweeteners."},
              {name: "Eggs Benedict", description: "Poached eggs and ham on English muffin, topped with hollandaise sauce."}
            ]
          }];
        } else if (categoryKeyword.includes('smartphone') || categoryKeyword.includes('phone')) {
          categoryData = [{
            name: "Best Smartphones of 2023",
            description: "A comprehensive ranking of this year's top smartphones based on features, performance, and value.",
            items: [
              {name: "iPhone 14 Pro", description: "Apple's flagship model with advanced camera system and powerful A16 Bionic chip."},
              {name: "Samsung Galaxy S23 Ultra", description: "Premium Android device with exceptional display and versatile camera capabilities."},
              {name: "Google Pixel 7 Pro", description: "Known for its superior photography and clean Android experience."},
              {name: "OnePlus 11", description: "High-performance phone with fast charging and smooth interface at a competitive price."},
              {name: "Xiaomi 13 Pro", description: "Feature-packed smartphone with excellent battery life and camera quality."}
            ]
          }];
        } else if (categoryKeyword.includes('laptop') || categoryKeyword.includes('computer')) {
          categoryData = [{
            name: "Top Laptops for Professionals",
            description: "The highest-rated laptops for work and productivity, ranked by performance, build quality, and features.",
            items: [
              {name: "MacBook Pro 16\"", description: "Apple's premium laptop with M2 chip, beautiful display, and excellent battery life."},
              {name: "Dell XPS 15", description: "Powerful Windows laptop with outstanding build quality and InfinityEdge display."},
              {name: "Lenovo ThinkPad X1 Carbon", description: "Business-focused laptop known for its reliability, keyboard, and durability."},
              {name: "HP Spectre x360", description: "Versatile 2-in-1 with premium design and strong performance for professionals."},
              {name: "Microsoft Surface Laptop Studio", description: "Innovative design with flexible display and powerful specs for creative work."}
            ]
          }];
        } else if (categoryKeyword.includes('car') || categoryKeyword.includes('auto')) {
          categoryData = [{
            name: "Most Reliable Cars of 2023",
            description: "A ranking of the most dependable vehicles based on owner reports and expert evaluations.",
            items: [
              {name: "Toyota Camry", description: "Midsize sedan known for exceptional reliability and fuel efficiency."},
              {name: "Honda Civic", description: "Compact car with a reputation for durability and low maintenance costs."},
              {name: "Mazda CX-5", description: "Compact SUV that combines reliability with driving pleasure and premium feel."},
              {name: "Lexus ES", description: "Luxury sedan offering the comfort of a premium vehicle with Toyota's reliability."},
              {name: "Subaru Outback", description: "Versatile wagon with all-wheel drive and proven long-term dependability."}
            ]
          }];
        } else {
          // Generic category based on keyword
          categoryData = [{
            name: `Top ${categoryKeyword || "Items"} of 2023`,
            description: `A comprehensive ranking of the best ${categoryKeyword || "products"} currently available, based on quality, performance, and value.`,
            items: [
              {name: `Premium ${categoryKeyword || "Item"} A`, description: `High-end option known for exceptional quality and features.`},
              {name: `Popular ${categoryKeyword || "Item"} B`, description: `Widely used choice with a great balance of performance and value.`},
              {name: `Budget-friendly ${categoryKeyword || "Item"} C`, description: `Affordable option that doesn't compromise on essential features.`},
              {name: `Professional ${categoryKeyword || "Item"} D`, description: `Designed for expert users with advanced capabilities.`},
              {name: `Innovative ${categoryKeyword || "Item"} E`, description: `Cutting-edge design with unique features not found in competitors.`}
            ]
          }];
        }
        
        setSuggestionsComplete(categoryData);
      }
      
      if (fieldType !== 'completeCategory') {
        setSuggestions(generatedSuggestions);
      }
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

  const applyCompleteSuggestion = (suggestion: {
    name: string;
    description: string;
    items: Array<{name: string; description: string}>
  }) => {
    if (onCategoryWithItems) {
      onCategoryWithItems(suggestion);
      setIsOpen(false);
      setPrompt('');
      setSuggestionsComplete([]);
    }
  };

  let placeholderText = "What kind of category would you like to create?";
  let buttonLabel = "Generate category ideas";
  
  if (fieldType === 'description') {
    placeholderText = "Describe the category you'd like help writing about...";
    buttonLabel = "Generate description";
  } else if (fieldType === 'item') {
    placeholderText = "What kind of item are you adding?";
    buttonLabel = "Generate item details";
  } else if (fieldType === 'completeCategory') {
    placeholderText = "Enter a keyword like 'smartphones' or 'breakfast'...";
    buttonLabel = "Generate complete category";
  }

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button 
          variant="outline" 
          size="sm" 
          className={`h-8 gap-1 text-brand-purple border-brand-purple/30 hover:bg-brand-purple/10 ${fieldType === 'completeCategory' ? 'w-full' : ''}`}
        >
          <Sparkles className="h-3.5 w-3.5" />
          {fieldType === 'completeCategory' ? 'Generate Complete Category with Items' : 'AI Assist'}
        </Button>
      </PopoverTrigger>
      <PopoverContent className={`${fieldType === 'completeCategory' ? 'w-[450px]' : 'w-80'} p-0`} align="end">
        <Card className="border-0 shadow-none">
          <CardHeader className="py-3 px-4">
            <CardTitle className="text-sm font-medium flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <Sparkles className="h-4 w-4 text-brand-purple" />
                {fieldType === 'completeCategory' ? 'AI Category Generator' : 'AI Assistant'}
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
              {fieldType === 'completeCategory' ? (
                <Input
                  placeholder={placeholderText}
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                />
              ) : (
                <Textarea
                  placeholder={placeholderText}
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  className="min-h-24 text-sm"
                />
              )}
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

            {completeSuggestions.length > 0 && (
              <div className="mt-4 space-y-3">
                <h4 className="text-xs font-medium text-gray-500">Complete category suggestions:</h4>
                <div className="space-y-3 max-h-[300px] overflow-y-auto">
                  {completeSuggestions.map((suggestion, index) => (
                    <div 
                      key={index} 
                      className="bg-gray-50 p-3 rounded-md text-sm cursor-pointer hover:bg-gray-100"
                      onClick={() => applyCompleteSuggestion(suggestion)}
                    >
                      <div className="font-medium mb-1">{suggestion.name}</div>
                      <div className="text-xs text-gray-600 mb-2">{suggestion.description}</div>
                      <div className="text-xs text-gray-500">Items: {suggestion.items.length}</div>
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
