export default function Loading({ text = '불러오는 중...' }: { text?: string }) {
  return <p role="status" className="py-10 text-center text-slate-600">{text}</p>
}
