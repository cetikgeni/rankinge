-- Add server-side validation constraints for contact_messages table
-- This prevents malicious clients from bypassing frontend validation

-- Add constraint for name length (1-100 characters)
ALTER TABLE public.contact_messages
ADD CONSTRAINT contact_messages_name_length 
CHECK (char_length(name) BETWEEN 1 AND 100);

-- Add constraint for email length (1-255 characters)
ALTER TABLE public.contact_messages
ADD CONSTRAINT contact_messages_email_length 
CHECK (char_length(email) BETWEEN 1 AND 255);

-- Add constraint for email format validation
ALTER TABLE public.contact_messages
ADD CONSTRAINT contact_messages_email_format 
CHECK (email ~* '^[^\s@]+@[^\s@]+\.[^\s@]+$');

-- Add constraint for message length (1-5000 characters)
ALTER TABLE public.contact_messages
ADD CONSTRAINT contact_messages_message_length 
CHECK (char_length(message) BETWEEN 1 AND 5000);