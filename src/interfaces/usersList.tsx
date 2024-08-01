interface Iuser {
  id: number,
  name: string,
  username: string,
  email: string,
  address: object,
  phone: string,
  website: string,
  company: object,
  name2: string
}

export interface IusersList extends Array<Iuser>{}