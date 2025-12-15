"""Add task list indexes

Revision ID: d4e6b7a2c9f1
Revises: c3a0a1c0d9bf
Create Date: 2025-12-14

"""

from typing import Sequence, Union

from alembic import op


# revision identifiers, used by Alembic.
revision: str = "d4e6b7a2c9f1"
down_revision: Union[str, None] = "c3a0a1c0d9bf"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # Supports: list by user ordered by created_at
    op.create_index(
        "ix_tasks_user_id_created_at",
        "tasks",
        ["user_id", "created_at"],
        unique=False,
    )

    # Supports: list by user filtered by completed ordered by created_at
    op.create_index(
        "ix_tasks_user_id_completed_created_at",
        "tasks",
        ["user_id", "completed", "created_at"],
        unique=False,
    )

    # Supports: list by user filtered by priority ordered by created_at
    op.create_index(
        "ix_tasks_user_id_priority_created_at",
        "tasks",
        ["user_id", "priority", "created_at"],
        unique=False,
    )


def downgrade() -> None:
    op.drop_index("ix_tasks_user_id_priority_created_at", table_name="tasks")
    op.drop_index("ix_tasks_user_id_completed_created_at", table_name="tasks")
    op.drop_index("ix_tasks_user_id_created_at", table_name="tasks")
