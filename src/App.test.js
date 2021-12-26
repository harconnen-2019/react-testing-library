import {fireEvent, render, screen} from '@testing-library/react'
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

        expect(screen.getByAltText(/search image/)).toHaveClass('image')
        expect(screen.getByLabelText(/search/i)).not.toBeRequired()
        expect(screen.getByLabelText(/search/i)).toBeEmpty()
        expect(screen.getByLabelText(/search/i)).toHaveAttribute('id')
    })
})

describe('events', () => {
    test('Written text in input React', async () => {
        render(<App/>)
        // Ждем загрузки текста иначе будет ошибка в консоли
        await screen.findByText(/Logged in as/i)

        expect(screen.queryByText(/Searches for React/)).toBeNull()
        // вписываем текст
        fireEvent.change(screen.getByRole('textbox'), {
            target: {value: 'React'},
        })
        // eslint-disable-next-line testing-library/prefer-presence-queries
        expect(screen.queryByText(/Searches for React/)).toBeInTheDocument()
    })
    test('checkbox click', () => {
        const handleChange = jest.fn()
        const {container} = render(
            <input type="checkbox" onChange={handleChange}/>
        )
        // eslint-disable-next-line testing-library/no-node-access
        const checkbox = container.firstChild
        expect(checkbox).not.toBeChecked()
        fireEvent.click(checkbox)
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
