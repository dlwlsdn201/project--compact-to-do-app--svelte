-- 할 일 프리셋(템플릿) 테이블.
-- 사용자가 자주 쓰는 제목·내용·우선순위 형식을 저장해두고,
-- 신규 할 일 등록 시 한 번의 선택으로 입력 폼을 채우기 위해 사용한다.

CREATE TABLE IF NOT EXISTS public.todo_presets (
	id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users (id) ON DELETE CASCADE,
	-- 프리셋을 고르는 기준이 되는 이름 (예: '주간 보고')
	name text NOT NULL,
	-- 프리셋 선택 시 폼에 채워질 값들
	title text NOT NULL,
	content text,
	priority text NOT NULL DEFAULT 'medium' CHECK (priority = ANY (ARRAY['low', 'medium', 'high'])),
	created_at timestamptz NOT NULL DEFAULT now()
);

-- 한 사용자 안에서 프리셋 이름은 중복되지 않는다.
CREATE UNIQUE INDEX IF NOT EXISTS todo_presets_user_id_name_key
	ON public.todo_presets (user_id, name);

CREATE INDEX IF NOT EXISTS todo_presets_user_id_created_at_idx
	ON public.todo_presets (user_id, created_at DESC);

ALTER TABLE public.todo_presets ENABLE ROW LEVEL SECURITY;

-- todos 와 동일한 소유자 기반 정책
DROP POLICY IF EXISTS "Users can view own presets" ON public.todo_presets;
CREATE POLICY "Users can view own presets"
	ON public.todo_presets FOR SELECT
	USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own presets" ON public.todo_presets;
CREATE POLICY "Users can insert own presets"
	ON public.todo_presets FOR INSERT
	WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own presets" ON public.todo_presets;
CREATE POLICY "Users can update own presets"
	ON public.todo_presets FOR UPDATE
	USING (auth.uid() = user_id)
	WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete own presets" ON public.todo_presets;
CREATE POLICY "Users can delete own presets"
	ON public.todo_presets FOR DELETE
	USING (auth.uid() = user_id);
