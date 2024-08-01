import {
    render,
    waitFor,
    within,
    screen,
    prettyDOM,
    fireEvent
} from '@testing-library/react'
import App from './App'
import userEvent from "@testing-library/user-event"
// import mockUsersList from './mockData/mockUsersList'

describe("AutoComplete Tests", () => {
  it("Test that input field can accept user input", async () => {
    render(<App />, {})

    const autocomplete = screen.getByTestId('autocomplete-search')
    const input = within(autocomplete).getByRole('combobox')

    userEvent.type(input, 'Ben')
    expect(input).toHaveValue('Ben')
  })

  it('Renders options', async () => {
    render(<App />, {})

    await waitFor(() => expect(screen.getAllByText('Start typing to filter users')).toBeDefined())

    const combobox = screen.getByRole('combobox')

    fireEvent.change(combobox, { target: { value: 'Bauch, Clementine' } })

    const listbox = await waitFor(() => screen.getByRole('listbox'), { timeout: 2000 })

    expect(within(listbox).queryAllByRole('option').length).toBeGreaterThan(0)
  })
})