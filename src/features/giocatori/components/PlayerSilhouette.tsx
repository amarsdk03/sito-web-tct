'use client';

import { useEffect, useRef } from "react";

interface PlayerSilhouetteProps {
    teamColor: string;
    teamBadge?: string;
    playerImage?: string | null;
    playerNumber?: number;
    desaturationAmount?: number;
    brightnessFactor?: number;
}

export default function PlayerSilhouette(
{
    teamColor,
    teamBadge,
    playerImage,
    playerNumber,
    desaturationAmount = 0.2,
    brightnessFactor = 0.9,
} : PlayerSilhouetteProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    // Cache to avoid reprocessing the same image
    const cacheRef = useRef<{
        playerImage: string | null | undefined;
        teamColor: string;
        teamBadge: string | undefined;
        dataUrl: string;
    } | null>(null);

    // Rimuovo il prefisso # se presente nel codice HEX
    const targetColor = teamColor.startsWith("#") ? teamColor.slice(1) : teamColor;

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext("2d", { willReadFrequently: true });
        if (!ctx) return;

        // Check cache first
        if (cacheRef.current &&
            cacheRef.current.playerImage === playerImage &&
            cacheRef.current.teamColor === targetColor &&
            cacheRef.current.teamBadge === teamBadge) {

            // CACHE HIT: Use cached image
            const cachedImg = new Image();
            cachedImg.onload = () => {
                canvas.width = cachedImg.width;
                canvas.height = cachedImg.height;
                ctx.drawImage(cachedImg, 0, 0);
            };
            cachedImg.src = cacheRef.current.dataUrl;
            return;
        }

        const img = new Image();
        img.src = playerImage || "/other/player_front.png";
        img.onload = () => {
            canvas.width = img.width;
            canvas.height = img.height;
            ctx.drawImage(img, 0, 0);

            if (!playerImage) {
                const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
                const data = imageData.data;

                // Parse target hex color
                const r = parseInt(targetColor.slice(0, 2), 16);
                const g = parseInt(targetColor.slice(2, 4), 16);
                const b = parseInt(targetColor.slice(4, 6), 16);

                const tolerance = 60;

                for (let i = 0; i < data.length; i += 4) {
                    // First pass: replace green with target color
                    const pixelR = data[i];
                    const pixelG = data[i + 1];
                    const pixelB = data[i + 2];

                    if (pixelG > pixelR + tolerance && pixelG > pixelB + tolerance) {
                        data[i] = r;
                        data[i + 1] = g;
                        data[i + 2] = b;
                    }
                }

                // Second pass: apply desaturation and brightness to current pixel values
                for (let i = 0; i < data.length; i += 4) {
                    const currentR = data[i];
                    const currentG = data[i + 1];
                    const currentB = data[i + 2];

                    // Desaturate using current values
                    const gray = currentR * 0.299 + currentG * 0.587 + currentB * 0.114;
                    data[i] = Math.round(currentR * (1 - desaturationAmount) + gray * desaturationAmount);
                    data[i + 1] = Math.round(currentG * (1 - desaturationAmount) + gray * desaturationAmount);
                    data[i + 2] = Math.round(currentB * (1 - desaturationAmount) + gray * desaturationAmount);

                    // Apply brightness
                    data[i] = Math.round(data[i] * brightnessFactor);
                    data[i + 1] = Math.round(data[i + 1] * brightnessFactor);
                    data[i + 2] = Math.round(data[i + 2] * brightnessFactor);
                }

                ctx.putImageData(imageData, 0, 0);

                // Draw tournament logo (eagle)
                const logoTorneo = new Image();
                logoTorneo.onload = () => {
                    const logoWidth = canvas.width * 0.22;
                    const logoHeight = (logoWidth / logoTorneo.width) * logoTorneo.height;
                    const logoX = canvas.width * 0.195;
                    const logoY = canvas.height * 0.375;

                    ctx.drawImage(logoTorneo, logoX, logoY, logoWidth, logoHeight);
                };
                logoTorneo.src = "/logo_eagle_only.png";

                // Draw squad logo
                if (teamBadge) {
                    const logoSquadraImg = new Image();
                    logoSquadraImg.crossOrigin = "anonymous";
                    logoSquadraImg.onload = () => {
                        const logoWidth = canvas.width * 0.13;
                        const logoHeight = (logoWidth / logoSquadraImg.width) * logoSquadraImg.height;
                        const logoX = canvas.width * 0.63;
                        const logoY = canvas.height * 0.408;

                        // Create a rounded clipping path
                        ctx.save();
                        ctx.beginPath();
                        ctx.arc(
                            logoX + logoWidth / 2,
                            logoY + logoHeight / 2,
                            Math.min(logoWidth, logoHeight) / 2,
                            0,
                            Math.PI * 2
                        );
                        ctx.closePath();
                        ctx.clip();

                        ctx.drawImage(logoSquadraImg, logoX, logoY, logoWidth, logoHeight);

                        // Restore the previous canvas state
                        ctx.restore();
                    };
                    logoSquadraImg.src = teamBadge;
                }

                // Draw player number
                if (playerNumber) {
                    const fontSize = Math.round(canvas.width * 0.26);
                    ctx.font = `bold ${fontSize}px Roboto, sans-serif`;
                    ctx.textRendering = "geometricPrecision";
                    ctx.letterSpacing = "-0.05em";
                    ctx.fillStyle = "rgba(255, 255, 255, 1)";
                    ctx.textAlign = "center";
                    ctx.textBaseline = "middle";

                    const textX = canvas.width * 0.49;
                    const textY = canvas.height * 0.63;

                    ctx.fillText(playerNumber.toString(), textX, textY);
                }

                // Cache the processed result
                cacheRef.current = {
                    playerImage,
                    teamColor: targetColor,
                    teamBadge,
                    dataUrl: canvas.toDataURL()
                };
            }
        };
    }, [targetColor, teamBadge, playerImage, playerNumber, desaturationAmount, brightnessFactor]);

    return <canvas ref={canvasRef} className={"w-full h-full object-cover z-30"} />;
}