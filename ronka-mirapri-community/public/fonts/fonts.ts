import localFont from 'next/font/local';

// 1. Pretendard 가변 폰트
export const pretendard = localFont({
  src: './PretendardVariable.woff2',
  display: 'swap',
  weight: '45 920', // 가변 두께 범위
  variable: '--font-pretendard',
});

// 2. REM 가변 폰트
export const rem = localFont({
  src: './REM-VariableFont_wght.ttf',
  display: 'swap',
  weight: '100 900', // TTF 가변 폰트 범위
  variable: '--font-rem',
});

// 3. Galmuri11 (Regular & Bold 개별 파일)
export const galmuri = localFont({
  src: [
    {
      path: './Galmuri11.woff2',
      weight: '400',
      style: 'normal',
    },
    {
      path: './Galmuri11-Bold.woff2',
      weight: '700',
      style: 'normal',
    },
  ],
  display: 'swap',
  variable: '--font-galmuri',
});