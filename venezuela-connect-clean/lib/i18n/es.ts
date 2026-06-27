export const es = {
  nav: {
    home: 'Inicio', shelters: 'Refugios', hospitals: 'Hospitales',
    news: 'Noticias', donate: 'Donar', diaspora: 'Diáspora', resources: 'Recursos',
  },
  home: {
    alertLevel: 'NIVEL', alertActive: 'ACTIVO',
    verified: 'Información verificada',
    urgent: 'URGENTE',
    hospitals: 'Hospitales', operative: 'operativos',
    shelters: 'Refugios', active: 'activos',
    critical: 'Críticas', regions: 'regiones',
    freePlaces: 'Lugares disponibles en refugios',
    regionStatus: 'Estado por región',
    latestNews: 'Últimas noticias verificadas',
    allNews: 'Ver todas las noticias →',
    diasporaTitle: '¿Estás fuera de Venezuela?',
    diasporaDesc: 'Descubre cómo ayudar desde tu país con guías específicas.',
    diasporaCta: 'Ver guía para la diáspora →',
    resourcesTitle: 'Recursos y herramientas',
    resourcesCta: 'Ver todos los recursos →',
    power: 'Luz', internet: 'Net', health: 'Salud', water: 'Agua',
  },
  status: {
    operativo: 'Operativo', parcial: 'Parcial', cerrado: 'Cerrado',
    activo: 'Activo', lleno: 'Lleno',
    normal: 'Normal', intermitente: 'Intermitente', sin_servicio: 'Sin servicio',
    critico: 'Crítico', colapsado: 'Colapsado', racionado: 'Racionado',
  },
  alert: {
    0: 'NORMAL', 1: 'ALERTA', 2: 'EMERGENCIA', 3: 'CATÁSTROFE',
  },
  emergency: {
    title: '¿Qué hago ahora?',
    subtitle: 'Guía rápida de emergencia',
    steps: [
      { title: 'Mantén la calma', desc: 'Aléjate de zonas de riesgo. Sigue instrucciones oficiales.' },
      { title: 'Busca un refugio cercano', desc: 'Consulta la sección Refugios para encontrar el más próximo.' },
      { title: 'Llama a emergencias', desc: 'Protección Civil: 0800-776-8324 · Cruz Roja: 0800-272-5572' },
      { title: 'Avisa a tu familia', desc: 'Comparte tu ubicación. Usa WhatsApp o Telegram con poca señal.' },
      { title: 'Solo fuentes verificadas', desc: 'No compartas info sin verificar. Revisa la sección Noticias.' },
    ],
    numbers: 'NÚMEROS DE EMERGENCIA',
    understood: 'Entendido',
  },
  lang: { es: 'Español', en: 'English', pt: 'Português' },
}
export type Translations = typeof es
