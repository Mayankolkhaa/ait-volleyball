import { Routes, Route } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import SmoothScroll from "./components/SmoothScroll";
import IntroLoader from "./components/IntroLoader";
import Home from "./pages/Home";
import Players from "./pages/Players";
import Events from "./pages/Events";
import Journey from "./pages/Journey";
import Memories from "./pages/Memories";
import Contact from "./pages/Contact";

export default function App() {
  return (
    <>
      <SmoothScroll />
      <IntroLoader />
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/players" element={<Players />} />
          <Route path="/events" element={<Events />} />
          <Route path="/journey" element={<Journey />} />
          <Route path="/memories" element={<Memories />} />
          <Route path="/contact" element={<Contact />} />
        </Route>
      </Routes>
    </>
  );
}
