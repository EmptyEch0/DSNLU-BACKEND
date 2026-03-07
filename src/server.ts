import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";

dotenv.config();

import pool from "./config/db";

// Test DB connection on startup
pool.getConnection()
  .then((conn) => {
    console.log("✅ Database connected successfully!");
    conn.release();
  })
  .catch((err: any) => {
    console.error("❌ Database connection failed:", err.message);
  });

import adminRoutes from "./routes/admin.routes";
import carouselRoutes from "./routes/carousel.routes";
import notificationRoutes from "./routes/notification.routes";
import vcRoutes from "./routes/vc.routes";
import visitorRoutes from "./routes/visitor.routes";
import chancellorRoutes from "./routes/chancellor.routes";
import registrarRoutes from "./routes/registrar.routes";
import generalCouncilRoutes from "./routes/generalCouncil.routes";
import executiveCouncilRoutes from "./routes/executiveCouncil.routes";
import academicCouncilRoutes from "./routes/academicCouncil.routes";
import planningBoardRoutes from "./routes/planningBoard.routes";
import financeCommitteeRoutes from "./routes/financeCommittee.routes";
import infrastructureCommitteeRoutes from "./routes/infrastructureCommittee.routes";
import campusLifeRoutes from "./routes/campusLife.routes";
import professorEmeritusRoutes from "./routes/professorEmeritus.routes";
import rtiRoutes from "./routes/rti.routes";
import publicationsBooksRoutes from "./routes/publicationsBooks.routes";
import publicationsNewsletterRoutes from "./routes/publicationsNewsletter.routes";
import journalRoutes from "./routes/journal.routes";
import complaintsRoutes from "./routes/complaints.routes";
import antiRaggingRoutes from "./routes/antiRagging.routes";
import libraryRoutes from "./routes/library.routes";
import librarySectionsRoutes from "./routes/librarySections.routes";
import libraryResourcesRoutes from "./routes/libraryResources.routes";
import placementRoutes from "./routes/placement.routes";
import studentCodeRoutes from "./routes/studentCode.routes";
import studentWelfareRoutes from "./routes/studentWelfare.routes";
import scstRoutes from "./routes/scst.routes";
import iccRoutes from "./routes/icc.routes";
import alumniRoutes from "./routes/alumni.routes";
import lscRoutes from "./routes/lsc.routes";
import sportsRoutes from "./routes/sports.routes";
import masRoutes from "./routes/mas.routes";
import guestLectureYearRoutes from "./routes/guestLectureYear.routes";
import guestLectureRoutes from "./routes/guestLecture.routes";
import guestLectureVideoRoutes from "./routes/guestLectureVideo.routes";
import seminarRoutes from "./routes/seminar.routes";
import competitionRoutes from "./routes/competition.routes";
import curriculumRoutes from "./routes/curriculum.routes";
import academicRoutes from "./routes/academic.routes";
import llmAdminRoutes from "./routes/llm.admin.routes";
import centreRoutes from "./modules/centres/centre.routes";
import centreAdminRoutes from "./modules/centres/centre.admin.routes";
import centreCommitteeAdminRoutes from "./modules/centres/centre.committee.admin.routes";
import centreResearchAdminRoutes from "./modules/centres/centreResearch.admin.routes";
import licCommitteeAdminRoutes from "./modules/centres/lic.committee.admin.routes";
import licEventsAdminRoutes from "./modules/centres/lic.events.admin.routes";
import ciprCommitteeAdminRoutes from "./modules/centres/cipr.committee.admin.routes";
import ciprBoardAdminRoutes from "./modules/centres/cipr.board.admin.routes";
import ambedkarCommitteeAdminRoutes from "./modules/centres/ambedkar.committee.admin.routes";
import criminalJusticeCommitteeAdminRoutes from "./modules/centres/criminal.justice.committee.admin.routes";
import cmanAdminRoutes from "./modules/centres/cman.admin.routes";
import facultyRoutes from "./routes/faculty.routes";
import facultyAdminRoutes from "./routes/faculty.admin.routes";
import staffRoutes from "./routes/staff.routes";
import staffAdminRoutes from "./routes/staff.admin.routes";
import examRoutes from "./routes/exam.routes";
import visitingFacultyRoutes from "./routes/visitingFaculty.routes";
import certificateVerificationRoutes from "./routes/certificateVerification.routes";
import dynamicPagesRoutes from "./routes/dynamicPages.routes";
import archivesRoutes from "./routes/archives.routes";
import { verifyAdmin } from "./middlewares/verifyAdmin";


