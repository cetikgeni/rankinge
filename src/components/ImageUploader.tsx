
import { useState } from 'react';
import { Upload, Image as ImageIcon, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter
} from '@/components/ui/dialog';
import { toast } from 'sonner';

interface ImageUploaderProps {
  onImageUploaded: (url: string) => void;
}

const ImageUploader = ({ onImageUploaded }: ImageUploaderProps) => {
  const [isAIDialogOpen, setIsAIDialogOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [prompt, setPrompt] = useState('');
  const [generatedImages, setGeneratedImages] = useState<string[]>([]);
  
  // This is a mock function - in a real app, this would upload to your storage
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    
    // For demo purposes, we'll use a URL.createObjectURL
    // In a real app, you'd upload this to a storage service
    const file = files[0];
    
    // Check if the file is an image
    if (!file.type.startsWith('image/')) {
      toast.error('Please upload an image file');
      return;
    }
    
    // Check file size (limit to 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size should be less than 5MB');
      return;
    }
    
    // Create a URL for the file
    const imageUrl = URL.createObjectURL(file);
    onImageUploaded(imageUrl);
    toast.success('Image uploaded successfully');
  };
  
  // Mock function to generate AI images
  const generateAIImage = () => {
    if (!prompt.trim()) {
      toast.error('Please enter a prompt');
      return;
    }
    
    setIsGenerating(true);
    
    // Simulate API call with a delay
    setTimeout(() => {
      // Sample image URLs - in a real app, these would come from an AI service
      const sampleImages = [
        'https://images.unsplash.com/photo-1649972904349-6e44c42644a7?w=600&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=600&auto=format&fit=crop'
      ];
      
      setGeneratedImages(sampleImages);
      setIsGenerating(false);
    }, 2000);
  };
  
  const selectGeneratedImage = (imageUrl: string) => {
    onImageUploaded(imageUrl);
    setIsAIDialogOpen(false);
    setGeneratedImages([]);
    setPrompt('');
    toast.success('AI image selected');
  };
  
  return (
    <div className="flex gap-2">
      <div className="relative">
        <Input
          type="file"
          id="image-upload"
          accept="image/*"
          onChange={handleFileUpload}
          className="absolute inset-0 opacity-0 cursor-pointer"
        />
        <Button
          type="button"
          variant="outline"
          className="w-full flex items-center gap-2"
        >
          <Upload className="h-4 w-4" />
          Upload Image
        </Button>
      </div>
      
      <Dialog open={isAIDialogOpen} onOpenChange={setIsAIDialogOpen}>
        <DialogTrigger asChild>
          <Button
            type="button"
            variant="outline"
            className="flex items-center gap-2"
          >
            <Sparkles className="h-4 w-4" />
            Generate with AI
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Generate Image with AI</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="flex gap-2">
              <Input
                placeholder="Describe the image you want to generate..."
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
              />
              <Button
                onClick={generateAIImage}
                disabled={isGenerating || !prompt.trim()}
              >
                {isGenerating ? 'Generating...' : 'Generate'}
              </Button>
            </div>
            
            {generatedImages.length > 0 && (
              <div className="grid grid-cols-2 gap-4 mt-4">
                {generatedImages.map((image, index) => (
                  <div 
                    key={index}
                    className="border rounded-md overflow-hidden cursor-pointer hover:border-brand-green transition-colors"
                    onClick={() => selectGeneratedImage(image)}
                  >
                    <img 
                      src={image} 
                      alt={`Generated ${index + 1}`} 
                      className="w-full h-32 object-cover"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
          
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsAIDialogOpen(false);
                setGeneratedImages([]);
                setPrompt('');
              }}
            >
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ImageUploader;
