import React from 'react';
import { useState } from 'react';

interface AdminPanelProps {
  isAdmin: boolean;
  setIsAdmin: (isAdmin: boolean) => void;
}

export default function AdminPanel({ isAdmin, setIsAdmin }: AdminPanelProps) {
  const [password, setPassword] = useState('');

  const handleAdminLogin = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // 실제 구현에서는 서버 측 인증을 사용해야 합니다.
    if (password === 'admin123') {
      setIsAdmin(true);
      setPassword('');
    } else {
      alert('잘못된 비밀번호입니다.');
    }
  };

  if (isAdmin) {
    return <button onClick={() => setIsAdmin(false)} className="mt-4 bg-gray-500 text-white px-4 py-2 rounded">관리자 모드 종료</button>;
  }

  return (
    <form onSubmit={handleAdminLogin} className="mt-4">
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="관리자 비밀번호"
        className="p-2 border rounded mr-2"
      />
      <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">관리자 로그인</button>
    </form>
  );
}
