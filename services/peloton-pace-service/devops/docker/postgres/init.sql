DROP TABLE IF EXISTS "users" CASCADE;
DROP SEQUENCE IF EXISTS sequence_number;
CREATE SEQUENCE sequence_number MINVALUE 1;
CREATE TABLE users ( data jsonb );
CREATE UNIQUE INDEX users_lookup_ix ON users USING btree ((data->>'id')::bigint);

-- CREATE TRIGGER users_journal_trigger AFTER INSERT OR UPDATE OR DELETE ON users FOR EACH ROW EXECUTE PROCEDURE insert_to_update_journal();
