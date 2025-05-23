// src/components/Sidebar.tsx
import React, { useState, useMemo } from 'react'
import { Listbox } from '@headlessui/react'
import {
  Menu,
  X,
  ChevronDown,
  Search,
  LayoutList,
  LayoutGrid,
} from 'lucide-react'
import { ChatHead } from '../types'

interface SidebarProps {
  chatHeads: ChatHead[]
  activeChatId: string
  setActiveChatId(id: string): void
}

export default function Sidebar({
  chatHeads,
  activeChatId,
  setActiveChatId,
}: SidebarProps) {
  const [search, setSearch] = useState('')
  const [openFilter, setOpenFilter] = useState<string>('All')
  const [sortFilter, setSortFilter] = useState<string>('Waiting longest')
  const [layout, setLayout] = useState<'list' | 'compact'>('list')
  const [mobileOpen, setMobileOpen] = useState(false)

  const openOptions = useMemo(() => {
    const counts = Array.from(new Set(chatHeads.map(c => c.openCount)))
    return ['All', ...counts.map(c => `${c} Open`)]
  }, [chatHeads])
  const sortOptions = ['Waiting longest', 'Newest first', 'Oldest first']

  const displayChats = useMemo(() => {
    let arr = [...chatHeads]
    if (search) {
      const q = search.toLowerCase()
      arr = arr.filter(
        c =>
          c.name.toLowerCase().includes(q) ||
          c.lastMessage.toLowerCase().includes(q)
      )
    }
    if (openFilter !== 'All') {
      const n = Number(openFilter.split(' ')[0])
      arr = arr.filter(c => c.openCount === n)
    }
    arr.sort((a, b) => {
      switch (sortFilter) {
        case 'Newest first':
          return b.timestamp.getTime() - a.timestamp.getTime()
        case 'Oldest first':
          return a.timestamp.getTime() - b.timestamp.getTime()
        case 'Waiting longest':
        default:
          return (b.unreadMinutes ?? 0) - (a.unreadMinutes ?? 0)
      }
    })
    return arr
  }, [chatHeads, search, openFilter, sortFilter])

  return (
    <>
      {/* Mobile Hamburger */}
      <div className="md:hidden p-2">
        <button onClick={() => setMobileOpen(true)} className="p-2 rounded-md hover:bg-gray-100">
          <Menu className="w-6 h-6 text-gray-600" />
        </button>
      </div>
      {/* Overlay */}
      {mobileOpen && <div className="fixed inset-0 bg-black bg-opacity-30 z-20" onClick={() => setMobileOpen(false)} />}
      {/* Sidebar */}
      <aside
        className={`
          fixed inset-y-0 left-0 z-30 w-72 bg-white border-r border-gray-200 
          transform transition-transform duration-200
          ${mobileOpen ? 'translate-x-0' : '-translate-x-full'} 
          md:static md:translate-x-0
          flex flex-col h-screen justify-between
        `}
      >
        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto">
          {/* Mobile Close */}
          <div className="md:hidden flex justify-end p-2">
            <button onClick={() => setMobileOpen(false)} className="p-2 rounded-md hover:bg-gray-100">
              <X className="w-6 h-6 text-gray-600" />
            </button>
          </div>
          {/* Header */}
          <div className="px-4 pt-4 pb-2">
            <h2 className="text-xl font-medium text-gray-800">Your Inbox</h2>
          </div>
          {/* Filters */}
          <div className="px-4 flex items-center justify-between space-x-2 mb-3">
            <Listbox value={openFilter} onChange={setOpenFilter}>
              <div className="relative">
                <Listbox.Button className="flex items-center space-x-1 px-3 py-1.5 bg-white border rounded-md text-sm hover:bg-gray-50">
                  <span className="text-gray-700">{openFilter}</span>
                  <ChevronDown className="w-4 h-4 text-gray-500" />
                </Listbox.Button>
                <Listbox.Options className="absolute mt-1 w-full bg-white border rounded-md shadow-sm z-10">
                  {openOptions.map(opt => (
                    <Listbox.Option key={opt} value={opt} className="px-3 py-1 hover:bg-gray-100 text-sm cursor-pointer">
                      {opt}
                    </Listbox.Option>
                  ))}
                </Listbox.Options>
              </div>
            </Listbox>
            <Listbox value={sortFilter} onChange={setSortFilter}>
              <div className="relative">
                <Listbox.Button className="flex items-center space-x-1 px-3 py-1.5 bg-white border rounded-md text-sm hover:bg-gray-50">
                  <span className="text-gray-700">{sortFilter}</span>
                  <ChevronDown className="w-4 h-4 text-gray-500" />
                </Listbox.Button>
                <Listbox.Options className="absolute mt-1 w-full bg-white border rounded-md shadow-sm z-10">
                  {sortOptions.map(opt => (
                    <Listbox.Option key={opt} value={opt} className="px-3 py-1 hover:bg-gray-100 text-sm cursor-pointer">
                      {opt}
                    </Listbox.Option>
                  ))}
                </Listbox.Options>
              </div>
            </Listbox>
          </div>
          {/* Search */}
          <div className="px-4 pb-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                className="w-full pl-10 pr-4 py-2 text-sm bg-gray-50 border rounded-md focus:ring-2 focus:ring-blue-500"
                placeholder="Search conversations..."
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
          </div>
          {/* Chat List */}
          <div className="px-0">
            {displayChats.length === 0 ? (
              <p className="px-4 text-gray-500 text-sm">No conversations</p>
            ) : (
              displayChats.map(chat => {
                const isActive = chat.id === activeChatId
                return (
                  <button
                    key={chat.id}
                    onClick={() => {
                      setActiveChatId(chat.id)
                      setMobileOpen(false)
                    }}
                    className={`w-full flex items-center justify-between px-4 py-3 hover:bg-gray-50 ${isActive ? 'bg-gray-100 border-l-4 border-blue-500' : ''}`}
                  >
                    <div className="flex items-center space-x-3 min-w-0">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold ${chat.avatarBg}`}>
                        {chat.name.charAt(0)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">{chat.name}</p>
                        {layout === 'list' && (
                          <p className="text-sm text-gray-500 truncate">{chat.lastMessage}</p>
                        )}
                      </div>
                    </div>
                    <div className="flex flex-col items-end space-y-1">
                      {(chat.unreadMinutes ?? 0) > 0 ? (
                        <span className="px-2 py-0.5 text-xs font-medium bg-yellow-100 text-yellow-800 rounded-md">
                          {chat.unreadMinutes} min
                        </span>
                      ) : (
                        <span className="text-xs text-gray-400 whitespace-nowrap">
                          {new Intl.DateTimeFormat('en', { hour: 'numeric', minute: 'numeric' }).format(chat.timestamp)}
                        </span>
                      )}
                    </div>
                  </button>
                )
              })
            )}
          </div>
        </div>
        {/* Footer */}
        <div className="px-4 py-3 border-t border-gray-200 flex items-center justify-center space-x-4">
          <button onClick={() => setLayout('list')} className={`p-2 rounded-md hover:bg-gray-100 ${layout === 'list' ? 'bg-gray-100' : ''}`} aria-label="List">
            <LayoutList className={`w-5 h-5 ${layout === 'list' ? 'text-blue-600' : 'text-gray-500'}`} />
          </button>
          <button onClick={() => setLayout('compact')} className={`p-2 rounded-md hover:bg-gray-100 ${layout === 'compact' ? 'bg-gray-100' : ''}`} aria-label="Compact">
            <LayoutGrid className={`w-5 h-5 ${layout === 'compact' ? 'text-blue-600' : 'text-gray-500'}`} />
          </button>
        </div>
      </aside>
    </>
  )
}
