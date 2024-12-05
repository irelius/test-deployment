from app.models import db, Parent_B, environment, SCHEMA


# Adds parent_b seeds
def seed_parent_b():
    how_many_bi_parents = 3
    
    for parent in range(0, how_many_bi_parents):
        template = Parent_B(parent_b=f"bidirectional relantionship: parent b {parent+1}")
        db.session.add(template)
        
    db.session.commit()

def undo_parent_b():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.parent_bs RESTART IDENTITY CASCADE;")
    else:
        db.session.execute("DELETE FROM parent_bs")

    db.session.commit()
