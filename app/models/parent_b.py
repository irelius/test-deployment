from .db import db

class Parent_B(db.Model):
    __tablename__ = 'parent_bs'

    id = db.Column(db.Integer, primary_key=True)
    parent_b = db.Column(db.String(100), nullable=False)
    
    child_b = db.relationship("Child_B", back_populates="parent_b", cascade="all, delete")
    
    
    def to_dict(self):
        return {
            'id': self.id,
            'parent_b': self.parent_b
        }
