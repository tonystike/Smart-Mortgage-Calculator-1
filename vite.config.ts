import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, (process as any).cwd(), '');
  return {
    plugins: [react()],
    define: {
      // Vercel/Netlify 환경변수에서 API_KEY를 가져와 코드에 주입
      'process.env.API_KEY': JSON.stringify(env.API_KEY)
    }
  };
});