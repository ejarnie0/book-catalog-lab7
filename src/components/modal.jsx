import { useEffect, useRef } from "react";

export default function Modal({ open, title, onClose, children }) {
    const overlayRef = useRef(null);

    useEffect(() => {
        if (!open) return;
        const onKey = (e) => { if (e.key === "Escape") onClose(); };
        document.addEventListener("keydown", onKey);
        // lock scroll
        const prev = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        return () => {
        document.removeEventListener("keydown", onKey);
        document.body.style.overflow = prev;
        };
    }, [open, onClose]);

    if (!open) return null;

    const handleOverlay = (e) => {
        if (e.target === overlayRef.current) onClose();
    };

    return (
        <div
        ref={overlayRef}
        className="modal-overlay"
        role="dialog"
        aria-modal="true"
        aria-label={title}
        onMouseDown={handleOverlay}
        >
        <div className="modal" onMouseDown={(e) => e.stopPropagation()}>
            {children}
        </div>
        </div>
    );
}
