from app.models import db, Parent_A, environment, SCHEMA


# Adds parent_a seeds
def seed_parent_a():
    how_many_uni_parents = 3
    
    for parent in range(0, how_many_uni_parents):
        template = Parent_A(parent_a=f"one directional relantionship: parent a {parent+1}")
        db.session.add(template)
        
    db.session.commit()

def undo_parent_a():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.parent_as RESTART IDENTITY CASCADE;")
    else:
        db.session.execute("DELETE FROM parent_as")

    db.session.commit()