import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom'
import Dashboard from './components/Dashboard'
import ProcessPage from './components/process/ProcessPage'

function NavBar() {
  const { pathname } = useLocation()
  const isProcess = pathname.startsWith('/process')
  return (
    <header className="border-b border-rc-stone bg-white">
      <div className="mx-auto max-w-7xl px-6 py-3 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 text-rc-red font-semibold tracking-tight">
          <span className="inline-block h-6 w-6 rounded-sm bg-rc-red" aria-hidden />
          <span>Coordinator Copilot</span>
          <span className="text-rc-slate text-xs font-normal ml-2">Innovation Test Kitchen POC</span>
        </Link>
        <nav className="flex items-center gap-1 text-sm">
          <Link
            to="/"
            className={`px-3 py-1.5 rounded-md ${!isProcess ? 'bg-rc-mist text-rc-ink font-medium' : 'text-rc-slate hover:text-rc-ink'}`}
          >
            Product
          </Link>
          <Link
            to="/process"
            className={`px-3 py-1.5 rounded-md ${isProcess ? 'bg-rc-mist text-rc-ink font-medium' : 'text-rc-slate hover:text-rc-ink'}`}
          >
            How it was built
          </Link>
        </nav>
      </div>
    </header>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen flex flex-col">
        <NavBar />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/process" element={<ProcessPage />} />
          </Routes>
        </main>
        <footer className="border-t border-rc-stone bg-white">
          <div className="mx-auto max-w-7xl px-6 py-4 text-xs text-rc-slate flex justify-between">
            <span>Prototype for interview purposes. Not an American Red Cross product.</span>
            <span>Blood Drive Coordinator Copilot &middot; POC</span>
          </div>
        </footer>
      </div>
    </BrowserRouter>
  )
}
