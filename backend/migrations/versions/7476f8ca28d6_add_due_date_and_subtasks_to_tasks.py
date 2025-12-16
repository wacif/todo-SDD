"""add_due_date_and_subtasks_to_tasks

Revision ID: 7476f8ca28d6
Revises: d4e6b7a2c9f1
Create Date: 2025-12-16 22:09:53.548922

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic
revision: str = '7476f8ca28d6'
down_revision: Union[str, None] = 'd4e6b7a2c9f1'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # Add due_date column (nullable datetime)
    op.add_column('tasks', sa.Column('due_date', sa.DateTime(), nullable=True))
    
    # Add subtasks column (JSON array stored as text, defaults to empty array)
    op.add_column('tasks', sa.Column('subtasks', sa.Text(), server_default='[]', nullable=False))


def downgrade() -> None:
    op.drop_column('tasks', 'subtasks')
    op.drop_column('tasks', 'due_date')
