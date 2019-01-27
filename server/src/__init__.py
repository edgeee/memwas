from .lib.storage import ensure_storage_bucket_exists
from .lib.datastore import ensure_stores_exists
from .lib.face_index import ensure_index_exists

ensure_storage_bucket_exists()
ensure_stores_exists()
ensure_index_exists()
