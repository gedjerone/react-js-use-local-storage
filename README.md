### Кастомный хук useLocalStorage для React JS
#
#### *useLocalStorage* используется для сихнхронизации state и localStorage

> [!TIP]
> Почитать о том, как правильно реализовывать подобный хук и как он работает можно по ссылкам:
> [vue-use](https://github.com/vueuse/vueuse/blob/main/packages/core/useLocalStorage/index.ts),
> [react-hooks](https://usehooks-ts.com/react-hook/use-event-listener),
> [youtube](https://www.youtube.com/watch?v=1uiNxQIpcLU&ab_channel=CosdenSolutions)

> [!WARNING]
> Для данного проекта создана упрощённая версия (правильно сериализует только с объекты, не работает для SSR и т.д.)

#

#### Параметры
| Название | Тип | Описание |
| ------------- | ------------- | ------------- |
| `key` | `string` | Название ключа, под которым будет сохранено значение в *localStorage* |
| `initialValue` | `object` или `(() => object)` | Начальное значение (как и в useState можно использовать функцию для задания начального значения) |

#### Возращаемое значение (по аналогии с useState)
| Название | Тип | Описание |
| ------------- | ------------- | ------------- |
| `value` | `T` | Значение |
| `setValue` | `React.Dispatch<T>` | Метод для изменения значения |

# 

#### Удалить ключа из *localStorage* можно следующим образом
```javascript
setValue(() => '')
```

#

#### Пример использования
```jsx
import { useLocalStorage } from '@/hooks'
export const Component = () => {
const [state, setState] = useLocalStorage('test', {
  name: 'Maksim',
  status: 'busy',
  age: 23
})

const increaseUserAge = (user) => {
  return {
    ...user,
    age: user?.age + 1
  }
}

  return (
    <main>
      <p>Юзер: {state?.name ?? ''}</p>
      <p>Возраст: {state?.status ?? ''}</p>
      <p>Статус: {state?.age ?? 0}</p>
      <button
        onClick={
          () => setState((prev) => increaseUserAge(prev))
        }
      >Увеличить возраст</button>
    </main>
  )
}
```
