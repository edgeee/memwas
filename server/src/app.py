import falcon
from falcon_cors import CORS

from .resources import AlbumResource, ImageListResource, ImageSearchResource


def create_app():
  cors = CORS(allow_origins_list=[
      'http://127.0.0.1:8080',
      'http://localhost:8080',
      'http://www.memwas.com',
      'http://memwas.com'
  ])
  api = falcon.API(middleware=[cors.middleware])
  api.add_route('/albums', AlbumResource())
  api.add_route('/search', ImageSearchResource())
  api.add_route('/images', ImageListResource())

  return api


def get_app():
  return create_app()
