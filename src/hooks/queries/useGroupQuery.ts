import { useQuery, UseQueryResult } from 'react-query'

export type Member = {
    dataSource: any[],
    count: number
}

export const useGroupQuery = (): UseQueryResult<Member> => {
  return useQuery(
    ['GROUP'],
    () => {
      return require('../../public/mock/memberQuery.json')
    }
  )
}
