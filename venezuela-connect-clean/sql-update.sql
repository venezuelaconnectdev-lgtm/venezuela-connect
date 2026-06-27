-- ============================================================
-- VENEZUELA CONNECT — Update: Puntos de Acopio + News
-- ============================================================

-- PASO 1: ALTER TABLE
ALTER TABLE diaspora_resources 
ADD COLUMN IF NOT EXISTS expires_at TIMESTAMPTZ DEFAULT NULL;

ALTER TABLE diaspora_resources 
ADD COLUMN IF NOT EXISTS accepted_items TEXT DEFAULT NULL;

-- PASO 2: Organizations nuevas
INSERT INTO organizations 
  (name, description, url, type, country, donation_url, verified, active)
VALUES
  (
    'Cruz Roja Colombiana',
    'Respuesta humanitaria Colombia-Venezuela. Cuenta Davivienda: 0560455069996490. NIT: 899999025-3. App Daviplata disponible.',
    'https://www.cruzrojacolombiana.org',
    'ngo', 'Colombia',
    'https://www.cruzrojacolombiana.org',
    TRUE, TRUE
  ),
  (
    'Fundación Ruta Animal',
    'ONG de protección animal. Coordinó campaña Una Garra por Venezuela con Laika Mascotas y Avianca para animales damnificados del terremoto.',
    'https://instagram.com/fund_rutanimal',
    'ngo', 'Colombia',
    NULL, TRUE, TRUE
  );

-- PASO 3: Diaspora Resources

-- 🇨🇱 CHILE
INSERT INTO diaspora_resources (title, description, url, country, resource_type, active, expires_at, accepted_items) VALUES
(
  'Centro de Acopio Rumbosur',
  'Centro de acopio habilitado en Santiago Centro. Recibe insumos para damnificados del terremoto en Venezuela. Contacto IG: @rumbos.cl',
  'https://instagram.com/rumbos.cl',
  'Chile', 'acopio', TRUE, NULL,
  'Alimentos no perecederos, insumos médicos, higiene personal, alimentos para mascotas'
),
(
  'Centro de Acopio Papelón Sabroso',
  'Restaurante Papelón Sabroso habilitó sus instalaciones como centro de acopio. Dirección: Av. Providencia 1669, Santiago. Horario: Lun–Sáb 9:00–21:00 / Dom 9:00–18:00. Contacto IG: @papelonsabroso',
  'https://instagram.com/papelonsabroso',
  'Chile', 'acopio', TRUE, NULL,
  'Alimentos no perecibles, agua embotellada, leche, fórmulas infantiles, pañales, toallas sanitarias, higiene, jabón, shampoo, pasta dental, papel higiénico, alimento para mascotas'
),
(
  'Centro de Acopio Yum Express',
  'Yum Express habilitó su sede como centro de acopio temporal. Envía artículos por servicio Marítimo Express gratuitamente. Dirección: Eleuterio Ramírez 735, Santiago Centro. VIGENCIA: domingo 28 de junio, 11am–4pm.',
  'https://instagram.com/yum.express',
  'Chile', 'acopio', TRUE,
  '2026-06-28T16:00:00-04:00',
  'Artículos de primera necesidad'
),

