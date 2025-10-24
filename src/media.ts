// AÇÃO NECESSÁRIA:
// Crie uma pasta 'public' na raiz do seu projeto.
// Dentro de 'public', crie uma pasta 'images'.
// Mova TODOS os seus arquivos de imagem para 'public/images/'.
// O código abaixo assume que essa estrutura existe.

// Hero Image
export const eldinHeroImage = '/images/1714148961740.png';

// Floating Images (Stickers)
export const eldinFloatingImages: string[] = [
    '/images/STK-20240226-WA0010.webp',
    '/images/STK-20240426-WA0012.webp',
    '/images/STK-20240520-WA0003.webp',
    '/images/STK-20240619-WA0016.webp',
    '/images/STK-20250204-WA0020.webp',
    '/images/STK-20250401-WA0089.webp',
    '/images/STK-20250401-WA0092.webp',
];

// Images for the Meme Generator editor
export const editableImages: string[] = [
    '/images/1714149372006.png',
    '/images/IMG-20240413-WA0046.jpg',
    '/images/IMG-20251024-WA0018.jpg',
    '/images/IMG-20240226-WA0012.jpg',
    '/images/IMG-20251024-WA0008.jpg',
    '/images/IMG-20240413-WA0045.jpg',
    '/images/IMG-20251024-WA0003.jpg',
    '/images/IMG-20240710-WA0000.jpg',
];

// Images for the Legendary Moments Gallery
export const legendaryMomentsMedia: { src: string; caption: string; type: 'image' }[] = [
    {
        src: '/images/IMG-20251024-WA0004.jpg',
        caption: 'O lendário pênalti no InterUFG. Visão turva, precisão cirúrgica.',
        type: 'image'
    },
    {
        src: '/images/IMG-20240226-WA0011.jpg',
        caption: 'Momento de profunda reflexão filosófica sobre a vida, o universo e a próxima cerveja.',
        type: 'image'
    },
    {
        src: '/images/IMG-20240619-WA0015.jpg',
        caption: 'Comprovando a diretriz biológica de ser um macho alfa reprodutor.',
        type: 'image'
    },
    {
        src: '/images/IMG-20250413-WA0022.jpg',
        caption: 'Em seu habitat natural: a zueira.',
        type: 'image'
    },
    {
        src: '/images/IMG-20240226-WA0013.jpg',
        caption: 'O óculos escuro, acessório indispensável para o sucesso na caça.',
        type: 'image'
    },
    {
        src: '/images/IMG-20251024-WA0020.jpg',
        caption: 'Exibindo o troféu de mais uma conquista bem-sucedida.',
        type: 'image'
    }
];