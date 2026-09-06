-- 할 일 마감 시각(선택 입력) 컬럼 추가.
-- NULL = 시각 미지정. 날짜는 기존과 동일하게 todos.due_date 가 담당하며,
-- 이 컬럼은 하루 중 시각만 보관한다.
--
-- 기존 레코드의 due_date 시각 파트에는 '생성 시각'이 들어 있어 마감 시각으로 재사용할 수 없다.
-- 따라서 기존 데이터를 변경하지 않는 가산적(additive) 컬럼 추가 방식을 택했다.

ALTER TABLE public.todos
	ADD COLUMN IF NOT EXISTS due_time time;

COMMENT ON COLUMN public.todos.due_time IS '할 일 마감 시각 (선택). NULL이면 시각 미지정이며 날짜 단위로만 관리된다.';
