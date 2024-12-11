from app.models import db, Child_A, environment, SCHEMA
import random

# Adds child_a seeds
def seed_child_a():
    how_many_uni_children = 3
    
    for child in range(0, how_many_uni_children):
        template = Child_A(child_a=f"one directional relationship: child b {child+1}", parent_a_id=random.randint(1, 3))
        db.session.add(template)
        
    db.session.commit()

def undo_child_a():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.child_a RESTART IDENTITY CASCADE;")
    else:
        db.session.execute("DELETE FROM child_a")

    db.session.commit()
