import PageHeader from '../components/PageHeader'
import DiscussionBoard from '../components/DiscussionBoard'

export default function DiscussionsPage() {
  return (
    <div>
      <PageHeader title="토론" description="연구 자료에 대해 대학원생들이 의견을 나누는 공간입니다. (멤버 전용)" />
      <DiscussionBoard />
    </div>
  )
}
