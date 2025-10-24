// All images are now imported directly from the `src/assets/images` folder.
// This is the most robust method for Vite projects. It guarantees that images
// are processed and included in the final build.
// AÇÃO NECESSÁRIA: Confirme que TODAS as suas imagens estão na pasta `src/assets/images/`.

// Import all necessary images
import heroImage from './assets/images/1714148961740.png';

import floating1 from './assets/images/STK-20240226-WA0010.webp';
import floating2 from './assets/images/STK-20240426-WA0012.webp';
import floating3 from './assets/images/STK-20240520-WA0003.webp';
import floating4 from './assets/images/STK-20240619-WA0016.webp';
import floating5 from './assets/images/STK-20250204-WA0020.webp';
import floating6 from './assets/images/STK-20250401-WA0089.webp';
import floating7 from './assets/images/STK-20250401-WA0092.webp';

import editable1 from './assets/images/1714149372006.png';
import editable2 from './assets/images/IMG-20240413-WA0046.jpg';
import editable3 from './assets/images/IMG-20251024-WA0018.jpg';
import editable4 from './assets/images/IMG-20240226-WA0012.jpg';
import editable5 from './assets/images/IMG-20251024-WA0008.jpg';
import editable6 from './assets/images/IMG-20240413-WA0045.jpg';
import editable7 from './assets/images/IMG-20251024-WA0003.jpg';
import editable8 from './assets/images/IMG-20240710-WA0000.jpg';

import gallery1 from './assets/images/IMG-20251024-WA0004.jpg';
import gallery2 from './assets/images/IMG-20240226-WA0011.jpg';
import gallery3 from './assets/images/IMG-20240619-WA0015.jpg';
import gallery4 from './assets/images/IMG-20250413-WA0022.jpg';
import gallery5 from './assets/images/IMG-20240226-WA0013.jpg';
import gallery6 from './assets/images/IMG-20251024-WA0020.jpg';


// Hero Image
export const eldinHeroImage = heroImage;

// Floating Images (Stickers)
export const eldinFloatingImages: string[] = [
    floating1,
    floating2,
    floating3,
    floating4,
    floating5,
    floating6,
    floating7,
];

// Images for the Meme Generator editor
export const editableImages: string[] = [
    editable1,
    editable2,
    editable3,
    editable4,
    editable5,
    editable6,
    editable7,
    editable8,
];

// Images for the Legendary Moments Gallery
export const legendaryMomentsMedia: { src: string; caption: string; type: 'image' }[] = [
    {
        src: gallery1,
        caption: 'O lendário pênalti no InterUFG. Visão turva, precisão cirúrgica.',
        type: 'image'
    },
    {
        src: gallery2,
        caption: 'Momento de profunda reflexão filosófica sobre a vida, o universo e a próxima cerveja.',
        type: 'image'
    },
    {
        src: gallery3,
        caption: 'Comprovando a diretriz biológica de ser um macho alfa reprodutor.',
        type: 'image'
    },
    {
        src: gallery4,
        caption: 'Em seu habitat natural: a zueira.',
        type: 'image'
    },
    {
        src: gallery5,
        caption: 'O óculos escuro, acessório indispensável para o sucesso na caça.',
        type: 'image'
    },
    {
        src: gallery6,
        caption: 'Exibindo o troféu de mais uma conquista bem-sucedida.',
        type: 'image'
    }
];