export interface EmojiCategory {
  id: string;
  name: string;
  icon: string;
  emojis: { emoji: string; keywords: string[] }[];
}

export const EMOJI_CATEGORIES: EmojiCategory[] = [
  {
    id: 'frecuentes',
    name: 'Destacados',
    icon: '✨',
    emojis: [
      { emoji: '🥑', keywords: ['palta', 'comida', 'super', 'saludable'] },
      { emoji: '🏡', keywords: ['casa', 'hogar', 'alquiler', 'depto'] },
      { emoji: '🚗', keywords: ['auto', 'coche', 'transporte', 'gasolina'] },
      { emoji: '🧘‍♀️', keywords: ['yoga', 'salud', 'paz', 'bienestar', 'gym'] },
      { emoji: '📚', keywords: ['libro', 'estudio', 'curso', 'facultad'] },
      { emoji: '✨', keywords: ['brillo', 'salidas', 'ocio', 'lujo'] },
      { emoji: '💼', keywords: ['trabajo', 'oficina', 'sueldo', 'empleo'] },
      { emoji: '🌱', keywords: ['ahorro', 'inversion', 'crecimiento'] },
      { emoji: '📈', keywords: ['inversiones', 'acciones', 'rendimiento'] },
      { emoji: '⭐', keywords: ['estrella', 'ahorro', 'meta', 'favorito'] },
      { emoji: '☕', keywords: ['cafe', 'desayuno', 'merienda', 'cafeteria'] },
      { emoji: '🍕', keywords: ['pizza', 'comida', 'cena', 'delivery'] },
      { emoji: '🛒', keywords: ['supermercado', 'carrito', 'compras'] },
      { emoji: '📱', keywords: ['celular', 'telefono', 'internet', 'abono'] },
      { emoji: '💊', keywords: ['farmacia', 'medicina', 'remedios', 'salud'] },
      { emoji: '🐶', keywords: ['perro', 'mascota', 'veterinaria'] },
      { emoji: '💅', keywords: ['unas', 'belleza', 'peluqueria', 'estetica'] },
      { emoji: '✈️', keywords: ['avion', 'viaje', 'vacaciones', 'turismo'] },
      { emoji: '💰', keywords: ['dinero', 'plata', 'ahorro', 'banco'] },
      { emoji: '💳', keywords: ['tarjeta', 'credito', 'debito', 'banco'] },
    ],
  },
  {
    id: 'comida',
    name: 'Comida & Bebidas',
    icon: '🥑',
    emojis: [
      { emoji: '🥑', keywords: ['palta', 'verduras', 'supermercado'] },
      { emoji: '🛒', keywords: ['supermercado', 'compras', 'almacen'] },
      { emoji: '🍕', keywords: ['pizza', 'delivery', 'comida rapida'] },
      { emoji: '🍔', keywords: ['hamburguesa', 'comida chatarra', 'cena'] },
      { emoji: '☕', keywords: ['cafe', 'merienda', 'desayuno'] },
      { emoji: '🥗', keywords: ['ensalada', 'comida sana', 'dieta'] },
      { emoji: '🍣', keywords: ['sushi', 'salida', 'cena japonesa'] },
      { emoji: '🥩', keywords: ['carne', 'asado', 'carniceria'] },
      { emoji: '🥖', keywords: ['pan', 'panaderia', 'harina'] },
      { emoji: '🥐', keywords: ['medialuna', 'croissant', 'merienda'] },
      { emoji: '🍎', keywords: ['manzana', 'fruta', 'verduleria'] },
      { emoji: '🍓', keywords: ['frutilla', 'fruta', 'postre'] },
      { emoji: '🍦', keywords: ['helado', 'heladeria', 'postre'] },
      { emoji: '🍫', keywords: ['chocolate', 'dulce', 'kiosco'] },
      { emoji: '🍷', keywords: ['vino', 'vinoteca', 'cena'] },
      { emoji: '🍻', keywords: ['cerveza', 'birra', 'bar', 'amigos'] },
      { emoji: '🍹', keywords: ['trago', 'coctel', 'boliche', 'salida'] },
      { emoji: '🍩', keywords: ['dona', 'facturas', 'dulce'] },
      { emoji: '🍱', keywords: ['vianda', 'comida', 'almuerzo'] },
      { emoji: '🍜', keywords: ['fideos', 'pasta', 'ramen'] },
      { emoji: '🌮', keywords: ['tacos', 'mexicano', 'salida'] },
      { emoji: '🥪', keywords: ['sandwich', 'tostado', 'almuerzo'] },
      { emoji: '🧀', keywords: ['queso', 'lacteos', 'fiambreria'] },
      { emoji: '🥚', keywords: ['huevos', 'supermercado', 'cocina'] },
      { emoji: '🍉', keywords: ['sandia', 'verduleria'] },
      { emoji: '🍌', keywords: ['banana', 'fruta'] },
      { emoji: '🧃', keywords: ['jugo', 'bebida', 'merienda'] },
      { emoji: '🧉', keywords: ['mate', 'yerba', 'desayuno'] },
    ],
  },
  {
    id: 'hogar',
    name: 'Hogar & Servicios',
    icon: '🏡',
    emojis: [
      { emoji: '🏡', keywords: ['casa', 'alquiler', 'hogar', 'expensas'] },
      { emoji: '🏢', keywords: ['departamento', 'edificio', 'oficina'] },
      { emoji: '🛋️', keywords: ['muebles', 'decoracion', 'living'] },
      { emoji: '🔑', keywords: ['llave', 'alquiler', 'mudanza'] },
      { emoji: '💡', keywords: ['luz', 'electricidad', 'servicio'] },
      { emoji: '🔌', keywords: ['enchufe', 'electrodomesticos'] },
      { emoji: '🚿', keywords: ['agua', 'bano', 'servicio'] },
      { emoji: '🧹', keywords: ['limpieza', 'articulos de limpieza'] },
      { emoji: '📦', keywords: ['paquete', 'envio', 'mudanza'] },
      { emoji: '📶', keywords: ['wifi', 'internet', 'fibra'] },
      { emoji: '🧺', keywords: ['lavadero', 'ropa', 'jabon'] },
      { emoji: '🪟', keywords: ['cortinas', 'ventana', 'reforma'] },
      { emoji: '🪴', keywords: ['plantas', 'vivero', 'jardin'] },
      { emoji: '🛏️', keywords: ['cama', 'sabanas', 'dormitorio'] },
      { emoji: '🧻', keywords: ['papel', 'higiene', 'bano'] },
      { emoji: '🛠️', keywords: ['herramientas', 'reparacion', 'arreglo'] },
      { emoji: '🔧', keywords: ['plomero', 'mantenimiento'] },
      { emoji: '🔥', keywords: ['gas', 'calefaccion', 'servicio'] },
    ],
  },
  {
    id: 'transporte',
    name: 'Transporte & Autos',
    icon: '🚗',
    emojis: [
      { emoji: '🚗', keywords: ['auto', 'coche', 'patente', 'seguro'] },
      { emoji: '🚌', keywords: ['colectivo', 'bondi', 'transporte publico'] },
      { emoji: '🚇', keywords: ['subte', 'metro', 'tren'] },
      { emoji: '🚕', keywords: ['taxi', 'uber', 'cabify', 'remis'] },
      { emoji: '🚲', keywords: ['bicicleta', 'bici', 'transporte'] },
      { emoji: '🛵', keywords: ['moto', 'scooter', 'cadete'] },
      { emoji: '✈️', keywords: ['avion', 'vuelo', 'pasajes', 'viajes'] },
      { emoji: '⛽', keywords: ['nafta', 'combustible', 'estacion'] },
      { emoji: '🎫', keywords: ['boleto', 'pasaje', 'peaje'] },
      { emoji: '🧳', keywords: ['valija', 'equipaje', 'viaje'] },
      { emoji: '🚂', keywords: ['tren', 'ferrocarril'] },
      { emoji: '🛳️', keywords: ['barco', 'crucero', 'escapada'] },
      { emoji: '🏖️', keywords: ['playa', 'vacaciones', 'mar'] },
      { emoji: '🏔️', keywords: ['montana', 'nieve', 'viaje'] },
      { emoji: '🅿️', keywords: ['estacionamiento', 'cochera'] },
      { emoji: '🚨', keywords: ['multa', 'seguro', 'infraccion'] },
    ],
  },
  {
    id: 'salud',
    name: 'Salud, Belleza & Bienestar',
    icon: '🧘‍♀️',
    emojis: [
      { emoji: '🧘‍♀️', keywords: ['yoga', 'meditacion', 'paz', 'pilates'] },
      { emoji: '🏋️‍♀️', keywords: ['gimnasio', 'pesas', 'gym', 'entrenamiento'] },
      { emoji: '🏃‍♀️', keywords: ['running', 'correr', 'deporte'] },
      { emoji: '💊', keywords: ['medicamentos', 'farmacia', 'remedios'] },
      { emoji: '🏥', keywords: ['hospital', 'clinica', 'medico', 'consulta'] },
      { emoji: '🩺', keywords: ['estetoscopio', 'doctor', 'obra social'] },
      { emoji: '💅', keywords: ['manicura', 'unas', 'belleza'] },
      { emoji: '💇‍♀️', keywords: ['peluqueria', 'corte', 'tinte'] },
      { emoji: '🧴', keywords: ['cremas', 'skincare', 'cosmetica'] },
      { emoji: '💄', keywords: ['maquillaje', 'labial', 'makeup'] },
      { emoji: '🧼', keywords: ['jabon', 'ducha', 'higiene'] },
      { emoji: '🦷', keywords: ['dentista', 'odontologo', 'dientes'] },
      { emoji: '👓', keywords: ['optica', 'anteojos', 'lentes'] },
      { emoji: '🌸', keywords: ['perfume', 'flores', 'aroma'] },
      { emoji: '🌿', keywords: ['naturista', 'hierbas', 'dietetica'] },
      { emoji: '🧖‍♀️', keywords: ['spa', 'masaje', 'relax'] },
      { emoji: '🩹', keywords: ['curita', 'primeros auxilios'] },
      { emoji: '🏊‍♀️', keywords: ['natacion', 'pileta', 'club'] },
    ],
  },
  {
    id: 'compras',
    name: 'Compras & Ropa',
    icon: '🛍️',
    emojis: [
      { emoji: '🛍️', keywords: ['shopping', 'bolsas', 'compras'] },
      { emoji: '👗', keywords: ['vestido', 'ropa', 'moda'] },
      { emoji: '👠', keywords: ['tacos', 'zapatos', 'calzado'] },
      { emoji: '👟', keywords: ['zapatillas', 'calzado', 'deportivas'] },
      { emoji: '👕', keywords: ['remera', 'ropa', 'indumentaria'] },
      { emoji: '👜', keywords: ['cartera', 'bolso', 'accesorio'] },
      { emoji: '🧢', keywords: ['gorra', 'sombrero'] },
      { emoji: '💍', keywords: ['joyeria', 'anillo', 'regalo'] },
      { emoji: '🕶️', keywords: ['lentes de sol', 'gafas'] },
      { emoji: '🎁', keywords: ['regalo', 'cumpleanos', 'navidad'] },
      { emoji: '🧥', keywords: ['campera', 'abrigo', 'invierno'] },
      { emoji: '👙', keywords: ['malla', 'bikini', 'verano'] },
      { emoji: '👛', keywords: ['monedero', 'billetera'] },
      { emoji: '💎', keywords: ['joyas', 'lujo', 'diamante'] },
      { emoji: '🏷️', keywords: ['descuento', 'oferta', 'etiqueta'] },
    ],
  },
  {
    id: 'trabajo',
    name: 'Trabajo & Educación',
    icon: '💼',
    emojis: [
      { emoji: '💼', keywords: ['maletin', 'trabajo', 'empleo', 'sueldo'] },
      { emoji: '📚', keywords: ['libros', 'estudio', 'lectura', 'libreria'] },
      { emoji: '💻', keywords: ['computadora', 'notebook', 'freelance'] },
      { emoji: '📱', keywords: ['celular', 'app', 'tecnologia'] },
      { emoji: '🎓', keywords: ['universidad', 'facultad', 'titulo', 'posgrado'] },
      { emoji: '✏️', keywords: ['lapiz', 'libreria', 'papeleria'] },
      { emoji: '📝', keywords: ['notas', 'tramites', 'contrato'] },
      { emoji: '📎', keywords: ['oficina', 'tramites'] },
      { emoji: '🖨️', keywords: ['impresora', 'fotocopias'] },
      { emoji: '📈', keywords: ['crecimiento', 'ventas', 'negocio'] },
      { emoji: '📊', keywords: ['graficos', 'analisis', 'metricas'] },
      { emoji: '🎯', keywords: ['objetivo', 'meta', 'meta financiera'] },
      { emoji: '📅', keywords: ['agenda', 'calendario', 'mensualidad'] },
      { emoji: '🖋️', keywords: ['firma', 'escribania', 'abogado'] },
    ],
  },
  {
    id: 'ocio',
    name: 'Ocio & Salidas',
    icon: '✨',
    emojis: [
      { emoji: '✨', keywords: ['salida', 'brillo', 'noche'] },
      { emoji: '🎬', keywords: ['cine', 'peliculas', 'estreno'] },
      { emoji: '🍿', keywords: ['pochoclos', 'netflix', 'series'] },
      { emoji: '🎮', keywords: ['videojuegos', 'gaming', 'play'] },
      { emoji: '🎟️', keywords: ['entradas', 'recital', 'concierto', 'teatro'] },
      { emoji: '🎨', keywords: ['arte', 'taller', 'pintura'] },
      { emoji: '🎵', keywords: ['musica', 'spotify', 'streaming'] },
      { emoji: '🎧', keywords: ['auriculares', 'podcasts'] },
      { emoji: '🎤', keywords: ['karaoke', 'canto', 'recital'] },
      { emoji: '🎳', keywords: ['bowling', 'juegos'] },
      { emoji: '🎪', keywords: ['circo', 'espectaculo'] },
      { emoji: '⛺', keywords: ['camping', 'escapada', 'aire libre'] },
      { emoji: '💃', keywords: ['baile', 'fiesta', 'boliche', 'danza'] },
      { emoji: '🎂', keywords: ['torta', 'cumpleanos', 'festejo'] },
      { emoji: '📸', keywords: ['fotos', 'camara', 'recuerdos'] },
    ],
  },
  {
    id: 'mascotas',
    name: 'Mascotas & Familia',
    icon: '🐾',
    emojis: [
      { emoji: '🐶', keywords: ['perro', 'veterinaria', 'alimento perro'] },
      { emoji: '🐱', keywords: ['gato', 'veterinaria', 'alimento gato'] },
      { emoji: '🐾', keywords: ['patitas', 'mascotas', 'pet shop'] },
      { emoji: '👶', keywords: ['bebe', 'hijos', 'panales'] },
      { emoji: '🍼', keywords: ['mamadera', 'leche', 'bebe'] },
      { emoji: '🧸', keywords: ['juguetes', 'peluche', 'ninos'] },
      { emoji: '🐕‍🦺', keywords: ['perro guia', 'paseador'] },
      { emoji: '🦜', keywords: ['pajaro', 'ave', 'mascota'] },
      { emoji: '🐹', keywords: ['hamster', 'roedor'] },
      { emoji: '🐰', keywords: ['conejo', 'mascota'] },
      { emoji: '🐠', keywords: ['peces', 'acuario'] },
      { emoji: '🦴', keywords: ['hueso', 'snack perro'] },
    ],
  },
  {
    id: 'finanzas',
    name: 'Finanzas & Dinero',
    icon: '💰',
    emojis: [
      { emoji: '💰', keywords: ['bolsa de dinero', 'plata', 'ahorro'] },
      { emoji: '💳', keywords: ['tarjeta', 'visa', 'mastercard', 'debito'] },
      { emoji: '💵', keywords: ['dolares', 'billetes', 'efectivo'] },
      { emoji: '🪙', keywords: ['monedas', 'cambio'] },
      { emoji: '🏦', keywords: ['banco', 'caja de ahorro', 'plazo fijo'] },
      { emoji: '🌱', keywords: ['crecimiento', 'fondo comun', 'fci'] },
      { emoji: '📈', keywords: ['bolsa', 'acciones', 'cedears'] },
      { emoji: '🛡️', keywords: ['seguro', 'proteccion', 'fondo de emergencia'] },
      { emoji: '🔒', keywords: ['seguridad', 'clave', 'pin'] },
      { emoji: '🧮', keywords: ['calculadora', 'presupuesto', 'cuentas'] },
      { emoji: '🧾', keywords: ['factura', 'ticket', 'recibo'] },
      { emoji: '💸', keywords: ['gasto', 'dinero volando'] },
      { emoji: '🤑', keywords: ['ganancia', 'extra', 'bono'] },
      { emoji: '🤝', keywords: ['prestamo', 'acuerdo'] },
    ],
  },
  {
    id: 'simbolos',
    name: 'Símbolos & Extras',
    icon: '🌟',
    emojis: [
      { emoji: '⭐', keywords: ['estrella', 'favorito'] },
      { emoji: '✨', keywords: ['destacado', 'magia'] },
      { emoji: '💖', keywords: ['corazon', 'amor', 'favorito'] },
      { emoji: '💜', keywords: ['lila', 'corazon violeta', 'pastel'] },
      { emoji: '🤍', keywords: ['corazon blanco', 'minimalista'] },
      { emoji: '🌸', keywords: ['flor', 'primavera'] },
      { emoji: '☀️', keywords: ['sol', 'dia'] },
      { emoji: '🌈', keywords: ['arcoiris', 'colorido'] },
      { emoji: '⚡', keywords: ['rayo', 'urgente'] },
      { emoji: '🍀', keywords: ['suerte', 'trebol'] },
      { emoji: '🎉', keywords: ['fiesta', 'festejo'] },
      { emoji: '🔔', keywords: ['campana', 'alerta', 'recordatorio'] },
      { emoji: '✉️', keywords: ['carta', 'correo', 'notificacion'] },
      { emoji: '🔑', keywords: ['clave', 'acceso'] },
      { emoji: '🏷️', keywords: ['etiqueta', 'tag'] },
    ],
  },
];

