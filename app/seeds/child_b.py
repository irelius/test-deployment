from app.models import db, Child_B, environment, SCHEMA
import random

# Adds child_b seeds
def seed_child_b():
    how_many_bi_children = 3
    
    for child in range(0, how_many_bi_children):
        template = Child_B(child_b=f"bidirectional relationship: child b {child+1}", parent_b_id=random.randint(1, 3))
        db.session.add(template)
        
    db.session.commit()

def undo_child_b():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.child_b RESTART IDENTITY CASCADE;")
    else:
        db.session.execute("DELETE FROM child_b")

    db.session.commit()