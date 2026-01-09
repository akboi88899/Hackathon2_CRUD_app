"""Add recurring task fields

Revision ID: 004_add_recurring_tasks
Revises: 003_add_task_deadline
Create Date: 2026-01-10

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '004'
down_revision = '003'
branch_labels = None
depends_on = None


def upgrade() -> None:
    # Add recurring task fields
    op.add_column('tasks', sa.Column('is_recurring', sa.Boolean(), nullable=False, server_default='false'))
    op.add_column('tasks', sa.Column('recurrence_type', sa.String(length=20), nullable=True))
    op.add_column('tasks', sa.Column('recurrence_interval', sa.Integer(), nullable=True))
    op.add_column('tasks', sa.Column('recurrence_days', sa.String(length=50), nullable=True))
    op.add_column('tasks', sa.Column('recurrence_end_date', sa.DateTime(), nullable=True))


def downgrade() -> None:
    # Remove recurring task fields
    op.drop_column('tasks', 'recurrence_end_date')
    op.drop_column('tasks', 'recurrence_days')
    op.drop_column('tasks', 'recurrence_interval')
    op.drop_column('tasks', 'recurrence_type')
    op.drop_column('tasks', 'is_recurring')
