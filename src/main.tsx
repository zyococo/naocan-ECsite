import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// 本番環境でのエラーハンドリング
const handleError = (error: ErrorEvent) => {
  console.warn('Application error caught:', error.error);
  // エラーをログに記録するが、アプリケーションを停止しない
};

const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
  console.warn('Unhandled promise rejection:', event.reason);
  // プロミスエラーをログに記録するが、アプリケーションを停止しない
};

// グローバルエラーハンドラーを設定
window.addEventListener('error', handleError);
window.addEventListener('unhandledrejection', handleUnhandledRejection);

// DOM要素の存在確認
const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error('Root element not found');
}

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
