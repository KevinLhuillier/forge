/*
  Warnings:

  - You are about to drop the `user` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE `user`;

-- CreateTable
CREATE TABLE `users` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NULL,
    `email` VARCHAR(191) NULL,
    `level` INTEGER NOT NULL DEFAULT 1,
    `xp` INTEGER NOT NULL DEFAULT 0,
    `rank` VARCHAR(191) NOT NULL DEFAULT 'Scaled',
    `hashedPassword` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `users_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `skills` (
    `skill_id` INTEGER NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `type` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`skill_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `skills_stages` (
    `skill_id` INTEGER NOT NULL,
    `stage` INTEGER NOT NULL,
    `stage_label` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`skill_id`, `stage`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `users_skills` (
    `user_id` VARCHAR(191) NOT NULL,
    `skill_id` INTEGER NOT NULL,
    `stage` INTEGER NOT NULL DEFAULT 0,

    PRIMARY KEY (`user_id`, `skill_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `xp_level` (
    `level` INTEGER NOT NULL,
    `xp` INTEGER NOT NULL,

    PRIMARY KEY (`level`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `xp_stage` (
    `stage` INTEGER NOT NULL,
    `xp` INTEGER NOT NULL,

    PRIMARY KEY (`stage`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `skills_stages` ADD CONSTRAINT `skills_stages_skill_id_fkey` FOREIGN KEY (`skill_id`) REFERENCES `skills`(`skill_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `users_skills` ADD CONSTRAINT `users_skills_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `users_skills` ADD CONSTRAINT `users_skills_skill_id_fkey` FOREIGN KEY (`skill_id`) REFERENCES `skills`(`skill_id`) ON DELETE RESTRICT ON UPDATE CASCADE;
