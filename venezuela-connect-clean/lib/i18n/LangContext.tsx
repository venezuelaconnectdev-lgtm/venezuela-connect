'use client'
import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { translations, Lang, Translations } from './index'

interface LangCtx { lang: Lang; t: Translations; setLang: (l: Lang) => void }
const Ctx = createContext<LangCtx>({ lang: 'es', t: translations.es, setLang: () => {} })

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>('es')

  useEffect(() => {
    const saved = localStorage.getItem('vc-lang') as Lang
    if (saved && translations[saved]) setLangState(saved)
  }, [])

  const setLang = (l: Lang) => {
    setLangState(l)
    localStorage.setItem('vc-lang', l)
  }

  return (
    <Ctx.Provider value={{ lang, t: translations[lang], setLang }}>
      {children}
    </Ctx.Provider>
  )
}

export const useLang = () => useContext(Ctx)
