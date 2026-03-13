import gsap from 'gsap';

export const splitTextReveal = (elements: HTMLElement | HTMLElement[] | string | Element[], stagger: number = 0.04) => {
    return gsap.fromTo(
        elements,
        { y: 50, opacity: 0 },
        {
            y: 0,
            opacity: 1,
            duration: 1,
            stagger,
            ease: 'power4.out',
        }
    );
};

export const hoverMagnetic = (element: HTMLElement, e: MouseEvent, amount: number = 20) => {
    const rect = element.getBoundingClientRect();
    const relX = e.clientX - rect.left - rect.width / 2;
    const relY = e.clientY - rect.top - rect.height / 2;

    gsap.to(element, {
        x: (relX / rect.width) * amount,
        y: (relY / rect.height) * amount,
        duration: 0.3,
        ease: 'power2.out',
    });
};

export const resetMagnetic = (element: HTMLElement) => {
    gsap.to(element, {
        x: 0,
        y: 0,
        duration: 0.5,
        ease: 'elastic.out(1, 0.3)',
    });
};
