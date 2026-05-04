-- MIGRACIÓN: Soporte para 3 responsables en servicios de niños (Sábados)
-- Añade columna para Consagración en el servicio de la tarde

ALTER TABLE schedule 
ADD COLUMN IF NOT EXISTS evening_consecration_leader_id UUID REFERENCES profiles(id);

COMMENT ON COLUMN schedule.evening_consecration_leader_id IS 'Líder de Consagración para servicios divididos (ej. Niños los Sábados)';
