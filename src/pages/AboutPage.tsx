import PageHeader from '../components/PageHeader'

// 아래 문구는 모두 임시입니다. 실제 내용으로 바꿔 주세요.
export default function AboutPage() {
  return (
    <div className="space-y-8">
      <PageHeader title="소개" />
      <section aria-labelledby="prof">
        <h2 id="prof" className="mb-2 text-xl">교수 소개</h2>
        <p className="leading-relaxed">홍길동 교수 (임시). ○○대학교 교통공학과. 교통수요 분석, 신호운영, 교통안전 분야를 연구합니다. 여기에 약력과 주요 연구 분야를 적어 주세요.</p>
      </section>
      <section aria-labelledby="lab">
        <h2 id="lab" className="mb-2 text-xl">연구실 소개</h2>
        <p className="leading-relaxed">교통공학 연구실 (임시). 도시 교통 문제를 데이터로 분석하고 현장에 적용 가능한 해법을 찾는 것을 목표로 합니다.</p>
      </section>
      <section aria-labelledby="contact">
        <h2 id="contact" className="mb-2 text-xl">연락처</h2>
        <ul className="space-y-1">
          <li>이메일: professor@example.com (임시)</li>
          <li>연구실: ○○대학교 공학관 000호 (임시)</li>
          <li>전화: 000-0000-0000 (임시)</li>
        </ul>
      </section>
    </div>
  )
}
