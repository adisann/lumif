"use client";

import { useEffect, useRef, useState, type RefObject } from "react";
import Image from "next/image";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { Pause, Play, RotateCcw } from "lucide-react";
import type { PetStage } from "@/lib/pets";

type LumifMascot3DProps = {
  modelUrl?: string;
  stage?: PetStage;
  isEggStage?: boolean;
  tintHex?: string;
  showHabitat?: boolean;
  greetingSignal?: number;
  heightClass?: string;
  mode?: "companion" | "breathing";
  breathPhase?: "inhale" | "exhale";
  breathMixRef?: RefObject<number>;
  className?: string;
};

export default function LumifMascot3D({
  modelUrl = "/models/duck-base.glb",
  stage = "baby",
  isEggStage = false,
  tintHex,
  showHabitat = true,
  greetingSignal = 0,
  heightClass = "h-[220px]",
  mode = "companion",
  breathPhase = "inhale",
  breathMixRef,
  className = "",
}: LumifMascot3DProps) {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const phaseRef = useRef<"inhale" | "exhale">(breathPhase);
  const pausedRef = useRef(false);
  const waveBoostRef = useRef(0);
  const dragYawRef = useRef(0.35);

  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [isPaused, setIsPaused] = useState(() =>
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );

  useEffect(() => {
    phaseRef.current = breathPhase;
  }, [breathPhase]);

  useEffect(() => {
    pausedRef.current = isPaused;
  }, [isPaused]);

  useEffect(() => {
    if (greetingSignal > 0) {
      waveBoostRef.current = 1.1;
      window.requestAnimationFrame(() => setIsPaused(false));
    }
  }, [greetingSignal]);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    let renderer: THREE.WebGLRenderer | null = null;
    let rafId = 0;
    let disposed = false;

    window.requestAnimationFrame(() => {
      if (!disposed) {
        setIsLoaded(false);
        setHasError(false);
      }
    });

    try {
      const width = Math.max(200, container.clientWidth);
      const height = Math.max(180, container.clientHeight);

      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(34, width / height, 0.05, 80);
      camera.position.set(0, 1.0, 3.2);
      camera.lookAt(0, 0.6, 0);

      renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
        powerPreference: "low-power",
      });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
      renderer.setSize(width, height);
      renderer.outputColorSpace = THREE.SRGBColorSpace;
      renderer.toneMapping = THREE.NoToneMapping;

      const existingCanvas = container.querySelector("canvas");
      if (existingCanvas) existingCanvas.remove();
      container.appendChild(renderer.domElement);

      const hemiLight = new THREE.HemisphereLight(0xf5fff9, 0x8fb8a6, 1.45);
      scene.add(hemiLight);

      const keyLight = new THREE.DirectionalLight(0xfffdf6, 1.35);
      keyLight.position.set(2.5, 4, 3);
      scene.add(keyLight);

      const fillLight = new THREE.DirectionalLight(0xd9f2e6, 0.6);
      fillLight.position.set(-2.5, 1.5, -2);
      scene.add(fillLight);

      const pivot = new THREE.Group();
      scene.add(pivot);

      const habitatGroup = new THREE.Group();
      if (showHabitat) {
        pivot.add(habitatGroup);
      }

      let chestBone: THREE.Object3D | undefined;
      let neckBone: THREE.Object3D | undefined;
      let headBone: THREE.Object3D | undefined;
      let leftEar: THREE.Object3D | undefined;
      let rightEar: THREE.Object3D | undefined;
      let leftWing: THREE.Object3D | undefined;
      let rightWing: THREE.Object3D | undefined;
      let leftWingFore: THREE.Object3D | undefined;
      let rightWingFore: THREE.Object3D | undefined;
      let leftForeWing: THREE.Object3D | undefined;
      let rightForeWing: THREE.Object3D | undefined;
      let leftHindWing: THREE.Object3D | undefined;
      let rightHindWing: THREE.Object3D | undefined;
      let tailBone: THREE.Object3D | undefined;
      let loadedModel: THREE.Object3D | undefined;
      let baseModelScale = 1;
      const animatedNodeNames = new Set<string>();
      const restRotations = new Map<THREE.Object3D, THREE.Euler>();
      const restChestScale = new THREE.Vector3(1, 1, 1);
      let mixer: THREE.AnimationMixer | null = null;
      let foldedAction: THREE.AnimationAction | null = null;
      let openAction: THREE.AnimationAction | null = null;

      const loader = new GLTFLoader();
      loader.load(
        modelUrl,
        (gltf) => {
          if (disposed) return;
          const model = gltf.scene;
          if (tintHex) {
            const tintColor = new THREE.Color(tintHex);
            model.traverse((node) => {
              if ((node as THREE.Mesh).isMesh) {
                const mesh = node as THREE.Mesh;
                const applyTint = (mat: THREE.Material) => {
                  const cloned = mat.clone();
                  if ("color" in cloned && cloned.color instanceof THREE.Color) {
                    cloned.color.lerp(tintColor, 0.45);
                  }
                  return cloned;
                };
                mesh.material = Array.isArray(mesh.material)
                  ? mesh.material.map(applyTint)
                  : applyTint(mesh.material);
              }
            });
          }
          model.position.set(0, 0, 0);
          const rawBox = new THREE.Box3().setFromObject(model);
          const rawSize = new THREE.Vector3();
          rawBox.getSize(rawSize);
          const rawMax = Math.max(rawSize.x, rawSize.y, rawSize.z);
          if (rawMax > 0 && rawMax < 0.65) {
            model.scale.setScalar(0.68 / rawMax);
            model.updateMatrixWorld(true);
          }
          baseModelScale = model.scale.x;
          pivot.add(model);
          loadedModel = model;

          let extraOpenSpan = 0;

          if (gltf.animations && gltf.animations.length > 0) {
            const foldedClip =
              gltf.animations.find((clip) =>
                /idle.*folded/i.test(clip.name)
              ) ??
              gltf.animations.find((clip) => /folded/i.test(clip.name)) ??
              gltf.animations.find((clip) => /^idle/i.test(clip.name));

            const openClip =
              gltf.animations.find((clip) =>
                /idle.*open/i.test(clip.name)
              ) ?? gltf.animations.find((clip) => /open/i.test(clip.name));

            if (foldedClip) {
              for (const tr of foldedClip.tracks) {
                animatedNodeNames.add(tr.name.split(".")[0]);
              }
              mixer = new THREE.AnimationMixer(model);
              foldedAction = mixer.clipAction(foldedClip);
              foldedAction.play();

              if (openClip && openClip !== foldedClip) {
                openAction = mixer.clipAction(openClip);
                openAction.play();
                if (mode === "breathing") {
                  foldedAction.setEffectiveWeight(0);
                  openAction.setEffectiveWeight(1);
                  mixer.update(0.15);
                  model.updateMatrixWorld(true);
                  const openBox = new THREE.Box3().setFromObject(model);
                  const openSize = new THREE.Vector3();
                  openBox.getSize(openSize);
                  extraOpenSpan = Math.max(openSize.x, openSize.y, openSize.z);
                }
                openAction.setEffectiveWeight(0);
              }

              foldedAction.setEffectiveWeight(1);
              mixer.update(0.15);
              model.updateMatrixWorld(true);
            }
          }

          const box = new THREE.Box3().setFromObject(model);
          const size = new THREE.Vector3();
          const center = new THREE.Vector3();
          box.getSize(size);
          box.getCenter(center);

          const maxDim = Math.max(
            size.x,
            size.y,
            size.z,
            extraOpenSpan,
            0.45
          );

          if (showHabitat) {
            const radius = Math.max(size.x, size.z, 0.55) * 0.85;
            const diskHeight = Math.max(0.05, radius * 0.09);

            const grassGeo = new THREE.CylinderGeometry(
              radius,
              radius * 1.06,
              diskHeight,
              14
            );
            const grassMat = new THREE.MeshStandardMaterial({
              color: 0x8fd1b0,
              roughness: 0.9,
              flatShading: true,
            });
            const grassDisk = new THREE.Mesh(grassGeo, grassMat);
            // Polyfork assets rest at y=0, so place pedestal top at y=0
            grassDisk.position.set(0, -diskHeight / 2, 0);
            habitatGroup.add(grassDisk);

            const rimGeo = new THREE.CylinderGeometry(
              radius * 1.07,
              radius * 1.1,
              diskHeight * 0.7,
              14
            );
            const rimMat = new THREE.MeshStandardMaterial({
              color: 0xd9cdb8,
              roughness: 0.95,
              flatShading: true,
            });
            const rimDisk = new THREE.Mesh(rimGeo, rimMat);
            rimDisk.position.set(0, -diskHeight * 0.85, 0);
            habitatGroup.add(rimDisk);
          }

          const fovRad = THREE.MathUtils.degToRad(camera.fov);
          const dist = (maxDim / 2 / Math.tan(fovRad / 2)) * 1.65;

          camera.position.set(center.x, center.y + size.y * 0.16, center.z + dist);
          camera.lookAt(center.x, center.y * 0.92, center.z);
          camera.updateProjectionMatrix();

          chestBone = model.getObjectByName("Chest") ?? model.getObjectByName("Spine");
          neckBone = model.getObjectByName("Neck");
          headBone = model.getObjectByName("Head") ?? model.getObjectByName("head");
          leftEar = model.getObjectByName("LeftEar");
          rightEar = model.getObjectByName("RightEar");
          leftWing = model.getObjectByName("LeftWing");
          rightWing = model.getObjectByName("RightWing");
          leftWingFore = model.getObjectByName("LeftWingFore");
          rightWingFore = model.getObjectByName("RightWingFore");
          leftForeWing = model.getObjectByName("LeftForeWing");
          rightForeWing = model.getObjectByName("RightForeWing");
          leftHindWing = model.getObjectByName("LeftHindWing");
          rightHindWing = model.getObjectByName("RightHindWing");
          tailBone = model.getObjectByName("Tail");

          const hasWings = Boolean(leftWing || leftForeWing || openAction);
          const distScale = mode === "breathing" && hasWings ? 1.9 : 1.65;
          const zoomedDist = (maxDim / 2 / Math.tan(fovRad / 2)) * distScale;
          camera.position.set(center.x, center.y + size.y * 0.16, center.z + zoomedDist);
          camera.lookAt(center.x, center.y * 0.92, center.z);
          camera.updateProjectionMatrix();

          for (const b of [
            chestBone,
            neckBone,
            headBone,
            leftEar,
            rightEar,
            leftWing,
            rightWing,
            leftWingFore,
            rightWingFore,
            leftForeWing,
            rightForeWing,
            leftHindWing,
            rightHindWing,
            tailBone,
          ]) {
            if (b) restRotations.set(b, b.rotation.clone());
          }
          if (chestBone) restChestScale.copy(chestBone.scale);

          setIsLoaded(true);
        },
        undefined,
        () => {
          if (!disposed) setHasError(true);
        }
      );

      const handleResize = () => {
        if (!container || !renderer) return;
        const nextW = Math.max(180, container.clientWidth);
        const nextH = Math.max(160, container.clientHeight);
        camera.aspect = nextW / nextH;
        camera.updateProjectionMatrix();
        renderer.setSize(nextW, nextH);
      };

      const resizeObserver = new ResizeObserver(handleResize);
      resizeObserver.observe(container);

      const clock = new THREE.Clock();
      let breathMix = 0;

      const animate = () => {
        if (disposed || !renderer) return;
        rafId = window.requestAnimationFrame(animate);

        const dt = Math.min(clock.getDelta(), 0.05);
        const elapsed = clock.elapsedTime;

        if (waveBoostRef.current > 0) {
          waveBoostRef.current = Math.max(0, waveBoostRef.current - dt * 1.3);
        }

        const activeMotion = !pausedRef.current;

        const applyBreathBone = (
          bone: THREE.Object3D | undefined,
          axis: "x" | "y" | "z",
          offsetDeg: number
        ) => {
          if (!bone) return;
          const rad = THREE.MathUtils.degToRad(offsetDeg);
          if (mixer && activeMotion && animatedNodeNames.has(bone.name)) {
            bone.rotation[axis] += rad;
          } else {
            const rest = restRotations.get(bone);
            if (rest) bone.rotation[axis] = rest[axis] + rad;
          }
        };

        if (mode === "breathing") {
          const target = phaseRef.current === "inhale" ? 1 : 0;
          if (breathMixRef && typeof breathMixRef.current === "number") {
            breathMix = Math.min(1, Math.max(0, breathMixRef.current));
          } else {
            breathMix += (target - breathMix) * (activeMotion ? Math.min(1, dt * 1.1) : 1);
          }

          if (foldedAction && openAction) {
            foldedAction.setEffectiveWeight(1 - breathMix);
            openAction.setEffectiveWeight(breathMix);
          }
          if (mixer && activeMotion) {
            mixer.update(dt * (openAction ? 1 : 0.45));
          }

          const scalePulse = 1 + breathMix * 0.05;
          if (loadedModel) {
            loadedModel.scale.set(
              baseModelScale * scalePulse,
              baseModelScale * (1 + breathMix * 0.06),
              baseModelScale * scalePulse
            );
            loadedModel.position.y = breathMix * 0.028;
          }

          // Universal breathing anatomy motion for all pets (dragons, birds, mammals, insects)
          if (!openAction) {
            if (chestBone) {
              chestBone.scale.set(
                restChestScale.x * (1 + breathMix * 0.08),
                restChestScale.y * (1 + breathMix * 0.05),
                restChestScale.z * (1 + breathMix * 0.08)
              );
              applyBreathBone(chestBone, "x", -breathMix * 6);
            }

            applyBreathBone(neckBone, "x", -breathMix * 7);
            applyBreathBone(headBone, "x", 3 - breathMix * 10);

            // Winged pets without dedicated open-wing clips (Dragons, Dragonlings, Duck, Chicken)
            applyBreathBone(leftWing, "z", breathMix * 26);
            applyBreathBone(rightWing, "z", -breathMix * 26);
            applyBreathBone(leftWingFore, "z", breathMix * 16);
            applyBreathBone(rightWingFore, "z", -breathMix * 16);

            // Butterfly 4-wing graceful spread on inhale, fold together on exhale
            applyBreathBone(leftForeWing, "z", breathMix * 28);
            applyBreathBone(leftHindWing, "z", breathMix * 22);
            applyBreathBone(rightForeWing, "z", -breathMix * 28);
            applyBreathBone(rightHindWing, "z", -breathMix * 22);

            // Mammals (Bear, Deer, Spectral Stag, Horse): gentle ear lift on inhale
            applyBreathBone(leftEar, "z", breathMix * 12);
            applyBreathBone(rightEar, "z", -breathMix * 12);
          }
        } else {
          if (foldedAction && openAction) {
            foldedAction.setEffectiveWeight(1);
            openAction.setEffectiveWeight(0);
          }
          if (mixer && activeMotion) {
            mixer.update(dt * (waveBoostRef.current > 0.1 ? 1.8 : 1));
          }
          if (activeMotion) {
          if (isEggStage && loadedModel) {
            loadedModel.rotation.z = THREE.MathUtils.degToRad(
              Math.sin(elapsed * 2.1) * 3 + waveBoostRef.current * 8
            );
            loadedModel.position.y = Math.abs(Math.sin(elapsed * 2.1)) * 0.025;
          } else {
            const nod = Math.sin(elapsed * 1.6) * 4 + waveBoostRef.current * 14;
            const flap = Math.sin(elapsed * 2.3) * 8 + waveBoostRef.current * 16;
            if (loadedModel && waveBoostRef.current > 0.02) {
              loadedModel.position.y =
                Math.abs(Math.sin(elapsed * 6)) * 0.05 * waveBoostRef.current;
            } else if (loadedModel) {
              loadedModel.position.y = 0;
            }
            if (!mixer) {
              if (headBone) {
                headBone.rotation.y = THREE.MathUtils.degToRad(Math.sin(elapsed * 0.9) * 8);
                headBone.rotation.x = THREE.MathUtils.degToRad(nod * 0.45);
              }
              if (leftWing) leftWing.rotation.z = THREE.MathUtils.degToRad(flap);
              if (rightWing) rightWing.rotation.z = THREE.MathUtils.degToRad(-flap);
              if (leftEar) leftEar.rotation.z = THREE.MathUtils.degToRad(flap * 0.6);
              if (rightEar) rightEar.rotation.z = THREE.MathUtils.degToRad(-flap * 0.6);
              if (tailBone) tailBone.rotation.y = THREE.MathUtils.degToRad(Math.sin(elapsed * 2.6) * 9);
            }
          }
          }
        }

        pivot.rotation.y = dragYawRef.current + (activeMotion ? Math.sin(elapsed * 0.45) * 0.08 : 0);
        renderer.render(scene, camera);
      };

      animate();

      return () => {
        disposed = true;
        window.cancelAnimationFrame(rafId);
        resizeObserver.disconnect();
        if (renderer) {
          renderer.dispose();
          renderer.domElement.remove();
        }
      };
    } catch {
      window.requestAnimationFrame(() => {
        if (!disposed) setHasError(true);
      });
    }
  }, [modelUrl, mode, stage, isEggStage, tintHex, showHabitat, breathMixRef]);

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.buttons !== 1) return;
    dragYawRef.current += e.movementX * 0.012;
  };

  const triggerGreeting = () => {
    waveBoostRef.current = 1;
    if (isPaused) setIsPaused(false);
  };

  return (
    <div className={`relative flex flex-col items-center ${className}`}>
      <div
        className={`relative w-full overflow-hidden rounded-2xl bg-gradient-to-b from-primary-light/85 to-card ${heightClass}`}
      >
        <div
          ref={mountRef}
          onPointerMove={handlePointerMove}
          onClick={triggerGreeting}
          className="h-full w-full cursor-grab active:cursor-grabbing"
          aria-label="Pendamping 3D Lumif. Klik untuk menyapa atau seret untuk memutar."
        />

        {(!isLoaded || hasError) && (
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
            <Image
              src="/assets/bear-avatar.png"
              alt="Pendamping Lumif"
              width={124}
              height={124}
              className="rounded-full object-contain"
              priority
            />
          </div>
        )}
      </div>

      <div className="mt-2.5 flex w-full items-center justify-between gap-2 text-xs">
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => setIsPaused((prev) => !prev)}
            className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-border bg-card px-2.5 text-xs font-semibold text-foreground transition hover:bg-muted"
            aria-label={isPaused ? "Putar animasi pendamping" : "Jeda animasi pendamping"}
          >
            {isPaused ? <Play className="h-3.5 w-3.5" aria-hidden="true" /> : <Pause className="h-3.5 w-3.5" aria-hidden="true" />}
            <span>{isPaused ? "Putar" : "Jeda"}</span>
          </button>

          <button
            type="button"
            onClick={() => {
              dragYawRef.current = 0.35;
              waveBoostRef.current = 0.8;
            }}
            className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-border bg-card text-foreground transition hover:bg-muted"
            aria-label="Reset sudut pandang pendamping"
          >
            <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
          </button>
        </div>

        <span className="text-[11px] font-medium text-muted-foreground">
          Klik atau seret 3D
        </span>
      </div>
    </div>
  );
}
