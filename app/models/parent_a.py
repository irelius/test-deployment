from .db import db, environment, SCHEMA, add_prefix_for_prod

# One-to-Many from Parent_A to Child_A. One direction

class Parent_A(db.Model):
    __tablename__ = 'parent_a'
    
    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    parent_a = db.Column(db.String(100), nullable=False)
    
    # Set relationship from Parent_A row to Child_A where Child_A table has a parent_id that matches this parent_a row.
    # Cascade is set to "all, delete" so that all children rows delete when this parent row deletes
    child_a = db.relationship("Child_A", cascade="all, delete")
    
    def to_dict(self):
        return {
            'id': self.id,
            'parent_a': self.parent_a
        }
