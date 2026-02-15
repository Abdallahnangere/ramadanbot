-- Broadcast Messages System
-- Allows admin to send notifications to all users on /app

CREATE TABLE broadcast_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  action_link TEXT,
  action_label VARCHAR(100) DEFAULT 'Learn More',
  status VARCHAR(20) NOT NULL DEFAULT 'draft',
  created_by UUID NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  
  -- Foreign key to users table
  CONSTRAINT fk_created_by FOREIGN KEY (created_by) REFERENCES users(id)
);

-- Track which users have seen/read each message
CREATE TABLE broadcast_read_receipts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  message_id UUID NOT NULL REFERENCES broadcast_messages(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  read_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  
  -- Ensure one receipt per user per message
  UNIQUE(message_id, user_id)
);

-- Indexes for performance
CREATE INDEX idx_broadcast_messages_status ON broadcast_messages(status);
CREATE INDEX idx_broadcast_messages_created_by ON broadcast_messages(created_by);
CREATE INDEX idx_broadcast_messages_created_at ON broadcast_messages(created_at DESC);
CREATE INDEX idx_broadcast_read_receipts_message_id ON broadcast_read_receipts(message_id);
CREATE INDEX idx_broadcast_read_receipts_user_id ON broadcast_read_receipts(user_id);

-- Add status validation constraint
ALTER TABLE broadcast_messages 
ADD CONSTRAINT check_valid_status 
CHECK (status IN ('draft', 'active', 'paused', 'finished', 'deleted'));
