import React from 'react'
import axios from 'axios'
import {act, render} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import News from './News'

jest.mock("axios");
const hits = [
    { objectID: "1", title: "Angular" },
    { objectID: "2", title: "React" },
];

describe("News", () => {
    it("fetches news from an API", async () => {
        axios.get.mockImplementationOnce(() => Promise.resolve({ data: { hits } }));
        const { getByRole, findAllByRole } = render(<News />);
        // eslint-disable-next-line testing-library/prefer-screen-queries
        userEvent.click(getByRole("button"));
        const items = await findAllByRole('listitem');
        expect(items).toHaveLength(2);
        // Следующие проверки - это аналоги
        expect(axios.get).toHaveBeenCalledTimes(1);
        expect(axios.get).toHaveBeenCalledWith(
            "http://hn.algolia.com/api/v1/search?query=React"
        );
    });

    // проверяем ошибку если нет коннекта
    it("fetches news from an API and reject", async () => {
        axios.get.mockImplementationOnce(() => Promise.reject(new Error()));
        const { getByRole, findByText } = render(<News />);
        userEvent.click(getByRole("button"));
        const message = await findByText(/Something went wrong/);
        expect(message).toBeInTheDocument();
    });

    // похож на первый вариант но использует метод act
    // не нужно ожидать загрузки // await findAllByRole('listitem')
    it("fetches news from an API (alternative)", async () => {
        const promise = Promise.resolve({ data: { hits } });
        axios.get.mockImplementationOnce(() => promise);
        const { getByRole, getAllByRole } = render(<News />);
        userEvent.click(getByRole("button"));
        await act(() => promise);
        expect(getAllByRole("listitem")).toHaveLength(2);
    });
});