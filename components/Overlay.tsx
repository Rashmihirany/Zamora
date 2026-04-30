'use client';

import { useStore } from '@/store/useStore';

export default function Overlay() {
  const { isSideMenuOpen, isFilterPanelOpen, isCartOpen, closeAll } = useStore();
  const isActive = isSideMenuOpen || isFilterPanelOpen || isCartOpen;

  return (
    <div
      className={`overlay ${isActive ? 'active' : ''}`}
      onClick={closeAll}
    ></div>
  );
}
