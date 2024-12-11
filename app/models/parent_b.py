from .db import db, environment, SCHEMA, add_prefix_for_prod

class Parent_B(db.Model):
    __tablename__ = 'parent_b'
    
    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    parent_b = db.Column(db.String(100), nullable=False)
    
    child_b = db.relationship("Child_B", back_populates="parent_b", cascade="all, delete")
    
    
    def to_dict(self):
        return {
            'id': self.id,
            'parent_b': self.parent_b
        }
