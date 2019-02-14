import axios from 'axios'

const api = axios.create({
  baseURL: 'http://api.memwas.com'
})

export const listAlbums = ({ size, nextToken }) => {
  const params = { limit: size }
  if (nextToken) {
    params.next_token = nextToken
  }
  return api.get('/albums', { params }).then((resp) => resp.data)
}

export const fetchPhotos = ({ albumName, size, nextToken }) => {
  const params = { limit: size, album_name: albumName }
  if (nextToken) {
    params.next_token = nextToken
  }
  return api.get('/images', { params }).then((resp) => resp.data)
}

export const uploadPhoto = ({ photo, albumName }) => {
  const params = { album_name: albumName }
  return api.post('/images', photo, { params }).then((resp) => resp.data)
}

export const searchPhotos = (photoFile) => {
  return api.post('/search', photoFile).then((resp) => resp.data)
}
