import { useEffect, useState } from 'react'
import './App.css'
import '@fontsource/roboto/400.css'
import TextField from '@mui/material/TextField'
import Stack from '@mui/material/Stack'
import Autocomplete from '@mui/material/Autocomplete'
import { IusersList } from './interfaces/usersList'
import { Iaddress } from './interfaces/address'

function dynamicSort(property: any) {
  // Shameless pull from Stack Overflow
  // Sorts any alpha-numeric array of objects
  let sortOrder = 1
  if(property[0] === "-") {
      sortOrder = -1
      property = property.substr(1)
  }
  return function (a: any, b:any) {
      let result = (a[property] < b[property]) ? -1 : (a[property] > b[property]) ? 1 : 0
      return result * sortOrder
  }
}

const isTitle = (value: string): boolean => {
  // Kind-of hacky, but at least this way we can easily add new Titles as we become aware of them
  const regex = /^(Miss.|Mr.|Mrs.|Ms.|Mss.|Dr.)$/
  return regex.test(value)
}

const isSuffix = (value: string): boolean => {
  // Kind-of hacky, but at least this way we can easily add new Suffixes as we become aware of them
  const regex = /^(II|III|IV|V|VI|VII|VII|VIII|IX|X|XI|XII|XIII|Jr.)$/
  return regex.test(value)
}

const getAdjustedName = (name: string): string => {
  // Define some variables
  let adjustedName, title, suffix, firstName, lastName

  // Split the name into an array at the spaces
  let splitName = name.split(' ')

  // Determine if the name has a Title
  const hasTitle = isTitle(splitName[0])

  // Determine if the name has a Suffix
  const hasSuffix = isSuffix(splitName[splitName.length - 1])

  // If it has a Title let's store it in a variable and then strip that off the array.
  if (hasTitle) {
    title = splitName[0]
    splitName = splitName.slice(1)

    // Attach the Title to the first name, so where ever the first name goes, the suffix will follow
    firstName = `${splitName[0]} (${title})`
  } else {
    firstName = splitName[0]
  }

  // If it has a Suffix, let's store it in a variable and then strip it off the array.
  if (hasSuffix) {
    suffix = splitName.slice(-1)
    splitName = splitName.slice(0, -1)

    // Attach the Suffix to the last name, regardless of how many names are in the last name
    lastName = `${splitName.slice(1, splitName.length)} ${suffix}`
  } else {
    lastName = `${splitName.slice(1, splitName.length)}`
  }

  // Next, let's put the last name first, the first name last, etc...
  adjustedName = `${lastName}, ${firstName}`

  return adjustedName
}

const changeNameOrder = (usersList: IusersList) => {
  usersList.forEach((user: { name: string, name2: string }) => {
    let newUserName = getAdjustedName(user.name)
    user.name2 = newUserName
  })
  return usersList
}

function App() {
  const [usersList, setUsersList] = useState<IusersList>([])
  const [userDetails, setUserDetails] = useState<null | {username: String, address: Iaddress}>(null)

  useEffect(() => {
    async function fetchUsers() {
      let response = await fetch('https://jsonplaceholder.typicode.com/users')
      let responseJSON = await response.json()
      let adjustedUsersList = await changeNameOrder(responseJSON)
      let alphabetizedList = await adjustedUsersList.sort(dynamicSort("name2"))
      setUsersList(alphabetizedList)
    }
    fetchUsers()
  }, [])

  return <>{
    !!usersList && (
    <div className="App">
      <div className="App-header">
        <Stack spacing={2} sx={{ width: 300 }}>
          <Autocomplete
            id="autocompleteSearch"
            data-testid='autocomplete-search'
            options={usersList.map((option: { name2: string }) => (option.name2))}
            renderInput={(params) => <TextField {...params} label="Start typing to filter users" />}
            onChange={(event, newValue) => {
              let index = usersList.findIndex((user: { name2: string }) => user.name2 === newValue)
              setUserDetails({
                username: usersList[index]?.name2,
                address: usersList[index]?.address
              })
            }}
          />
          {
            !!userDetails ?
              <div className='userDetails'>
                <p>{userDetails?.username}</p>
                <p>{userDetails?.address?.street}</p>
                <p>{userDetails?.address?.suite}</p>
                <p>{userDetails?.address?.city}</p>
                <p>{userDetails?.address?.zipcode}</p>
              </div>
            : null
          }
        </Stack>
      </div>
    </div>
  )}</>
}

export default App