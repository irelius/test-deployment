from .db import db

# One-to-Many from Parent_B to Child_B. Bi-directional

class Child_B(db.Model):
    __tablename__ = 'child_bs'

    id = db.Column(db.Integer, primary_key=True)
    child_b = db.Column(db.String(100), nullable=False)
    
    parent_b_id = db.Column(db.Integer, db.ForeignKey("parent_bs.id"))
    parent_b = db.relationship("Parent_B", back_populates="child_b")
    
    def to_dict(self):
        return {
            'id': self.id,
            'child_b': self.child_b,
            'parent_b_id': self.parent_b_id
        }