import json
from sqlalchemy.types import TypeDecorator, TEXT

class JsonEncodedList(TypeDecorator):
    """Enables storing a Python list in a single text column by JSON-encoding it.
    
    Automatically handles the conversion to and from a JSON string.
    """
    impl = TEXT
    cache_ok = True

    def process_bind_param(self, value, dialect):
        """
        This is called when sending data TO the database.
        It converts the Python list into a JSON string.
        """
        if value is None:
            return None
        if not isinstance(value, list):
            raise TypeError("JsonEncodedList can only store lists.")
        return json.dumps(value)

    def process_result_value(self, value, dialect):
        """
        This is called when fetching data FROM the database.
        It converts the JSON string back into a Python list.
        """
        if value is None:
            return None
        return json.loads(value)