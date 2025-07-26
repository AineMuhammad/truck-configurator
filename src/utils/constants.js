export const hdriOptions = [
    {
        id: 'neutral',
        name: 'Neutral Studio',
        thumbnail: '/hdr/thumbnails/neutral.png',
        file: '/hdr/lightroom_14b.hdr'
    },
    {
        id: 'sunset',
        name: 'Sunset',
        thumbnail: '/hdr/thumbnails/passendorf_snow.png',
        file: '/hdr/passendorf_snow.hdr'
    },
    {
        id: 'warehouse',
        name: 'Warehouse',
        thumbnail: '/hdr/thumbnails/goegap.png',
        file: '/hdr/goegap.hdr'
    },
    {
        id: 'snow',
        name: 'Snow',
        thumbnail: '/hdr/thumbnails/minedump_flats.png',
        file: '/hdr/minedump_flats.hdr'
    }
];

export const DEFAULT_TRUCK_COLOR = '#e20407'; // Cajun Red

export const truckColors = [
    {
        id: 'cajun-red',
        name: 'Cajun Red',
        hex: '#e20407'
    },
    {
        id:'summit-white',
        name: 'Summit White',
        hex: '#e7e9ef'
    },
    {
        id: 'black',
        name: 'Black',
        hex: '#09090e'
    },
    {
        id: 'dark-ash',
        name: 'Dark Ash',
        hex: '#2f2e31'
    },
    {
        id: 'glacier-blue',
        name: 'Glacier Blue',
        hex: '#0280c2'
    },
    {
        id: 'lakeshore-blue',
        name: 'Lakeshore Blue',
        hex: '#2d415f'
    },
    {
        id: 'slate-gray',
        name: 'Slate Gray',
        hex: '#979da4'
    },
    {
        id: 'sterling-gray',
        name: 'Sterling Gray',
        hex: '#8a8e91'
    },
    {
        id: 'iridescent-pearl',
        name: 'Iridescent Pearl',
        hex: '#eaeae8'
    },
    {
        id: 'radiant-red',
        name: 'Radiant Red',
        hex: '#be010e'
    }
];

// AR Base URLs for constructing model URLs from hash
export const AR_BASE_URLS = {
    GLB: 'https://d48f7equ64qjl.cloudfront.net/rough-country-glb',
    USDZ: 'https://d48f7equ64qjl.cloudfront.net/rough-country-usdz'
};

export const RC_BASE_URL = 'https://d2i8r6g6395gr3.cloudfront.net/glb/';