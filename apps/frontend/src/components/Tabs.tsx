import { ReactNode, useState } from 'react'

interface Tab {
  id: string
  label: string
  content: ReactNode
}

interface TabsProps {
  tabs: Tab[]
  defaultTab?: string
}

export default function Tabs({ tabs, defaultTab }: TabsProps) {
  const [activeTab, setActiveTab] = useState(defaultTab || tabs[0]?.id)

  return (
    <div className="pb-6">
      {/* 탭 헤더 */}
      <div className="border-b border-neutral-200 bg-white rounded-t-lg p-4">
        <nav className="-mb-px flex">
          {tabs.map((tab, index) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-3 px-4 border-b-2 font-semibold text-base transition-colors bg-white duration-200 cursor-pointer ${
                index < tabs.length - 1 ? 'mr-8' : ''
              } ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600  '
                  : 'border-transparent text-neutral-600 bg-neutral-100 hover:text-blue-500 hover:border-blue-300 hover:bg-neutral-50'
              }`}
              style={{ marginRight: index < tabs.length - 1 ? '24px' : '0' }}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* 탭과 콘텐츠 사이 여백 */}
      <div className="h-6"></div>

      {/* 탭 콘텐츠 */}
      <div className="px-2">{tabs.find((tab) => tab.id === activeTab)?.content}</div>
    </div>
  )
}
