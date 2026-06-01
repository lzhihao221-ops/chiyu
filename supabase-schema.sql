-- ========================================
-- 吃鱼 App - Supabase 数据库建表脚本
-- 在 Supabase Dashboard > SQL Editor 中执行
-- ========================================

-- 用户资料（注册时自动创建）
create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  username text default '匿名用户',
  created_at timestamptz default now()
);

-- 新用户注册自动创建 profile
create or replace function handle_new_user()
returns trigger as $$
begin
  insert into profiles (id, username)
  values (new.id, coalesce(new.raw_user_meta_data->>'username', '匿名用户'));
  return new;
end;
$$ language plpgsql security definer;

create or replace trigger on_auth_user_created
  after insert on auth.users
  for each row execute function handle_new_user();

-- 运动记录
create table if not exists workouts (
  id text primary key,
  user_id uuid references auth.users(id) on delete cascade,
  type text not null,
  duration int not null,
  note text default '',
  location jsonb,
  date text not null,
  created_at timestamptz default now()
);

-- 运动目标
create table if not exists goals (
  user_id uuid primary key references auth.users(id) on delete cascade,
  weekly_days int default 5,
  daily_minutes int default 30
);

-- 社区帖子
create table if not exists posts (
  id text primary key,
  user_id uuid references auth.users(id) on delete cascade,
  title text not null,
  content text default '',
  category text default 'share',
  images text[] default '{}',
  created_at timestamptz default now()
);

-- 点赞（多对多）
create table if not exists likes (
  post_id text references posts(id) on delete cascade,
  user_id uuid references auth.users(id) on delete cascade,
  primary key (post_id, user_id)
);

-- 评论
create table if not exists comments (
  id text primary key,
  post_id text references posts(id) on delete cascade,
  user_id uuid references auth.users(id) on delete cascade,
  content text not null,
  created_at timestamptz default now()
);

-- 知识库
create table if not exists knowledge (
  id text primary key,
  user_id uuid references auth.users(id) on delete cascade,
  title text not null,
  content text default '',
  category text default 'general',
  tags text[] default '{}',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 链接收藏
create table if not exists links (
  id text primary key,
  user_id uuid references auth.users(id) on delete cascade,
  url text not null,
  title text default '',
  description text default '',
  category text default 'general',
  created_at timestamptz default now()
);

-- RLS 策略：每人只能读写自己的数据，帖子/评论/点赞所有人可读
alter table profiles enable row level security;
alter table workouts enable row level security;
alter table goals enable row level security;
alter table posts enable row level security;
alter table likes enable row level security;
alter table comments enable row level security;
alter table knowledge enable row level security;
alter table links enable row level security;

-- profiles: 自己读写
create policy "Users can view own profile" on profiles for select using (auth.uid() = id);
create policy "Users can update own profile" on profiles for update using (auth.uid() = id);

-- workouts: 自己读写
create policy "Users can view own workouts" on workouts for select using (auth.uid() = user_id);
create policy "Users can insert own workouts" on workouts for insert with check (auth.uid() = user_id);
create policy "Users can delete own workouts" on workouts for delete using (auth.uid() = user_id);

-- goals: 自己读写
create policy "Users can view own goals" on goals for select using (auth.uid() = user_id);
create policy "Users can upsert own goals" on goals for insert with check (auth.uid() = user_id);
create policy "Users can update own goals" on goals for update using (auth.uid() = user_id);

-- posts: 所有人可读，自己可写
create policy "Anyone can view posts" on posts for select using (true);
create policy "Users can insert own posts" on posts for insert with check (auth.uid() = user_id);
create policy "Users can delete own posts" on posts for delete using (auth.uid() = user_id);

-- likes: 所有人可读，自己可写
create policy "Anyone can view likes" on likes for select using (true);
create policy "Users can insert own likes" on likes for insert with check (auth.uid() = user_id);
create policy "Users can delete own likes" on likes for delete using (auth.uid() = user_id);

-- comments: 所有人可读，自己可写
create policy "Anyone can view comments" on comments for select using (true);
create policy "Users can insert own comments" on comments for insert with check (auth.uid() = user_id);
create policy "Users can delete own comments" on comments for delete using (auth.uid() = user_id);

-- knowledge: 所有人可读，自己可写
create policy "Anyone can view knowledge" on knowledge for select using (true);
create policy "Users can insert own knowledge" on knowledge for insert with check (auth.uid() = user_id);
create policy "Users can update own knowledge" on knowledge for update using (auth.uid() = user_id);
create policy "Users can delete own knowledge" on knowledge for delete using (auth.uid() = user_id);

-- links: 所有人可读，自己可写
create policy "Anyone can view links" on links for select using (true);
create policy "Users can insert own links" on links for insert with check (auth.uid() = user_id);
create policy "Users can delete own links" on links for delete using (auth.uid() = user_id);
