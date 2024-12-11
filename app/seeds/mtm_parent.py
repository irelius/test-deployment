from app.models import db, MTM_Parent, environment, SCHEMA


# Adds many_a seeds
def seed_mtm_parent():
    mtm_parent_one = MTM_Parent(mtm_parent_col="mtm parent 1")
    mtm_parent_two = MTM_Parent(mtm_parent_col="mtm parent 2")
    mtm_parent_three = MTM_Parent(mtm_parent_col="mtm parent 3")

    db.session.add(mtm_parent_one)
    db.session.add(mtm_parent_two)
    db.session.add(mtm_parent_three)

    db.session.commit()

def undo_mtm_parent():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.mtm_parents RESTART IDENTITY CASCADE;")
    else:
        db.session.execute("DELETE FROM mtm_parents")

    db.session.commit()