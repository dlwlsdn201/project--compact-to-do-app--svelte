import { createClient } from '@supabase/supabase-js';
import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY } from '$env/static/public';

// 환경변수가 없을 경우에 대한 예외 처리를 추가하여 개발 환경에서 에러 방지
if (!PUBLIC_SUPABASE_URL || !PUBLIC_SUPABASE_ANON_KEY) {
	console.warn('Supabase 환경변수가 설정되지 않았습니다.');
}

export const supabase = createClient(
	PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co',
	PUBLIC_SUPABASE_ANON_KEY || 'placeholder'
);
