-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Hôte : 127.0.0.1:3306
-- Généré le : lun. 06 jan. 2025 à 00:52
-- Version du serveur : 8.4.2
-- Version de PHP : 8.3.6

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de données : `bdcocktails`
--
CREATE DATABASE IF NOT EXISTS `bdcocktails` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci;
USE `bdcocktails`;

-- --------------------------------------------------------

--
-- Structure de la table `cocktails`
--

DROP TABLE IF EXISTS `cocktails`;
CREATE TABLE IF NOT EXISTS `cocktails` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `price` decimal(5,2) NOT NULL,
  `colors` varchar(100) DEFAULT NULL,
  `glass` varchar(50) DEFAULT NULL,
  `category` varchar(100) DEFAULT NULL,
  `garnish` varchar(255) DEFAULT NULL,
  `preparation` text,
  `image` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=31 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Déchargement des données de la table `cocktails`
--

INSERT INTO `cocktails` (`id`, `name`, `price`, `colors`, `glass`, `category`, `garnish`, `preparation`, `image`) VALUES
(1, 'Mojito', 12.50, '#f7f1bc,#6d9600', 'collins', 'All Day Cocktail', 'Mint leaves and lemon slice', 'Muddle mint sprigs with sugar and lime juice. Add splash of soda water and fill glass with cracked ice. Pour rum and top with soda water. Serve with straw.', 'Mojito.jpg'),
(2, 'Vesper', 10.45, '#D88317', 'martini', 'Before Dinner Cocktail', 'Lemon twist', 'Shake and strain into a chilled cocktail glass.', 'Vesper.jpg'),
(3, 'Bacardi', 15.60, '#F80304', 'martini', 'Before Dinner Cocktail', NULL, 'Shake with ice cubes. Strain into chilled cocktail glass.', 'Bascardi.jpg'),
(4, 'Bloody Mary', 15.60, '#F80304', 'martini', 'Before Dinner Cocktail', NULL, 'Shake with ice cubes. Strain into chilled cocktail glass.', 'BloodyMary.jpg'),
(5, 'Negroni', 12.50, '#ED0200', 'old-fashioned', 'Before Dinner Cocktail', 'Half an orange slice', 'Build into old-fashioned glass filled with ice. Stir gently.', 'Negroni.jpg'),
(6, 'Rose', 12.50, '#fe29bc', 'martini', 'Long Drink', '', 'Stir all ingredients with ice and strain into a cocktail glass.', 'rose.jpg'),
(7, 'Old Fashioned', 12.50, '#E74A03,#F1A507', 'old-fashioned', 'Before Dinner Cocktail', 'Orange slice and cherry', 'Place sugar cube in old-fashioned glass and saturate with bitters, add a dash of plain water. Muddle until dissolve. Fill the glass with ice cubes and add whisky.', 'OldFashioned.jpg'),
(8, 'Tuxedo', 19.60, '#FDC78B', 'martini', 'All Day Cocktail', 'Cherry and lemon twist', 'Stir all ingredients with ice and strain into cocktail glass.', 'Tuxedo.jpg'),
(9, 'Horse\'s Neck', 12.50, '#D9A031', 'highball', 'Longdrink', 'Lemon twist', 'Build into highball glass with ice cubes. Stir gently. If required, add dashes of Angostura bitters.', 'HorsesNeck.jpg'),
(10, 'Planter\'s Punch', 12.50, '#B51202,#F9C31A', 'highball', 'Longdrink', 'Pineapple slice and a cherry', 'Pour all ingredients, except the bitters, into shaker filled with ice. Shake. Pour into large glass, filled with ice. Add Angostura bitters, “on top”.', 'PlantersPunch.jpg'),
(11, 'Sea Breeze', 12.50, '#f20010,#89c134', 'highball', 'Longdrink', 'Lime wedge', 'Build all ingredients in a rock glass filled with ice.', 'SeaBreeze.jpg'),
(12, 'Pisco Sour', 5.20, '#B5AB90', 'old-fashioned', 'All Day Cocktail', NULL, 'Shake and strain into a chilled champagne flute. Dash some Angostura bitters on top.', 'PiscoSour.jpg'),
(13, 'Long Island Iced Tea', 12.50, '#C18450', 'highball', 'Longdrink', 'Lemon twist', 'Add all ingredients into highball glass filled with ice. Stir gently. Serve with straw.', 'LongIslandIcedTea.jpg'),
(14, 'Clover Club', 12.50, '#B1061D,#E65259,#f4edee', 'martini', 'All Day Cocktail', NULL, 'Shake with ice cubes. Strain into cocktail glass.', 'CloverClub.jpg'),
(15, 'Angel Face', 12.50, '#F6CD4C', 'martini', 'All Day Cocktail', NULL, 'Shake with ice cubes. Strain into a cocktail glass.', 'AngelFace.jpg'),
(16, 'Mimosa', 10.40, '#EBC04D', 'champagne-flute', 'Sparkling Cocktail', 'Optional orange twist', 'Pour orange juice into flute and gently pour Champagne. Stir gently.', 'Mimosa.jpg'),
(17, 'Whiskey Sour', 10.50, '#F3CA69', 'old-fashioned', 'Before Dinner Cocktail', 'Half an orange slice and cherry', 'Pour all ingredients into cocktail shaker filled with ice. Shake. Strain into cocktail glass.', 'WhiskeySour.jpg'),
(18, 'Screwdriver', 12.50, '#D6C01D', 'highball', 'All Day Cocktail', 'Orange slice', 'Build into a highball glass filled with ice. Stir gently.', 'Screwdriver.jpg'),
(19, 'Cuba Libre', 14.20, '#440D06,#983F27,#EDDC7C', 'highball', 'Longdrink', 'Lime wedge', 'Build all ingredients in a highball glass filled with ice.', 'CubaLibre.jpg'),
(20, 'Manhattan', 12.50, '#ff000a', 'martini', 'Before Dinner Cocktail', 'Cherry', 'Stir in mixing glass with ice cubes. Strain into chilled cocktail glass.', 'Manhattan.jpg'),
(21, 'Porto Flip', 11.85, '#823D38', 'martini', 'After Dinner Cocktail', NULL, 'Shake with ice cubes. Strain into cocktail glass. Sprinkle with fresh ground nutmeg.', 'PortoFlip.jpg'),
(22, 'Gin Fizz', 10.70, '#C6C8C3', 'highball', 'Longdrink', 'Lemon slice', 'Shake all ingredients with ice cubes, except soda water. Pour into tumbler. Top with soda water.', 'GinFizz.jpg'),
(23, 'Espresso Martini', 12.50, '#463639,#D0BFA5', 'martini', 'After Dinner Cocktail', NULL, 'Shake and strain into a chilled cocktail glass.', 'EspressoMartini.jpg'),
(24, 'Margarita', 8.80, '#B8B781', 'margarita', 'All Day Cocktail', NULL, 'Shake with ice cubes. Strain into cocktail glass rimmed with salt.', 'Margarita.jpg'),
(25, 'French 75', 12.50, '#E9CE8E', 'champagne-tulip', 'Sparkling Cocktail', NULL, 'Shake with ice cubes, except for champagne. Strain into a champagne flute. Top up with champagne. Stir gently.', 'French75.jpg'),
(26, 'Yellow Bird', 14.75, '#EBCF2E', 'martini', 'All Day Cocktail', NULL, 'Shake and strain into a chilled cocktail glass.', 'YellowBird.jpg'),
(27, 'Pina Colada', 12.50, '#C5B9A1', 'hurricane', 'Longdrink', 'Pineapple slice and a cherry', 'Blend all the ingredients with ice in a electric blender, pour into a large goblet or Hurricane glass and serve with straws.', 'PinaColada.jpg'),
(28, 'Aviation', 15.50, '#68517B', 'martini', 'All Day Cocktail', NULL, 'Shake and strain into a chilled cocktail glass.', 'Aviation.jpg'),
(29, 'Bellini', 10.00, '#F89E64', 'champagne-flute', 'Sparkling Cocktail', NULL, 'Pour peach puree into chilled glass and add sparkling wine. Stir gently.', 'Bellini.jpg'),
(30, 'Grasshopper', 12.50, '#75CCA6', 'martini', 'After Dinner Cocktail', NULL, 'Shake with ice cubes. Strain into chilled cocktail glass.', 'Grasshopper.jpg');