-- 🇨🇴 COLOMBIA
(
  'Punto de Acopio Bogotá – Suba',
  'Fundación Juntos se Puede recibe donaciones físicas en Barrio Pasadena, Suba. Dirección: Calle 104 #54-31. Horario: 7:00am–7:00pm.',
  NULL, 'Colombia', 'acopio', TRUE, NULL,
  'Agua embotellada, pastillas potabilizadoras, filtros de agua, enlatados, leche en polvo, alimentos para bebés, artículos de higiene, pañales, botiquines de primeros auxilios'
),
(
  'Punto de Acopio Bogotá Sur',
  'Punto de recolección en el sur de Bogotá. Dirección: Carretera 8va NRO. 1A-66 Sur. Horario: 8:00am–8:00pm.',
  NULL, 'Colombia', 'acopio', TRUE, NULL,
  'Insumos humanitarios generales'
),
(
  'Punto de Acopio Santa Marta – Playa Los Cocos',
  'Punto de recolección en Parque La Tenería, Santa Marta. Dirección: Carrera 2 con 1D36, cerca Playa Los Cocos. Horario: 7:00am–6:00pm.',
  NULL, 'Colombia', 'acopio', TRUE, NULL,
  'Insumos humanitarios generales'
),
(
  'Punto de Acopio Bucaramanga – San Francisco',
  'Centro de acopio en Bucaramanga, diagonal a la Iglesia San Francisco. Dirección: Calle 18 #21-52. Horario: 7:00am–7:00pm.',
  NULL, 'Colombia', 'acopio', TRUE, NULL,
  'Insumos humanitarios generales'
),
(
  'Punto de Acopio Cali – Comuneros II',
  'Punto de recolección en Comuneros II, Cali. Dirección: Carrera 28 B3 #72S-32, cerca troncal unida. Horario: 8:00am–12:00pm.',
  NULL, 'Colombia', 'acopio', TRUE, NULL,
  'Insumos humanitarios generales'
),
(
  'Punto de Acopio Cali – Valle del Lili',
  'Punto de recolección en Unidad San Gabriel, Valle del Lili. Dirección: Carretera 98 #48-30. Horario: 8:00am–8:00pm.',
  NULL, 'Colombia', 'acopio', TRUE, NULL,
  'Insumos humanitarios generales'
),
(
  'Punto de Acopio Montería – Barrio San Miguel',
  'Punto de recolección en Montería. Dirección: Calle 28A #4W79, Barrio San Miguel. Horario: 7:00am–7:00pm.',
  NULL, 'Colombia', 'acopio', TRUE, NULL,
  'Insumos humanitarios generales'
),
(
  'Punto de Acopio Cúcuta – CC Gran Sam',
  'Punto en Centro Comercial Gran Sam. Dirección: Calle 11 A 7MA, 2do piso local 243 GS. Horario: 9:00am–5:00pm.',
  NULL, 'Colombia', 'acopio', TRUE, NULL,
  'Insumos humanitarios generales'
),
(
  'Punto de Acopio Cúcuta – Barrios Lleras',
  'Punto en Barrios Lleras. Dirección: Av. 1 #5-24, diagonal a Carnes Rojas. Horario: 9:00am–4:00pm.',
  NULL, 'Colombia', 'acopio', TRUE, NULL,
  'Insumos humanitarios generales'
),
(
  'Punto de Acopio Medellín – I.E. Héctor Abad Gómez',
  'Institución educativa habilitada como punto de acopio. Dirección: Plaza de Flores, Barrio Boston, Calle 50 #39-65. Horario: 8:00am–5:00pm.',
  NULL, 'Colombia', 'acopio', TRUE, NULL,
  'Insumos humanitarios generales'
),
(
  'Punto de Acopio Maicao – Celumaicao',
  'Local habilitado como punto de acopio. Dirección: Carrera 10 Calle 12, local Celumaicao. Horario: 8:00am–5:00pm.',
  NULL, 'Colombia', 'acopio', TRUE, NULL,
  'Insumos humanitarios generales'
),
(
  'Puntos LAIKA Mascotas – Una Garra por Venezuela',
  'Red de tiendas LAIKA habilitadas para animales damnificados. Campaña con Fundación Ruta Animal y Avianca. VIGENCIA: 26–29 junio, 8am–8pm. Sedes: Laika 140 (Calle 140 #13-18) · Laika 116 (Calle 116 #18B-43) · Laika Chapinero (Cra 7 #59-34) · Laika Usaquén (Cra 7 #124-97) · Laika Modelia (Calle 24 #74A-67) · Laika Chía (Km 2.5 Chía-Cajicá) · Laika La Caro (Autopista Norte Km 21, Chía).',
  'https://instagram.com/laikamascotas',
  'Colombia', 'acopio', TRUE,
  '2026-06-29T20:00:00-05:00',
  'Alimento húmedo y seco para perros y gatos, medicamentos, arena sanitaria, platos, mantas, guacales, collares'
),

-- 🇻🇪 VENEZUELA
(
  'Centro de Acopio Lechería – Plaza Puerto Príncipe',
  'Punto de acopio en Lechería, estado Anzoátegui. Hasta las 4:00pm. Contacto: +58 424 863 7736. NOTA: punto temporal, verificar disponibilidad.',
  NULL, 'Venezuela', 'acopio', TRUE, NULL,
  'Alimentos no perecederos, insumos médicos, higiene personal, alimentos para mascotas'
),
(
  'Centro de Acopio Lechería – Playa Mansa',
  'Punto de acopio en sector Playa Mansa, Lechería, estado Anzoátegui. Contacto: +58 424 863 7736.',
  NULL, 'Venezuela', 'acopio', TRUE, NULL,
  'Alimentos no perecederos, insumos médicos, higiene personal, alimentos para mascotas'
),
(
  'Centro de Acopio Barquisimeto – Medical Hnos.',
  'Medical Hnos. S.G.A. habilitó su local como centro de acopio. Dirección: Calle 20 esq. Carrera 33, Centro Profesional Arca, Barquisimeto. Coordinado con Fundación Hospi Tour y Escuela Técnica de Socorrismo.',
  NULL, 'Venezuela', 'acopio', TRUE, NULL,
  'Alimentos no perecederos, medicinas, agua potable, higiene personal, pañales, sábanas, cobijas, ropa y calzado en buen estado'
),

