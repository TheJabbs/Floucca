-- CreateTable
CREATE TABLE `boat_details` (
    `boat_id` INTEGER NOT NULL AUTO_INCREMENT,
    `fleet_owner` VARCHAR(30) NOT NULL DEFAULT 'Unknown',
    `fleet_size` INTEGER NULL,
    `fleet_crew` INTEGER NULL,
    `fleet_max_weight` FLOAT NULL,
    `fleet_length` FLOAT NULL,
    `fleet_registration` INTEGER NULL,

    PRIMARY KEY (`boat_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `coop` (
    `coop_code` INTEGER NOT NULL,
    `region_code` INTEGER NOT NULL,
    `coop_name` VARCHAR(50) NOT NULL,

    INDEX `coop_ibfk_1`(`region_code`),
    PRIMARY KEY (`coop_code`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `effort_today` (
    `effort_today_id` INTEGER NOT NULL AUTO_INCREMENT,
    `landing_id` INTEGER NOT NULL,
    `hours_fished` FLOAT NOT NULL,

    INDEX `effort_today_ibfk_2`(`landing_id`),
    PRIMARY KEY (`effort_today_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `fish` (
    `fish_id` INTEGER NOT NULL AUTO_INCREMENT,
    `specie_code` INTEGER NOT NULL,
    `landing_id` INTEGER NOT NULL,
    `gear_code` INTEGER NULL,
    `fish_weight` FLOAT NULL,
    `fish_length` FLOAT NULL,
    `fish_quantity` INTEGER NULL,

    INDEX `fish_ibfk_1`(`specie_code`),
    INDEX `fish_ibfk_2`(`landing_id`),
    INDEX `fish_ibfk_3`(`gear_code`),
    PRIMARY KEY (`fish_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `fleet_senses` (
    `fleet_senses_id` INTEGER NOT NULL AUTO_INCREMENT,
    `form_id` INTEGER NOT NULL,

    INDEX `fleet_senses_ibfk_2`(`form_id`),
    PRIMARY KEY (`fleet_senses_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `form` (
    `form_id` INTEGER NOT NULL AUTO_INCREMENT,
    `user_id` INTEGER NULL,
    `boat_detail` INTEGER NULL,
    `period_date` DATE NULL,
    `port_id` INTEGER NOT NULL,
    `form_type` VARCHAR(10) NOT NULL,
    `fisher_name` VARCHAR(100) NOT NULL DEFAULT 'unknown',
    `creation_time` DATETIME(0) NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `form_ibfk_1`(`user_id`),
    INDEX `form_ibfk_2`(`port_id`),
    INDEX `form_ibfk_3`(`period_date`),
    INDEX `form_ibfk_3_idx`(`boat_detail`),
    PRIMARY KEY (`form_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `gear` (
    `gear_code` INTEGER NOT NULL AUTO_INCREMENT,
    `gear_name` VARCHAR(30) NOT NULL,
    `equipment_id` INTEGER NOT NULL,
    `equipment_name` VARCHAR(50) NOT NULL,

    PRIMARY KEY (`gear_code`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `gear_details` (
    `detail_id` INTEGER NOT NULL AUTO_INCREMENT,
    `gear_code` INTEGER NOT NULL,
    `effort_today_id` INTEGER NULL,
    `detail_name` VARCHAR(50) NOT NULL,
    `detail_value` VARCHAR(200) NOT NULL,

    INDEX `gear_details_ibfk_1`(`gear_code`),
    INDEX `effort_today_ibfk_1_idx`(`effort_today_id`),
    PRIMARY KEY (`detail_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `gear_usage` (
    `gear_usage_id` INTEGER NOT NULL AUTO_INCREMENT,
    `fleet_senses_id` INTEGER NULL,
    `gear_code` INTEGER NOT NULL,
    `months` INTEGER NOT NULL DEFAULT 0,

    INDEX `gear_usage_ibfk_1`(`gear_code`),
    INDEX `gear_usage_ibfk_2`(`fleet_senses_id`),
    PRIMARY KEY (`gear_usage_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `landing` (
    `landing_id` INTEGER NOT NULL AUTO_INCREMENT,
    `form_id` INTEGER NOT NULL,
    `longitude` DECIMAL(9, 6) NOT NULL,
    `latitude` DECIMAL(9, 6) NOT NULL,

    INDEX `landing_ibfk_1`(`form_id`),
    PRIMARY KEY (`landing_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `period` (
    `period_date` DATE NOT NULL,
    `period_status` CHAR(1) NOT NULL DEFAULT 'B',

    PRIMARY KEY (`period_date`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ports` (
    `port_id` INTEGER NOT NULL AUTO_INCREMENT,
    `port_name` VARCHAR(50) NOT NULL,
    `coop_code` INTEGER NOT NULL,

    INDEX `coop_code`(`coop_code`),
    PRIMARY KEY (`port_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `region` (
    `region_code` INTEGER NOT NULL,
    `region_name` VARCHAR(50) NOT NULL,

    PRIMARY KEY (`region_code`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `roles` (
    `role_id` INTEGER NOT NULL AUTO_INCREMENT,
    `role_code` VARCHAR(4) NOT NULL,
    `role_name` VARCHAR(20) NOT NULL,

    UNIQUE INDEX `role_code`(`role_code`),
    PRIMARY KEY (`role_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `sense_lastw` (
    `sense_lastW_id` INTEGER NOT NULL AUTO_INCREMENT,
    `gear_code` INTEGER NOT NULL,
    `form_id` INTEGER NULL,
    `days_fished` FLOAT NOT NULL,

    INDEX `sense_lastw_ibfk_1`(`gear_code`),
    INDEX `sense_lastw_ibfk_2_idx`(`form_id`),
    PRIMARY KEY (`sense_lastW_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `specie` (
    `specie_code` INTEGER NOT NULL,
    `specie_name` VARCHAR(50) NOT NULL,
    `specie_description` VARCHAR(500) NULL DEFAULT 'No description',
    `specie_avg_weight` FLOAT NOT NULL,
    `specie_avg_length` FLOAT NOT NULL,

    PRIMARY KEY (`specie_code`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `user_coop` (
    `user_coop_id` INTEGER NOT NULL AUTO_INCREMENT,
    `user_id` INTEGER NOT NULL,
    `coop_code` INTEGER NOT NULL,

    INDEX `user_coop_ibfk_1`(`user_id`),
    INDEX `user_coop_ibfk_2`(`coop_code`),
    PRIMARY KEY (`user_coop_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `user_role` (
    `user_role_id` INTEGER NOT NULL AUTO_INCREMENT,
    `user_id` INTEGER NOT NULL,
    `role_id` INTEGER NOT NULL,

    INDEX `user_role_ibfk_1`(`user_id`),
    INDEX `user_role_ibfk_2`(`role_id`),
    PRIMARY KEY (`user_role_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `users` (
    `user_id` INTEGER NOT NULL AUTO_INCREMENT,
    `user_fname` VARCHAR(20) NOT NULL,
    `user_lname` VARCHAR(20) NOT NULL,
    `user_email` VARCHAR(50) NULL,
    `user_phone` VARCHAR(20) NULL,
    `user_pass` VARCHAR(250) NOT NULL,
    `last_login` DATETIME(0) NULL,
    `creation_time` DATETIME(0) NULL DEFAULT CURRENT_TIMESTAMP(0),

    UNIQUE INDEX `user_email`(`user_email`),
    UNIQUE INDEX `user_phone`(`user_phone`),
    PRIMARY KEY (`user_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `coop` ADD CONSTRAINT `coop_ibfk_1` FOREIGN KEY (`region_code`) REFERENCES `region`(`region_code`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `effort_today` ADD CONSTRAINT `effort_today_ibfk_2` FOREIGN KEY (`landing_id`) REFERENCES `landing`(`landing_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `fish` ADD CONSTRAINT `fish_ibfk_1` FOREIGN KEY (`specie_code`) REFERENCES `specie`(`specie_code`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `fish` ADD CONSTRAINT `fish_ibfk_2` FOREIGN KEY (`landing_id`) REFERENCES `landing`(`landing_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `fish` ADD CONSTRAINT `fish_ibfk_3` FOREIGN KEY (`gear_code`) REFERENCES `gear`(`gear_code`) ON DELETE SET NULL ON UPDATE SET NULL;

-- AddForeignKey
ALTER TABLE `fleet_senses` ADD CONSTRAINT `fleet_senses_ibfk_2` FOREIGN KEY (`form_id`) REFERENCES `form`(`form_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `form` ADD CONSTRAINT `form_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users`(`user_id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `form` ADD CONSTRAINT `form_ibfk_2` FOREIGN KEY (`port_id`) REFERENCES `ports`(`port_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `form` ADD CONSTRAINT `form_ibfk_3` FOREIGN KEY (`period_date`) REFERENCES `period`(`period_date`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `form` ADD CONSTRAINT `form_ibfk_4` FOREIGN KEY (`boat_detail`) REFERENCES `boat_details`(`boat_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `gear_details` ADD CONSTRAINT `effort_today_ibfk_1` FOREIGN KEY (`effort_today_id`) REFERENCES `effort_today`(`effort_today_id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `gear_details` ADD CONSTRAINT `gear_details_ibfk_1` FOREIGN KEY (`gear_code`) REFERENCES `gear`(`gear_code`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `gear_usage` ADD CONSTRAINT `gear_usage_ibfk_1` FOREIGN KEY (`gear_code`) REFERENCES `gear`(`gear_code`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `gear_usage` ADD CONSTRAINT `gear_usage_ibfk_2` FOREIGN KEY (`fleet_senses_id`) REFERENCES `fleet_senses`(`fleet_senses_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `landing` ADD CONSTRAINT `landing_ibfk_1` FOREIGN KEY (`form_id`) REFERENCES `form`(`form_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ports` ADD CONSTRAINT `ports_ibfk_1` FOREIGN KEY (`coop_code`) REFERENCES `coop`(`coop_code`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `sense_lastw` ADD CONSTRAINT `sense_lastw_ibfk_1` FOREIGN KEY (`gear_code`) REFERENCES `gear`(`gear_code`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `sense_lastw` ADD CONSTRAINT `sense_lastw_ibfk_2` FOREIGN KEY (`form_id`) REFERENCES `form`(`form_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `user_coop` ADD CONSTRAINT `user_coop_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users`(`user_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `user_coop` ADD CONSTRAINT `user_coop_ibfk_2` FOREIGN KEY (`coop_code`) REFERENCES `coop`(`coop_code`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `user_role` ADD CONSTRAINT `user_role_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users`(`user_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `user_role` ADD CONSTRAINT `user_role_ibfk_2` FOREIGN KEY (`role_id`) REFERENCES `roles`(`role_id`) ON DELETE CASCADE ON UPDATE CASCADE;
