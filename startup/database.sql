DROP TABLE IF EXISTS `articles`;

CREATE TABLE `articles` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `title` varchar(64) NOT NULL,
  `username` varchar(64) NOT NULL,
  `tags` varchar(64) NOT NULL,
  `data` longtext,
  `state` enum('created','submit','vote') NOT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `index_username` (`username`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8;



DROP TABLE IF EXISTS `submits`;

CREATE TABLE `submits` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `username` varchar(64) NOT NULL,
  `target` enum('vox','steemit','golos') NOT NULL,
  `permlink` varchar(64) NOT NULL,
  `state` enum('submit_process','submitted','vote') NOT NULL,
  `award` int(10) NOT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `index_username` (`username`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE IF NOT EXISTS `google_users` (
   `id` VARCHAR(256) NOT NULL,
   `token` VARCHAR(256) NOT NULL,
   `email` VARCHAR(256) NOT NULL,
   `name` VARCHAR(256),
   `photo` VARCHAR(256),
   PRIMARY KEY (`id`),
   INDEX `index_name` (`name`)
)
ENGINE=InnoDB DEFAULT CHARSET=utf8;



