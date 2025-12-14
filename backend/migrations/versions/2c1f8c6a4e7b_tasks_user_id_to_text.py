"""Change tasks.user_id from UUID to TEXT

Revision ID: 2c1f8c6a4e7b
Revises: 845261bb836c
Create Date: 2025-12-12

"""

from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = "2c1f8c6a4e7b"
down_revision: Union[str, None] = "845261bb836c"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # Drop UUID FK constraint to users (Better Auth uses external string IDs)
    op.drop_constraint("tasks_user_id_fkey", "tasks", type_="foreignkey")

    # Convert UUID column to TEXT (Postgres requires USING for cast)
    op.alter_column(
        "tasks",
        "user_id",
        existing_type=sa.Uuid(),
        type_=sa.Text(),
        existing_nullable=False,
        postgresql_using="user_id::text",
    )


def downgrade() -> None:
    # Best-effort downgrade: will fail if any user_id values are not UUID strings.
    op.alter_column(
        "tasks",
        "user_id",
        existing_type=sa.Text(),
        type_=sa.Uuid(),
        existing_nullable=False,
        postgresql_using="user_id::uuid",
    )

    op.create_foreign_key("tasks_user_id_fkey", "tasks", "users", ["user_id"], ["id"])
