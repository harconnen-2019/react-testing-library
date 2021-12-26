import {fireEvent, render, screen} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from './App'

/*
Search variants:
    getBy:                    queryBy:                    findBy:
        - getByText               - queryByText               - findByText
        - getByRole               - queryByRole               - findByRole
        - getByLabelText          - queryByLabelText          - findByLabelText
        - getByPlaceholderText    - queryByPlaceholderText    - findByPlaceholderText
        - getByAltText            - queryByAltText            - findByAltText
        - getByDisplayValue       - queryByDisplayValue       - findByDisplayValue
        - getAllBy                - queryAllBy                - findAllBy
        */

/*
Assertive Functions:
- toBeDisabled            - toBeEnabled               - toBeEmpty
- toBeEmptyDOMElement     - toBeInTheDocument         - toBeInvalid
- toBeRequired            - toBeValid                 - toBeVisible
- toContainElement        - toContainHTML             - toHaveAttribute
- toHaveClass             - toHaveFocus               - toHaveFormValues
- toHaveStyle             - toHaveTextContent         - toHaveValue
- toHaveDisplayValue      - toBeChecked               - toBePartiallyChecked
- toHaveDescription
*/

describe('App', () => {
    test('renders App component', async () => {
        render(<App/>)
        // screen.getByRole('')

        expect(screen.queryByText(/Logged in as/i)).toBeNull()
        // screen.debug();
        expect(await screen.findByText(/Logged in as/)).toBeInTheDocument()
        // screen.debug();

        expect(screen.getByText(/Search:/i)).toBeInTheDocument()
        expect(screen.getByRole('textbox')).toBeInTheDocument()
        expect(screen.getByLabelText(/search/i)).toBeInTheDocument()
        expect(screen.getByPlaceholderText('search text...')).toBeInTheDocument()
        expect(screen.getByAltText('search image')).toBeInTheDocument()
        expect(screen.getByDisplayValue('')).toBeInTheDocument()

        // Разные варианты проверок (справа)
        expect(screen.getByAltText(/search image/)).toHaveClass('image')
        expect(screen.getByLabelText(/search/i)).not.toBeRequired()
        expect(screen.getByLabelText(/search/i)).toBeEmptyDOMElement()
        expect(screen.getByLabelText(/search/i)).toHaveAttribute('id')
    })
})

describe('events', () => {
    test('Written text in input React', async () => {
        render(<App/>)
        // Ждем загрузки текста иначе будет ошибка в консоли
        await screen.findByText(/Logged in as/i)
        // проверяем что текста нет
        expect(screen.queryByText(/Searches for React/)).toBeNull()
        // вписываем текст
        fireEvent.change(screen.getByRole('textbox'), {
            target: {value: 'React'},
        })
        // можем использовать вместо fireEvent
        userEvent.type(screen.getByRole('textbox'), 'React')
        // текст появился
        // eslint-disable-next-line testing-library/prefer-presence-queries
        expect(screen.queryByText(/Searches for React/)).toBeInTheDocument()
    })
    test('checkbox click', () => {
        const handleChange = jest.fn()
        // рендерим не компонент а данные
        const {container} = render(
            <input type="checkbox" onChange={handleChange}/>
        )

        // пробуем разные варианты поиска вместо getByRole
        // eslint-disable-next-line testing-library/no-node-access
        const checkbox = container.firstChild
        // проверяем что поле не выбрано
        expect(checkbox).not.toBeChecked()
        // кликаем на поле
        // fireEvent.click(checkbox)

        // можно вместо fireEvent
        userEvent.click(checkbox)
        // можем добавить доп опции: были ли нажаты кнопки Ctrl Shift
        // userEvent.click(checkbox, { ctrlKey: true, shiftKey: true });

        // проверяем была ли вызвана функция (пример: либо это либо следующее)
        expect(handleChange).toHaveBeenCalledTimes(1)
        expect(checkbox).toBeChecked()
    })

    test('input focus', () => {
        render(
            <input type="text" data-testid="simple-input"/>
        )
        const input = screen.getByTestId('simple-input')
        expect(input).not.toHaveFocus()
        input.focus()
        expect(input).toHaveFocus()
    })
})


// UserEvent

describe('events 2', () => {

    it('double click', () => {
        const onChange = jest.fn()
        const {container} = render(<input type="checkbox" onChange={onChange}/>)
        const checkbox = container.firstChild
        expect(checkbox).not.toBeChecked()
        userEvent.dblClick(checkbox)
        expect(onChange).toHaveBeenCalledTimes(2)
    })

    it('focus', () => {
        /**
         * Эмулируем поведение пользователя
         * перемещение по полям кнопкой TAB
         */
        const {getAllByTestId} = render(
            <div>
                <input data-testid="element" type="checkbox"/>
                <input data-testid="element" type="radio"/>
                <input data-testid="element" type="number"/>
            </div>
        )
        const [checkbox, radio, number] = getAllByTestId('element')
        userEvent.tab()
        expect(checkbox).toHaveFocus()
        userEvent.tab()
        expect(radio).toHaveFocus()
        userEvent.tab()
        expect(number).toHaveFocus()
    })

    it('select option', () => {
        const {selectOptions, getByRole, getByText} = render(
            <select>
                <option value="1">A</option>
                <option value="2">B</option>
                <option value="3">C</option>
            </select>
        )

        userEvent.selectOptions(getByRole('combobox'), '1')
        expect(getByText('A').selected).toBeTruthy()

        userEvent.selectOptions(getByRole('combobox'), '2')
        expect(getByText('B').selected).toBeTruthy()
        // С этого поля выбор снят - проверка
        expect(getByText('A').selected).toBeFalsy()
    })
})
