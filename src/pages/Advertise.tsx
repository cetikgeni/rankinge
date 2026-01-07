import { useState } from 'react';
import { BadgeDollarSign, CheckCircle, DollarSign, ShoppingBag, Layers, ArrowRight, HelpCircle } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

const Advertise = () => {
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    company: '',
    email: '',
    phone: '',
    message: '',
  });
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim() || !formData.email.trim()) {
      toast.error('Mohon isi nama dan email');
      return;
    }

    setIsSubmitting(true);

    const { error } = await supabase.from('ad_requests').insert({
      name: formData.name.trim(),
      company: formData.company.trim() || null,
      email: formData.email.trim(),
      phone: formData.phone.trim() || null,
      message: formData.message.trim() || null,
      plan: selectedPlan,
    });

    if (error) {
      toast.error('Gagal mengirim permintaan. Coba lagi.');
      console.error(error);
    } else {
      toast.success('Permintaan berhasil dikirim!');
      setFormSubmitted(true);
    }

    setIsSubmitting(false);
  };

  const plans = [
    {
      id: 'basic',
      name: 'Basic',
      icon: ShoppingBag,
      price: 'Rp 500.000',
      period: '/bulan',
      description: 'Untuk bisnis kecil dan startup',
      features: [
        '1 Listing Produk Unggulan',
        'Dashboard Analitik Dasar',
        'Visibilitas 30 Hari',
      ],
      popular: false,
    },
    {
      id: 'premium',
      name: 'Premium',
      icon: BadgeDollarSign,
      price: 'Rp 1.500.000',
      period: '/bulan',
      description: 'Untuk bisnis yang berkembang',
      features: [
        '3 Listing Produk Unggulan',
        'Dashboard Analitik Lengkap',
        'Visibilitas 60 Hari',
        'Sponsor Kategori',
      ],
      popular: true,
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      icon: Layers,
      price: 'Rp 4.500.000',
      period: '/bulan',
      description: 'Untuk organisasi besar',
      features: [
        '10 Listing Produk Unggulan',
        'Dashboard Analitik Premium',
        'Visibilitas 90 Hari',
        'Sponsor Multi-Kategori',
        'Account Manager Khusus',
      ],
      popular: false,
    },
  ];

  const steps = [
    {
      step: 1,
      title: 'Pilih Paket',
      description: 'Pilih paket iklan yang sesuai dengan kebutuhan dan anggaran bisnis Anda.',
    },
    {
      step: 2,
      title: 'Isi Formulir',
      description: 'Lengkapi formulir permintaan dengan informasi bisnis dan kebutuhan iklan Anda.',
    },
    {
      step: 3,
      title: 'Konfirmasi Tim',
      description: 'Tim kami akan menghubungi Anda dalam 1-2 hari kerja untuk konfirmasi.',
    },
    {
      step: 4,
      title: 'Mulai Beriklan',
      description: 'Setelah pembayaran, iklan Anda akan segera tayang di platform kami.',
    },
  ];

  const faqs = [
    {
      question: 'Berapa lama proses persetujuan iklan?',
      answer: 'Proses persetujuan biasanya memakan waktu 1-2 hari kerja setelah pembayaran dikonfirmasi.',
    },
    {
      question: 'Apakah saya bisa mengubah konten iklan?',
      answer: 'Ya, Anda dapat meminta perubahan konten iklan kapan saja dengan menghubungi tim kami.',
    },
    {
      question: 'Metode pembayaran apa yang diterima?',
      answer: 'Kami menerima transfer bank, e-wallet (GoPay, OVO, Dana), dan kartu kredit.',
    },
    {
      question: 'Apakah ada garansi pengembalian dana?',
      answer: 'Kami menawarkan garansi uang kembali 7 hari jika Anda tidak puas dengan layanan kami.',
    },
  ];
  
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      
      <main className="flex-grow py-10 px-4">
        <div className="container mx-auto max-w-6xl">
          {/* Hero */}
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">Beriklan Bersama Kami</h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Jangkau ribuan pengguna yang aktif mencari produk dan layanan di kategori Anda. 
              Tingkatkan visibilitas bisnis Anda dengan iklan di Rankinge.
            </p>
          </div>

          {/* How It Works */}
          <section className="mb-16">
            <h2 className="text-2xl font-bold mb-8 text-center text-foreground">Cara Beriklan</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {steps.map((step, index) => (
                <div key={step.step} className="relative">
                  <Card className="h-full">
                    <CardContent className="pt-6 text-center">
                      <div className="bg-primary text-primary-foreground rounded-full w-10 h-10 flex items-center justify-center mx-auto mb-4 font-bold">
                        {step.step}
                      </div>
                      <h3 className="font-semibold mb-2">{step.title}</h3>
                      <p className="text-sm text-muted-foreground">{step.description}</p>
                    </CardContent>
                  </Card>
                  {index < steps.length - 1 && (
                    <ArrowRight className="hidden md:block absolute top-1/2 -right-3 transform -translate-y-1/2 text-muted-foreground" />
                  )}
                </div>
              ))}
            </div>
          </section>
          
          {/* Pricing Section */}
          <section className="mb-16">
            <h2 className="text-2xl font-bold mb-8 text-center text-foreground">Pilih Paket Iklan</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {plans.map((plan) => (
                <Card 
                  key={plan.id} 
                  className={`border-2 cursor-pointer transition-all ${
                    plan.popular ? 'border-primary' : 'border-border'
                  } ${selectedPlan === plan.id ? 'ring-2 ring-primary ring-offset-2' : ''}`}
                  onClick={() => setSelectedPlan(plan.id)}
                >
                  <CardHeader>
                    {plan.popular && (
                      <div className="px-3 py-1 bg-primary text-primary-foreground text-xs font-bold rounded-full w-fit mb-2">
                        POPULER
                      </div>
                    )}
                    <CardTitle className="flex items-center">
                      <plan.icon className="mr-2 h-5 w-5 text-primary" />
                      {plan.name}
                    </CardTitle>
                    <CardDescription>{plan.description}</CardDescription>
                    <div className="mt-4">
                      <span className="text-3xl font-bold">{plan.price}</span>
                      <span className="text-muted-foreground">{plan.period}</span>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {plan.features.map((feature, idx) => (
                        <li key={idx} className="flex items-start">
                          <CheckCircle className="h-5 w-5 text-green-500 mr-2 shrink-0" />
                          <span className="text-sm">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                  <CardFooter>
                    <Button 
                      variant={plan.popular ? 'default' : 'outline'} 
                      className="w-full"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedPlan(plan.id);
                        document.getElementById('contact-form')?.scrollIntoView({ behavior: 'smooth' });
                      }}
                    >
                      Pilih Paket
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </section>
          
          {/* Contact Form */}
          <section id="contact-form" className="mb-16">
            <div className="max-w-2xl mx-auto">
              <Card>
                <CardHeader>
                  <CardTitle>Ajukan Permintaan Iklan</CardTitle>
                  <CardDescription>
                    {selectedPlan 
                      ? `Paket terpilih: ${plans.find(p => p.id === selectedPlan)?.name}` 
                      : 'Pilih paket di atas atau isi formulir untuk konsultasi'}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {formSubmitted ? (
                    <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-md p-6 text-center">
                      <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
                      <h3 className="text-xl font-bold text-green-800 dark:text-green-200 mb-2">Terima Kasih!</h3>
                      <p className="text-green-700 dark:text-green-300">
                        Permintaan Anda telah berhasil dikirim. Tim kami akan menghubungi Anda dalam 1-2 hari kerja.
                      </p>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label htmlFor="name" className="block text-sm font-medium mb-1">
                            Nama *
                          </label>
                          <Input 
                            id="name" 
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            placeholder="Nama Anda" 
                            required 
                          />
                        </div>
                        <div>
                          <label htmlFor="company" className="block text-sm font-medium mb-1">
                            Perusahaan
                          </label>
                          <Input 
                            id="company" 
                            value={formData.company}
                            onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                            placeholder="Nama perusahaan" 
                          />
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label htmlFor="email" className="block text-sm font-medium mb-1">
                            Email *
                          </label>
                          <Input 
                            id="email" 
                            type="email" 
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            placeholder="email@contoh.com" 
                            required 
                          />
                        </div>
                        <div>
                          <label htmlFor="phone" className="block text-sm font-medium mb-1">
                            Telepon
                          </label>
                          <Input 
                            id="phone" 
                            value={formData.phone}
                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                            placeholder="08123456789" 
                          />
                        </div>
                      </div>
                      
                      <div>
                        <label htmlFor="message" className="block text-sm font-medium mb-1">
                          Kebutuhan Iklan Anda
                        </label>
                        <Textarea 
                          id="message" 
                          value={formData.message}
                          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                          placeholder="Jelaskan produk/layanan dan tujuan iklan Anda" 
                          rows={4}
                        />
                      </div>
                      
                      <Button 
                        type="submit" 
                        className="w-full" 
                        disabled={isSubmitting}
                      >
                        <DollarSign className="mr-2 h-4 w-4" />
                        {isSubmitting ? 'Mengirim...' : 'Kirim Permintaan Iklan'}
                      </Button>
                    </form>
                  )}
                </CardContent>
              </Card>
            </div>
          </section>

          {/* FAQ */}
          <section className="max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold mb-6 text-center text-foreground flex items-center justify-center gap-2">
              <HelpCircle className="h-6 w-6" />
              Pertanyaan Umum
            </h2>
            <Accordion type="single" collapsible className="w-full">
              {faqs.map((faq, index) => (
                <AccordionItem key={index} value={`item-${index}`}>
                  <AccordionTrigger className="text-left">{faq.question}</AccordionTrigger>
                  <AccordionContent>{faq.answer}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </section>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Advertise;
