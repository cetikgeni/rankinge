import { Link } from 'react-router-dom';
import { useTranslation } from '@/contexts/LanguageContext';

const Footer = () => {
  const { t, language } = useTranslation();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="py-8 px-4 bg-card border-t">
      <div className="container mx-auto max-w-7xl">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link to="/" className="text-xl font-bold text-primary mb-4 block">
              Rankinge
            </Link>
            <p className="text-sm text-muted-foreground">
              {language === 'id' 
                ? 'Platform peringkat berbasis komunitas dengan voting transparan.' 
                : 'Community-driven ranking platform with transparent voting.'}
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-3 text-foreground">
              {language === 'id' ? 'Tautan Cepat' : 'Quick Links'}
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/categories" className="text-muted-foreground hover:text-primary transition-colors">
                  {t('nav.categories')}
                </Link>
              </li>
              <li>
                <Link to="/blog" className="text-muted-foreground hover:text-primary transition-colors">
                  {t('nav.blog')}
                </Link>
              </li>
              <li>
                <Link to="/submit" className="text-muted-foreground hover:text-primary transition-colors">
                  {t('nav.submit')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-semibold mb-3 text-foreground">
              {language === 'id' ? 'Perusahaan' : 'Company'}
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/about" className="text-muted-foreground hover:text-primary transition-colors">
                  {language === 'id' ? 'Tentang Kami' : 'About Us'}
                </Link>
              </li>
              <li>
                <Link to="/faq" className="text-muted-foreground hover:text-primary transition-colors">
                  FAQ
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-muted-foreground hover:text-primary transition-colors">
                  {language === 'id' ? 'Hubungi Kami' : 'Contact Us'}
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-semibold mb-3 text-foreground">
              {language === 'id' ? 'Legal' : 'Legal'}
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/terms" className="text-muted-foreground hover:text-primary transition-colors">
                  {language === 'id' ? 'Syarat Layanan' : 'Terms of Service'}
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="text-muted-foreground hover:text-primary transition-colors">
                  {language === 'id' ? 'Kebijakan Privasi' : 'Privacy Policy'}
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t pt-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">
            &copy; {currentYear} Rankinge. {t('footer.rights')}
          </p>
          <p className="text-xs text-muted-foreground italic">
            {t('footer.affiliate')}
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
