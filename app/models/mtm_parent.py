from .db import db

class MTM_Parent(db.Model):
    __tablename__ = 'mtm_parents'

    id = db.Column(db.Integer, primary_key=True)
    mtm_parent_col = db.Column(db.String(100), nullable=False)

    mtm_children_relationship = db.relationship("MTM_Parent_Child", back_populates="mtm_parent_join")
    

    def to_dict(self):
        return {
            'id': self.id,
            "mtm_parent_col": self.mtm_parent_col
        }


# -------------------------------------------------------------------------


# # class with "secondary" option
# class MTM_Parent(db.Model):
#     __tablename__ = 'mtm_parents'

#     id = db.Column(db.Integer, primary_key=True)
#     mtm_parent_col = db.Column(db.String(100), nullable=False)

#     mtm_children_relationship = db.relationship("MTM_Child", secondary="mtm_parent_children", back_populates="mtm_parent_relationship")


#     def to_dict(self):
#         return {
#             'id': self.id,
#             "mtm_parent_col": self.mtm_parent_col
#         }
