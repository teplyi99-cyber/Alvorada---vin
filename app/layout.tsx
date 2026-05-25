import type { Metadata } from 'next'
import { Providers } from './providers'
import './globals.css'

export const metadata: Metadata = {
  title: 'Alvorada V.I.N',
  description: 'РђРЅРіР»РёР№СЃРєРёР№ РґР»СЏ РїСѓС‚РµС€РµСЃС‚РІРёР№ вЂ” РїСЂР°РєС‚РёРєР° С‡РµСЂРµР· РґРёР°Р»РѕРіРё',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}