-- --------------------------------------------------------

--
-- Structure de la table `connexion`
--

DROP TABLE IF EXISTS `connexion`;
CREATE TABLE IF NOT EXISTS `connexion` (
  `id` int NOT NULL AUTO_INCREMENT,
  `id_membre` int NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `roles` enum('ADMIN','CLIENT','USER','MANAGER') DEFAULT 'USER',
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`),
  KEY `id_membre` (`id_membre`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Déchargement des données de la table `connexion`
--

INSERT INTO `connexion` (`id`, `id_membre`, `email`, `password`, `roles`) VALUES
(1, 1, 'admin@cocktello.com', '$2b$10$XRzxv9rpPzeR5i6fm4HHeOfS5S0AjWiZ.7agwUqfNPIb1tIPQg.l2', 'ADMIN');

-- --------------------------------------------------------

--
-- Structure de la table `ingredients`
--

DROP TABLE IF EXISTS `ingredients`;
CREATE TABLE IF NOT EXISTS `ingredients` (
  `id` int NOT NULL AUTO_INCREMENT,
  `cocktail_id` int NOT NULL,
  `unit` varchar(20) DEFAULT NULL,
  `amount` varchar(50) DEFAULT NULL,
  `ingredient` varchar(255) DEFAULT NULL,
  `label` varchar(255) DEFAULT NULL,
  `special` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `cocktail_id` (`cocktail_id`)
) ENGINE=InnoDB AUTO_INCREMENT=121 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Déchargement des données de la table `ingredients`
--

INSERT INTO `ingredients` (`id`, `cocktail_id`, `unit`, `amount`, `ingredient`, `label`, `special`) VALUES
(4, 2, 'cl', '4.5', 'White rum', 'Bacardi White Rum', NULL),
(5, 2, 'cl', '2', 'Lime juice', NULL, NULL),
(6, 2, 'cl', '1', 'Syrup', 'Grenadine', NULL),
(7, 3, 'cl', '3', 'Gin', NULL, NULL),
(8, 3, 'cl', '3', 'Campari', NULL, NULL),
(9, 3, 'cl', '3', 'Vermouth', 'Sweet red vermouth', NULL),
(10, 4, 'cl', '2', 'Kirsch', NULL, NULL),
(11, 4, 'cl', '4', 'Vermouth', 'Dry vermouth', NULL),
(12, 4, NULL, '3 dashes', 'Syrup', 'Strawberry syrup', NULL),
(13, 5, 'cl', '4.5', 'Whiskey', 'Bourbon or rye whiskey', NULL),
(14, 5, NULL, '2 dashes', 'Angostura bitters', NULL, NULL),
(15, 5, NULL, '1', 'Sugar', 'Sugar cube', NULL),
(16, 5, NULL, NULL, NULL, NULL, 'Few dashes plain water'),
(22, 7, 'cl', '4', 'White rum', 'White Cuban Rum', NULL),
(23, 7, NULL, NULL, 'Soda water', NULL, NULL),
(24, 7, 'cl', '3', 'Lime juice', NULL, NULL),
(25, 7, NULL, '6', 'Mint', 'Mint sprigs', NULL),
(26, 7, NULL, '2 teaspoons', 'Sugar', 'White sugar', NULL),
(27, 8, 'cl', '4', 'Cognac', NULL, NULL),
(28, 8, 'cl', '12', 'Ginger Ale', NULL, NULL),
(29, 8, NULL, NULL, 'Eau', NULL, 'Dash of Angostura bitters (optional)'),
(30, 9, 'cl', '4.5', 'Dark rum', NULL, NULL),
(31, 9, 'cl', '3.5', 'Orange juice', NULL, NULL),
(32, 9, 'cl', '3.5', 'Pineapple juice', NULL, NULL),
(33, 9, 'cl', '2', 'Lemon juice', NULL, NULL),
(34, 9, 'cl', '1', 'Syrup', 'Grenadine', NULL),
(35, 9, 'cl', '1', 'Syrup', 'Sugar syrup', NULL),
(36, 9, NULL, NULL, 'Angostura bitters', NULL, '3 to 4 dashes'),
(37, 10, 'cl', '4', 'Vodka', NULL, NULL),
(38, 10, 'cl', '12', 'Cranberry juice', NULL, NULL),
(39, 10, 'cl', '3', 'Grapefruit juice', NULL, NULL),
(40, 11, 'cl', '4.5', 'Pisco', NULL, NULL),
(41, 11, 'cl', '3', 'Lemon juice', NULL, NULL),
(42, 11, 'cl', '2', 'Syrup', 'Sugar syrup', NULL),
(43, 11, NULL, '1', 'Egg white', 'Egg white (small egg)', NULL),
(44, 6, 'cl', '3', 'Gin', 'Old Tom Gin', ''),
(45, 6, 'cl', '3', 'Vermouth', 'Dry vermouth', ''),
(46, 6, '', '1/4 bar spoon', 'Absinthe', '', ''),
(47, 6, '', '1/2 bar spoon', 'Cherry liqueur', 'Maraschino', ''),
(48, 6, '', '3 dashes', 'Orange bitters', '', ''),
(49, 12, 'cl', '1.5', 'Vodka', NULL, NULL),
(50, 12, 'cl', '1.5', 'White rum', NULL, NULL),
(51, 12, 'cl', '1.5', 'Gin', NULL, NULL),
(52, 12, 'cl', '1.5', 'Tequila', NULL, NULL),
(53, 12, 'cl', '2', 'Lemon juice', NULL, NULL),
(54, 12, 'cl', '3', 'Gomme syrup', NULL, NULL),
(55, 12, 'cl', '1', 'Cola', NULL, NULL),
(56, 13, 'cl', '4.5', 'Gin', NULL, NULL),
(57, 13, 'cl', '1.5', 'Lemon juice', NULL, NULL),
(58, 13, 'cl', '1', 'Syrup', 'Raspberry syrup', NULL),
(59, 13, NULL, '1', 'Egg white', NULL, NULL),
(60, 14, 'cl', '3', 'Gin', NULL, NULL),
(61, 14, 'cl', '3', 'Apricot brandy', NULL, NULL),
(62, 14, 'cl', '3', 'Lemon juice', NULL, NULL),
(63, 15, 'cl', '3', 'Gin', NULL, NULL),
(64, 15, 'cl', '3', 'Calvados', NULL, NULL),
(65, 15, 'cl', '3', 'Apricot brandy', NULL, NULL),
(66, 16, 'cl', '7.5', 'Champagne', NULL, NULL),
(67, 16, 'cl', '7.5', 'Orange juice', NULL, NULL),
(68, 17, 'cl', '4.5', 'Bourbon', NULL, NULL),
(69, 17, 'cl', '3', 'Lemon juice', NULL, NULL),
(70, 17, 'cl', '1.5', 'Syrup', 'Sugar syrup', NULL),
(71, 17, NULL, '1/2', 'Egg white', NULL, NULL),
(72, 18, 'cl', '4.5', 'Vodka', NULL, NULL),
(73, 18, 'cl', '9', 'Orange juice', NULL, NULL),
(74, 19, 'cl', '5', 'White rum', NULL, NULL),
(75, 19, 'cl', '12', 'Cola', NULL, NULL),
(76, 19, 'cl', '1', 'Lime juice', NULL, NULL),
(80, 21, 'cl', '4.5', 'Tawny port', NULL, NULL),
(81, 21, 'cl', '1.5', 'Cognac', NULL, NULL),
(82, 21, NULL, '1', 'Egg yolk', NULL, NULL),
(83, 21, NULL, '1 teaspoon', 'Sugar', 'Powdered sugar', NULL),
(84, 22, 'cl', '4.5', 'Gin', NULL, NULL),
(85, 22, 'cl', '3', 'Lemon juice', NULL, NULL),
(86, 22, 'cl', '1', 'Syrup', 'Sugar syrup', NULL),
(87, 22, 'cl', '8', 'Soda water', NULL, NULL),
(88, 23, 'cl', '5', 'Vodka', NULL, NULL),
(89, 23, 'cl', '10', 'Espresso', NULL, NULL),
(90, 23, 'cl', '1.5', 'Coffee liqueur', NULL, NULL),
(91, 23, NULL, '1.5', 'Sugar syrup', NULL, NULL),
(92, 24, 'cl', '5', 'Tequila', NULL, NULL),
(93, 24, 'cl', '2', 'Triple sec', NULL, NULL),
(94, 24, 'cl', '1', 'Lime juice', NULL, NULL),
(95, 25, 'cl', '3', 'Gin', NULL, NULL),
(96, 25, 'cl', '1.5', 'Lemon juice', NULL, NULL),
(97, 25, 'cl', '2', 'Syrup', 'Sugar syrup', NULL),
(98, 25, 'cl', '6', 'Champagne', NULL, NULL),
(99, 26, 'cl', '3', 'White rum', NULL, NULL),
(100, 26, 'cl', '1.5', 'Galliano', NULL, NULL),
(101, 26, 'cl', '1', 'Lime juice', NULL, NULL),
(102, 26, 'cl', '1', 'Syrup', 'Sugar syrup', NULL),
(103, 27, 'cl', '6', 'White rum', NULL, NULL),
(104, 27, 'cl', '6', 'Pineapple juice', NULL, NULL),
(105, 27, 'cl', '2', 'Cream of coconut', NULL, NULL),
(106, 28, 'cl', '4.5', 'Gin', NULL, NULL),
(107, 28, 'cl', '1.5', 'Maraschino liqueur', NULL, NULL),
(108, 28, 'cl', '0.75', 'Crème de violette', NULL, NULL),
(109, 28, 'cl', '2', 'Lemon juice', NULL, NULL),
(110, 29, 'cl', '10', 'Prosecco', NULL, NULL),
(111, 29, 'cl', '5', 'Peach puree', NULL, NULL),
(112, 30, 'cl', '3', 'Crème de menthe', 'Green crème de menthe', NULL),
(113, 30, 'cl', '3', 'Crème de cacao', 'White crème de cacao', NULL),
(114, 30, 'cl', '3', 'Cream', NULL, NULL),
(115, 1, 'cl', '6', 'Gin', '', ''),
(116, 1, 'cl', '1.5', 'Vodka', '', ''),
(117, 1, 'cl', '0.75', 'Lillet Blonde', '', ''),
(118, 20, 'cl', '5', 'Bourbon', '', ''),
(119, 20, 'cl', '2', 'Vermouth', 'Sweet red vermouth', ''),
(120, 20, '', '2 dashes', 'Angostura bitters', '', '');

-- --------------------------------------------------------

--
-- Structure de la table `membres`
--

DROP TABLE IF EXISTS `membres`;
CREATE TABLE IF NOT EXISTS `membres` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nom` varchar(255) NOT NULL,
  `prenom` varchar(255) NOT NULL,
  `adresse` varchar(255) NOT NULL,
  `sexe` enum('H','F','') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `photo` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Déchargement des données de la table `membres`
--

INSERT INTO `membres` (`id`, `nom`, `prenom`, `adresse`, `sexe`, `photo`) VALUES
(1, 'Cocktello', 'Cocktella', '77, Rue des Cocktails, Montréal, Canada', '', 'membre-1735583276946-791229089.png');

--
-- Contraintes pour les tables déchargées
--

--
-- Contraintes pour la table `connexion`
--
ALTER TABLE `connexion`
  ADD CONSTRAINT `connexion_ibfk_1` FOREIGN KEY (`id_membre`) REFERENCES `membres` (`id`) ON DELETE CASCADE;

--
-- Contraintes pour la table `ingredients`
--
ALTER TABLE `ingredients`
  ADD CONSTRAINT `ingredients_ibfk_1` FOREIGN KEY (`cocktail_id`) REFERENCES `cocktails` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
