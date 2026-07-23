import { useEffect, useRef } from "react";

export const useInfiniteScroll = ({
  callback,
  disabled,
  rootMargin,
}: {
  callback: () => void;
  disabled?: boolean;
  rootMargin?: string;
}) => {
  const loadMoreRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    if (disabled || !loadMoreRef.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          callback();
        }
      },
      {
        rootMargin: rootMargin || "0px",
      },
    );
    observer.observe(loadMoreRef.current);
    return () => {
      observer.disconnect();
    };
  }, [callback, disabled, rootMargin]);

  return { loadMoreRef };
};
