from app.models import db, MTM_Child, environment, SCHEMA


# Adds many_b seeds
def seed_mtm_child():
    mtm_child_one = MTM_Child(mtm_child_col="mtm child 1")
    mtm_child_two = MTM_Child(mtm_child_col="mtm child 2")
    mtm_child_three = MTM_Child(mtm_child_col="mtm child 3")

    db.session.add(mtm_child_one)
    db.session.add(mtm_child_two)
    db.session.add(mtm_child_three)

    db.session.commit()

def undo_mtm_child():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.mtm_children RESTART IDENTITY CASCADE;")
    else:
        db.session.execute("DELETE FROM mtm_children")

    db.session.commit()