import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { ThemeProvider } from '@/contexts/ThemeContext'
import { LanguageProvider } from '@/contexts/LanguageContext'
import { DataProvider } from '@/contexts/DataContext'
import { Layout } from '@/components/layout/Layout'
import { Dashboard } from '@/pages/Dashboard'
import { POS } from '@/pages/POS'
import { Products } from '@/pages/Products'
import { Sales } from '@/pages/Sales'
import { Categories } from '@/pages/Categories'
import { Branches } from '@/pages/Branches'
import { Reports } from '@/pages/Reports'
import { Settings } from '@/pages/Settings'

function App() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <DataProvider>
          <BrowserRouter>
            <Routes>
              <Route element={<Layout />}>
                <Route path="/" element={<Dashboard />} />
                <Route path="/pos" element={<POS />} />
                <Route path="/products" element={<Products />} />
                <Route path="/sales" element={<Sales />} />
                <Route path="/categories" element={<Categories />} />
                <Route path="/branches" element={<Branches />} />
                <Route path="/reports" element={<Reports />} />
                <Route path="/settings" element={<Settings />} />
              </Route>
            </Routes>
          </BrowserRouter>
        </DataProvider>
      </LanguageProvider>
    </ThemeProvider>
  )
}

export default App
