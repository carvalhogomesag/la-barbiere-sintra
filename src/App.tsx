import React, { useState, useEffect } from 'react';
import { 
  Scissors, MapPin, Phone, Clock, Star, 
  CheckCircle2, Quote, ArrowRight, ShieldCheck, 
  Heart, Users, ExternalLink, Camera, Sparkles, Loader2,
  Instagram, Facebook, Music2
} from 'lucide-react';

// FIREBASE
import { db } from './firebase';
import { collection, query, orderBy, onSnapshot, doc } from 'firebase/firestore';

// COMPONENTES
import Navbar from './components/Navbar';
import BookingModal from './components/BookingModal';
import AdminLogin from './components/AdminLogin';
import AdminDashboard from './components/AdminDashboard';

// DADOS E CONSTANTES
import { BUSINESS_INFO, REVIEWS, GALLERY_IMAGES, CLIENT_ID } from './constants';
import { Service, SocialLinks } from './types';
import mapaImg from './assets/images/mapa-localizacao.webp'; 

const MAP_SOURCE = mapaImg;

const App: React.FC = () => {
  // --- ESTADOS DE CONTROLO ---
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [isAdminLoginOpen, setIsAdminLoginOpen] = useState(false);
  const [isDashboardOpen, setIsDashboardOpen] = useState(false);

  // --- ESTADOS DE DADOS DINÂMICOS ---
  const [dynamicServices, setDynamicServices] = useState<Service[]>([]);
  const [loadingServices, setLoadingServices] = useState(true);
  
  // Metadados Visuais (Redes Sociais e Fotos do Firestore/Storage)
  const [visualMetadata, setVisualMetadata] = useState<{
    socialLinks?: SocialLinks;
    galleryUrls?: string[];
  }>({});

  // 1. ESCUTAR SERVIÇOS
  useEffect(() => {
    const q = query(
      collection(db, "businesses", CLIENT_ID, "services"), 
      orderBy("name", "asc")
    );
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const servicesList = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Service));
      setDynamicServices(servicesList);
      setLoadingServices(false);
    });
    return () => unsubscribe();
  }, []);

  // 2. ESCUTAR METADADOS (Fotos e Redes Sociais)
  useEffect(() => {
    const unsubMetadata = onSnapshot(doc(db, "businesses", CLIENT_ID, "config", "metadata"), (snap) => {
      if (snap.exists()) {
        setVisualMetadata(snap.data());
      }
    });
    return () => unsubMetadata();
  }, []);

  // FUNÇÃO MESTRE DE IMAGENS: 
  // Prioriza o que o utilizador carregou no Admin. 
  // Se estiver vazio, usa a foto padrão do constants.tsx
  const getDynamicImg = (index: number) => {
    if (visualMetadata.galleryUrls && visualMetadata.galleryUrls[index]) {
      return visualMetadata.galleryUrls[index];
    }
    // Fallback para as fotos locais se o cliente ainda não fez upload
    return GALLERY_IMAGES[index]?.url;
  };

  return (
    <div className="min-h-screen flex flex-col selection:bg-emerald-600/30 selection:text-emerald-900 bg-stone-50">
      
      <Navbar onAdminClick={() => setIsAdminLoginOpen(true)} />

      <AdminLogin 
        isOpen={isAdminLoginOpen} 
        onClose={() => setIsAdminLoginOpen(false)} 
        onLoginSuccess={() => setIsDashboardOpen(true)}
      />
      
      {isDashboardOpen && (
        <AdminDashboard onLogout={() => setIsDashboardOpen(false)} />
      )}

      <BookingModal 
        isOpen={isBookingOpen} 
        onClose={() => setIsBookingOpen(false)} 
      />

      {/* HERO SECTION - Usa Foto do Slot 1 (Index 0) */}
      <section id="inicio" className="relative min-h-[90vh] md:min-h-[95vh] flex items-center justify-center overflow-hidden bg-stone-900">
        <div className="absolute inset-0 z-0">
          <img 
            src={getDynamicImg(0)} 
            alt={BUSINESS_INFO.name} 
            className="w-full h-full object-cover opacity-40 scale-105" 
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-stone-900/90 to-stone-900"></div> 
        </div>

        <div className="container mx-auto px-4 relative z-10 pt-24 md:pt-20">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex flex-wrap justify-center items-center gap-2 bg-emerald-600/10 border border-emerald-600/20 px-4 py-2 rounded-full mb-8 animate-fade-in text-emerald-500">
              <Star size={14} fill="currentColor" />
              <span className="text-xs font-bold uppercase tracking-[0.2em]">O Teu Espaço de Confiança em Sintra</span>
            </div>
            
            <h2 className="font-serif text-5xl md:text-8xl font-bold mb-8 leading-[1.1] text-white tracking-tight uppercase">
              {BUSINESS_INFO.name} <br />
              <span className="text-emerald-600 italic">{BUSINESS_INFO.subName}</span>
            </h2>
            
            <p className="text-stone-400 text-lg md:text-2xl max-w-2xl mx-auto mb-12 font-light">
              Elevamos o conceito de barbearia em Sintra. Profissionalismo, brio e um ambiente exclusivo para o homem moderno.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-5 justify-center px-4">
              <button 
                onClick={() => setIsBookingOpen(true)}
                className="bg-emerald-600 hover:bg-emerald-700 text-white px-10 py-5 rounded-full text-lg font-bold transition-all flex items-center justify-center gap-3 shadow-xl shadow-emerald-900/20 group"
              >
                Reservar Agora <ArrowRight className="group-hover:translate-x-1 transition-transform" />
              </button>
              <a href="#servicos" className="bg-white/5 border border-white/10 text-white px-10 py-5 rounded-full text-lg font-bold hover:bg-white/10 transition-all shadow-sm">Ver Serviços</a>
            </div>
          </div>
        </div>
      </section>

      {/* HIGHLIGHTS */}
      <section className="py-16 md:py-24 bg-white relative overflow-hidden">
        <div className="container mx-auto px-4 text-center">
          <div className="grid md:grid-cols-3 gap-12">
            {[
              { icon: ShieldCheck, title: "Brio & Perfeição", text: "Cada corte é uma obra de arte executada com o máximo rigor." },
              { icon: Users, title: "Atendimento Premium", text: "Um espaço pensado para o conforto do homem moderno." },
              { icon: Sparkles, title: "Arte de Barbear", text: "Tradição e modernidade unidas no coração de Sintra." }
            ].map((item, index) => (
              <div key={index} className="group">
                <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-600 mx-auto mb-6 group-hover:scale-110 transition-transform">
                  <item.icon size={28} />
                </div>
                <h3 className="text-xl font-bold font-serif text-stone-800 mb-3">{item.title}</h3>
                <p className="text-stone-500 leading-relaxed text-sm">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SERVIÇOS DINÂMICOS */}
      <section id="servicos" className="py-20 md:py-32 bg-stone-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h4 className="text-emerald-600 text-sm font-bold uppercase tracking-[0.4em] mb-4">A Nossa Arte</h4>
            <h2 className="font-serif text-4xl md:text-6xl font-bold text-stone-900">Serviços Exclusivos</h2>
          </div>

          {loadingServices ? (
            <div className="flex justify-center py-20"><Loader2 className="animate-spin text-emerald-600" size={40} /></div>
          ) : (
            <div className="grid md:grid-cols-2 gap-x-16 gap-y-12 max-w-5xl mx-auto">
              {dynamicServices.map((s) => (
                <div key={s.id} onClick={() => setIsBookingOpen(true)} className="group border-b border-stone-200 pb-8 hover:border-emerald-300 transition-all cursor-pointer">
                  <div className="flex justify-between items-end mb-4">
                    <h3 className="text-2xl font-bold font-serif text-stone-800 group-hover:text-emerald-700 transition-colors">{s.name}</h3>
                    <span className="text-emerald-600 font-bold">{s.price}</span>
                  </div>
                  <p className="text-stone-500 text-sm italic">{s.description}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* SOBRE - Usa Foto do Slot 5 (Index 4) */}
      <section id="sobre" className="py-20 md:py-32 bg-white overflow-hidden">
        <div className="container mx-auto px-4 grid lg:grid-cols-2 gap-16 items-center">
            <div className="relative">
              <div className="relative z-10 rounded-[3rem] overflow-hidden shadow-2xl aspect-[4/5] border-8 border-stone-100">
                <img src={getDynamicImg(4)} alt="Sobre Nós" className="w-full h-full object-cover" />
              </div>
              <div className="absolute -bottom-8 -left-8 bg-stone-900 text-white p-8 rounded-3xl max-w-xs shadow-2xl z-20 hidden md:block">
                <Quote className="text-emerald-500 mb-4" size={32} />
                <p className="font-medium italic text-lg leading-snug">"{REVIEWS[1].text}"</p>
                <p className="text-emerald-500 text-xs mt-4 uppercase font-bold tracking-widest">{REVIEWS[1].author}</p>
              </div>
            </div>
            <div className="text-left">
              <h2 className="font-serif text-4xl md:text-6xl font-bold mb-8 text-stone-900">
                {BUSINESS_INFO.name} <br /><span className="text-emerald-600 italic">Paixão pelo Detalhe</span>
              </h2>
              <div className="space-y-6 text-stone-600 font-light text-lg">
                <p>No {BUSINESS_INFO.name}, acreditamos que cada cliente é único. O nosso espaço foi criado para oferecer brio, técnica e conforto.</p>
                <p>Com uma equipa focada nas tendências atuais, garantimos que sais da nossa cadeira com a tua melhor versão reforçada.</p>
              </div>
            </div>
        </div>
      </section>

      {/* GALERIA DE PORTFOLIO - Usa Slots 1 a 8 dinamicamente */}
      <section className="py-20 md:py-24 bg-stone-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
             <h2 className="font-serif text-3xl md:text-5xl font-bold text-stone-900 mb-4 italic">O Nosso Portfolio</h2>
             <p className="text-stone-500">Trabalhos reais e ambiente exclusivo.</p>
          </div>
          <div className="columns-2 md:columns-4 gap-4 md:gap-6 space-y-4 md:space-y-6">
            {[...Array(8)].map((_, idx) => (
              <div key={idx} className="rounded-2xl md:rounded-3xl overflow-hidden group break-inside-avoid shadow-sm bg-stone-200">
                <img 
                  src={getDynamicImg(idx)} 
                  alt={`Portfolio ${idx + 1}`} 
                  loading="lazy" 
                  className="w-full grayscale hover:grayscale-0 transition-all duration-700 hover:scale-110 cursor-pointer" 
                />
              </div>
            ))}

            {/* CARD SOCIAL DINÂMICO */}
            <div className="bg-stone-900 aspect-[3/4] rounded-2xl md:rounded-3xl flex flex-col items-center justify-center p-4 md:p-8 text-center group break-inside-avoid shadow-lg border border-white/5">
              <Camera size={32} className="text-emerald-500 mb-6" />
              <h4 className="text-white font-black text-lg md:text-xl leading-tight mb-6 uppercase">Redes Sociais</h4>
              <div className="flex gap-3">
                {visualMetadata.socialLinks?.instagram && (
                  <a href={visualMetadata.socialLinks.instagram} target="_blank" rel="noreferrer" className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center text-white hover:bg-emerald-700 transition-all">
                    <Instagram size={20} />
                  </a>
                )}
                {visualMetadata.socialLinks?.facebook && (
                  <a href={visualMetadata.socialLinks.facebook} target="_blank" rel="noreferrer" className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center text-white hover:bg-emerald-700 transition-all">
                    <Facebook size={20} />
                  </a>
                )}
                {visualMetadata.socialLinks?.tiktok && (
                  <a href={visualMetadata.socialLinks.tiktok} target="_blank" rel="noreferrer" className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center text-white hover:bg-emerald-700 transition-all">
                    <Music2 size={20} />
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SEÇÃO DO ESPAÇO - Usa Fotos dos Slots 6, 7 e 8 (Index 5, 6, 7) */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
             <div className="order-2 md:order-1 space-y-6 text-left">
                <h3 className="font-serif text-3xl md:text-4xl text-stone-900 italic">Um Espaço Pensado Para Ti</h3>
                <p className="text-stone-600 leading-relaxed text-lg">
                  O nosso salão foi desenhado para proporcionar o máximo conforto. Um ambiente masculino e acolhedor onde cada detalhe conta.
                </p>
                <div className="flex gap-4">
                   <div className="rounded-2xl overflow-hidden h-40 flex-1 border border-stone-100 shadow-sm">
                      <img src={getDynamicImg(5)} alt="Espaço" className="w-full h-full object-cover hover:scale-110 transition-transform duration-700" />
                   </div>
                   <div className="rounded-2xl overflow-hidden h-40 flex-1 border border-stone-100 shadow-sm">
                      <img src={getDynamicImg(6)} alt="Detalhes" className="w-full h-full object-cover hover:scale-110 transition-transform duration-700" />
                   </div>
                </div>
             </div>
             <div className="order-1 md:order-2 h-80 md:h-96 rounded-[3rem] overflow-hidden shadow-xl border-8 border-stone-50">
                <img src={getDynamicImg(7)} alt="Interior Barbearia" className="w-full h-full object-cover" />
             </div>
          </div>
        </div>
      </section>

      {/* CONTACTO */}
      <section id="contacto" className="py-20 bg-stone-50 text-left">
        <div className="container mx-auto px-4 grid lg:grid-cols-12 gap-16">
          <div className="lg:col-span-5 space-y-10">
            <h2 className="font-serif text-5xl font-bold text-stone-900 italic uppercase">Contacto</h2>
            <div className="space-y-8">
              <div className="flex gap-6">
                <div className="w-14 h-14 bg-white shadow-sm rounded-2xl flex items-center justify-center text-emerald-600 shrink-0"><MapPin size={28} /></div>
                <div><h4 className="text-stone-900 font-bold text-lg">Morada</h4><p className="text-stone-500">{BUSINESS_INFO.address}<br/>{BUSINESS_INFO.city}</p></div>
              </div>
              <div className="flex gap-6">
                <div className="w-14 h-14 bg-white shadow-sm rounded-2xl flex items-center justify-center text-emerald-600 shrink-0"><Clock size={28} /></div>
                <div><h4 className="text-stone-900 font-bold text-lg">Horário</h4><p className="text-stone-500">{BUSINESS_INFO.openingHours}</p></div>
              </div>
              <div className="flex gap-6">
                <div className="w-14 h-14 bg-white shadow-sm rounded-2xl flex items-center justify-center text-emerald-600 shrink-0"><Phone size={28} /></div>
                <div><h4 className="text-stone-900 font-bold text-lg">Telemóvel</h4><p className="text-stone-800 text-2xl font-bold">{BUSINESS_INFO.phone}</p></div>
              </div>
            </div>
          </div>
          <div className="lg:col-span-7 h-[500px] rounded-[3rem] overflow-hidden border-8 border-white shadow-xl relative group">
            <a href={BUSINESS_INFO.googleMapsUrl} target="_blank" rel="noreferrer" className="block w-full h-full">
              <img src={MAP_SOURCE} alt="Mapa" className="w-full h-full object-cover grayscale opacity-60 group-hover:grayscale-0 transition-all" />
              <div className="absolute inset-0 flex items-center justify-center bg-stone-900/10 opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="bg-emerald-600 text-white px-8 py-4 rounded-full font-bold shadow-xl">Abrir Google Maps</div>
              </div>
            </a>
          </div>
        </div>
      </section>

      <footer className="py-20 bg-stone-900 text-white text-center">
        <div className="flex flex-col items-center gap-6">
          <div className="flex items-center gap-3">
             <Scissors className="text-emerald-500" size={32} />
             <div className="text-left uppercase">
                <h1 className="font-serif text-2xl font-bold leading-none">{BUSINESS_INFO.name}</h1>
                <p className="text-[10px] tracking-[0.3em] text-emerald-500 font-bold">{BUSINESS_INFO.subName}</p>
             </div>
          </div>
          <p className="text-stone-500 text-xs uppercase tracking-widest">© 2026 {BUSINESS_INFO.name} • Sintra, Portugal</p>
        </div>
      </footer>
    </div>
  );
};

export default App;