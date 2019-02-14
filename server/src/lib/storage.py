import mimetypes
import uuid

import boto3

_S3_BUCKET_NAME_ = 'memwas-album'


class FileStorage(object):

  def __init__(self):
    self.client = boto3.client('s3')

  def save(self, file_bytes, content_type, key=None):
    """Saves a file to storage and return metadata about the saved file.
    """
    if not key:
      key = uuid.uuid4().hex

    key = key + '{}'.format((mimetypes.guess_extension(content_type) or ''))
    self.client.put_object(
        ACL='public-read',
        Body=file_bytes,
        Bucket=_S3_BUCKET_NAME_,
        Key=key
    )
    return {
        'key': key,
        's3_bucket': _S3_BUCKET_NAME_,
        's3_url': self.convert_key_to_s3_url(key)
    }

  def convert_key_to_s3_url(self, key):
    return '{}/{}/{}'.format(self.client.meta.endpoint_url, _S3_BUCKET_NAME_, key)


def ensure_storage_bucket_exists():
  """Ensures the storage bucket exists. Creates it if it doesn't.
  """
  client = boto3.client('s3')
  try:
    client.create_bucket(
        ACL='public-read',
        Bucket=_S3_BUCKET_NAME_
    )
  except Exception:
    pass
