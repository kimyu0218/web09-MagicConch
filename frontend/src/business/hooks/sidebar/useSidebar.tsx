import { useEffect, useMemo, useRef, useState } from 'react';

export function useSidebar() {
  const [sidebarOpened, setSidebarOpened] = useState(false);

  const mainRef = useRef<HTMLDivElement>(null);
  const sidebarRef = useRef<HTMLDivElement>(null);

  const sideBarWidth = useMemo(() => sidebarRef.current?.clientWidth, [sidebarRef.current?.clientWidth]);

  const showSidebar = () => {
    requestAnimationFrame(() => {
      if (!mainRef.current || !sidebarRef.current) return;

      // mainRef.current.style.transition = `transform 0.5s ease-in-out`;
      // sidebarRef.current.style.transition = `transform 0.5s ease-in-out`;
      mainRef.current.style.transform = `translateX(-${sideBarWidth}px)`;
      sidebarRef.current.style.transform = `translateX(-${sideBarWidth}px)`;
      setSidebarOpened(true);
    });
  };

  const hideSidebar = () => {
    requestAnimationFrame(() => {
      if (!mainRef.current || !sidebarRef.current) return;

      // mainRef.current.style.transition = ``;
      // sidebarRef.current.style.transition = ``;
      mainRef.current.style.transform = ``;
      sidebarRef.current.style.transform = ``;
      setSidebarOpened(false);
    });
  };

  const toggleSidebar = () => {
    if (sidebarOpened) {
      hideSidebar();
    } else {
      showSidebar();
    }
  };

  useEffect(() => {
    if (!sidebarRef.current || !mainRef.current) return;

    mainRef.current.style.transition = `transform 0.5s ease-in-out`;
    sidebarRef.current.style.transition = `transform 0.5s ease-in-out`;

    mainRef.current.ontransitionend = () => {
      console.log('end');
    };
  }, []);

  return { mainRef, sidebarRef, toggleSidebar, sidebarOpened };
}
