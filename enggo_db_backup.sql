-- MySQL dump 10.13  Distrib 8.0.44, for Linux (x86_64)
--
-- Host: localhost    Database: enggo_db
-- ------------------------------------------------------
-- Server version	8.0.44

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `SequelizeMeta`
--

DROP TABLE IF EXISTS `SequelizeMeta`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `SequelizeMeta` (
  `name` varchar(255) COLLATE utf8mb3_unicode_ci NOT NULL,
  PRIMARY KEY (`name`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `SequelizeMeta`
--

LOCK TABLES `SequelizeMeta` WRITE;
/*!40000 ALTER TABLE `SequelizeMeta` DISABLE KEYS */;
INSERT INTO `SequelizeMeta` VALUES ('20260103102147-create-users.cjs'),('20260103102149-create-certificates.cjs'),('20260103102150-create-skills.cjs'),('20260103102152-create-courses.cjs'),('20260103102153-create-lessons.cjs'),('20260103102155-create-questions.cjs'),('20260103102156-create-exams.cjs'),('20260103102158-create-blogs.cjs'),('20260103102159-create-issuese.cjs'),('20260103102160-create-parts.cjs'),('20260103102161-create-languages.cjs'),('20260103102197-create-user-exam.cjs'),('20260103102198-create-exam-questions.cjs'),('20260103102199-create-user-answer.cjs'),('20260103102201-create-reports.cjs'),('20260103102202-create-feedbacks.cjs'),('20260103102204-create-speaking-records.cjs'),('20260103102206-create-lesson-translations.cjs'),('20260103102207-create-lesson-medias.cjs'),('20260103102216-create-flashcard.cjs'),('20260103102218-create-writing-task.cjs'),('20260103102220-create-writing-submission.cjs'),('20260103102221-create-writing-feedback.cjs'),('20260103102223-create-ai-conversation.cjs'),('20260103102224-create-ai-conversation-message.cjs'),('20260103102226-create-flashcard-set.cjs'),('20260103102227-create-lesson-questions.cjs'),('20260103102229-create-lesson-question-options.cjs'),('20260104035844-add-column-to-users.cjs'),('20260104144419-add-column-to-users.cjs'),('20260111084155-add-column-to-users.cjs'),('20260112040222-add-column-to-courses.cjs'),('20260112090746-create-roadmaps.cjs'),('20260112090758-create-phases.cjs'),('20260112090759-create-documents.cjs'),('20260112101854-add-column-to-courses.cjs'),('20260112151929-add-column-to-exams.cjs'),('20260112153845-add-column-to-parts.cjs'),('20260112154319-add-column-to-questions.cjs'),('20260112154849-add-column-to-exam-questions.cjs'),('20260112155024-create-exam-sections.cjs'),('20260112161602-create-passages.cjs'),('20260112163618-add-column-to-questions.cjs'),('20260113053812-add-column-to-courses.cjs'),('20260113060115-create-phase-courses.cjs'),('20260113060400-add-column-to-lesson-questions.cjs'),('20260113061033-add-column-to-lesson-question-options.cjs'),('20260113061830-add-column-to-courses.cjs'),('20260113064518-add-column-to-courses.cjs'),('20260113064520-add-column-to-courses.cjs'),('20260113064521-add-column-to-courses.cjs'),('20260113064522-add-column-to-courses.cjs'),('20260114090958-add-column-to-lessons.cjs'),('20260114091526-add-column-to-skills.cjs'),('20260114091527-add-column-to-lessons.cjs'),('20260114150554-create-modules.cjs'),('20260114150932-create-module-lessons.cjs'),('20260114162057-add-column-to-courses.cjs'),('20260114162255-add-column-to-roadmaps.cjs'),('20260114162451-create-user-courses.cjs'),('20260114163109-create-user-roadmaps.cjs'),('20260115063221-add-column-to-lessons.cjs'),('20260115064414-create-certificate-skills.cjs'),('20260115084609-add-column-to-parts.cjs'),('20260115084610-create-part-skills.cjs'),('20260115101306-add-column-to-lessons.cjs'),('20260118102037-add-column-to-lesson-medias.cjs'),('20260119070321-add-column-to-lesson-questions.cjs'),('20260120092000-fix-lesson-questions-status-type.cjs'),('20260121071053-add-column-to-roadmaps.cjs'),('20260121081930-add-column-to-phases.cjs'),('20260121081930-add-column-to-roadmaps.cjs'),('20260121103918-add-column-to-phase-courses.cjs'),('20260123070355-create-document-phases.cjs'),('20260123071743-add-column-to-documents.cjs'),('20260130072236-add-column-to-blogs.cjs'),('20260130081038-add-column-to-blogs.cjs'),('20260203080922-add-column-to-exam-questions.cjs'),('20260203123336-add-column-to-exam-part-skills.cjs'),('20260203124433-edit-column-parts.cjs'),('20260203124633-edit-column-questions.cjs'),('20260203124928-edit-column-exam-questions.cjs'),('20260203125530-edit-column-passages.cjs'),('20260203125717-edit-column-parts.cjs'),('20260203130504-edit-column-feedbacks.cjs'),('20260203130836-edit-column-user-answers.cjs'),('20260203131144-edit-column-exam-sections.cjs'),('20260203142807-create-exam-containers.cjs'),('20260203150608-create-exam-medias.cjs'),('20260203153356-create-container-questions.cjs'),('20260203153357-create-container-questions.cjs'),('20260203153358-create-container-questions.cjs'),('20260203154016-update-passages.cjs'),('20260203154017-update-passages.cjs'),('20260204084157-create-question-options.cjs'),('20260204084158-edit-questions.cjs'),('20260204084159-create-user-answers.cjs'),('20260204151019-edit-writing-submission.cjs'),('20260204151851-edit-writing-feedback.cjs'),('20260204152754-edit-speaking-records.cjs'),('20260204154312-create-speaking-feedbacks.cjs'),('20260204154717-create-ai-interactions.cjs'),('20260204155256-drop-ai-conversations.cjs'),('20260204155546-rename-user-exam.cjs'),('20260206084400-change-year-to-integer.cjs'),('20260206100000-add-media-to-exam-containers.cjs'),('20260206100100-add-media-score-to-container-questions.cjs'),('20260209110558-edit-reports.cjs'),('20260226094250-edit-flashcard-set.cjs'),('20260226094251-edit-flashcard.cjs'),('20260226101021-create-user-flashcard-sets.cjs'),('20260226101742-create-user-flashcard-progress.cjs'),('20260227051003-chagne-column-flashcard-sets.cjs'),('20260227053118-chagne-column-flashcards.cjs'),('20260227063748-chagne-column-flashcard-sets.cjs'),('20260227063749-chagne-column-flashcard-sets.cjs'),('20260227071156-chagne-column-flashcards.cjs'),('20260227152030-create-subcription-plans.cjs'),('20260227152053-create-user-subcriptions.cjs'),('20260228070153-create-user-token-wallets.cjs'),('20260228071707-create-user-token-transactions.cjs'),('20260228074243-edit-courses.cjs'),('20260228074421-edit-roadmaps.cjs'),('20260228092710-edit-subscription-plans.cjs'),('20260228093607-create-subscription-prices.cjs'),('20260228094107-edit-user-subscriptions.cjs'),('20260302035539-create-orders.cjs'),('20260302040102-create-payments.cjs'),('20260302040745-edit-constraint-user-subscriptions.cjs'),('20260302041400-remove-constraint-users.cjs'),('20260302041401-edit-constraint-user-subscriptions.cjs'),('20260302075308-add-column-user-exams.cjs'),('20260306050050-edit-table-documents.cjs'),('20260308153510-add-enum-subscription-prices.cjs'),('20260309072033-add-enum-payment-method.cjs'),('20260310092438-create-table-blog-likes.cjs'),('20260310092850-create-table-blog-comments.cjs'),('20260311085004-create-table-user-courses.cjs'),('20260311085005-create-table-user-courses.cjs'),('20260311085822-create-table-user-roadmaps.cjs'),('20260311085823-create-table-user-roadmaps.cjs'),('20260311090838-create-table-user-lesson-progress.cjs'),('20260311090839-create-table-user-lesson-progress.cjs'),('20260312073204-alter-table-user-lesson-progress.cjs'),('20260318000000-add-parent-to-exam-containers.cjs'),('20260319000000-fix-selected-parts-type.cjs'),('20260324063943-alter-table-user-token-transactionsd.cjs'),('20260324064824-create-table-system-ai-quota.cjs'),('20260324083824-alter-table-system-ai-quotas.cjs'),('20260325055703-alter-questions.cjs'),('20260325093211-create-table-exam-question-stats.cjs'),('20260325093229-create-table-user-exam-stats.cjs'),('20260325112902-alter-table-user-exam-stats.cjs'),('20260330000001-fix-writing-feedback-auto-increment.cjs');
/*!40000 ALTER TABLE `SequelizeMeta` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ai_interactions`
--

DROP TABLE IF EXISTS `ai_interactions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ai_interactions` (
  `ai_interaction_id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `user_exam_id` int NOT NULL,
  `container_question_id` int NOT NULL,
  `prompt` text NOT NULL,
  `response` text NOT NULL,
  `model_name` varchar(255) NOT NULL,
  `token_usage` int NOT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`ai_interaction_id`),
  KEY `user_id` (`user_id`),
  KEY `user_exam_id` (`user_exam_id`),
  KEY `container_question_id` (`container_question_id`),
  CONSTRAINT `ai_interactions_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `ai_interactions_ibfk_2` FOREIGN KEY (`user_exam_id`) REFERENCES `user_exams` (`user_exam_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `ai_interactions_ibfk_3` FOREIGN KEY (`container_question_id`) REFERENCES `container_questions` (`container_question_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ai_interactions`
--

LOCK TABLES `ai_interactions` WRITE;
/*!40000 ALTER TABLE `ai_interactions` DISABLE KEYS */;
/*!40000 ALTER TABLE `ai_interactions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `blog_comments`
--

DROP TABLE IF EXISTS `blog_comments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `blog_comments` (
  `blog_comment_id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `blog_id` int NOT NULL,
  `parent_comment_id` int DEFAULT NULL,
  `comment_content` text NOT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`blog_comment_id`),
  KEY `user_id` (`user_id`),
  KEY `blog_id` (`blog_id`),
  KEY `parent_comment_id` (`parent_comment_id`),
  CONSTRAINT `blog_comments_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE,
  CONSTRAINT `blog_comments_ibfk_2` FOREIGN KEY (`blog_id`) REFERENCES `blogs` (`blog_id`) ON DELETE CASCADE,
  CONSTRAINT `blog_comments_ibfk_3` FOREIGN KEY (`parent_comment_id`) REFERENCES `blog_comments` (`blog_comment_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `blog_comments`
--

LOCK TABLES `blog_comments` WRITE;
/*!40000 ALTER TABLE `blog_comments` DISABLE KEYS */;
INSERT INTO `blog_comments` VALUES (1,4,2,NULL,'hay','2026-03-10 10:15:51','2026-03-10 10:15:51'),(2,4,2,1,'aaaaa','2026-03-10 10:21:57','2026-03-10 10:21:57');
/*!40000 ALTER TABLE `blog_comments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `blog_likes`
--

DROP TABLE IF EXISTS `blog_likes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `blog_likes` (
  `blog_like_id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `blog_id` int NOT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`blog_like_id`),
  KEY `user_id` (`user_id`),
  KEY `blog_id` (`blog_id`),
  CONSTRAINT `blog_likes_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE,
  CONSTRAINT `blog_likes_ibfk_2` FOREIGN KEY (`blog_id`) REFERENCES `blogs` (`blog_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `blog_likes`
--

LOCK TABLES `blog_likes` WRITE;
/*!40000 ALTER TABLE `blog_likes` DISABLE KEYS */;
INSERT INTO `blog_likes` VALUES (1,4,2,'2026-03-10 10:18:32');
/*!40000 ALTER TABLE `blog_likes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `blogs`
--

DROP TABLE IF EXISTS `blogs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `blogs` (
  `blog_id` int NOT NULL AUTO_INCREMENT,
  `blog_title` varchar(100) NOT NULL,
  `blog_content` text NOT NULL,
  `blog_thumbnail` varchar(255) NOT NULL,
  `user_id` int DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  `slug` varchar(255) DEFAULT NULL,
  `excerpt` text,
  `blog_status` enum('draft','published','hidden') NOT NULL DEFAULT 'draft',
  `views_count` int NOT NULL DEFAULT '0',
  `category` enum('Mẹo học tập','TOEIC','IELTS','Ngữ pháp','Từ vựng') DEFAULT NULL,
  PRIMARY KEY (`blog_id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `blogs_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `blogs`
--

LOCK TABLES `blogs` WRITE;
/*!40000 ALTER TABLE `blogs` DISABLE KEYS */;
INSERT INTO `blogs` VALUES (2,'bài viết test','- ⚡\r\n\r\n Cách 2 – View theo session / IP (phổ biến)\r\n\r\n👉 Phù hợp web vừa\r\n\r\nCách làm\r\n\r\nMỗi bài:\r\n\r\nchỉ tăng 1 view / user / 24h\r\n\r\nDựa vào:\r\n\r\nsession\r\n\r\ncookie\r\n\r\nIP + user-agent','https://res.cloudinary.com/damxodpnw/image/upload/v1774524825/enggo/blogs/thumbnails/oz9tqfrug5in76ltpvnu.jpg',1,'2026-01-30 09:03:37','2026-03-26 11:33:40','bai-viet-test','xcvzxcvzxcvzxcv','published',10,'Mẹo học tập'),(3,'bài viết test 2','🔹 2.3 Editor dùng để viết bài\r\n\r\nCó 3 kiểu phổ biến:\r\n\r\n✅ 1. Rich Text Editor (phổ biến nhất)\r\n\r\nVí dụ:\r\n\r\nCKEditor\r\n\r\nTinyMCE\r\n\r\nQuill\r\n\r\n👉 Lưu HTML vào DB\r\n\r\n✅ 2. Markdown Editor (dev rất thích)\r\n\r\nAdmin viết markdown\r\n\r\nDB lưu markdown\r\n\r\nFrontend render markdown → HTML\r\n\r\n👉 Rất gọn, dễ versioning\r\n\r\n✅ 3. Block-based (như Notion)\r\n\r\nMỗi block là text / image / heading\r\n\r\nLưu dạng JSON\r\n\r\n👉 Phù hợp site lớn, phức tạp','https://res.cloudinary.com/damxodpnw/image/upload/v1774524808/enggo/blogs/thumbnails/fza04klqo0wqmi1h6znq.jpg',1,'2026-01-30 09:05:05','2026-03-26 11:33:23','bai-viet-test-2','zxcvzxcvzxcvzxcv','published',3,'Ngữ pháp');
/*!40000 ALTER TABLE `blogs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `certificate_skills`
--

DROP TABLE IF EXISTS `certificate_skills`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `certificate_skills` (
  `certificate_skill_id` int NOT NULL AUTO_INCREMENT,
  `certificate_id` int NOT NULL,
  `skill_id` int NOT NULL,
  `weight` decimal(5,2) NOT NULL,
  `description` text,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  PRIMARY KEY (`certificate_skill_id`),
  KEY `certificate_id` (`certificate_id`),
  KEY `skill_id` (`skill_id`),
  CONSTRAINT `certificate_skills_ibfk_1` FOREIGN KEY (`certificate_id`) REFERENCES `certificates` (`certificate_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `certificate_skills_ibfk_2` FOREIGN KEY (`skill_id`) REFERENCES `skills` (`skill_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `certificate_skills`
--

LOCK TABLES `certificate_skills` WRITE;
/*!40000 ALTER TABLE `certificate_skills` DISABLE KEYS */;
INSERT INTO `certificate_skills` VALUES (1,1,1,50.00,'zxcvzxcvzxcv','2026-01-15 09:54:34','2026-01-15 09:54:34'),(2,1,2,50.00,'xzcvzxcvzxcv','2026-01-15 10:03:02','2026-01-15 10:03:02');
/*!40000 ALTER TABLE `certificate_skills` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `certificates`
--

DROP TABLE IF EXISTS `certificates`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `certificates` (
  `certificate_id` int NOT NULL AUTO_INCREMENT,
  `certificate_name` varchar(50) NOT NULL,
  `description` text NOT NULL,
  `total_score` int NOT NULL,
  `created_at` datetime NOT NULL,
  `certificate_status` tinyint(1) NOT NULL DEFAULT '1',
  PRIMARY KEY (`certificate_id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `certificates`
--

LOCK TABLES `certificates` WRITE;
/*!40000 ALTER TABLE `certificates` DISABLE KEYS */;
INSERT INTO `certificates` VALUES (1,'TOEIC','Chứng chỉ TOEIC (Test of English for International Communication) là bài thi quốc tế đánh giá khả năng sử dụng tiếng Anh giao tiếp trong môi trường công việc, thương mại và du lịch, được cấp bởi Viện Khảo thí Giáo dục Hoa Kỳ (ETS) và công nhận rộng rãi bởi nhiều tổ chức, doanh nghiệp trên thế giới. Bài thi tập trung vào kỹ năng Nghe & Đọc (Listening & Reading) và có thể mở rộng thêm Nói & Viết (Speaking & Writing), giúp ứng viên chứng minh năng lực tiếng Anh thực tế tại nơi làm việc, phục vụ mục đích tuyển dụng, thăng tiến, xét học bổng, và là điều kiện tốt nghiệp tại nhiều trường. ',990,'2026-01-11 10:01:59',1),(2,'IELTS','Chứng chỉ IELTS (International English Language Testing System) là một bài kiểm tra tiếng Anh quốc tế uy tín, đánh giá toàn diện 4 kỹ năng (Nghe, Nói, Đọc, Viết) và được công nhận toàn cầu cho mục đích du học, làm việc, định cư tại các nước nói tiếng Anh, giúp mở ra nhiều cơ hội học tập tại trường đại học, ứng tuyển công ty quốc tế và xin visa di trú. Có hai hình thức chính là Academic (học thuật) và General Training (tổng quát), được chấm điểm theo thang từ 0-9. ',9,'2026-01-11 10:48:18',1);
/*!40000 ALTER TABLE `certificates` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `container_questions`
--

DROP TABLE IF EXISTS `container_questions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `container_questions` (
  `container_question_id` int NOT NULL AUTO_INCREMENT,
  `container_id` int NOT NULL,
  `question_id` int NOT NULL,
  `order` int NOT NULL,
  `image_url` varchar(500) DEFAULT NULL,
  `score` decimal(5,2) DEFAULT '1.00',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`container_question_id`),
  KEY `container_id` (`container_id`),
  KEY `question_id` (`question_id`),
  CONSTRAINT `container_questions_ibfk_1` FOREIGN KEY (`container_id`) REFERENCES `exam_containers` (`container_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `container_questions_ibfk_2` FOREIGN KEY (`question_id`) REFERENCES `questions` (`question_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=416 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `container_questions`
--

LOCK TABLES `container_questions` WRITE;
/*!40000 ALTER TABLE `container_questions` DISABLE KEYS */;
INSERT INTO `container_questions` VALUES (168,19,170,1,'https://res.cloudinary.com/damxodpnw/image/upload/v1773821227/enggo/exams/images/rc4xvtyr2e79v5dyawiu.jpg',1.00,'2026-03-18 08:07:07','2026-03-18 08:07:07'),(169,19,171,2,'https://res.cloudinary.com/damxodpnw/image/upload/v1773821226/enggo/exams/images/o1cgsplvcgxk4pnds7kr.jpg',1.00,'2026-03-18 08:07:07','2026-03-18 08:07:07'),(170,19,172,3,'https://res.cloudinary.com/damxodpnw/image/upload/v1773821226/enggo/exams/images/rwbjxg1ndelvv3q2ijnv.jpg',1.00,'2026-03-18 08:07:07','2026-03-18 08:07:07'),(171,19,173,4,'https://res.cloudinary.com/damxodpnw/image/upload/v1773821227/enggo/exams/images/tf5vcrvldztrn9xnztdi.jpg',1.00,'2026-03-18 08:07:07','2026-03-18 08:07:07'),(172,19,174,5,'https://res.cloudinary.com/damxodpnw/image/upload/v1773821227/enggo/exams/images/bnheh9hzitlvhga3hs3e.jpg',1.00,'2026-03-18 08:07:07','2026-03-18 08:07:07'),(173,19,175,6,'https://res.cloudinary.com/damxodpnw/image/upload/v1773821227/enggo/exams/images/pu7rboyja5cdeb2kgp6a.jpg',1.00,'2026-03-18 08:07:07','2026-03-18 08:07:07'),(174,20,176,7,NULL,1.00,'2026-03-18 08:08:09','2026-03-18 08:08:09'),(175,20,177,8,NULL,1.00,'2026-03-18 08:08:09','2026-03-18 08:08:09'),(176,20,178,9,NULL,1.00,'2026-03-18 08:08:09','2026-03-18 08:08:09'),(177,20,179,10,NULL,1.00,'2026-03-18 08:08:09','2026-03-18 08:08:09'),(178,20,180,11,NULL,1.00,'2026-03-18 08:08:09','2026-03-18 08:08:09'),(179,20,181,12,NULL,1.00,'2026-03-18 08:08:09','2026-03-18 08:08:09'),(180,20,182,13,NULL,1.00,'2026-03-18 08:08:09','2026-03-18 08:08:09'),(181,20,183,14,NULL,1.00,'2026-03-18 08:08:09','2026-03-18 08:08:09'),(182,20,184,15,NULL,1.00,'2026-03-18 08:08:09','2026-03-18 08:08:09'),(183,20,185,16,NULL,1.00,'2026-03-18 08:08:09','2026-03-18 08:08:09'),(184,20,186,17,NULL,1.00,'2026-03-18 08:08:09','2026-03-18 08:08:09'),(185,20,187,18,NULL,1.00,'2026-03-18 08:08:09','2026-03-18 08:08:09'),(186,20,188,19,NULL,1.00,'2026-03-18 08:08:09','2026-03-18 08:08:09'),(187,20,189,20,NULL,1.00,'2026-03-18 08:08:09','2026-03-18 08:08:09'),(188,20,190,21,NULL,1.00,'2026-03-18 08:08:09','2026-03-18 08:08:09'),(189,20,191,22,NULL,1.00,'2026-03-18 08:08:09','2026-03-18 08:08:09'),(190,20,192,23,NULL,1.00,'2026-03-18 08:08:09','2026-03-18 08:08:09'),(191,20,193,24,NULL,1.00,'2026-03-18 08:08:09','2026-03-18 08:08:09'),(192,20,194,25,NULL,1.00,'2026-03-18 08:08:09','2026-03-18 08:08:09'),(193,20,195,26,NULL,1.00,'2026-03-18 08:08:09','2026-03-18 08:08:09'),(194,20,196,27,NULL,1.00,'2026-03-18 08:08:09','2026-03-18 08:08:09'),(195,20,197,28,NULL,1.00,'2026-03-18 08:08:09','2026-03-18 08:08:09'),(196,20,198,29,NULL,1.00,'2026-03-18 08:08:09','2026-03-18 08:08:09'),(197,20,199,30,NULL,1.00,'2026-03-18 08:08:10','2026-03-18 08:08:10'),(198,20,200,31,NULL,1.00,'2026-03-18 08:08:10','2026-03-18 08:08:10'),(199,22,201,32,NULL,1.00,'2026-03-18 08:44:44','2026-03-18 08:44:44'),(200,22,202,33,NULL,1.00,'2026-03-18 08:44:44','2026-03-18 08:44:44'),(201,22,203,34,NULL,1.00,'2026-03-18 08:44:44','2026-03-18 08:44:44'),(202,23,204,35,NULL,1.00,'2026-03-18 08:45:06','2026-03-18 08:45:06'),(203,23,205,36,NULL,1.00,'2026-03-18 08:45:06','2026-03-18 08:45:06'),(204,23,206,37,NULL,1.00,'2026-03-18 08:45:06','2026-03-18 08:45:06'),(205,21,207,35,NULL,1.00,'2026-03-18 08:48:18','2026-03-18 08:48:18'),(206,21,208,36,NULL,1.00,'2026-03-18 08:48:18','2026-03-18 08:48:18'),(207,21,209,37,NULL,1.00,'2026-03-18 08:48:18','2026-03-18 08:48:18'),(208,24,210,71,NULL,1.00,'2026-03-18 08:53:51','2026-03-18 08:53:51'),(209,24,211,72,NULL,1.00,'2026-03-18 08:53:51','2026-03-18 08:53:51'),(210,24,212,73,NULL,1.00,'2026-03-18 08:53:51','2026-03-18 08:53:51'),(211,25,213,74,NULL,1.00,'2026-03-18 08:54:25','2026-03-18 08:54:25'),(212,25,214,75,NULL,1.00,'2026-03-18 08:54:25','2026-03-18 08:54:25'),(213,25,215,76,NULL,1.00,'2026-03-18 08:54:25','2026-03-18 08:54:25'),(214,26,216,74,NULL,1.00,'2026-03-18 08:54:48','2026-03-18 08:54:48'),(215,26,217,75,NULL,1.00,'2026-03-18 08:54:48','2026-03-18 08:54:48'),(216,26,218,76,NULL,1.00,'2026-03-18 08:54:48','2026-03-18 08:54:48'),(217,27,219,101,NULL,1.00,'2026-03-18 08:57:08','2026-03-18 08:57:08'),(218,27,220,102,NULL,1.00,'2026-03-18 08:57:08','2026-03-18 08:57:08'),(219,27,221,103,NULL,1.00,'2026-03-18 08:57:08','2026-03-18 08:57:08'),(220,27,222,104,NULL,1.00,'2026-03-18 08:57:08','2026-03-18 08:57:08'),(221,27,223,105,NULL,1.00,'2026-03-18 08:57:08','2026-03-18 08:57:08'),(222,27,224,106,NULL,1.00,'2026-03-18 08:57:08','2026-03-18 08:57:08'),(223,27,225,107,NULL,1.00,'2026-03-18 08:57:08','2026-03-18 08:57:08'),(224,27,226,108,NULL,1.00,'2026-03-18 08:57:08','2026-03-18 08:57:08'),(225,27,227,109,NULL,1.00,'2026-03-18 08:57:08','2026-03-18 08:57:08'),(226,27,228,110,NULL,1.00,'2026-03-18 08:57:08','2026-03-18 08:57:08'),(227,27,229,111,NULL,1.00,'2026-03-18 08:57:08','2026-03-18 08:57:08'),(228,27,230,112,NULL,1.00,'2026-03-18 08:57:08','2026-03-18 08:57:08'),(229,27,231,113,NULL,1.00,'2026-03-18 08:57:08','2026-03-18 08:57:08'),(230,27,232,114,NULL,1.00,'2026-03-18 08:57:08','2026-03-18 08:57:08'),(231,27,233,115,NULL,1.00,'2026-03-18 08:57:08','2026-03-18 08:57:08'),(232,27,234,116,NULL,1.00,'2026-03-18 08:57:08','2026-03-18 08:57:08'),(233,27,235,117,NULL,1.00,'2026-03-18 08:57:08','2026-03-18 08:57:08'),(234,27,236,118,NULL,1.00,'2026-03-18 08:57:08','2026-03-18 08:57:08'),(235,27,237,119,NULL,1.00,'2026-03-18 08:57:08','2026-03-18 08:57:08'),(236,27,238,120,NULL,1.00,'2026-03-18 08:57:08','2026-03-18 08:57:08'),(237,27,239,121,NULL,1.00,'2026-03-18 08:57:08','2026-03-18 08:57:08'),(238,27,240,122,NULL,1.00,'2026-03-18 08:57:08','2026-03-18 08:57:08'),(239,27,241,123,NULL,1.00,'2026-03-18 08:57:08','2026-03-18 08:57:08'),(240,27,242,124,NULL,1.00,'2026-03-18 08:57:08','2026-03-18 08:57:08'),(241,27,243,125,NULL,1.00,'2026-03-18 08:57:08','2026-03-18 08:57:08'),(242,27,244,126,NULL,1.00,'2026-03-18 08:57:08','2026-03-18 08:57:08'),(243,27,245,127,NULL,1.00,'2026-03-18 08:57:08','2026-03-18 08:57:08'),(244,27,246,128,NULL,1.00,'2026-03-18 08:57:08','2026-03-18 08:57:08'),(245,27,247,129,NULL,1.00,'2026-03-18 08:57:08','2026-03-18 08:57:08'),(246,27,248,130,NULL,1.00,'2026-03-18 08:57:08','2026-03-18 08:57:08'),(247,27,249,131,NULL,1.00,'2026-03-18 08:57:08','2026-03-18 08:57:08'),(248,27,250,132,NULL,1.00,'2026-03-18 08:57:08','2026-03-18 08:57:08'),(249,27,251,133,NULL,1.00,'2026-03-18 08:57:08','2026-03-18 08:57:08'),(250,27,252,134,NULL,1.00,'2026-03-18 08:57:08','2026-03-18 08:57:08'),(251,27,253,135,NULL,1.00,'2026-03-18 08:57:08','2026-03-18 08:57:08'),(252,27,254,136,NULL,1.00,'2026-03-18 08:57:08','2026-03-18 08:57:08'),(253,27,255,137,NULL,1.00,'2026-03-18 08:57:08','2026-03-18 08:57:08'),(254,27,256,138,NULL,1.00,'2026-03-18 08:57:08','2026-03-18 08:57:08'),(255,27,257,139,NULL,1.00,'2026-03-18 08:57:08','2026-03-18 08:57:08'),(256,27,258,140,NULL,1.00,'2026-03-18 08:57:08','2026-03-18 08:57:08'),(257,29,259,141,NULL,1.00,'2026-03-18 09:46:36','2026-03-18 09:46:36'),(258,29,260,142,NULL,1.00,'2026-03-18 09:46:36','2026-03-18 09:46:36'),(259,29,261,143,NULL,1.00,'2026-03-18 09:46:36','2026-03-18 09:46:36'),(260,29,262,144,NULL,1.00,'2026-03-18 09:46:36','2026-03-18 09:46:36'),(261,29,263,145,NULL,1.00,'2026-03-18 09:46:36','2026-03-18 09:46:36'),(262,29,264,146,NULL,1.00,'2026-03-18 09:46:36','2026-03-18 09:46:36'),(263,29,265,147,NULL,1.00,'2026-03-18 09:46:36','2026-03-18 09:46:36'),(264,29,266,148,NULL,1.00,'2026-03-18 09:46:36','2026-03-18 09:46:36'),(280,34,282,1,'NULL',1.00,'2026-03-19 09:01:49','2026-03-19 09:01:49'),(281,34,283,2,'NULL',1.00,'2026-03-19 09:01:49','2026-03-19 09:01:49'),(282,34,284,3,'NULL',1.00,'2026-03-19 09:01:49','2026-03-19 09:01:49'),(283,38,285,32,NULL,5.00,'2026-03-19 09:12:45','2026-03-19 09:12:45'),(284,38,286,33,NULL,5.00,'2026-03-19 09:12:45','2026-03-19 09:12:45'),(285,38,287,34,NULL,5.00,'2026-03-19 09:12:45','2026-03-19 09:12:45'),(286,38,288,35,NULL,5.00,'2026-03-19 09:12:46','2026-03-19 09:12:46'),(287,39,289,36,NULL,5.00,'2026-03-19 09:13:17','2026-03-19 09:13:17'),(288,39,290,37,NULL,5.00,'2026-03-19 09:13:17','2026-03-19 09:13:17'),(289,39,291,38,NULL,5.00,'2026-03-19 09:13:17','2026-03-19 09:13:17'),(290,39,292,39,NULL,5.00,'2026-03-19 09:13:17','2026-03-19 09:13:17'),(291,36,293,7,NULL,5.00,'2026-03-19 09:14:04','2026-03-19 09:14:04'),(292,36,294,8,NULL,5.00,'2026-03-19 09:14:04','2026-03-19 09:14:04'),(293,36,295,9,NULL,5.00,'2026-03-19 09:14:04','2026-03-19 09:14:04'),(294,36,296,10,NULL,5.00,'2026-03-19 09:14:04','2026-03-19 09:14:04'),(295,36,297,11,NULL,5.00,'2026-03-19 09:14:04','2026-03-19 09:14:04'),(296,36,298,12,NULL,5.00,'2026-03-19 09:14:04','2026-03-19 09:14:04'),(297,36,299,13,NULL,5.00,'2026-03-19 09:14:04','2026-03-19 09:14:04'),(298,36,300,14,NULL,5.00,'2026-03-19 09:14:04','2026-03-19 09:14:04'),(299,36,301,15,NULL,5.00,'2026-03-19 09:14:04','2026-03-19 09:14:04'),(300,36,302,16,NULL,5.00,'2026-03-19 09:14:04','2026-03-19 09:14:04'),(301,36,303,17,NULL,5.00,'2026-03-19 09:14:04','2026-03-19 09:14:04'),(302,36,304,18,NULL,5.00,'2026-03-19 09:14:04','2026-03-19 09:14:04'),(303,36,305,19,NULL,5.00,'2026-03-19 09:14:04','2026-03-19 09:14:04'),(304,36,306,20,NULL,5.00,'2026-03-19 09:14:04','2026-03-19 09:14:04'),(305,36,307,21,NULL,5.00,'2026-03-19 09:14:04','2026-03-19 09:14:04'),(306,36,308,22,NULL,5.00,'2026-03-19 09:14:04','2026-03-19 09:14:04'),(307,36,309,23,NULL,5.00,'2026-03-19 09:14:04','2026-03-19 09:14:04'),(308,36,310,24,NULL,5.00,'2026-03-19 09:14:04','2026-03-19 09:14:04'),(309,36,311,25,NULL,5.00,'2026-03-19 09:14:04','2026-03-19 09:14:04'),(310,36,312,26,NULL,5.00,'2026-03-19 09:14:04','2026-03-19 09:14:04'),(311,36,313,27,NULL,5.00,'2026-03-19 09:14:04','2026-03-19 09:14:04'),(312,36,314,28,NULL,5.00,'2026-03-19 09:14:04','2026-03-19 09:14:04'),(313,36,315,29,NULL,5.00,'2026-03-19 09:14:04','2026-03-19 09:14:04'),(314,36,316,30,NULL,5.00,'2026-03-19 09:14:04','2026-03-19 09:14:04'),(315,36,317,31,NULL,5.00,'2026-03-19 09:14:04','2026-03-19 09:14:04'),(322,41,324,71,NULL,1.00,'2026-03-19 09:36:52','2026-03-19 09:36:52'),(323,41,325,72,NULL,1.00,'2026-03-19 09:36:52','2026-03-19 09:36:52'),(324,41,326,73,NULL,1.00,'2026-03-19 09:36:52','2026-03-19 09:36:52'),(325,41,327,74,NULL,1.00,'2026-03-19 09:36:52','2026-03-19 09:36:52'),(326,42,328,101,NULL,1.00,'2026-03-19 09:38:22','2026-03-19 09:38:22'),(327,42,329,102,NULL,1.00,'2026-03-19 09:38:22','2026-03-19 09:38:22'),(328,42,330,103,NULL,1.00,'2026-03-19 09:38:22','2026-03-19 09:38:22'),(329,42,331,104,NULL,1.00,'2026-03-19 09:38:22','2026-03-19 09:38:22'),(330,42,332,105,NULL,1.00,'2026-03-19 09:38:22','2026-03-19 09:38:22'),(331,42,333,106,NULL,1.00,'2026-03-19 09:38:22','2026-03-19 09:38:22'),(332,42,334,107,NULL,1.00,'2026-03-19 09:38:22','2026-03-19 09:38:22'),(333,42,335,108,NULL,1.00,'2026-03-19 09:38:22','2026-03-19 09:38:22'),(334,42,336,109,NULL,1.00,'2026-03-19 09:38:22','2026-03-19 09:38:22'),(335,42,337,110,NULL,1.00,'2026-03-19 09:38:22','2026-03-19 09:38:22'),(336,42,338,111,NULL,1.00,'2026-03-19 09:38:22','2026-03-19 09:38:22'),(337,42,339,112,NULL,1.00,'2026-03-19 09:38:22','2026-03-19 09:38:22'),(338,42,340,113,NULL,1.00,'2026-03-19 09:38:22','2026-03-19 09:38:22'),(339,42,341,114,NULL,1.00,'2026-03-19 09:38:22','2026-03-19 09:38:22'),(340,42,342,115,NULL,1.00,'2026-03-19 09:38:22','2026-03-19 09:38:22'),(341,42,343,116,NULL,1.00,'2026-03-19 09:38:22','2026-03-19 09:38:22'),(342,42,344,117,NULL,1.00,'2026-03-19 09:38:22','2026-03-19 09:38:22'),(343,42,345,118,NULL,1.00,'2026-03-19 09:38:22','2026-03-19 09:38:22'),(344,42,346,119,NULL,1.00,'2026-03-19 09:38:22','2026-03-19 09:38:22'),(345,42,347,120,NULL,1.00,'2026-03-19 09:38:22','2026-03-19 09:38:22'),(346,42,348,121,NULL,1.00,'2026-03-19 09:38:22','2026-03-19 09:38:22'),(347,42,349,122,NULL,1.00,'2026-03-19 09:38:22','2026-03-19 09:38:22'),(348,42,350,123,NULL,1.00,'2026-03-19 09:38:22','2026-03-19 09:38:22'),(349,42,351,124,NULL,1.00,'2026-03-19 09:38:22','2026-03-19 09:38:22'),(350,42,352,125,NULL,1.00,'2026-03-19 09:38:22','2026-03-19 09:38:22'),(351,42,353,126,NULL,1.00,'2026-03-19 09:38:22','2026-03-19 09:38:22'),(352,42,354,127,NULL,1.00,'2026-03-19 09:38:22','2026-03-19 09:38:22'),(353,42,355,128,NULL,1.00,'2026-03-19 09:38:22','2026-03-19 09:38:22'),(354,42,356,129,NULL,1.00,'2026-03-19 09:38:22','2026-03-19 09:38:22'),(355,42,357,130,NULL,1.00,'2026-03-19 09:38:22','2026-03-19 09:38:22'),(356,42,358,131,NULL,1.00,'2026-03-19 09:38:22','2026-03-19 09:38:22'),(357,42,359,132,NULL,1.00,'2026-03-19 09:38:22','2026-03-19 09:38:22'),(358,42,360,133,NULL,1.00,'2026-03-19 09:38:22','2026-03-19 09:38:22'),(359,42,361,134,NULL,1.00,'2026-03-19 09:38:22','2026-03-19 09:38:22'),(360,42,362,135,NULL,1.00,'2026-03-19 09:38:22','2026-03-19 09:38:22'),(361,42,363,136,NULL,1.00,'2026-03-19 09:38:22','2026-03-19 09:38:22'),(362,42,364,137,NULL,1.00,'2026-03-19 09:38:22','2026-03-19 09:38:22'),(363,42,365,138,NULL,1.00,'2026-03-19 09:38:22','2026-03-19 09:38:22'),(364,42,366,139,NULL,1.00,'2026-03-19 09:38:22','2026-03-19 09:38:22'),(365,42,367,140,NULL,1.00,'2026-03-19 09:38:22','2026-03-19 09:38:22'),(366,44,368,141,NULL,1.00,'2026-03-19 09:50:33','2026-03-19 09:50:33'),(367,44,369,142,NULL,1.00,'2026-03-19 09:50:33','2026-03-19 09:50:33'),(368,44,370,143,NULL,1.00,'2026-03-19 09:50:33','2026-03-19 09:50:33'),(369,44,371,144,NULL,1.00,'2026-03-19 09:50:33','2026-03-19 09:50:33'),(370,44,372,145,NULL,1.00,'2026-03-19 09:50:33','2026-03-19 09:50:33'),(371,46,373,1,'NULL',1.00,'2026-03-19 09:58:10','2026-03-19 09:58:10'),(372,46,374,2,'NULL',1.00,'2026-03-19 09:58:10','2026-03-19 09:58:10'),(373,46,375,3,'NULL',1.00,'2026-03-19 09:58:10','2026-03-19 09:58:10'),(374,47,376,5,'NULL',1.00,'2026-03-19 09:59:18','2026-03-19 09:59:18'),(375,47,377,6,'NULL',1.00,'2026-03-19 09:59:18','2026-03-19 09:59:18'),(376,47,378,7,'NULL',1.00,'2026-03-19 09:59:18','2026-03-19 09:59:18'),(377,47,379,8,'NULL',1.00,'2026-03-19 09:59:18','2026-03-19 09:59:18'),(378,35,380,1,'https://res.cloudinary.com/damxodpnw/image/upload/v1774426473/enggo/exams/images/mgfdsjwumjvewgzuugum.jpg',1.00,'2026-03-25 08:14:31','2026-03-25 08:14:31'),(379,35,381,2,'https://res.cloudinary.com/damxodpnw/image/upload/v1774426465/enggo/exams/images/jbjdag660abfa8wbjn9v.jpg',1.00,'2026-03-25 08:14:31','2026-03-25 08:14:31'),(380,35,382,3,'https://res.cloudinary.com/damxodpnw/image/upload/v1774426466/enggo/exams/images/mkvsj5x4usdmksxs1fyx.jpg',1.00,'2026-03-25 08:14:31','2026-03-25 08:14:31'),(381,35,383,4,'https://res.cloudinary.com/damxodpnw/image/upload/v1774426466/enggo/exams/images/nbxfyncqu7o6oydfxoek.jpg',1.00,'2026-03-25 08:14:31','2026-03-25 08:14:31'),(382,35,384,5,'https://res.cloudinary.com/damxodpnw/image/upload/v1774426466/enggo/exams/images/cxqqgouogiuyxdfodllw.jpg',1.00,'2026-03-25 08:14:31','2026-03-25 08:14:31'),(383,35,385,6,'https://res.cloudinary.com/damxodpnw/image/upload/v1774426467/enggo/exams/images/nyhk5kg51ybjkrnjbxsj.jpg',1.00,'2026-03-25 08:14:31','2026-03-25 08:14:31'),(384,48,386,1,NULL,1.00,'2026-03-29 15:15:47','2026-03-29 15:15:47'),(385,48,387,2,NULL,1.00,'2026-03-29 15:15:47','2026-03-29 15:15:47'),(386,48,388,3,NULL,1.00,'2026-03-29 15:15:47','2026-03-29 15:15:47'),(387,48,389,4,NULL,1.00,'2026-03-29 15:15:47','2026-03-29 15:15:47'),(388,48,390,5,NULL,1.00,'2026-03-29 15:15:47','2026-03-29 15:15:47'),(389,48,391,6,NULL,1.00,'2026-03-29 15:15:47','2026-03-29 15:15:47'),(390,48,392,7,NULL,1.00,'2026-03-29 15:15:47','2026-03-29 15:15:47'),(391,48,393,8,NULL,1.00,'2026-03-29 15:15:47','2026-03-29 15:15:47'),(392,48,394,9,NULL,1.00,'2026-03-29 15:15:47','2026-03-29 15:15:47'),(393,48,395,10,NULL,1.00,'2026-03-29 15:15:47','2026-03-29 15:15:47'),(394,49,396,11,NULL,1.00,'2026-03-29 15:17:39','2026-03-29 15:17:39'),(395,49,397,12,NULL,1.00,'2026-03-29 15:17:39','2026-03-29 15:17:39'),(396,49,398,13,NULL,1.00,'2026-03-29 15:17:39','2026-03-29 15:17:39'),(397,49,399,14,NULL,1.00,'2026-03-29 15:17:39','2026-03-29 15:17:39'),(398,49,400,15,NULL,1.00,'2026-03-29 15:17:39','2026-03-29 15:17:39'),(399,49,401,16,NULL,1.00,'2026-03-29 15:17:39','2026-03-29 15:17:39'),(400,49,402,17,NULL,1.00,'2026-03-29 15:17:39','2026-03-29 15:17:39'),(401,49,403,18,NULL,1.00,'2026-03-29 15:17:39','2026-03-29 15:17:39'),(402,49,404,19,NULL,1.00,'2026-03-29 15:17:39','2026-03-29 15:17:39'),(403,49,405,20,NULL,1.00,'2026-03-29 15:17:39','2026-03-29 15:17:39'),(404,50,406,1,NULL,1.00,'2026-03-29 15:19:32','2026-03-29 15:19:32'),(405,50,407,2,NULL,1.00,'2026-03-29 15:19:32','2026-03-29 15:19:32'),(406,50,408,3,NULL,1.00,'2026-03-29 15:19:32','2026-03-29 15:19:32'),(407,50,409,4,NULL,1.00,'2026-03-29 15:19:32','2026-03-29 15:19:32'),(408,50,410,5,NULL,1.00,'2026-03-29 15:19:32','2026-03-29 15:19:32'),(409,51,411,1,'https://res.cloudinary.com/damxodpnw/image/upload/v1774797841/enggo/exams/images/r5augimndqgkhfj6jnuh.jpg',1.00,'2026-03-29 15:23:59','2026-03-29 15:23:59'),(410,53,412,1,NULL,1.00,'2026-03-29 16:15:47','2026-03-29 16:15:47'),(411,53,413,1,NULL,1.00,'2026-03-29 16:16:05','2026-03-29 16:16:05'),(412,54,414,1,NULL,1.00,'2026-03-29 17:32:36','2026-03-29 17:32:36'),(413,52,415,1,NULL,1.00,'2026-03-30 06:55:17','2026-03-30 06:55:17'),(414,52,416,1,NULL,1.00,'2026-03-30 06:55:29','2026-03-30 06:55:29'),(415,52,417,1,NULL,1.00,'2026-03-30 06:55:43','2026-03-30 06:55:43');
/*!40000 ALTER TABLE `container_questions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `courses`
--

DROP TABLE IF EXISTS `courses`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `courses` (
  `course_id` int NOT NULL AUTO_INCREMENT,
  `course_title` varchar(100) NOT NULL,
  `description` text NOT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  `estimate_duration` int NOT NULL,
  `course_status` tinyint(1) NOT NULL DEFAULT '1',
  `tag` varchar(50) NOT NULL,
  `course_level` varchar(50) NOT NULL,
  `course_aim` varchar(255) NOT NULL,
  `access_type` enum('free','premium') NOT NULL DEFAULT 'free',
  PRIMARY KEY (`course_id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `courses`
--

LOCK TABLES `courses` WRITE;
/*!40000 ALTER TABLE `courses` DISABLE KEYS */;
INSERT INTO `courses` VALUES (1,'TOEIC từ 0 - 500+ cho người mới bắt đầu','zxcvzxcvzxcvzxcv','2026-01-13 11:43:52','2026-02-28 08:06:47',10,1,'TOEIC','Beginner','ádfasdfasdf','premium'),(2,'Cải thiện từ 500 - 700+ đạt điểm cao','asdfzxcvzmxncnvmzx,cmvzxcv','2026-01-13 11:56:58','2026-01-13 11:57:21',13,1,'TOEIC','Advanced','- Đạt được mức điểm\n- Phát triển nhiều kỹ năng','free');
/*!40000 ALTER TABLE `courses` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `document_phases`
--

DROP TABLE IF EXISTS `document_phases`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `document_phases` (
  `document_phase_id` int NOT NULL AUTO_INCREMENT,
  `order_index` int DEFAULT NULL,
  `phase_id` int NOT NULL,
  `document_id` int NOT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  PRIMARY KEY (`document_phase_id`),
  KEY `phase_id` (`phase_id`),
  KEY `document_id` (`document_id`),
  CONSTRAINT `document_phases_ibfk_1` FOREIGN KEY (`phase_id`) REFERENCES `phases` (`phase_id`),
  CONSTRAINT `document_phases_ibfk_2` FOREIGN KEY (`document_id`) REFERENCES `documents` (`document_id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `document_phases`
--

LOCK TABLES `document_phases` WRITE;
/*!40000 ALTER TABLE `document_phases` DISABLE KEYS */;
INSERT INTO `document_phases` VALUES (2,1,1,3,'2026-01-23 09:49:21','2026-01-23 09:49:21'),(3,0,1,2,'2026-01-23 09:49:24','2026-01-23 09:49:24');
/*!40000 ALTER TABLE `document_phases` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `documents`
--

DROP TABLE IF EXISTS `documents`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `documents` (
  `document_id` int NOT NULL AUTO_INCREMENT,
  `document_type` varchar(255) NOT NULL,
  `document_name` varchar(255) NOT NULL,
  `document_description` text NOT NULL,
  `document_url` varchar(255) NOT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  `document_size` varchar(255) DEFAULT NULL,
  `file_type` varchar(255) DEFAULT NULL,
  `view_count` int NOT NULL DEFAULT '0',
  `download_count` int NOT NULL DEFAULT '0',
  `access_type` enum('free','premium') NOT NULL DEFAULT 'free',
  PRIMARY KEY (`document_id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `documents`
--

LOCK TABLES `documents` WRITE;
/*!40000 ALTER TABLE `documents` DISABLE KEYS */;
INSERT INTO `documents` VALUES (2,'reference','Dạng 3 ','xxxxxxxxx','https://res.cloudinary.com/damxodpnw/raw/upload/v1769157296/enggo/documents/pdfs/file_kun6i3','2026-01-23 08:26:15','2026-01-23 08:34:55','426033','pdf',11,3,'premium'),(3,'learning','PART 3 - TEST 4','zxcvzxcv','https://res.cloudinary.com/damxodpnw/video/upload/v1769157573/enggo/documents/audios/file_mou90d.mp3','2026-01-23 08:39:33','2026-01-23 08:39:33','17462379','mp3',13,2,'free');
/*!40000 ALTER TABLE `documents` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `exam_containers`
--

DROP TABLE IF EXISTS `exam_containers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `exam_containers` (
  `container_id` int NOT NULL AUTO_INCREMENT,
  `exam_id` int NOT NULL,
  `skill` enum('reading','listening','writing','speaking') NOT NULL,
  `type` enum('toeic_group','toeic_single','ielts_passage','writing_task','speaking_part') NOT NULL,
  `order` int NOT NULL,
  `content` text,
  `instruction` text,
  `image_url` varchar(255) DEFAULT NULL,
  `audio_url` varchar(500) DEFAULT NULL,
  `time_limit` int DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `parent_id` int DEFAULT NULL,
  PRIMARY KEY (`container_id`),
  KEY `exam_id` (`exam_id`),
  KEY `exam_containers_parent_id_foreign_idx` (`parent_id`),
  CONSTRAINT `exam_containers_ibfk_1` FOREIGN KEY (`exam_id`) REFERENCES `exams` (`exam_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `exam_containers_parent_id_foreign_idx` FOREIGN KEY (`parent_id`) REFERENCES `exam_containers` (`container_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=55 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `exam_containers`
--

LOCK TABLES `exam_containers` WRITE;
/*!40000 ALTER TABLE `exam_containers` DISABLE KEYS */;
INSERT INTO `exam_containers` VALUES (19,2,'listening','toeic_single',1,'sfgsdfg','Part 1',NULL,'https://res.cloudinary.com/damxodpnw/video/upload/v1773821085/enggo/exams/audios/fi0eesmsdgcutywctatr.mp3',NULL,'2026-03-18 08:04:51','2026-03-18 08:04:51',NULL),(20,2,'listening','toeic_single',2,'ádfasdfasd','Part 2',NULL,'https://res.cloudinary.com/damxodpnw/video/upload/v1773821252/enggo/exams/audios/icnx44yiodkzbmyfalsm.mp3',NULL,'2026-03-18 08:07:44','2026-03-18 08:07:44',NULL),(21,2,'listening','toeic_group',3,'đầ','Part 3',NULL,'https://res.cloudinary.com/damxodpnw/video/upload/v1773821346/enggo/exams/audios/zngrcsfuqhjygit6j714.mp3',NULL,'2026-03-18 08:09:24','2026-03-18 08:09:24',NULL),(22,2,'listening','toeic_group',4,'ákjdhfjkashdkjfhaskjdhfkjashdkfjhaskdjfhakjsdhfkjahsdfasdfa','Conversation 1\n',NULL,NULL,NULL,'2026-03-18 08:09:47','2026-03-18 08:12:11',21),(23,2,'reading','toeic_group',4,'ấdfasd','Conversation 2',NULL,NULL,NULL,'2026-03-18 08:11:54','2026-03-18 08:44:55',21),(24,2,'listening','toeic_group',4,'gsdfgsdfgsdf','Part 4',NULL,'https://res.cloudinary.com/damxodpnw/video/upload/v1773823863/enggo/exams/audios/xbv10yqwxizqagcsz1v3.mp3',NULL,'2026-03-18 08:51:27','2026-03-18 08:51:27',NULL),(25,2,'listening','toeic_group',5,'asdasdf','Conversation 2',NULL,NULL,NULL,'2026-03-18 08:54:11','2026-03-18 08:54:11',24),(26,2,'listening','toeic_group',5,'adsgasdfasdf','Conversation 3',NULL,NULL,NULL,'2026-03-18 08:54:41','2026-03-18 08:54:41',24),(27,2,'reading','toeic_single',5,'asdfasdf','Part 5',NULL,NULL,NULL,'2026-03-18 08:56:29','2026-03-18 08:56:29',NULL),(28,2,'reading','toeic_group',6,'adafasdfasdf','Part 6\n',NULL,NULL,NULL,'2026-03-18 08:57:26','2026-03-18 08:57:26',NULL),(29,2,'reading','toeic_group',7,'m,znbvkzbxcmnvbmznxbcvmnbzxmncvbmznxbcvmnbajsdfkjalsdjflkajsdlfjasldjflajsdlkfjalksdjfajdlfjlaksjdfljalsdfjlasdjfljasdklf___adfalsjdflajsldf___-fadfjlaksjdf___afdljasldfj____ádfjalks','Conversation',NULL,NULL,NULL,'2026-03-18 09:46:02','2026-03-18 09:46:02',28),(30,2,'reading','toeic_group',7,'ấdfasdf','Part 7',NULL,NULL,NULL,'2026-03-18 09:49:12','2026-03-18 09:49:12',NULL),(34,2,'reading','toeic_group',7,'Email: Dear Ms. Carter, Thank you for contacting our support team regarding your recent order. We apologize for the delay in shipping. Due to high demand, the item will be sent out tomorrow and should arrive within three business days. If you have any further questions, please contact us again.','gsdfgsdfgsdfg',NULL,NULL,NULL,'2026-03-19 09:01:30','2026-03-19 09:01:30',30),(35,1,'listening','toeic_single',1,'vcbxcvbxcvbxcvb','Part 1',NULL,'https://res.cloudinary.com/damxodpnw/video/upload/v1773911178/enggo/exams/audios/tzlgnzsx96vgklws12fk.mp3',NULL,'2026-03-19 09:06:22','2026-03-19 09:06:22',NULL),(36,1,'listening','toeic_single',2,'ádfasdfasdfa','Part 2',NULL,'https://res.cloudinary.com/damxodpnw/video/upload/v1773911279/enggo/exams/audios/anzzqvneyqyub08gsdfw.mp3',NULL,'2026-03-19 09:08:13','2026-03-19 09:08:13',NULL),(37,1,'listening','toeic_group',3,'ádfasdfasdf','Part 3',NULL,'https://res.cloudinary.com/damxodpnw/video/upload/v1773911330/enggo/exams/audios/cj48caioiol1yereuwjc.mp3',NULL,'2026-03-19 09:09:08','2026-03-19 09:09:08',NULL),(38,1,'listening','toeic_group',3,'xcvzxnmcvbmznxbcmvbzxmcvbzmxbcvmnzxcvzxcvzxcvzxcv','Part 3 - Conversation 1',NULL,NULL,NULL,'2026-03-19 09:09:48','2026-03-19 09:18:08',37),(39,1,'listening','toeic_group',3,'cvzxcvzxcvzxcv','Part 3 - Conversation 2',NULL,NULL,NULL,'2026-03-19 09:10:45','2026-03-19 09:18:19',37),(40,1,'listening','toeic_group',4,'CXCCXZXCVZXCVZXCV','Part 4',NULL,'https://res.cloudinary.com/damxodpnw/video/upload/v1773911995/enggo/exams/audios/xwrys8cjj69wpnmejot1.mp3',NULL,'2026-03-19 09:20:20','2026-03-19 09:20:20',NULL),(41,1,'listening','toeic_group',3,'zxcvzxcvzxcvbxcvbxcv','Part 4 - Conversation 1','https://res.cloudinary.com/damxodpnw/image/upload/v1773912994/enggo/exams/images/w6kclzc3ayttmj6ncmcz.jpg',NULL,NULL,'2026-03-19 09:36:34','2026-03-19 09:36:34',40),(42,1,'reading','toeic_single',5,'zmxncbvmnzcvzxcv','Part 5',NULL,NULL,NULL,'2026-03-19 09:37:25','2026-03-19 09:37:25',NULL),(43,1,'reading','toeic_group',6,'zxcvzxcvzxcv','Part 6',NULL,NULL,NULL,'2026-03-19 09:38:52','2026-03-19 09:38:52',NULL),(44,1,'reading','toeic_group',6,' ','Part 6 - Conversation 1','https://res.cloudinary.com/damxodpnw/image/upload/v1773913202/enggo/exams/images/upat2rfr7rdrskigb2ye.jpg',NULL,NULL,'2026-03-19 09:40:01','2026-03-19 09:40:01',43),(45,1,'reading','toeic_group',7,'xcvbxcvbxcvb','Part 7',NULL,NULL,NULL,'2026-03-19 09:55:20','2026-03-19 09:55:20',NULL),(46,1,'reading','toeic_group',7,' ','Part 7 - Conversation 1','https://res.cloudinary.com/damxodpnw/image/upload/v1773914198/enggo/exams/images/kohzitrnrtipxdqmugwk.jpg',NULL,NULL,'2026-03-19 09:56:37','2026-03-19 09:56:37',45),(47,1,'reading','toeic_group',7,'Notice: The city museum will host a special photography exhibition from September 5 to September 20. The exhibition will feature works from local artists and will be open from 9 AM to 6 PM daily. Visitors are encouraged to book tickets online in advance to avoid long lines.','Part 7 - Conversation 2',NULL,NULL,NULL,'2026-03-19 09:58:49','2026-03-19 09:58:49',45),(48,3,'listening','ielts_passage',1,' ','Section 1 - Question 1 - 10',NULL,'https://res.cloudinary.com/damxodpnw/video/upload/v1774797290/enggo/exams/audios/ekhvfgpbtfwyomyjxumm.mp3',NULL,'2026-03-29 15:14:53','2026-03-29 15:14:53',NULL),(49,3,'listening','ielts_passage',2,' ','Section 2 - Question 11 - 20',NULL,'https://res.cloudinary.com/damxodpnw/video/upload/v1774797404/enggo/exams/audios/mwtnsubkikcxolx40qnb.mp3',NULL,'2026-03-29 15:16:55','2026-03-29 15:16:55',NULL),(50,3,'reading','ielts_passage',3,'Urban farming has become increasingly popular in large cities around the world. Many residents grow vegetables on rooftops or in small community gardens. This practice not only provides fresh food but also strengthens community relationships.','Passage 1 - Question 21 - 30',NULL,NULL,NULL,'2026-03-29 15:18:17','2026-03-29 15:26:41',NULL),(51,3,'writing','writing_task',4,' ','Task 1 - Writing Task 1','https://res.cloudinary.com/damxodpnw/image/upload/v1774797695/enggo/exams/images/sgblxog1gv6u6iytxuuw.jpg',NULL,NULL,'2026-03-29 15:21:33','2026-03-29 15:23:36',NULL),(52,3,'speaking','speaking_part',6,' ','Part 1 - Interview',NULL,NULL,NULL,'2026-03-29 16:02:22','2026-03-30 09:09:45',NULL),(53,3,'speaking','speaking_part',6,'Describe a memorable trip you have taken. You should say where you went, who you went with, what you did there, and explain why it was memorable.','Part 2 — Individual Long Turn',NULL,NULL,5,'2026-03-29 16:14:54','2026-03-29 16:14:54',NULL),(54,3,'writing','writing_task',5,' ','Task 2 - Writing Task',NULL,NULL,NULL,'2026-03-29 17:31:55','2026-03-29 17:32:08',NULL);
/*!40000 ALTER TABLE `exam_containers` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `exam_medias`
--

DROP TABLE IF EXISTS `exam_medias`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `exam_medias` (
  `media_id` int NOT NULL AUTO_INCREMENT,
  `exam_id` int NOT NULL,
  `audio_url` varchar(255) NOT NULL,
  `duration` int NOT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  PRIMARY KEY (`media_id`),
  KEY `exam_id` (`exam_id`),
  CONSTRAINT `exam_medias_ibfk_1` FOREIGN KEY (`exam_id`) REFERENCES `exams` (`exam_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `exam_medias`
--

LOCK TABLES `exam_medias` WRITE;
/*!40000 ALTER TABLE `exam_medias` DISABLE KEYS */;
/*!40000 ALTER TABLE `exam_medias` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `exam_question_stats`
--

DROP TABLE IF EXISTS `exam_question_stats`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `exam_question_stats` (
  `exam_question_stats_id` int NOT NULL AUTO_INCREMENT,
  `question_id` int NOT NULL,
  `total_correct` int NOT NULL DEFAULT '0',
  `total_wrong` int NOT NULL DEFAULT '0',
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  PRIMARY KEY (`exam_question_stats_id`),
  KEY `question_id` (`question_id`),
  CONSTRAINT `exam_question_stats_ibfk_1` FOREIGN KEY (`question_id`) REFERENCES `questions` (`question_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=44 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `exam_question_stats`
--

LOCK TABLES `exam_question_stats` WRITE;
/*!40000 ALTER TABLE `exam_question_stats` DISABLE KEYS */;
INSERT INTO `exam_question_stats` VALUES (1,170,0,2,'2026-03-25 11:23:27','2026-03-30 07:50:47'),(2,171,0,2,'2026-03-25 11:23:27','2026-03-30 07:50:47'),(3,172,0,2,'2026-03-25 11:23:27','2026-03-30 07:50:47'),(4,173,0,2,'2026-03-25 11:23:27','2026-03-30 07:50:47'),(5,174,0,2,'2026-03-25 11:23:27','2026-03-30 07:50:47'),(6,175,0,2,'2026-03-25 11:23:27','2026-03-30 07:50:47'),(7,176,0,2,'2026-03-25 11:23:27','2026-03-30 07:50:47'),(8,177,0,2,'2026-03-25 11:23:27','2026-03-30 07:50:47'),(9,178,0,2,'2026-03-25 11:23:27','2026-03-30 07:50:47'),(10,179,0,2,'2026-03-25 11:23:27','2026-03-30 07:50:47'),(11,180,0,2,'2026-03-25 11:23:27','2026-03-30 07:50:47'),(12,382,0,1,'2026-03-26 07:15:39','2026-03-26 07:15:39'),(13,383,0,1,'2026-03-26 07:15:39','2026-03-26 07:15:39'),(14,384,0,1,'2026-03-26 07:15:39','2026-03-26 07:15:39'),(15,385,0,1,'2026-03-26 07:15:39','2026-03-26 07:15:39'),(16,386,4,0,'2026-03-29 15:24:59','2026-03-30 10:02:05'),(17,387,0,4,'2026-03-29 15:25:00','2026-03-30 10:02:05'),(18,388,2,2,'2026-03-29 15:25:00','2026-03-30 10:02:05'),(19,389,1,3,'2026-03-29 15:25:00','2026-03-30 10:02:05'),(20,390,1,3,'2026-03-29 15:25:00','2026-03-30 10:02:05'),(21,391,1,3,'2026-03-29 15:25:00','2026-03-30 10:02:05'),(22,392,1,3,'2026-03-29 15:25:00','2026-03-30 10:02:05'),(23,393,2,2,'2026-03-29 15:25:00','2026-03-30 10:02:05'),(24,394,1,3,'2026-03-29 15:25:00','2026-03-30 10:02:05'),(25,406,0,4,'2026-03-29 15:27:17','2026-03-30 10:02:06'),(26,407,1,3,'2026-03-29 15:27:17','2026-03-30 10:02:06'),(27,408,0,4,'2026-03-29 15:27:17','2026-03-30 10:02:06'),(28,409,0,4,'2026-03-29 15:27:17','2026-03-30 10:02:06'),(29,410,0,4,'2026-03-29 15:27:17','2026-03-30 10:02:06'),(30,181,1,0,'2026-03-30 07:50:47','2026-03-30 07:50:47'),(31,182,0,1,'2026-03-30 07:50:47','2026-03-30 07:50:47'),(32,183,0,1,'2026-03-30 07:50:47','2026-03-30 07:50:47'),(33,395,0,3,'2026-03-30 08:47:50','2026-03-30 10:02:05'),(34,396,0,3,'2026-03-30 08:47:50','2026-03-30 10:02:05'),(35,397,0,3,'2026-03-30 08:47:50','2026-03-30 10:02:05'),(36,398,1,2,'2026-03-30 08:47:50','2026-03-30 10:02:05'),(37,399,0,3,'2026-03-30 08:47:50','2026-03-30 10:02:06'),(38,400,1,1,'2026-03-30 08:47:50','2026-03-30 10:02:06'),(39,401,0,3,'2026-03-30 08:47:50','2026-03-30 10:02:06'),(40,402,1,2,'2026-03-30 08:47:50','2026-03-30 10:02:06'),(41,403,1,2,'2026-03-30 08:47:50','2026-03-30 10:02:06'),(42,404,0,3,'2026-03-30 08:47:50','2026-03-30 10:02:06'),(43,405,0,3,'2026-03-30 08:47:50','2026-03-30 10:02:06');
/*!40000 ALTER TABLE `exam_question_stats` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `exams`
--

DROP TABLE IF EXISTS `exams`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `exams` (
  `exam_id` int NOT NULL AUTO_INCREMENT,
  `exam_title` varchar(255) NOT NULL,
  `exam_duration` int NOT NULL,
  `exam_code` char(10) NOT NULL,
  `year` int NOT NULL,
  `certificate_id` int DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  `exam_type` enum('TOEIC','IELTS') NOT NULL,
  `source` varchar(255) NOT NULL,
  `total_questions` int NOT NULL,
  PRIMARY KEY (`exam_id`),
  KEY `certificate_id` (`certificate_id`),
  CONSTRAINT `exams_ibfk_1` FOREIGN KEY (`certificate_id`) REFERENCES `certificates` (`certificate_id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `exams`
--

LOCK TABLES `exams` WRITE;
/*!40000 ALTER TABLE `exams` DISABLE KEYS */;
INSERT INTO `exams` VALUES (1,'ETS - 2025 - TEST 1',120,'TC8KFCZE',2026,1,'2026-02-06 08:59:50','2026-02-06 08:59:50','TOEIC','ETS',200),(2,'ETS - 20225 - TEST 2',120,'TC13CWGV',2026,1,'2026-03-17 07:12:02','2026-03-17 07:12:02','TOEIC','ETS',200),(3,'IELTS - 2025',120,'IEE1U8D1',2026,2,'2026-03-26 08:46:09','2026-03-26 08:46:09','IELTS','Cambrige',40);
/*!40000 ALTER TABLE `exams` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `feedbacks`
--

DROP TABLE IF EXISTS `feedbacks`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `feedbacks` (
  `feedback_id` int NOT NULL AUTO_INCREMENT,
  `score` float NOT NULL,
  `comment` text NOT NULL,
  `suggestion` text NOT NULL,
  `created_at` datetime DEFAULT NULL,
  PRIMARY KEY (`feedback_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `feedbacks`
--

LOCK TABLES `feedbacks` WRITE;
/*!40000 ALTER TABLE `feedbacks` DISABLE KEYS */;
/*!40000 ALTER TABLE `feedbacks` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `flashcard_sets`
--

DROP TABLE IF EXISTS `flashcard_sets`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `flashcard_sets` (
  `user_id` int DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  `source_type` varchar(255) DEFAULT NULL,
  `title` varchar(255) DEFAULT NULL,
  `description` varchar(255) DEFAULT NULL,
  `visibility` varchar(255) DEFAULT NULL,
  `created_by_type` enum('admin','user','AI') DEFAULT NULL,
  `total_cards` int DEFAULT NULL,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `flashcard_set_id` int NOT NULL AUTO_INCREMENT,
  `exam_id` int DEFAULT NULL,
  `user_exam_id` int DEFAULT NULL,
  PRIMARY KEY (`flashcard_set_id`),
  KEY `user_id` (`user_id`),
  KEY `flashcard_sets_exam_id_foreign_idx` (`exam_id`),
  KEY `flashcard_sets_user_exam_id_foreign_idx` (`user_exam_id`),
  CONSTRAINT `flashcard_sets_exam_id_foreign_idx` FOREIGN KEY (`exam_id`) REFERENCES `exams` (`exam_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `flashcard_sets_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `flashcard_sets_user_exam_id_foreign_idx` FOREIGN KEY (`user_exam_id`) REFERENCES `user_exams` (`user_exam_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `flashcard_sets`
--

LOCK TABLES `flashcard_sets` WRITE;
/*!40000 ALTER TABLE `flashcard_sets` DISABLE KEYS */;
INSERT INTO `flashcard_sets` VALUES (1,'2026-03-02 08:57:14','manual','Bộ card mới','zfafasdfasdf','public','admin',1,'2026-03-02 08:57:56',2,NULL,NULL),(4,'2026-03-14 04:12:01',NULL,'Chủ đề môi trường','bznxcvbmznxbcmnvbzmxncbvmnzbxcmvnbzxcv','public','user',22,'2026-03-14 07:11:09',3,NULL,NULL),(4,'2026-03-14 07:43:10',NULL,'Chủ đề văn phòng','bznmxbcvmnzbxcmnvbzxmncbv','private','user',50,'2026-03-14 07:44:30',4,NULL,NULL),(4,'2026-03-14 07:45:05',NULL,'Chủ đề du lịch','adsafgsdfgsdfg','public','user',50,'2026-03-14 07:45:50',5,NULL,NULL),(4,'2026-03-23 09:26:11',NULL,'[Tiếng Anh] Chủ đề Đại Dương','Bộ flashcard này bao gồm từ vựng và cụm từ liên quan đến đại dương, sinh vật biển và môi trường dưới nước, giúp học viên nâng cao khả năng giao tiếp và chuẩn bị cho các kỳ thi tiếng Anh.','private','AI',10,'2026-03-23 09:26:11',6,NULL,NULL),(4,'2026-03-23 09:35:06',NULL,'[Tiếng Anh] Chủ đề Đại Dương','Bộ flashcard này bao gồm từ vựng và cụm từ liên quan đến đại dương, sinh vật biển và môi trường dưới nước, giúp học viên nâng cao khả năng giao tiếp và chuẩn bị cho các kỳ thi tiếng Anh.','private','AI',10,'2026-03-23 09:35:06',7,NULL,NULL);
/*!40000 ALTER TABLE `flashcard_sets` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `flashcards`
--

DROP TABLE IF EXISTS `flashcards`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `flashcards` (
  `front_content` varchar(255) DEFAULT NULL,
  `back_content` varchar(255) DEFAULT NULL,
  `example` text,
  `difficulty_level` char(50) DEFAULT NULL,
  `flashcard_set_id` int NOT NULL,
  `container_question_id` int DEFAULT NULL,
  `pronunciation` varchar(255) DEFAULT NULL,
  `flashcard_id` int NOT NULL AUTO_INCREMENT,
  PRIMARY KEY (`flashcard_id`),
  KEY `flashcard_container_question_id_foreign_idx` (`container_question_id`),
  KEY `flashcard_flashcard_set_id_foreign_idx` (`flashcard_set_id`),
  CONSTRAINT `flashcard_container_question_id_foreign_idx` FOREIGN KEY (`container_question_id`) REFERENCES `container_questions` (`container_question_id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `flashcard_flashcard_set_id_foreign_idx` FOREIGN KEY (`flashcard_set_id`) REFERENCES `flashcard_sets` (`flashcard_set_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=166 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `flashcards`
--

LOCK TABLES `flashcards` WRITE;
/*!40000 ALTER TABLE `flashcards` DISABLE KEYS */;
INSERT INTO `flashcards` VALUES ('Pig','Con heo','The meat produced from a pig is called pork, bacon, or ham.','beginner',2,NULL,'pɪɡ',3),('environment','ɪnˈvaɪ.rə.mənt','The radiation leak has had a disastrous effect on the environment.','easy',3,NULL,'ɪnˈvaɪ.rə.mənt',4),('water','Nước','The water\'s warm - are you coming in?','easy',3,NULL,'/ˈwɔː.tər/',5),('Environment','Môi trường','Ví dụ: We must protect the environment.',NULL,3,NULL,'/ɪnˈvaɪrənmənt/',26),('Pollution','Ô nhiễm','Ví dụ: Air pollution is a serious problem.',NULL,3,NULL,'/pəˈluːʃən/',27),('Global warming','Sự nóng lên toàn cầu','Ví dụ: Global warming affects the climate.',NULL,3,NULL,'/ˌɡləʊbəl ˈwɔːmɪŋ/',28),('Climate change','Biến đổi khí hậu','Ví dụ: Climate change causes extreme weather.',NULL,3,NULL,'/ˈklaɪmət tʃeɪndʒ/',29),('Recycling','Tái chế','Ví dụ: Recycling helps reduce waste.',NULL,3,NULL,'/ˌriːˈsaɪklɪŋ/',30),('Renewable energy','Năng lượng tái tạo','Ví dụ: Solar power is a renewable energy source.',NULL,3,NULL,'/rɪˈnjuːəbl ˈenədʒi/',31),('Deforestation','Nạn phá rừng','Ví dụ: Deforestation destroys wildlife habitats.',NULL,3,NULL,'/diːˌfɒrɪˈsteɪʃən/',32),('Biodiversity','Đa dạng sinh học','Ví dụ: Biodiversity is essential for ecosystems.',NULL,3,NULL,'/ˌbaɪəʊdaɪˈvɜːsəti/',33),('Ecosystem','Hệ sinh thái','Ví dụ: The forest ecosystem is very fragile.',NULL,3,NULL,'/ˈiːkəʊsɪstəm/',34),('Conservation','Sự bảo tồn','Ví dụ: Wildlife conservation is important.',NULL,3,NULL,'/ˌkɒnsəˈveɪʃən/',35),('Carbon footprint','Lượng khí thải carbon','Ví dụ: We should reduce our carbon footprint.',NULL,3,NULL,'/ˈkɑːbən ˈfʊtprɪnt/',36),('Waste','Rác thải','Ví dụ: Too much plastic waste harms the ocean.',NULL,3,NULL,'/weɪst/',37),('Sustainable','Bền vững','Ví dụ: We need sustainable development.',NULL,3,NULL,'/səˈsteɪnəbl/',38),('Greenhouse gas','Khí nhà kính','Ví dụ: Greenhouse gases trap heat in the atmosphere.',NULL,3,NULL,'/ˈɡriːnhaʊs ɡæs/',39),('Natural resources','Tài nguyên thiên nhiên','Ví dụ: Water and forests are natural resources.',NULL,3,NULL,'/ˈnætʃrəl rɪˈzɔːsɪz/',40),('Wildlife','Động vật hoang dã','Ví dụ: Wildlife needs protection.',NULL,3,NULL,'/ˈwaɪldlaɪf/',41),('Habitat','Môi trường sống','Ví dụ: Many animals lose their habitat.',NULL,3,NULL,'/ˈhæbɪtæt/',42),('Ocean pollution','Ô nhiễm đại dương','Ví dụ: Ocean pollution kills marine animals.',NULL,3,NULL,'/ˈəʊʃən pəˈluːʃən/',43),('Plastic waste','Rác thải nhựa','Ví dụ: Plastic waste is everywhere.',NULL,3,NULL,'/ˈplæstɪk weɪst/',44),('Environmental protection','Bảo vệ môi trường','Ví dụ: Environmental protection is everyone\'s responsibility.',NULL,3,NULL,'/ɪnˌvaɪrənˈmentl prəˈtekʃən/',45),('Office','Văn phòng','Ví dụ: She works in an office.',NULL,4,NULL,'/ˈɒfɪs/',46),('Employee','Nhân viên','Ví dụ: The employee finished the report.',NULL,4,NULL,'/ɪmˈplɔɪiː/',47),('Manager','Quản lý','Ví dụ: The manager called a meeting.',NULL,4,NULL,'/ˈmænɪdʒə/',48),('Meeting','Cuộc họp','Ví dụ: We have a meeting at 9 AM.',NULL,4,NULL,'/ˈmiːtɪŋ/',49),('Deadline','Hạn chót','Ví dụ: The project deadline is tomorrow.',NULL,4,NULL,'/ˈdedlaɪn/',50),('Report','Báo cáo','Ví dụ: He is writing a report.',NULL,4,NULL,'/rɪˈpɔːt/',51),('Schedule','Lịch trình','Ví dụ: Check the meeting schedule.',NULL,4,NULL,'/ˈskedʒuːl/',52),('Task','Nhiệm vụ','Ví dụ: She completed the task quickly.',NULL,4,NULL,'/tɑːsk/',53),('Document','Tài liệu','Ví dụ: Please sign this document.',NULL,4,NULL,'/ˈdɒkjʊmənt/',54),('Printer','Máy in','Ví dụ: The printer is out of paper.',NULL,4,NULL,'/ˈprɪntə/',55),('Scanner','Máy scan','Ví dụ: Scan the document first.',NULL,4,NULL,'/ˈskænə/',56),('Photocopier','Máy photocopy','Ví dụ: Use the photocopier to copy the file.',NULL,4,NULL,'/ˈfəʊtəʊˌkɒpiə/',57),('Desk','Bàn làm việc','Ví dụ: My desk is near the window.',NULL,4,NULL,'/desk/',58),('Chair','Ghế','Ví dụ: This chair is comfortable.',NULL,4,NULL,'/tʃeə/',59),('Computer','Máy tính','Ví dụ: I use a computer at work.',NULL,4,NULL,'/kəmˈpjuːtə/',60),('Laptop','Máy tính xách tay','Ví dụ: She brought her laptop to the office.',NULL,4,NULL,'/ˈlæptɒp/',61),('Keyboard','Bàn phím','Ví dụ: The keyboard is broken.',NULL,4,NULL,'/ˈkiːbɔːd/',62),('Mouse','Chuột máy tính','Ví dụ: Click the icon with the mouse.',NULL,4,NULL,'/maʊs/',63),('Email','Thư điện tử','Ví dụ: I sent you an email.',NULL,4,NULL,'/ˈiːmeɪl/',64),('Attachment','Tệp đính kèm','Ví dụ: Please check the email attachment.',NULL,4,NULL,'/əˈtætʃmənt/',65),('Conference','Hội nghị','Ví dụ: The conference starts tomorrow.',NULL,4,NULL,'/ˈkɒnfərəns/',66),('Presentation','Bài thuyết trình','Ví dụ: She prepared a presentation.',NULL,4,NULL,'/ˌprezənˈteɪʃən/',67),('Project','Dự án','Ví dụ: The project will take three months.',NULL,4,NULL,'/ˈprɒdʒekt/',68),('Department','Phòng ban','Ví dụ: He works in the sales department.',NULL,4,NULL,'/dɪˈpɑːtmənt/',69),('Colleague','Đồng nghiệp','Ví dụ: My colleagues are very helpful.',NULL,4,NULL,'/ˈkɒliːɡ/',70),('Boss','Sếp','Ví dụ: The boss approved the plan.',NULL,4,NULL,'/bɒs/',71),('Salary','Lương','Ví dụ: She received a salary increase.',NULL,4,NULL,'/ˈsæləri/',72),('Promotion','Thăng chức','Ví dụ: He got a promotion last year.',NULL,4,NULL,'/prəˈməʊʃən/',73),('Training','Đào tạo','Ví dụ: New employees attend training.',NULL,4,NULL,'/ˈtreɪnɪŋ/',74),('Interview','Phỏng vấn','Ví dụ: She has a job interview tomorrow.',NULL,4,NULL,'/ˈɪntəvjuː/',75),('Contract','Hợp đồng','Ví dụ: He signed the contract.',NULL,4,NULL,'/ˈkɒntrækt/',76),('Appointment','Cuộc hẹn','Ví dụ: I have an appointment with the manager.',NULL,4,NULL,'/əˈpɔɪntmənt/',77),('Agenda','Chương trình cuộc họp','Ví dụ: Please review the meeting agenda.',NULL,4,NULL,'/əˈdʒendə/',78),('Minutes','Biên bản cuộc họp','Ví dụ: She wrote the meeting minutes.',NULL,4,NULL,'/ˈmɪnɪts/',79),('Break','Giờ nghỉ','Ví dụ: Let\'s take a short break.',NULL,4,NULL,'/breɪk/',80),('Overtime','Làm thêm giờ','Ví dụ: He works overtime sometimes.',NULL,4,NULL,'/ˈəʊvətaɪm/',81),('Workload','Khối lượng công việc','Ví dụ: The workload is heavy this week.',NULL,4,NULL,'/ˈwɜːkləʊd/',82),('Deadline pressure','Áp lực hạn chót','Ví dụ: Deadline pressure can be stressful.',NULL,4,NULL,'/ˈdedlaɪn ˈpreʃə/',83),('File','Hồ sơ / tệp','Ví dụ: Save the file on the computer.',NULL,4,NULL,'/faɪl/',84),('Folder','Thư mục','Ví dụ: Put the documents in this folder.',NULL,4,NULL,'/ˈfəʊldə/',85),('Cabinet','Tủ hồ sơ','Ví dụ: The files are in the cabinet.',NULL,4,NULL,'/ˈkæbɪnɪt/',86),('Stationery','Văn phòng phẩm','Ví dụ: We need more stationery.',NULL,4,NULL,'/ˈsteɪʃənəri/',87),('Pen','Bút','Ví dụ: I need a pen to sign this.',NULL,4,NULL,'/pen/',88),('Notebook','Sổ tay','Ví dụ: She writes notes in her notebook.',NULL,4,NULL,'/ˈnəʊtbʊk/',89),('Stapler','Máy bấm kim','Ví dụ: Use the stapler for these papers.',NULL,4,NULL,'/ˈsteɪplə/',90),('Paper clip','Kẹp giấy','Ví dụ: Attach the documents with a paper clip.',NULL,4,NULL,'/ˈpeɪpə klɪp/',91),('Whiteboard','Bảng trắng','Ví dụ: Write the plan on the whiteboard.',NULL,4,NULL,'/ˈwaɪtbɔːd/',92),('Marker','Bút lông','Ví dụ: Use a marker to write clearly.',NULL,4,NULL,'/ˈmɑːkə/',93),('Office supplies','Dụng cụ văn phòng','Ví dụ: Order new office supplies.',NULL,4,NULL,'/ˈɒfɪs səˈplaɪz/',94),('Workspace','Không gian làm việc','Ví dụ: Keep your workspace clean.',NULL,4,NULL,'/ˈwɜːkspeɪs/',95),('Travel','Du lịch','Ví dụ: I love to travel around the world.',NULL,5,NULL,'/ˈtrævəl/',96),('Trip','Chuyến đi','Ví dụ: We planned a trip to the beach.',NULL,5,NULL,'/trɪp/',97),('Journey','Hành trình','Ví dụ: The journey took five hours.',NULL,5,NULL,'/ˈdʒɜːni/',98),('Tourist','Khách du lịch','Ví dụ: Many tourists visit this city.',NULL,5,NULL,'/ˈtʊərɪst/',99),('Tourism','Ngành du lịch','Ví dụ: Tourism brings money to the country.',NULL,5,NULL,'/ˈtʊərɪzəm/',100),('Destination','Điểm đến','Ví dụ: Paris is a popular destination.',NULL,5,NULL,'/ˌdestɪˈneɪʃən/',101),('Attraction','Điểm tham quan','Ví dụ: This museum is a famous attraction.',NULL,5,NULL,'/əˈtrækʃən/',102),('Landmark','Địa danh nổi tiếng','Ví dụ: The tower is a famous landmark.',NULL,5,NULL,'/ˈlændmɑːk/',103),('Sightseeing','Tham quan','Ví dụ: We spent the day sightseeing.',NULL,5,NULL,'/ˈsaɪtsiːɪŋ/',104),('Guide','Hướng dẫn viên','Ví dụ: The guide explained the history.',NULL,5,NULL,'/ɡaɪd/',105),('Tour','Chuyến tham quan','Ví dụ: We joined a city tour.',NULL,5,NULL,'/tʊə/',106),('Backpack','Ba lô du lịch','Ví dụ: He travels with a backpack.',NULL,5,NULL,'/ˈbækpæk/',107),('Luggage','Hành lý','Ví dụ: My luggage is very heavy.',NULL,5,NULL,'/ˈlʌɡɪdʒ/',108),('Suitcase','Va li','Ví dụ: She packed her suitcase.',NULL,5,NULL,'/ˈsuːtkeɪs/',109),('Passport','Hộ chiếu','Ví dụ: Don’t forget your passport.',NULL,5,NULL,'/ˈpɑːspɔːt/',110),('Visa','Thị thực','Ví dụ: I need a visa to enter the country.',NULL,5,NULL,'/ˈviːzə/',111),('Ticket','Vé','Ví dụ: I bought a plane ticket online.',NULL,5,NULL,'/ˈtɪkɪt/',112),('Boarding pass','Thẻ lên máy bay','Ví dụ: Show your boarding pass at the gate.',NULL,5,NULL,'/ˈbɔːdɪŋ pɑːs/',113),('Airport','Sân bay','Ví dụ: We arrived at the airport early.',NULL,5,NULL,'/ˈeəpɔːt/',114),('Airline','Hãng hàng không','Ví dụ: This airline is very popular.',NULL,5,NULL,'/ˈeəlaɪn/',115),('Flight','Chuyến bay','Ví dụ: Our flight leaves at 7 PM.',NULL,5,NULL,'/flaɪt/',116),('Departure','Khởi hành','Ví dụ: Check the departure time.',NULL,5,NULL,'/dɪˈpɑːtʃə/',117),('Arrival','Đến nơi','Ví dụ: The arrival time is 10 AM.',NULL,5,NULL,'/əˈraɪvəl/',118),('Delay','Trì hoãn','Ví dụ: The flight delay was two hours.',NULL,5,NULL,'/dɪˈleɪ/',119),('Hotel','Khách sạn','Ví dụ: We stayed in a small hotel.',NULL,5,NULL,'/həʊˈtel/',120),('Hostel','Nhà nghỉ giá rẻ','Ví dụ: Backpackers often stay in hostels.',NULL,5,NULL,'/ˈhɒstəl/',121),('Resort','Khu nghỉ dưỡng','Ví dụ: They booked a beach resort.',NULL,5,NULL,'/rɪˈzɔːt/',122),('Reservation','Đặt chỗ','Ví dụ: I made a hotel reservation.',NULL,5,NULL,'/ˌrezəˈveɪʃən/',123),('Check-in','Làm thủ tục nhận phòng','Ví dụ: Check-in starts at 2 PM.',NULL,5,NULL,'/ˈtʃek ɪn/',124),('Check-out','Trả phòng','Ví dụ: Check-out is before noon.',NULL,5,NULL,'/ˈtʃek aʊt/',125),('Map','Bản đồ','Ví dụ: Use a map to find the location.',NULL,5,NULL,'/mæp/',126),('Guidebook','Sách hướng dẫn du lịch','Ví dụ: The guidebook shows famous places.',NULL,5,NULL,'/ˈɡaɪdbʊk/',127),('Beach','Bãi biển','Ví dụ: The beach is very beautiful.',NULL,5,NULL,'/biːtʃ/',128),('Mountain','Núi','Ví dụ: We climbed the mountain.',NULL,5,NULL,'/ˈmaʊntən/',129),('Island','Hòn đảo','Ví dụ: The island attracts many visitors.',NULL,5,NULL,'/ˈaɪlənd/',130),('Culture','Văn hóa','Ví dụ: I want to learn about local culture.',NULL,5,NULL,'/ˈkʌltʃə/',131),('Tradition','Truyền thống','Ví dụ: The festival is a local tradition.',NULL,5,NULL,'/trəˈdɪʃən/',132),('Local food','Món ăn địa phương','Ví dụ: Try the local food when traveling.',NULL,5,NULL,'/ˈləʊkəl fuːd/',133),('Souvenir','Quà lưu niệm','Ví dụ: I bought a souvenir for my friend.',NULL,5,NULL,'/ˌsuːvəˈnɪə/',134),('Photograph','Bức ảnh','Ví dụ: She took many photographs.',NULL,5,NULL,'/ˈfəʊtəɡrɑːf/',135),('Adventure','Cuộc phiêu lưu','Ví dụ: Traveling can be a great adventure.',NULL,5,NULL,'/ədˈventʃə/',136),('Explore','Khám phá','Ví dụ: We want to explore the city.',NULL,5,NULL,'/ɪkˈsplɔː/',137),('Discover','Khám phá ra','Ví dụ: They discovered a beautiful beach.',NULL,5,NULL,'/dɪˈskʌvə/',138),('Experience','Trải nghiệm','Ví dụ: It was an amazing travel experience.',NULL,5,NULL,'/ɪkˈspɪəriəns/',139),('Vacation','Kỳ nghỉ','Ví dụ: We went on vacation last summer.',NULL,5,NULL,'/vəˈkeɪʃən/',140),('Holiday','Kỳ nghỉ','Ví dụ: They spent their holiday in Japan.',NULL,5,NULL,'/ˈhɒlədeɪ/',141),('Travel agency','Công ty du lịch','Ví dụ: The travel agency planned our trip.',NULL,5,NULL,'/ˈtrævəl ˈeɪdʒənsi/',142),('Tour package','Gói du lịch','Ví dụ: We booked a tour package online.',NULL,5,NULL,'/tʊə ˈpækɪdʒ/',143),('Transportation','Phương tiện di chuyển','Ví dụ: Public transportation is convenient.',NULL,5,NULL,'/ˌtrænspɔːˈteɪʃən/',144),('Itinerary','Lịch trình du lịch','Ví dụ: The itinerary includes three cities.',NULL,5,NULL,'/aɪˈtɪnərəri/',145),('coral reef','rạn san hô (noun) - một hệ sinh thái đa dạng sinh học dưới nước.','The Great Barrier Reef in Australia is the largest coral reef system in the world.','medium',6,NULL,'/ˈkɔːrəl riːf/',146),('marine life','cuộc sống biển (noun) - tất cả các sinh vật sống trong đại dương.','Marine life includes fish, whales, sharks, and many other species.','medium',6,NULL,'/məˈriːn laɪf/',147),('biodiversity','đa dạng sinh học (noun) - sự đa dạng của các loài sinh vật trong một khu vực.','Protecting biodiversity is essential for maintaining healthy ocean ecosystems.','medium',6,NULL,'/ˌbaɪoʊdaɪˈvɜːrsɪti/',148),('sea turtle','rùa biển (noun) - một loại bò sát sống chủ yếu trong nước biển.','Sea turtles are known for their long migrations across the oceans.','medium',6,NULL,'/siː ˈtɜːrtl/',149),('ocean current','dòng hải lưu (noun) - dòng nước di chuyển trong đại dương.','The Gulf Stream is a powerful ocean current that affects the climate of the east coast of the United States.','medium',6,NULL,'/ˈoʊʃən ˈkɜːrənt/',150),('plankton','plankton (noun) - sinh vật nhỏ bé sống trôi nổi trong nước, là nguồn thức ăn cho nhiều loài cá.','Plankton is the foundation of the ocean food web.','medium',6,NULL,'/ˈplæŋk.tən/',151),('overfishing','câu cá quá mức (noun) - việc đánh bắt cá nhiều hơn khả năng tái sản xuất của chúng.','Overfishing has led to a significant decline in fish populations around the world.','medium',6,NULL,'/ˈoʊvərˌfɪʃɪŋ/',152),('whale watching','quan sát cá voi (noun) - hoạt động ngắm nhìn cá voi trong môi trường tự nhiên của chúng.','Whale watching is a popular tourist activity in many coastal areas.','medium',6,NULL,'/weɪl ˈwɑːtʃɪŋ/',153),('saltwater','nước mặn (noun) - nước có chứa muối, thường gặp ở đại dương.','Saltwater can be found in oceans and seas, as opposed to freshwater in rivers and lakes.','medium',6,NULL,'/ˈsɔːltˌwɔːtər/',154),('ecosystem','hệ sinh thái (noun) - một cộng đồng sinh vật tương tác với môi trường sống của chúng.','Healthy ocean ecosystems are vital for the planet\'s overall health.','medium',6,NULL,'/ˈiːkoʊˌsɪstəm/',155),('coral reef','rạn san hô (noun) - một hệ sinh thái đa dạng sinh học dưới nước.','The Great Barrier Reef in Australia is the largest coral reef system in the world.','medium',7,NULL,'/ˈkɔːrəl riːf/',156),('marine life','cuộc sống biển (noun) - tất cả các sinh vật sống trong đại dương.','Marine life includes fish, whales, sharks, and many other species.','medium',7,NULL,'/məˈriːn laɪf/',157),('plankton','plankton (noun) - sinh vật nhỏ bé sống trôi nổi trong nước, là nguồn thức ăn cho nhiều loài cá.','Plankton is the foundation of the ocean food web.','medium',7,NULL,'/ˈplæŋk.tən/',158),('ocean current','dòng hải lưu (noun) - dòng nước di chuyển trong đại dương.','The Gulf Stream is a powerful ocean current that affects the climate of the east coast of the United States.','medium',7,NULL,'/ˈoʊʃən ˈkɜːrənt/',159),('biodiversity','đa dạng sinh học (noun) - sự đa dạng của các loài sinh vật trong một khu vực.','Protecting biodiversity is essential for maintaining healthy ocean ecosystems.','medium',7,NULL,'/ˌbaɪoʊdaɪˈvɜːrsɪti/',160),('sea turtle','rùa biển (noun) - một loại bò sát sống chủ yếu trong nước biển.','Sea turtles are known for their long migrations across the oceans.','medium',7,NULL,'/siː ˈtɜːrtl/',161),('overfishing','câu cá quá mức (noun) - việc đánh bắt cá nhiều hơn khả năng tái sản xuất của chúng.','Overfishing has led to a significant decline in fish populations around the world.','medium',7,NULL,'/ˈoʊvərˌfɪʃɪŋ/',162),('whale watching','quan sát cá voi (noun) - hoạt động ngắm nhìn cá voi trong môi trường tự nhiên của chúng.','Whale watching is a popular tourist activity in many coastal areas.','medium',7,NULL,'/weɪl ˈwɑːtʃɪŋ/',163),('saltwater','nước mặn (noun) - nước có chứa muối, thường gặp ở đại dương.','Saltwater can be found in oceans and seas, as opposed to freshwater in rivers and lakes.','medium',7,NULL,'/ˈsɔːltˌwɔːtər/',164),('ecosystem','hệ sinh thái (noun) - một cộng đồng sinh vật tương tác với môi trường sống của chúng.','Healthy ocean ecosystems are vital for the planet\'s overall health.','medium',7,NULL,'/ˈiːkoʊˌsɪstəm/',165);
/*!40000 ALTER TABLE `flashcards` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `issuese`
--

DROP TABLE IF EXISTS `issuese`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `issuese` (
  `issue_id` int NOT NULL AUTO_INCREMENT,
  `issue_name` varchar(255) NOT NULL,
  `user_id` int DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`issue_id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `issuese_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `issuese`
--

LOCK TABLES `issuese` WRITE;
/*!40000 ALTER TABLE `issuese` DISABLE KEYS */;
/*!40000 ALTER TABLE `issuese` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `languages`
--

DROP TABLE IF EXISTS `languages`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `languages` (
  `language_id` int NOT NULL AUTO_INCREMENT,
  `language_name` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`language_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `languages`
--

LOCK TABLES `languages` WRITE;
/*!40000 ALTER TABLE `languages` DISABLE KEYS */;
/*!40000 ALTER TABLE `languages` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `lesson_medias`
--

DROP TABLE IF EXISTS `lesson_medias`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `lesson_medias` (
  `media_id` int NOT NULL AUTO_INCREMENT,
  `media_type` varchar(20) NOT NULL,
  `media_url` varchar(255) DEFAULT NULL,
  `transcript` text,
  `lesson_id` int DEFAULT NULL,
  `order_index` int DEFAULT NULL,
  `description` text,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`media_id`),
  KEY `lesson_id` (`lesson_id`),
  CONSTRAINT `lesson_medias_ibfk_1` FOREIGN KEY (`lesson_id`) REFERENCES `lessons` (`lesson_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `lesson_medias`
--

LOCK TABLES `lesson_medias` WRITE;
/*!40000 ALTER TABLE `lesson_medias` DISABLE KEYS */;
INSERT INTO `lesson_medias` VALUES (1,'video','https://res.cloudinary.com/damxodpnw/video/upload/v1768817640/enggo/lessons/videos/f4sewwcrgtam4ey0ckkm.mp4',NULL,1,1,'','2026-01-19 10:15:09','2026-01-19 10:15:09'),(3,'audio','https://res.cloudinary.com/damxodpnw/video/upload/v1768818489/enggo/lessons/audios/kx6uoiirdv8e7vmm3q12.mp3',NULL,1,0,'','2026-01-19 10:28:07','2026-01-19 10:28:07'),(5,'text','https://res.cloudinary.com/damxodpnw/raw/upload/v1768819843/enggo/lessons/texts/hrobfidonkhq5mhxllgz',NULL,1,4,'','2026-01-19 10:50:40','2026-01-19 10:50:40'),(6,'text','https://res.cloudinary.com/damxodpnw/raw/upload/v1768820124/enggo/lessons/texts/yhovhfrmjal7oz3xrtzs.txt',NULL,1,0,'','2026-01-19 10:53:52','2026-01-19 10:53:52');
/*!40000 ALTER TABLE `lesson_medias` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `lesson_questions`
--

DROP TABLE IF EXISTS `lesson_questions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `lesson_questions` (
  `lesson_question_id` int NOT NULL AUTO_INCREMENT,
  `question_type` varchar(20) NOT NULL,
  `content` text NOT NULL,
  `correct_answer` text NOT NULL,
  `explaination` text,
  `difficulty_level` char(10) NOT NULL,
  `generated_by_ai` tinyint(1) NOT NULL,
  `lesson_id` int DEFAULT NULL,
  `options` json DEFAULT NULL,
  `ai_model` varchar(100) DEFAULT NULL,
  `status` tinyint(1) NOT NULL DEFAULT '1',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `order_index` int DEFAULT NULL,
  PRIMARY KEY (`lesson_question_id`),
  KEY `lesson_id` (`lesson_id`),
  CONSTRAINT `lesson_questions_ibfk_1` FOREIGN KEY (`lesson_id`) REFERENCES `lessons` (`lesson_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `lesson_questions`
--

LOCK TABLES `lesson_questions` WRITE;
/*!40000 ALTER TABLE `lesson_questions` DISABLE KEYS */;
INSERT INTO `lesson_questions` VALUES (1,'multiple_choice','The documents ______ by the manager must be submitted before Friday.','B','Vì là câu bị động nên chọn đáp án V2/ed => Đáp án B','beginner',0,1,'\"{\\\"A\\\": \\\"reviewing\\\", \\\"B\\\": \\\"reviewed\\\", \\\"C\\\": \\\"review\\\", \\\"D\\\": \\\"reviews\\\"}\"','',1,'2026-01-20 09:19:37','2026-01-20 09:19:37',1),(2,'multiple_choice','The documents ______ by the manager must be submitted before Friday.','B','zxcvzxcvzxcv','beginner',0,1,'\"{\\\"A\\\": \\\"reviewing\\\", \\\"B\\\": \\\"reviewed\\\", \\\"C\\\": \\\"review\\\", \\\"D\\\": \\\"reviews\\\"}\"','',1,'2026-01-20 09:46:20','2026-01-20 09:50:25',2);
/*!40000 ALTER TABLE `lesson_questions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `lesson_translations`
--

DROP TABLE IF EXISTS `lesson_translations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `lesson_translations` (
  `translation_id` int NOT NULL AUTO_INCREMENT,
  `translation_title` varchar(100) DEFAULT NULL,
  `translation_description` text,
  `instruction` text,
  `lesson_id` int DEFAULT NULL,
  `language_id` int DEFAULT NULL,
  PRIMARY KEY (`translation_id`),
  KEY `lesson_id` (`lesson_id`),
  KEY `language_id` (`language_id`),
  CONSTRAINT `lesson_translations_ibfk_1` FOREIGN KEY (`lesson_id`) REFERENCES `lessons` (`lesson_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `lesson_translations_ibfk_2` FOREIGN KEY (`language_id`) REFERENCES `languages` (`language_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `lesson_translations`
--

LOCK TABLES `lesson_translations` WRITE;
/*!40000 ALTER TABLE `lesson_translations` DISABLE KEYS */;
/*!40000 ALTER TABLE `lesson_translations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `lessons`
--

DROP TABLE IF EXISTS `lessons`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `lessons` (
  `lesson_id` int NOT NULL AUTO_INCREMENT,
  `lesson_type` varchar(20) NOT NULL,
  `difficulty_level` char(10) NOT NULL,
  `lesson_content` text NOT NULL,
  `is_exam_format` tinyint(1) NOT NULL,
  `estimated_time` int NOT NULL,
  `skill_id` int DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  `lesson_title` varchar(255) NOT NULL,
  `lesson_status` tinyint(1) NOT NULL DEFAULT '1',
  PRIMARY KEY (`lesson_id`),
  KEY `skill_id` (`skill_id`),
  CONSTRAINT `lessons_ibfk_1` FOREIGN KEY (`skill_id`) REFERENCES `skills` (`skill_id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `lessons`
--

LOCK TABLES `lessons` WRITE;
/*!40000 ALTER TABLE `lessons` DISABLE KEYS */;
INSERT INTO `lessons` VALUES (1,'listening','beginner','bài học áp dụng cho phần thi asdfasdnv,mznxc,vzxcv',1,60,2,'2026-01-19 06:57:37',NULL,'TOEIC Listening Part 1 - Làm quen với Part',1);
/*!40000 ALTER TABLE `lessons` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `module_lessons`
--

DROP TABLE IF EXISTS `module_lessons`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `module_lessons` (
  `module_lesson_id` int NOT NULL AUTO_INCREMENT,
  `module_id` int NOT NULL,
  `lesson_id` int NOT NULL,
  `description` text,
  `order_index` int NOT NULL,
  `status` tinyint(1) NOT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`module_lesson_id`),
  KEY `module_id` (`module_id`),
  KEY `lesson_id` (`lesson_id`),
  CONSTRAINT `module_lessons_ibfk_1` FOREIGN KEY (`module_id`) REFERENCES `modules` (`module_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `module_lessons_ibfk_2` FOREIGN KEY (`lesson_id`) REFERENCES `lessons` (`lesson_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `module_lessons`
--

LOCK TABLES `module_lessons` WRITE;
/*!40000 ALTER TABLE `module_lessons` DISABLE KEYS */;
INSERT INTO `module_lessons` VALUES (2,1,1,'zxcvzxcv',1,1,'2026-01-23 10:32:09','2026-01-23 10:32:09');
/*!40000 ALTER TABLE `module_lessons` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `modules`
--

DROP TABLE IF EXISTS `modules`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `modules` (
  `module_id` int NOT NULL AUTO_INCREMENT,
  `module_title` varchar(255) NOT NULL,
  `module_description` text,
  `order_index` int NOT NULL,
  `estimated_time` int NOT NULL,
  `course_id` int NOT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`module_id`),
  KEY `course_id` (`course_id`),
  CONSTRAINT `modules_ibfk_1` FOREIGN KEY (`course_id`) REFERENCES `courses` (`course_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `modules`
--

LOCK TABLES `modules` WRITE;
/*!40000 ALTER TABLE `modules` DISABLE KEYS */;
INSERT INTO `modules` VALUES (1,'Module 1','áldhjflkasjsdlfjalksjdflkasdf',1,36,1,'2026-01-15 04:33:45','2026-01-15 04:33:45'),(2,'Module 2','zxcvzxcvzxcvzxcvzxcv',2,36,1,'2026-01-15 04:36:52','2026-01-15 04:36:52');
/*!40000 ALTER TABLE `modules` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `orders`
--

DROP TABLE IF EXISTS `orders`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `orders` (
  `order_id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `subscription_price_id` int NOT NULL,
  `status` enum('pending','completed','failed') NOT NULL,
  `amount` decimal(10,2) NOT NULL,
  `content` varchar(255) DEFAULT NULL,
  `order_date` datetime NOT NULL,
  PRIMARY KEY (`order_id`),
  KEY `user_id` (`user_id`),
  KEY `subscription_price_id` (`subscription_price_id`),
  CONSTRAINT `orders_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `orders_ibfk_2` FOREIGN KEY (`subscription_price_id`) REFERENCES `subscription_prices` (`subscription_price_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=42 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `orders`
--

LOCK TABLES `orders` WRITE;
/*!40000 ALTER TABLE `orders` DISABLE KEYS */;
INSERT INTO `orders` VALUES (1,4,6,'pending',399000.00,'Subscription: Premium - monthly','2026-03-09 10:01:21'),(2,4,6,'pending',399000.00,'Subscription: Premium - monthly','2026-03-09 10:02:22'),(3,4,6,'pending',399000.00,'Subscription: Premium - monthly','2026-03-09 10:07:20'),(4,4,6,'pending',399000.00,'Subscription: Premium - monthly','2026-03-09 10:07:42'),(5,4,6,'pending',399000.00,'Subscription: Premium - monthly','2026-03-09 10:07:57'),(6,4,6,'pending',399000.00,'Subscription: Premium - monthly','2026-03-09 10:11:47'),(7,4,6,'pending',399000.00,'Subscription: Premium - monthly','2026-03-09 10:12:01'),(8,4,6,'pending',399000.00,'Subscription: Premium - monthly','2026-03-09 10:12:54'),(9,4,6,'pending',399000.00,'Subscription: Premium - monthly','2026-03-09 10:17:45'),(10,4,6,'pending',399000.00,'Subscription: Premium - monthly','2026-03-09 10:20:48'),(11,4,6,'pending',399000.00,'Subscription: Premium - monthly','2026-03-09 10:22:51'),(12,4,6,'pending',399000.00,'Subscription: Premium - monthly','2026-03-09 10:23:13'),(13,4,6,'pending',399000.00,'Subscription: Premium - monthly','2026-03-09 10:28:45'),(14,4,6,'pending',399000.00,'Subscription: Premium - monthly','2026-03-09 10:29:14'),(15,4,3,'pending',199000.00,'Subscription: Pro - monthly','2026-03-09 10:32:35'),(16,4,3,'pending',199000.00,'Subscription: Pro - monthly','2026-03-09 10:45:30'),(17,4,6,'pending',399000.00,'Subscription: Premium - monthly','2026-03-09 10:51:39'),(18,4,3,'pending',199000.00,'Subscription: Pro - monthly','2026-03-09 10:53:06'),(19,4,3,'pending',199000.00,'Subscription: Pro - monthly','2026-03-09 10:59:51'),(20,4,3,'pending',199000.00,'Subscription: Pro - monthly','2026-03-09 11:00:44'),(21,4,3,'pending',199000.00,'Subscription: Pro - monthly','2026-03-09 11:04:36'),(22,4,3,'pending',199000.00,'Subscription: Pro - monthly','2026-03-09 11:07:51'),(23,4,3,'pending',199000.00,'Subscription: Pro - monthly','2026-03-09 11:08:15'),(24,4,3,'pending',199000.00,'Subscription: Pro - monthly','2026-03-09 11:13:51'),(25,4,3,'pending',199000.00,'Subscription: Pro - monthly','2026-03-09 11:19:17'),(26,4,3,'pending',199000.00,'Subscription: Pro - monthly','2026-03-09 11:40:30'),(27,4,3,'pending',199000.00,'Subscription: Pro - monthly','2026-03-09 11:42:04'),(28,4,3,'pending',199000.00,'Subscription: Pro - monthly','2026-03-09 11:59:56'),(29,4,3,'pending',199000.00,'Subscription: Pro - monthly','2026-03-09 12:00:07'),(30,4,3,'pending',199000.00,'Subscription: Pro - monthly','2026-03-09 12:00:42'),(31,4,3,'pending',199000.00,'Subscription: Pro - monthly','2026-03-09 12:08:34'),(32,4,3,'pending',199000.00,'Subscription: Pro - monthly','2026-03-09 12:11:42'),(33,4,3,'pending',199000.00,'Subscription: Pro - monthly','2026-03-09 12:17:24'),(34,4,6,'pending',399000.00,'Subscription: Premium - monthly','2026-03-09 12:22:52'),(35,4,6,'completed',399000.00,'Subscription: Premium - monthly','2026-03-10 06:53:42'),(36,2,3,'pending',199000.00,'Subscription: Pro - monthly','2026-03-10 08:07:12'),(37,2,3,'pending',199000.00,'Subscription: Pro - monthly','2026-03-10 08:10:34'),(38,2,3,'pending',199000.00,'Subscription: Pro - monthly','2026-03-10 08:13:48'),(39,2,3,'pending',199000.00,'Subscription: Pro - monthly','2026-03-10 08:21:45'),(40,2,3,'pending',199000.00,'Subscription: Pro - monthly','2026-03-10 08:25:53'),(41,2,3,'pending',199000.00,'Subscription: Pro - monthly','2026-03-10 08:28:22');
/*!40000 ALTER TABLE `orders` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `payments`
--

DROP TABLE IF EXISTS `payments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `payments` (
  `payment_id` int NOT NULL AUTO_INCREMENT,
  `order_id` int NOT NULL,
  `payment_method` enum('momo','vnpay') NOT NULL,
  `provider` varchar(255) NOT NULL,
  `transaction_code` varchar(255) NOT NULL,
  `amount` decimal(10,2) NOT NULL,
  `payment_date` datetime NOT NULL,
  `content` varchar(255) DEFAULT NULL,
  `status` enum('pending','completed','failed') NOT NULL,
  PRIMARY KEY (`payment_id`),
  KEY `order_id` (`order_id`),
  CONSTRAINT `payments_ibfk_1` FOREIGN KEY (`order_id`) REFERENCES `orders` (`order_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=33 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `payments`
--

LOCK TABLES `payments` WRITE;
/*!40000 ALTER TABLE `payments` DISABLE KEYS */;
INSERT INTO `payments` VALUES (1,6,'vnpay','vnpay','6',399000.00,'2026-03-09 10:11:47','Subscription: Premium - monthly','pending'),(2,8,'vnpay','vnpay','8',399000.00,'2026-03-09 10:12:54','Subscription: Premium - monthly','pending'),(3,9,'vnpay','vnpay','9',399000.00,'2026-03-09 10:17:45','Subscription: Premium - monthly','pending'),(4,10,'vnpay','vnpay','10',399000.00,'2026-03-09 10:20:48','Subscription: Premium - monthly','pending'),(5,11,'vnpay','vnpay','11',399000.00,'2026-03-09 10:22:51','Subscription: Premium - monthly','pending'),(6,12,'vnpay','vnpay','12',399000.00,'2026-03-09 10:23:13','Subscription: Premium - monthly','pending'),(7,13,'vnpay','vnpay','13',399000.00,'2026-03-09 10:28:45','Subscription: Premium - monthly','pending'),(8,14,'vnpay','vnpay','14',399000.00,'2026-03-09 10:29:14','Subscription: Premium - monthly','pending'),(9,15,'vnpay','vnpay','15',199000.00,'2026-03-09 10:32:35','Subscription: Pro - monthly','pending'),(10,16,'vnpay','vnpay','16',199000.00,'2026-03-09 10:45:30','Subscription: Pro - monthly','pending'),(11,17,'vnpay','vnpay','17',399000.00,'2026-03-09 10:51:39','Subscription: Premium - monthly','pending'),(12,18,'vnpay','vnpay','18',199000.00,'2026-03-09 10:53:06','Subscription: Pro - monthly','pending'),(13,19,'vnpay','vnpay','19',199000.00,'2026-03-09 10:59:51','Subscription: Pro - monthly','pending'),(14,20,'vnpay','vnpay','20',199000.00,'2026-03-09 11:00:44','Subscription: Pro - monthly','pending'),(15,21,'vnpay','vnpay','21',199000.00,'2026-03-09 11:04:36','Subscription: Pro - monthly','pending'),(16,22,'vnpay','vnpay','22',199000.00,'2026-03-09 11:07:51','Subscription: Pro - monthly','pending'),(17,23,'vnpay','vnpay','23',199000.00,'2026-03-09 11:08:15','Subscription: Pro - monthly','pending'),(18,24,'vnpay','vnpay','24',199000.00,'2026-03-09 11:13:51','Subscription: Pro - monthly','pending'),(19,25,'vnpay','vnpay','25',199000.00,'2026-03-09 11:19:17','Subscription: Pro - monthly','pending'),(20,26,'vnpay','vnpay','26',199000.00,'2026-03-09 11:40:30','Subscription: Pro - monthly','pending'),(21,27,'vnpay','vnpay','27',199000.00,'2026-03-09 11:42:05','Subscription: Pro - monthly','pending'),(22,28,'vnpay','vnpay','28',199000.00,'2026-03-09 11:59:57','Subscription: Pro - monthly','pending'),(23,32,'momo','momo','ORDER_32_1773058302621',199000.00,'2026-03-09 12:11:43','Subscription: Pro - monthly','failed'),(24,33,'momo','momo','ORDER_33_1773058644247',199000.00,'2026-03-09 12:17:29','Subscription: Pro - monthly','failed'),(25,34,'momo','momo','4695207923',399000.00,'2026-03-09 12:22:52','Subscription: Premium - monthly','completed'),(26,35,'momo','momo','4695369762',399000.00,'2026-03-10 06:53:43','Subscription: Premium - monthly','completed'),(27,36,'vnpay','vnpay','36',199000.00,'2026-03-10 08:07:12','Subscription: Pro - monthly','pending'),(28,37,'vnpay','vnpay','37',199000.00,'2026-03-10 08:10:34','Subscription: Pro - monthly','pending'),(29,38,'vnpay','vnpay','38',199000.00,'2026-03-10 08:13:48','Subscription: Pro - monthly','pending'),(30,39,'vnpay','vnpay','39',199000.00,'2026-03-10 08:21:45','Subscription: Pro - monthly','pending'),(31,40,'vnpay','vnpay','40',199000.00,'2026-03-10 08:25:53','Subscription: Pro - monthly','pending'),(32,41,'vnpay','vnpay','41',199000.00,'2026-03-10 08:28:22','Subscription: Pro - monthly','pending');
/*!40000 ALTER TABLE `payments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `phase_courses`
--

DROP TABLE IF EXISTS `phase_courses`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `phase_courses` (
  `phase_course_id` int NOT NULL AUTO_INCREMENT,
  `phase_id` int NOT NULL,
  `course_id` int NOT NULL,
  `order_number` int NOT NULL,
  `is_required` tinyint(1) NOT NULL DEFAULT '1',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`phase_course_id`),
  KEY `phase_id` (`phase_id`),
  KEY `course_id` (`course_id`),
  CONSTRAINT `phase_courses_ibfk_1` FOREIGN KEY (`phase_id`) REFERENCES `phases` (`phase_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `phase_courses_ibfk_2` FOREIGN KEY (`course_id`) REFERENCES `courses` (`course_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `phase_courses`
--

LOCK TABLES `phase_courses` WRITE;
/*!40000 ALTER TABLE `phase_courses` DISABLE KEYS */;
INSERT INTO `phase_courses` VALUES (1,1,1,1,1,'2026-01-21 11:23:14','2026-01-21 11:23:14'),(2,1,2,2,1,'2026-01-21 11:23:40','2026-01-21 11:23:40');
/*!40000 ALTER TABLE `phase_courses` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `phases`
--

DROP TABLE IF EXISTS `phases`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `phases` (
  `phase_id` int NOT NULL AUTO_INCREMENT,
  `phase_name` varchar(255) NOT NULL,
  `phase_description` text,
  `order` int NOT NULL,
  `phase_aims` text NOT NULL,
  `roadmap_id` int NOT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  PRIMARY KEY (`phase_id`),
  KEY `roadmap_id` (`roadmap_id`),
  CONSTRAINT `phases_ibfk_1` FOREIGN KEY (`roadmap_id`) REFERENCES `roadmaps` (`roadmap_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `phases`
--

LOCK TABLES `phases` WRITE;
/*!40000 ALTER TABLE `phases` DISABLE KEYS */;
INSERT INTO `phases` VALUES (1,'Học từ vựng','xcvbxcvbxcvb',1,'áhdfasdlkfjlasjdf',1,'2026-01-21 10:22:28','2026-01-21 10:22:28'),(2,'Học ngữ pháp','xcvzxcvzxcv',2,'vbcvnbcvbncvbn',1,'2026-01-21 10:28:02','2026-01-21 10:28:02');
/*!40000 ALTER TABLE `phases` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `question_options`
--

DROP TABLE IF EXISTS `question_options`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `question_options` (
  `question_option_id` int NOT NULL AUTO_INCREMENT,
  `container_question_id` int NOT NULL,
  `label` varchar(5) NOT NULL,
  `content` text NOT NULL,
  `is_correct` tinyint(1) NOT NULL,
  `order_index` int NOT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`question_option_id`),
  KEY `container_question_id` (`container_question_id`),
  CONSTRAINT `question_options_ibfk_1` FOREIGN KEY (`container_question_id`) REFERENCES `container_questions` (`container_question_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=1504 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `question_options`
--

LOCK TABLES `question_options` WRITE;
/*!40000 ALTER TABLE `question_options` DISABLE KEYS */;
INSERT INTO `question_options` VALUES (590,168,'A','The man is typing on a laptop.',1,1,'2026-03-18 08:07:07','2026-03-18 08:07:07'),(591,168,'B','The man is fixing a machine.',0,2,'2026-03-18 08:07:07','2026-03-18 08:07:07'),(592,168,'C','The man is carrying a box.',0,3,'2026-03-18 08:07:07','2026-03-18 08:07:07'),(593,168,'D','The man is sitting beside a window.',0,4,'2026-03-18 08:07:07','2026-03-18 08:07:07'),(594,169,'A','The chairs are stacked in a corner.',0,1,'2026-03-18 08:07:07','2026-03-18 08:07:07'),(595,169,'B','The chairs are arranged around a table.',1,2,'2026-03-18 08:07:07','2026-03-18 08:07:07'),(596,169,'C','The chairs are being cleaned.',0,3,'2026-03-18 08:07:07','2026-03-18 08:07:07'),(597,169,'D','The chairs are broken.',0,4,'2026-03-18 08:07:07','2026-03-18 08:07:07'),(598,170,'A','A woman is pouring coffee.',1,1,'2026-03-18 08:07:07','2026-03-18 08:07:07'),(599,170,'B','A woman is opening a door.',0,2,'2026-03-18 08:07:07','2026-03-18 08:07:07'),(600,170,'C','A woman is washing dishes.',0,3,'2026-03-18 08:07:07','2026-03-18 08:07:07'),(601,170,'D','A woman is holding a phone.',0,4,'2026-03-18 08:07:07','2026-03-18 08:07:07'),(602,171,'A','The road is crowded with cars.',1,1,'2026-03-18 08:07:07','2026-03-18 08:07:07'),(603,171,'B','The road is under construction.',0,2,'2026-03-18 08:07:07','2026-03-18 08:07:07'),(604,171,'C','The road is empty.',0,3,'2026-03-18 08:07:07','2026-03-18 08:07:07'),(605,171,'D','The road is being cleaned.',0,4,'2026-03-18 08:07:07','2026-03-18 08:07:07'),(606,172,'A','People are walking in a park.',1,1,'2026-03-18 08:07:07','2026-03-18 08:07:07'),(607,172,'B','People are sitting in an office.',0,2,'2026-03-18 08:07:07','2026-03-18 08:07:07'),(608,172,'C','People are swimming.',0,3,'2026-03-18 08:07:07','2026-03-18 08:07:07'),(609,172,'D','People are working in a factory.',0,4,'2026-03-18 08:07:07','2026-03-18 08:07:07'),(610,173,'A','A bicycle is leaning against a wall.',1,1,'2026-03-18 08:07:07','2026-03-18 08:07:07'),(611,173,'B','A bicycle is being repaired.',0,2,'2026-03-18 08:07:07','2026-03-18 08:07:07'),(612,173,'C','A bicycle is parked in a garage.',0,3,'2026-03-18 08:07:07','2026-03-18 08:07:07'),(613,173,'D','A bicycle is on a road.',0,4,'2026-03-18 08:07:07','2026-03-18 08:07:07'),(614,174,'A','A',0,1,'2026-03-18 08:08:09','2026-03-18 08:08:09'),(615,174,'B','B',1,2,'2026-03-18 08:08:09','2026-03-18 08:08:09'),(616,174,'C','C',0,3,'2026-03-18 08:08:09','2026-03-18 08:08:09'),(617,175,'A','A',1,1,'2026-03-18 08:08:09','2026-03-18 08:08:09'),(618,175,'B','B',0,2,'2026-03-18 08:08:09','2026-03-18 08:08:09'),(619,175,'C','C',0,3,'2026-03-18 08:08:09','2026-03-18 08:08:09'),(620,176,'A','A',1,1,'2026-03-18 08:08:09','2026-03-18 08:08:09'),(621,176,'B','B',0,2,'2026-03-18 08:08:09','2026-03-18 08:08:09'),(622,176,'C','C',0,3,'2026-03-18 08:08:09','2026-03-18 08:08:09'),(623,177,'A','A',1,1,'2026-03-18 08:08:09','2026-03-18 08:08:09'),(624,177,'B','B',0,2,'2026-03-18 08:08:09','2026-03-18 08:08:09'),(625,177,'C','C',0,3,'2026-03-18 08:08:09','2026-03-18 08:08:09'),(626,178,'A','A',1,1,'2026-03-18 08:08:09','2026-03-18 08:08:09'),(627,178,'B','B',0,2,'2026-03-18 08:08:09','2026-03-18 08:08:09'),(628,178,'C','C',0,3,'2026-03-18 08:08:09','2026-03-18 08:08:09'),(629,179,'A','A',1,1,'2026-03-18 08:08:09','2026-03-18 08:08:09'),(630,179,'B','B',0,2,'2026-03-18 08:08:09','2026-03-18 08:08:09'),(631,179,'C','C',0,3,'2026-03-18 08:08:09','2026-03-18 08:08:09'),(632,180,'A','A',1,1,'2026-03-18 08:08:09','2026-03-18 08:08:09'),(633,180,'B','B',0,2,'2026-03-18 08:08:09','2026-03-18 08:08:09'),(634,180,'C','C',0,3,'2026-03-18 08:08:09','2026-03-18 08:08:09'),(635,181,'A','A',1,1,'2026-03-18 08:08:09','2026-03-18 08:08:09'),(636,181,'B','B',0,2,'2026-03-18 08:08:09','2026-03-18 08:08:09'),(637,181,'C','C',0,3,'2026-03-18 08:08:09','2026-03-18 08:08:09'),(638,182,'A','A',1,1,'2026-03-18 08:08:09','2026-03-18 08:08:09'),(639,182,'B','B',0,2,'2026-03-18 08:08:09','2026-03-18 08:08:09'),(640,182,'C','C',0,3,'2026-03-18 08:08:09','2026-03-18 08:08:09'),(641,183,'A','A',1,1,'2026-03-18 08:08:09','2026-03-18 08:08:09'),(642,183,'B','B',0,2,'2026-03-18 08:08:09','2026-03-18 08:08:09'),(643,183,'C','C',0,3,'2026-03-18 08:08:09','2026-03-18 08:08:09'),(644,184,'A','A',1,1,'2026-03-18 08:08:09','2026-03-18 08:08:09'),(645,184,'B','B',0,2,'2026-03-18 08:08:09','2026-03-18 08:08:09'),(646,184,'C','C',0,3,'2026-03-18 08:08:09','2026-03-18 08:08:09'),(647,185,'A','A',1,1,'2026-03-18 08:08:09','2026-03-18 08:08:09'),(648,185,'B','B',0,2,'2026-03-18 08:08:09','2026-03-18 08:08:09'),(649,185,'C','C',0,3,'2026-03-18 08:08:09','2026-03-18 08:08:09'),(650,186,'A','A',1,1,'2026-03-18 08:08:09','2026-03-18 08:08:09'),(651,186,'B','B',0,2,'2026-03-18 08:08:09','2026-03-18 08:08:09'),(652,186,'C','C',0,3,'2026-03-18 08:08:09','2026-03-18 08:08:09'),(653,187,'A','A',1,1,'2026-03-18 08:08:09','2026-03-18 08:08:09'),(654,187,'B','B',0,2,'2026-03-18 08:08:09','2026-03-18 08:08:09'),(655,187,'C','C',0,3,'2026-03-18 08:08:09','2026-03-18 08:08:09'),(656,188,'A','A',1,1,'2026-03-18 08:08:09','2026-03-18 08:08:09'),(657,188,'B','B',0,2,'2026-03-18 08:08:09','2026-03-18 08:08:09'),(658,188,'C','C',0,3,'2026-03-18 08:08:09','2026-03-18 08:08:09'),(659,189,'A','A',1,1,'2026-03-18 08:08:09','2026-03-18 08:08:09'),(660,189,'B','B',0,2,'2026-03-18 08:08:09','2026-03-18 08:08:09'),(661,189,'C','C',0,3,'2026-03-18 08:08:09','2026-03-18 08:08:09'),(662,190,'A','A',1,1,'2026-03-18 08:08:09','2026-03-18 08:08:09'),(663,190,'B','B',0,2,'2026-03-18 08:08:09','2026-03-18 08:08:09'),(664,190,'C','C',0,3,'2026-03-18 08:08:09','2026-03-18 08:08:09'),(665,191,'A','A',1,1,'2026-03-18 08:08:09','2026-03-18 08:08:09'),(666,191,'B','B',0,2,'2026-03-18 08:08:09','2026-03-18 08:08:09'),(667,191,'C','C',0,3,'2026-03-18 08:08:09','2026-03-18 08:08:09'),(668,192,'A','A',1,1,'2026-03-18 08:08:09','2026-03-18 08:08:09'),(669,192,'B','B',0,2,'2026-03-18 08:08:09','2026-03-18 08:08:09'),(670,192,'C','C',0,3,'2026-03-18 08:08:09','2026-03-18 08:08:09'),(671,193,'A','A',1,1,'2026-03-18 08:08:09','2026-03-18 08:08:09'),(672,193,'B','B',0,2,'2026-03-18 08:08:09','2026-03-18 08:08:09'),(673,193,'C','C',0,3,'2026-03-18 08:08:09','2026-03-18 08:08:09'),(674,194,'A','A',1,1,'2026-03-18 08:08:09','2026-03-18 08:08:09'),(675,194,'B','B',0,2,'2026-03-18 08:08:09','2026-03-18 08:08:09'),(676,194,'C','C',0,3,'2026-03-18 08:08:09','2026-03-18 08:08:09'),(677,195,'A','A',1,1,'2026-03-18 08:08:09','2026-03-18 08:08:09'),(678,195,'B','B',0,2,'2026-03-18 08:08:09','2026-03-18 08:08:09'),(679,195,'C','C',0,3,'2026-03-18 08:08:09','2026-03-18 08:08:09'),(680,196,'A','A',1,1,'2026-03-18 08:08:09','2026-03-18 08:08:09'),(681,196,'B','B',0,2,'2026-03-18 08:08:09','2026-03-18 08:08:09'),(682,196,'C','C',0,3,'2026-03-18 08:08:09','2026-03-18 08:08:09'),(683,197,'A','A',1,1,'2026-03-18 08:08:09','2026-03-18 08:08:09'),(684,197,'B','B',0,2,'2026-03-18 08:08:09','2026-03-18 08:08:09'),(685,197,'C','C',0,3,'2026-03-18 08:08:09','2026-03-18 08:08:09'),(686,198,'A','A',1,1,'2026-03-18 08:08:10','2026-03-18 08:08:10'),(687,198,'B','B',0,2,'2026-03-18 08:08:10','2026-03-18 08:08:10'),(688,198,'C','C',0,3,'2026-03-18 08:08:10','2026-03-18 08:08:10'),(689,199,'A','A delayed shipment',1,1,'2026-03-18 08:44:44','2026-03-18 08:44:44'),(690,199,'B','A marketing campaign',0,2,'2026-03-18 08:44:44','2026-03-18 08:44:44'),(691,199,'C','A job interview',0,3,'2026-03-18 08:44:44','2026-03-18 08:44:44'),(692,199,'D','A business trip',0,4,'2026-03-18 08:44:44','2026-03-18 08:44:44'),(693,200,'A','A missing invoice',0,1,'2026-03-18 08:44:44','2026-03-18 08:44:44'),(694,200,'B','A delayed shipment',1,2,'2026-03-18 08:44:44','2026-03-18 08:44:44'),(695,200,'C','A broken machine',0,3,'2026-03-18 08:44:44','2026-03-18 08:44:44'),(696,200,'D','A cancelled meeting',0,4,'2026-03-18 08:44:44','2026-03-18 08:44:44'),(697,201,'A','Call the supplier',1,1,'2026-03-18 08:44:44','2026-03-18 08:44:44'),(698,201,'B','Send an email to customers',0,2,'2026-03-18 08:44:44','2026-03-18 08:44:44'),(699,201,'C','Cancel the order',0,3,'2026-03-18 08:44:44','2026-03-18 08:44:44'),(700,201,'D','Visit the warehouse',0,4,'2026-03-18 08:44:44','2026-03-18 08:44:44'),(701,202,'A','In an office',1,1,'2026-03-18 08:45:06','2026-03-18 08:45:06'),(702,202,'B','In a restaurant',0,2,'2026-03-18 08:45:06','2026-03-18 08:45:06'),(703,202,'C','In a hotel lobby',0,3,'2026-03-18 08:45:06','2026-03-18 08:45:06'),(704,202,'D','In a factory',0,4,'2026-03-18 08:45:06','2026-03-18 08:45:06'),(705,203,'A','Print a report',1,1,'2026-03-18 08:45:06','2026-03-18 08:45:06'),(706,203,'B','Schedule a meeting',0,2,'2026-03-18 08:45:06','2026-03-18 08:45:06'),(707,203,'C','Order lunch',0,3,'2026-03-18 08:45:06','2026-03-18 08:45:06'),(708,203,'D','Call a client',0,4,'2026-03-18 08:45:06','2026-03-18 08:45:06'),(709,204,'A','The printer is broken',0,1,'2026-03-18 08:45:06','2026-03-18 08:45:06'),(710,204,'B','The ink may be low',1,2,'2026-03-18 08:45:06','2026-03-18 08:45:06'),(711,204,'C','The report is missing',0,3,'2026-03-18 08:45:06','2026-03-18 08:45:06'),(712,204,'D','The computer is off',0,4,'2026-03-18 08:45:06','2026-03-18 08:45:06'),(713,205,'A','In an office',1,1,'2026-03-18 08:48:18','2026-03-18 08:48:18'),(714,205,'B','In a restaurant',0,2,'2026-03-18 08:48:18','2026-03-18 08:48:18'),(715,205,'C','In a hotel lobby',0,3,'2026-03-18 08:48:18','2026-03-18 08:48:18'),(716,205,'D','In a factory',0,4,'2026-03-18 08:48:18','2026-03-18 08:48:18'),(717,206,'A','Print a report',1,1,'2026-03-18 08:48:18','2026-03-18 08:48:18'),(718,206,'B','Schedule a meeting',0,2,'2026-03-18 08:48:18','2026-03-18 08:48:18'),(719,206,'C','Order lunch',0,3,'2026-03-18 08:48:18','2026-03-18 08:48:18'),(720,206,'D','Call a client',0,4,'2026-03-18 08:48:18','2026-03-18 08:48:18'),(721,207,'A','The printer is broken',0,1,'2026-03-18 08:48:18','2026-03-18 08:48:18'),(722,207,'B','The ink may be low',1,2,'2026-03-18 08:48:18','2026-03-18 08:48:18'),(723,207,'C','The report is missing',0,3,'2026-03-18 08:48:18','2026-03-18 08:48:18'),(724,207,'D','The computer is off',0,4,'2026-03-18 08:48:18','2026-03-18 08:48:18'),(725,208,'A','To announce a schedule change',1,1,'2026-03-18 08:53:51','2026-03-18 08:53:51'),(726,208,'B','To advertise a new train',0,2,'2026-03-18 08:53:51','2026-03-18 08:53:51'),(727,208,'C','To introduce staff',0,3,'2026-03-18 08:53:51','2026-03-18 08:53:51'),(728,208,'D','To explain ticket prices',0,4,'2026-03-18 08:53:51','2026-03-18 08:53:51'),(729,209,'A','Train passengers',1,1,'2026-03-18 08:53:51','2026-03-18 08:53:51'),(730,209,'B','Train drivers',0,2,'2026-03-18 08:53:51','2026-03-18 08:53:51'),(731,209,'C','Station employees',0,3,'2026-03-18 08:53:51','2026-03-18 08:53:51'),(732,209,'D','Tour guides',0,4,'2026-03-18 08:53:51','2026-03-18 08:53:51'),(733,210,'A','Check the schedule board',1,1,'2026-03-18 08:53:51','2026-03-18 08:53:51'),(734,210,'B','Return their tickets',0,2,'2026-03-18 08:53:51','2026-03-18 08:53:51'),(735,210,'C','Move to another station',0,3,'2026-03-18 08:53:51','2026-03-18 08:53:51'),(736,210,'D','Wait outside the station',0,4,'2026-03-18 08:53:51','2026-03-18 08:53:51'),(737,211,'A','Promote a new product',1,1,'2026-03-18 08:54:25','2026-03-18 08:54:25'),(738,211,'B','Report company profits',0,2,'2026-03-18 08:54:25','2026-03-18 08:54:25'),(739,211,'C','Explain office rules',0,3,'2026-03-18 08:54:25','2026-03-18 08:54:25'),(740,211,'D','Invite employees to a meeting',0,4,'2026-03-18 08:54:25','2026-03-18 08:54:25'),(741,212,'A','Improved battery life',1,1,'2026-03-18 08:54:25','2026-03-18 08:54:25'),(742,212,'B','A lower price',0,2,'2026-03-18 08:54:25','2026-03-18 08:54:25'),(743,212,'C','A larger screen',0,3,'2026-03-18 08:54:25','2026-03-18 08:54:25'),(744,212,'D','A free subscription',0,4,'2026-03-18 08:54:25','2026-03-18 08:54:25'),(745,213,'A','On the company website',1,1,'2026-03-18 08:54:25','2026-03-18 08:54:25'),(746,213,'B','In a newspaper',0,2,'2026-03-18 08:54:25','2026-03-18 08:54:25'),(747,213,'C','At a retail store',0,3,'2026-03-18 08:54:25','2026-03-18 08:54:25'),(748,213,'D','On television',0,4,'2026-03-18 08:54:25','2026-03-18 08:54:25'),(749,214,'A','Promote a new product',1,1,'2026-03-18 08:54:48','2026-03-18 08:54:48'),(750,214,'B','Report company profits',0,2,'2026-03-18 08:54:48','2026-03-18 08:54:48'),(751,214,'C','Explain office rules',0,3,'2026-03-18 08:54:48','2026-03-18 08:54:48'),(752,214,'D','Invite employees to a meeting',0,4,'2026-03-18 08:54:48','2026-03-18 08:54:48'),(753,215,'A','Improved battery life',1,1,'2026-03-18 08:54:48','2026-03-18 08:54:48'),(754,215,'B','A lower price',0,2,'2026-03-18 08:54:48','2026-03-18 08:54:48'),(755,215,'C','A larger screen',0,3,'2026-03-18 08:54:48','2026-03-18 08:54:48'),(756,215,'D','A free subscription',0,4,'2026-03-18 08:54:48','2026-03-18 08:54:48'),(757,216,'A','On the company website',1,1,'2026-03-18 08:54:48','2026-03-18 08:54:48'),(758,216,'B','In a newspaper',0,2,'2026-03-18 08:54:48','2026-03-18 08:54:48'),(759,216,'C','At a retail store',0,3,'2026-03-18 08:54:48','2026-03-18 08:54:48'),(760,216,'D','On television',0,4,'2026-03-18 08:54:48','2026-03-18 08:54:48'),(761,217,'A','at',0,1,'2026-03-18 08:57:08','2026-03-18 08:57:08'),(762,217,'B','by',1,2,'2026-03-18 08:57:08','2026-03-18 08:57:08'),(763,217,'C','on',0,3,'2026-03-18 08:57:08','2026-03-18 08:57:08'),(764,217,'D','during',0,4,'2026-03-18 08:57:08','2026-03-18 08:57:08'),(765,218,'A','whenever',1,1,'2026-03-18 08:57:08','2026-03-18 08:57:08'),(766,218,'B','because',0,2,'2026-03-18 08:57:08','2026-03-18 08:57:08'),(767,218,'C','although',0,3,'2026-03-18 08:57:08','2026-03-18 08:57:08'),(768,218,'D','unless',0,4,'2026-03-18 08:57:08','2026-03-18 08:57:08'),(769,219,'A','before',1,1,'2026-03-18 08:57:08','2026-03-18 08:57:08'),(770,219,'B','since',0,2,'2026-03-18 08:57:08','2026-03-18 08:57:08'),(771,219,'C','until',0,3,'2026-03-18 08:57:08','2026-03-18 08:57:08'),(772,219,'D','among',0,4,'2026-03-18 08:57:08','2026-03-18 08:57:08'),(773,220,'A','efficient',0,1,'2026-03-18 08:57:08','2026-03-18 08:57:08'),(774,220,'B','efficiency',0,2,'2026-03-18 08:57:08','2026-03-18 08:57:08'),(775,220,'C','efficiently',1,3,'2026-03-18 08:57:08','2026-03-18 08:57:08'),(776,220,'D','efficientness',0,4,'2026-03-18 08:57:08','2026-03-18 08:57:08'),(777,221,'A','for',1,1,'2026-03-18 08:57:08','2026-03-18 08:57:08'),(778,221,'B','from',0,2,'2026-03-18 08:57:08','2026-03-18 08:57:08'),(779,221,'C','with',0,3,'2026-03-18 08:57:08','2026-03-18 08:57:08'),(780,221,'D','about',0,4,'2026-03-18 08:57:08','2026-03-18 08:57:08'),(781,222,'A','open',1,1,'2026-03-18 08:57:08','2026-03-18 08:57:08'),(782,222,'B','opened',0,2,'2026-03-18 08:57:08','2026-03-18 08:57:08'),(783,222,'C','opening',0,3,'2026-03-18 08:57:08','2026-03-18 08:57:08'),(784,222,'D','opens',0,4,'2026-03-18 08:57:08','2026-03-18 08:57:08'),(785,223,'A','questions',1,1,'2026-03-18 08:57:08','2026-03-18 08:57:08'),(786,223,'B','questioning',0,2,'2026-03-18 08:57:08','2026-03-18 08:57:08'),(787,223,'C','questioned',0,3,'2026-03-18 08:57:08','2026-03-18 08:57:08'),(788,223,'D','questionable',0,4,'2026-03-18 08:57:08','2026-03-18 08:57:08'),(789,224,'A','submit',0,1,'2026-03-18 08:57:08','2026-03-18 08:57:08'),(790,224,'B','submitting',0,2,'2026-03-18 08:57:08','2026-03-18 08:57:08'),(791,224,'C','submitted',1,3,'2026-03-18 08:57:08','2026-03-18 08:57:08'),(792,224,'D','submits',0,4,'2026-03-18 08:57:08','2026-03-18 08:57:08'),(793,225,'A','since',1,1,'2026-03-18 08:57:08','2026-03-18 08:57:08'),(794,225,'B','unless',0,2,'2026-03-18 08:57:08','2026-03-18 08:57:08'),(795,225,'C','but',0,3,'2026-03-18 08:57:08','2026-03-18 08:57:08'),(796,225,'D','while',0,4,'2026-03-18 08:57:08','2026-03-18 08:57:08'),(797,226,'A','during',1,1,'2026-03-18 08:57:08','2026-03-18 08:57:08'),(798,226,'B','between',0,2,'2026-03-18 08:57:08','2026-03-18 08:57:08'),(799,226,'C','among',0,3,'2026-03-18 08:57:08','2026-03-18 08:57:08'),(800,226,'D','around',0,4,'2026-03-18 08:57:08','2026-03-18 08:57:08'),(801,227,'A','over',1,1,'2026-03-18 08:57:08','2026-03-18 08:57:08'),(802,227,'B','at',0,2,'2026-03-18 08:57:08','2026-03-18 08:57:08'),(803,227,'C','on',0,3,'2026-03-18 08:57:08','2026-03-18 08:57:08'),(804,227,'D','with',0,4,'2026-03-18 08:57:08','2026-03-18 08:57:08'),(805,228,'A','proper',0,1,'2026-03-18 08:57:08','2026-03-18 08:57:08'),(806,228,'B','properly',1,2,'2026-03-18 08:57:08','2026-03-18 08:57:08'),(807,228,'C','propriety',0,3,'2026-03-18 08:57:08','2026-03-18 08:57:08'),(808,228,'D','properness',0,4,'2026-03-18 08:57:08','2026-03-18 08:57:08'),(809,229,'A','communicate',0,1,'2026-03-18 08:57:08','2026-03-18 08:57:08'),(810,229,'B','communication',1,2,'2026-03-18 08:57:08','2026-03-18 08:57:08'),(811,229,'C','communicating',0,3,'2026-03-18 08:57:08','2026-03-18 08:57:08'),(812,229,'D','communicated',0,4,'2026-03-18 08:57:08','2026-03-18 08:57:08'),(813,230,'A','review',1,1,'2026-03-18 08:57:08','2026-03-18 08:57:08'),(814,230,'B','reviews',0,2,'2026-03-18 08:57:08','2026-03-18 08:57:08'),(815,230,'C','reviewed',0,3,'2026-03-18 08:57:08','2026-03-18 08:57:08'),(816,230,'D','reviewing',0,4,'2026-03-18 08:57:08','2026-03-18 08:57:08'),(817,231,'A','purchase',1,1,'2026-03-18 08:57:08','2026-03-18 08:57:08'),(818,231,'B','purchasing',0,2,'2026-03-18 08:57:08','2026-03-18 08:57:08'),(819,231,'C','purchased',0,3,'2026-03-18 08:57:08','2026-03-18 08:57:08'),(820,231,'D','purchases',0,4,'2026-03-18 08:57:08','2026-03-18 08:57:08'),(821,232,'A','normal',0,1,'2026-03-18 08:57:08','2026-03-18 08:57:08'),(822,232,'B','normality',0,2,'2026-03-18 08:57:08','2026-03-18 08:57:08'),(823,232,'C','normally',1,3,'2026-03-18 08:57:08','2026-03-18 08:57:08'),(824,232,'D','norm',0,4,'2026-03-18 08:57:08','2026-03-18 08:57:08'),(825,233,'A','discuss',1,1,'2026-03-18 08:57:08','2026-03-18 08:57:08'),(826,233,'B','discussed',0,2,'2026-03-18 08:57:08','2026-03-18 08:57:08'),(827,233,'C','discussing',0,3,'2026-03-18 08:57:08','2026-03-18 08:57:08'),(828,233,'D','discussion',0,4,'2026-03-18 08:57:08','2026-03-18 08:57:08'),(829,234,'A','before',1,1,'2026-03-18 08:57:08','2026-03-18 08:57:08'),(830,234,'B','after',0,2,'2026-03-18 08:57:08','2026-03-18 08:57:08'),(831,234,'C','while',0,3,'2026-03-18 08:57:08','2026-03-18 08:57:08'),(832,234,'D','among',0,4,'2026-03-18 08:57:08','2026-03-18 08:57:08'),(833,235,'A','inform',0,1,'2026-03-18 08:57:08','2026-03-18 08:57:08'),(834,235,'B','information',0,2,'2026-03-18 08:57:08','2026-03-18 08:57:08'),(835,235,'C','informative',1,3,'2026-03-18 08:57:08','2026-03-18 08:57:08'),(836,235,'D','informing',0,4,'2026-03-18 08:57:08','2026-03-18 08:57:08'),(837,236,'A','familiar',1,1,'2026-03-18 08:57:08','2026-03-18 08:57:08'),(838,236,'B','familiarity',0,2,'2026-03-18 08:57:08','2026-03-18 08:57:08'),(839,236,'C','familiarly',0,3,'2026-03-18 08:57:08','2026-03-18 08:57:08'),(840,236,'D','familiarize',0,4,'2026-03-18 08:57:08','2026-03-18 08:57:08'),(841,237,'A','increase',1,1,'2026-03-18 08:57:08','2026-03-18 08:57:08'),(842,237,'B','increasing',0,2,'2026-03-18 08:57:08','2026-03-18 08:57:08'),(843,237,'C','increased',0,3,'2026-03-18 08:57:08','2026-03-18 08:57:08'),(844,237,'D','increases',0,4,'2026-03-18 08:57:08','2026-03-18 08:57:08'),(845,238,'A','before',1,1,'2026-03-18 08:57:08','2026-03-18 08:57:08'),(846,238,'B','while',0,2,'2026-03-18 08:57:08','2026-03-18 08:57:08'),(847,238,'C','although',0,3,'2026-03-18 08:57:08','2026-03-18 08:57:08'),(848,238,'D','unless',0,4,'2026-03-18 08:57:08','2026-03-18 08:57:08'),(849,239,'A','detail',0,1,'2026-03-18 08:57:08','2026-03-18 08:57:08'),(850,239,'B','detailed',1,2,'2026-03-18 08:57:08','2026-03-18 08:57:08'),(851,239,'C','details',0,3,'2026-03-18 08:57:08','2026-03-18 08:57:08'),(852,239,'D','detailing',0,4,'2026-03-18 08:57:08','2026-03-18 08:57:08'),(853,240,'A','accidents',1,1,'2026-03-18 08:57:08','2026-03-18 08:57:08'),(854,240,'B','accidental',0,2,'2026-03-18 08:57:08','2026-03-18 08:57:08'),(855,240,'C','accidentally',0,3,'2026-03-18 08:57:08','2026-03-18 08:57:08'),(856,240,'D','accident',0,4,'2026-03-18 08:57:08','2026-03-18 08:57:08'),(857,241,'A','excellent',1,1,'2026-03-18 08:57:08','2026-03-18 08:57:08'),(858,241,'B','excellence',0,2,'2026-03-18 08:57:08','2026-03-18 08:57:08'),(859,241,'C','excellently',0,3,'2026-03-18 08:57:08','2026-03-18 08:57:08'),(860,241,'D','excel',0,4,'2026-03-18 08:57:08','2026-03-18 08:57:08'),(861,242,'A','order',0,1,'2026-03-18 08:57:08','2026-03-18 08:57:08'),(862,242,'B','ordering',1,2,'2026-03-18 08:57:08','2026-03-18 08:57:08'),(863,242,'C','orders',0,3,'2026-03-18 08:57:08','2026-03-18 08:57:08'),(864,242,'D','ordered',0,4,'2026-03-18 08:57:08','2026-03-18 08:57:08'),(865,243,'A','unless',1,1,'2026-03-18 08:57:08','2026-03-18 08:57:08'),(866,243,'B','because',0,2,'2026-03-18 08:57:08','2026-03-18 08:57:08'),(867,243,'C','since',0,3,'2026-03-18 08:57:08','2026-03-18 08:57:08'),(868,243,'D','while',0,4,'2026-03-18 08:57:08','2026-03-18 08:57:08'),(869,244,'A','expand',1,1,'2026-03-18 08:57:08','2026-03-18 08:57:08'),(870,244,'B','expansion',0,2,'2026-03-18 08:57:08','2026-03-18 08:57:08'),(871,244,'C','expanding',0,3,'2026-03-18 08:57:08','2026-03-18 08:57:08'),(872,244,'D','expands',0,4,'2026-03-18 08:57:08','2026-03-18 08:57:08'),(873,245,'A','at',1,1,'2026-03-18 08:57:08','2026-03-18 08:57:08'),(874,245,'B','in',0,2,'2026-03-18 08:57:08','2026-03-18 08:57:08'),(875,245,'C','on',0,3,'2026-03-18 08:57:08','2026-03-18 08:57:08'),(876,245,'D','for',0,4,'2026-03-18 08:57:08','2026-03-18 08:57:08'),(877,246,'A','as',1,1,'2026-03-18 08:57:08','2026-03-18 08:57:08'),(878,246,'B','since',0,2,'2026-03-18 08:57:08','2026-03-18 08:57:08'),(879,246,'C','while',0,3,'2026-03-18 08:57:08','2026-03-18 08:57:08'),(880,246,'D','until',0,4,'2026-03-18 08:57:08','2026-03-18 08:57:08'),(881,247,'A','success',0,1,'2026-03-18 08:57:08','2026-03-18 08:57:08'),(882,247,'B','successful',1,2,'2026-03-18 08:57:08','2026-03-18 08:57:08'),(883,247,'C','successfully',0,3,'2026-03-18 08:57:08','2026-03-18 08:57:08'),(884,247,'D','succeed',0,4,'2026-03-18 08:57:08','2026-03-18 08:57:08'),(885,248,'A','replace',0,1,'2026-03-18 08:57:08','2026-03-18 08:57:08'),(886,248,'B','replacement',1,2,'2026-03-18 08:57:08','2026-03-18 08:57:08'),(887,248,'C','replacing',0,3,'2026-03-18 08:57:08','2026-03-18 08:57:08'),(888,248,'D','replaced',0,4,'2026-03-18 08:57:08','2026-03-18 08:57:08'),(889,249,'A','interview',1,1,'2026-03-18 08:57:08','2026-03-18 08:57:08'),(890,249,'B','interviewed',0,2,'2026-03-18 08:57:08','2026-03-18 08:57:08'),(891,249,'C','interviewing',0,3,'2026-03-18 08:57:08','2026-03-18 08:57:08'),(892,249,'D','interviews',0,4,'2026-03-18 08:57:08','2026-03-18 08:57:08'),(893,250,'A','regular',0,1,'2026-03-18 08:57:08','2026-03-18 08:57:08'),(894,250,'B','regularly',1,2,'2026-03-18 08:57:08','2026-03-18 08:57:08'),(895,250,'C','regulation',0,3,'2026-03-18 08:57:08','2026-03-18 08:57:08'),(896,250,'D','regulate',0,4,'2026-03-18 08:57:08','2026-03-18 08:57:08'),(897,251,'A','exchange',1,1,'2026-03-18 08:57:08','2026-03-18 08:57:08'),(898,251,'B','exchanging',0,2,'2026-03-18 08:57:08','2026-03-18 08:57:08'),(899,251,'C','exchanged',0,3,'2026-03-18 08:57:08','2026-03-18 08:57:08'),(900,251,'D','exchanges',0,4,'2026-03-18 08:57:08','2026-03-18 08:57:08'),(901,252,'A','prepare',0,1,'2026-03-18 08:57:08','2026-03-18 08:57:08'),(902,252,'B','preparing',0,2,'2026-03-18 08:57:08','2026-03-18 08:57:08'),(903,252,'C','prepared',1,3,'2026-03-18 08:57:08','2026-03-18 08:57:08'),(904,252,'D','prepares',0,4,'2026-03-18 08:57:08','2026-03-18 08:57:08'),(905,253,'A','excellent',1,1,'2026-03-18 08:57:08','2026-03-18 08:57:08'),(906,253,'B','excellence',0,2,'2026-03-18 08:57:08','2026-03-18 08:57:08'),(907,253,'C','excellently',0,3,'2026-03-18 08:57:08','2026-03-18 08:57:08'),(908,253,'D','excel',0,4,'2026-03-18 08:57:08','2026-03-18 08:57:08'),(909,254,'A','on',1,1,'2026-03-18 08:57:08','2026-03-18 08:57:08'),(910,254,'B','in',0,2,'2026-03-18 08:57:08','2026-03-18 08:57:08'),(911,254,'C','at',0,3,'2026-03-18 08:57:08','2026-03-18 08:57:08'),(912,254,'D','for',0,4,'2026-03-18 08:57:08','2026-03-18 08:57:08'),(913,255,'A','at',0,1,'2026-03-18 08:57:08','2026-03-18 08:57:08'),(914,255,'B','by',1,2,'2026-03-18 08:57:08','2026-03-18 08:57:08'),(915,255,'C','on',0,3,'2026-03-18 08:57:08','2026-03-18 08:57:08'),(916,255,'D','for',0,4,'2026-03-18 08:57:08','2026-03-18 08:57:08'),(917,256,'A','perform',0,1,'2026-03-18 08:57:08','2026-03-18 08:57:08'),(918,256,'B','performance',1,2,'2026-03-18 08:57:08','2026-03-18 08:57:08'),(919,256,'C','performing',0,3,'2026-03-18 08:57:08','2026-03-18 08:57:08'),(920,256,'D','performed',0,4,'2026-03-18 08:57:08','2026-03-18 08:57:08'),(921,257,'A','offer',0,1,'2026-03-18 09:46:36','2026-03-18 09:46:36'),(922,257,'B','offers',1,2,'2026-03-18 09:46:36','2026-03-18 09:46:36'),(923,257,'C','offering',0,3,'2026-03-18 09:46:36','2026-03-18 09:46:36'),(924,257,'D','offered',0,4,'2026-03-18 09:46:36','2026-03-18 09:46:36'),(925,258,'A','customer',0,1,'2026-03-18 09:46:36','2026-03-18 09:46:36'),(926,258,'B','customers',1,2,'2026-03-18 09:46:36','2026-03-18 09:46:36'),(927,258,'C','customer\'s',0,3,'2026-03-18 09:46:36','2026-03-18 09:46:36'),(928,258,'D','customers\'',0,4,'2026-03-18 09:46:36','2026-03-18 09:46:36'),(929,259,'A','during',1,1,'2026-03-18 09:46:36','2026-03-18 09:46:36'),(930,259,'B','between',0,2,'2026-03-18 09:46:36','2026-03-18 09:46:36'),(931,259,'C','among',0,3,'2026-03-18 09:46:36','2026-03-18 09:46:36'),(932,259,'D','around',0,4,'2026-03-18 09:46:36','2026-03-18 09:46:36'),(933,260,'A','special',1,1,'2026-03-18 09:46:36','2026-03-18 09:46:36'),(934,260,'B','specially',0,2,'2026-03-18 09:46:36','2026-03-18 09:46:36'),(935,260,'C','specialize',0,3,'2026-03-18 09:46:36','2026-03-18 09:46:36'),(936,260,'D','specialty',0,4,'2026-03-18 09:46:36','2026-03-18 09:46:36'),(937,261,'A','for',1,1,'2026-03-18 09:46:36','2026-03-18 09:46:36'),(938,261,'B','from',0,2,'2026-03-18 09:46:36','2026-03-18 09:46:36'),(939,261,'C','with',0,3,'2026-03-18 09:46:36','2026-03-18 09:46:36'),(940,261,'D','about',0,4,'2026-03-18 09:46:36','2026-03-18 09:46:36'),(941,262,'A','during',1,1,'2026-03-18 09:46:36','2026-03-18 09:46:36'),(942,262,'B','while',0,2,'2026-03-18 09:46:36','2026-03-18 09:46:36'),(943,262,'C','until',0,3,'2026-03-18 09:46:36','2026-03-18 09:46:36'),(944,262,'D','around',0,4,'2026-03-18 09:46:36','2026-03-18 09:46:36'),(945,263,'A','resume',1,1,'2026-03-18 09:46:36','2026-03-18 09:46:36'),(946,263,'B','resumed',0,2,'2026-03-18 09:46:36','2026-03-18 09:46:36'),(947,263,'C','resumes',0,3,'2026-03-18 09:46:36','2026-03-18 09:46:36'),(948,263,'D','resuming',0,4,'2026-03-18 09:46:36','2026-03-18 09:46:36'),(949,264,'A','cooperate',0,1,'2026-03-18 09:46:36','2026-03-18 09:46:36'),(950,264,'B','cooperation',1,2,'2026-03-18 09:46:36','2026-03-18 09:46:36'),(951,264,'C','cooperating',0,3,'2026-03-18 09:46:36','2026-03-18 09:46:36'),(952,264,'D','cooperative',0,4,'2026-03-18 09:46:36','2026-03-18 09:46:36'),(1013,280,'A','To confirm a job interview',0,1,'2026-03-19 09:01:49','2026-03-19 09:01:49'),(1014,280,'B','To respond to a customer inquiry',1,2,'2026-03-19 09:01:49','2026-03-19 09:01:49'),(1015,280,'C','To announce a new product',0,3,'2026-03-19 09:01:49','2026-03-19 09:01:49'),(1016,280,'D','To request payment',0,4,'2026-03-19 09:01:49','2026-03-19 09:01:49'),(1017,281,'A','Incorrect address',0,1,'2026-03-19 09:01:49','2026-03-19 09:01:49'),(1018,281,'B','High demand',1,2,'2026-03-19 09:01:49','2026-03-19 09:01:49'),(1019,281,'C','Payment failure',0,3,'2026-03-19 09:01:49','2026-03-19 09:01:49'),(1020,281,'D','Warehouse damage',0,4,'2026-03-19 09:01:49','2026-03-19 09:01:49'),(1021,282,'A','Today',0,1,'2026-03-19 09:01:49','2026-03-19 09:01:49'),(1022,282,'B','Tomorrow',1,2,'2026-03-19 09:01:49','2026-03-19 09:01:49'),(1023,282,'C','Next week',0,3,'2026-03-19 09:01:49','2026-03-19 09:01:49'),(1024,282,'D','In three days',0,4,'2026-03-19 09:01:49','2026-03-19 09:01:49'),(1025,283,'A','A delayed shipment',1,1,'2026-03-19 09:12:45','2026-03-19 09:12:45'),(1026,283,'B','A marketing campaign',0,2,'2026-03-19 09:12:45','2026-03-19 09:12:45'),(1027,283,'C','A job interview',0,3,'2026-03-19 09:12:45','2026-03-19 09:12:45'),(1028,283,'D','A business trip',0,4,'2026-03-19 09:12:45','2026-03-19 09:12:45'),(1029,284,'A','A missing invoice',0,1,'2026-03-19 09:12:45','2026-03-19 09:12:45'),(1030,284,'B','A delayed shipment',1,2,'2026-03-19 09:12:45','2026-03-19 09:12:45'),(1031,284,'C','A broken machine',0,3,'2026-03-19 09:12:45','2026-03-19 09:12:45'),(1032,284,'D','A cancelled meeting',0,4,'2026-03-19 09:12:45','2026-03-19 09:12:45'),(1033,285,'A','Call the supplier',1,1,'2026-03-19 09:12:46','2026-03-19 09:12:46'),(1034,285,'B','Send an email to customers',0,2,'2026-03-19 09:12:46','2026-03-19 09:12:46'),(1035,285,'C','Cancel the order',0,3,'2026-03-19 09:12:46','2026-03-19 09:12:46'),(1036,285,'D','Visit the warehouse',0,4,'2026-03-19 09:12:46','2026-03-19 09:12:46'),(1037,286,'A','In an office',1,1,'2026-03-19 09:12:46','2026-03-19 09:12:46'),(1038,286,'B','In a restaurant',0,2,'2026-03-19 09:12:46','2026-03-19 09:12:46'),(1039,286,'C','In a hotel lobby',0,3,'2026-03-19 09:12:46','2026-03-19 09:12:46'),(1040,286,'D','In a factory',0,4,'2026-03-19 09:12:46','2026-03-19 09:12:46'),(1041,287,'A','Print a report',1,1,'2026-03-19 09:13:17','2026-03-19 09:13:17'),(1042,287,'B','Schedule a meeting',0,2,'2026-03-19 09:13:17','2026-03-19 09:13:17'),(1043,287,'C','Order lunch',0,3,'2026-03-19 09:13:17','2026-03-19 09:13:17'),(1044,287,'D','Call a client',0,4,'2026-03-19 09:13:17','2026-03-19 09:13:17'),(1045,288,'A','The printer is broken',0,1,'2026-03-19 09:13:17','2026-03-19 09:13:17'),(1046,288,'B','The ink may be low',1,2,'2026-03-19 09:13:17','2026-03-19 09:13:17'),(1047,288,'C','The report is missing',0,3,'2026-03-19 09:13:17','2026-03-19 09:13:17'),(1048,288,'D','The computer is off',0,4,'2026-03-19 09:13:17','2026-03-19 09:13:17'),(1049,289,'A','A conference trip',1,1,'2026-03-19 09:13:17','2026-03-19 09:13:17'),(1050,289,'B','A company dinner',0,2,'2026-03-19 09:13:17','2026-03-19 09:13:17'),(1051,289,'C','A training course',0,3,'2026-03-19 09:13:17','2026-03-19 09:13:17'),(1052,289,'D','A project deadline',0,4,'2026-03-19 09:13:17','2026-03-19 09:13:17'),(1053,290,'A','Tomorrow morning',0,1,'2026-03-19 09:13:17','2026-03-19 09:13:17'),(1054,290,'B','Next Monday',1,2,'2026-03-19 09:13:17','2026-03-19 09:13:17'),(1055,290,'C','Next month',0,3,'2026-03-19 09:13:17','2026-03-19 09:13:17'),(1056,290,'D','This weekend',0,4,'2026-03-19 09:13:17','2026-03-19 09:13:17'),(1057,291,'A','A',0,1,'2026-03-19 09:14:04','2026-03-19 09:14:04'),(1058,291,'B','B',1,2,'2026-03-19 09:14:04','2026-03-19 09:14:04'),(1059,291,'C','C',0,3,'2026-03-19 09:14:04','2026-03-19 09:14:04'),(1060,292,'A','A',1,1,'2026-03-19 09:14:04','2026-03-19 09:14:04'),(1061,292,'B','B',0,2,'2026-03-19 09:14:04','2026-03-19 09:14:04'),(1062,292,'C','C',0,3,'2026-03-19 09:14:04','2026-03-19 09:14:04'),(1063,293,'A','A',1,1,'2026-03-19 09:14:04','2026-03-19 09:14:04'),(1064,293,'B','B',0,2,'2026-03-19 09:14:04','2026-03-19 09:14:04'),(1065,293,'C','C',0,3,'2026-03-19 09:14:04','2026-03-19 09:14:04'),(1066,294,'A','A',1,1,'2026-03-19 09:14:04','2026-03-19 09:14:04'),(1067,294,'B','B',0,2,'2026-03-19 09:14:04','2026-03-19 09:14:04'),(1068,294,'C','C',0,3,'2026-03-19 09:14:04','2026-03-19 09:14:04'),(1069,295,'A','A',1,1,'2026-03-19 09:14:04','2026-03-19 09:14:04'),(1070,295,'B','B',0,2,'2026-03-19 09:14:04','2026-03-19 09:14:04'),(1071,295,'C','C',0,3,'2026-03-19 09:14:04','2026-03-19 09:14:04'),(1072,296,'A','A',1,1,'2026-03-19 09:14:04','2026-03-19 09:14:04'),(1073,296,'B','B',0,2,'2026-03-19 09:14:04','2026-03-19 09:14:04'),(1074,296,'C','C',0,3,'2026-03-19 09:14:04','2026-03-19 09:14:04'),(1075,297,'A','A',1,1,'2026-03-19 09:14:04','2026-03-19 09:14:04'),(1076,297,'B','B',0,2,'2026-03-19 09:14:04','2026-03-19 09:14:04'),(1077,297,'C','C',0,3,'2026-03-19 09:14:04','2026-03-19 09:14:04'),(1078,298,'A','A',1,1,'2026-03-19 09:14:04','2026-03-19 09:14:04'),(1079,298,'B','B',0,2,'2026-03-19 09:14:04','2026-03-19 09:14:04'),(1080,298,'C','C',0,3,'2026-03-19 09:14:04','2026-03-19 09:14:04'),(1081,299,'A','A',1,1,'2026-03-19 09:14:04','2026-03-19 09:14:04'),(1082,299,'B','B',0,2,'2026-03-19 09:14:04','2026-03-19 09:14:04'),(1083,299,'C','C',0,3,'2026-03-19 09:14:04','2026-03-19 09:14:04'),(1084,300,'A','A',1,1,'2026-03-19 09:14:04','2026-03-19 09:14:04'),(1085,300,'B','B',0,2,'2026-03-19 09:14:04','2026-03-19 09:14:04'),(1086,300,'C','C',0,3,'2026-03-19 09:14:04','2026-03-19 09:14:04'),(1087,301,'A','A',1,1,'2026-03-19 09:14:04','2026-03-19 09:14:04'),(1088,301,'B','B',0,2,'2026-03-19 09:14:04','2026-03-19 09:14:04'),(1089,301,'C','C',0,3,'2026-03-19 09:14:04','2026-03-19 09:14:04'),(1090,302,'A','A',1,1,'2026-03-19 09:14:04','2026-03-19 09:14:04'),(1091,302,'B','B',0,2,'2026-03-19 09:14:04','2026-03-19 09:14:04'),(1092,302,'C','C',0,3,'2026-03-19 09:14:04','2026-03-19 09:14:04'),(1093,303,'A','A',1,1,'2026-03-19 09:14:04','2026-03-19 09:14:04'),(1094,303,'B','B',0,2,'2026-03-19 09:14:04','2026-03-19 09:14:04'),(1095,303,'C','C',0,3,'2026-03-19 09:14:04','2026-03-19 09:14:04'),(1096,304,'A','A',1,1,'2026-03-19 09:14:04','2026-03-19 09:14:04'),(1097,304,'B','B',0,2,'2026-03-19 09:14:04','2026-03-19 09:14:04'),(1098,304,'C','C',0,3,'2026-03-19 09:14:04','2026-03-19 09:14:04'),(1099,305,'A','A',1,1,'2026-03-19 09:14:04','2026-03-19 09:14:04'),(1100,305,'B','B',0,2,'2026-03-19 09:14:04','2026-03-19 09:14:04'),(1101,305,'C','C',0,3,'2026-03-19 09:14:04','2026-03-19 09:14:04'),(1102,306,'A','A',1,1,'2026-03-19 09:14:04','2026-03-19 09:14:04'),(1103,306,'B','B',0,2,'2026-03-19 09:14:04','2026-03-19 09:14:04'),(1104,306,'C','C',0,3,'2026-03-19 09:14:04','2026-03-19 09:14:04'),(1105,307,'A','A',1,1,'2026-03-19 09:14:04','2026-03-19 09:14:04'),(1106,307,'B','B',0,2,'2026-03-19 09:14:04','2026-03-19 09:14:04'),(1107,307,'C','C',0,3,'2026-03-19 09:14:04','2026-03-19 09:14:04'),(1108,308,'A','A',1,1,'2026-03-19 09:14:04','2026-03-19 09:14:04'),(1109,308,'B','B',0,2,'2026-03-19 09:14:04','2026-03-19 09:14:04'),(1110,308,'C','C',0,3,'2026-03-19 09:14:04','2026-03-19 09:14:04'),(1111,309,'A','A',1,1,'2026-03-19 09:14:04','2026-03-19 09:14:04'),(1112,309,'B','B',0,2,'2026-03-19 09:14:04','2026-03-19 09:14:04'),(1113,309,'C','C',0,3,'2026-03-19 09:14:04','2026-03-19 09:14:04'),(1114,310,'A','A',1,1,'2026-03-19 09:14:04','2026-03-19 09:14:04'),(1115,310,'B','B',0,2,'2026-03-19 09:14:04','2026-03-19 09:14:04'),(1116,310,'C','C',0,3,'2026-03-19 09:14:04','2026-03-19 09:14:04'),(1117,311,'A','A',1,1,'2026-03-19 09:14:04','2026-03-19 09:14:04'),(1118,311,'B','B',0,2,'2026-03-19 09:14:04','2026-03-19 09:14:04'),(1119,311,'C','C',0,3,'2026-03-19 09:14:04','2026-03-19 09:14:04'),(1120,312,'A','A',1,1,'2026-03-19 09:14:04','2026-03-19 09:14:04'),(1121,312,'B','B',0,2,'2026-03-19 09:14:04','2026-03-19 09:14:04'),(1122,312,'C','C',0,3,'2026-03-19 09:14:04','2026-03-19 09:14:04'),(1123,313,'A','A',1,1,'2026-03-19 09:14:04','2026-03-19 09:14:04'),(1124,313,'B','B',0,2,'2026-03-19 09:14:04','2026-03-19 09:14:04'),(1125,313,'C','C',0,3,'2026-03-19 09:14:04','2026-03-19 09:14:04'),(1126,314,'A','A',1,1,'2026-03-19 09:14:04','2026-03-19 09:14:04'),(1127,314,'B','B',0,2,'2026-03-19 09:14:04','2026-03-19 09:14:04'),(1128,314,'C','C',0,3,'2026-03-19 09:14:04','2026-03-19 09:14:04'),(1129,315,'A','A',1,1,'2026-03-19 09:14:04','2026-03-19 09:14:04'),(1130,315,'B','B',0,2,'2026-03-19 09:14:04','2026-03-19 09:14:04'),(1131,315,'C','C',0,3,'2026-03-19 09:14:04','2026-03-19 09:14:04'),(1156,322,'A','To announce a schedule change',1,1,'2026-03-19 09:36:52','2026-03-19 09:36:52'),(1157,322,'B','To advertise a new train',0,2,'2026-03-19 09:36:52','2026-03-19 09:36:52'),(1158,322,'C','To introduce staff',0,3,'2026-03-19 09:36:52','2026-03-19 09:36:52'),(1159,322,'D','To explain ticket prices',0,4,'2026-03-19 09:36:52','2026-03-19 09:36:52'),(1160,323,'A','Train passengers',1,1,'2026-03-19 09:36:52','2026-03-19 09:36:52'),(1161,323,'B','Train drivers',0,2,'2026-03-19 09:36:52','2026-03-19 09:36:52'),(1162,323,'C','Station employees',0,3,'2026-03-19 09:36:52','2026-03-19 09:36:52'),(1163,323,'D','Tour guides',0,4,'2026-03-19 09:36:52','2026-03-19 09:36:52'),(1164,324,'A','Check the schedule board',1,1,'2026-03-19 09:36:52','2026-03-19 09:36:52'),(1165,324,'B','Return their tickets',0,2,'2026-03-19 09:36:52','2026-03-19 09:36:52'),(1166,324,'C','Move to another station',0,3,'2026-03-19 09:36:52','2026-03-19 09:36:52'),(1167,324,'D','Wait outside the station',0,4,'2026-03-19 09:36:52','2026-03-19 09:36:52'),(1168,325,'A','Promote a new product',1,1,'2026-03-19 09:36:52','2026-03-19 09:36:52'),(1169,325,'B','Report company profits',0,2,'2026-03-19 09:36:52','2026-03-19 09:36:52'),(1170,325,'C','Explain office rules',0,3,'2026-03-19 09:36:52','2026-03-19 09:36:52'),(1171,325,'D','Invite employees to a meeting',0,4,'2026-03-19 09:36:52','2026-03-19 09:36:52'),(1172,326,'A','at',0,1,'2026-03-19 09:38:22','2026-03-19 09:38:22'),(1173,326,'B','by',1,2,'2026-03-19 09:38:22','2026-03-19 09:38:22'),(1174,326,'C','on',0,3,'2026-03-19 09:38:22','2026-03-19 09:38:22'),(1175,326,'D','during',0,4,'2026-03-19 09:38:22','2026-03-19 09:38:22'),(1176,327,'A','whenever',1,1,'2026-03-19 09:38:22','2026-03-19 09:38:22'),(1177,327,'B','because',0,2,'2026-03-19 09:38:22','2026-03-19 09:38:22'),(1178,327,'C','although',0,3,'2026-03-19 09:38:22','2026-03-19 09:38:22'),(1179,327,'D','unless',0,4,'2026-03-19 09:38:22','2026-03-19 09:38:22'),(1180,328,'A','before',1,1,'2026-03-19 09:38:22','2026-03-19 09:38:22'),(1181,328,'B','since',0,2,'2026-03-19 09:38:22','2026-03-19 09:38:22'),(1182,328,'C','until',0,3,'2026-03-19 09:38:22','2026-03-19 09:38:22'),(1183,328,'D','among',0,4,'2026-03-19 09:38:22','2026-03-19 09:38:22'),(1184,329,'A','efficient',0,1,'2026-03-19 09:38:22','2026-03-19 09:38:22'),(1185,329,'B','efficiency',0,2,'2026-03-19 09:38:22','2026-03-19 09:38:22'),(1186,329,'C','efficiently',1,3,'2026-03-19 09:38:22','2026-03-19 09:38:22'),(1187,329,'D','efficientness',0,4,'2026-03-19 09:38:22','2026-03-19 09:38:22'),(1188,330,'A','for',1,1,'2026-03-19 09:38:22','2026-03-19 09:38:22'),(1189,330,'B','from',0,2,'2026-03-19 09:38:22','2026-03-19 09:38:22'),(1190,330,'C','with',0,3,'2026-03-19 09:38:22','2026-03-19 09:38:22'),(1191,330,'D','about',0,4,'2026-03-19 09:38:22','2026-03-19 09:38:22'),(1192,331,'A','open',1,1,'2026-03-19 09:38:22','2026-03-19 09:38:22'),(1193,331,'B','opened',0,2,'2026-03-19 09:38:22','2026-03-19 09:38:22'),(1194,331,'C','opening',0,3,'2026-03-19 09:38:22','2026-03-19 09:38:22'),(1195,331,'D','opens',0,4,'2026-03-19 09:38:22','2026-03-19 09:38:22'),(1196,332,'A','questions',1,1,'2026-03-19 09:38:22','2026-03-19 09:38:22'),(1197,332,'B','questioning',0,2,'2026-03-19 09:38:22','2026-03-19 09:38:22'),(1198,332,'C','questioned',0,3,'2026-03-19 09:38:22','2026-03-19 09:38:22'),(1199,332,'D','questionable',0,4,'2026-03-19 09:38:22','2026-03-19 09:38:22'),(1200,333,'A','submit',0,1,'2026-03-19 09:38:22','2026-03-19 09:38:22'),(1201,333,'B','submitting',0,2,'2026-03-19 09:38:22','2026-03-19 09:38:22'),(1202,333,'C','submitted',1,3,'2026-03-19 09:38:22','2026-03-19 09:38:22'),(1203,333,'D','submits',0,4,'2026-03-19 09:38:22','2026-03-19 09:38:22'),(1204,334,'A','since',1,1,'2026-03-19 09:38:22','2026-03-19 09:38:22'),(1205,334,'B','unless',0,2,'2026-03-19 09:38:22','2026-03-19 09:38:22'),(1206,334,'C','but',0,3,'2026-03-19 09:38:22','2026-03-19 09:38:22'),(1207,334,'D','while',0,4,'2026-03-19 09:38:22','2026-03-19 09:38:22'),(1208,335,'A','during',1,1,'2026-03-19 09:38:22','2026-03-19 09:38:22'),(1209,335,'B','between',0,2,'2026-03-19 09:38:22','2026-03-19 09:38:22'),(1210,335,'C','among',0,3,'2026-03-19 09:38:22','2026-03-19 09:38:22'),(1211,335,'D','around',0,4,'2026-03-19 09:38:22','2026-03-19 09:38:22'),(1212,336,'A','over',1,1,'2026-03-19 09:38:22','2026-03-19 09:38:22'),(1213,336,'B','at',0,2,'2026-03-19 09:38:22','2026-03-19 09:38:22'),(1214,336,'C','on',0,3,'2026-03-19 09:38:22','2026-03-19 09:38:22'),(1215,336,'D','with',0,4,'2026-03-19 09:38:22','2026-03-19 09:38:22'),(1216,337,'A','proper',0,1,'2026-03-19 09:38:22','2026-03-19 09:38:22'),(1217,337,'B','properly',1,2,'2026-03-19 09:38:22','2026-03-19 09:38:22'),(1218,337,'C','propriety',0,3,'2026-03-19 09:38:22','2026-03-19 09:38:22'),(1219,337,'D','properness',0,4,'2026-03-19 09:38:22','2026-03-19 09:38:22'),(1220,338,'A','communicate',0,1,'2026-03-19 09:38:22','2026-03-19 09:38:22'),(1221,338,'B','communication',1,2,'2026-03-19 09:38:22','2026-03-19 09:38:22'),(1222,338,'C','communicating',0,3,'2026-03-19 09:38:22','2026-03-19 09:38:22'),(1223,338,'D','communicated',0,4,'2026-03-19 09:38:22','2026-03-19 09:38:22'),(1224,339,'A','review',1,1,'2026-03-19 09:38:22','2026-03-19 09:38:22'),(1225,339,'B','reviews',0,2,'2026-03-19 09:38:22','2026-03-19 09:38:22'),(1226,339,'C','reviewed',0,3,'2026-03-19 09:38:22','2026-03-19 09:38:22'),(1227,339,'D','reviewing',0,4,'2026-03-19 09:38:22','2026-03-19 09:38:22'),(1228,340,'A','purchase',1,1,'2026-03-19 09:38:22','2026-03-19 09:38:22'),(1229,340,'B','purchasing',0,2,'2026-03-19 09:38:22','2026-03-19 09:38:22'),(1230,340,'C','purchased',0,3,'2026-03-19 09:38:22','2026-03-19 09:38:22'),(1231,340,'D','purchases',0,4,'2026-03-19 09:38:22','2026-03-19 09:38:22'),(1232,341,'A','normal',0,1,'2026-03-19 09:38:22','2026-03-19 09:38:22'),(1233,341,'B','normality',0,2,'2026-03-19 09:38:22','2026-03-19 09:38:22'),(1234,341,'C','normally',1,3,'2026-03-19 09:38:22','2026-03-19 09:38:22'),(1235,341,'D','norm',0,4,'2026-03-19 09:38:22','2026-03-19 09:38:22'),(1236,342,'A','discuss',1,1,'2026-03-19 09:38:22','2026-03-19 09:38:22'),(1237,342,'B','discussed',0,2,'2026-03-19 09:38:22','2026-03-19 09:38:22'),(1238,342,'C','discussing',0,3,'2026-03-19 09:38:22','2026-03-19 09:38:22'),(1239,342,'D','discussion',0,4,'2026-03-19 09:38:22','2026-03-19 09:38:22'),(1240,343,'A','before',1,1,'2026-03-19 09:38:22','2026-03-19 09:38:22'),(1241,343,'B','after',0,2,'2026-03-19 09:38:22','2026-03-19 09:38:22'),(1242,343,'C','while',0,3,'2026-03-19 09:38:22','2026-03-19 09:38:22'),(1243,343,'D','among',0,4,'2026-03-19 09:38:22','2026-03-19 09:38:22'),(1244,344,'A','inform',0,1,'2026-03-19 09:38:22','2026-03-19 09:38:22'),(1245,344,'B','information',0,2,'2026-03-19 09:38:22','2026-03-19 09:38:22'),(1246,344,'C','informative',1,3,'2026-03-19 09:38:22','2026-03-19 09:38:22'),(1247,344,'D','informing',0,4,'2026-03-19 09:38:22','2026-03-19 09:38:22'),(1248,345,'A','familiar',1,1,'2026-03-19 09:38:22','2026-03-19 09:38:22'),(1249,345,'B','familiarity',0,2,'2026-03-19 09:38:22','2026-03-19 09:38:22'),(1250,345,'C','familiarly',0,3,'2026-03-19 09:38:22','2026-03-19 09:38:22'),(1251,345,'D','familiarize',0,4,'2026-03-19 09:38:22','2026-03-19 09:38:22'),(1252,346,'A','increase',1,1,'2026-03-19 09:38:22','2026-03-19 09:38:22'),(1253,346,'B','increasing',0,2,'2026-03-19 09:38:22','2026-03-19 09:38:22'),(1254,346,'C','increased',0,3,'2026-03-19 09:38:22','2026-03-19 09:38:22'),(1255,346,'D','increases',0,4,'2026-03-19 09:38:22','2026-03-19 09:38:22'),(1256,347,'A','before',1,1,'2026-03-19 09:38:22','2026-03-19 09:38:22'),(1257,347,'B','while',0,2,'2026-03-19 09:38:22','2026-03-19 09:38:22'),(1258,347,'C','although',0,3,'2026-03-19 09:38:22','2026-03-19 09:38:22'),(1259,347,'D','unless',0,4,'2026-03-19 09:38:22','2026-03-19 09:38:22'),(1260,348,'A','detail',0,1,'2026-03-19 09:38:22','2026-03-19 09:38:22'),(1261,348,'B','detailed',1,2,'2026-03-19 09:38:22','2026-03-19 09:38:22'),(1262,348,'C','details',0,3,'2026-03-19 09:38:22','2026-03-19 09:38:22'),(1263,348,'D','detailing',0,4,'2026-03-19 09:38:22','2026-03-19 09:38:22'),(1264,349,'A','accidents',1,1,'2026-03-19 09:38:22','2026-03-19 09:38:22'),(1265,349,'B','accidental',0,2,'2026-03-19 09:38:22','2026-03-19 09:38:22'),(1266,349,'C','accidentally',0,3,'2026-03-19 09:38:22','2026-03-19 09:38:22'),(1267,349,'D','accident',0,4,'2026-03-19 09:38:22','2026-03-19 09:38:22'),(1268,350,'A','excellent',1,1,'2026-03-19 09:38:22','2026-03-19 09:38:22'),(1269,350,'B','excellence',0,2,'2026-03-19 09:38:22','2026-03-19 09:38:22'),(1270,350,'C','excellently',0,3,'2026-03-19 09:38:22','2026-03-19 09:38:22'),(1271,350,'D','excel',0,4,'2026-03-19 09:38:22','2026-03-19 09:38:22'),(1272,351,'A','order',0,1,'2026-03-19 09:38:22','2026-03-19 09:38:22'),(1273,351,'B','ordering',1,2,'2026-03-19 09:38:22','2026-03-19 09:38:22'),(1274,351,'C','orders',0,3,'2026-03-19 09:38:22','2026-03-19 09:38:22'),(1275,351,'D','ordered',0,4,'2026-03-19 09:38:22','2026-03-19 09:38:22'),(1276,352,'A','unless',1,1,'2026-03-19 09:38:22','2026-03-19 09:38:22'),(1277,352,'B','because',0,2,'2026-03-19 09:38:22','2026-03-19 09:38:22'),(1278,352,'C','since',0,3,'2026-03-19 09:38:22','2026-03-19 09:38:22'),(1279,352,'D','while',0,4,'2026-03-19 09:38:22','2026-03-19 09:38:22'),(1280,353,'A','expand',1,1,'2026-03-19 09:38:22','2026-03-19 09:38:22'),(1281,353,'B','expansion',0,2,'2026-03-19 09:38:22','2026-03-19 09:38:22'),(1282,353,'C','expanding',0,3,'2026-03-19 09:38:22','2026-03-19 09:38:22'),(1283,353,'D','expands',0,4,'2026-03-19 09:38:22','2026-03-19 09:38:22'),(1284,354,'A','at',1,1,'2026-03-19 09:38:22','2026-03-19 09:38:22'),(1285,354,'B','in',0,2,'2026-03-19 09:38:22','2026-03-19 09:38:22'),(1286,354,'C','on',0,3,'2026-03-19 09:38:22','2026-03-19 09:38:22'),(1287,354,'D','for',0,4,'2026-03-19 09:38:22','2026-03-19 09:38:22'),(1288,355,'A','as',1,1,'2026-03-19 09:38:22','2026-03-19 09:38:22'),(1289,355,'B','since',0,2,'2026-03-19 09:38:22','2026-03-19 09:38:22'),(1290,355,'C','while',0,3,'2026-03-19 09:38:22','2026-03-19 09:38:22'),(1291,355,'D','until',0,4,'2026-03-19 09:38:22','2026-03-19 09:38:22'),(1292,356,'A','success',0,1,'2026-03-19 09:38:22','2026-03-19 09:38:22'),(1293,356,'B','successful',1,2,'2026-03-19 09:38:22','2026-03-19 09:38:22'),(1294,356,'C','successfully',0,3,'2026-03-19 09:38:22','2026-03-19 09:38:22'),(1295,356,'D','succeed',0,4,'2026-03-19 09:38:22','2026-03-19 09:38:22'),(1296,357,'A','replace',0,1,'2026-03-19 09:38:22','2026-03-19 09:38:22'),(1297,357,'B','replacement',1,2,'2026-03-19 09:38:22','2026-03-19 09:38:22'),(1298,357,'C','replacing',0,3,'2026-03-19 09:38:22','2026-03-19 09:38:22'),(1299,357,'D','replaced',0,4,'2026-03-19 09:38:22','2026-03-19 09:38:22'),(1300,358,'A','interview',1,1,'2026-03-19 09:38:22','2026-03-19 09:38:22'),(1301,358,'B','interviewed',0,2,'2026-03-19 09:38:22','2026-03-19 09:38:22'),(1302,358,'C','interviewing',0,3,'2026-03-19 09:38:22','2026-03-19 09:38:22'),(1303,358,'D','interviews',0,4,'2026-03-19 09:38:22','2026-03-19 09:38:22'),(1304,359,'A','regular',0,1,'2026-03-19 09:38:22','2026-03-19 09:38:22'),(1305,359,'B','regularly',1,2,'2026-03-19 09:38:22','2026-03-19 09:38:22'),(1306,359,'C','regulation',0,3,'2026-03-19 09:38:22','2026-03-19 09:38:22'),(1307,359,'D','regulate',0,4,'2026-03-19 09:38:22','2026-03-19 09:38:22'),(1308,360,'A','exchange',1,1,'2026-03-19 09:38:22','2026-03-19 09:38:22'),(1309,360,'B','exchanging',0,2,'2026-03-19 09:38:22','2026-03-19 09:38:22'),(1310,360,'C','exchanged',0,3,'2026-03-19 09:38:22','2026-03-19 09:38:22'),(1311,360,'D','exchanges',0,4,'2026-03-19 09:38:22','2026-03-19 09:38:22'),(1312,361,'A','prepare',0,1,'2026-03-19 09:38:22','2026-03-19 09:38:22'),(1313,361,'B','preparing',0,2,'2026-03-19 09:38:22','2026-03-19 09:38:22'),(1314,361,'C','prepared',1,3,'2026-03-19 09:38:22','2026-03-19 09:38:22'),(1315,361,'D','prepares',0,4,'2026-03-19 09:38:22','2026-03-19 09:38:22'),(1316,362,'A','excellent',1,1,'2026-03-19 09:38:22','2026-03-19 09:38:22'),(1317,362,'B','excellence',0,2,'2026-03-19 09:38:22','2026-03-19 09:38:22'),(1318,362,'C','excellently',0,3,'2026-03-19 09:38:22','2026-03-19 09:38:22'),(1319,362,'D','excel',0,4,'2026-03-19 09:38:22','2026-03-19 09:38:22'),(1320,363,'A','on',1,1,'2026-03-19 09:38:22','2026-03-19 09:38:22'),(1321,363,'B','in',0,2,'2026-03-19 09:38:22','2026-03-19 09:38:22'),(1322,363,'C','at',0,3,'2026-03-19 09:38:22','2026-03-19 09:38:22'),(1323,363,'D','for',0,4,'2026-03-19 09:38:22','2026-03-19 09:38:22'),(1324,364,'A','at',0,1,'2026-03-19 09:38:22','2026-03-19 09:38:22'),(1325,364,'B','by',1,2,'2026-03-19 09:38:22','2026-03-19 09:38:22'),(1326,364,'C','on',0,3,'2026-03-19 09:38:22','2026-03-19 09:38:22'),(1327,364,'D','for',0,4,'2026-03-19 09:38:22','2026-03-19 09:38:22'),(1328,365,'A','perform',0,1,'2026-03-19 09:38:22','2026-03-19 09:38:22'),(1329,365,'B','performance',1,2,'2026-03-19 09:38:22','2026-03-19 09:38:22'),(1330,365,'C','performing',0,3,'2026-03-19 09:38:22','2026-03-19 09:38:22'),(1331,365,'D','performed',0,4,'2026-03-19 09:38:22','2026-03-19 09:38:22'),(1332,366,'A','offer',0,1,'2026-03-19 09:50:33','2026-03-19 09:50:33'),(1333,366,'B','offers',1,2,'2026-03-19 09:50:33','2026-03-19 09:50:33'),(1334,366,'C','offering',0,3,'2026-03-19 09:50:33','2026-03-19 09:50:33'),(1335,366,'D','offered',0,4,'2026-03-19 09:50:33','2026-03-19 09:50:33'),(1336,367,'A','customer',0,1,'2026-03-19 09:50:33','2026-03-19 09:50:33'),(1337,367,'B','customers',1,2,'2026-03-19 09:50:33','2026-03-19 09:50:33'),(1338,367,'C','customer\'s',0,3,'2026-03-19 09:50:33','2026-03-19 09:50:33'),(1339,367,'D','customers\'',0,4,'2026-03-19 09:50:33','2026-03-19 09:50:33'),(1340,368,'A','during',1,1,'2026-03-19 09:50:33','2026-03-19 09:50:33'),(1341,368,'B','between',0,2,'2026-03-19 09:50:33','2026-03-19 09:50:33'),(1342,368,'C','among',0,3,'2026-03-19 09:50:33','2026-03-19 09:50:33'),(1343,368,'D','around',0,4,'2026-03-19 09:50:33','2026-03-19 09:50:33'),(1344,369,'A','special',1,1,'2026-03-19 09:50:33','2026-03-19 09:50:33'),(1345,369,'B','specially',0,2,'2026-03-19 09:50:33','2026-03-19 09:50:33'),(1346,369,'C','specialize',0,3,'2026-03-19 09:50:33','2026-03-19 09:50:33'),(1347,369,'D','specialty',0,4,'2026-03-19 09:50:33','2026-03-19 09:50:33'),(1348,370,'A','for',1,1,'2026-03-19 09:50:33','2026-03-19 09:50:33'),(1349,370,'B','from',0,2,'2026-03-19 09:50:33','2026-03-19 09:50:33'),(1350,370,'C','with',0,3,'2026-03-19 09:50:33','2026-03-19 09:50:33'),(1351,370,'D','about',0,4,'2026-03-19 09:50:33','2026-03-19 09:50:33'),(1352,371,'A','To confirm a purchase',1,1,'2026-03-19 09:58:10','2026-03-19 09:58:10'),(1353,371,'B','To cancel an order',0,2,'2026-03-19 09:58:10','2026-03-19 09:58:10'),(1354,371,'C','To request payment',0,3,'2026-03-19 09:58:10','2026-03-19 09:58:10'),(1355,371,'D','To offer a refund',0,4,'2026-03-19 09:58:10','2026-03-19 09:58:10'),(1356,372,'A','Tuesday',0,1,'2026-03-19 09:58:10','2026-03-19 09:58:10'),(1357,372,'B','Wednesday',0,2,'2026-03-19 09:58:10','2026-03-19 09:58:10'),(1358,372,'C','Thursday',1,3,'2026-03-19 09:58:10','2026-03-19 09:58:10'),(1359,372,'D','Friday',0,4,'2026-03-19 09:58:10','2026-03-19 09:58:10'),(1360,373,'A','Call the store',0,1,'2026-03-19 09:58:10','2026-03-19 09:58:10'),(1361,373,'B','Visit the website',1,2,'2026-03-19 09:58:10','2026-03-19 09:58:10'),(1362,373,'C','Contact the courier office',0,3,'2026-03-19 09:58:10','2026-03-19 09:58:10'),(1363,373,'D','Send another email',0,4,'2026-03-19 09:58:10','2026-03-19 09:58:10'),(1364,374,'A','A music concert',0,1,'2026-03-19 09:59:18','2026-03-19 09:59:18'),(1365,374,'B','A photography exhibition',1,2,'2026-03-19 09:59:18','2026-03-19 09:59:18'),(1366,374,'C','A book fair',0,3,'2026-03-19 09:59:18','2026-03-19 09:59:18'),(1367,374,'D','A technology show',0,4,'2026-03-19 09:59:18','2026-03-19 09:59:18'),(1368,375,'A','August 20–September 5',0,1,'2026-03-19 09:59:18','2026-03-19 09:59:18'),(1369,375,'B','September 5–September 20',1,2,'2026-03-19 09:59:18','2026-03-19 09:59:18'),(1370,375,'C','October 1–October 15',0,3,'2026-03-19 09:59:18','2026-03-19 09:59:18'),(1371,375,'D','September 10–September 25',0,4,'2026-03-19 09:59:18','2026-03-19 09:59:18'),(1372,376,'A','8 AM',0,1,'2026-03-19 09:59:18','2026-03-19 09:59:18'),(1373,376,'B','9 AM',1,2,'2026-03-19 09:59:18','2026-03-19 09:59:18'),(1374,376,'C','10 AM',0,3,'2026-03-19 09:59:18','2026-03-19 09:59:18'),(1375,376,'D','11 AM',0,4,'2026-03-19 09:59:18','2026-03-19 09:59:18'),(1376,377,'A','Buy tickets online',1,1,'2026-03-19 09:59:18','2026-03-19 09:59:18'),(1377,377,'B','Bring cameras',0,2,'2026-03-19 09:59:18','2026-03-19 09:59:18'),(1378,377,'C','Join a tour guide',0,3,'2026-03-19 09:59:18','2026-03-19 09:59:18'),(1379,377,'D','Visit on weekends only',0,4,'2026-03-19 09:59:18','2026-03-19 09:59:18'),(1380,378,'A','The man is typing on a laptop.',1,1,'2026-03-25 08:14:31','2026-03-25 08:14:31'),(1381,378,'B','The man is fixing a machine.',0,2,'2026-03-25 08:14:31','2026-03-25 08:14:31'),(1382,378,'C','The man is carrying a box.',0,3,'2026-03-25 08:14:31','2026-03-25 08:14:31'),(1383,378,'D','The man is sitting beside a window.',0,4,'2026-03-25 08:14:31','2026-03-25 08:14:31'),(1384,379,'A','The chairs are stacked in a corner.',0,1,'2026-03-25 08:14:31','2026-03-25 08:14:31'),(1385,379,'B','The chairs are arranged around a table.',1,2,'2026-03-25 08:14:31','2026-03-25 08:14:31'),(1386,379,'C','The chairs are being cleaned.',0,3,'2026-03-25 08:14:31','2026-03-25 08:14:31'),(1387,379,'D','The chairs are broken.',0,4,'2026-03-25 08:14:31','2026-03-25 08:14:31'),(1388,380,'A','A woman is pouring coffee.',1,1,'2026-03-25 08:14:31','2026-03-25 08:14:31'),(1389,380,'B','A woman is opening a door.',0,2,'2026-03-25 08:14:31','2026-03-25 08:14:31'),(1390,380,'C','A woman is washing dishes.',0,3,'2026-03-25 08:14:31','2026-03-25 08:14:31'),(1391,380,'D','A woman is holding a phone.',0,4,'2026-03-25 08:14:31','2026-03-25 08:14:31'),(1392,381,'A','The road is crowded with cars.',1,1,'2026-03-25 08:14:31','2026-03-25 08:14:31'),(1393,381,'B','The road is under construction.',0,2,'2026-03-25 08:14:31','2026-03-25 08:14:31'),(1394,381,'C','The road is empty.',0,3,'2026-03-25 08:14:31','2026-03-25 08:14:31'),(1395,381,'D','The road is being cleaned.',0,4,'2026-03-25 08:14:31','2026-03-25 08:14:31'),(1396,382,'A','People are walking in a park.',1,1,'2026-03-25 08:14:31','2026-03-25 08:14:31'),(1397,382,'B','People are sitting in an office.',0,2,'2026-03-25 08:14:31','2026-03-25 08:14:31'),(1398,382,'C','People are swimming.',0,3,'2026-03-25 08:14:31','2026-03-25 08:14:31'),(1399,382,'D','People are working in a factory.',0,4,'2026-03-25 08:14:31','2026-03-25 08:14:31'),(1400,383,'A','A bicycle is leaning against a wall.',1,1,'2026-03-25 08:14:31','2026-03-25 08:14:31'),(1401,383,'B','A bicycle is being repaired.',0,2,'2026-03-25 08:14:31','2026-03-25 08:14:31'),(1402,383,'C','A bicycle is parked in a garage.',0,3,'2026-03-25 08:14:31','2026-03-25 08:14:31'),(1403,383,'D','A bicycle is on a road.',0,4,'2026-03-25 08:14:31','2026-03-25 08:14:31'),(1404,384,'A','Monthly',1,1,'2026-03-29 15:15:47','2026-03-29 15:15:47'),(1405,384,'B','Annual',0,2,'2026-03-29 15:15:47','2026-03-29 15:15:47'),(1406,384,'C','Student',0,3,'2026-03-29 15:15:47','2026-03-29 15:15:47'),(1407,384,'D','Trial',0,4,'2026-03-29 15:15:47','2026-03-29 15:15:47'),(1408,385,'A','$10',0,1,'2026-03-29 15:15:47','2026-03-29 15:15:47'),(1409,385,'B','$15',0,2,'2026-03-29 15:15:47','2026-03-29 15:15:47'),(1410,385,'C','$25',1,3,'2026-03-29 15:15:47','2026-03-29 15:15:47'),(1411,385,'D','$30',0,4,'2026-03-29 15:15:47','2026-03-29 15:15:47'),(1412,386,'A','Gym',0,1,'2026-03-29 15:15:47','2026-03-29 15:15:47'),(1413,386,'B','Swimming pool',1,2,'2026-03-29 15:15:47','2026-03-29 15:15:47'),(1414,386,'C','Sauna',0,3,'2026-03-29 15:15:47','2026-03-29 15:15:47'),(1415,386,'D','Yoga room',0,4,'2026-03-29 15:15:47','2026-03-29 15:15:47'),(1416,387,'A','Monday',1,1,'2026-03-29 15:15:47','2026-03-29 15:15:47'),(1417,387,'B','Tuesday',0,2,'2026-03-29 15:15:47','2026-03-29 15:15:47'),(1418,387,'C','Wednesday',0,3,'2026-03-29 15:15:47','2026-03-29 15:15:47'),(1419,387,'D','Friday',0,4,'2026-03-29 15:15:47','2026-03-29 15:15:47'),(1420,388,'A','5 a.m.',0,1,'2026-03-29 15:15:47','2026-03-29 15:15:47'),(1421,388,'B','6 a.m.',1,2,'2026-03-29 15:15:47','2026-03-29 15:15:47'),(1422,388,'C','7 a.m.',0,3,'2026-03-29 15:15:47','2026-03-29 15:15:47'),(1423,388,'D','8 a.m.',0,4,'2026-03-29 15:15:47','2026-03-29 15:15:47'),(1424,389,'A','Passport',0,1,'2026-03-29 15:15:47','2026-03-29 15:15:47'),(1425,389,'B','ID card',1,2,'2026-03-29 15:15:47','2026-03-29 15:15:47'),(1426,389,'C','Student card',0,3,'2026-03-29 15:15:47','2026-03-29 15:15:47'),(1427,389,'D','Driver license',0,4,'2026-03-29 15:15:47','2026-03-29 15:15:47'),(1428,390,'A','Boxing',0,1,'2026-03-29 15:15:47','2026-03-29 15:15:47'),(1429,390,'B','Yoga',1,2,'2026-03-29 15:15:47','2026-03-29 15:15:47'),(1430,390,'C','Dance',0,3,'2026-03-29 15:15:47','2026-03-29 15:15:47'),(1431,390,'D','Crossfit',0,4,'2026-03-29 15:15:47','2026-03-29 15:15:47'),(1432,391,'A','Basement',0,1,'2026-03-29 15:15:47','2026-03-29 15:15:47'),(1433,391,'B','First floor',0,2,'2026-03-29 15:15:47','2026-03-29 15:15:47'),(1434,391,'C','Second floor',1,3,'2026-03-29 15:15:47','2026-03-29 15:15:47'),(1435,391,'D','Third floor',0,4,'2026-03-29 15:15:47','2026-03-29 15:15:47'),(1436,392,'A','Family',0,1,'2026-03-29 15:15:47','2026-03-29 15:15:47'),(1437,392,'B','Senior',0,2,'2026-03-29 15:15:47','2026-03-29 15:15:47'),(1438,392,'C','Student',1,3,'2026-03-29 15:15:47','2026-03-29 15:15:47'),(1439,392,'D','Holiday',0,4,'2026-03-29 15:15:47','2026-03-29 15:15:47'),(1440,393,'A','Cash',0,1,'2026-03-29 15:15:47','2026-03-29 15:15:47'),(1441,393,'B','Credit card',1,2,'2026-03-29 15:15:47','2026-03-29 15:15:47'),(1442,393,'C','Bank transfer',0,3,'2026-03-29 15:15:47','2026-03-29 15:15:47'),(1443,393,'D','App payment',0,4,'2026-03-29 15:15:47','2026-03-29 15:15:47'),(1444,394,'A','1925',0,1,'2026-03-29 15:17:39','2026-03-29 15:17:39'),(1445,394,'B','1952',1,2,'2026-03-29 15:17:39','2026-03-29 15:17:39'),(1446,394,'C','1960',0,3,'2026-03-29 15:17:39','2026-03-29 15:17:39'),(1447,394,'D','1975',0,4,'2026-03-29 15:17:39','2026-03-29 15:17:39'),(1448,395,'A','Art',0,1,'2026-03-29 15:17:39','2026-03-29 15:17:39'),(1449,395,'B','Ancient history',1,2,'2026-03-29 15:17:39','2026-03-29 15:17:39'),(1450,395,'C','Science',0,3,'2026-03-29 15:17:39','2026-03-29 15:17:39'),(1451,395,'D','Photography',0,4,'2026-03-29 15:17:39','2026-03-29 15:17:39'),(1452,396,'A','Entrance',1,1,'2026-03-29 15:17:39','2026-03-29 15:17:39'),(1453,396,'B','Garden',0,2,'2026-03-29 15:17:39','2026-03-29 15:17:39'),(1454,396,'C','Roof',0,3,'2026-03-29 15:17:39','2026-03-29 15:17:39'),(1455,396,'D','Basement',0,4,'2026-03-29 15:17:39','2026-03-29 15:17:39'),(1456,397,'A','5 p.m.',0,1,'2026-03-29 15:17:39','2026-03-29 15:17:39'),(1457,397,'B','6 p.m.',1,2,'2026-03-29 15:17:39','2026-03-29 15:17:39'),(1458,397,'C','7 p.m.',0,3,'2026-03-29 15:17:39','2026-03-29 15:17:39'),(1459,397,'D','8 p.m.',0,4,'2026-03-29 15:17:39','2026-03-29 15:17:39'),(1460,398,'A','Camera',0,1,'2026-03-29 15:17:39','2026-03-29 15:17:39'),(1461,398,'B','Notebook',0,2,'2026-03-29 15:17:39','2026-03-29 15:17:39'),(1462,398,'C','Food',1,3,'2026-03-29 15:17:39','2026-03-29 15:17:39'),(1463,398,'D','Phone',0,4,'2026-03-29 15:17:39','2026-03-29 15:17:39'),(1464,399,'A','Sculpture',0,1,'2026-03-29 15:17:39','2026-03-29 15:17:39'),(1465,399,'B','Modern art',1,2,'2026-03-29 15:17:39','2026-03-29 15:17:39'),(1466,399,'C','Asian art',0,3,'2026-03-29 15:17:39','2026-03-29 15:17:39'),(1467,399,'D','Design',0,4,'2026-03-29 15:17:39','2026-03-29 15:17:39'),(1468,400,'A','30 min',0,1,'2026-03-29 15:17:39','2026-03-29 15:17:39'),(1469,400,'B','45 min',0,2,'2026-03-29 15:17:39','2026-03-29 15:17:39'),(1470,400,'C','60 min',1,3,'2026-03-29 15:17:39','2026-03-29 15:17:39'),(1471,400,'D','90 min',0,4,'2026-03-29 15:17:39','2026-03-29 15:17:39'),(1472,401,'A','First',0,1,'2026-03-29 15:17:39','2026-03-29 15:17:39'),(1473,401,'B','Second',0,2,'2026-03-29 15:17:39','2026-03-29 15:17:39'),(1474,401,'C','Third',1,3,'2026-03-29 15:17:39','2026-03-29 15:17:39'),(1475,401,'D','Fourth',0,4,'2026-03-29 15:17:39','2026-03-29 15:17:39'),(1476,402,'A','Teacher',0,1,'2026-03-29 15:17:39','2026-03-29 15:17:39'),(1477,402,'B','Student',1,2,'2026-03-29 15:17:39','2026-03-29 15:17:39'),(1478,402,'C','Family',0,3,'2026-03-29 15:17:39','2026-03-29 15:17:39'),(1479,402,'D','Child',0,4,'2026-03-29 15:17:39','2026-03-29 15:17:39'),(1480,403,'A','Café',0,1,'2026-03-29 15:17:39','2026-03-29 15:17:39'),(1481,403,'B','Gift shop',1,2,'2026-03-29 15:17:39','2026-03-29 15:17:39'),(1482,403,'C','Ticket desk',0,3,'2026-03-29 15:17:39','2026-03-29 15:17:39'),(1483,403,'D','Gallery',0,4,'2026-03-29 15:17:39','2026-03-29 15:17:39'),(1484,404,'A','City transport',0,1,'2026-03-29 15:19:32','2026-03-29 15:19:32'),(1485,404,'B','Urban farming',1,2,'2026-03-29 15:19:32','2026-03-29 15:19:32'),(1486,404,'C','Pollution',0,3,'2026-03-29 15:19:32','2026-03-29 15:19:32'),(1487,404,'D','Tourism',0,4,'2026-03-29 15:19:32','2026-03-29 15:19:32'),(1488,405,'A','Rooftops',1,1,'2026-03-29 15:19:32','2026-03-29 15:19:32'),(1489,405,'B','Streets',0,2,'2026-03-29 15:19:32','2026-03-29 15:19:32'),(1490,405,'C','Rivers',0,3,'2026-03-29 15:19:32','2026-03-29 15:19:32'),(1491,405,'D','Offices',0,4,'2026-03-29 15:19:32','2026-03-29 15:19:32'),(1492,406,'A','Cheap houses',0,1,'2026-03-29 15:19:32','2026-03-29 15:19:32'),(1493,406,'B','Fresh food',1,2,'2026-03-29 15:19:32','2026-03-29 15:19:32'),(1494,406,'C','Job creation',0,3,'2026-03-29 15:19:32','2026-03-29 15:19:32'),(1495,406,'D','Tourism',0,4,'2026-03-29 15:19:32','2026-03-29 15:19:32'),(1496,407,'A','Transport',0,1,'2026-03-29 15:19:32','2026-03-29 15:19:32'),(1497,407,'B','Community',1,2,'2026-03-29 15:19:32','2026-03-29 15:19:32'),(1498,407,'C','Business',0,3,'2026-03-29 15:19:32','2026-03-29 15:19:32'),(1499,407,'D','Government',0,4,'2026-03-29 15:19:32','2026-03-29 15:19:32'),(1500,408,'A','Villages',0,1,'2026-03-29 15:19:32','2026-03-29 15:19:32'),(1501,408,'B','Large cities',1,2,'2026-03-29 15:19:32','2026-03-29 15:19:32'),(1502,408,'C','Deserts',0,3,'2026-03-29 15:19:32','2026-03-29 15:19:32'),(1503,408,'D','Islands',0,4,'2026-03-29 15:19:32','2026-03-29 15:19:32');
/*!40000 ALTER TABLE `question_options` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `questions`
--

DROP TABLE IF EXISTS `questions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `questions` (
  `question_id` int NOT NULL AUTO_INCREMENT,
  `question_content` text NOT NULL,
  `explanation` text,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  `question_type` enum('listening_photographs','listening_question_response','listening_conversation','listening_talk','reading_incomplete_sentences','reading_text_completion','reading_reading_comprehension','reading_matching_headings','reading_true_false_not_given','reading_multiple_choice','reading_matching_information','reading_sentence_completion','reading_summary_completion','reading_short_answer','writing_task_1','writing_task_2','speaking_part_1','speaking_part_2','speaking_part_3','grammar','vocabulary') NOT NULL,
  PRIMARY KEY (`question_id`)
) ENGINE=InnoDB AUTO_INCREMENT=418 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `questions`
--

LOCK TABLES `questions` WRITE;
/*!40000 ALTER TABLE `questions` DISABLE KEYS */;
INSERT INTO `questions` VALUES (1,'zxcvzxcv','sdfgsdfgsdfg','2026-02-06 09:51:18','2026-02-06 09:51:18','listening_photographs'),(2,'1. ','zxcvzxcvzxcv','2026-02-06 09:58:02','2026-02-06 09:58:02','listening_photographs'),(3,'1. ','zxcvzxcvzxcv','2026-02-06 10:05:17','2026-02-06 10:05:17','listening_photographs'),(4,'Q1','ádfasdfasdfasdf','2026-03-17 09:53:44','2026-03-17 09:53:44','listening_photographs'),(5,'Look at the picture and choose the best description.','The man is typing on a laptop while sitting at a desk.','2026-03-17 11:25:52','2026-03-17 11:25:52','listening_photographs'),(6,'Look at the picture and choose the best description.','The chairs are placed around a table in a meeting room.','2026-03-17 11:25:52','2026-03-17 11:25:52','listening_photographs'),(7,'Look at the picture and choose the best description.','The woman is pouring coffee into a cup.','2026-03-17 11:25:52','2026-03-17 11:25:52','listening_photographs'),(8,'Look at the picture and choose the best description.','The road has many cars driving along it.','2026-03-17 11:25:52','2026-03-17 11:25:52','listening_photographs'),(9,'Look at the picture and choose the best description.','People are walking along a path in a park.','2026-03-17 11:25:52','2026-03-17 11:25:52','listening_photographs'),(10,'Look at the picture and choose the best description.','A bicycle is leaning against a wall.','2026-03-17 11:25:52','2026-03-17 11:25:52','listening_photographs'),(11,'Mark your answer based on what you hear.','The correct response indicates the location of the bank.','2026-03-17 14:20:43','2026-03-17 14:20:43','listening_photographs'),(12,'Mark your answer based on what you hear.','The response identifies the person responsible for the project.','2026-03-17 14:20:43','2026-03-17 14:20:43','listening_photographs'),(13,'Mark your answer based on what you hear.','The correct answer provides a time.','2026-03-17 14:20:43','2026-03-17 14:20:43','listening_photographs'),(14,'Mark your answer based on what you hear.','The response explains the reason for the delay.','2026-03-17 14:20:43','2026-03-17 14:20:43','listening_photographs'),(15,'Mark your answer based on what you hear.','The correct answer describes frequency.','2026-03-17 14:20:43','2026-03-17 14:20:43','listening_photographs'),(16,'Mark your answer based on what you hear.','The correct response gives the opening time.','2026-03-17 14:20:43','2026-03-17 14:20:43','listening_photographs'),(17,'Mark your answer based on what you hear.','The response specifies the type of report.','2026-03-17 14:20:43','2026-03-17 14:20:43','listening_photographs'),(18,'Mark your answer based on what you hear.','The correct answer agrees to help.','2026-03-17 14:20:43','2026-03-17 14:20:43','listening_photographs'),(19,'Mark your answer based on what you hear.','The response confirms completion.','2026-03-17 14:20:43','2026-03-17 14:20:43','listening_photographs'),(20,'Mark your answer based on what you hear.','The correct answer mentions a place.','2026-03-17 14:20:43','2026-03-17 14:20:43','listening_photographs'),(21,'Mark your answer based on what you hear.','The response gives a reason.','2026-03-17 14:20:43','2026-03-17 14:20:43','listening_photographs'),(22,'Mark your answer based on what you hear.','The response identifies a person.','2026-03-17 14:20:43','2026-03-17 14:20:43','listening_photographs'),(23,'Mark your answer based on what you hear.','The response describes a current activity.','2026-03-17 14:20:43','2026-03-17 14:20:43','listening_photographs'),(24,'Mark your answer based on what you hear.','The correct response gives a price.','2026-03-17 14:20:43','2026-03-17 14:20:43','listening_photographs'),(25,'Mark your answer based on what you hear.','The response provides a date or month.','2026-03-17 14:20:43','2026-03-17 14:20:43','listening_photographs'),(26,'Mark your answer based on what you hear.','The correct response tells the location.','2026-03-17 14:20:43','2026-03-17 14:20:43','listening_photographs'),(27,'Mark your answer based on what you hear.','The response explains the reason.','2026-03-17 14:20:43','2026-03-17 14:20:43','listening_photographs'),(28,'Mark your answer based on what you hear.','The correct response identifies the person.','2026-03-17 14:20:43','2026-03-17 14:20:43','listening_photographs'),(29,'Mark your answer based on what you hear.','The response mentions food.','2026-03-17 14:20:43','2026-03-17 14:20:43','listening_photographs'),(30,'Mark your answer based on what you hear.','The response indicates duration.','2026-03-17 14:20:43','2026-03-17 14:20:43','listening_photographs'),(31,'Mark your answer based on what you hear.','The response confirms the action.','2026-03-17 14:20:43','2026-03-17 14:20:43','listening_photographs'),(32,'Mark your answer based on what you hear.','The correct response suggests a place.','2026-03-17 14:20:43','2026-03-17 14:20:43','listening_photographs'),(33,'Mark your answer based on what you hear.','The response gives a reason.','2026-03-17 14:20:43','2026-03-17 14:20:43','listening_photographs'),(34,'Mark your answer based on what you hear.','The correct response identifies participants.','2026-03-17 14:20:43','2026-03-17 14:20:43','listening_photographs'),(35,'Mark your answer based on what you hear.','The response gives a year.','2026-03-17 14:20:43','2026-03-17 14:20:43','listening_photographs'),(36,'Mark your answer based on what you hear.','The correct response indicates the location of the bank.','2026-03-17 14:38:10','2026-03-17 14:38:10','listening_photographs'),(37,'Mark your answer based on what you hear.','The response identifies the person responsible for the project.','2026-03-17 14:38:10','2026-03-17 14:38:10','listening_photographs'),(38,'Mark your answer based on what you hear.','The correct answer provides a time.','2026-03-17 14:38:10','2026-03-17 14:38:10','listening_photographs'),(39,'Mark your answer based on what you hear.','The response explains the reason for the delay.','2026-03-17 14:38:10','2026-03-17 14:38:10','listening_photographs'),(40,'Mark your answer based on what you hear.','The correct answer describes frequency.','2026-03-17 14:38:10','2026-03-17 14:38:10','listening_photographs'),(41,'Mark your answer based on what you hear.','The correct response gives the opening time.','2026-03-17 14:38:10','2026-03-17 14:38:10','listening_photographs'),(42,'Mark your answer based on what you hear.','The response specifies the type of report.','2026-03-17 14:38:10','2026-03-17 14:38:10','listening_photographs'),(43,'Mark your answer based on what you hear.','The correct answer agrees to help.','2026-03-17 14:38:10','2026-03-17 14:38:10','listening_photographs'),(44,'Mark your answer based on what you hear.','The response confirms completion.','2026-03-17 14:38:10','2026-03-17 14:38:10','listening_photographs'),(45,'Mark your answer based on what you hear.','The correct answer mentions a place.','2026-03-17 14:38:10','2026-03-17 14:38:10','listening_photographs'),(46,'Mark your answer based on what you hear.','The response gives a reason.','2026-03-17 14:38:10','2026-03-17 14:38:10','listening_photographs'),(47,'Mark your answer based on what you hear.','The response identifies a person.','2026-03-17 14:38:10','2026-03-17 14:38:10','listening_photographs'),(48,'Mark your answer based on what you hear.','The response describes a current activity.','2026-03-17 14:38:10','2026-03-17 14:38:10','listening_photographs'),(49,'Mark your answer based on what you hear.','The correct response gives a price.','2026-03-17 14:38:10','2026-03-17 14:38:10','listening_photographs'),(50,'Mark your answer based on what you hear.','The response provides a date or month.','2026-03-17 14:38:10','2026-03-17 14:38:10','listening_photographs'),(51,'Mark your answer based on what you hear.','The correct response tells the location.','2026-03-17 14:38:10','2026-03-17 14:38:10','listening_photographs'),(52,'Mark your answer based on what you hear.','The response explains the reason.','2026-03-17 14:38:10','2026-03-17 14:38:10','listening_photographs'),(53,'Mark your answer based on what you hear.','The correct response identifies the person.','2026-03-17 14:38:10','2026-03-17 14:38:10','listening_photographs'),(54,'Mark your answer based on what you hear.','The response mentions food.','2026-03-17 14:38:10','2026-03-17 14:38:10','listening_photographs'),(55,'Mark your answer based on what you hear.','The response indicates duration.','2026-03-17 14:38:10','2026-03-17 14:38:10','listening_photographs'),(56,'Mark your answer based on what you hear.','The response confirms the action.','2026-03-17 14:38:10','2026-03-17 14:38:10','listening_photographs'),(57,'Mark your answer based on what you hear.','The correct response suggests a place.','2026-03-17 14:38:10','2026-03-17 14:38:10','listening_photographs'),(58,'Mark your answer based on what you hear.','The response gives a reason.','2026-03-17 14:38:10','2026-03-17 14:38:10','listening_photographs'),(59,'Mark your answer based on what you hear.','The correct response identifies participants.','2026-03-17 14:38:10','2026-03-17 14:38:10','listening_photographs'),(60,'Mark your answer based on what you hear.','The response gives a year.','2026-03-17 14:38:10','2026-03-17 14:38:10','listening_photographs'),(61,'What are the speakers mainly discussing?','The speakers are discussing a delayed delivery order.','2026-03-17 14:42:11','2026-03-17 14:42:11','listening_photographs'),(62,'What problem is mentioned?','The shipment has not arrived on time.','2026-03-17 14:42:11','2026-03-17 14:42:11','listening_photographs'),(63,'What will the man probably do next?','He plans to call the supplier to check the delivery status.','2026-03-17 14:42:11','2026-03-17 14:42:11','listening_photographs'),(64,'Where most likely are the speakers?','They are discussing office equipment in a workplace.','2026-03-17 14:42:11','2026-03-17 14:42:11','listening_photographs'),(65,'What does the woman ask the man to do?','She asks him to print a report.','2026-03-17 14:42:11','2026-03-17 14:42:11','listening_photographs'),(66,'Why does the man hesitate?','The printer may not have enough ink.','2026-03-17 14:42:11','2026-03-17 14:42:11','listening_photographs'),(67,'What are the speakers mainly talking about?','They are planning a business trip.','2026-03-17 14:42:11','2026-03-17 14:42:11','listening_photographs'),(68,'When will the trip take place?','The trip will occur next Monday.','2026-03-17 14:42:11','2026-03-17 14:42:11','listening_photographs'),(69,'What does the woman suggest?','She suggests booking the tickets early.','2026-03-17 14:42:11','2026-03-17 14:42:11','listening_photographs'),(70,'What is the conversation mainly about?','The speakers are discussing a meeting schedule.','2026-03-17 14:42:11','2026-03-17 14:42:11','listening_photographs'),(71,'Why is the meeting being moved?','The manager is unavailable at the original time.','2026-03-17 14:42:11','2026-03-17 14:42:11','listening_photographs'),(72,'What will the woman do?','She will inform the rest of the team about the change.','2026-03-17 14:42:11','2026-03-17 14:42:11','listening_photographs'),(73,'What are the speakers discussing?','They are discussing a job application.','2026-03-17 14:42:11','2026-03-17 14:42:11','listening_photographs'),(74,'What does the woman say about the candidate?','The candidate has strong experience.','2026-03-17 14:42:11','2026-03-17 14:42:11','listening_photographs'),(75,'What will the man probably do next?','He plans to schedule an interview.','2026-03-17 14:42:11','2026-03-17 14:42:11','listening_photographs'),(76,'What are the speakers mainly talking about?','They are discussing a restaurant reservation.','2026-03-17 14:42:11','2026-03-17 14:42:11','listening_photographs'),(77,'How many people will attend?','The reservation is for six people.','2026-03-17 14:42:11','2026-03-17 14:42:11','listening_photographs'),(78,'What does the man suggest?','He suggests arriving earlier.','2026-03-17 14:42:11','2026-03-17 14:42:11','listening_photographs'),(79,'What problem are the speakers discussing?','A computer software issue is causing delays.','2026-03-17 14:42:11','2026-03-17 14:42:11','listening_photographs'),(80,'What does the woman recommend?','She recommends updating the software.','2026-03-17 14:42:11','2026-03-17 14:42:11','listening_photographs'),(81,'What will the man probably do next?','He will contact the IT department.','2026-03-17 14:42:11','2026-03-17 14:42:11','listening_photographs'),(82,'What are the speakers mainly discussing?','They are discussing a training workshop.','2026-03-17 14:42:11','2026-03-17 14:42:11','listening_photographs'),(83,'When will the workshop take place?','It is scheduled for Friday afternoon.','2026-03-17 14:42:11','2026-03-17 14:42:11','listening_photographs'),(84,'What does the woman offer to do?','She offers to prepare the presentation slides.','2026-03-17 14:42:11','2026-03-17 14:42:11','listening_photographs'),(85,'What are the speakers talking about?','They are discussing a shipment order.','2026-03-17 14:42:11','2026-03-17 14:42:11','listening_photographs'),(86,'Why is the order urgent?','The customer needs it by tomorrow.','2026-03-17 14:42:11','2026-03-17 14:42:11','listening_photographs'),(87,'What will the man do?','He will arrange express delivery.','2026-03-17 14:42:11','2026-03-17 14:42:11','listening_photographs'),(88,'What are the speakers discussing?','They are planning a company event.','2026-03-17 14:42:11','2026-03-17 14:42:11','listening_photographs'),(89,'Where will the event be held?','It will be held at a hotel ballroom.','2026-03-17 14:42:11','2026-03-17 14:42:11','listening_photographs'),(90,'What does the woman suggest?','She suggests hiring a professional host.','2026-03-17 14:42:11','2026-03-17 14:42:11','listening_photographs'),(91,'What are the speakers mainly discussing?','They are reviewing sales results.','2026-03-17 14:42:11','2026-03-17 14:42:11','listening_photographs'),(92,'What surprised the woman?','Sales increased significantly last month.','2026-03-17 14:42:11','2026-03-17 14:42:11','listening_photographs'),(93,'What will they do next?','They will prepare a report for management.','2026-03-17 14:42:11','2026-03-17 14:42:11','listening_photographs'),(94,'What are the speakers discussing?','They are discussing office renovations.','2026-03-17 14:42:11','2026-03-17 14:42:11','listening_photographs'),(95,'Why is the renovation necessary?','The office space is outdated.','2026-03-17 14:42:11','2026-03-17 14:42:11','listening_photographs'),(96,'What will the man do next?','He will contact a contractor.','2026-03-17 14:42:11','2026-03-17 14:42:11','listening_photographs'),(97,'What are the speakers mainly discussing?','They are discussing a product launch.','2026-03-17 14:42:11','2026-03-17 14:42:11','listening_photographs'),(98,'When will the launch happen?','It is planned for next month.','2026-03-17 14:42:11','2026-03-17 14:42:11','listening_photographs'),(99,'What will the woman prepare?','She will prepare promotional materials.','2026-03-17 14:42:11','2026-03-17 14:42:11','listening_photographs'),(100,'What is the purpose of the announcement?','The talk announces a change in train schedules.','2026-03-17 14:49:17','2026-03-17 14:49:17','listening_photographs'),(101,'Who is the announcement for?','The announcement is intended for train passengers.','2026-03-17 14:49:17','2026-03-17 14:49:17','listening_photographs'),(102,'What are passengers asked to do?','Passengers are asked to check the updated schedule board.','2026-03-17 14:49:17','2026-03-17 14:49:17','listening_photographs'),(103,'What is the purpose of the message?','The speaker is promoting a new product.','2026-03-17 14:49:17','2026-03-17 14:49:17','listening_photographs'),(104,'What feature of the product is mentioned?','The product has improved battery life.','2026-03-17 14:49:17','2026-03-17 14:49:17','listening_photographs'),(105,'Where can listeners learn more?','The speaker directs listeners to the company website.','2026-03-17 14:49:17','2026-03-17 14:49:17','listening_photographs'),(106,'What is the talk mainly about?','The speaker is describing a conference schedule.','2026-03-17 14:49:17','2026-03-17 14:49:17','listening_photographs'),(107,'When will the keynote speech begin?','The keynote speech starts at 10 a.m.','2026-03-17 14:49:17','2026-03-17 14:49:17','listening_photographs'),(108,'What are attendees encouraged to do?','They are encouraged to visit the exhibition hall.','2026-03-17 14:49:17','2026-03-17 14:49:17','listening_photographs'),(109,'What is the announcement about?','The talk is about a store promotion.','2026-03-17 14:49:17','2026-03-17 14:49:17','listening_photographs'),(110,'How long will the promotion last?','The promotion will last for one week.','2026-03-17 14:49:17','2026-03-17 14:49:17','listening_photographs'),(111,'What item is discounted?','Clothing items are discounted.','2026-03-17 14:49:17','2026-03-17 14:49:17','listening_photographs'),(112,'What is the report mainly about?','The report describes monthly sales performance.','2026-03-17 14:49:17','2026-03-17 14:49:17','listening_photographs'),(113,'Which department performed best?','The marketing department performed best.','2026-03-17 14:49:17','2026-03-17 14:49:17','listening_photographs'),(114,'What will happen next?','A detailed report will be sent to management.','2026-03-17 14:49:17','2026-03-17 14:49:17','listening_photographs'),(115,'What is the purpose of the talk?','The talk provides instructions for a building evacuation.','2026-03-17 14:49:17','2026-03-17 14:49:17','listening_photographs'),(116,'Where should employees gather?','Employees should gather in the parking lot.','2026-03-17 14:49:17','2026-03-17 14:49:17','listening_photographs'),(117,'Who should employees contact for help?','Employees should contact the safety officer.','2026-03-17 14:49:17','2026-03-17 14:49:17','listening_photographs'),(118,'What is the talk mainly about?','The talk introduces a museum exhibit.','2026-03-17 14:49:17','2026-03-17 14:49:17','listening_photographs'),(119,'What type of exhibit is mentioned?','The exhibit features ancient artifacts.','2026-03-17 14:49:17','2026-03-17 14:49:17','listening_photographs'),(120,'How long will the exhibit run?','The exhibit will run for three months.','2026-03-17 14:49:17','2026-03-17 14:49:17','listening_photographs'),(121,'What is the purpose of the message?','The message reminds employees about a deadline.','2026-03-17 14:49:17','2026-03-17 14:49:17','listening_photographs'),(122,'What must employees submit?','Employees must submit their expense reports.','2026-03-17 14:49:17','2026-03-17 14:49:17','listening_photographs'),(123,'When is the deadline?','The deadline is Friday afternoon.','2026-03-17 14:49:17','2026-03-17 14:49:17','listening_photographs'),(124,'What is the talk mainly about?','The talk advertises a language course.','2026-03-17 14:49:17','2026-03-17 14:49:17','listening_photographs'),(125,'Who is the course intended for?','The course is intended for beginners.','2026-03-17 14:49:17','2026-03-17 14:49:17','listening_photographs'),(126,'What benefit is mentioned?','Students will receive personalized instruction.','2026-03-17 14:49:17','2026-03-17 14:49:17','listening_photographs'),(127,'What is the purpose of the announcement?','The speaker announces a flight boarding process.','2026-03-17 14:49:17','2026-03-17 14:49:17','listening_photographs'),(128,'Which passengers board first?','Passengers in business class board first.','2026-03-17 14:49:17','2026-03-17 14:49:17','listening_photographs'),(129,'What should passengers prepare?','Passengers should prepare their boarding passes.','2026-03-17 14:49:17','2026-03-17 14:49:17','listening_photographs'),(130,'Look at the picture and choose the best description.','The man is typing on a laptop while sitting at a desk.','2026-03-18 07:30:02','2026-03-18 07:30:02','listening_photographs'),(131,'Look at the picture and choose the best description.','The chairs are placed around a table in a meeting room.','2026-03-18 07:30:02','2026-03-18 07:30:02','listening_photographs'),(132,'Look at the picture and choose the best description.','The woman is pouring coffee into a cup.','2026-03-18 07:30:02','2026-03-18 07:30:02','listening_photographs'),(133,'Look at the picture and choose the best description.','The road has many cars driving along it.','2026-03-18 07:30:02','2026-03-18 07:30:02','listening_photographs'),(134,'Look at the picture and choose the best description.','People are walking along a path in a park.','2026-03-18 07:30:02','2026-03-18 07:30:02','listening_photographs'),(135,'Look at the picture and choose the best description.','A bicycle is leaning against a wall.','2026-03-18 07:30:02','2026-03-18 07:30:02','listening_photographs'),(136,'Mark your answer based on what you hear.','The correct response indicates the location of the bank.','2026-03-18 07:32:20','2026-03-18 07:32:20','listening_photographs'),(137,'Mark your answer based on what you hear.','The response identifies the person responsible for the project.','2026-03-18 07:32:20','2026-03-18 07:32:20','listening_photographs'),(138,'Mark your answer based on what you hear.','The correct answer provides a time.','2026-03-18 07:32:20','2026-03-18 07:32:20','listening_photographs'),(139,'Mark your answer based on what you hear.','The response explains the reason for the delay.','2026-03-18 07:32:20','2026-03-18 07:32:20','listening_photographs'),(140,'Mark your answer based on what you hear.','The correct answer describes frequency.','2026-03-18 07:32:20','2026-03-18 07:32:20','listening_photographs'),(141,'Mark your answer based on what you hear.','The correct response gives the opening time.','2026-03-18 07:32:20','2026-03-18 07:32:20','listening_photographs'),(142,'Mark your answer based on what you hear.','The response specifies the type of report.','2026-03-18 07:32:20','2026-03-18 07:32:20','listening_photographs'),(143,'Mark your answer based on what you hear.','The correct answer agrees to help.','2026-03-18 07:32:20','2026-03-18 07:32:20','listening_photographs'),(144,'Mark your answer based on what you hear.','The response confirms completion.','2026-03-18 07:32:20','2026-03-18 07:32:20','listening_photographs'),(145,'Mark your answer based on what you hear.','The correct answer mentions a place.','2026-03-18 07:32:20','2026-03-18 07:32:20','listening_photographs'),(146,'Mark your answer based on what you hear.','The response gives a reason.','2026-03-18 07:32:20','2026-03-18 07:32:20','listening_photographs'),(147,'Mark your answer based on what you hear.','The response identifies a person.','2026-03-18 07:32:20','2026-03-18 07:32:20','listening_photographs'),(148,'Mark your answer based on what you hear.','The response describes a current activity.','2026-03-18 07:32:20','2026-03-18 07:32:20','listening_photographs'),(149,'Mark your answer based on what you hear.','The correct response gives a price.','2026-03-18 07:32:20','2026-03-18 07:32:20','listening_photographs'),(150,'Mark your answer based on what you hear.','The response provides a date or month.','2026-03-18 07:32:20','2026-03-18 07:32:20','listening_photographs'),(151,'Mark your answer based on what you hear.','The correct response tells the location.','2026-03-18 07:32:20','2026-03-18 07:32:20','listening_photographs'),(152,'Mark your answer based on what you hear.','The response explains the reason.','2026-03-18 07:32:20','2026-03-18 07:32:20','listening_photographs'),(153,'Mark your answer based on what you hear.','The correct response identifies the person.','2026-03-18 07:32:20','2026-03-18 07:32:20','listening_photographs'),(154,'Mark your answer based on what you hear.','The response mentions food.','2026-03-18 07:32:20','2026-03-18 07:32:20','listening_photographs'),(155,'Mark your answer based on what you hear.','The response indicates duration.','2026-03-18 07:32:20','2026-03-18 07:32:20','listening_photographs'),(156,'Mark your answer based on what you hear.','The response confirms the action.','2026-03-18 07:32:20','2026-03-18 07:32:20','listening_photographs'),(157,'Mark your answer based on what you hear.','The correct response suggests a place.','2026-03-18 07:32:20','2026-03-18 07:32:20','listening_photographs'),(158,'Mark your answer based on what you hear.','The response gives a reason.','2026-03-18 07:32:20','2026-03-18 07:32:20','listening_photographs'),(159,'Mark your answer based on what you hear.','The correct response identifies participants.','2026-03-18 07:32:20','2026-03-18 07:32:20','listening_photographs'),(160,'Mark your answer based on what you hear.','The response gives a year.','2026-03-18 07:32:20','2026-03-18 07:32:20','listening_photographs'),(161,'What are the speakers mainly discussing?','The speakers are discussing a delayed delivery order.','2026-03-18 07:40:24','2026-03-18 07:40:24','listening_photographs'),(162,'What problem is mentioned?','The shipment has not arrived on time.','2026-03-18 07:40:24','2026-03-18 07:40:24','listening_photographs'),(163,'What will the man probably do next?','He plans to call the supplier to check the delivery status.','2026-03-18 07:40:24','2026-03-18 07:40:24','listening_photographs'),(164,'What does the woman say about the candidate?','The candidate has strong experience.','2026-03-18 07:40:55','2026-03-18 07:40:55','listening_photographs'),(165,'What will the man probably do next?','He plans to schedule an interview.','2026-03-18 07:40:55','2026-03-18 07:40:55','listening_photographs'),(166,'What are the speakers mainly talking about?','They are discussing a restaurant reservation.','2026-03-18 07:40:55','2026-03-18 07:40:55','listening_photographs'),(167,'What does the woman say about the candidate?','The candidate has strong experience.','2026-03-18 08:04:01','2026-03-18 08:04:01','listening_photographs'),(168,'What will the man probably do next?','He plans to schedule an interview.','2026-03-18 08:04:01','2026-03-18 08:04:01','listening_photographs'),(169,'What are the speakers mainly talking about?','They are discussing a restaurant reservation.','2026-03-18 08:04:01','2026-03-18 08:04:01','listening_photographs'),(170,'Look at the picture and choose the best description.','The man is typing on a laptop while sitting at a desk.','2026-03-18 08:07:07','2026-03-18 08:07:07','listening_photographs'),(171,'Look at the picture and choose the best description.','The chairs are placed around a table in a meeting room.','2026-03-18 08:07:07','2026-03-18 08:07:07','listening_photographs'),(172,'Look at the picture and choose the best description.','The woman is pouring coffee into a cup.','2026-03-18 08:07:07','2026-03-18 08:07:07','listening_photographs'),(173,'Look at the picture and choose the best description.','The road has many cars driving along it.','2026-03-18 08:07:07','2026-03-18 08:07:07','listening_photographs'),(174,'Look at the picture and choose the best description.','People are walking along a path in a park.','2026-03-18 08:07:07','2026-03-18 08:07:07','listening_photographs'),(175,'Look at the picture and choose the best description.','A bicycle is leaning against a wall.','2026-03-18 08:07:07','2026-03-18 08:07:07','listening_photographs'),(176,'Mark your answer based on what you hear.','The correct response indicates the location of the bank.','2026-03-18 08:08:09','2026-03-18 08:08:09','listening_photographs'),(177,'Mark your answer based on what you hear.','The response identifies the person responsible for the project.','2026-03-18 08:08:09','2026-03-18 08:08:09','listening_photographs'),(178,'Mark your answer based on what you hear.','The correct answer provides a time.','2026-03-18 08:08:09','2026-03-18 08:08:09','listening_photographs'),(179,'Mark your answer based on what you hear.','The response explains the reason for the delay.','2026-03-18 08:08:09','2026-03-18 08:08:09','listening_photographs'),(180,'Mark your answer based on what you hear.','The correct answer describes frequency.','2026-03-18 08:08:09','2026-03-18 08:08:09','listening_photographs'),(181,'Mark your answer based on what you hear.','The correct response gives the opening time.','2026-03-18 08:08:09','2026-03-18 08:08:09','listening_photographs'),(182,'Mark your answer based on what you hear.','The response specifies the type of report.','2026-03-18 08:08:09','2026-03-18 08:08:09','listening_photographs'),(183,'Mark your answer based on what you hear.','The correct answer agrees to help.','2026-03-18 08:08:09','2026-03-18 08:08:09','listening_photographs'),(184,'Mark your answer based on what you hear.','The response confirms completion.','2026-03-18 08:08:09','2026-03-18 08:08:09','listening_photographs'),(185,'Mark your answer based on what you hear.','The correct answer mentions a place.','2026-03-18 08:08:09','2026-03-18 08:08:09','listening_photographs'),(186,'Mark your answer based on what you hear.','The response gives a reason.','2026-03-18 08:08:09','2026-03-18 08:08:09','listening_photographs'),(187,'Mark your answer based on what you hear.','The response identifies a person.','2026-03-18 08:08:09','2026-03-18 08:08:09','listening_photographs'),(188,'Mark your answer based on what you hear.','The response describes a current activity.','2026-03-18 08:08:09','2026-03-18 08:08:09','listening_photographs'),(189,'Mark your answer based on what you hear.','The correct response gives a price.','2026-03-18 08:08:09','2026-03-18 08:08:09','listening_photographs'),(190,'Mark your answer based on what you hear.','The response provides a date or month.','2026-03-18 08:08:09','2026-03-18 08:08:09','listening_photographs'),(191,'Mark your answer based on what you hear.','The correct response tells the location.','2026-03-18 08:08:09','2026-03-18 08:08:09','listening_photographs'),(192,'Mark your answer based on what you hear.','The response explains the reason.','2026-03-18 08:08:09','2026-03-18 08:08:09','listening_photographs'),(193,'Mark your answer based on what you hear.','The correct response identifies the person.','2026-03-18 08:08:09','2026-03-18 08:08:09','listening_photographs'),(194,'Mark your answer based on what you hear.','The response mentions food.','2026-03-18 08:08:09','2026-03-18 08:08:09','listening_photographs'),(195,'Mark your answer based on what you hear.','The response indicates duration.','2026-03-18 08:08:09','2026-03-18 08:08:09','listening_photographs'),(196,'Mark your answer based on what you hear.','The response confirms the action.','2026-03-18 08:08:09','2026-03-18 08:08:09','listening_photographs'),(197,'Mark your answer based on what you hear.','The correct response suggests a place.','2026-03-18 08:08:09','2026-03-18 08:08:09','listening_photographs'),(198,'Mark your answer based on what you hear.','The response gives a reason.','2026-03-18 08:08:09','2026-03-18 08:08:09','listening_photographs'),(199,'Mark your answer based on what you hear.','The correct response identifies participants.','2026-03-18 08:08:09','2026-03-18 08:08:09','listening_photographs'),(200,'Mark your answer based on what you hear.','The response gives a year.','2026-03-18 08:08:10','2026-03-18 08:08:10','listening_photographs'),(201,'What are the speakers mainly discussing?','The speakers are discussing a delayed delivery order.','2026-03-18 08:44:44','2026-03-18 08:44:44','listening_photographs'),(202,'What problem is mentioned?','The shipment has not arrived on time.','2026-03-18 08:44:44','2026-03-18 08:44:44','listening_photographs'),(203,'What will the man probably do next?','He plans to call the supplier to check the delivery status.','2026-03-18 08:44:44','2026-03-18 08:44:44','listening_photographs'),(204,'Where most likely are the speakers?','They are discussing office equipment in a workplace.','2026-03-18 08:45:06','2026-03-18 08:45:06','listening_photographs'),(205,'What does the woman ask the man to do?','She asks him to print a report.','2026-03-18 08:45:06','2026-03-18 08:45:06','listening_photographs'),(206,'Why does the man hesitate?','The printer may not have enough ink.','2026-03-18 08:45:06','2026-03-18 08:45:06','listening_photographs'),(207,'Where most likely are the speakers?','They are discussing office equipment in a workplace.','2026-03-18 08:48:18','2026-03-18 08:48:18','listening_photographs'),(208,'What does the woman ask the man to do?','She asks him to print a report.','2026-03-18 08:48:18','2026-03-18 08:48:18','listening_photographs'),(209,'Why does the man hesitate?','The printer may not have enough ink.','2026-03-18 08:48:18','2026-03-18 08:48:18','listening_photographs'),(210,'What is the purpose of the announcement?','The talk announces a change in train schedules.','2026-03-18 08:53:51','2026-03-18 08:53:51','listening_photographs'),(211,'Who is the announcement for?','The announcement is intended for train passengers.','2026-03-18 08:53:51','2026-03-18 08:53:51','listening_photographs'),(212,'What are passengers asked to do?','Passengers are asked to check the updated schedule board.','2026-03-18 08:53:51','2026-03-18 08:53:51','listening_photographs'),(213,'What is the purpose of the message?','The speaker is promoting a new product.','2026-03-18 08:54:25','2026-03-18 08:54:25','listening_photographs'),(214,'What feature of the product is mentioned?','The product has improved battery life.','2026-03-18 08:54:25','2026-03-18 08:54:25','listening_photographs'),(215,'Where can listeners learn more?','The speaker directs listeners to the company website.','2026-03-18 08:54:25','2026-03-18 08:54:25','listening_photographs'),(216,'What is the purpose of the message?','The speaker is promoting a new product.','2026-03-18 08:54:48','2026-03-18 08:54:48','listening_photographs'),(217,'What feature of the product is mentioned?','The product has improved battery life.','2026-03-18 08:54:48','2026-03-18 08:54:48','listening_photographs'),(218,'Where can listeners learn more?','The speaker directs listeners to the company website.','2026-03-18 08:54:48','2026-03-18 08:54:48','listening_photographs'),(219,'The manager asked the staff to submit their reports ______ Friday afternoon.','The correct preposition for a deadline is \"by\".','2026-03-18 08:57:08','2026-03-18 08:57:08','listening_photographs'),(220,'All employees must wear their identification badges ______ they enter the building.','Whenever\" indicates every time they enter.','2026-03-18 08:57:08','2026-03-18 08:57:08','listening_photographs'),(221,'The marketing team worked late to finish the campaign ______ the deadline.','Before\" indicates completing something earlier than the deadline.','2026-03-18 08:57:08','2026-03-18 08:57:08','listening_photographs'),(222,'The new software will help employees complete their tasks more ______.','Efficiently\" is the correct adverb describing how tasks are completed.','2026-03-18 08:57:08','2026-03-18 08:57:08','listening_photographs'),(223,'The conference room has been reserved ______ the training session tomorrow morning.','For\" indicates purpose.','2026-03-18 08:57:08','2026-03-18 08:57:08','listening_photographs'),(224,'Our company plans to ______ a new branch office in Singapore next year.','Open\" is the correct verb for starting a new branch.','2026-03-18 08:57:08','2026-03-18 08:57:08','listening_photographs'),(225,'Please contact the customer service department if you have any ______ about the product.','Questions\" fits the context of inquiries.','2026-03-18 08:57:08','2026-03-18 08:57:08','listening_photographs'),(226,'The accountant will review the financial report before it is ______ to management.','Submitted\" fits grammatically and contextually.','2026-03-18 08:57:08','2026-03-18 08:57:08','listening_photographs'),(227,'Employees are encouraged to attend the seminar, ______ it will provide useful information.','Since\" introduces a reason.','2026-03-18 08:57:08','2026-03-18 08:57:08','listening_photographs'),(228,'The office will remain closed ______ the national holiday.','During\" is used for a period of time.','2026-03-18 08:57:08','2026-03-18 08:57:08','listening_photographs'),(229,'The company has experienced significant growth ______ the past year.','Over\" indicates a time span.','2026-03-18 08:57:08','2026-03-18 08:57:08','listening_photographs'),(230,'Please make sure that all documents are ______ signed before submission.','Properly\" modifies signed.','2026-03-18 08:57:08','2026-03-18 08:57:08','listening_photographs'),(231,'The training program is designed to improve employees\' ______ skills.','Communication\" logically fits workplace skills.','2026-03-18 08:57:08','2026-03-18 08:57:08','listening_photographs'),(232,'The manager will ______ the proposal before making a final decision.','Review\" fits the context.','2026-03-18 08:57:08','2026-03-18 08:57:08','listening_photographs'),(233,'Customers may return products within 30 days of ______.','Purchase\" is the correct noun.','2026-03-18 08:57:08','2026-03-18 08:57:08','listening_photographs'),(234,'The technician quickly fixed the problem, allowing the system to operate ______ again.','Normally\" is the correct adverb.','2026-03-18 08:57:08','2026-03-18 08:57:08','listening_photographs'),(235,'The CEO plans to ______ the company\'s long-term strategy at the meeting.','Discuss\" fits the context.','2026-03-18 08:57:08','2026-03-18 08:57:08','listening_photographs'),(236,'All visitors must sign in at the front desk ______ entering the office area.','Before\" indicates the required order of actions.','2026-03-18 08:57:08','2026-03-18 08:57:08','listening_photographs'),(237,'The marketing director gave an ______ presentation about the new product line.','Informative\" describes the presentation.','2026-03-18 08:57:08','2026-03-18 08:57:08','listening_photographs'),(238,'The new employee quickly became ______ with the company procedures.','Familiar\" is correct collocation.','2026-03-18 08:57:08','2026-03-18 08:57:08','listening_photographs'),(239,'The company will hire additional staff if demand continues to ______.','Increase\" fits logically.','2026-03-18 08:57:08','2026-03-18 08:57:08','listening_photographs'),(240,'Please ensure that all equipment is turned off ______ leaving the office.','Before\" indicates sequence.','2026-03-18 08:57:08','2026-03-18 08:57:08','listening_photographs'),(241,'The report provides a ______ analysis of last quarter\'s sales.','Detailed\" describes the analysis.','2026-03-18 08:57:08','2026-03-18 08:57:08','listening_photographs'),(242,'Employees must follow all safety regulations to avoid ______.','Accidents\" logically fits safety context.','2026-03-18 08:57:08','2026-03-18 08:57:08','listening_photographs'),(243,'The supervisor thanked the team for their ______ work on the project.','Excellent\" describes the quality of work.','2026-03-18 08:57:08','2026-03-18 08:57:08','listening_photographs'),(244,'The office manager is responsible for ______ office supplies.','Ordering\" fits the function.','2026-03-18 08:57:08','2026-03-18 08:57:08','listening_photographs'),(245,'All staff members are expected to attend the meeting ______ they have prior approval to be absent.','Unless\" introduces exception.','2026-03-18 08:57:08','2026-03-18 08:57:08','listening_photographs'),(246,'The company announced plans to ______ its services internationally.','Expand\" fits business context.','2026-03-18 08:57:08','2026-03-18 08:57:08','listening_photographs'),(247,'The new policy will take effect ______ the beginning of next month.','At\" is correct collocation.','2026-03-18 08:57:08','2026-03-18 08:57:08','listening_photographs'),(248,'Employees are asked to complete the survey ______ possible.','As soon as possible\" phrase → answer \"as\".','2026-03-18 08:57:08','2026-03-18 08:57:08','listening_photographs'),(249,'The marketing campaign was very ______ and increased brand awareness.','Successful\" fits context.','2026-03-18 08:57:08','2026-03-18 08:57:08','listening_photographs'),(250,'The customer requested a ______ of the damaged product.','Replacement\" fits context.','2026-03-18 08:57:08','2026-03-18 08:57:08','listening_photographs'),(251,'The human resources department will ______ the applicants next week.','Interview\" fits hiring process.','2026-03-18 08:57:08','2026-03-18 08:57:08','listening_photographs'),(252,'Employees should check their email ______ for important updates.','Regularly\" is correct adverb.','2026-03-18 08:57:08','2026-03-18 08:57:08','listening_photographs'),(253,'The conference provides an opportunity to ______ ideas with professionals.','Exchange\" fits context.','2026-03-18 08:57:08','2026-03-18 08:57:08','listening_photographs'),(254,'The finance department carefully ______ the company\'s annual budget.','Prepared\" fits context.','2026-03-18 08:57:08','2026-03-18 08:57:08','listening_photographs'),(255,'Our company is committed to providing ______ customer service.','Excellent\" fits common phrase.','2026-03-18 08:57:08','2026-03-18 08:57:08','listening_photographs'),(256,'The office building is located ______ the corner of Main Street and Pine Avenue.','On the corner\" is correct phrase.','2026-03-18 08:57:08','2026-03-18 08:57:08','listening_photographs'),(257,'Employees must complete the training program ______ the end of the month.','By\" indicates deadline.','2026-03-18 08:57:08','2026-03-18 08:57:08','listening_photographs'),(258,'The manager was pleased with the team\'s ______ during the project.','Performance\" fits context.','2026-03-18 08:57:08','2026-03-18 08:57:08','listening_photographs'),(259,'Mark your answer based on the passage.','The correct verb form is \"offer\".','2026-03-18 09:46:36','2026-03-18 09:46:36','listening_photographs'),(260,'Mark your answer based on the passage.','The noun \"customers\" fits the context.','2026-03-18 09:46:36','2026-03-18 09:46:36','listening_photographs'),(261,'Mark your answer based on the passage.','During\" is used for a period of time.','2026-03-18 09:46:36','2026-03-18 09:46:36','listening_photographs'),(262,'Mark your answer based on the passage.','The adjective \"special\" modifies discounts.','2026-03-18 09:46:36','2026-03-18 09:46:36','listening_photographs'),(263,'Mark your answer based on the passage.','The correct preposition for purpose is \"for\".','2026-03-18 09:46:36','2026-03-18 09:46:36','listening_photographs'),(264,'Mark your answer based on the passage.','During\" indicates the time period.','2026-03-18 09:46:36','2026-03-18 09:46:36','listening_photographs'),(265,'Mark your answer based on the passage.','The verb \"resume\" means start again.','2026-03-18 09:46:36','2026-03-18 09:46:36','listening_photographs'),(266,'Mark your answer based on the passage.','The noun \"cooperation\" fits the expression.','2026-03-18 09:46:36','2026-03-18 09:46:36','listening_photographs'),(267,'What is the purpose of the email?','The email responds to a customer\'s inquiry about a delayed order.','2026-03-18 10:21:56','2026-03-18 10:21:56','listening_photographs'),(268,'Why was the order delayed?','The passage states the delay happened due to high demand.','2026-03-18 10:21:57','2026-03-18 10:21:57','listening_photographs'),(269,'When will the item be shipped?','The email says the item will be sent out tomorrow.','2026-03-18 10:21:57','2026-03-18 10:21:57','listening_photographs'),(270,'What should Ms. Carter do if she needs more help?','The email suggests contacting support again for further questions.','2026-03-18 10:21:57','2026-03-18 10:21:57','listening_photographs'),(271,'Why will the cafeteria close?','The notice says the cafeteria will close for renovation.','2026-03-18 10:21:57','2026-03-18 10:21:57','listening_photographs'),(272,'What is the purpose of the email?','The email responds to a customer\'s inquiry about a delayed order.','2026-03-18 10:23:20','2026-03-18 10:23:20','listening_photographs'),(273,'Why was the order delayed?','The passage states the delay happened due to high demand.','2026-03-18 10:23:20','2026-03-18 10:23:20','listening_photographs'),(274,'When will the item be shipped?','The email says the item will be sent out tomorrow.','2026-03-18 10:23:20','2026-03-18 10:23:20','listening_photographs'),(275,'What should Ms. Carter do if she needs more help?','The email suggests contacting support again for further questions.','2026-03-18 10:23:20','2026-03-18 10:23:20','listening_photographs'),(276,'Why will the cafeteria close?','The notice says the cafeteria will close for renovation.','2026-03-18 10:23:20','2026-03-18 10:23:20','listening_photographs'),(277,'How long will the cafeteria be closed?','From July 10 to July 15, which is six days.','2026-03-18 10:24:19','2026-03-18 10:24:19','listening_photographs'),(278,'What are employees advised to do?','Employees should use the food court across the street.','2026-03-18 10:24:19','2026-03-18 10:24:19','listening_photographs'),(279,'What will happen after the renovation?','The cafeteria will reopen with a new menu and better seating.','2026-03-18 10:24:19','2026-03-18 10:24:19','listening_photographs'),(280,'What position is available?','The advertisement clearly states the company is hiring customer service representatives.','2026-03-18 10:24:19','2026-03-18 10:24:19','listening_photographs'),(281,'What is required from applicants?','Applicants must have good communication skills.','2026-03-18 10:24:19','2026-03-18 10:24:19','listening_photographs'),(282,'What is the purpose of the email?','The email responds to a customer\'s inquiry about a delayed order.','2026-03-19 09:01:49','2026-03-19 09:01:49','listening_photographs'),(283,'Why was the order delayed?','The passage states the delay happened due to high demand.','2026-03-19 09:01:49','2026-03-19 09:01:49','listening_photographs'),(284,'When will the item be shipped?','The email says the item will be sent out tomorrow.','2026-03-19 09:01:49','2026-03-19 09:01:49','listening_photographs'),(285,'What are the speakers mainly discussing?','The speakers are discussing a delayed delivery order.','2026-03-19 09:12:45','2026-03-19 09:12:45','listening_photographs'),(286,'What problem is mentioned?','The shipment has not arrived on time.','2026-03-19 09:12:45','2026-03-19 09:12:45','listening_photographs'),(287,'What will the man probably do next?','He plans to call the supplier to check the delivery status.','2026-03-19 09:12:45','2026-03-19 09:12:45','listening_photographs'),(288,'Where most likely are the speakers?','They are discussing office equipment in a workplace.','2026-03-19 09:12:46','2026-03-19 09:12:46','listening_photographs'),(289,'What does the woman ask the man to do?','She asks him to print a report.','2026-03-19 09:13:17','2026-03-19 09:13:17','listening_photographs'),(290,'Why does the man hesitate?','The printer may not have enough ink.','2026-03-19 09:13:17','2026-03-19 09:13:17','listening_photographs'),(291,'What are the speakers mainly talking about?','They are planning a business trip.','2026-03-19 09:13:17','2026-03-19 09:13:17','listening_photographs'),(292,'When will the trip take place?','The trip will occur next Monday.','2026-03-19 09:13:17','2026-03-19 09:13:17','listening_photographs'),(293,'Mark your answer based on what you hear.','The correct response indicates the location of the bank.','2026-03-19 09:14:04','2026-03-19 09:14:04','listening_photographs'),(294,'Mark your answer based on what you hear.','The response identifies the person responsible for the project.','2026-03-19 09:14:04','2026-03-19 09:14:04','listening_photographs'),(295,'Mark your answer based on what you hear.','The correct answer provides a time.','2026-03-19 09:14:04','2026-03-19 09:14:04','listening_photographs'),(296,'Mark your answer based on what you hear.','The response explains the reason for the delay.','2026-03-19 09:14:04','2026-03-19 09:14:04','listening_photographs'),(297,'Mark your answer based on what you hear.','The correct answer describes frequency.','2026-03-19 09:14:04','2026-03-19 09:14:04','listening_photographs'),(298,'Mark your answer based on what you hear.','The correct response gives the opening time.','2026-03-19 09:14:04','2026-03-19 09:14:04','listening_photographs'),(299,'Mark your answer based on what you hear.','The response specifies the type of report.','2026-03-19 09:14:04','2026-03-19 09:14:04','listening_photographs'),(300,'Mark your answer based on what you hear.','The correct answer agrees to help.','2026-03-19 09:14:04','2026-03-19 09:14:04','listening_photographs'),(301,'Mark your answer based on what you hear.','The response confirms completion.','2026-03-19 09:14:04','2026-03-19 09:14:04','listening_photographs'),(302,'Mark your answer based on what you hear.','The correct answer mentions a place.','2026-03-19 09:14:04','2026-03-19 09:14:04','listening_photographs'),(303,'Mark your answer based on what you hear.','The response gives a reason.','2026-03-19 09:14:04','2026-03-19 09:14:04','listening_photographs'),(304,'Mark your answer based on what you hear.','The response identifies a person.','2026-03-19 09:14:04','2026-03-19 09:14:04','listening_photographs'),(305,'Mark your answer based on what you hear.','The response describes a current activity.','2026-03-19 09:14:04','2026-03-19 09:14:04','listening_photographs'),(306,'Mark your answer based on what you hear.','The correct response gives a price.','2026-03-19 09:14:04','2026-03-19 09:14:04','listening_photographs'),(307,'Mark your answer based on what you hear.','The response provides a date or month.','2026-03-19 09:14:04','2026-03-19 09:14:04','listening_photographs'),(308,'Mark your answer based on what you hear.','The correct response tells the location.','2026-03-19 09:14:04','2026-03-19 09:14:04','listening_photographs'),(309,'Mark your answer based on what you hear.','The response explains the reason.','2026-03-19 09:14:04','2026-03-19 09:14:04','listening_photographs'),(310,'Mark your answer based on what you hear.','The correct response identifies the person.','2026-03-19 09:14:04','2026-03-19 09:14:04','listening_photographs'),(311,'Mark your answer based on what you hear.','The response mentions food.','2026-03-19 09:14:04','2026-03-19 09:14:04','listening_photographs'),(312,'Mark your answer based on what you hear.','The response indicates duration.','2026-03-19 09:14:04','2026-03-19 09:14:04','listening_photographs'),(313,'Mark your answer based on what you hear.','The response confirms the action.','2026-03-19 09:14:04','2026-03-19 09:14:04','listening_photographs'),(314,'Mark your answer based on what you hear.','The correct response suggests a place.','2026-03-19 09:14:04','2026-03-19 09:14:04','listening_photographs'),(315,'Mark your answer based on what you hear.','The response gives a reason.','2026-03-19 09:14:04','2026-03-19 09:14:04','listening_photographs'),(316,'Mark your answer based on what you hear.','The correct response identifies participants.','2026-03-19 09:14:04','2026-03-19 09:14:04','listening_photographs'),(317,'Mark your answer based on what you hear.','The response gives a year.','2026-03-19 09:14:04','2026-03-19 09:14:04','listening_photographs'),(318,'Look at the picture and choose the best description.','The man is typing on a laptop while sitting at a desk.','2026-03-19 09:14:54','2026-03-19 09:14:54','listening_photographs'),(319,'Look at the picture and choose the best description.','The chairs are placed around a table in a meeting room.','2026-03-19 09:14:54','2026-03-19 09:14:54','listening_photographs'),(320,'Look at the picture and choose the best description.','The woman is pouring coffee into a cup.','2026-03-19 09:14:54','2026-03-19 09:14:54','listening_photographs'),(321,'Look at the picture and choose the best description.','The road has many cars driving along it.','2026-03-19 09:14:54','2026-03-19 09:14:54','listening_photographs'),(322,'Look at the picture and choose the best description.','People are walking along a path in a park.','2026-03-19 09:14:54','2026-03-19 09:14:54','listening_photographs'),(323,'Look at the picture and choose the best description.','A bicycle is leaning against a wall.','2026-03-19 09:14:54','2026-03-19 09:14:54','listening_photographs'),(324,'What is the purpose of the announcement?','The talk announces a change in train schedules.','2026-03-19 09:36:52','2026-03-19 09:36:52','listening_photographs'),(325,'Who is the announcement for?','The announcement is intended for train passengers.','2026-03-19 09:36:52','2026-03-19 09:36:52','listening_photographs'),(326,'What are passengers asked to do?','Passengers are asked to check the updated schedule board.','2026-03-19 09:36:52','2026-03-19 09:36:52','listening_photographs'),(327,'What is the purpose of the message?','The speaker is promoting a new product.','2026-03-19 09:36:52','2026-03-19 09:36:52','listening_photographs'),(328,'The manager asked the staff to submit their reports ______ Friday afternoon.','The correct preposition for a deadline is \"by\".','2026-03-19 09:38:22','2026-03-19 09:38:22','listening_photographs'),(329,'All employees must wear their identification badges ______ they enter the building.','Whenever\" indicates every time they enter.','2026-03-19 09:38:22','2026-03-19 09:38:22','listening_photographs'),(330,'The marketing team worked late to finish the campaign ______ the deadline.','Before\" indicates completing something earlier than the deadline.','2026-03-19 09:38:22','2026-03-19 09:38:22','listening_photographs'),(331,'The new software will help employees complete their tasks more ______.','Efficiently\" is the correct adverb describing how tasks are completed.','2026-03-19 09:38:22','2026-03-19 09:38:22','listening_photographs'),(332,'The conference room has been reserved ______ the training session tomorrow morning.','For\" indicates purpose.','2026-03-19 09:38:22','2026-03-19 09:38:22','listening_photographs'),(333,'Our company plans to ______ a new branch office in Singapore next year.','Open\" is the correct verb for starting a new branch.','2026-03-19 09:38:22','2026-03-19 09:38:22','listening_photographs'),(334,'Please contact the customer service department if you have any ______ about the product.','Questions\" fits the context of inquiries.','2026-03-19 09:38:22','2026-03-19 09:38:22','listening_photographs'),(335,'The accountant will review the financial report before it is ______ to management.','Submitted\" fits grammatically and contextually.','2026-03-19 09:38:22','2026-03-19 09:38:22','listening_photographs'),(336,'Employees are encouraged to attend the seminar, ______ it will provide useful information.','Since\" introduces a reason.','2026-03-19 09:38:22','2026-03-19 09:38:22','listening_photographs'),(337,'The office will remain closed ______ the national holiday.','During\" is used for a period of time.','2026-03-19 09:38:22','2026-03-19 09:38:22','listening_photographs'),(338,'The company has experienced significant growth ______ the past year.','Over\" indicates a time span.','2026-03-19 09:38:22','2026-03-19 09:38:22','listening_photographs'),(339,'Please make sure that all documents are ______ signed before submission.','Properly\" modifies signed.','2026-03-19 09:38:22','2026-03-19 09:38:22','listening_photographs'),(340,'The training program is designed to improve employees\' ______ skills.','Communication\" logically fits workplace skills.','2026-03-19 09:38:22','2026-03-19 09:38:22','listening_photographs'),(341,'The manager will ______ the proposal before making a final decision.','Review\" fits the context.','2026-03-19 09:38:22','2026-03-19 09:38:22','listening_photographs'),(342,'Customers may return products within 30 days of ______.','Purchase\" is the correct noun.','2026-03-19 09:38:22','2026-03-19 09:38:22','listening_photographs'),(343,'The technician quickly fixed the problem, allowing the system to operate ______ again.','Normally\" is the correct adverb.','2026-03-19 09:38:22','2026-03-19 09:38:22','listening_photographs'),(344,'The CEO plans to ______ the company\'s long-term strategy at the meeting.','Discuss\" fits the context.','2026-03-19 09:38:22','2026-03-19 09:38:22','listening_photographs'),(345,'All visitors must sign in at the front desk ______ entering the office area.','Before\" indicates the required order of actions.','2026-03-19 09:38:22','2026-03-19 09:38:22','listening_photographs'),(346,'The marketing director gave an ______ presentation about the new product line.','Informative\" describes the presentation.','2026-03-19 09:38:22','2026-03-19 09:38:22','listening_photographs'),(347,'The new employee quickly became ______ with the company procedures.','Familiar\" is correct collocation.','2026-03-19 09:38:22','2026-03-19 09:38:22','listening_photographs'),(348,'The company will hire additional staff if demand continues to ______.','Increase\" fits logically.','2026-03-19 09:38:22','2026-03-19 09:38:22','listening_photographs'),(349,'Please ensure that all equipment is turned off ______ leaving the office.','Before\" indicates sequence.','2026-03-19 09:38:22','2026-03-19 09:38:22','listening_photographs'),(350,'The report provides a ______ analysis of last quarter\'s sales.','Detailed\" describes the analysis.','2026-03-19 09:38:22','2026-03-19 09:38:22','listening_photographs'),(351,'Employees must follow all safety regulations to avoid ______.','Accidents\" logically fits safety context.','2026-03-19 09:38:22','2026-03-19 09:38:22','listening_photographs'),(352,'The supervisor thanked the team for their ______ work on the project.','Excellent\" describes the quality of work.','2026-03-19 09:38:22','2026-03-19 09:38:22','listening_photographs'),(353,'The office manager is responsible for ______ office supplies.','Ordering\" fits the function.','2026-03-19 09:38:22','2026-03-19 09:38:22','listening_photographs'),(354,'All staff members are expected to attend the meeting ______ they have prior approval to be absent.','Unless\" introduces exception.','2026-03-19 09:38:22','2026-03-19 09:38:22','listening_photographs'),(355,'The company announced plans to ______ its services internationally.','Expand\" fits business context.','2026-03-19 09:38:22','2026-03-19 09:38:22','listening_photographs'),(356,'The new policy will take effect ______ the beginning of next month.','At\" is correct collocation.','2026-03-19 09:38:22','2026-03-19 09:38:22','listening_photographs'),(357,'Employees are asked to complete the survey ______ possible.','As soon as possible\" phrase → answer \"as\".','2026-03-19 09:38:22','2026-03-19 09:38:22','listening_photographs'),(358,'The marketing campaign was very ______ and increased brand awareness.','Successful\" fits context.','2026-03-19 09:38:22','2026-03-19 09:38:22','listening_photographs'),(359,'The customer requested a ______ of the damaged product.','Replacement\" fits context.','2026-03-19 09:38:22','2026-03-19 09:38:22','listening_photographs'),(360,'The human resources department will ______ the applicants next week.','Interview\" fits hiring process.','2026-03-19 09:38:22','2026-03-19 09:38:22','listening_photographs'),(361,'Employees should check their email ______ for important updates.','Regularly\" is correct adverb.','2026-03-19 09:38:22','2026-03-19 09:38:22','listening_photographs'),(362,'The conference provides an opportunity to ______ ideas with professionals.','Exchange\" fits context.','2026-03-19 09:38:22','2026-03-19 09:38:22','listening_photographs'),(363,'The finance department carefully ______ the company\'s annual budget.','Prepared\" fits context.','2026-03-19 09:38:22','2026-03-19 09:38:22','listening_photographs'),(364,'Our company is committed to providing ______ customer service.','Excellent\" fits common phrase.','2026-03-19 09:38:22','2026-03-19 09:38:22','listening_photographs'),(365,'The office building is located ______ the corner of Main Street and Pine Avenue.','On the corner\" is correct phrase.','2026-03-19 09:38:22','2026-03-19 09:38:22','listening_photographs'),(366,'Employees must complete the training program ______ the end of the month.','By\" indicates deadline.','2026-03-19 09:38:22','2026-03-19 09:38:22','listening_photographs'),(367,'The manager was pleased with the team\'s ______ during the project.','Performance\" fits context.','2026-03-19 09:38:22','2026-03-19 09:38:22','listening_photographs'),(368,'Mark your answer based on the passage.','The correct verb form is \"offer\".','2026-03-19 09:50:33','2026-03-19 09:50:33','listening_photographs'),(369,'Mark your answer based on the passage.','The noun \"customers\" fits the context.','2026-03-19 09:50:33','2026-03-19 09:50:33','listening_photographs'),(370,'Mark your answer based on the passage.','During\" is used for a period of time.','2026-03-19 09:50:33','2026-03-19 09:50:33','listening_photographs'),(371,'Mark your answer based on the passage.','The adjective \"special\" modifies discounts.','2026-03-19 09:50:33','2026-03-19 09:50:33','listening_photographs'),(372,'Mark your answer based on the passage.','The correct preposition for purpose is \"for\".','2026-03-19 09:50:33','2026-03-19 09:50:33','listening_photographs'),(373,'Why did Mr. Lee receive the email?','The email was sent because he purchased a laptop.','2026-03-19 09:58:10','2026-03-19 09:58:10','listening_photographs'),(374,'When will the laptop likely arrive?','The email states the delivery will arrive on Thursday.','2026-03-19 09:58:10','2026-03-19 09:58:10','listening_photographs'),(375,'How can Mr. Lee track his order?','The email says he can track the shipment on the website.','2026-03-19 09:58:10','2026-03-19 09:58:10','listening_photographs'),(376,'What event is mentioned in the notice?','The notice is about a photography exhibition.','2026-03-19 09:59:18','2026-03-19 09:59:18','listening_photographs'),(377,'When will the exhibition take place?','It will run from September 5 to September 20.','2026-03-19 09:59:18','2026-03-19 09:59:18','listening_photographs'),(378,'What time does the museum open?','The notice says the museum opens at 9 AM.','2026-03-19 09:59:18','2026-03-19 09:59:18','listening_photographs'),(379,'What are visitors encouraged to do?','Visitors should book tickets online.','2026-03-19 09:59:18','2026-03-19 09:59:18','listening_photographs'),(380,'Look at the picture and choose the best description.','The man is typing on a laptop while sitting at a desk.','2026-03-25 08:14:31','2026-03-25 08:14:31','listening_photographs'),(381,'Look at the picture and choose the best description.','The chairs are placed around a table in a meeting room.','2026-03-25 08:14:31','2026-03-25 08:14:31','listening_photographs'),(382,'Look at the picture and choose the best description.','The woman is pouring coffee into a cup.','2026-03-25 08:14:31','2026-03-25 08:14:31','listening_photographs'),(383,'Look at the picture and choose the best description.','The road has many cars driving along it.','2026-03-25 08:14:31','2026-03-25 08:14:31','listening_photographs'),(384,'Look at the picture and choose the best description.','People are walking along a path in a park.','2026-03-25 08:14:31','2026-03-25 08:14:31','listening_photographs'),(385,'Look at the picture and choose the best description.','A bicycle is leaning against a wall.','2026-03-25 08:14:31','2026-03-25 08:14:31','listening_photographs'),(386,'What type of membership does the woman want?','She chooses the monthly membership plan.','2026-03-29 15:15:47','2026-03-29 15:15:47','reading_matching_headings'),(387,'How much is the joining fee?','The joining fee mentioned is $25.','2026-03-29 15:15:47','2026-03-29 15:15:47','reading_matching_headings'),(388,'Which facility does the woman ask about?','She specifically asks about the swimming pool.','2026-03-29 15:15:47','2026-03-29 15:15:47','reading_matching_headings'),(389,'What day does the woman plan to start?','She plans to start on Monday.','2026-03-29 15:15:47','2026-03-29 15:15:47','reading_matching_headings'),(390,'What time does the gym open on weekdays?','The receptionist says 6 a.m.','2026-03-29 15:15:47','2026-03-29 15:15:47','reading_matching_headings'),(391,'What document does she need to bring?','ID card is required for registration.','2026-03-29 15:15:47','2026-03-29 15:15:47','reading_matching_headings'),(392,'Which class is included in the membership?','Yoga classes are included.','2026-03-29 15:15:47','2026-03-29 15:15:47','reading_matching_headings'),(393,'Where is the locker room located?','It is located on the second floor.','2026-03-29 15:15:47','2026-03-29 15:15:47','reading_matching_headings'),(394,'What discount is mentioned?','Student discount is available.','2026-03-29 15:15:47','2026-03-29 15:15:47','reading_matching_headings'),(395,'How will she pay?','She chooses to pay by credit card.','2026-03-29 15:15:47','2026-03-29 15:15:47','reading_matching_headings'),(396,'What year was the museum built?','It opened in 1952.','2026-03-29 15:17:39','2026-03-29 15:17:39','reading_matching_headings'),(397,'Which exhibition is on the first floor?','Ancient history exhibition.','2026-03-29 15:17:39','2026-03-29 15:17:39','reading_matching_headings'),(398,'Where is the café located?','The café is near the entrance.','2026-03-29 15:17:39','2026-03-29 15:17:39','reading_matching_headings'),(399,'What time does the museum close?','It closes at 6 p.m.','2026-03-29 15:17:39','2026-03-29 15:17:39','reading_matching_headings'),(400,'Which item is not allowed inside?','Food is not allowed.','2026-03-29 15:17:39','2026-03-29 15:17:39','reading_matching_headings'),(401,'Which gallery was renovated recently?','Modern art gallery.','2026-03-29 15:17:39','2026-03-29 15:17:39','reading_matching_headings'),(402,'How long does the guided tour last?','It lasts one hour.','2026-03-29 15:17:39','2026-03-29 15:17:39','reading_matching_headings'),(403,'Which floor has the science exhibition?','Third floor.','2026-03-29 15:17:39','2026-03-29 15:17:39','reading_matching_headings'),(404,'What ticket discount is available?','Students receive discounts.','2026-03-29 15:17:39','2026-03-29 15:17:39','reading_matching_headings'),(405,'Where can visitors buy souvenirs?','At the gift shop.','2026-03-29 15:17:39','2026-03-29 15:17:39','reading_matching_headings'),(406,'What is the main topic of the passage?','It discusses urban farming.','2026-03-29 15:19:32','2026-03-29 15:19:32','reading_matching_headings'),(407,'Where do residents grow vegetables?','On rooftops or gardens.','2026-03-29 15:19:32','2026-03-29 15:19:32','reading_matching_headings'),(408,'What is one benefit mentioned?','Fresh food supply.','2026-03-29 15:19:32','2026-03-29 15:19:32','reading_matching_headings'),(409,'What does urban farming strengthen?','Community relationships.','2026-03-29 15:19:32','2026-03-29 15:19:32','reading_matching_headings'),(410,'Where is this practice popular?','In large cities.','2026-03-29 15:19:32','2026-03-29 15:19:32','reading_matching_headings'),(411,'Summarize the information by selecting and reporting the main features.','Essay question requiring discussion and opinion.','2026-03-29 15:23:59','2026-03-29 15:23:59','writing_task_1'),(412,'Where did you go?',NULL,'2026-03-29 16:15:47','2026-03-29 16:15:47','speaking_part_2'),(413,'who did you go with?\n',NULL,'2026-03-29 16:16:05','2026-03-29 16:16:05','speaking_part_2'),(414,'Some people believe that technology makes life easier, while others think it makes people less social. Discuss both views and give your opinion.',NULL,'2026-03-29 17:32:36','2026-03-29 17:32:36','speaking_part_2'),(415,'whay your name?',NULL,'2026-03-30 06:55:16','2026-03-30 06:55:16','speaking_part_1'),(416,' where are you from?',NULL,'2026-03-30 06:55:29','2026-03-30 06:55:29','reading_matching_headings'),(417,'Why do you go here?',NULL,'2026-03-30 06:55:43','2026-03-30 06:55:43','reading_matching_headings');
/*!40000 ALTER TABLE `questions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `reports`
--

DROP TABLE IF EXISTS `reports`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `reports` (
  `report_id` int NOT NULL AUTO_INCREMENT,
  `report_type` enum('users','courses','lessons','exams','blogs','documents','roadmaps') NOT NULL,
  `report_content` text NOT NULL,
  `user_id` int DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  `report_name` varchar(255) DEFAULT NULL,
  `file_path` varchar(255) DEFAULT NULL,
  `file_format` enum('excel','csv') NOT NULL DEFAULT 'excel',
  `filters` json DEFAULT NULL,
  PRIMARY KEY (`report_id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `reports_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `reports`
--

LOCK TABLES `reports` WRITE;
/*!40000 ALTER TABLE `reports` DISABLE KEYS */;
INSERT INTO `reports` VALUES (8,'users','Báo cáo người dùng - Tổng: 3',1,'2026-02-10 09:28:09','2026-02-10 09:28:09','Người dùng','/upload/reports/users_1770715689791.xlsx','excel','\"{}\"'),(9,'courses','Báo cáo khóa học - Tổng: 2',1,'2026-02-10 09:29:08','2026-02-10 09:29:08','Khóa học','/upload/reports/courses_1770715748541.xlsx','excel','\"{}\"'),(10,'lessons','Báo cáo bài học - Tổng: 1',1,'2026-02-10 09:29:52','2026-02-10 09:29:52','Bài học','/upload/reports/lessons_1770715792059.xlsx','excel','\"{}\"'),(11,'exams','Báo cáo đề thi - Tổng: 1',1,'2026-02-10 09:30:22','2026-02-10 09:30:22','Đề thi','/upload/reports/exams_1770715822471.xlsx','excel','\"{}\"'),(12,'blogs','Báo cáo tin tức - Tổng: 2',1,'2026-02-10 09:30:46','2026-02-10 09:30:46','Tin tức','/upload/reports/blogs_1770715846109.xlsx','excel','\"{}\"'),(13,'documents','Báo cáo tài liệu - Tổng: 2',1,'2026-02-10 09:31:13','2026-02-10 09:31:13','Tài liệu','/upload/reports/documents_1770715873108.xlsx','excel','\"{}\"'),(14,'roadmaps','Báo cáo lộ trình - Tổng: 1',1,'2026-02-10 09:31:33','2026-02-10 09:31:33','Lộ trình','/upload/reports/roadmaps_1770715893280.xlsx','excel','\"{}\"');
/*!40000 ALTER TABLE `reports` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `roadmaps`
--

DROP TABLE IF EXISTS `roadmaps`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `roadmaps` (
  `roadmap_id` int NOT NULL AUTO_INCREMENT,
  `roadmap_title` varchar(255) NOT NULL,
  `roadmap_description` text,
  `roadmap_aim` text NOT NULL,
  `roadmap_level` enum('Beginner','Intermediate','Advanced') NOT NULL,
  `estimated_duration` int NOT NULL,
  `roadmap_status` tinyint(1) NOT NULL DEFAULT '1',
  `certificate_id` int NOT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  PRIMARY KEY (`roadmap_id`),
  KEY `certificate_id` (`certificate_id`),
  CONSTRAINT `roadmaps_ibfk_1` FOREIGN KEY (`certificate_id`) REFERENCES `certificates` (`certificate_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `roadmaps`
--

LOCK TABLES `roadmaps` WRITE;
/*!40000 ALTER TABLE `roadmaps` DISABLE KEYS */;
INSERT INTO `roadmaps` VALUES (1,'Lộ trình đi từ mất gốc đến 70+','xxxxxxxxx','Đạt 700 Toeic','Intermediate',5,1,1,'2026-01-21 08:22:16','2026-01-21 08:33:54');
/*!40000 ALTER TABLE `roadmaps` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `skills`
--

DROP TABLE IF EXISTS `skills`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `skills` (
  `skill_id` int NOT NULL AUTO_INCREMENT,
  `skill_name` varchar(20) NOT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`skill_id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `skills`
--

LOCK TABLES `skills` WRITE;
/*!40000 ALTER TABLE `skills` DISABLE KEYS */;
INSERT INTO `skills` VALUES (1,'Reading','2026-01-15 09:51:44','2026-01-15 09:51:44'),(2,'Listening','2026-01-15 10:02:32','2026-01-15 10:02:32');
/*!40000 ALTER TABLE `skills` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `speaking_feedbacks`
--

DROP TABLE IF EXISTS `speaking_feedbacks`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `speaking_feedbacks` (
  `speaking_feedback_id` int NOT NULL AUTO_INCREMENT,
  `record_id` int NOT NULL,
  `model_name` varchar(255) DEFAULT NULL,
  `overall_score` float DEFAULT NULL,
  `criteria_scores` json DEFAULT NULL,
  `transcript` text,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `comments` text,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`speaking_feedback_id`),
  KEY `record_id` (`record_id`),
  CONSTRAINT `speaking_feedbacks_ibfk_1` FOREIGN KEY (`record_id`) REFERENCES `speaking_records` (`record_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `speaking_feedbacks`
--

LOCK TABLES `speaking_feedbacks` WRITE;
/*!40000 ALTER TABLE `speaking_feedbacks` DISABLE KEYS */;
INSERT INTO `speaking_feedbacks` VALUES (1,1,'gpt-4o-mini',2,'{\"pronunciation\": 3, \"lexical_resource\": 2, \"fluency_coherence\": 2, \"grammatical_range_accuracy\": 2}',NULL,'2026-03-30 06:35:53','{\"feedback\":{\"overall_comment\":\"The candidate\'s response was very limited and did not address the task effectively. There was a lack of detail and coherence in the answer provided.\",\"strengths\":[\"Attempted to engage with the task\",\"Demonstrated some basic pronunciation skills\"],\"improvements\":[\"Work on developing responses with more detail\",\"Practice speaking fluently without hesitation\"],\"pronunciation_notes\":[\"Some words were pronounced clearly, but others were not\",\"Intonation could be improved for better clarity\"],\"tips\":[\"Practice speaking about personal experiences in detail\",\"Use a wider range of vocabulary to express ideas more clearly\"]},\"criteria_comments\":{\"fluency_coherence\":\"The candidate struggled to maintain coherence and fluency in their response.\",\"lexical_resource\":\"The vocabulary used was very limited and repetitive.\",\"grammatical_range_accuracy\":\"There were frequent errors in grammar and sentence structure.\",\"pronunciation\":\"Pronunciation was generally understandable but lacked clarity in some areas.\"},\"transcript\":\"EXAMINER: Thank you. Here is your cue card:\\n\\n**Describe a memorable trip you have taken. You should say:**\\n- Where you went\\n- Who you went with\\n- What you did there\\n- And explain why it was memorable\\n\\nPlease take a moment to prepare your response. You may begin when you are ready.\\n\\nCANDIDATE: okay I\'m ready\\n\\nEXAMINER: Please go ahead.\\n\\nCANDIDATE: what can you tell what\\n\\nEXAMINER: Could you please share your memorable trip with us?\"}','2026-03-30 06:35:53'),(2,2,'gpt-4o-mini',4,'{\"pronunciation\": 4.5, \"lexical_resource\": 4, \"fluency_coherence\": 3.5, \"grammatical_range_accuracy\": 3.5}',NULL,'2026-03-30 07:41:13','{\"feedback\":{\"overall_comment\":\"The candidate demonstrated some ability to communicate but faced significant challenges, especially in Part 2. More preparation and practice could help improve fluency and coherence.\",\"strengths\":[\"Basic communication skills\",\"Clear pronunciation in simple phrases\"],\"improvements\":[\"Expand vocabulary to express ideas more clearly\",\"Practice speaking about personal experiences to enhance fluency\"],\"pronunciation_notes\":[\"Some words were mispronounced, affecting clarity\",\"Overall, pronunciation was understandable but could be improved\"],\"tips\":[\"Practice speaking about familiar topics to build confidence\",\"Engage in conversations to improve fluency and coherence\"]},\"criteria_comments\":{\"fluency_coherence\":\"The candidate struggled to maintain fluency and coherence, particularly in Part 2.\",\"lexical_resource\":\"The vocabulary used was limited and repetitive, affecting the overall expression.\",\"grammatical_range_accuracy\":\"There were several grammatical errors that hindered clarity.\",\"pronunciation\":\"Pronunciation was generally clear, though some words were mispronounced.\"},\"transcript\":\"=== PART 1 ===\\nEXAMINER: Good morning. Can you please tell me your name?\\n\\nCANDIDATE: hi is Amina\\n\\nEXAMINER: Nice to meet you, Amina. Where are you from?\\n\\nCANDIDATE: I\'m from Vietnam the country of the traditional\\n\\nEXAMINER: That sounds interesting! Why do you come here?\\n\\nCANDIDATE: I\'m come here to do the exam test we can test\\n\\nEXAMINER: I see, so you are here for the exam. What do you enjoy doing in your free time?\\n\\nCANDIDATE: in my free time I play a game I play piano and guitar something I can sing\\n\\nEXAMINER: That sounds like a lot of fun! How long have you been playing the piano and guitar?\\n\\n=== PART 2 ===\\nEXAMINER: Here is your cue card:\\n\\n**Describe a memorable trip you have taken. You should say where you went, who you went with, what you did there, and explain why it was memorable.**\\n\\nYou have one minute to prepare. Please begin when you are ready.\\n\\nCANDIDATE: sure I\'m ready\\n\\nEXAMINER: Great! Please go ahead and describe your memorable trip.\\n\\nCANDIDATE: oh no I don\'t know\\n\\nEXAMINER: That\'s okay. Take a moment to think about it. You can start with where you went or who you went with. Just share whatever comes to mind.\\n\\nCANDIDATE: I\'m sorry but\\n\\nEXAMINER: No need to apologize. If you\'d like, you can try to think of a different trip or experience. Would you like to share anything about a place you enjoyed visiting?\\n\\nCANDIDATE: yes I like to\\n\\nEXAMINER: That\'s wonderful! Please go ahead and share about a place you enjoyed visiting.\"}','2026-03-30 07:41:13'),(3,3,'gpt-4o-mini',4,'{\"pronunciation\": 4.5, \"lexical_resource\": 4, \"fluency_coherence\": 3.5, \"grammatical_range_accuracy\": 3.5}',NULL,'2026-03-30 07:42:44','{\"status\":\"graded\",\"transcript\":\"EXAMINER: Here is your cue card:\\n\\n**Describe a memorable trip you have taken. You should say where you went, who you went with, what you did there, and explain why it was memorable.**\\n\\nYou have one minute to prepare. Please begin when you are ready.\\n\\nCANDIDATE: sure I\'m ready\\n\\nEXAMINER: Great! Please go ahead and describe your memorable trip.\\n\\nCANDIDATE: oh no I don\'t know\\n\\nEXAMINER: That\'s okay. Take a moment to think about it. You can start with where you went or who you went with. Just share whatever comes to mind.\\n\\nCANDIDATE: I\'m sorry but\\n\\nEXAMINER: No need to apologize. If you\'d like, you can try to think of a different trip or experience. Would you like to share anything about a place you enjoyed visiting?\\n\\nCANDIDATE: yes I like to\\n\\nEXAMINER: That\'s wonderful! Please go ahead and share about a place you enjoyed visiting.\"}','2026-03-30 07:42:44'),(4,4,'gpt-4o-mini',4,'{\"pronunciation\": 4.5, \"lexical_resource\": 4, \"fluency_coherence\": 4, \"grammatical_range_accuracy\": 3.5}',NULL,'2026-03-30 08:45:13','{\"feedback\":{\"overall_comment\":\"The candidate demonstrates basic communication skills but struggles with fluency and grammatical accuracy. More practice is needed to improve overall performance.\",\"strengths\":[\"Basic communication is attempted\",\"Pronunciation is generally understandable\"],\"improvements\":[\"Increase vocabulary range\",\"Practice grammatical structures for better accuracy\"],\"pronunciation_notes\":[\"Some words are pronounced clearly\",\"Occasional mispronunciations may affect understanding\"],\"tips\":[\"Engage in more speaking practice with varied topics\",\"Listen to native speakers to improve pronunciation and fluency\"]},\"criteria_comments\":{\"fluency_coherence\":\"The candidate struggles with fluency, often pausing and hesitating.\",\"lexical_resource\":\"The vocabulary used is basic and lacks variety.\",\"grammatical_range_accuracy\":\"There are frequent grammatical errors that affect clarity.\",\"pronunciation\":\"Pronunciation is generally clear but may have occasional mispronunciations.\"},\"transcript\":\"=== PART 1 ===\\nEXAMINER: Good morning. Can you please tell me your name?\\n\\nCANDIDATE: hello examiner my name is Trey\\n\\nEXAMINER: Nice to meet you, Trey. Where are you from?\\n\\nCANDIDATE: I\'m from Vietnam to the country of the traditional vegetables\\n\\nEXAMINER: That sounds interesting! Why did you come here?\\n\\nCANDIDATE: come here to I\'m taking Islam ill speaking test\\n\\nEXAMINER: I see! How long have you been preparing for the IELTS speaking test?\\n\\nCANDIDATE: oh sorry I don\'t repair any thing to test\\n\\nEXAMINER: That\'s alright! What do you enjoy doing in your free time?\"}','2026-03-30 08:45:13'),(5,5,'draft',0,'{}',NULL,'2026-03-30 09:16:01','{\"status\":\"draft\",\"transcript\":\"EXAMINER: Good morning. Can you please tell me your name?\\n\\nCANDIDATE: good morning examiner my name is today\\n\\nEXAMINER: Thank you, Today. Where are you from?\\n\\nCANDIDATE: I\'m from Vietnam to come to you about many traditional vegetables\\n\\nEXAMINER: That\'s interesting! Why did you come here?\\n\\nCANDIDATE: come here to the taking the exam IO speaking test\\n\\nEXAMINER: I see. How do you feel about the exam?\\n\\nCANDIDATE: so I feel like it\'s very hard to taking\\n\\nEXAMINER: It\'s completely normal to feel that way. What do you like to do in your free time?\\n\\nCANDIDATE: I\'m afraid time I do my play struggle with my friends so after this I\'m going home and\\n\\nEXAMINER: That sounds enjoyable! Do you have any favorite activities you like to do with your friends?\"}','2026-03-30 09:16:01'),(6,6,'gpt-4o-mini',4,'{\"pronunciation\": 4, \"lexical_resource\": 4, \"fluency_coherence\": 4, \"grammatical_range_accuracy\": 4}',NULL,'2026-03-30 09:40:55','{\"feedback\":{\"overall_comment\":\"The candidate demonstrates basic communication skills but needs to improve clarity and coherence in responses. More practice with vocabulary and grammar would be beneficial.\",\"strengths\":[\"Basic ability to respond to questions\",\"Some understanding of the topic\"],\"improvements\":[\"Enhance vocabulary to express ideas more clearly\",\"Work on grammatical accuracy to improve sentence structure\"],\"pronunciation_notes\":[\"Some words are mispronounced, affecting understanding\",\"Intonation could be improved for better clarity\"],\"tips\":[\"Practice speaking in complete sentences to improve fluency\",\"Engage in conversations to build confidence and vocabulary\"]},\"criteria_comments\":{\"fluency_coherence\":\"The candidate shows some ability to communicate but struggles with coherence.\",\"lexical_resource\":\"The vocabulary used is limited and occasionally unclear.\",\"grammatical_range_accuracy\":\"There are frequent grammatical errors that affect clarity.\",\"pronunciation\":\"Pronunciation is generally understandable but has noticeable issues.\"},\"transcript\":\"=== PART 1 ===\\nEXAMINER: Hello, my name is [Your Name]. What is your name?\\n\\nCANDIDATE: hello is honor my name is day I\'m from Vietnam\\n\\nEXAMINER: Nice to meet you, Day. Can you tell me which city in Vietnam you are from?\\n\\nCANDIDATE: I\'m from Ho Chi Minh City\\n\\nEXAMINER: That sounds interesting! What do you do in Ho Chi Minh City?\\n\\nCANDIDATE: Ameristop of the big test images is information Technologies\\n\\nEXAMINER: I see. So, you are studying information technology. What do you enjoy most about your studies?\"}','2026-03-30 09:40:55'),(7,7,'gpt-4o-mini',2,'{\"pronunciation\": 3, \"lexical_resource\": 2, \"fluency_coherence\": 2, \"grammatical_range_accuracy\": 2}',NULL,'2026-03-30 09:59:32','{\"feedback\":{\"overall_comment\":\"The candidate faced significant challenges in responding to questions appropriately and coherently. Improvement in topic relevance and vocabulary usage is needed.\",\"strengths\":[\"Some clarity in pronunciation\",\"Attempted to engage with the examiner\"],\"improvements\":[\"Focus on answering questions directly\",\"Expand vocabulary to express ideas more clearly\"],\"pronunciation_notes\":[\"Some words were pronounced clearly\",\"Occasional mispronunciation affected understanding\"],\"tips\":[\"Practice answering common IELTS questions to improve fluency\",\"Expand vocabulary by reading and listening to English materials\"]},\"criteria_comments\":{\"fluency_coherence\":\"The candidate struggled to maintain coherence and relevance in their responses.\",\"lexical_resource\":\"The vocabulary used was very limited and did not adequately address the prompts.\",\"grammatical_range_accuracy\":\"There were frequent grammatical errors and a lack of complex structures.\",\"pronunciation\":\"Pronunciation was generally clear, but some words were mispronounced.\"},\"transcript\":\"=== PART 1 ===\\nEXAMINER: Good morning! Can you please tell me your name?\\n\\nCANDIDATE: how old is Leonard\\n\\nEXAMINER: I\'m here to ask you questions for the IELTS Speaking test. Can you please tell me where you are from?\\n\\nCANDIDATE: I\'m from Vietnamese I\'m from Vietnam\\n\\nEXAMINER: That\'s great to hear! Why are you here for the IELTS exam?\\n\\n=== PART 2 ===\\nEXAMINER: Here is your cue card:\\n\\n**Describe a memorable trip you have taken. You should say:**\\n- Where you went\\n- Who you went with\\n- What you did there\\n- And explain why it was memorable\\n\\nYou have one minute to prepare, and then you can speak for 1-2 minutes. Please begin when you\'re ready.\\n\\nCANDIDATE: yeah I\'m ready\\n\\nEXAMINER: Please go ahead.\\n\\nCANDIDATE: do you know I want your love your love is love\\n\\nEXAMINER: It seems you may be off-topic. Could you please describe a memorable trip you have taken?\"}','2026-03-30 09:59:32'),(8,8,'gpt-4o-mini',2,'{\"pronunciation\": 3, \"lexical_resource\": 2, \"fluency_coherence\": 2, \"grammatical_range_accuracy\": 2}',NULL,'2026-03-30 10:00:24','{\"status\":\"graded\",\"transcript\":\"EXAMINER: Here is your cue card:\\n\\n**Describe a memorable trip you have taken. You should say:**\\n- Where you went\\n- Who you went with\\n- What you did there\\n- And explain why it was memorable\\n\\nYou have one minute to prepare, and then you can speak for 1-2 minutes. Please begin when you\'re ready.\\n\\nCANDIDATE: yeah I\'m ready\\n\\nEXAMINER: Please go ahead.\\n\\nCANDIDATE: do you know I want your love your love is love\\n\\nEXAMINER: It seems you may be off-topic. Could you please describe a memorable trip you have taken?\"}','2026-03-30 10:00:24');
/*!40000 ALTER TABLE `speaking_feedbacks` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `speaking_records`
--

DROP TABLE IF EXISTS `speaking_records`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `speaking_records` (
  `record_id` int NOT NULL AUTO_INCREMENT,
  `audio_url` varchar(255) NOT NULL,
  `user_exam_id` int NOT NULL,
  `container_question_id` int NOT NULL,
  `duration` int NOT NULL,
  `submitted_at` datetime DEFAULT NULL,
  `final_score` float DEFAULT NULL,
  PRIMARY KEY (`record_id`),
  KEY `speaking_records_user_exam_id_foreign_idx` (`user_exam_id`),
  KEY `speaking_records_container_question_id_foreign_idx` (`container_question_id`),
  CONSTRAINT `speaking_records_container_question_id_foreign_idx` FOREIGN KEY (`container_question_id`) REFERENCES `container_questions` (`container_question_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `speaking_records_user_exam_id_foreign_idx` FOREIGN KEY (`user_exam_id`) REFERENCES `user_exams` (`user_exam_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `speaking_records`
--

LOCK TABLES `speaking_records` WRITE;
/*!40000 ALTER TABLE `speaking_records` DISABLE KEYS */;
INSERT INTO `speaking_records` VALUES (1,'text_session',31,410,40,'2026-03-30 06:35:47',2),(2,'text_session',32,413,86,'2026-03-30 07:41:13',4),(3,'text_session',32,410,72,'2026-03-30 07:42:44',4),(4,'text_session',34,413,64,'2026-03-30 08:45:13',4),(5,'text_session',35,413,74,'2026-03-30 09:16:01',NULL),(6,'text_session',36,413,59,'2026-03-30 09:40:55',4),(7,'text_session',37,413,33,'2026-03-30 09:59:32',2),(8,'text_session',37,410,44,'2026-03-30 10:00:24',2);
/*!40000 ALTER TABLE `speaking_records` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `subscription_plans`
--

DROP TABLE IF EXISTS `subscription_plans`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `subscription_plans` (
  `subscription_plan_id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `features` json DEFAULT NULL,
  `monthly_ai_token_quota` int NOT NULL,
  `code` varchar(255) DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT '1',
  PRIMARY KEY (`subscription_plan_id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `subscription_plans`
--

LOCK TABLES `subscription_plans` WRITE;
/*!40000 ALTER TABLE `subscription_plans` DISABLE KEYS */;
INSERT INTO `subscription_plans` VALUES (1,'Free','{\"max_courses\": 5, \"certificates\": true, \"ai_assistance\": false, \"priority_support\": false, \"download_documents\": false, \"custom_learning_path\": false}',1000,'free',1),(2,'Pro','{\"max_courses\": 50, \"certificates\": true, \"ai_assistance\": true, \"offline_access\": true, \"priority_support\": false, \"download_documents\": true, \"custom_learning_path\": true}',10000,'pro',1),(3,'Premium','{\"max_courses\": -1, \"certificates\": true, \"ai_assistance\": true, \"live_sessions\": true, \"offline_access\": true, \"priority_support\": true, \"download_documents\": true, \"custom_learning_path\": true}',30000,'premium',1);
/*!40000 ALTER TABLE `subscription_plans` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `subscription_prices`
--

DROP TABLE IF EXISTS `subscription_prices`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `subscription_prices` (
  `subscription_price_id` int NOT NULL AUTO_INCREMENT,
  `subscription_plan_id` int NOT NULL,
  `billing_type` enum('free','monthly','yearly','weekly') NOT NULL,
  `duration_days` int DEFAULT NULL,
  `price` int NOT NULL,
  `discount_percentage` float DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT '1',
  PRIMARY KEY (`subscription_price_id`),
  KEY `subscription_plan_id` (`subscription_plan_id`),
  CONSTRAINT `subscription_prices_ibfk_1` FOREIGN KEY (`subscription_plan_id`) REFERENCES `subscription_plans` (`subscription_plan_id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `subscription_prices`
--

LOCK TABLES `subscription_prices` WRITE;
/*!40000 ALTER TABLE `subscription_prices` DISABLE KEYS */;
INSERT INTO `subscription_prices` VALUES (1,1,'free',NULL,0,NULL,1),(2,2,'weekly',7,49000,NULL,1),(3,2,'monthly',30,199000,NULL,1),(4,2,'yearly',365,1990000,NULL,1),(5,3,'weekly',7,99000,NULL,1),(6,3,'monthly',30,399000,NULL,1),(7,3,'yearly',365,3990000,NULL,1);
/*!40000 ALTER TABLE `subscription_prices` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `system_ai_quotas`
--

DROP TABLE IF EXISTS `system_ai_quotas`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `system_ai_quotas` (
  `quota_id` int NOT NULL AUTO_INCREMENT,
  `open_ai_credit` float NOT NULL DEFAULT '0',
  `system_open_ai_token` int NOT NULL DEFAULT '0',
  `ai_token_unit` int NOT NULL DEFAULT '500',
  `ai_token_totals` int NOT NULL DEFAULT '0',
  `ai_token_used` int NOT NULL DEFAULT '0',
  `buffer_percent` float NOT NULL DEFAULT '20',
  `price_per_milion` float NOT NULL DEFAULT '0',
  `total_cost` float NOT NULL DEFAULT '0',
  PRIMARY KEY (`quota_id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `system_ai_quotas`
--

LOCK TABLES `system_ai_quotas` WRITE;
/*!40000 ALTER TABLE `system_ai_quotas` DISABLE KEYS */;
INSERT INTO `system_ai_quotas` VALUES (1,7,5419354,500,11200,390,40,0.75,0.135484);
/*!40000 ALTER TABLE `system_ai_quotas` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user_answers`
--

DROP TABLE IF EXISTS `user_answers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user_answers` (
  `user_answer_id` int NOT NULL AUTO_INCREMENT,
  `user_exam_id` int NOT NULL,
  `container_question_id` int NOT NULL,
  `question_option_id` int DEFAULT NULL,
  `is_correct` tinyint(1) DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`user_answer_id`),
  KEY `user_exam_id` (`user_exam_id`),
  KEY `container_question_id` (`container_question_id`),
  KEY `question_option_id` (`question_option_id`),
  CONSTRAINT `user_answers_ibfk_1` FOREIGN KEY (`user_exam_id`) REFERENCES `user_exams` (`user_exam_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `user_answers_ibfk_2` FOREIGN KEY (`container_question_id`) REFERENCES `container_questions` (`container_question_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `user_answers_ibfk_3` FOREIGN KEY (`question_option_id`) REFERENCES `question_options` (`question_option_id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=261 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_answers`
--

LOCK TABLES `user_answers` WRITE;
/*!40000 ALTER TABLE `user_answers` DISABLE KEYS */;
INSERT INTO `user_answers` VALUES (2,2,168,590,1,'2026-03-18 08:47:13','2026-03-18 08:47:13'),(3,2,169,594,0,'2026-03-18 08:47:13','2026-03-18 08:47:13'),(4,2,170,601,0,'2026-03-18 08:47:13','2026-03-18 08:47:13'),(5,2,171,605,0,'2026-03-18 08:47:13','2026-03-18 08:47:13'),(6,2,172,608,0,'2026-03-18 08:47:13','2026-03-18 08:47:13'),(7,2,173,612,0,'2026-03-18 08:47:13','2026-03-18 08:47:13'),(8,2,174,614,0,'2026-03-18 08:47:13','2026-03-18 08:47:13'),(9,2,175,619,0,'2026-03-18 08:47:13','2026-03-18 08:47:13'),(10,2,176,621,0,'2026-03-18 08:47:13','2026-03-18 08:47:13'),(11,2,177,625,0,'2026-03-18 08:47:13','2026-03-18 08:47:13'),(12,2,178,627,0,'2026-03-18 08:47:13','2026-03-18 08:47:13'),(13,2,179,631,0,'2026-03-18 08:47:13','2026-03-18 08:47:13'),(14,2,180,634,0,'2026-03-18 08:47:13','2026-03-18 08:47:13'),(15,2,181,637,0,'2026-03-18 08:47:13','2026-03-18 08:47:13'),(16,2,182,640,0,'2026-03-18 08:47:13','2026-03-18 08:47:13'),(17,2,183,643,0,'2026-03-18 08:47:13','2026-03-18 08:47:13'),(18,2,184,646,0,'2026-03-18 08:47:13','2026-03-18 08:47:13'),(19,2,185,649,0,'2026-03-18 08:47:13','2026-03-18 08:47:14'),(20,2,186,652,0,'2026-03-18 08:47:13','2026-03-18 08:47:14'),(21,2,187,655,0,'2026-03-18 08:47:13','2026-03-18 08:47:14'),(22,2,188,658,0,'2026-03-18 08:47:13','2026-03-18 08:47:14'),(23,2,189,661,0,'2026-03-18 08:47:13','2026-03-18 08:47:14'),(24,2,190,664,0,'2026-03-18 08:47:13','2026-03-18 08:47:14'),(25,2,191,667,0,'2026-03-18 08:47:13','2026-03-18 08:47:14'),(26,2,192,670,0,'2026-03-18 08:47:13','2026-03-18 08:47:14'),(27,2,193,673,0,'2026-03-18 08:47:13','2026-03-18 08:47:14'),(28,2,194,676,0,'2026-03-18 08:47:13','2026-03-18 08:47:14'),(29,2,195,679,0,'2026-03-18 08:47:13','2026-03-18 08:47:14'),(30,2,196,682,0,'2026-03-18 08:47:13','2026-03-18 08:47:14'),(31,2,197,685,0,'2026-03-18 08:47:13','2026-03-18 08:47:14'),(32,2,198,688,0,'2026-03-18 08:47:13','2026-03-18 08:47:14'),(42,5,169,597,0,'2026-03-19 07:18:21','2026-03-19 07:18:51'),(43,5,170,601,0,'2026-03-19 07:18:21','2026-03-19 07:18:51'),(44,5,171,604,0,'2026-03-19 07:18:51','2026-03-19 07:18:51'),(45,5,172,608,0,'2026-03-19 07:18:51','2026-03-19 07:18:51'),(46,5,173,610,1,'2026-03-19 07:18:51','2026-03-19 07:18:51'),(47,4,217,761,0,'2026-03-19 07:19:34','2026-03-19 07:19:34'),(48,4,218,768,0,'2026-03-19 07:19:34','2026-03-19 07:19:34'),(49,4,219,772,0,'2026-03-19 07:19:34','2026-03-19 07:19:34'),(50,4,220,776,0,'2026-03-19 07:19:34','2026-03-19 07:19:34'),(51,4,221,780,0,'2026-03-19 07:19:34','2026-03-19 07:19:34'),(52,4,222,784,0,'2026-03-19 07:19:34','2026-03-19 07:19:34'),(53,4,223,788,0,'2026-03-19 07:19:34','2026-03-19 07:19:34'),(54,4,224,792,0,'2026-03-19 07:19:34','2026-03-19 07:19:34'),(55,4,225,796,0,'2026-03-19 07:19:34','2026-03-19 07:19:34'),(56,4,226,800,0,'2026-03-19 07:19:34','2026-03-19 07:19:34'),(57,4,227,804,0,'2026-03-19 07:19:34','2026-03-19 07:19:34'),(58,4,228,808,0,'2026-03-19 07:19:34','2026-03-19 07:19:34'),(59,4,229,812,0,'2026-03-19 07:19:34','2026-03-19 07:19:34'),(60,4,230,816,0,'2026-03-19 07:19:34','2026-03-19 07:19:34'),(61,4,231,820,0,'2026-03-19 07:19:34','2026-03-19 07:19:34'),(62,4,232,824,0,'2026-03-19 07:19:34','2026-03-19 07:19:34'),(63,4,233,828,0,'2026-03-19 07:19:34','2026-03-19 07:19:34'),(64,4,234,832,0,'2026-03-19 07:19:34','2026-03-19 07:19:34'),(65,4,235,836,0,'2026-03-19 07:19:34','2026-03-19 07:19:34'),(66,4,236,840,0,'2026-03-19 07:19:34','2026-03-19 07:19:34'),(67,6,168,590,NULL,'2026-03-19 07:27:08','2026-03-19 08:42:10'),(68,7,257,921,0,'2026-03-19 09:04:15','2026-03-19 09:04:15'),(69,7,258,928,0,'2026-03-19 09:04:15','2026-03-19 09:04:15'),(70,7,260,936,0,'2026-03-19 09:04:15','2026-03-19 09:04:15'),(71,7,261,940,0,'2026-03-19 09:04:15','2026-03-19 09:04:15'),(72,7,262,944,0,'2026-03-19 09:04:15','2026-03-19 09:04:15'),(73,7,263,947,0,'2026-03-19 09:04:15','2026-03-19 09:04:15'),(74,7,264,949,0,'2026-03-19 09:04:15','2026-03-19 09:04:15'),(75,8,283,1028,0,'2026-03-19 09:17:10','2026-03-19 09:17:11'),(76,8,284,1032,0,'2026-03-19 09:17:10','2026-03-19 09:17:11'),(77,8,285,1036,0,'2026-03-19 09:17:10','2026-03-19 09:17:11'),(78,8,286,1040,0,'2026-03-19 09:17:10','2026-03-19 09:17:11'),(79,8,287,1042,0,'2026-03-19 09:17:10','2026-03-19 09:17:11'),(80,8,288,1047,0,'2026-03-19 09:17:10','2026-03-19 09:17:11'),(81,8,289,1051,0,'2026-03-19 09:17:10','2026-03-19 09:17:11'),(82,8,290,1056,0,'2026-03-19 09:17:10','2026-03-19 09:17:11'),(83,8,291,1058,1,'2026-03-19 09:17:10','2026-03-19 09:17:11'),(84,8,292,1060,1,'2026-03-19 09:17:10','2026-03-19 09:17:11'),(85,8,293,1064,0,'2026-03-19 09:17:10','2026-03-19 09:17:11'),(86,8,294,1068,0,'2026-03-19 09:17:10','2026-03-19 09:17:11'),(87,8,295,1071,0,'2026-03-19 09:17:10','2026-03-19 09:17:11'),(88,8,296,1074,0,'2026-03-19 09:17:10','2026-03-19 09:17:11'),(89,8,297,1077,0,'2026-03-19 09:17:10','2026-03-19 09:17:11'),(90,8,298,1078,1,'2026-03-19 09:17:10','2026-03-19 09:17:11'),(91,8,299,1083,0,'2026-03-19 09:17:10','2026-03-19 09:17:11'),(92,8,300,1086,0,'2026-03-19 09:17:10','2026-03-19 09:17:11'),(93,8,301,1089,0,'2026-03-19 09:17:10','2026-03-19 09:17:11'),(94,8,302,1092,0,'2026-03-19 09:17:10','2026-03-19 09:17:11'),(95,8,303,1095,0,'2026-03-19 09:17:10','2026-03-19 09:17:11'),(96,8,304,1098,0,'2026-03-19 09:17:10','2026-03-19 09:17:11'),(97,8,305,1101,0,'2026-03-19 09:17:10','2026-03-19 09:17:11'),(98,8,306,1104,0,'2026-03-19 09:17:10','2026-03-19 09:17:11'),(99,8,307,1107,0,'2026-03-19 09:17:10','2026-03-19 09:17:11'),(100,8,308,1110,0,'2026-03-19 09:17:10','2026-03-19 09:17:11'),(101,8,309,1113,0,'2026-03-19 09:17:10','2026-03-19 09:17:11'),(102,8,310,1116,0,'2026-03-19 09:17:10','2026-03-19 09:17:11'),(103,8,311,1119,0,'2026-03-19 09:17:10','2026-03-19 09:17:11'),(104,8,312,1122,0,'2026-03-19 09:17:11','2026-03-19 09:17:11'),(105,8,313,1125,0,'2026-03-19 09:17:11','2026-03-19 09:17:11'),(106,8,314,1128,0,'2026-03-19 09:17:11','2026-03-19 09:17:11'),(107,8,315,1131,0,'2026-03-19 09:17:11','2026-03-19 09:17:11'),(120,11,283,1027,0,'2026-03-19 10:12:06','2026-03-19 10:12:06'),(121,11,284,1030,1,'2026-03-19 10:12:06','2026-03-19 10:12:06'),(122,11,285,1035,0,'2026-03-19 10:12:06','2026-03-19 10:12:06'),(123,11,286,1039,0,'2026-03-19 10:12:06','2026-03-19 10:12:06'),(124,11,287,1043,0,'2026-03-19 10:12:06','2026-03-19 10:12:06'),(125,11,288,1047,0,'2026-03-19 10:12:06','2026-03-19 10:12:06'),(126,11,289,1051,0,'2026-03-19 10:12:06','2026-03-19 10:12:06'),(127,11,290,1054,1,'2026-03-19 10:12:06','2026-03-19 10:12:06'),(128,12,322,1159,0,'2026-03-19 10:17:29','2026-03-19 10:17:29'),(129,12,323,1162,0,'2026-03-19 10:17:29','2026-03-19 10:17:29'),(130,12,324,1167,0,'2026-03-19 10:17:29','2026-03-19 10:17:29'),(131,12,325,1170,0,'2026-03-19 10:17:29','2026-03-19 10:17:29'),(132,15,371,1354,0,'2026-03-19 10:29:19','2026-03-19 10:29:19'),(133,15,372,1356,0,'2026-03-19 10:29:19','2026-03-19 10:29:19'),(134,15,373,1361,1,'2026-03-19 10:29:19','2026-03-19 10:29:19'),(135,15,374,1366,0,'2026-03-19 10:29:19','2026-03-19 10:29:19'),(136,15,375,1371,0,'2026-03-19 10:29:19','2026-03-19 10:29:19'),(137,15,376,1374,0,'2026-03-19 10:29:19','2026-03-19 10:29:19'),(138,15,377,1378,0,'2026-03-19 10:29:19','2026-03-19 10:29:19'),(139,16,168,592,0,'2026-03-25 11:23:24','2026-03-25 11:23:27'),(140,16,169,597,0,'2026-03-25 11:23:24','2026-03-25 11:23:27'),(141,16,170,601,0,'2026-03-25 11:23:24','2026-03-25 11:23:27'),(142,16,171,605,0,'2026-03-25 11:23:24','2026-03-25 11:23:27'),(143,16,172,609,0,'2026-03-25 11:23:24','2026-03-25 11:23:27'),(144,16,173,613,0,'2026-03-25 11:23:24','2026-03-25 11:23:27'),(145,16,174,614,0,'2026-03-25 11:23:24','2026-03-25 11:23:27'),(146,16,175,618,0,'2026-03-25 11:23:24','2026-03-25 11:23:27'),(147,16,176,621,0,'2026-03-25 11:23:24','2026-03-25 11:23:27'),(148,16,177,624,0,'2026-03-25 11:23:24','2026-03-25 11:23:27'),(149,16,178,628,0,'2026-03-25 11:23:24','2026-03-25 11:23:27'),(150,17,380,1390,0,'2026-03-26 07:15:39','2026-03-26 07:15:39'),(151,17,381,1395,0,'2026-03-26 07:15:39','2026-03-26 07:15:39'),(152,17,382,1399,0,'2026-03-26 07:15:39','2026-03-26 07:15:39'),(153,17,383,1403,0,'2026-03-26 07:15:39','2026-03-26 07:15:39'),(154,20,384,1404,1,'2026-03-29 15:24:59','2026-03-29 15:24:59'),(155,20,385,1409,0,'2026-03-29 15:24:59','2026-03-29 15:24:59'),(156,20,386,1414,0,'2026-03-29 15:24:59','2026-03-29 15:24:59'),(157,20,387,1418,0,'2026-03-29 15:24:59','2026-03-29 15:24:59'),(158,20,388,1423,0,'2026-03-29 15:24:59','2026-03-29 15:24:59'),(159,20,389,1426,0,'2026-03-29 15:24:59','2026-03-29 15:24:59'),(160,20,390,1429,1,'2026-03-29 15:24:59','2026-03-29 15:24:59'),(161,20,391,1434,1,'2026-03-29 15:24:59','2026-03-29 15:24:59'),(162,20,392,1438,1,'2026-03-29 15:24:59','2026-03-29 15:24:59'),(163,22,404,1484,0,'2026-03-29 15:27:17','2026-03-29 15:27:17'),(164,22,405,1490,0,'2026-03-29 15:27:17','2026-03-29 15:27:17'),(165,22,406,1495,0,'2026-03-29 15:27:17','2026-03-29 15:27:17'),(166,22,407,1498,0,'2026-03-29 15:27:17','2026-03-29 15:27:17'),(167,22,408,1500,0,'2026-03-29 15:27:17','2026-03-29 15:27:17'),(168,33,168,591,0,'2026-03-30 07:50:46','2026-03-30 07:50:46'),(169,33,169,596,0,'2026-03-30 07:50:46','2026-03-30 07:50:46'),(170,33,170,601,0,'2026-03-30 07:50:46','2026-03-30 07:50:47'),(171,33,171,604,0,'2026-03-30 07:50:46','2026-03-30 07:50:47'),(172,33,172,609,0,'2026-03-30 07:50:46','2026-03-30 07:50:47'),(173,33,173,613,0,'2026-03-30 07:50:46','2026-03-30 07:50:47'),(174,33,174,616,0,'2026-03-30 07:50:46','2026-03-30 07:50:47'),(175,33,175,618,0,'2026-03-30 07:50:46','2026-03-30 07:50:47'),(176,33,176,621,0,'2026-03-30 07:50:46','2026-03-30 07:50:47'),(177,33,177,624,0,'2026-03-30 07:50:46','2026-03-30 07:50:47'),(178,33,178,627,0,'2026-03-30 07:50:46','2026-03-30 07:50:47'),(179,33,179,629,1,'2026-03-30 07:50:46','2026-03-30 07:50:47'),(180,33,180,633,0,'2026-03-30 07:50:46','2026-03-30 07:50:47'),(181,33,181,636,0,'2026-03-30 07:50:46','2026-03-30 07:50:47'),(182,34,384,1404,1,'2026-03-30 08:43:33','2026-03-30 08:47:50'),(183,34,385,1411,0,'2026-03-30 08:43:33','2026-03-30 08:47:50'),(184,34,386,1413,1,'2026-03-30 08:43:33','2026-03-30 08:47:50'),(185,34,387,1418,0,'2026-03-30 08:43:33','2026-03-30 08:47:50'),(186,34,388,1421,1,'2026-03-30 08:43:33','2026-03-30 08:47:50'),(187,34,389,1425,1,'2026-03-30 08:43:33','2026-03-30 08:47:50'),(188,34,390,1430,0,'2026-03-30 08:43:33','2026-03-30 08:47:50'),(189,34,391,1434,1,'2026-03-30 08:43:33','2026-03-30 08:47:50'),(190,34,392,1439,0,'2026-03-30 08:43:33','2026-03-30 08:47:50'),(191,34,393,1443,0,'2026-03-30 08:43:33','2026-03-30 08:47:50'),(192,34,394,1447,0,'2026-03-30 08:43:33','2026-03-30 08:47:50'),(193,34,395,1451,0,'2026-03-30 08:43:33','2026-03-30 08:47:50'),(194,34,396,1455,0,'2026-03-30 08:43:33','2026-03-30 08:47:50'),(195,34,397,1459,0,'2026-03-30 08:43:33','2026-03-30 08:47:50'),(196,34,398,1462,1,'2026-03-30 08:43:33','2026-03-30 08:47:50'),(197,34,399,1466,0,'2026-03-30 08:43:33','2026-03-30 08:47:50'),(198,34,400,1470,1,'2026-03-30 08:43:33','2026-03-30 08:47:50'),(199,34,401,1474,1,'2026-03-30 08:43:33','2026-03-30 08:47:50'),(200,34,402,1478,0,'2026-03-30 08:43:33','2026-03-30 08:47:50'),(201,34,403,1482,0,'2026-03-30 08:43:33','2026-03-30 08:47:50'),(202,34,404,1486,0,'2026-03-30 08:43:33','2026-03-30 08:47:50'),(203,34,405,1490,0,'2026-03-30 08:43:33','2026-03-30 08:47:50'),(204,34,406,1494,0,'2026-03-30 08:43:33','2026-03-30 08:47:50'),(205,34,407,1498,0,'2026-03-30 08:43:33','2026-03-30 08:47:50'),(206,34,408,1502,0,'2026-03-30 08:43:33','2026-03-30 08:47:50'),(207,35,384,1404,NULL,'2026-03-30 09:39:10','2026-03-30 09:39:10'),(208,35,385,1410,NULL,'2026-03-30 09:39:10','2026-03-30 09:39:10'),(209,35,386,1413,NULL,'2026-03-30 09:39:10','2026-03-30 09:39:10'),(210,35,387,1418,NULL,'2026-03-30 09:39:10','2026-03-30 09:39:10'),(211,35,388,1422,NULL,'2026-03-30 09:39:10','2026-03-30 09:39:10'),(212,36,384,1404,1,'2026-03-30 09:39:55','2026-03-30 09:43:28'),(213,36,385,1408,0,'2026-03-30 09:39:55','2026-03-30 09:43:28'),(214,36,386,1413,1,'2026-03-30 09:39:55','2026-03-30 09:43:28'),(215,36,387,1419,0,'2026-03-30 09:39:55','2026-03-30 09:43:28'),(216,36,388,1423,0,'2026-03-30 09:39:55','2026-03-30 09:43:28'),(217,36,389,1427,0,'2026-03-30 09:39:55','2026-03-30 09:43:28'),(218,36,390,1431,0,'2026-03-30 09:39:55','2026-03-30 09:43:28'),(219,36,391,1435,0,'2026-03-30 09:39:55','2026-03-30 09:43:28'),(220,36,392,1439,0,'2026-03-30 09:39:55','2026-03-30 09:43:28'),(221,36,393,1443,0,'2026-03-30 09:39:55','2026-03-30 09:43:28'),(222,36,394,1447,0,'2026-03-30 09:39:55','2026-03-30 09:43:28'),(223,36,395,1451,0,'2026-03-30 09:39:55','2026-03-30 09:43:28'),(224,36,396,1455,0,'2026-03-30 09:39:55','2026-03-30 09:43:28'),(225,36,397,1459,0,'2026-03-30 09:39:55','2026-03-30 09:43:28'),(226,36,399,1467,0,'2026-03-30 09:39:55','2026-03-30 09:43:28'),(227,36,400,1471,0,'2026-03-30 09:39:55','2026-03-30 09:43:28'),(228,36,401,1475,0,'2026-03-30 09:39:55','2026-03-30 09:43:28'),(229,36,402,1479,0,'2026-03-30 09:39:55','2026-03-30 09:43:28'),(230,36,403,1483,0,'2026-03-30 09:39:55','2026-03-30 09:43:28'),(231,36,404,1487,0,'2026-03-30 09:39:55','2026-03-30 09:43:28'),(232,36,405,1491,0,'2026-03-30 09:39:55','2026-03-30 09:43:28'),(233,36,406,1495,0,'2026-03-30 09:39:55','2026-03-30 09:43:28'),(234,36,407,1499,0,'2026-03-30 09:39:55','2026-03-30 09:43:28'),(235,36,408,1503,0,'2026-03-30 09:39:55','2026-03-30 09:43:28'),(236,37,384,1404,1,'2026-03-30 09:58:58','2026-03-30 10:02:05'),(237,37,385,1408,0,'2026-03-30 09:58:58','2026-03-30 10:02:05'),(238,37,386,1412,0,'2026-03-30 09:58:58','2026-03-30 10:02:05'),(239,37,387,1416,1,'2026-03-30 09:58:58','2026-03-30 10:02:05'),(240,37,388,1420,0,'2026-03-30 09:58:58','2026-03-30 10:02:05'),(241,37,389,1424,0,'2026-03-30 09:58:58','2026-03-30 10:02:05'),(242,37,390,1428,0,'2026-03-30 09:58:58','2026-03-30 10:02:05'),(243,37,391,1432,0,'2026-03-30 09:58:58','2026-03-30 10:02:05'),(244,37,392,1436,0,'2026-03-30 09:58:58','2026-03-30 10:02:05'),(245,37,393,1440,0,'2026-03-30 09:58:58','2026-03-30 10:02:05'),(246,37,394,1444,0,'2026-03-30 09:58:58','2026-03-30 10:02:05'),(247,37,395,1448,0,'2026-03-30 09:58:58','2026-03-30 10:02:05'),(248,37,396,1452,1,'2026-03-30 09:58:58','2026-03-30 10:02:05'),(249,37,397,1456,0,'2026-03-30 09:58:58','2026-03-30 10:02:05'),(250,37,398,1460,0,'2026-03-30 09:58:58','2026-03-30 10:02:05'),(251,37,399,1464,0,'2026-03-30 09:58:58','2026-03-30 10:02:05'),(252,37,400,1468,0,'2026-03-30 09:58:58','2026-03-30 10:02:05'),(253,37,401,1472,0,'2026-03-30 09:58:58','2026-03-30 10:02:05'),(254,37,402,1476,0,'2026-03-30 09:58:58','2026-03-30 10:02:05'),(255,37,403,1480,0,'2026-03-30 09:58:58','2026-03-30 10:02:05'),(256,37,404,1484,0,'2026-03-30 09:58:58','2026-03-30 10:02:05'),(257,37,405,1488,1,'2026-03-30 09:58:58','2026-03-30 10:02:05'),(258,37,406,1492,0,'2026-03-30 09:58:58','2026-03-30 10:02:05'),(259,37,407,1496,0,'2026-03-30 09:58:58','2026-03-30 10:02:05'),(260,37,408,1500,0,'2026-03-30 09:58:58','2026-03-30 10:02:05');
/*!40000 ALTER TABLE `user_answers` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user_courses`
--

DROP TABLE IF EXISTS `user_courses`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user_courses` (
  `user_course_id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `course_id` int NOT NULL,
  `started_at` datetime DEFAULT NULL,
  `completed_at` datetime DEFAULT NULL,
  `progress_percentage` float NOT NULL DEFAULT '0',
  `is_completed` tinyint(1) NOT NULL DEFAULT '0',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`user_course_id`),
  KEY `user_id` (`user_id`),
  KEY `course_id` (`course_id`),
  CONSTRAINT `user_courses_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE,
  CONSTRAINT `user_courses_ibfk_2` FOREIGN KEY (`course_id`) REFERENCES `courses` (`course_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_courses`
--

LOCK TABLES `user_courses` WRITE;
/*!40000 ALTER TABLE `user_courses` DISABLE KEYS */;
INSERT INTO `user_courses` VALUES (1,4,1,'2026-03-12 07:33:50','2026-03-12 08:13:57',100,1,'2026-03-12 07:33:50','2026-03-12 08:13:57');
/*!40000 ALTER TABLE `user_courses` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user_exam_stats`
--

DROP TABLE IF EXISTS `user_exam_stats`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user_exam_stats` (
  `user_exam_stats_id` int NOT NULL AUTO_INCREMENT,
  `exam_id` int NOT NULL,
  `user_id` int NOT NULL,
  `total_correct` int NOT NULL DEFAULT '0',
  `total_wrong` int NOT NULL DEFAULT '0',
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  `weakness_type` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`user_exam_stats_id`),
  KEY `exam_id` (`exam_id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `user_exam_stats_ibfk_1` FOREIGN KEY (`exam_id`) REFERENCES `exams` (`exam_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `user_exam_stats_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_exam_stats`
--

LOCK TABLES `user_exam_stats` WRITE;
/*!40000 ALTER TABLE `user_exam_stats` DISABLE KEYS */;
INSERT INTO `user_exam_stats` VALUES (1,1,4,0,11,'2026-03-25 11:23:27','2026-03-25 11:23:27',NULL),(2,2,4,1,13,'2026-03-26 07:15:39','2026-03-30 07:50:47','[{\"type\":\"listening_photographs\",\"wrong_count\":13}]'),(3,3,4,4,21,'2026-03-29 15:24:59','2026-03-30 10:02:05','[{\"type\":\"reading_matching_headings\",\"wrong_count\":21}]');
/*!40000 ALTER TABLE `user_exam_stats` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user_exams`
--

DROP TABLE IF EXISTS `user_exams`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user_exams` (
  `user_exam_id` int NOT NULL AUTO_INCREMENT,
  `user_id` int DEFAULT NULL,
  `exam_id` int DEFAULT NULL,
  `selected_parts` json NOT NULL,
  `started_at` datetime NOT NULL,
  `submitted_at` datetime NOT NULL,
  `status` enum('submitted','graded','revised') NOT NULL,
  `total_score` float DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`user_exam_id`),
  KEY `user_id` (`user_id`),
  KEY `exam_id` (`exam_id`),
  CONSTRAINT `user_exams_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `user_exams_ibfk_2` FOREIGN KEY (`exam_id`) REFERENCES `exams` (`exam_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=39 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_exams`
--

LOCK TABLES `user_exams` WRITE;
/*!40000 ALTER TABLE `user_exams` DISABLE KEYS */;
INSERT INTO `user_exams` VALUES (1,4,1,'0','2026-03-16 09:40:05','2026-03-16 09:43:11','graded',0,'2026-03-16 09:40:05','2026-03-16 09:43:11'),(2,4,1,'0','2026-03-16 09:40:05','2026-03-18 08:47:14','graded',1,'2026-03-16 09:40:05','2026-03-18 08:47:14'),(3,4,2,'[\"all\"]','2026-03-19 07:02:35','2026-03-19 07:02:35','submitted',NULL,'2026-03-19 07:02:35','2026-03-19 07:02:35'),(4,4,2,'[\"27\"]','2026-03-19 07:07:38','2026-03-19 07:19:34','graded',0,'2026-03-19 07:07:38','2026-03-19 07:19:34'),(5,4,2,'[\"19\"]','2026-03-19 07:16:57','2026-03-19 07:18:51','graded',1,'2026-03-19 07:16:57','2026-03-19 07:18:51'),(6,4,2,'[\"19\"]','2026-03-19 07:26:31','2026-03-19 07:26:31','submitted',NULL,'2026-03-19 07:26:31','2026-03-19 07:26:31'),(7,4,2,'[\"28\"]','2026-03-19 09:03:55','2026-03-19 09:04:15','graded',0,'2026-03-19 09:03:55','2026-03-19 09:04:15'),(8,4,1,'[\"all\"]','2026-03-19 09:15:27','2026-03-19 09:17:11','graded',15,'2026-03-19 09:15:27','2026-03-19 09:17:11'),(9,4,1,'[\"all\"]','2026-03-19 10:07:20','2026-03-19 10:09:43','graded',0,'2026-03-19 10:07:20','2026-03-19 10:09:43'),(10,4,1,'[\"35\"]','2026-03-19 10:09:53','2026-03-19 10:11:04','graded',0,'2026-03-19 10:09:53','2026-03-19 10:11:04'),(11,4,1,'[\"37\"]','2026-03-19 10:11:44','2026-03-19 10:12:06','graded',10,'2026-03-19 10:11:44','2026-03-19 10:12:06'),(12,4,1,'[\"40\"]','2026-03-19 10:12:14','2026-03-19 10:17:29','graded',0,'2026-03-19 10:12:14','2026-03-19 10:17:29'),(13,4,1,'[\"all\"]','2026-03-19 10:17:36','2026-03-19 10:17:36','submitted',NULL,'2026-03-19 10:17:36','2026-03-19 10:17:36'),(14,4,1,'[\"all\"]','2026-03-19 10:28:18','2026-03-19 10:28:18','submitted',NULL,'2026-03-19 10:28:18','2026-03-19 10:28:18'),(15,4,1,'[\"45\"]','2026-03-19 10:28:31','2026-03-19 10:29:19','graded',1,'2026-03-19 10:28:31','2026-03-19 10:29:19'),(16,4,1,'[\"all\"]','2026-03-19 11:42:31','2026-03-25 11:23:27','graded',0,'2026-03-19 11:42:31','2026-03-25 11:23:27'),(17,4,2,'[\"all\"]','2026-03-26 07:07:03','2026-03-26 07:15:39','graded',0,'2026-03-26 07:07:03','2026-03-26 07:15:39'),(18,4,3,'[\"all\"]','2026-03-28 16:49:41','2026-03-28 16:49:41','submitted',NULL,'2026-03-28 16:49:41','2026-03-28 16:49:41'),(19,4,2,'[\"all\"]','2026-03-28 16:49:44','2026-03-28 16:49:44','submitted',NULL,'2026-03-28 16:49:44','2026-03-28 16:49:44'),(20,4,3,'[\"48\"]','2026-03-29 15:24:31','2026-03-29 15:24:59','graded',4,'2026-03-29 15:24:31','2026-03-29 15:24:59'),(21,4,3,'[\"50\"]','2026-03-29 15:25:51','2026-03-29 15:25:51','submitted',NULL,'2026-03-29 15:25:51','2026-03-29 15:25:51'),(22,4,3,'[\"50\"]','2026-03-29 15:27:05','2026-03-29 15:27:17','graded',0,'2026-03-29 15:27:05','2026-03-29 15:27:17'),(23,4,3,'[\"51\"]','2026-03-29 15:27:26','2026-03-29 15:27:26','submitted',NULL,'2026-03-29 15:27:26','2026-03-29 15:27:26'),(24,4,3,'[\"50\"]','2026-03-29 15:59:27','2026-03-29 15:59:27','submitted',NULL,'2026-03-29 15:59:27','2026-03-29 15:59:27'),(25,4,3,'[\"51\"]','2026-03-29 15:59:37','2026-03-29 15:59:37','submitted',NULL,'2026-03-29 15:59:37','2026-03-29 15:59:37'),(26,4,3,'[\"52\"]','2026-03-29 16:16:28','2026-03-29 16:16:28','submitted',NULL,'2026-03-29 16:16:28','2026-03-29 16:16:28'),(27,4,3,'[\"51\"]','2026-03-29 16:51:18','2026-03-29 16:52:32','graded',0,'2026-03-29 16:51:18','2026-03-29 16:52:32'),(28,4,3,'[\"51\"]','2026-03-29 17:03:23','2026-03-29 17:11:16','graded',0,'2026-03-29 17:03:23','2026-03-29 17:11:16'),(29,4,3,'[\"51\", \"54\"]','2026-03-29 17:34:21','2026-03-29 17:34:37','graded',0,'2026-03-29 17:34:21','2026-03-29 17:34:37'),(30,4,3,'[\"51\", \"54\"]','2026-03-30 05:33:05','2026-03-30 05:39:45','graded',0,'2026-03-30 05:33:05','2026-03-30 05:39:45'),(31,4,3,'[\"52\", \"53\"]','2026-03-30 06:32:45','2026-03-30 06:32:45','submitted',NULL,'2026-03-30 06:32:45','2026-03-30 06:32:45'),(32,4,3,'[\"52\", \"53\"]','2026-03-30 07:39:45','2026-03-30 07:43:05','graded',0,'2026-03-30 07:39:45','2026-03-30 07:43:05'),(33,4,2,'[\"all\"]','2026-03-30 07:50:28','2026-03-30 07:50:47','graded',1,'2026-03-30 07:50:28','2026-03-30 07:50:47'),(34,4,3,'[\"all\"]','2026-03-30 08:42:30','2026-03-30 08:47:50','graded',8,'2026-03-30 08:42:30','2026-03-30 08:47:50'),(35,4,3,'[\"all\"]','2026-03-30 09:14:05','2026-03-30 09:14:05','submitted',NULL,'2026-03-30 09:14:05','2026-03-30 09:14:05'),(36,4,3,'[\"all\"]','2026-03-30 09:39:19','2026-03-30 09:43:28','graded',2,'2026-03-30 09:39:19','2026-03-30 09:43:28'),(37,4,3,'[\"all\"]','2026-03-30 09:58:04','2026-03-30 10:02:05','graded',4,'2026-03-30 09:58:04','2026-03-30 10:02:05'),(38,4,3,'[\"all\"]','2026-03-30 10:34:05','2026-03-30 10:34:05','submitted',NULL,'2026-03-30 10:34:05','2026-03-30 10:34:05');
/*!40000 ALTER TABLE `user_exams` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user_flashcard_progress`
--

DROP TABLE IF EXISTS `user_flashcard_progress`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user_flashcard_progress` (
  `progress_id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `flashcard_id` int NOT NULL,
  `repetition_count` int NOT NULL DEFAULT '0',
  `ease_factor` float NOT NULL DEFAULT '2.5',
  `interval_days` int NOT NULL DEFAULT '0',
  `next_review_at` datetime DEFAULT NULL,
  `last_reviewed_at` datetime DEFAULT NULL,
  `last_core` enum('again','hard','good','easy') DEFAULT NULL,
  PRIMARY KEY (`progress_id`),
  KEY `user_id` (`user_id`),
  KEY `user_flashcard_progress_ibfk_2` (`flashcard_id`),
  CONSTRAINT `user_flashcard_progress_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `user_flashcard_progress_ibfk_2` FOREIGN KEY (`flashcard_id`) REFERENCES `flashcards` (`flashcard_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_flashcard_progress`
--

LOCK TABLES `user_flashcard_progress` WRITE;
/*!40000 ALTER TABLE `user_flashcard_progress` DISABLE KEYS */;
/*!40000 ALTER TABLE `user_flashcard_progress` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user_flashcard_sets`
--

DROP TABLE IF EXISTS `user_flashcard_sets`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user_flashcard_sets` (
  `user_flashcard_set_id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `flashcard_set_id` int NOT NULL,
  `started_at` datetime DEFAULT NULL,
  `progress_percent` float DEFAULT NULL,
  `status` enum('active','completed','archived') NOT NULL DEFAULT 'active',
  PRIMARY KEY (`user_flashcard_set_id`),
  KEY `user_id` (`user_id`),
  KEY `user_flashcard_sets_ibfk_2` (`flashcard_set_id`),
  CONSTRAINT `user_flashcard_sets_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `user_flashcard_sets_ibfk_2` FOREIGN KEY (`flashcard_set_id`) REFERENCES `flashcard_sets` (`flashcard_set_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_flashcard_sets`
--

LOCK TABLES `user_flashcard_sets` WRITE;
/*!40000 ALTER TABLE `user_flashcard_sets` DISABLE KEYS */;
/*!40000 ALTER TABLE `user_flashcard_sets` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user_lesson_progress`
--

DROP TABLE IF EXISTS `user_lesson_progress`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user_lesson_progress` (
  `user_lesson_progress_id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `lesson_id` int NOT NULL,
  `progress_percentage` float NOT NULL DEFAULT '0',
  `is_completed` tinyint(1) NOT NULL DEFAULT '0',
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `started_at` datetime DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `completed_at` datetime DEFAULT NULL,
  PRIMARY KEY (`user_lesson_progress_id`),
  KEY `user_id` (`user_id`),
  KEY `lesson_id` (`lesson_id`),
  CONSTRAINT `user_lesson_progress_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE,
  CONSTRAINT `user_lesson_progress_ibfk_2` FOREIGN KEY (`lesson_id`) REFERENCES `lessons` (`lesson_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_lesson_progress`
--

LOCK TABLES `user_lesson_progress` WRITE;
/*!40000 ALTER TABLE `user_lesson_progress` DISABLE KEYS */;
INSERT INTO `user_lesson_progress` VALUES (1,4,1,100,1,'2026-03-12 08:13:57','2026-03-12 08:13:57','2026-03-12 08:13:57','2026-03-12 08:13:57');
/*!40000 ALTER TABLE `user_lesson_progress` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user_roadmaps`
--

DROP TABLE IF EXISTS `user_roadmaps`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user_roadmaps` (
  `user_roadmap_id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `roadmap_id` int NOT NULL,
  `started_at` datetime DEFAULT NULL,
  `completed_at` datetime DEFAULT NULL,
  `progress_percentage` float NOT NULL DEFAULT '0',
  `is_completed` tinyint(1) NOT NULL DEFAULT '0',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`user_roadmap_id`),
  KEY `user_id` (`user_id`),
  KEY `roadmap_id` (`roadmap_id`),
  CONSTRAINT `user_roadmaps_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE,
  CONSTRAINT `user_roadmaps_ibfk_2` FOREIGN KEY (`roadmap_id`) REFERENCES `roadmaps` (`roadmap_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_roadmaps`
--

LOCK TABLES `user_roadmaps` WRITE;
/*!40000 ALTER TABLE `user_roadmaps` DISABLE KEYS */;
/*!40000 ALTER TABLE `user_roadmaps` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user_subscriptions`
--

DROP TABLE IF EXISTS `user_subscriptions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user_subscriptions` (
  `user_subscription_id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `started_at` datetime NOT NULL,
  `expired_at` datetime DEFAULT NULL,
  `status` enum('active','expired','canceled') NOT NULL DEFAULT 'active',
  `subscription_price_id` int NOT NULL,
  `order_id` int DEFAULT NULL,
  PRIMARY KEY (`user_subscription_id`),
  KEY `user_id` (`user_id`),
  KEY `user_subscriptions_subscription_price_id_foreign_idx` (`subscription_price_id`),
  KEY `user_subscriptions_order_id_foreign_idx` (`order_id`),
  CONSTRAINT `user_subscriptions_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `user_subscriptions_order_id_foreign_idx` FOREIGN KEY (`order_id`) REFERENCES `orders` (`order_id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `user_subscriptions_subscription_price_id_foreign_idx` FOREIGN KEY (`subscription_price_id`) REFERENCES `subscription_prices` (`subscription_price_id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_subscriptions`
--

LOCK TABLES `user_subscriptions` WRITE;
/*!40000 ALTER TABLE `user_subscriptions` DISABLE KEYS */;
INSERT INTO `user_subscriptions` VALUES (1,1,'2026-03-08 16:31:03',NULL,'active',1,NULL),(2,2,'2026-03-08 16:31:03',NULL,'active',1,NULL),(3,3,'2026-03-08 16:31:03',NULL,'active',1,NULL),(4,4,'2026-03-10 06:54:45','2026-04-09 06:54:45','active',6,35);
/*!40000 ALTER TABLE `user_subscriptions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user_token_transactions`
--

DROP TABLE IF EXISTS `user_token_transactions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user_token_transactions` (
  `transaction_id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `amount` int NOT NULL,
  `transaction_type` enum('subscription_grant','usage','purchase','bonus') NOT NULL,
  `reference_id` int DEFAULT NULL,
  `created_at` datetime NOT NULL,
  `tokens_used` int DEFAULT NULL,
  `const_usd` float NOT NULL DEFAULT '0',
  `ai_model` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`transaction_id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `user_token_transactions_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=67 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_token_transactions`
--

LOCK TABLES `user_token_transactions` WRITE;
/*!40000 ALTER TABLE `user_token_transactions` DISABLE KEYS */;
INSERT INTO `user_token_transactions` VALUES (1,4,50000,'subscription_grant',4,'2026-03-10 06:54:45',0,0,NULL),(2,4,-1,'usage',NULL,'2026-03-24 09:15:05',NULL,0,NULL),(3,4,-1,'usage',NULL,'2026-03-24 09:15:20',NULL,0,NULL),(4,4,-1,'usage',NULL,'2026-03-24 09:29:29',NULL,0,NULL),(5,4,-7,'usage',NULL,'2026-03-25 11:23:37',NULL,0,NULL),(6,4,-7,'usage',NULL,'2026-03-25 11:23:37',NULL,0,NULL),(7,4,-4,'usage',NULL,'2026-03-25 11:26:10',NULL,0,NULL),(8,4,-4,'usage',NULL,'2026-03-25 11:59:29',NULL,0,NULL),(9,4,-1,'usage',NULL,'2026-03-26 04:09:12',NULL,0,NULL),(10,4,-4,'usage',NULL,'2026-03-26 04:20:06',NULL,0,NULL),(11,4,-7,'usage',NULL,'2026-03-26 04:49:32',NULL,0,NULL),(12,4,-7,'usage',NULL,'2026-03-26 04:49:32',NULL,0,NULL),(13,4,-1,'usage',NULL,'2026-03-26 05:32:07',NULL,0,NULL),(14,4,-1,'usage',NULL,'2026-03-26 05:32:25',NULL,0,NULL),(15,4,-1,'usage',NULL,'2026-03-26 05:32:49',NULL,0,NULL),(16,4,-1,'usage',NULL,'2026-03-26 06:14:04',NULL,0,NULL),(17,4,-1,'usage',NULL,'2026-03-26 06:14:27',NULL,0,NULL),(18,4,-4,'usage',NULL,'2026-03-26 07:15:46',NULL,0,NULL),(19,4,-5,'usage',NULL,'2026-03-26 07:15:47',NULL,0,NULL),(20,4,-2,'usage',NULL,'2026-03-28 17:05:17',NULL,0,NULL),(21,4,-2,'usage',NULL,'2026-03-28 17:05:17',NULL,0,NULL),(22,4,-7,'usage',NULL,'2026-03-29 15:25:06',NULL,0,NULL),(23,4,-7,'usage',NULL,'2026-03-29 15:25:07',NULL,0,NULL),(24,4,-5,'usage',NULL,'2026-03-29 15:27:26',NULL,0,NULL),(25,4,-5,'usage',NULL,'2026-03-29 15:27:27',NULL,0,NULL),(26,4,-2,'usage',NULL,'2026-03-29 16:01:16',NULL,0,NULL),(27,4,-2,'usage',NULL,'2026-03-29 16:01:17',NULL,0,NULL),(28,4,-2,'usage',NULL,'2026-03-29 16:52:42',NULL,0,NULL),(29,4,-2,'usage',NULL,'2026-03-29 16:52:42',NULL,0,NULL),(30,4,-3,'usage',4,'2026-03-29 17:08:59',NULL,0,NULL),(31,4,-2,'usage',NULL,'2026-03-29 17:11:24',NULL,0,NULL),(32,4,-2,'usage',NULL,'2026-03-29 17:11:25',NULL,0,NULL),(33,4,-2,'usage',NULL,'2026-03-29 17:11:51',NULL,0,NULL),(34,4,-2,'usage',NULL,'2026-03-29 17:11:51',NULL,0,NULL),(35,4,-2,'usage',NULL,'2026-03-29 17:34:43',NULL,0,NULL),(36,4,-2,'usage',NULL,'2026-03-29 17:34:44',NULL,0,NULL),(37,4,-2,'usage',NULL,'2026-03-29 17:34:59',NULL,0,NULL),(38,4,-2,'usage',NULL,'2026-03-29 17:34:59',NULL,0,NULL),(39,4,-2,'usage',NULL,'2026-03-29 17:44:56',NULL,0,NULL),(40,4,-2,'usage',NULL,'2026-03-29 17:44:57',NULL,0,NULL),(41,4,-2,'usage',NULL,'2026-03-30 05:24:20',NULL,0,NULL),(42,4,-2,'usage',NULL,'2026-03-30 05:24:20',NULL,0,NULL),(43,4,-5,'usage',30,'2026-03-30 05:39:23',NULL,0,NULL),(44,4,-5,'usage',NULL,'2026-03-30 05:39:53',NULL,0,NULL),(45,4,-5,'usage',NULL,'2026-03-30 05:39:54',NULL,0,NULL),(46,4,-5,'usage',NULL,'2026-03-30 05:40:07',NULL,0,NULL),(47,4,-5,'usage',NULL,'2026-03-30 07:43:12',NULL,0,NULL),(48,4,-5,'usage',NULL,'2026-03-30 07:43:15',NULL,0,NULL),(49,4,-9,'usage',NULL,'2026-03-30 07:50:54',NULL,0,NULL),(50,4,-9,'usage',NULL,'2026-03-30 07:50:55',NULL,0,NULL),(51,4,-5,'usage',34,'2026-03-30 08:47:39',NULL,0,NULL),(52,4,-19,'usage',NULL,'2026-03-30 08:47:59',NULL,0,NULL),(53,4,-19,'usage',NULL,'2026-03-30 08:48:05',NULL,0,NULL),(54,4,-5,'usage',36,'2026-03-30 09:43:15',NULL,0,NULL),(55,4,-19,'usage',NULL,'2026-03-30 09:43:41',NULL,0,NULL),(56,4,-19,'usage',NULL,'2026-03-30 09:43:44',NULL,0,NULL),(57,4,-5,'usage',37,'2026-03-30 10:01:21',NULL,0,NULL),(58,4,-20,'usage',NULL,'2026-03-30 10:02:15',NULL,0,NULL),(59,4,-20,'usage',NULL,'2026-03-30 10:02:30',NULL,0,NULL),(60,4,-21,'usage',NULL,'2026-03-30 10:07:33',NULL,0,NULL),(61,4,-21,'usage',NULL,'2026-03-30 10:09:41',NULL,0,NULL),(62,4,-21,'usage',NULL,'2026-03-30 10:09:58',NULL,0,NULL),(63,4,-5,'usage',NULL,'2026-03-30 10:10:09',NULL,0,NULL),(64,4,-5,'usage',NULL,'2026-03-30 10:10:09',NULL,0,NULL),(65,4,-10,'usage',NULL,'2026-03-30 10:10:27',NULL,0,NULL),(66,4,-10,'usage',NULL,'2026-03-30 10:10:28',NULL,0,NULL);
/*!40000 ALTER TABLE `user_token_transactions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user_token_wallets`
--

DROP TABLE IF EXISTS `user_token_wallets`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user_token_wallets` (
  `wallet_id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `token_balance` int NOT NULL DEFAULT '0',
  `updated_at` datetime NOT NULL,
  PRIMARY KEY (`wallet_id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `user_token_wallets_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_token_wallets`
--

LOCK TABLES `user_token_wallets` WRITE;
/*!40000 ALTER TABLE `user_token_wallets` DISABLE KEYS */;
INSERT INTO `user_token_wallets` VALUES (4,1,0,'2026-03-02 05:10:18'),(5,2,0,'2026-03-02 05:10:18'),(6,3,0,'2026-03-02 05:10:18'),(7,4,29609,'2026-03-30 10:10:28');
/*!40000 ALTER TABLE `user_token_wallets` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `user_id` int NOT NULL AUTO_INCREMENT,
  `user_name` varchar(50) NOT NULL,
  `user_password` varchar(256) NOT NULL,
  `full_name` varchar(100) DEFAULT NULL,
  `user_email` varchar(255) NOT NULL,
  `user_phone` char(10) DEFAULT NULL,
  `user_address` text,
  `avatar` varchar(255) DEFAULT NULL,
  `role` int NOT NULL,
  `user_level` varchar(4) DEFAULT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  `user_status` tinyint(1) DEFAULT NULL,
  `google_id` varchar(100) DEFAULT NULL,
  `facebook_id` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'admin','$2b$10$SxBOCvTTY7TdmiZbLoN8MuJgliA7tgKtHr1xiTmT5RU2uXBjOEMie',NULL,'admin_enggo@gmail.com',NULL,NULL,'https://res.cloudinary.com/damxodpnw/image/upload/v1774022226/enggo/avatars/p7noktbe869fy1c82sh5.jpg',1,NULL,'2026-01-05 08:42:19','2026-03-20 15:57:04',1,NULL,NULL),(2,'kun.xxx.1872@gmail.com','','Trí Đào','kun.xxx.1872@gmail.com','0987654321','613 Au Co','https://res.cloudinary.com/damxodpnw/image/upload/v1768032505/enggo/avatars/jwc8zbsik3n908ojjecs.jpg',2,NULL,'2026-01-05 08:43:37','2026-01-10 08:08:23',1,'104970563145335213996',NULL),(3,'tungkhi','$2b$10$.IXc.hr03Lprhmx7crkAXuUnuYtYq/DjvztpS9Uqohw3/SSp0MjHW','Chau Thanh Tung','chauthanhtung2211@gmail.com',NULL,NULL,NULL,2,NULL,'2026-01-08 02:34:03','2026-01-08 03:02:06',0,NULL,NULL),(4,'daohuutri04@gmail.com','','Trí Đào','daohuutri04@gmail.com','0908762513','613 Âu Cơ','https://res.cloudinary.com/damxodpnw/image/upload/v1774076816/enggo/avatars/tvyrrbktwdi6grrljque.jpg',2,NULL,'2026-03-02 04:59:57','2026-03-21 07:06:55',1,'116663240761518380320',NULL);
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `writing_feedbacks`
--

DROP TABLE IF EXISTS `writing_feedbacks`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `writing_feedbacks` (
  `writing_feedback_id` int NOT NULL AUTO_INCREMENT,
  `submission_id` int DEFAULT NULL,
  `model_name` varchar(255) DEFAULT NULL,
  `overall_score` float DEFAULT NULL,
  `criteria_scores` json DEFAULT NULL,
  `comments` text,
  `created_at` datetime DEFAULT NULL,
  PRIMARY KEY (`writing_feedback_id`),
  KEY `submission_id` (`submission_id`),
  CONSTRAINT `writing_feedbacks_ibfk_1` FOREIGN KEY (`submission_id`) REFERENCES `writing_submissions` (`submission_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `writing_feedbacks`
--

LOCK TABLES `writing_feedbacks` WRITE;
/*!40000 ALTER TABLE `writing_feedbacks` DISABLE KEYS */;
INSERT INTO `writing_feedbacks` VALUES (1,4,'gpt-4o-mini',7.5,'{\"lexical_resource\": 7, \"task_achievement\": 8, \"coherence_cohesion\": 7, \"grammatical_range_accuracy\": 8}','{\"criteria_comments\":{\"task_achievement\":\"The response effectively summarizes the main features of the brick manufacturing process, covering all key stages in detail.\",\"coherence_cohesion\":\"The information is logically organized, but some transitions could be smoother to enhance the flow between stages.\",\"lexical_resource\":\"The vocabulary is appropriate and varied, although there are minor repetitions that could be avoided.\",\"grammatical_range_accuracy\":\"The grammatical structures used are mostly accurate and varied, with only a few minor errors.\"},\"feedback\":{\"overall_comment\":\"This report provides a clear and detailed overview of the brick manufacturing process. The stages are well described, and the sequence is logical. However, improving the cohesion between sentences would enhance the overall clarity.\",\"strengths\":[\"Clear description of the manufacturing process\",\"Logical organization of information\",\"Good use of technical vocabulary\"],\"improvements\":[\"Enhance transitions between stages for better flow\",\"Reduce repetition of certain phrases\",\"Incorporate more varied sentence structures\"],\"tips\":[\"Use linking words to improve coherence\",\"Vary vocabulary to avoid repetition\",\"Practice using complex sentences to demonstrate grammatical range\"]},\"sample_improvements\":[\"Original: The clay then passes through a metal grid which breaks it into smaller pieces. → Improved: The clay subsequently passes through a metal grid that breaks it into smaller pieces.\",\"Original: The resulting substance is shaped into bricks either by using a mould or by cutting the clay with a wire cutter. → Improved: The resulting substance is shaped into bricks either by using a mold or by cutting the clay with a wire cutter.\"],\"word_count_note\":\"\",\"task_type\":\"task1\"}','2026-03-29 17:08:59'),(2,5,'gpt-4o-mini',7.5,'{\"lexical_resource\": 7, \"task_achievement\": 8, \"coherence_cohesion\": 7, \"grammatical_range_accuracy\": 8}','{\"criteria_comments\":{\"task_achievement\":\"The response effectively summarizes the main features of the brick manufacturing process with clear stages outlined.\",\"coherence_cohesion\":\"The information is generally well-organized, but some transitions between stages could be smoother.\",\"lexical_resource\":\"The vocabulary used is appropriate and varied, though there are minor repetitions.\",\"grammatical_range_accuracy\":\"The grammatical structures are mostly accurate, with a good range of sentence types used.\"},\"feedback\":{\"overall_comment\":\"This report provides a clear and detailed overview of the brick manufacturing process. The stages are logically sequenced, and the use of specific terminology enhances the clarity. However, improving the flow between some sections could elevate the coherence further.\",\"strengths\":[\"Clear structure with logical progression\",\"Use of specific terminology related to the process\",\"Good range of grammatical structures\"],\"improvements\":[\"Enhance transitions between different stages\",\"Reduce repetition of certain terms\",\"Add more varied sentence structures to improve flow\"],\"tips\":[\"Use linking words to improve coherence between stages\",\"Vary vocabulary to avoid repetition\",\"Incorporate more complex sentences for higher grammatical range\"]},\"sample_improvements\":[\"Original: The resulting substance is shaped into bricks either by using a mould or by cutting the clay with a wire cutter. → Improved: The resulting substance is shaped into bricks, either by using a mould or by cutting it with a wire cutter.\",\"Original: The newly formed bricks are placed in a drying oven for 24 to 48 hours to remove moisture. → Improved: The newly formed bricks are then placed in a drying oven for a duration of 24 to 48 hours to effectively remove moisture.\"],\"word_count_note\":\"\",\"task_type\":\"task1\"}','2026-03-30 05:39:14'),(3,6,'gpt-4o-mini',5.5,'{\"task_response\": 5, \"lexical_resource\": 5, \"coherence_cohesion\": 6, \"grammatical_range_accuracy\": 5}','{\"criteria_comments\":{\"task_response\":\"The essay addresses the prompt but lacks depth in discussing both views. The opinion is stated but not well-supported.\",\"coherence_cohesion\":\"The essay is generally coherent, but the flow could be improved with better linking phrases and clearer paragraph structure.\",\"lexical_resource\":\"The vocabulary is adequate but repetitive, with some inaccuracies in word forms and usage.\",\"grammatical_range_accuracy\":\"There are several grammatical errors, particularly with subject-verb agreement and sentence structure, which affect clarity.\"},\"feedback\":{\"overall_comment\":\"The essay presents a basic discussion of the topic but lacks sufficient development and detail. While the structure is clear, the arguments could be more persuasive and supported with examples. Improving grammatical accuracy and expanding on ideas would enhance the overall quality.\",\"strengths\":[\"Clear structure with an introduction, body paragraphs, and conclusion\",\"Basic understanding of the topic\",\"Attempts to discuss both sides of the argument\"],\"improvements\":[\"Expand on each point with more examples and details\",\"Improve grammatical accuracy and sentence variety\",\"Enhance vocabulary to avoid repetition and improve precision\"],\"tips\":[\"Use linking words to improve the flow of ideas\",\"Practice writing longer essays to meet the word count requirement\",\"Review grammar rules to reduce errors in sentence structure\"]},\"sample_improvements\":[\"Original: \'Some people think technology make life easier, but other people believe it make people less social.\' → Improved: \'Some people believe that technology makes life easier, while others argue that it makes individuals less social.\'\",\"Original: \'Technology also help people work from home and study online.\' → Improved: \'Technology also helps individuals work from home and engage in online studies.\'\"],\"word_count_note\":\"\",\"task_type\":\"task2\"}','2026-03-30 05:39:23'),(4,7,'gpt-4o-mini',7.5,'{\"lexical_resource\": 7, \"task_achievement\": 8, \"coherence_cohesion\": 7, \"grammatical_range_accuracy\": 8}','{\"criteria_comments\":{\"task_achievement\":\"The response effectively summarizes the main stages of the brick manufacturing process with clear details.\",\"coherence_cohesion\":\"The information is logically organized, but some transitions could be smoother to enhance flow.\",\"lexical_resource\":\"The vocabulary is appropriate and varied, though there are occasional repetitions.\",\"grammatical_range_accuracy\":\"The grammatical structures are mostly accurate, with a good range of sentence types used.\"},\"feedback\":{\"overall_comment\":\"This report provides a clear and detailed overview of the brick manufacturing process. The candidate effectively outlines each stage, demonstrating a good understanding of the task. However, slight improvements in coherence could enhance the overall readability.\",\"strengths\":[\"Clear structure and organization of information\",\"Good use of technical vocabulary\",\"Accurate descriptions of processes\"],\"improvements\":[\"Enhance the use of cohesive devices for better flow\",\"Reduce repetition of certain phrases\",\"Include more varied sentence structures\"],\"tips\":[\"Use linking words to improve transitions between stages\",\"Vary vocabulary to avoid repetition\",\"Practice using complex sentences to demonstrate grammatical range\"]},\"sample_improvements\":[\"Original: The clay then passes through a metal grid which breaks it into smaller pieces. → Improved: The clay is then passed through a metal grid that breaks it into smaller pieces.\",\"Original: The resulting substance is shaped into bricks either by using a mould or by cutting the clay with a wire cutter. → Improved: The resulting substance is shaped into bricks, either by using a mold or by cutting the clay with a wire cutter.\"],\"word_count_note\":\"\",\"task_type\":\"task1\"}','2026-03-30 08:47:31'),(5,8,'gpt-4o-mini',5.5,'{\"task_response\": 5, \"lexical_resource\": 5, \"coherence_cohesion\": 6, \"grammatical_range_accuracy\": 5}','{\"criteria_comments\":{\"task_response\":\"The essay addresses the task but lacks depth in discussing both views. The opinion is present but not strongly supported.\",\"coherence_cohesion\":\"The essay is generally coherent, but some transitions between ideas could be smoother to enhance flow.\",\"lexical_resource\":\"The vocabulary is adequate but somewhat limited, with some inaccuracies in word forms and usage.\",\"grammatical_range_accuracy\":\"There are several grammatical errors, particularly with subject-verb agreement and sentence structure.\"},\"feedback\":{\"overall_comment\":\"The essay presents a basic discussion of the topic, but it lacks sufficient detail and development of ideas. While the structure is clear, the argumentation is weak and could benefit from more examples and elaboration. Additionally, grammatical errors detract from the overall clarity.\",\"strengths\":[\"Clear structure with an introduction, body paragraphs, and conclusion\",\"Some relevant examples provided\",\"Attempts to address both sides of the argument\"],\"improvements\":[\"Expand on each viewpoint with more detailed examples\",\"Improve grammatical accuracy, especially subject-verb agreement\",\"Use a wider range of vocabulary to express ideas more precisely\"],\"tips\":[\"Practice writing longer essays to meet the word count requirement\",\"Review grammar rules, particularly for verb forms\",\"Incorporate more varied vocabulary and phrases to enhance lexical resource\"]},\"sample_improvements\":[\"Original: \'Some people think technology make life easier\' → Improved: \'Some people believe that technology makes life easier.\'\",\"Original: \'technology also have negative effect\' → Improved: \'technology also has negative effects.\'\"],\"word_count_note\":\"\",\"task_type\":\"task2\"}','2026-03-30 08:47:39'),(6,9,'gpt-4o-mini',7.5,'{\"lexical_resource\": 7, \"task_achievement\": 8, \"coherence_cohesion\": 7, \"grammatical_range_accuracy\": 8}','{\"criteria_comments\":{\"task_achievement\":\"The response effectively summarizes the main features of the brick manufacturing process with clear stages outlined.\",\"coherence_cohesion\":\"The organization is logical, but some transitions between stages could be smoother to enhance flow.\",\"lexical_resource\":\"The vocabulary is appropriate and varied, but there are occasional repetitions that could be avoided.\",\"grammatical_range_accuracy\":\"The grammatical structures used are mostly accurate, with a good range of sentence types.\"},\"feedback\":{\"overall_comment\":\"This report provides a clear and detailed overview of the brick manufacturing process, effectively covering all key stages. The structure is logical, though slight improvements in coherence could enhance readability. Overall, it demonstrates a solid command of language and task requirements.\",\"strengths\":[\"Clear structure outlining the stages of the process\",\"Good use of technical vocabulary\",\"Accurate description of the heating phases\"],\"improvements\":[\"Improve transitions between stages for better flow\",\"Reduce repetition of certain terms\",\"Enhance variety in sentence structure\"],\"tips\":[\"Use linking words to improve coherence between stages\",\"Vary vocabulary to avoid repetition\",\"Incorporate more complex sentences to demonstrate grammatical range\"]},\"sample_improvements\":[\"Original: The clay then passes through a metal grid which breaks it into smaller pieces. → Improved: The clay is then passed through a metal grid that breaks it into smaller pieces.\",\"Original: After the drying stage, the bricks are transferred to a kiln where they are heated in two phases. → Improved: Following the drying stage, the bricks are transferred to a kiln, where they undergo heating in two distinct phases.\"],\"word_count_note\":\"\",\"task_type\":\"task1\"}','2026-03-30 09:43:07'),(7,10,'gpt-4o-mini',5.5,'{\"task_response\": 5, \"lexical_resource\": 5.5, \"coherence_cohesion\": 5.5, \"grammatical_range_accuracy\": 5}','{\"criteria_comments\":{\"task_response\":\"The essay addresses the prompt but does not fully develop the arguments or provide sufficient examples. The conclusion is somewhat repetitive.\",\"coherence_cohesion\":\"The essay has a basic structure, but transitions between ideas could be smoother, and some points lack clear connections.\",\"lexical_resource\":\"The vocabulary is adequate but limited in range, with some errors in word forms and collocations.\",\"grammatical_range_accuracy\":\"There are several grammatical errors, particularly with subject-verb agreement and article usage, which affect clarity.\"},\"feedback\":{\"overall_comment\":\"The essay presents a basic discussion of the topic but lacks depth and clear argumentation. While the ideas are relevant, they are underdeveloped, and the writing contains several grammatical errors. To improve, the candidate should focus on expanding their arguments and enhancing grammatical accuracy.\",\"strengths\":[\"Clear identification of both views\",\"Basic structure is followed\",\"Relevant examples are provided\"],\"improvements\":[\"Expand on each argument with more detailed examples\",\"Improve grammatical accuracy, especially subject-verb agreement\",\"Enhance vocabulary range to avoid repetition\"],\"tips\":[\"Practice writing longer essays to meet the word count requirement\",\"Use linking words to improve coherence between ideas\",\"Review grammar rules, especially related to verb forms and articles\"]},\"sample_improvements\":[\"Original: \'technology make life easier\' → Improved: \'technology makes life easier\'\",\"Original: \'people must use it carefully\' → Improved: \'people must use it responsibly\'\"],\"word_count_note\":\"The essay is below the minimum required word count of 250.\",\"task_type\":\"task2\"}','2026-03-30 09:43:15'),(8,11,'gpt-4o-mini',7.5,'{\"lexical_resource\": 7, \"task_achievement\": 8, \"coherence_cohesion\": 7, \"grammatical_range_accuracy\": 8}','{\"criteria_comments\":{\"task_achievement\":\"The response effectively summarizes the main stages of the brick manufacturing process with clear details.\",\"coherence_cohesion\":\"The information is logically organized, but some transitions could be smoother to enhance flow.\",\"lexical_resource\":\"The vocabulary is appropriate and varied, though there are minor repetitions.\",\"grammatical_range_accuracy\":\"The grammatical structures are mostly accurate, with a good range of sentence types used.\"},\"feedback\":{\"overall_comment\":\"This report provides a clear and detailed overview of the brick manufacturing process. The candidate successfully outlines each stage, demonstrating a good understanding of the task. However, some areas could benefit from improved cohesion and varied vocabulary to enhance readability.\",\"strengths\":[\"Clear structure and logical progression of ideas\",\"Detailed description of each stage\",\"Good use of technical vocabulary related to the process\"],\"improvements\":[\"Enhance the use of cohesive devices to improve flow\",\"Reduce repetition of certain phrases\",\"Incorporate more varied sentence structures\"],\"tips\":[\"Use linking words to connect ideas more effectively\",\"Vary your vocabulary to avoid repetition\",\"Practice using complex sentences to demonstrate grammatical range\"]},\"sample_improvements\":[\"Original: The clay then passes through a metal grid which breaks it into smaller pieces. → Improved: The clay is subsequently passed through a metal grid that breaks it into smaller pieces.\",\"Original: After that, the clay is crushed by a roller to produce a fine material. → Improved: Following this, a roller crushes the clay to create a fine material.\"],\"word_count_note\":\"\",\"task_type\":\"task1\"}','2026-03-30 10:01:07'),(9,12,'gpt-4o-mini',5.5,'{\"task_response\": 5.5, \"lexical_resource\": 5.5, \"coherence_cohesion\": 5, \"grammatical_range_accuracy\": 5}','{\"criteria_comments\":{\"task_response\":\"The essay addresses the task but lacks sufficient development of ideas and examples.\",\"coherence_cohesion\":\"The organization is basic, with some ideas not clearly linked, affecting overall coherence.\",\"lexical_resource\":\"Vocabulary is adequate but repetitive; more varied language would enhance the essay.\",\"grammatical_range_accuracy\":\"There are several grammatical errors and issues with sentence structure that hinder clarity.\"},\"feedback\":{\"overall_comment\":\"The essay presents a basic discussion of the topic but lacks depth and clarity. While it touches on both views, the arguments are not fully developed, and the conclusion is somewhat weak. Improving the structure and expanding on ideas would enhance the overall quality.\",\"strengths\":[\"Addresses both views\",\"Clear opinion stated\",\"Basic structure present\"],\"improvements\":[\"Expand on ideas with more examples\",\"Improve coherence by linking ideas better\",\"Enhance vocabulary variety\"],\"tips\":[\"Use more complex sentences to demonstrate grammatical range\",\"Incorporate specific examples to support your arguments\",\"Practice linking words and phrases to improve coherence\"]},\"sample_improvements\":[\"Original: \'Some people think technology make life easier, but other people believe it make people less social.\' → Improved: \'Some people believe that technology simplifies life, while others argue that it diminishes social interactions.\'\",\"Original: \'This can make people less social.\' → Improved: \'This trend can lead to a decrease in face-to-face social interactions.\'\"],\"word_count_note\":\"The response is below the minimum required word count of 250.\",\"task_type\":\"task2\"}','2026-03-30 10:01:21');
/*!40000 ALTER TABLE `writing_feedbacks` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `writing_submissions`
--

DROP TABLE IF EXISTS `writing_submissions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `writing_submissions` (
  `submission_id` int NOT NULL AUTO_INCREMENT,
  `content` text NOT NULL,
  `user_exam_id` int NOT NULL,
  `container_question_id` int NOT NULL,
  `word_count` int DEFAULT NULL,
  `final_score` float DEFAULT NULL,
  `status` enum('submitted','graded','revised') DEFAULT NULL,
  `submitted_at` datetime DEFAULT NULL,
  PRIMARY KEY (`submission_id`),
  KEY `writing_submission_user_exam_id_foreign_idx` (`user_exam_id`),
  KEY `writing_submission_container_question_id_foreign_idx` (`container_question_id`),
  CONSTRAINT `writing_submission_container_question_id_foreign_idx` FOREIGN KEY (`container_question_id`) REFERENCES `container_questions` (`container_question_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `writing_submission_user_exam_id_foreign_idx` FOREIGN KEY (`user_exam_id`) REFERENCES `user_exams` (`user_exam_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `writing_submissions`
--

LOCK TABLES `writing_submissions` WRITE;
/*!40000 ALTER TABLE `writing_submissions` DISABLE KEYS */;
INSERT INTO `writing_submissions` VALUES (1,'The diagram illustrates the process of manufacturing bricks used for building. Overall, the production involves several stages, beginning with the extraction of clay and ending with the delivery of packaged bricks.\n\nFirst, clay is dug from the ground by a digger. The clay then passes through a metal grid which breaks it into smaller pieces. After that, the clay is crushed by a roller to produce a fine material. Sand and water are then added to this mixture. The resulting substance is shaped into bricks either by using a mould or by cutting the clay with a wire cutter.\n\nNext, the newly formed bricks are placed in a drying oven for 24 to 48 hours to remove moisture. After the drying stage, the bricks are transferred to a kiln where they are heated in two phases. Initially, they are fired at a moderate temperature ranging from about 200°C to 980°C. Then, the temperature is increased to a higher level between 870°C and 1300°C to harden the bricks.\n\nFollowing the heating process, the bricks are moved to a cooling chamber where they remain for 48 to 72 hours. Finally, the finished bricks are packaged and transported by truck for delivery.',25,409,199,NULL,'submitted','2026-03-29 16:00:38'),(2,'The diagram illustrates the process of manufacturing bricks used for building. Overall, the production involves several stages, beginning with the extraction of clay and ending with the delivery of packaged bricks.\n\nFirst, clay is dug from the ground by a digger. The clay then passes through a metal grid which breaks it into smaller pieces. After that, the clay is crushed by a roller to produce a fine material. Sand and water are then added to this mixture. The resulting substance is shaped into bricks either by using a mould or by cutting the clay with a wire cutter.\n\nNext, the newly formed bricks are placed in a drying oven for 24 to 48 hours to remove moisture. After the drying stage, the bricks are transferred to a kiln where they are heated in two phases. Initially, they are fired at a moderate temperature ranging from about 200°C to 980°C. Then, the temperature is increased to a higher level between 870°C and 1300°C to harden the bricks.\n\nFollowing the heating process, the bricks are moved to a cooling chamber where they remain for 48 to 72 hours. Finally, the finished bricks are packaged and transported by truck for delivery.',27,409,199,NULL,'submitted','2026-03-29 16:51:31'),(3,'The diagram illustrates the process of manufacturing bricks used for building. Overall, the production involves several stages, beginning with the extraction of clay and ending with the delivery of packaged bricks.\n\nFirst, clay is dug from the ground by a digger. The clay then passes through a metal grid which breaks it into smaller pieces. After that, the clay is crushed by a roller to produce a fine material. Sand and water are then added to this mixture. The resulting substance is shaped into bricks either by using a mould or by cutting the clay with a wire cutter.\n\nNext, the newly formed bricks are placed in a drying oven for 24 to 48 hours to remove moisture. After the drying stage, the bricks are transferred to a kiln where they are heated in two phases. Initially, they are fired at a moderate temperature ranging from about 200°C to 980°C. Then, the temperature is increased to a higher level between 870°C and 1300°C to harden the bricks.\n\nFollowing the heating process, the bricks are moved to a cooling chamber where they remain for 48 to 72 hours. Finally, the finished bricks are packaged and transported by truck for delivery.',28,409,199,NULL,'submitted','2026-03-29 17:03:33'),(4,'The diagram illustrates the process of manufacturing bricks used for building. Overall, the production involves several stages, beginning with the extraction of clay and ending with the delivery of packaged bricks.\n\nFirst, clay is dug from the ground by a digger. The clay then passes through a metal grid which breaks it into smaller pieces. After that, the clay is crushed by a roller to produce a fine material. Sand and water are then added to this mixture. The resulting substance is shaped into bricks either by using a mould or by cutting the clay with a wire cutter.\n\nNext, the newly formed bricks are placed in a drying oven for 24 to 48 hours to remove moisture. After the drying stage, the bricks are transferred to a kiln where they are heated in two phases. Initially, they are fired at a moderate temperature ranging from about 200°C to 980°C. Then, the temperature is increased to a higher level between 870°C and 1300°C to harden the bricks.\n\nFollowing the heating process, the bricks are moved to a cooling chamber where they remain for 48 to 72 hours. Finally, the finished bricks are packaged and transported by truck for delivery.',28,409,199,7.5,'graded','2026-03-29 17:08:50'),(5,'The diagram illustrates the process of manufacturing bricks used for building. Overall, the production involves several stages, beginning with the extraction of clay and ending with the delivery of packaged bricks.\n\nFirst, clay is dug from the ground by a digger. The clay then passes through a metal grid which breaks it into smaller pieces. After that, the clay is crushed by a roller to produce a fine material. Sand and water are then added to this mixture. The resulting substance is shaped into bricks either by using a mould or by cutting the clay with a wire cutter.\n\nNext, the newly formed bricks are placed in a drying oven for 24 to 48 hours to remove moisture. After the drying stage, the bricks are transferred to a kiln where they are heated in two phases. Initially, they are fired at a moderate temperature ranging from about 200°C to 980°C. Then, the temperature is increased to a higher level between 870°C and 1300°C to harden the bricks.\n\nFollowing the heating process, the bricks are moved to a cooling chamber where they remain for 48 to 72 hours. Finally, the finished bricks are packaged and transported by truck for delivery.',30,409,199,7.5,'graded','2026-03-30 05:39:04'),(6,'Technology is very common in modern life. Many people use phone, computer and internet every day. Some people think technology make life easier, but other people believe it make people less social. I will discuss both idea and give my opinion.\n\nOn one hand, technology help people do many things faster. For example, people can send email or message very quickly. Also, people can search information on internet instead of go to library. Technology also help people work from home and study online. Because of this, life become more convenient and comfortable for many people.\n\nOn the other hand, technology also have negative effect. Many people spend long time on phone or computer. They use social media or play game and do not talk with family or friends. In the past, people meet each other more often, but now many people stay at home and use internet. This can make people less social.\n\nIn my opinion, technology make life easier but people must use it carefully. If people use technology too much, they may have less communication with others. People should balance technology and real life communication.\n\nIn conclusion, technology has advantages and disadvantages. It help people in daily life but it also can reduce social interaction.',30,412,207,5.5,'graded','2026-03-30 05:39:14'),(7,'The diagram illustrates the process of manufacturing bricks used for building. Overall, the production involves several stages, beginning with the extraction of clay and ending with the delivery of packaged bricks.\n\nFirst, clay is dug from the ground by a digger. The clay then passes through a metal grid which breaks it into smaller pieces. After that, the clay is crushed by a roller to produce a fine material. Sand and water are then added to this mixture. The resulting substance is shaped into bricks either by using a mould or by cutting the clay with a wire cutter.\n\nNext, the newly formed bricks are placed in a drying oven for 24 to 48 hours to remove moisture. After the drying stage, the bricks are transferred to a kiln where they are heated in two phases. Initially, they are fired at a moderate temperature ranging from about 200°C to 980°C. Then, the temperature is increased to a higher level between 870°C and 1300°C to harden the bricks.\n\nFollowing the heating process, the bricks are moved to a cooling chamber where they remain for 48 to 72 hours. Finally, the finished bricks are packaged and transported by truck for delivery.',34,409,199,7.5,'graded','2026-03-30 08:47:24'),(8,'Technology is very common in modern life. Many people use phone, computer and internet every day. Some people think technology make life easier, but other people believe it make people less social. I will discuss both idea and give my opinion.\n\nOn one hand, technology help people do many things faster. For example, people can send email or message very quickly. Also, people can search information on internet instead of go to library. Technology also help people work from home and study online. Because of this, life become more convenient and comfortable for many people.\n\nOn the other hand, technology also have negative effect. Many people spend long time on phone or computer. They use social media or play game and do not talk with family or friends. In the past, people meet each other more often, but now many people stay at home and use internet. This can make people less social.\n\nIn my opinion, technology make life easier but people must use it carefully. If people use technology too much, they may have less communication with others. People should balance technology and real life communication.\n\nIn conclusion, technology has advantages and disadvantages. It help people in daily life but it also can reduce social interaction.',34,412,207,5.5,'graded','2026-03-30 08:47:31'),(9,'The diagram illustrates the process of manufacturing bricks used for building. Overall, the production involves several stages, beginning with the extraction of clay and ending with the delivery of packaged bricks.\n\nFirst, clay is dug from the ground by a digger. The clay then passes through a metal grid which breaks it into smaller pieces. After that, the clay is crushed by a roller to produce a fine material. Sand and water are then added to this mixture. The resulting substance is shaped into bricks either by using a mould or by cutting the clay with a wire cutter.\n\nNext, the newly formed bricks are placed in a drying oven for 24 to 48 hours to remove moisture. After the drying stage, the bricks are transferred to a kiln where they are heated in two phases. Initially, they are fired at a moderate temperature ranging from about 200°C to 980°C. Then, the temperature is increased to a higher level between 870°C and 1300°C to harden the bricks.\n\nFollowing the heating process, the bricks are moved to a cooling chamber where they remain for 48 to 72 hours. Finally, the finished bricks are packaged and transported by truck for delivery.',36,409,199,7.5,'graded','2026-03-30 09:42:59'),(10,'Technology is very common in modern life. Many people use phone, computer and internet every day. Some people think technology make life easier, but other people believe it make people less social. I will discuss both idea and give my opinion.\n\nOn one hand, technology help people do many things faster. For example, people can send email or message very quickly. Also, people can search information on internet instead of go to library. Technology also help people work from home and study online. Because of this, life become more convenient and comfortable for many people.\n\nOn the other hand, technology also have negative effect. Many people spend long time on phone or computer. They use social media or play game and do not talk with family or friends. In the past, people meet each other more often, but now many people stay at home and use internet. This can make people less social.\n\nIn my opinion, technology make life easier but people must use it carefully. If people use technology too much, they may have less communication with others. People should balance technology and real life communication.\n\nIn conclusion, technology has advantages and disadvantages. It help people in daily life but it also can reduce social interaction.',36,412,207,5.5,'graded','2026-03-30 09:43:07'),(11,'The diagram illustrates the process of manufacturing bricks used for building. Overall, the production involves several stages, beginning with the extraction of clay and ending with the delivery of packaged bricks.\n\nFirst, clay is dug from the ground by a digger. The clay then passes through a metal grid which breaks it into smaller pieces. After that, the clay is crushed by a roller to produce a fine material. Sand and water are then added to this mixture. The resulting substance is shaped into bricks either by using a mould or by cutting the clay with a wire cutter.\n\nNext, the newly formed bricks are placed in a drying oven for 24 to 48 hours to remove moisture. After the drying stage, the bricks are transferred to a kiln where they are heated in two phases. Initially, they are fired at a moderate temperature ranging from about 200°C to 980°C. Then, the temperature is increased to a higher level between 870°C and 1300°C to harden the bricks.\n\nFollowing the heating process, the bricks are moved to a cooling chamber where they remain for 48 to 72 hours. Finally, the finished bricks are packaged and transported by truck for delivery.',37,409,199,7.5,'graded','2026-03-30 10:00:55'),(12,'Technology is very common in modern life. Many people use phone, computer and internet every day. Some people think technology make life easier, but other people believe it make people less social. I will discuss both idea and give my opinion.\n\nOn one hand, technology help people do many things faster. For example, people can send email or message very quickly. Also, people can search information on internet instead of go to library. Technology also help people work from home and study online. Because of this, life become more convenient and comfortable for many people.\n\nOn the other hand, technology also have negative effect. Many people spend long time on phone or computer. They use social media or play game and do not talk with family or friends. In the past, people meet each other more often, but now many people stay at home and use internet. This can make people less social.\n\nIn my opinion, technology make life easier but people must use it carefully. If people use technology too much, they may have less communication with others. People should balance technology and real life communication.\n\nIn conclusion, technology has advantages and disadvantages. It help people in daily life but it also can reduce social interaction.',37,412,207,5.5,'graded','2026-03-30 10:01:07');
/*!40000 ALTER TABLE `writing_submissions` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-03-31  4:54:59
