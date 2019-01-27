import falcon

from .resources import AlbumResource, ImageListResource, ImageSearchResource


def create_app():
  api = falcon.API()
  api.add_route('/albums', AlbumResource())
  api.add_route('/search', ImageSearchResource())
  api.add_route('/images', ImageListResource())

  return api


def get_app():
  return create_app()
