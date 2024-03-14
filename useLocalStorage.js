import { useWindowEventListener } from "./useWindowEventListener"
import { useState, useCallback, useEffect } from "react"

/**
 * Хук, который использует localStorage и возвращает привычные для useState [value, setValue]
 * @param {string} key Ключ по которому будет полученно значение из localStorage
 * @param {T | (() => T)} initialValue Начальное значение
 * @returns {[T, React.Dispatch<T>]} [value, setValue]
 * ---
 * {@link https://github.com/gedjerone/react-js-use-local-storage.git Пример использования}
 */
export function useLocalStorage(key, initialValue) {
	// Сериализует строку в объект при чтении из стора и записывает в стор объект представленный в виде строки
	const serializer = {
		read: v => JSON.parse(v),
		write: v => JSON.stringify(v)
	}
	// Кэшируем начальное значение, если оно задаётся функцией
	const readLocalStorage = useCallback(() => {
		const init = initialValue instanceof Function ? initialValue() : initialValue
		try {
			const data = window.localStorage.getItem(key)
			return data ? serializer.read(data) : init
		} catch (error) {
			console.error(`Не возможно прочитать значение из localStorage по ключу ${key}. Ошибка: `, error)
			return init
		}
	}, [initialValue, key])
	// В этом стейте храним значение из стора
	const [storageValue, setStorageValue] = useState(() => {
		return initialValue instanceof Function ? initialValue() : initialValue
	})
	// Данная функция позволяет и обновить значение в localStorage и в state
	const setValue = useCallback(value => {
		// Без этого может выдавать ошибки при сборке
		if (typeof window === 'undefined') console.warn('Хук невозможно использовать не на клиенте')
		try {
			const nextValue = value instanceof Function ? value(readLocalStorage()) : value
			// Если передадим пустую строку то удалим записть в localStorage
			if (nextValue === '') {
				window.localStorage.removeItem(key)
				return
			}
			window.localStorage.setItem(key, serializer.write(nextValue))
			setStorageValue(nextValue)
			// Если существует одновременно несколько хуков useLocalStorage позволит их синхронизировать
			window.dispatchEvent(new StorageEvent('local-storage', { key }))
		} catch (error) {
			console.error(`Не получилось установить значение для ключа ${key}. Ошибка: `, error)
		}
	})
	// Если изменяется ключ, то меняем отслеживаемое значение в localStorage в соответствии с новым значением key
	useEffect(() => {
		setStorageValue(readLocalStorage())
	}, [key])
	// Если в каком то из запущенных хуков useLocalStorage было изменено значение по текущему ключу, то прочитаем его
	const handleLocalStorageChanges = useCallback((e) => {
		if (!e) return
		setStorageValue(readLocalStorage())
	}, [key, readLocalStorage])
	// Позволит синхронизировать несколько вкладок
        // Т.к. событие storage является дефолтным и вызывается браузером для обновления localStorage
	useWindowEventListener('storage', handleLocalStorageChanges)
	// Слушаем кастомное событие local-storage
	useWindowEventListener('local-storage', handleLocalStorageChanges)
	return [storageValue, setValue]
}
