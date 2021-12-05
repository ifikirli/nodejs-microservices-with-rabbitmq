GRANT ALL PRIVILEGES ON DATABASE microservicedb TO microservicedb_user;
CREATE OR REPLACE FUNCTION on_update_timestamp() RETURNS trigger AS $on_update_timestamp$
  BEGIN
      NEW.updated_at = now();
      RETURN NEW;
  END;
$on_update_timestamp$ LANGUAGE plpgsql;
    LANGUAGE plpgsql
ALTER FUNCTION on_update_timestamp() OWNER TO microservicedb_user;