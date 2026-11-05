import api from '../lib/apiClient'

export const getHealth = async () => {
  const response = await api.get('/health')
  return response.data
}
