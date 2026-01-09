"""Add recurring task columns to existing database"""
from src.database import engine
import sqlalchemy as sa

def add_recurring_columns():
    with engine.begin() as conn:
        try:
            # Add columns one by one
            conn.execute(sa.text("ALTER TABLE tasks ADD COLUMN IF NOT EXISTS is_recurring BOOLEAN DEFAULT FALSE"))
            print("✓ Added is_recurring column")
            
            conn.execute(sa.text("ALTER TABLE tasks ADD COLUMN IF NOT EXISTS recurrence_type VARCHAR(20)"))
            print("✓ Added recurrence_type column")
            
            conn.execute(sa.text("ALTER TABLE tasks ADD COLUMN IF NOT EXISTS recurrence_interval INTEGER"))
            print("✓ Added recurrence_interval column")
            
            conn.execute(sa.text("ALTER TABLE tasks ADD COLUMN IF NOT EXISTS recurrence_days VARCHAR(50)"))
            print("✓ Added recurrence_days column")
            
            conn.execute(sa.text("ALTER TABLE tasks ADD COLUMN IF NOT EXISTS recurrence_end_date TIMESTAMP"))
            print("✓ Added recurrence_end_date column")
            
            print("\n✅ All recurring task columns added successfully!")
            
        except Exception as e:
            print(f"❌ Error: {e}")

if __name__ == "__main__":
    add_recurring_columns()
