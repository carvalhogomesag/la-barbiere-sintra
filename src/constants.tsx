// src/constants.tsx

// 1. Identificador Único do Cliente (Multi-tenant)
// Isso criará a pasta: businesses/la-barbiere-sintra/ no seu Firestore
export const CLIENT_ID = 'la-barbiere-sintra';

// 2. Informações de Exibição do Negócio
export const BUSINESS_INFO = {
  name: "La Barbière",
  subName: "Espaço Homem",
  owner: "Equipa La Barbière",
  phone: '910 152 688', 
  address: 'Av. Heliodoro Salgado 102',
  city: '2710-573 Sintra, Portugal',
  openingHours: 'Segunda a Sábado: 09:00 - 20:00',
  bookingUrl: 'https://wa.me/351910152688', 
  googleMapsUrl: 'https://maps.app.goo.gl/Mes2wiu4m1G6Mweu7', 
  instagramUrl: 'https://instagram.com/labarbiere' 
};

// 3. Serviços Iniciais (Fallback)
// Nota: Assim que você cadastrar no Admin, o sistema usará os dados do Firestore
export const SERVICES = [
  { 
    id: '1', 
    name: 'Corte de Cabelo', 
    description: 'Corte clássico ou moderno com acabamento premium.', 
    price: '12€',
    duration: 30
  },
  { 
    id: '2', 
    name: 'Barba Completa', 
    description: 'Design de barba com toalha quente e produtos específicos.', 
    price: '10€',
    duration: 30
  },
  { 
    id: '3', 
    name: 'Corte & Barba', 
    description: 'Pacote completo para renovar o visual masculino.', 
    price: '20€',
    duration: 60
  }
];

// 4. Reviews extraídas/adaptadas do Google Maps Sintra
export const REVIEWS = [
  {
    id: 1,
    author: 'Alex Sneade',
    date: 'há 11 meses',
    text: 'Barbeiro muito atencioso. Se precisar de um serviço de barbeiro na zona de Sintra, recomendo vivamente!',
    avatar: 'https://ui-avatars.com/api/?name=Alex+Sneade&background=059669&color=fff'
  },
  {
    id: 2,
    author: 'Killian Lobato',
    date: 'há 9 meses',
    text: 'Muito profissional, preço acessível e muito brio no que toca ao perfeccionismo.',
    avatar: 'https://ui-avatars.com/api/?name=Killian+Lobato&background=059669&color=fff'
  },
  {
    id: 3,
    author: 'Mikael Victor Castro',
    date: 'há 6 meses',
    text: 'Um lugar ótimo para cuidar do estilo. Profissionalismo e bom ambiente garantidos.',
    avatar: 'https://ui-avatars.com/api/?name=Mikael+Victor&background=059669&color=fff'
  }
];

// 5. Galeria Unificada (8 fotos padrão .webp na pasta public/images/)
export const GALLERY_IMAGES = [
  { id: 1, url: '/images/foto01.webp', alt: 'La Barbière Sintra - Estilo 01' },
  { id: 2, url: '/images/foto02.webp', alt: 'La Barbière Sintra - Estilo 02' },
  { id: 3, url: '/images/foto03.webp', alt: 'La Barbière Sintra - Estilo 03' },
  { id: 4, url: '/images/foto04.webp', alt: 'La Barbière Sintra - Estilo 04' },
  { id: 5, url: '/images/foto05.webp', alt: 'La Barbière Sintra - Interior 01' },
  { id: 6, url: '/images/foto06.webp', alt: 'La Barbière Sintra - Interior 02' },
  { id: 7, url: '/images/foto07.webp', alt: 'La Barbière Sintra - Interior 03' },
  { id: 8, url: '/images/foto08.webp', alt: 'La Barbière Sintra - Interior 04' },
];