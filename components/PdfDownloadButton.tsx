'use client'
// =====================================================
// components/PdfDownloadButton.tsx
//
// 사주 결과를 PDF로 저장하는 버튼이에요.
// 별도 라이브러리 없이 브라우저의 "인쇄 → PDF 저장" 기능을 활용해요.
// =====================================================

export default function PdfDownloadButton() {
  function handlePrint() {
    window.print()
  }

  return (
    <button
      onClick={handlePrint}
      className="w-full py-4 flex items-center justify-center gap-2 bg-amber-600 hover:bg-amber-700 active:scale-[0.98] transition-all text-white font-serif font-bold text-base rounded-2xl tracking-widest shadow-md mt-2"
    >
      <span>📄</span>
      <span>PDF로 저장하기</span>
    </button>
  )
}
