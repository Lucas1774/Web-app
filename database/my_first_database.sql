-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

-- -----------------------------------------------------
-- Schema mydb
-- -----------------------------------------------------
-- -----------------------------------------------------
-- Schema my_first_database
-- -----------------------------------------------------

-- -----------------------------------------------------
-- Schema my_first_database
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `my_first_database` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci ;
USE `my_first_database` ;

-- -----------------------------------------------------
-- Table `my_first_database`.`my_table`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `my_first_database`.`my_table` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `ans` VARCHAR(50) NULL DEFAULT NULL,
  `text` VARCHAR(255) NULL DEFAULT NULL,
  `text_mode` BOOLEAN NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`))
ENGINE = InnoDB
AUTO_INCREMENT = 493
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;

INSERT INTO `my_first_database`.`my_table` (`id`, `ans`, `text`) VALUES (1, NULL, NULL);

-- -----------------------------------------------------
-- Table `my_first_database`.`sudokus`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `my_first_database`.`sudokus` (
  `idsudokus` INT NOT NULL AUTO_INCREMENT,
  `state` VARCHAR(255) NOT NULL,
  PRIMARY KEY (`idsudokus`))
ENGINE = InnoDB
AUTO_INCREMENT = 49
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;

USE `my_first_database` ;

-- -----------------------------------------------------
-- procedure get
-- -----------------------------------------------------

DELIMITER $$
USE `my_first_database`$$
CREATE PROCEDURE `get_calculator_data`()
BEGIN
	SELECT * FROM my_table WHERE id = 1;
END$$

DELIMITER ;

-- -----------------------------------------------------
-- procedure get_sudokus
-- -----------------------------------------------------

DELIMITER $$
USE `my_first_database`$$
CREATE PROCEDURE `get_sudokus`()
BEGIN
	SELECT state FROM sudokus;
END$$

DELIMITER ;

-- -----------------------------------------------------
-- procedure insert_sudoku
-- -----------------------------------------------------

DELIMITER $$
USE `my_first_database`$$
CREATE PROCEDURE `insert_sudoku`(
    IN p_state VARCHAR(255)
)
BEGIN
    DECLARE rowCount INT;
    
    SELECT COUNT(*) INTO rowCount FROM sudokus WHERE state = p_state;
    
    IF rowCount = 0 THEN
        INSERT INTO sudokus (state) VALUES (p_state);
    END IF;
    
END$$

DELIMITER ;

-- -----------------------------------------------------
-- procedure update_ans
-- -----------------------------------------------------

DELIMITER $$
USE `my_first_database`$$
CREATE PROCEDURE `update_ans`(IN p_number varchar(50))
BEGIN
	UPDATE my_table SET ans = p_number, text_mode = 0 WHERE id = 1;
END$$

DELIMITER ;

-- -----------------------------------------------------
-- procedure update_text
-- -----------------------------------------------------

DELIMITER $$
USE `my_first_database`$$
CREATE PROCEDURE `update_text`(IN p_string varchar(255))
BEGIN
	UPDATE my_table SET text = p_string, text_mode = 1 WHERE id = 1;
END$$

DELIMITER ;

SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
