"use client";
import { useEffect, useRef, useState } from "react";
import CountUp from "react-countup";

export default function CounterUp({ count, time }) {
    const [isVisible, setIsVisible] = useState(false);
    const ref = useRef(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    observer.disconnect();
                }
            },
            { threshold: 0.1 }
        );

        if (ref.current) {
            observer.observe(ref.current);
        }

        return () => {
            observer.disconnect();
        };
    }, []);

    return <span ref={ref}>{isVisible ? <CountUp end={count} duration={time} /> : <span>0</span>}</span>;
}
