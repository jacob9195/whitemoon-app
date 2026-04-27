// =====================================================
// components/SectionCard.tsx
// 결과 화면에서 각 섹션을 감싸는 카드 박스예요.
// =====================================================

type SectionCardProps = {
  title: string        // 카드 상단 제목 (예: "사주팔자 四柱八字")
  children: React.ReactNode
}

export default function SectionCard({ title, children }: SectionCardProps) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-stone-100 p-5 mb-4">
      <p className="text-xs font-semibold tracking-widest text-amber-700 uppercase mb-4">
        {title}
      </p>
      {children}
    </div>
  )
}
