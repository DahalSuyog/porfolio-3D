"use client";

import { usePathname } from "next/navigation";
import { useReducedMotion } from "@/lib/use-reduced-motion";
import CameraRig from "./CameraRig";
import DistanceFade from "./DistanceFade";
import StationPanel from "./StationPanel";
import Lights from "./Lights";
import ParticleField from "./ParticleField";
import HeroContent from "../../content/HeroContent";
import SkillsContent from "../../content/SkillsContent";
import WorkContent from "../../content/WorkContent";
import ExperienceContent from "../../content/ExperienceContent";
import ContactContent from "../../content/ContactContent";
import DemoContent from "../../content/DemoContent";
import HeroCore from "./zones/HeroCore";
import SkillsConstellation from "./zones/SkillsConstellation";
import ExperiencePath from "./zones/ExperiencePath";
import ContactFinale from "./zones/ContactFinale";
import DemoArtifact from "./zones/DemoArtifact";

export default function Scene() {
  const pathname = usePathname();
  const isDemos = pathname?.startsWith("/demos") ?? false;
  const reduced = useReducedMotion();

  return (
    <>
      <fog attach="fog" args={["#121211", 9, 36]} />
      <Lights />
      <ParticleField count={reduced ? 260 : 720} />

      {isDemos ? (
        <>
          <DistanceFade center={[0, 0.1, -19]} near={9} far={18}>
            <DemoArtifact />
          </DistanceFade>
          <StationPanel
            position={[0, 0.1, -16.5]}
            face={[0, 0.25, -11]}
            distance={5.5}
            allowInnerScroll
          >
            <DemoContent />
          </StationPanel>
          <DistanceFade center={[0, 0.2, -30]} near={10} far={19}>
            <ExperiencePath />
          </DistanceFade>
          <DistanceFade center={[0, 0, -39]} near={10} far={20}>
            <ContactFinale />
          </DistanceFade>
          <StationPanel
            position={[0, 0, -36.5]}
            face={[0, 0.25, -30]}
            distance={6.5}
          >
            <ContactContent />
          </StationPanel>
        </>
      ) : (
        <>
          <DistanceFade center={[2.2, 0.2, -1.2]} near={13} far={21}>
            <HeroCore position={[2.2, 0.2, -1.2]} scale={0.9} />
          </DistanceFade>
          <StationPanel
            position={[0, 0.1, 2.2]}
            face={[0, 0.4, 9]}
            distance={6.8}
          >
            <HeroContent />
          </StationPanel>

          <DistanceFade center={[0, 0.4, -10]} near={9} far={16}>
            <SkillsConstellation />
          </DistanceFade>
          <StationPanel
            position={[0, 0.4, -7.5]}
            face={[0, 0.7, -2]}
            distance={5.5}
          >
            <SkillsContent />
          </StationPanel>

          <StationPanel
            position={[0, 0.1, -20]}
            face={[0, 0.5, -12]}
            distance={8}
          >
            <WorkContent />
          </StationPanel>

          <DistanceFade center={[0, 0.2, -30]} near={10} far={19}>
            <ExperiencePath />
          </DistanceFade>
          <StationPanel
            position={[0, 0.2, -27.5]}
            face={[0, 0.6, -21]}
            distance={6.5}
          >
            <ExperienceContent />
          </StationPanel>

          <DistanceFade center={[0, 0, -39]} near={10} far={20}>
            <ContactFinale />
          </DistanceFade>
          <StationPanel
            position={[0, 0, -36.5]}
            face={[0, 0.25, -30]}
            distance={6.5}
          >
            <ContactContent />
          </StationPanel>
        </>
      )}

      <CameraRig isDemos={isDemos} reduced={reduced} />
    </>
  );
}
