import React, { useRef } from 'react';
import { useTheme } from '../contexts/ThemeContext';

interface DraggableSidebarProps {
  children: React.ReactNode;
  onMove?: (left: number) => void;
}

export const DraggableSidebar: React.FC<DraggableSidebarProps> = ({ children, onMove }) => {
  const sidebarRef = useRef<HTMLDivElement>(null);
  const pos = useRef({ x: 0, left: 0 });

  const onMouseDown = (e: React.MouseEvent) => {
    if (!sidebarRef.current) return;
    pos.current.x = e.clientX;
    pos.current.left = sidebarRef.current.offsetLeft;
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  };

  const onMouseMove = (e: MouseEvent) => {
    if (!sidebarRef.current) return;
    const dx = e.clientX - pos.current.x;
    let newLeft = pos.current.left + dx;
    // Clamp to min/max if needed (optional)
    newLeft = Math.max(-200, Math.min(newLeft, 0));
    sidebarRef.current.style.left = `${newLeft}px`;
    if (onMove) onMove(newLeft);
  };

  const onMouseUp = () => {
    document.removeEventListener('mousemove', onMouseMove);
    document.removeEventListener('mouseup', onMouseUp);
  };

  const { resolvedTheme } = useTheme();
  return (
    <div
      ref={sidebarRef}
      style={{
        position: 'fixed',
        left: 0,
        top: '6rem',
        zIndex: 50,
        cursor: 'ew-resize',
        transition: 'box-shadow 0.2s',
        background: resolvedTheme === 'dark'
          ? 'radial-gradient(ellipse at 50% 0%, #4b206b 0%, #181028 60%, #0a0a0a 100%)'
          : 'white',
        borderTopLeftRadius: 0,
        margin: 0,
      }}
      className="w-64 h-screen border-r border-gray-200 dark:border-gray-700 shadow-lg"
      onMouseDown={onMouseDown}
      title="Drag to move sidebar"
    >
      {/* Optional: Add a visible drag handle at the top */}
      <div style={{ height: 0, background: '#e5e7eb', cursor: 'ew-resize', width: '100%' }} />
      {children}
    </div>
  );
}; 