-- Custom SQL migration file, put you code below! --
    -- Create virtual table to allow for a full text search
CREATE VIRTUAL TABLE IF NOT EXISTS recipe_fts USING fts5(id UNINDEXED, name, description, tokenize=porter, content=recipe, content_rowid=id);
--> statement-breakpoint

-- Create triggers to keep the virtual table in sync with the first table
CREATE TRIGGER IF NOT EXISTS recipe_fts_insert AFTER INSERT ON recipe BEGIN
	INSERT INTO recipe_fts(id, name, description) VALUES (new.id, new.name, new.description);
END;
--> statement-breakpoint

CREATE TRIGGER IF NOT EXISTS recipe_fts_update AFTER UPDATE ON recipe BEGIN
	UPDATE recipe_fts SET id = new.id, name = new.name, description = new.description WHERE id = old.id;
END;
--> statement-breakpoint

CREATE TRIGGER IF NOT EXISTS recipe_fts_delete AFTER DELETE ON recipe BEGIN
	DELETE FROM recipe_fts WHERE id = old.id;
END;
