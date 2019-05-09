CREATE TABLE `users` (
  `id` int(11) NOT NULL PRIMARY KEY AUTO_INCREMENT,
  `fname` varchar(80) COLLATE utf8_unicode_ci NOT NULL,
  `lname` varchar(80) COLLATE utf8_unicode_ci NOT NULL,
  `email` varchar(80) COLLATE utf8_unicode_ci NOT NULL,
  `social_type` varchar(20) COLLATE utf8_unicode_ci NOT NULL,
  `profile_image` varchar(255) COLLATE utf8_unicode_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;