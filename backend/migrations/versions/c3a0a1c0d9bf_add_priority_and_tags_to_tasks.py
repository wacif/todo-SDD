"""Add priority and tags to tasks

Revision ID: c3a0a1c0d9bf
Revises: 2c1f8c6a4e7b
Create Date: 2025-12-13

"""

from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = "c3a0a1c0d9bf"
down_revision: Union[str, None] = "2c1f8c6a4e7b"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.add_column(
        "tasks",
        sa.Column(
            "priority",
            sa.String(length=10),
            nullable=False,
            server_default="medium",
        ),
    )
    op.add_column(
        "tasks",
        sa.Column(
            "tags",
            sa.Text(),
            nullable=False,
            server_default="[]",
        ),
    )


def downgrade() -> None:
    op.drop_column("tasks", "tags")
    op.drop_column("tasks", "priority")
