import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import ProjectsPage from "./pages/ProjectsPage";
import ProjectDetail from "./pages/ProjectDetail";
import BlogsPage from "./pages/BlogsPage";
import BlogDetail from "./pages/BlogDetail";
import PublicationsPage from "./pages/PublicationsPage";
import PublicationDetail from "./pages/PublicationDetail";
import NotesPage from "./pages/NotesPage";
import NoteDetail from "./pages/NoteDetail";
import BrainDumpPage from "./pages/BrainDumpPage";
import BrainDumpDetail from "./pages/BrainDumpDetail";
import PaintingPage from "./pages/PaintingPage";
import Contact from "./pages/Contact";
import About from "./pages/About";
import Resume from "./pages/Resume";
import Transcript from "./pages/Transcript";
import NotFound from "./pages/NotFound";


// Admin / CMS
import AdminLayout from "./admin/AdminLayout";
import Dashboard from "./admin/Dashboard";
import ProjectsManager from "./admin/ProjectsManager";
import BlogsManager from "./admin/BlogsManager";
import PublicationsManager from "./admin/PublicationsManager";
import NotesManager from "./admin/NotesManager";
import BrainDumpsManager from "./admin/BrainDumpsManager";
import ContactsManager from "./admin/ContactsManager";
import BackendGatekeeper from "./admin/BackendGatekeeper";


export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public site — all wrapped in Layout */}
        <Route path="/" element={<Layout><Home /></Layout>} />

        <Route path="/projects" element={<Layout><ProjectsPage /></Layout>} />
        <Route path="/projects/:id" element={<Layout><ProjectDetail /></Layout>} />

        <Route path="/blogs" element={<Layout><BlogsPage /></Layout>} />
        <Route path="/blogs/:id" element={<Layout><BlogDetail /></Layout>} />

        <Route path="/publications" element={<Layout><PublicationsPage /></Layout>} />
        <Route path="/publications/:id" element={<Layout><PublicationDetail /></Layout>} />

        <Route path="/notes" element={<Layout><NotesPage /></Layout>} />
        <Route path="/notes/:id" element={<Layout><NoteDetail /></Layout>} />

        <Route path="/brain-dump" element={<Layout><BrainDumpPage /></Layout>} />
        <Route path="/brain-dump/:id" element={<Layout><BrainDumpDetail /></Layout>} />

        <Route path="/painting" element={<Layout><PaintingPage /></Layout>} />
        <Route path="/contact" element={<Layout><Contact /></Layout>} />
        <Route path="/about" element={<Layout><About /></Layout>} />
        <Route path="/resume" element={<Layout><Resume /></Layout>} />
        <Route path="/transcript" element={<Layout><Transcript /></Layout>} />

        {/* CMS Backend — /backend */}
        <Route path="/backend" element={<BackendGatekeeper><AdminLayout /></BackendGatekeeper>}>
          <Route index element={<Dashboard />} />
          <Route path="projects" element={<ProjectsManager />} />
          <Route path="blogs" element={<BlogsManager />} />
          <Route path="publications" element={<PublicationsManager />} />
          <Route path="notes" element={<NotesManager />} />
          <Route path="brain-dumps" element={<BrainDumpsManager />} />
          <Route path="contacts" element={<ContactsManager />} />
        </Route>

        {/* 404 Fallback */}
        <Route path="*" element={<Layout><NotFound /></Layout>} />
      </Routes>
    </BrowserRouter>
  );
}
