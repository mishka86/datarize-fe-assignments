import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import Tabs from '../Tabs'

describe('Tabs 컴포넌트 테스트', () => {
  const mockTabs = [
    {
      id: 'tab1',
      label: '첫 번째 탭',
      content: <div>첫 번째 탭 내용</div>,
    },
    {
      id: 'tab2',
      label: '두 번째 탭',
      content: <div>두 번째 탭 내용</div>,
    },
    {
      id: 'tab3',
      label: '세 번째 탭',
      content: <div>세 번째 탭 내용</div>,
    },
  ]

  it('모든 탭 레이블이 올바르게 렌더링되어야 합니다', () => {
    // Given & When: Tabs 컴포넌트 렌더링
    render(<Tabs tabs={mockTabs} />)

    // Then: 모든 탭 레이블이 화면에 나타나야 함
    expect(screen.getByText('첫 번째 탭')).toBeInTheDocument()
    expect(screen.getByText('두 번째 탭')).toBeInTheDocument()
    expect(screen.getByText('세 번째 탭')).toBeInTheDocument()
  })

  it('기본적으로 첫 번째 탭이 활성화되어야 합니다', () => {
    // Given & When: Tabs 컴포넌트 렌더링
    render(<Tabs tabs={mockTabs} />)

    // Then: 첫 번째 탭의 내용이 표시되어야 함
    expect(screen.getByText('첫 번째 탭 내용')).toBeInTheDocument()
    expect(screen.queryByText('두 번째 탭 내용')).not.toBeInTheDocument()
  })

  it('defaultTab prop으로 지정된 탭이 기본 활성화되어야 합니다', () => {
    // Given & When: defaultTab으로 두 번째 탭을 지정하여 렌더링
    render(<Tabs tabs={mockTabs} defaultTab="tab2" />)

    // Then: 두 번째 탭의 내용이 표시되어야 함
    expect(screen.getByText('두 번째 탭 내용')).toBeInTheDocument()
    expect(screen.queryByText('첫 번째 탭 내용')).not.toBeInTheDocument()
  })

  it('탭 클릭 시 해당 탭의 내용이 표시되어야 합니다', () => {
    // Given: Tabs 컴포넌트 렌더링
    render(<Tabs tabs={mockTabs} />)

    // When: 두 번째 탭을 클릭
    fireEvent.click(screen.getByText('두 번째 탭'))

    // Then: 두 번째 탭의 내용이 표시되고 첫 번째 탭 내용은 사라져야 함
    expect(screen.getByText('두 번째 탭 내용')).toBeInTheDocument()
    expect(screen.queryByText('첫 번째 탭 내용')).not.toBeInTheDocument()
  })

  it('활성화된 탭에 올바른 스타일이 적용되어야 합니다', () => {
    // Given: Tabs 컴포넌트 렌더링
    render(<Tabs tabs={mockTabs} />)

    // Then: 첫 번째 탭이 활성화 스타일을 가져야 함
    const firstTab = screen.getByText('첫 번째 탭')
    expect(firstTab).toHaveClass('border-blue-500', 'text-blue-600')

    // When: 두 번째 탭을 클릭
    const secondTab = screen.getByText('두 번째 탭')
    fireEvent.click(secondTab)

    // Then: 두 번째 탭이 활성화 스타일을 가져야 함
    expect(secondTab).toHaveClass('border-blue-500', 'text-blue-600')
    expect(firstTab).not.toHaveClass('border-blue-500', 'text-blue-600')
  })

  it('빈 탭 배열일 때 크래시가 발생하지 않아야 합니다', () => {
    // Given & When: 빈 탭 배열로 렌더링
    render(<Tabs tabs={[]} />)

    // Then: 에러 없이 렌더링되어야 함 (내용은 없음)
    expect(screen.queryByRole('button')).not.toBeInTheDocument()
  })

  it('탭 내용이 React 노드를 올바르게 렌더링해야 합니다', () => {
    // Given: 복잡한 React 노드를 포함한 탭
    const complexTabs = [
      {
        id: 'complex',
        label: '복잡한 탭',
        content: (
          <div>
            <h1>제목</h1>
            <p>단락</p>
            <button>버튼</button>
          </div>
        ),
      },
    ]

    // When: 복잡한 탭 렌더링
    render(<Tabs tabs={complexTabs} />)

    // Then: 모든 요소가 올바르게 렌더링되어야 함
    expect(screen.getByRole('heading', { name: '제목' })).toBeInTheDocument()
    expect(screen.getByText('단락')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: '버튼' })).toBeInTheDocument()
  })
})