/**
 * Extracts the first emoji or graphical character from any text string.
 * Uses modern Intl.Segmenter to accurately handle zero-width joiners (ZWJ),
 * multi-codepoint mobile emojis (e.g. 🧘‍♀️, 👨‍👩‍👧‍👦, 🐕‍🦺), skin tones and flags.
 */
export function extractFirstEmoji(input: string): string {
  const trimmed = input.trim();
  if (!trimmed) return '';

  // 1. If Intl.Segmenter is supported (standard in modern mobile & desktop browsers)
  if (typeof Intl !== 'undefined' && 'Segmenter' in Intl) {
    try {
      const segmenter = new (Intl as any).Segmenter('es', { granularity: 'grapheme' });
      const segments = Array.from(segmenter.segment(trimmed)) as Array<{ segment: string }>;
      if (segments.length > 0) {
        return segments[0].segment;
      }
    } catch (e) {
      // fallback if segmenter fails
    }
  }

  // 2. Unicode Extended Pictographic regex matching ZWJ sequences
  try {
    const match = trimmed.match(/\p{Extended_Pictographic}(?:\u200D\p{Extended_Pictographic})*/u);
    if (match && match[0]) {
      return match[0];
    }
  } catch (e) {
    // fallback if Unicode property regex is unsupported
  }

  // 3. Fallback: Array.from splits UTF-16 surrogate pairs properly
  const chars = Array.from(trimmed);
  return chars[0] || '';
}
