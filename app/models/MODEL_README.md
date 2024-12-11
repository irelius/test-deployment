## Child_A, Parent_A
- One-to-many relationship from Parent_A to Child_A
    - One direction

- "db.ForeignKey" used to reference the primary key of Parent_A goes on Child_A

- "db.relationship" goes on Parent_A
    - `cascade='all, delete'` option used, just cuz


</br>
</br>

## Child_B, Parent_B
- One-to-many relationship from Parent_B to Child_B
    - Bi-directional

- "db.ForeignKey" used to reference the primary key of Parent_B goes on Child_B

- "db.relationship" goes on both Parent_B and Child_B
    - "back_populates" tag used on both relationship columns
        - References the column on the other table that sets up the relationship. DOES NOT refer to the table name

    - "backref" could be used instead of "back_populates"
        - "backref" only needs to be established on either parent or child table, not needed on both


</br>
</br>

## MTM_Parent, MTM_Child, MTM_Parent_Child
- Many-to-many relationship between MTM_Parent and MTM_Child. Joined through separate table: MTM_Parent_Child

- Bi-directional, so "db.relationship" needs to be established on each file
    - MTM_Parent establishes "mtm_children_relationship"
        - Refers to "MTM_Parent_Child" class
        - "back_populates" option used and its value refers to the ***property*** (not table name) established in join table (MTM_Parent_Child)
    
    - MTM_Child establishes "mtm_parent_relationship"
        - Refers to "MTM_Parent_Child" class
        - "back_populates" option used and its value refers to the ***property*** (not table name) established in join table (MTM_Parent_Child)

    - MTM_Parent_Child:
        - Has 2 "db.ForeignKey" columns to refer to the primary key of both MTM_Parent and MTM_Child
        - 2 "db.relationship" needed for MTM
            - One for MTM_Parent, "back_populates" option used and its value refers to "mtm_children_relationship" property of MTM_Parent
            - One for MTM_Child, "back_populates" option used and its value refers to the "mtm_parent_relationship" property of MTM_Child

- "secondary" option could be used. Allows for easier connection of many-to-many relationship, but this option prevents additional columns to be created on the join table
    - See the "MTM_Parent" and "MTM_Child" model files to see a commented out section that uses the "secondary" option
    - Not used due to the "extra_data" column on the "MTM_Parent_Child" table

    - MTM_Parent sets column "mtm_child_relationship"
        - The secondary is the name of the join table ("mtm_parent_children")
        - "back_populates" is the name of the column set on MTM_Child
    - MTM_Child sets column "mtm_parent_relationship"
        - The secondary is the name of the join table ("mtm_parent_children")
        - "back_populates" is the name of the column set on MTM_Parent
    - MTM_Parent_Child has...
        - 2 "db.ForeignKey" columns to reference the primary key of the two tables that it's joining
            - No need for a "db.relationship" to connect to the parent and child tables. This is the benefit of the "secondary" tag