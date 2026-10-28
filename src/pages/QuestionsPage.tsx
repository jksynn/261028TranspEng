import PageHeader from '../components/PageHeader'
import DiscussionBoard from '../components/DiscussionBoard'

export default function QuestionsPage() {
  return (
    <div>
      <PageHeader title="질문게시판" description="연구·강의에 대해 궁금한 점을 질문하고 답변을 받는 공간입니다. (멤버 전용)" />
      <DiscussionBoard board="question" />
    </div>
  )
}
