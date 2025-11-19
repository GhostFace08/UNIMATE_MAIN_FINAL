-- Create finance_goals table for user financial goals
CREATE TABLE public.finance_goals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title text NOT NULL,
  target_amount numeric NOT NULL,
  current_amount numeric DEFAULT 0,
  deadline date,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE public.finance_goals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own finance goals" ON public.finance_goals
FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own finance goals" ON public.finance_goals
FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own finance goals" ON public.finance_goals
FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own finance goals" ON public.finance_goals
FOR DELETE USING (auth.uid() = user_id);

-- Create career_resumes table for uploaded resumes
CREATE TABLE public.career_resumes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  file_name text NOT NULL,
  file_data text NOT NULL,
  upload_date timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE public.career_resumes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own resumes" ON public.career_resumes
FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own resumes" ON public.career_resumes
FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own resumes" ON public.career_resumes
FOR DELETE USING (auth.uid() = user_id);

-- Add trigger for updated_at on finance_goals
CREATE TRIGGER update_finance_goals_updated_at
BEFORE UPDATE ON public.finance_goals
FOR EACH ROW
EXECUTE FUNCTION public.handle_updated_at();