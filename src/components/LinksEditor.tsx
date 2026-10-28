import type { LinkItem } from '../types'

interface Props {
  links: LinkItem[]
  onChange: (links: LinkItem[]) => void
}

// 외부 링크(논문·드라이브·GitHub 등)를 여러 개 입력하는 부분
export default function LinksEditor({ links, onChange }: Props) {
  const update = (i: number, patch: Partial<LinkItem>) =>
    onChange(links.map((l, idx) => (idx === i ? { ...l, ...patch } : l)))

  return (
    <fieldset>
      <legend className="label">링크</legend>
      <div className="space-y-2">
        {links.map((l, i) => (
          <div key={i} className="flex flex-col gap-2 sm:flex-row">
            <div className="sm:w-1/3">
              <label htmlFor={`link-label-${i}`} className="sr-only">링크 이름 {i + 1}</label>
              <input id={`link-label-${i}`} className="input" placeholder="이름 (예: 논문 PDF)" value={l.label} onChange={(e) => update(i, { label: e.target.value })} />
            </div>
            <div className="flex-1">
              <label htmlFor={`link-url-${i}`} className="sr-only">링크 주소 {i + 1}</label>
              <input id={`link-url-${i}`} className="input" placeholder="https://..." value={l.url} onChange={(e) => update(i, { url: e.target.value })} />
            </div>
            <button type="button" className="btn-outline" onClick={() => onChange(links.filter((_, idx) => idx !== i))}>
              삭제<span className="sr-only"> {i + 1}번 링크</span>
            </button>
          </div>
        ))}
      </div>
      <button type="button" className="btn-outline mt-2" onClick={() => onChange([...links, { label: '', url: '' }])}>+ 링크 추가</button>
    </fieldset>
  )
}
