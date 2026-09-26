import { useEffect } from "react";
import Lenis from "lenis";

export default function SmoothScroll() {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.15,
      smoothWheel: true,
      smoothTouch: false,
      wheelMultiplier: 0.9,
    });

    let frame;

    const raf = (time) => {
      lenis.raf(time);
      frame = requestAnimationFrame(raf);
    };

    frame = requestAnimationFrame(raf);

    // ============================================
    // STOP LENIS WHEN A MODAL IS OPEN
    // ============================================

    const handleModalOpen = () => {
      lenis.stop();
    };

    const handleModalClose = () => {
      lenis.start();
    };

    window.addEventListener("modal:open", handleModalOpen);
    window.addEventListener("modal:close", handleModalClose);

    return () => {
      cancelAnimationFrame(frame);

      window.removeEventListener(
        "modal:open",
        handleModalOpen
      );

      window.removeEventListener(
        "modal:close",
        handleModalClose
      );

      lenis.destroy();
    };
  }, []);

  return null;
}