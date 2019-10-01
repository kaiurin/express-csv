SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for accounts
-- ----------------------------
DROP TABLE IF EXISTS `accounts`;
CREATE TABLE `accounts`  (
  `username` varchar(255) NULL DEFAULT NULL,
  `firstname` varchar(255) NULL DEFAULT NULL,
  `lastname` varchar(255) NULL DEFAULT NULL,
  `age` INT NULL
) ENGINE = InnoDB;

SET FOREIGN_KEY_CHECKS = 1;
