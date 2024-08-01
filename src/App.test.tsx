import {
    render,
    within
} from '@testing-library/react'
import App from './App'
import userEvent from "@testing-library/user-event"

describe("AutoComplete Tests", () => {
  it("Test that input field can accept user input", async () => {
    const { getByTestId } = render(<App />, {})

    const autocomplete = getByTestId('autocomplete-search')
    const input = within(autocomplete).getByRole('combobox')

    userEvent.type(input, 'Ben')
    expect(input).toHaveValue('Ben')
  })
})