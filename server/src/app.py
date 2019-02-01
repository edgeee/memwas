import falcon
from falcon_cors import CORS

from .resources import AlbumResource, ImageListResource, ImageSearchResource


def create_app():
  cors = CORS(allow_origins_list=['http://localhost:8080'])
  api = falcon.API(middleware=[cors.middleware])

  api.add_route('/albums', AlbumResource())
  api.add_route('/search', ImageSearchResource())
  api.add_route('/images', ImageListResource())

  return api


def get_app():
  return create_app()
