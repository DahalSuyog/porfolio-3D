"use client";

import { usePathname } from "next/navigation";
import { useReducedMotion } from "@/lib/use-reduced-motion";
import CameraRig from "./CameraRig";
import DistanceFade from "./DistanceFade";
import Lights from "./Lights";
import ParticleField from "./ParticleField";
import HeroCore from "./zones/HeroCore";
import SkillsConstellation from "./zones/SkillsConstellation";
import WorkGallery from "./zones/WorkGallery";
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
          <DistanceFade center={[0, 0.2, -30]} near={10} far={19}>
            <ExperiencePath />
          </DistanceFade>
          <DistanceFade center={[0, 0, -39]} near={10} far={20}>
            <ContactFinale />
          </DistanceFade>
        </>
      ) : (
        <>
          <DistanceFade center={[0, 0, 0]} near={13} far={21}>
            <HeroCore position={[0, 0, 0]} />
          </DistanceFade>
          <DistanceFade center={[0, 0.4, -10]} near={9} far={16}>
            <SkillsConstellation />
          </DistanceFade>
          <DistanceFade center={[0, 0.2, -21]} near={9} far={18}>
            <WorkGallery />
          </DistanceFade>
          <DistanceFade center={[0, 0.2, -30]} near={10} far={19}>
            <ExperiencePath />
          </DistanceFade>
          <DistanceFade center={[0, 0, -39]} near={10} far={20}>
            <ContactFinale />
          </DistanceFade>
        </>
      )}

      <CameraRig isDemos={isDemos} reduced={reduced} />
    </>
  );
}
