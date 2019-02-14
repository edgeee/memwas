import uuid
import boto3

from .storage import FileStorage
from .datastore import AlbumStore
from .image_utils import generate_thumbnail, build_thumbnail_url, build_thumbnail_filename


_COLLECTION_INDEX_NAME_ = 'memwas'
_FACE_MATCH_THRESHOLD_ = 80


class FaceIndex(object):

  def __init__(self):
    self.client = boto3.client('rekognition')
    self._storage = FileStorage()

  def save_and_index(self, album_name, image_bytes, content_type):
    """Saves and indexes the provided image, returning image metadata.
    """
    if not self._image_has_faces(image_bytes):
      return None
    filename = uuid.uuid4().hex
    image_metadata = self._storage.save(image_bytes, content_type, filename)
    self._storage.save(
        generate_thumbnail(image_bytes),
        content_type,
        build_thumbnail_filename(filename)
    )

    resp = self.client.index_faces(
        CollectionId=_COLLECTION_INDEX_NAME_,
        Image={'S3Object': {'Bucket': image_metadata['s3_bucket'], 'Name': image_metadata['key']}},
        ExternalImageId=image_metadata['key']
    )
    ret_value = {
        'image_url': image_metadata['s3_url'],
        'key': image_metadata['key'],
        'recorded_faces': []
    }
    album_store = AlbumStore(album_name)
    album_store.put_image(ret_value['key'], {
        'image_url': ret_value['image_url'],
        'image_thumbnail_url': build_thumbnail_url(ret_value['image_url'])
    })
    for record in resp['FaceRecords']:
      ret_value['recorded_faces'].append(self._normalize_face_attrs(record['Face']))
    return ret_value


  def search_indexed_faces(self, image_bytes):
    """Returns metadata images having the face(s) in the provided image in them.
    """
    resp = self.client.search_faces_by_image(
        CollectionId=_COLLECTION_INDEX_NAME_,
        Image={'Bytes': image_bytes},
        FaceMatchThreshold=_FACE_MATCH_THRESHOLD_
    )
    image_urls_map = {}
    for face_match in resp['FaceMatches']:
      face = self._normalize_face_attrs(face_match['Face'])
      image_url = self._storage.convert_key_to_s3_url(
          face_match['Face']['ExternalImageId']
      )
      image_urls_map[image_url] = (
          image_urls_map[image_url] if 'image_url' in image_urls_map else [])
      image_urls_map[image_url].append(face)

    retval = []
    for image_url, faces in image_urls_map.items():
      retval.append({
        'image_url': image_url,
        'matches': faces,
        'image_thumbnail_url': build_thumbnail_url(image_url)
      })

    return {
        'items': retval,
        'count': len(retval)
    }

  def _normalize_face_attrs(self, face):
    ret_value = {
        'face_id': face['FaceId'],
        'confidence': face['Confidence'],
        'similarity': ('Similarity' in face and face['Similarity']) or None,
        'bounding_box': {
            'width': face['BoundingBox']['Width'],
            'height': face['BoundingBox']['Height'],
            'left': face['BoundingBox']['Left'],
            'top': face['BoundingBox']['Top'],
        }
    }
    return ret_value

  def _image_has_faces(self, image_bytes):
    """Returns True if the image has faces in it, else returns False.
    """
    resp = self.client.detect_faces(Image=dict(Bytes=image_bytes))
    if 'FaceDetails' in resp:
      return resp['FaceDetails']
    return False


def ensure_index_exists():
  """Ensures the index for storing detected faces exists. Creates it if it doesn't.
  """
  client = boto3.client('rekognition')
  try:
    client.create_collection(CollectionId=_COLLECTION_INDEX_NAME_)
  except Exception:
    pass
