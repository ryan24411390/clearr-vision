"use client";

import React, { useRef, useState, Suspense, useEffect } from "react";
import * as THREE from "three";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import {
    useGLTF,
    Environment,
    Float,
    Sparkles,
    MeshTransmissionMaterial,
    Center,
    Html,
    useProgress
} from "@react-three/drei";
import { motion, AnimatePresence } from "framer-motion";
import { easing } from "maath";

// Preload the glasses model
useGLTF.preload("/models/glasses.glb");

// --- Loading Screen ---
function Loader() {
    const { progress } = useProgress();
    return (
        <Html center>
            <div className="flex flex-col items-center gap-4">
                <div className="w-32 h-1 bg-gray-200 rounded-full overflow-hidden">
                    <div
                        className="h-full bg-background transition-all duration-300 ease-out"
                        style={{ width: `${progress}%` }}
                    />
                </div>
                <p className="text-sm text-gray-500 font-light tracking-wide">
                    {progress.toFixed(0)}%
                </p>
            </div>
        </Html>
    );
}

// --- Main Component ---
export default function GlassesPortalHero() {
    const [entered, setEntered] = useState(false);

    return (
        <div className="relative w-full h-[100dvh] overflow-hidden">
            {/* Gradient Background */}
            <div
                className="absolute inset-0 transition-all duration-1000 ease-in-out"
                style={{
                    background: entered
                        ? 'linear-gradient(135deg, #0f0f0f 0%, #1a1a2e 50%, #16213e 100%)'
                        : 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 50%, #dee2e6 100%)'
                }}
            />

            <Canvas
                shadows
                dpr={[1, 2]}
                camera={{ position: [0, 0, 5], fov: 45 }}
                className="w-full h-full"
            >
                <Suspense fallback={<Loader />}>
                    <Experience entered={entered} setEntered={setEntered} />
                </Suspense>
            </Canvas>

            <Overlay entered={entered} onEnter={() => setEntered(true)} />
        </div>
    );
}

// --- 3D Experience ---
function Experience({ entered, setEntered }: { entered: boolean; setEntered: (v: boolean) => void }) {
    return (
        <>
            {/* Lighting */}
            <ambientLight intensity={entered ? 0.3 : 0.6} />
            <spotLight
                position={[5, 10, 7.5]}
                angle={0.3}
                penumbra={1}
                intensity={entered ? 0.5 : 1.5}
                castShadow
                shadow-mapSize={[2048, 2048]}
            />
            <spotLight
                position={[-5, -5, 5]}
                angle={0.3}
                penumbra={0.5}
                intensity={entered ? 0.3 : 0.8}
                color="#a0c4ff"
            />

            {/* Environment for realistic reflections */}
            <Environment preset={entered ? "night" : "city"} blur={0.6} />

            {/* Background Particles */}
            <Sparkles
                count={100}
                scale={15}
                size={entered ? 3 : 1.5}
                speed={0.3}
                opacity={entered ? 0.8 : 0.3}
                color={entered ? "#ffffff" : "#333333"}
            />

            {/* The Glasses */}
            <Float
                floatIntensity={entered ? 0.5 : 2}
                rotationIntensity={entered ? 0.2 : 0.8}
                speed={entered ? 1 : 2}
            >
                <Glasses entered={entered} />
            </Float>

            {/* Camera Rig for smooth animations */}
            <CameraRig entered={entered} />
        </>
    );
}

// --- Camera Animation Rig ---
function CameraRig({ entered }: { entered: boolean }) {
    useFrame((state, delta) => {
        // Target position based on entered state
        const targetZ = entered ? 2.5 : 5;
        const targetY = entered ? 0.2 : 0;

        // Smooth camera movement
        easing.damp3(
            state.camera.position,
            [0, targetY, targetZ],
            0.5,
            delta
        );

        // Mouse parallax (subtle)
        if (!entered) {
            const x = (state.pointer.x * 0.3);
            const y = (state.pointer.y * 0.15);
            easing.damp3(
                state.camera.position,
                [x, y, targetZ],
                0.25,
                delta
            );
        }

        state.camera.lookAt(0, 0, 0);
    });

    return null;
}

// --- The Glasses Model ---
function Glasses({ entered }: { entered: boolean }) {
    const groupRef = useRef<THREE.Group>(null);
    const { scene, materials } = useGLTF("/models/glasses.glb");

    // Clone the scene for manipulation
    const clonedScene = scene.clone();

    useFrame((state, delta) => {
        if (groupRef.current && !entered) {
            // Subtle rotation following mouse
            const targetRotationY = state.pointer.x * 0.3;
            const targetRotationX = state.pointer.y * 0.15;

            easing.damp(groupRef.current.rotation, 'y', targetRotationY, 0.25, delta);
            easing.damp(groupRef.current.rotation, 'x', targetRotationX, 0.25, delta);
        }
    });

    return (
        <group ref={groupRef} scale={entered ? 1.5 : 1}>
            <Center>
                <primitive object={clonedScene} />
            </Center>
        </group>
    );
}

// --- HTML Overlay ---
function Overlay({ entered, onEnter }: { entered: boolean; onEnter: () => void }) {
    return (
        <div className="absolute inset-0 pointer-events-none flex flex-col items-center justify-center text-center p-6 z-10">
            <AnimatePresence mode="wait">
                {!entered ? (
                    <motion.div
                        key="intro"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0, y: -30 }}
                        transition={{ duration: 0.6 }}
                        className="flex flex-col items-center gap-6"
                    >
                        <motion.h1
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                            className="text-5xl sm:text-7xl md:text-8xl font-bold tracking-tighter text-gray-900"
                        >
                            See Different.
                        </motion.h1>

                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.5, duration: 0.8 }}
                            className="text-lg sm:text-xl text-gray-600 max-w-md font-light"
                        >
                            Premium eyewear crafted for clarity and comfort.
                        </motion.p>

                        <motion.button
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.8, duration: 0.5 }}
                            onClick={onEnter}
                            className="pointer-events-auto mt-4 px-8 py-4 bg-foreground text-background rounded-full text-lg font-medium hover:bg-foreground/80 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-foreground"
                        >
                            Enter the Vision
                        </motion.button>
                    </motion.div>
                ) : (
                    <motion.div
                        key="entered"
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.5 }}
                        className="flex flex-col items-center gap-6"
                    >
                        <h1 className="text-4xl sm:text-6xl md:text-7xl font-bold tracking-tighter text-white">
                            Welcome to Clarity.
                        </h1>
                        <p className="text-lg sm:text-xl text-gray-300 max-w-md font-light">
                            Experience the world in perfect focus.
                        </p>
                        <motion.button
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 1.2 }}
                            onClick={() => window.location.href = '/shop'}
                            className="pointer-events-auto mt-4 px-8 py-4 bg-white text-black rounded-full text-lg font-medium hover:bg-gray-200 transition-colors duration-300"
                        >
                            Explore Collection
                        </motion.button>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
