'use client';

import {memo, useEffect, useRef} from "react";

interface PlayerSilhouetteProps {
    silhouetteTemplate: HTMLCanvasElement | null;
    playerImage?: string | null;
}
export const PlayerSilhouette = memo(function PlayerSilhouette(
    {
        silhouetteTemplate,
        playerImage,
    } : PlayerSilhouetteProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d")!;

        // Caso A: Il giocatore ha una sua foto reale
        if (playerImage) {
            const img = new Image();
            img.src = playerImage;
            img.onload = () => {
                canvas.width = img.width;
                canvas.height = img.height;
                ctx.drawImage(img, 0, 0);
            };
            return;
        }

        // Caso B: Silhouette con maglia generata
        if (silhouetteTemplate) {
            canvas.width = silhouetteTemplate.width;
            canvas.height = silhouetteTemplate.height;

            // "Timbriamo" la maglia (operazione istantanea)
            ctx.drawImage(silhouetteTemplate, 0, 0);
        }
    }, [silhouetteTemplate, playerImage]);

    return <canvas ref={canvasRef} className="w-full h-full object-cover z-30" />;
});