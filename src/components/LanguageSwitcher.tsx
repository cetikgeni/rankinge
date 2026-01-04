import { useTranslation } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Globe } from 'lucide-react';

const LanguageSwitcher = () => {
  const { language, toggleLanguage } = useTranslation();

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={toggleLanguage}
      className="text-foreground/80 hover:text-primary flex items-center gap-1.5 font-medium"
      title={language === 'en' ? 'Switch to Indonesian' : 'Ganti ke Bahasa Inggris'}
    >
      <Globe className="h-4 w-4" />
      <span className="uppercase">{language}</span>
    </Button>
  );
};

export default LanguageSwitcher;
