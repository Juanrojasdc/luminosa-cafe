<?php

declare(strict_types=1);

namespace App\Migrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20261105100324 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE TABLE `admin` (id_admin INT AUTO_INCREMENT NOT NULL, first_name VARCHAR(255) NOT NULL, last_name VARCHAR(255) NOT NULL, email VARCHAR(255) NOT NULL, password VARCHAR(255) NOT NULL, UNIQUE INDEX UNIQ_880E0D76E7927C74 (email), PRIMARY KEY (id_admin)) ENGINE=InnoDB DEFAULT CHARACTER SET utf8mb4');
        $this->addSql('CREATE TABLE category (id_category INT AUTO_INCREMENT NOT NULL, name VARCHAR(255) NOT NULL, description LONGTEXT DEFAULT NULL, image VARCHAR(255) DEFAULT NULL, display_order INT NOT NULL, UNIQUE INDEX UNIQ_64C19C15E237E06 (name), PRIMARY KEY (id_category)) ENGINE=InnoDB DEFAULT CHARACTER SET utf8mb4');
        $this->addSql('CREATE TABLE event (id_event INT AUTO_INCREMENT NOT NULL, title VARCHAR(255) NOT NULL, description LONGTEXT NOT NULL, event_date DATE NOT NULL, start_time TIME NOT NULL, end_time TIME NOT NULL, image VARCHAR(255) DEFAULT NULL, PRIMARY KEY (id_event)) ENGINE=InnoDB DEFAULT CHARACTER SET utf8mb4');
        $this->addSql('CREATE TABLE food_characteristic (id_food_characteristic INT AUTO_INCREMENT NOT NULL, name VARCHAR(255) NOT NULL, PRIMARY KEY (id_food_characteristic)) ENGINE=InnoDB DEFAULT CHARACTER SET utf8mb4');
        $this->addSql('CREATE TABLE product (id_product INT AUTO_INCREMENT NOT NULL, name VARCHAR(255) NOT NULL, description LONGTEXT NOT NULL, price NUMERIC(10, 2) NOT NULL, image VARCHAR(255) DEFAULT NULL, is_available TINYINT NOT NULL, display_order INT NOT NULL, is_featured TINYINT NOT NULL, id_category INT NOT NULL, INDEX IDX_D34A04AD5697F554 (id_category), PRIMARY KEY (id_product)) ENGINE=InnoDB DEFAULT CHARACTER SET utf8mb4');
        $this->addSql('CREATE TABLE product_food_characteristic (id_product INT NOT NULL, id_food_characteristic INT NOT NULL, INDEX IDX_653F8D09DD7ADDD (id_product), INDEX IDX_653F8D097A94FA50 (id_food_characteristic), PRIMARY KEY (id_product, id_food_characteristic)) ENGINE=InnoDB DEFAULT CHARACTER SET utf8mb4');
        $this->addSql('ALTER TABLE product ADD CONSTRAINT FK_D34A04AD5697F554 FOREIGN KEY (id_category) REFERENCES category (id_category) ON DELETE RESTRICT');
        $this->addSql('ALTER TABLE product_food_characteristic ADD CONSTRAINT FK_653F8D09DD7ADDD FOREIGN KEY (id_product) REFERENCES product (id_product) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE product_food_characteristic ADD CONSTRAINT FK_653F8D097A94FA50 FOREIGN KEY (id_food_characteristic) REFERENCES food_characteristic (id_food_characteristic) ON DELETE CASCADE');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE product DROP FOREIGN KEY FK_D34A04AD5697F554');
        $this->addSql('ALTER TABLE product_food_characteristic DROP FOREIGN KEY FK_653F8D09DD7ADDD');
        $this->addSql('ALTER TABLE product_food_characteristic DROP FOREIGN KEY FK_653F8D097A94FA50');
        $this->addSql('DROP TABLE `admin`');
        $this->addSql('DROP TABLE category');
        $this->addSql('DROP TABLE event');
        $this->addSql('DROP TABLE food_characteristic');
        $this->addSql('DROP TABLE product');
        $this->addSql('DROP TABLE product_food_characteristic');
    }
}
