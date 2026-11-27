-- Données de référence pour une installation neuve de Luminosa.
-- À exécuter séquentiellement. La colonne name n'a pas de contrainte UNIQUE :
-- ce script évite les doublons lors de réexécutions séquentielles, pas concurrentes.
SET NAMES utf8mb4;
START TRANSACTION;

INSERT INTO food_characteristic (name)
SELECT 'Végétarien' WHERE NOT EXISTS (SELECT 1 FROM food_characteristic WHERE name = 'Végétarien');
INSERT INTO food_characteristic (name)
SELECT 'Végan' WHERE NOT EXISTS (SELECT 1 FROM food_characteristic WHERE name = 'Végan');
INSERT INTO food_characteristic (name)
SELECT 'Sans lactose' WHERE NOT EXISTS (SELECT 1 FROM food_characteristic WHERE name = 'Sans lactose');
INSERT INTO food_characteristic (name)
SELECT 'Sans gluten' WHERE NOT EXISTS (SELECT 1 FROM food_characteristic WHERE name = 'Sans gluten');
INSERT INTO food_characteristic (name)
SELECT 'Sans sucres ajoutés' WHERE NOT EXISTS (SELECT 1 FROM food_characteristic WHERE name = 'Sans sucres ajoutés');
INSERT INTO food_characteristic (name)
SELECT 'Bio' WHERE NOT EXISTS (SELECT 1 FROM food_characteristic WHERE name = 'Bio');
INSERT INTO food_characteristic (name)
SELECT 'Riche en protéines' WHERE NOT EXISTS (SELECT 1 FROM food_characteristic WHERE name = 'Riche en protéines');
INSERT INTO food_characteristic (name)
SELECT 'Antioxydant' WHERE NOT EXISTS (SELECT 1 FROM food_characteristic WHERE name = 'Antioxydant');

COMMIT;
