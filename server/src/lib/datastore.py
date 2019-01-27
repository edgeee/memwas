import datetime

import boto3
from slugify import slugify

_DEFAULT_ITEMS_LIMIT = 20

class AlbumStore:

  IMAGE_STORE_NAME = 'album_images'
  ALBUM_STORE_NAME = 'albums'

  def __init__(self, album_name):
    self.client = boto3.client('sdb')
    self._album_name = album_name
    self._ensure_exists()

  def put_image(self, name, attributes):
    """Puts the given image metadata into this album.
    """
    attributes['album_name'] = self._album_name
    attributes['created_at'] = str(datetime.datetime.now())
    self.client.put_attributes(
        DomainName=AlbumStore.IMAGE_STORE_NAME,
        ItemName=name,
        Attributes=_build_attribute_list(attributes)
    )

  def list_images(self, next_token=None, limit=None):
    """Returns a list of the photos in this album.
    """
    limit = limit or _DEFAULT_ITEMS_LIMIT
    select_expr = 'select * from {0} where album_name = "{1}" limit {2}'.format(
        AlbumStore.IMAGE_STORE_NAME,
        self._album_name,
        limit
    )
    return _list_items_helper(self.client, select_expr, next_token)

  @staticmethod
  def list_albums(next_token=None, limit=None):
    """Returns a list of all albums present.
    """
    limit = limit or _DEFAULT_ITEMS_LIMIT
    client = boto3.client('sdb')
    select_expr = 'select * from {0} limit {1}'.format(
        AlbumStore.ALBUM_STORE_NAME,
        limit
    )
    return _list_items_helper(client, select_expr, next_token)

  def _ensure_exists(self):
    """Ensures this album item exists.
    """
    attrs = {
        'human_readable_name': self._album_name,
        'created_at': str(datetime.datetime.now())
    }
    self.client.put_attributes(
        DomainName=AlbumStore.ALBUM_STORE_NAME,
        ItemName=slugify(self._album_name),
        Attributes=_build_attribute_list(attrs)
    )


def _build_attribute_list(attrs):
  attrs_list = []
  for name, value in attrs.items():
    attrs_list.append({
        'Name': name,
        'Value': value
    })
  return attrs_list


def _build_items_from_attribute_list(attrs_list):
  item_list = []
  for current in attrs_list:
    item = {'name': current['Name']}
    for attr in current['Attributes']:
      item[attr['Name']] = attr['Value']
    item_list.append(item)
  return item_list


def _list_items_helper(client, select_expr, next_token=None):
  kwargs = {
      'SelectExpression': select_expr,
      'ConsistentRead': True
  }
  if next_token:
    kwargs['NextToken'] = next_token
  resp = client.select(**kwargs)
  return {
      'next_token': ('NextToken' in resp and resp['NextToken']) or None,
      'items': _build_items_from_attribute_list(('Items' in resp and resp['Items']) or []),
  }


def ensure_stores_exists():
  """Ensures various stores used exists.
  """
  client = boto3.client('sdb')
  def _try_helper(store_name):
    try:
      client.create_domain(DomainName=store_name)
    except Exception:
      pass

  _try_helper(AlbumStore.IMAGE_STORE_NAME)
  _try_helper(AlbumStore.ALBUM_STORE_NAME)
