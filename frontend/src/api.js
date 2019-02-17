import axios from 'axios'

const api = axios.create({
  baseURL: 'http://localhost:5000',
  timeout: 15000
})

export const fetchAlbums = ({ limit, offset }) => {
  const params = { limit, offset }
  return api.get('/albums', { params }).then((resp) => resp.data)
}

export const fetchPhotos = ({ albumId, offset, limit }) => {
  const params = { limit, offset, album_id: albumId }
  return api.get('/photos', { params }).then((resp) => resp.data)
}

export const uploadPhoto = ({ photo, albumId }) => {
  const params = { album_id: albumId }
  const headers = { 'Content-Type': 'application/octet-stream' }

  return api.post('/photos', photo, { params, headers }).then((resp) => resp.data)
}

export const searchPhotos = (photoFile) => {
  const headers = { 'Content-Type': 'application/octet-stream' }
  return api.post('/photos/search', photoFile, { headers }).then((resp) => resp.data)
}
