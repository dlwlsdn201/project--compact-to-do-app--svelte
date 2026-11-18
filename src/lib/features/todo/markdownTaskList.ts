import { micromark } from 'micromark';
import {
	gfmTaskListItem,
	gfmTaskListItemHtml
} from 'micromark-extension-gfm-task-list-item';

const TASK_ITEM_PATTERN = /^([\t ]*(?:[-+*]|\d+[.)])[\t ]+\[)([ xX])(\])(?=[\t ])/;
const BLOCKQUOTE_PREFIX_PATTERN = /^(?: {0,3}>[\t ]?)+/;
const FENCE_PATTERN = /^ {0,3}(`{3,}|~{3,})/;
const TASK_CHECKBOX_PATTERN = /<input type="checkbox" disabled=""( checked="")? \/>/g;

/**
 * 코드 영역을 제외한 체크리스트 줄의 인덱스와 원문 위치를 반환한다.
 * @returns 체크리스트 항목이 나타나는 줄의 인덱스
 */
const getTaskLineIndices = (markdown: string): number[] => {
	const lines = markdown.split(/\r\n|\n|\r/);
	const taskLineIndices: number[] = [];
	let fenceCharacter: string | null = null;
	let fenceLength = 0;

	lines.forEach((line, lineIndex) => {
		const taskLine = line.slice(BLOCKQUOTE_PREFIX_PATTERN.exec(line)?.[0].length ?? 0);
		const fence = FENCE_PATTERN.exec(taskLine)?.[1];

		if (fenceCharacter) {
			if (fence?.[0] === fenceCharacter && fence.length >= fenceLength) {
				fenceCharacter = null;
				fenceLength = 0;
			}
			return;
		}

		if (fence) {
			fenceCharacter = fence[0];
			fenceLength = fence.length;
			return;
		}

		if (TASK_ITEM_PATTERN.test(taskLine)) taskLineIndices.push(lineIndex);
	});

	return taskLineIndices;
};

/**
 * GFM 체크리스트를 클릭 가능한 입력으로 렌더링한다.
 * @returns 안전하게 렌더링된 마크다운 HTML
 */
export const renderMarkdownTaskList = (markdown: string, isSaving: boolean): string => {
	let taskIndex = 0;
	const html = micromark(markdown, {
		allowDangerousHtml: false,
		allowDangerousProtocol: false,
		extensions: [gfmTaskListItem()],
		htmlExtensions: [gfmTaskListItemHtml()]
	});

	return html.replace(TASK_CHECKBOX_PATTERN, (_match, checkedAttribute: string | undefined) => {
		const currentTaskIndex = taskIndex;
		taskIndex += 1;
		const state = checkedAttribute ? '완료' : '미완료';
		const disabledAttribute = isSaving ? ' disabled=""' : '';

		return `<input type="checkbox"${checkedAttribute ?? ''} data-task-index="${currentTaskIndex}" aria-label="체크 항목 ${currentTaskIndex + 1}, ${state}" class="mr-2 size-4 cursor-pointer align-middle accent-primary disabled:cursor-wait"${disabledAttribute} />`;
	});
};

/**
 * 지정한 체크리스트 항목의 완료 상태를 마크다운 원문에 반영한다.
 * @returns 변경한 마크다운. 항목을 찾지 못했거나 상태가 같으면 null.
 */
export const updateMarkdownTaskItem = (
	markdown: string,
	taskIndex: number,
	isChecked: boolean
): string | null => {
	const taskLineIndex = getTaskLineIndices(markdown)[taskIndex];
	if (taskLineIndex === undefined) return null;

	const lines = markdown.split(/(\r\n|\n|\r)/);
	const linePartIndex = taskLineIndex * 2;
	const line = lines[linePartIndex];
	const quotePrefix = BLOCKQUOTE_PREFIX_PATTERN.exec(line)?.[0] ?? '';
	const taskLine = line.slice(quotePrefix.length);
	const match = TASK_ITEM_PATTERN.exec(taskLine);
	if (!match) return null;

	const nextCheckValue = isChecked ? 'x' : ' ';
	if (match[2].toLowerCase() === nextCheckValue) return null;

	lines[linePartIndex] = `${quotePrefix}${match[1]}${nextCheckValue}${match[3]}${taskLine.slice(match[0].length)}`;
	return lines.join('');
};
