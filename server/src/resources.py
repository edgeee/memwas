import json

import falcon

from .lib.datastore import AlbumStore
from .lib.face_index import FaceIndex

_UPLOAD_CHUNK_SIZE_BYTES = 4096


class AlbumResource:
  def on_get(self, req, resp):
    """Returns a list of albums.
    """
    next_token = req.get_param('next_token')
    limit = req.get_param_as_int('limit')
    resp.media = AlbumStore.list_albums(next_token, limit)

  def on_post(self, req, resp):
    """Creates a new album.
    """
    doc = json.loads(req.bounded_stream.read())
    AlbumStore(doc['album_name'])
    resp.status = falcon.HTTP_201


class ImageListResource:

  def __init__(self):
    self._face_index = FaceIndex()

  def on_get(self, req, resp):
    """Returns a list of images in a specified album.
    """
    album_name = req.get_param('album_name', required=True)
    next_token = req.get_param('next_token')
    limit = req.get_param('limit')
    resp.media = AlbumStore(album_name).list_images(next_token, limit)

  def on_post(self, req, resp):
    """Indexes the faces in the posted image if any, then saves the image
     in the specified album.
    """
    album_name = req.get_param('album_name', required=True)
    image_bytes = b''
    while True:
      chunk = req.stream.read(_UPLOAD_CHUNK_SIZE_BYTES)
      if not chunk:
        break
      image_bytes += chunk
    image_metadata = self._face_index.save_and_index(
        album_name,
        image_bytes,
        req.content_type
    )
    resp.media = image_metadata
    resp.status = falcon.HTTP_201


class ImageSearchResource:

  def __init__(self):
    self._face_index = FaceIndex()

  def on_post(self, req, resp):
    """Searches all albums for images containing the faces present in the posted
    image.
    """
    image_bytes = b''
    while True:
      chunk = req.stream.read(_UPLOAD_CHUNK_SIZE_BYTES)
      if not chunk:
        break
      image_bytes += chunk
    search_results = self._face_index.search_indexed_faces(image_bytes)
    resp.media = search_results
