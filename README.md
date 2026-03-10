# Watch the Bible

현재 시각에 맞는 성경 구절을 화면에 표시하는 웹 애플리케이션입니다. 시간의 흐름에 따라 텍스트가 금색으로 채워지는 애니메이션 효과가 적용됩니다.

## 기술 스택

- [SvelteKit](https://svelte.dev/docs/kit) + [Svelte 5](https://svelte.dev)
- [TypeScript](https://www.typescriptlang.org)
- [Tailwind CSS 4](https://tailwindcss.com)
- [Vite](https://vite.dev)

## 시작하기

```sh
npm install
npm run dev
```

브라우저에서 자동으로 열려면:

```sh
npm run dev -- --open
```

## 스크립트

| 명령어                 | 설명                        |
| ---------------------- | --------------------------- |
| `npm run dev`          | 개발 서버 실행              |
| `npm run build`        | 프로덕션 빌드               |
| `npm run preview`      | 빌드 결과 미리보기          |
| `npm run check`        | TypeScript/Svelte 타입 검사 |
| `npm run lint`         | ESLint 검사                 |
| `npm run lint:fix`     | ESLint 자동 수정            |
| `npm run format`       | Prettier 포맷팅             |
| `npm run format:check` | 포맷팅 확인                 |

## 코드 품질

- **ESLint** — TypeScript + Svelte 린트 규칙 적용
- **Prettier** — 코드 포맷팅 (탭, 작은따옴표, Tailwind 클래스 정렬)
- **Husky + lint-staged** — 커밋 시 자동으로 린트 및 포맷팅 실행
