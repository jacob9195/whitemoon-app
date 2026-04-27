#!/usr/bin/env python3
"""
scripts/subset-fonts.py

사주 PDF용 NotoSansKR 폰트 서브셋 생성 스크립트

사용법:
  pip install fonttools
  python3 scripts/subset-fonts.py

출력:
  public/fonts/NotoSansKR-Regular-Subset.ttf
  public/fonts/NotoSansKR-Bold-Subset.ttf

시스템 요구사항:
  Ubuntu/Debian: apt-get install fonts-noto-cjk
  macOS:        brew install --cask font-noto-sans-cjk-kr

소스 폰트 위치 (시스템별):
  Ubuntu:  /usr/share/fonts/opentype/noto/NotoSansCJK-Regular.ttc
  macOS:   /Library/Fonts/NotoSansCJK-Regular.ttc  (또는 ~/Library/Fonts/)
  Windows: C:/Windows/Fonts/NotoSansCJK-Regular.ttc
"""

import os
import sys
import platform
from pathlib import Path

try:
    from fontTools.ttLib import TTCollection, TTFont
    from fontTools.subset import Subsetter, Options
except ImportError:
    print("ERROR: fonttools 설치 필요")
    print("  pip install fonttools")
    sys.exit(1)

# 소스 폰트 경로 (OS별)
FONT_PATHS = {
    'Linux': {
        'regular': '/usr/share/fonts/opentype/noto/NotoSansCJK-Regular.ttc',
        'bold':    '/usr/share/fonts/opentype/noto/NotoSansCJK-Bold.ttc',
    },
    'Darwin': {
        'regular': '/Library/Fonts/NotoSansCJK-Regular.ttc',
        'bold':    '/Library/Fonts/NotoSansCJK-Bold.ttc',
    },
    'Windows': {
        'regular': 'C:/Windows/Fonts/NotoSansCJK-Regular.ttc',
        'bold':    'C:/Windows/Fonts/NotoSansCJK-Bold.ttc',
    },
}

# KR 폰트 인덱스 (TTC 내)
KR_INDEX = 1

# 프로젝트 루트 → public/fonts
SCRIPT_DIR  = Path(__file__).parent
PROJECT_ROOT = SCRIPT_DIR.parent
OUTPUT_DIR  = PROJECT_ROOT / 'public' / 'fonts'
OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

def build_unicode_set() -> list[int]:
    chars = set()
    # ASCII
    for c in range(0x20, 0x7F): chars.add(c)
    # 한글 전체
    for c in range(0xAC00, 0xD7A4): chars.add(c)
    # 한글 자모
    for c in range(0x1100, 0x1200): chars.add(c)
    # CJK (사주 한자)
    hanja = ('甲乙丙丁戊己庚辛壬癸'
             '子丑寅卯辰巳午未申酉戌亥'
             '木火土金水陰陽'
             '四柱八字年月日時運命理學'
             '比劫食傷財官印星'
             '長生沐浴冠帶建祿帝旺衰病死墓絕胎養'
             '合冲刑破害')
    for c in hanja: chars.add(ord(c))
    # 숫자·특수
    for c in '0123456789%·—※▶◆○●★☆◎→←↑↓': chars.add(ord(c))
    return sorted(chars)

def extract_and_subset(src_path: str, kr_index: int, out_path: str, label: str):
    print(f"  처리 중: {label} ({src_path})")
    if not os.path.exists(src_path):
        print(f"  ERROR: 소스 폰트 없음: {src_path}")
        return False

    tc   = TTCollection(src_path)
    font = tc[kr_index]
    options = Options()
    options.hinting = False
    options.desubroutinize = True

    subsetter = Subsetter(options)
    subsetter.populate(unicodes=build_unicode_set())
    subsetter.subset(font)
    font.save(out_path)

    size = os.path.getsize(out_path)
    print(f"  완료: {out_path} ({size/1024/1024:.1f} MB)")
    return True

def main():
    os_name = platform.system()
    paths   = FONT_PATHS.get(os_name, FONT_PATHS['Linux'])
    print(f"OS: {os_name}")

    ok_r = extract_and_subset(
        paths['regular'], KR_INDEX,
        str(OUTPUT_DIR / 'NotoSansKR-Regular-Subset.ttf'),
        'Regular'
    )
    ok_b = extract_and_subset(
        paths['bold'], KR_INDEX,
        str(OUTPUT_DIR / 'NotoSansKR-Bold-Subset.ttf'),
        'Bold'
    )

    if ok_r and ok_b:
        print("\n✅ 폰트 서브셋 생성 완료")
    else:
        print("\n⚠️  일부 폰트 생성 실패. 시스템에 Noto CJK 폰트가 설치되어 있는지 확인하세요.")
        sys.exit(1)

if __name__ == '__main__':
    main()