-- 🇪🇨 ECUADOR
(
  'Centros de Acopio Ecuador – Múltiples ciudades',
  'Puntos activos en Ecuador. QUITO: Cachapas El Felix (Av. Naciones Unidas con Av. 10 de agosto, 11am) · Valle de los Chillos, monumento Rumiñahui (12pm) · Carapungo, panadería Tío Simón (11am–8pm) · Quitumbes, Casa Comunal La Comarca (24h) · Thomas de Berlanga e Isla Santa Fe frente al Chori Gol (9am–9pm) · Rest. Don Lucho, Av. Rumichaca frente al estadio (8am–5pm) · Edif. Julio César Local #03 frente al estadio Aucas (8am–4pm). GUAYAQUIL: Víctor Emilio Estrada y Jiguas, Chamo Burguer (10am) · Universidad de las Artes (3pm–5pm) · Av. Quito y Vélez, Edif. 943 sobre Oro Cash (9am–7pm). CUENCA: Av. 12 de Octubre con Emilio Carrera, Portal del Sol (8am–8pm). IBARRA: García Moreno 2-58 y Maldonado (9am). BAÑOS: Cinco Ocho Fast Food (9am–8pm). MACHALA: El Guabo, Sucre y Panamericana, Agrojecam Sthill (5pm–8pm). LA AURORA: Calle 17 de Octubre y Enrique Gil Gilbert (1pm–11pm).',
  NULL, 'Ecuador', 'acopio', TRUE, NULL,
  'Insumos humanitarios generales'
),

-- 🇺🇾 URUGUAY
(
  'Centros de Acopio Uruguay – Montevideo',
  'Puntos activos en Montevideo. Montevideo Bakery, Gustavo Gallinal 1726 (9am–6pm) · Montevideo Bakery, José Leguizamón 3590 (9am–6pm) · Panadería La Embajada, Rincón 748 Esq. Ciudadela (9am–6pm) · Lehiner''s, Roque Graseras 827 (1pm–7pm) · General Rivera 2984 (5pm–10pm) · Con Sabor a Llano, Carlos Quijano (12pm–10pm) · Manos Veneguayas, Boulevar Artigas 1881 (2pm–6pm) · Rest. One Love, Soriano 1149 (10am–1am) · Rest. POI DE PU, Gral. Rivera 2984 (5pm–10pm).',
  NULL, 'Uruguay', 'acopio', TRUE, NULL,
  'Insumos humanitarios generales'
),

-- 🇵🇦 PANAMÁ
(
  'Centros de Acopio Ciudad de Panamá',
  'Puntos activos en Ciudad de Panamá. Casa Club Parque Omar (8am–2pm) · Edificio El Hatillo P.B, Alcaldía de Panamá (8am–4pm).',
  NULL, 'Panamá', 'acopio', TRUE, NULL,
  'Insumos humanitarios generales'
),

-- 🇪🇸 ESPAÑA
(
  'Centros de Acopio Tenerife – Asociación AACV',
  'Puntos activos en Tenerife. Calle Francisco García Talavera 2, Sta. Cruz de Tenerife, Asociación AACV (9am–6pm) · La Laguna, Plaza de la Catedral (10am–6pm).',
  NULL, 'España', 'acopio', TRUE, NULL,
  'Insumos humanitarios generales'
),

-- 🇺🇸 EE.UU
(
  'Centro de Acopio San Antonio – Texas',
  'Punto activo en San Antonio, Texas. Dirección: 16111 San Pedro Ave, San Antonio, TX 78232. Horario: desde las 11am.',
  NULL, 'USA', 'acopio', TRUE, NULL,
  'Insumos humanitarios generales'
),

-- 🇲🇽 MÉXICO
(
  'Centro de Acopio Solidario Pasticho – Ciudad de México',
  'Restaurante Pasticho Express habilitó su local en C.C. Parques Polanco. Dirección: Lago Alberto 320, Granada, Miguel Hidalgo, CDMX. Contacto: +52 55 49 14 5083.',
  NULL, 'México', 'acopio', TRUE, NULL,
  'Analgésicos, antisépticos, material de curación, solución salina, cremas antibióticas, pomadas para quemaduras, sales de rehidratación, antidiarreicos, guantes desechables, cubrebocas, gel antibacterial, termómetros'
);

-- PASO 4: News humanitaria
INSERT INTO news (title, summary, url, source, source_type, verified, priority) VALUES
(
  'Canal para reportar personas desaparecidas tras terremoto',
  'Puedes reportar personas desaparecidas en desaparecidosterremotovenezuela.com (gratis). Si sabes que alguien está bien, repórtalo también. La Cruz Roja ofrece servicio gratuito de Restablecimiento del Contacto Familiar: escribe a @cruzrojave o Cruz Roja Colombiana.',
  'https://desaparecidosterremotovenezuela.com',
  'Cruz Roja Venezolana / Cruz Roja Colombiana',
  'ngo', TRUE, 2
),
(
  'Rumbo Sur Cargo CL activa envíos humanitarios a Venezuela',
  'Rumbo Sur Cargo CL organizó recolección con lineamientos claros: envíos aéreos (insumos médicos de alto valor) y marítimos (ropa, calzado, alimentos, artículos para mascotas). Los vuelos están temporalmente cerrados; los insumos serán despachados en el primer vuelo habilitado a La Guaira.',
  NULL,
  'Rumbo Sur Cargo CL',
  'ngo', TRUE, 1
);

-- POST-EVENTO: Desactivar puntos expirados (ejecutar después del 29 de junio)
-- UPDATE diaspora_resources SET active = FALSE WHERE expires_at IS NOT NULL AND expires_at < NOW();
