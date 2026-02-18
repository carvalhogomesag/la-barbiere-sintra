import React, { useState, useEffect } from 'react';
import { 
  Scissors, MapPin, Phone, Clock, Star, 
  CheckCircle2, Quote, ArrowRight, ShieldCheck, 
  Heart, Users, ExternalLink, Camera, Sparkles, Loader2
} from 'lucide-react';

// FIREBASE
import { db } from './firebase';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';

// COMPONENTES
import Navbar from './components/Navbar';
import BookingModal from './components/BookingModal';
import AdminLogin from './components/AdminLogin';
import AdminDashboard from './components/AdminDashboard';

// DADOS E IMAGENS (Utilizando a nova estrutura GALLERY_IMAGES)
import { BUSINESS_INFO, REVIEWS, GALLERY_IMAGES, CLIENT_ID } from './constants';
import { Service } from './types';
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

  // --- ESCUTAR SERVIÇOS DO FIREBASE (Multi-tenant) ---
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

  return (
    // TEMA: Gris oscuro y Emerald (emerald-600) para La Barbière
    <div className="min-h-screen flex flex-col selection:bg-emerald-600/30 selection:text-emerald-900 bg-stone-50">
      
      {/* NAVBAR com a função secreta de 5 cliques */}
      <Navbar onAdminClick={() => setIsAdminLoginOpen(true)} />

      {/* COMPONENTES ADMINISTRATIVOS */}
      <AdminLogin 
        isOpen={isAdminLoginOpen} 
        onClose={() => setIsAdminLoginOpen(false)} 
        onLoginSuccess={() => setIsDashboardOpen(true)}
      />
      
      {isDashboardOpen && (
        <AdminDashboard onLogout={() => setIsDashboardOpen(false)} />
      )}

      {/* MODAL DE AGENDAMENTO */}
      <BookingModal 
        isOpen={isBookingOpen} 
        onClose={() => setIsBookingOpen(false)} 
      />

      {/* HERO SECTION */}
      <section id="inicio" className="relative min-h-[90vh] md:min-h-[95vh] flex items-center justify-center overflow-hidden bg-stone-900">
        <div className="absolute inset-0 z-0">
          {/* Usamos a primeira imagem da galeria como Hero */}
          <img src={GALLERY_IMAGES[0].url} alt={BUSINESS_INFO.name} className="w-full h-full object-cover opacity-40 scale-105" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-stone-900/90 to-stone-900"></div> 
        </div>

        <div className="container mx-auto px-4 relative z-10 pt-24 md:pt-20">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex flex-wrap justify-center items-center gap-2 bg-emerald-600/10 border border-emerald-600/20 px-4 py-2 rounded-full mb-8 animate-fade-in text-emerald-500">
              <Star size={14} fill="currentColor" />
              <span className="text-xs font-bold uppercase tracking-[0.2em]">O Teu Espaço de Confiança em Sintra</span>
              <span className="text-stone-400 text-xs font-medium uppercase tracking-widest hidden md:inline"> | Perfeccionismo & Arte</span>
            </div>
            
            <h2 className="font-serif text-5xl md:text-8xl font-bold mb-8 leading-[1.1] text-white tracking-tight">
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
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8 md:gap-12">
            {[
              { icon: ShieldCheck, title: "Brio & Perfeição", text: "Cada corte é uma obra de arte executada com o máximo rigor e atenção ao detalhe." },
              { icon: Users, title: "Atendimento Premium", text: "Um espaço pensado para o conforto do homem, onde a simpatia e o brio andam juntos." },
              { icon: Sparkles, title: "Localização Central", text: "Situados no coração de Sintra, prontos para renovar o teu estilo com conveniência." }
            ].map((item, index) => (
              <div key={index} className="flex flex-col items-center text-center group">
                <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-600 mb-6 group-hover:scale-110 transition-transform">
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
        <div className="container mx-auto px-4 text-left">
          <div className="text-center mb-16">
            <h4 className="text-emerald-600 text-sm font-bold uppercase tracking-[0.4em] mb-4">A Nossa Arte</h4>
            <h2 className="font-serif text-4xl md:text-6xl font-bold text-stone-900">Serviços Exclusivos</h2>
          </div>

          {loadingServices ? (
            <div className="flex justify-center py-20">
              <Loader2 className="animate-spin text-emerald-600" size={40} />
            </div>
          ) : dynamicServices.length === 0 ? (
            <div className="text-center text-stone-500 italic py-10">
              Estamos a preparar a nossa carta de serviços...
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-x-16 gap-y-12 max-w-5xl mx-auto">
              {dynamicServices.map((s) => (
                <div 
                  key={s.id} 
                  onClick={() => setIsBookingOpen(true)}
                  className="group border-b border-stone-200 pb-8 hover:border-emerald-300 transition-all cursor-pointer"
                >
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

      {/* SOBRE */}
      <section id="sobre" className="py-20 md:py-32 bg-white overflow-hidden text-left">
        <div className="container mx-auto px-4 grid lg:grid-cols-2 gap-16 items-center">
            <div className="relative">
              <div className="relative z-10 rounded-[3rem] overflow-hidden shadow-2xl aspect-[4/5] border-8 border-stone-100">
                <img src={GALLERY_IMAGES[4].url} alt={BUSINESS_INFO.name} className="w-full h-full object-cover" />
              </div>
              <div className="absolute -bottom-8 -left-8 bg-stone-900 text-white p-8 rounded-3xl max-w-xs shadow-2xl z-20 hidden md:block">
                <Quote className="text-emerald-500 mb-4" size={32} />
                <p className="font-medium italic text-lg leading-snug">"{REVIEWS[1].text}"</p>
                <p className="text-emerald-500 text-xs mt-4 uppercase font-bold tracking-widest">{REVIEWS[1].author}</p>
              </div>
            </div>
            <div>
              <h2 className="font-serif text-4xl md:text-6xl font-bold mb-8 text-stone-900">
                {BUSINESS_INFO.name} <br /><span className="text-emerald-600 italic">Paixão pelo Detalhe</span>
              </h2>
              <div className="space-y-6 text-stone-600 font-light text-lg">
                <p>No {BUSINESS_INFO.name}, acreditamos que a barba e o cabelo são a expressão da identidade de cada homem. O nosso espaço em Sintra foi criado para oferecer mais do que um corte: oferecemos brio e perfeccionismo.</p>
                <p>Com uma equipa dedicada e focada nas tendências atuais, garantimos que cada cliente sai da nossa cadeira com a sua melhor versão reforçada.</p>
              </div>
            </div>
        </div>
      </section>

      {/* GALERÍA ATUALIZADA */}
      <section className="py-20 md:py-24 bg-stone-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
             <h2 className="font-serif text-3xl md:text-5xl font-bold text-stone-900 mb-4 italic">O Nosso Portfolio</h2>
             <p className="text-stone-500">Trabalhos reais, brio constante.</p>
          </div>
          <div className="columns-2 md:columns-4 gap-4 md:gap-6 space-y-4 md:space-y-6">
            {GALLERY_IMAGES.map((img) => (
              <div key={img.id} className="rounded-2xl md:rounded-3xl overflow-hidden group break-inside-avoid shadow-sm">
                <img src={img.url} alt={img.alt} loading="lazy" className="w-full grayscale hover:grayscale-0 transition-all duration-700 hover:scale-110 cursor-pointer" />
              </div>
            ))}
            <div className="bg-emerald-600 aspect-[3/4] rounded-2xl md:rounded-3xl flex flex-col items-center justify-center p-4 md:p-8 text-center group break-inside-avoid shadow-lg">
              <Camera size={32} className="text-white mb-3 md:mb-4 group-hover:scale-125 transition-transform" />
              <h4 className="text-white font-black text-lg md:text-xl leading-tight">Segue-nos no Instagram</h4>
              <a href={BUSINESS_INFO.instagramUrl} target="_blank" rel="noreferrer" className="mt-4 md:mt-6 text-white text-sm md:text-base font-bold border-b-2 border-white pb-1">@labarbiere</a>
            </div>
          </div>
        </div>
      </section>

      {/* SECCIÓN DO ESPAÇO */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
             <div className="order-2 md:order-1 space-y-6 text-left">
                <h3 className="font-serif text-3xl md:text-4xl text-stone-900 italic">O Teu Momento</h3>
                <p className="text-stone-600 leading-relaxed">
                  O nosso salão foi desenhado para proporcionar o máximo conforto. Um ambiente masculino, profissional e acolhedor onde cada detalhe conta para que a tua experiência seja memorável.
                </p>
                <div className="flex gap-4">
                   <div className="rounded-2xl overflow-hidden h-40 flex-1 border border-stone-100">
                      <img src={GALLERY_IMAGES[5].url} alt="Espaço 1" className="w-full h-full object-cover hover:scale-110 transition-transform duration-700" />
                   </div>
                   <div className="rounded-2xl overflow-hidden h-40 flex-1 border border-stone-100">
                      <img src={GALLERY_IMAGES[6].url} alt="Espaço 2" className="w-full h-full object-cover hover:scale-110 transition-transform duration-700" />
                   </div>
                </div>
             </div>
             <div className="order-1 md:order-2 h-80 md:h-96 rounded-[3rem] overflow-hidden shadow-xl border-8 border-stone-50">
                <img src={GALLERY_IMAGES[7].url} alt="Interior Principal" className="w-full h-full object-cover" />
             </div>
          </div>
        </div>
      </section>

      {/* CONTACTO Y MAPA */}
      <section id="contacto" className="py-20 bg-stone-50 text-left">
        <div className="container mx-auto px-4 grid lg:grid-cols-12 gap-16">
          <div className="lg:col-span-5">
            <h2 className="font-serif text-5xl font-bold mb-10 text-stone-900 italic">Onde Estamos</h2>
            <div className="space-y-10">
              <div className="flex gap-6">
                <div className="w-14 h-14 bg-white shadow-sm rounded-2xl flex items-center justify-center text-emerald-600">
                   <MapPin size={28} />
                </div>
                <div><h4 className="text-stone-900 font-bold text-lg">Morada</h4><p className="text-stone-500">{BUSINESS_INFO.address}<br/>{BUSINESS_INFO.city}</p></div>
              </div>
              <div className="flex gap-6">
                <div className="w-14 h-14 bg-white shadow-sm rounded-2xl flex items-center justify-center text-emerald-600">
                   <Clock size={28} />
                </div>
                <div><h4 className="text-stone-900 font-bold text-lg">Horário</h4><p className="text-stone-500">{BUSINESS_INFO.openingHours}</p></div>
              </div>
              <div className="flex gap-6">
                <div className="w-14 h-14 bg-white shadow-sm rounded-2xl flex items-center justify-center text-emerald-600">
                   <Phone size={28} />
                </div>
                <div><h4 className="text-stone-900 font-bold text-lg">Telemóvel</h4><p className="text-stone-800 text-2xl font-bold">{BUSINESS_INFO.phone}</p></div>
              </div>
            </div>
          </div>
          <div className="lg:col-span-7 h-[500px] rounded-[3rem] overflow-hidden border-8 border-white shadow-xl relative group">
            <a href={BUSINESS_INFO.googleMapsUrl} target="_blank" rel="noreferrer" className="block w-full h-full relative">
              <img src={MAP_SOURCE} alt="Mapa Sintra" className="w-full h-full object-cover grayscale opacity-60 group-hover:grayscale-0 transition-all" />
              <div className="absolute inset-0 flex items-center justify-center bg-stone-900/10">
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
             <div className="text-left">
                <h1 className="font-serif text-2xl font-bold leading-none uppercase">{BUSINESS_INFO.name}</h1>
                <p className="text-[10px] uppercase tracking-[0.3em] text-emerald-500 font-bold">{BUSINESS_INFO.subName}</p>
             </div>
          </div>
          <p className="text-stone-400 text-xs uppercase tracking-widest">© 2026 {BUSINESS_INFO.name} - Sintra, Portugal</p>
        </div>
      </footer>
    </div>
  );
};

export default App;