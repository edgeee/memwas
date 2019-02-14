import io
from PIL import Image

size = 64, 64 # 256, 256
THUMBNAIL_PREFIX_STR = 'thumbnail_'

def generate_thumbnail(image_bytes):
  img = Image.open(io.BytesIO(image_bytes))
  img.thumbnail(size)
  buffer = io.BytesIO()
  img.save(buffer, img.format)
  return buffer.getvalue()


def build_thumbnail_filename(key_string):
  return '{}{}'.format(THUMBNAIL_PREFIX_STR, key_string)


def build_thumbnail_url(source_url):
  parts = source_url.rsplit('/', 1)
  return '{}/{}'.format(parts[0], THUMBNAIL_PREFIX_STR + parts[1])
