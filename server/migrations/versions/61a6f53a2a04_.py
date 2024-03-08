"""empty message

Revision ID: 61a6f53a2a04
Revises: a4a303f52f1a
Create Date: 2024-02-26 01:26:03.340554

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '61a6f53a2a04'
down_revision = 'a4a303f52f1a'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('tasks', schema=None) as batch_op:
        batch_op.drop_constraint('fk_tasks_time_entry_id_time_entries', type_='foreignkey')
        batch_op.drop_column('time_entry_id')

    with op.batch_alter_table('time_entries', schema=None) as batch_op:
        batch_op.create_foreign_key(batch_op.f('fk_time_entries_task_id_tasks'), 'tasks', ['task_id'], ['id'])

    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('time_entries', schema=None) as batch_op:
        batch_op.drop_constraint(batch_op.f('fk_time_entries_task_id_tasks'), type_='foreignkey')

    with op.batch_alter_table('tasks', schema=None) as batch_op:
        batch_op.add_column(sa.Column('time_entry_id', sa.INTEGER(), nullable=True))
        batch_op.create_foreign_key('fk_tasks_time_entry_id_time_entries', 'time_entries', ['time_entry_id'], ['id'])

    # ### end Alembic commands ###
