-- Esquema de base de datos — Look Makers
-- Pensado para Supabase (usa auth.users nativo).
-- Si usas Neon en vez de Supabase, reemplaza las referencias a auth.users
-- por una tabla propia "usuarios" con autenticación manejada por NextAuth.

create table if not exists servicios (
  id uuid primary key default gen_random_uuid(),
  nombre text not null,
  categoria text not null check (categoria in ('pestanas', 'cejas')),
  duracion_min int not null,
  precio numeric not null,
  descripcion text,
  creado_en timestamptz default now()
);

create table if not exists profesionales (
  id uuid primary key default gen_random_uuid(),
  nombre text not null,
  foto_url text
);

create table if not exists disponibilidad (
  id uuid primary key default gen_random_uuid(),
  profesional_id uuid references profesionales(id) on delete cascade,
  dia_semana int not null, -- 0 = domingo ... 6 = sábado
  hora_inicio time not null,
  hora_fin time not null,
  bloqueado boolean default false
);

create table if not exists citas (
  id uuid primary key default gen_random_uuid(),
  usuario_id uuid references auth.users(id) on delete cascade,
  servicio_id uuid references servicios(id),
  profesional_id uuid references profesionales(id),
  fecha date not null,
  hora_inicio time not null,
  hora_fin time not null,
  estado text not null default 'pendiente'
    check (estado in ('pendiente', 'confirmada', 'completada', 'cancelada', 'no_asistio')),
  abono_pagado boolean default false,
  monto_abono numeric,
  metodo_pago text,
  creada_en timestamptz default now(),
  -- Evita doble reserva del mismo profesional en el mismo horario
  unique (profesional_id, fecha, hora_inicio)
);

create table if not exists resenas (
  id uuid primary key default gen_random_uuid(),
  cita_id uuid references citas(id) on delete cascade,
  usuario_id uuid references auth.users(id),
  calificacion int check (calificacion between 1 and 5),
  comentario text,
  foto_url text,
  creada_en timestamptz default now()
);

-- Row Level Security básica (Supabase)
alter table citas enable row level security;
alter table resenas enable row level security;

create policy "usuarios ven sus propias citas"
  on citas for select
  using (auth.uid() = usuario_id);

create policy "usuarios crean sus propias citas"
  on citas for insert
  with check (auth.uid() = usuario_id);

create policy "usuarios ven sus propias resenas"
  on resenas for select
  using (auth.uid() = usuario_id);

-- Vista pública de solo lectura: expone qué horarios ya están ocupados
-- (sin usuario_id ni datos de pago) para poder calcular disponibilidad
-- desde el navegador sin exponer las citas de otras personas.
-- security_invoker = false hace que la vista se ejecute con los permisos
-- de quien la creó, evitando que la política de RLS de "citas" (que solo
-- deja ver las citas propias) bloquee este cálculo de horarios libres.
create view horarios_ocupados
with (security_invoker = false) as
select profesional_id, fecha, hora_inicio, hora_fin
from citas
where estado in ('pendiente', 'confirmada', 'completada');

grant select on horarios_ocupados to anon, authenticated;

-- Datos de ejemplo
insert into servicios (nombre, categoria, duracion_min, precio, descripcion) values
  ('Pestañas clásicas', 'pestanas', 90, 65000, 'Aplicación uno a uno para un efecto natural.'),
  ('Volumen ruso', 'pestanas', 120, 95000, 'Abanicos de varias fibras para un look intenso.'),
  ('Laminado de cejas', 'cejas', 45, 45000, 'Cejas peinadas y fijadas con efecto full-density.');

insert into profesionales (nombre) values ('Valentina Restrepo');

-- Horario habitual: martes a sábado, 9:00 a. m. a 6:00 p. m.
-- (dia_semana: 0 = domingo ... 6 = sábado)
insert into disponibilidad (profesional_id, dia_semana, hora_inicio, hora_fin)
select id, dia, '09:00', '18:00'
from profesionales, unnest(array[2, 3, 4, 5, 6]) as dia
where nombre = 'Valentina Restrepo';