const app = express();

app.use(
  cors({
    origin: true,
    credentials: true,
  }),
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static("uploads"));

app.use("/api/admin", adminRoutes);
app.use("/api/carousel", carouselRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/vc", vcRoutes);
app.use("/api/visitor", visitorRoutes);
app.use("/api/chancellors", chancellorRoutes);
app.use("/api/registrar", registrarRoutes);
app.use("/api", generalCouncilRoutes);
app.use("/api", executiveCouncilRoutes);
app.use("/api", academicCouncilRoutes);
app.use("/api", planningBoardRoutes);
app.use("/api", financeCommitteeRoutes);
app.use("/api", infrastructureCommitteeRoutes);
app.use("/api", campusLifeRoutes);
app.use("/api", professorEmeritusRoutes);
app.use("/api/rti", rtiRoutes);
app.use("/api/publications/books", publicationsBooksRoutes);
app.use("/api/publications/newsletters", publicationsNewsletterRoutes);
app.use("/api/journal", journalRoutes);
app.use("/api", complaintsRoutes);
app.use("/api/anti-ragging", antiRaggingRoutes);
app.use("/api/library", libraryRoutes);
app.use("/api/library", libraryResourcesRoutes);
app.use("/api/library/sections", librarySectionsRoutes);
app.use("/api", placementRoutes);
app.use("/api", studentCodeRoutes);
app.use("/api", studentWelfareRoutes);
app.use("/api", scstRoutes);
app.use("/api", iccRoutes);
app.use("/api", alumniRoutes);
app.use("/api", lscRoutes);
app.use("/api", sportsRoutes);
app.use("/api", masRoutes);
app.use("/api/guest-lectures", guestLectureRoutes);
app.use("/api/admin/guest-lectures/years", guestLectureYearRoutes);
app.use("/api/admin/guest-lectures/videos", guestLectureVideoRoutes);
app.use("/api/admin/guest-lectures", guestLectureRoutes);
app.use("/api", seminarRoutes);
app.use("/api/competitions", competitionRoutes);
app.use("/api/curriculum", curriculumRoutes);
app.use("/api/academic", academicRoutes);
app.use("/api/admin/llm", llmAdminRoutes);
app.use("/api/centres", centreRoutes);
app.use("/api/admin", centreAdminRoutes);
app.use("/api/admin/centre-committee", centreCommitteeAdminRoutes);
app.use("/api/admin/centre-research", centreResearchAdminRoutes);
app.use("/api/admin/lic-committee", licCommitteeAdminRoutes);
app.use("/api/admin/lic-events", licEventsAdminRoutes);
app.use("/api/cipr", ciprCommitteeAdminRoutes);
app.use("/api/centres/cipr", ciprCommitteeAdminRoutes);
app.use("/api/cipr/board", ciprBoardAdminRoutes);
app.use("/api/centres/cipr/board", ciprBoardAdminRoutes);
app.use("/api/admin/cipr/board", ciprBoardAdminRoutes);
app.use("/api/admin/cipr", ciprCommitteeAdminRoutes);
app.use("/api/centres/ambedkar", ambedkarCommitteeAdminRoutes);
app.use("/api/admin/ambedkar", ambedkarCommitteeAdminRoutes);
app.use("/api/centres/criminal-justice", criminalJusticeCommitteeAdminRoutes);
app.use("/api/admin/criminal-justice", criminalJusticeCommitteeAdminRoutes);
app.use("/api/centres/cman", cmanAdminRoutes);
app.use("/api/admin/cman", cmanAdminRoutes);
app.use("/api/faculty", facultyRoutes);
app.use("/api/staff", staffRoutes);
app.use("/api/admin", facultyAdminRoutes);
app.use("/api/admin", staffAdminRoutes);
app.use("/api/exams", examRoutes);
app.use("/api/visiting-faculty", visitingFacultyRoutes);
app.use("/api/certificate-verification", certificateVerificationRoutes);
app.use("/api/dynamic-pages", dynamicPagesRoutes);
app.use("/api/archives", archivesRoutes);





app.get("/", (req, res) => {
  res.send("Backend running successfully");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
