import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { currentReleaseNotes } from './releaseNotes';

// docs/release-versioning-guide.md 기준: 손으로 맞춰야 하는 것은
// package.json의 version과 releaseNotes.ts의 currentReleaseNotes 한 세트다.
// 앱 헤더의 버전 뱃지는 package.json을 따르므로, 둘이 어긋나면
// 사용자에게 다른 버전의 릴리즈 노트가 노출된다.
// vitest는 프로젝트 루트에서 실행되므로 cwd 기준으로 읽는다.
const pkg = JSON.parse(readFileSync(resolve(process.cwd(), 'package.json'), 'utf8')) as {
	version: string;
};

describe('currentReleaseNotes', () => {
	it('package.json의 version과 동일한 버전을 가리킨다', () => {
		expect(currentReleaseNotes.version).toBe(pkg.version);
	});

	it('제목과 표시용 날짜가 비어 있지 않다', () => {
		expect(currentReleaseNotes.title.trim()).not.toBe('');
		expect(currentReleaseNotes.updatedAt.trim()).not.toBe('');
	});

	it('신규 기능 항목의 요약이 비어 있지 않다', () => {
		expect(currentReleaseNotes.features.length).toBeGreaterThan(0);
		for (const feature of currentReleaseNotes.features) {
			expect(feature.summary.trim()).not.toBe('');
		}
	});
});
