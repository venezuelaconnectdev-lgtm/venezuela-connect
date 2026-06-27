import { es } from './es'
import { en } from './en'
import { pt } from './pt'
export type Lang = 'es' | 'en' | 'pt'
export type Translations = typeof es
export const translations = { es, en, pt }
export { es, en, pt }
