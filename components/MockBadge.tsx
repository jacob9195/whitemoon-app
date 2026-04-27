// =====================================================
// components/MockBadge.tsx
// 지금 mock 데이터를 사용 중임을 알려주는 작은 배지예요.
// 실제 계산 모듈이 연결되면 이 배지는 사라져요.
// =====================================================

export default function MockBadge() {
  return (
    <span className="inline-block ml-2 px-2 py-0.5 bg-orange-100 text-orange-600 text-[10px] rounded border border-orange-200 align-middle">
      임시 데이터
    </span>
  )
}
