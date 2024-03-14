import { useEffect } from "react";
import { useLayoutEffect } from "react";
import { useRef } from "react";

/**
 * Хук устанавливает слушатель события на window
 * @param {T} event
 * @param {(e: WindowEventMap[T]) => void} handler
 */
export function useWindowEventListener(event, handler) {
	const ref = useRef(handler)
	// Выполниться до отрисовки!!!
	useLayoutEffect(() => {
		ref.current = handler
	}, [handler])
	useEffect(() => {
		if (!(window && window.addEventListener)) throw new Error('Window object cannot defined')
		const listener = e => ref.current(e)
		window.addEventListener(event, listener)
		return () => window.removeEventListener(event, listener)
	}, [event])
}
