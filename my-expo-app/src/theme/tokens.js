// Tokens de diseño de OficiAR (estilo Bento Grid).
// Es la ÚNICA fuente de colores y medidas: tailwind.config.js los toma de aquí,
// y los componentes los importan solo donde no se puede usar className (color=, placeholderTextColor=).

// Paleta de marca (la misma de siempre; no renombrar)
const oficiar = {
  'very-dark': '#051A26',
  dark: '#0B3954',
  blue: '#3D80B7',
  'blue-btn': '#0077B5',
  yellow: '#FFC107',
  gray: '#EDEDED',
};

// Neutros para props que no aceptan className
const neutro = {
  white: '#FFFFFF',
  placeholder: '#A3A3A3',
};

// Errores y acciones destructivas (rechazar, cancelar, eliminar)
const peligro = {
  DEFAULT: '#B42318',
  suave: '#FEE4E2',
};

// Bordes redondeados de los bloques Bento
const radio = {
  bento: '20px',
  'bento-sm': '12px',
  boton: '14px',
};

// Separación entre bloques (gap) y relleno interno
const espacio = {
  bento: '12px',
  'bento-in': '16px',
};

// Tamaños de letra: [tamaño, { lineHeight }]
const texto = {
  'bento-title': ['18px', { lineHeight: '24px' }],
  'bento-body': ['15px', { lineHeight: '21px' }],
  'bento-label': ['12px', { lineHeight: '16px' }],
};

// Área mínima de toque (accesibilidad: 48 x 48)
const toque = {
  toque: '48px',
};

module.exports = { oficiar, neutro, peligro, radio, espacio, texto, toque };