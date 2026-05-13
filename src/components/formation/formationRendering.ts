const loadImage = (src: string): Promise<HTMLImageElement> => {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.crossOrigin = "anonymous";
        img.src = src;
        img.onload = () => resolve(img);
        img.onerror = reject;
    });
};

export async function generatePlayerSilhouette(teamColor: string, teamBadge?: string, logoTorneoPath?: string) {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d", { willReadFrequently: true })!;

    const baseImg = await loadImage("/other/player_front.png");
    canvas.width = baseImg.width;
    canvas.height = baseImg.height;
    ctx.drawImage(baseImg, 0, 0);

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    const r = parseInt(teamColor.replace("#", "").slice(0, 2), 16);
    const g = parseInt(teamColor.replace("#", "").slice(2, 4), 16);
    const b = parseInt(teamColor.replace("#", "").slice(4, 6), 16);

    for (let i = 0; i < data.length; i += 4) {
        if (data[i + 1] > data[i] + 60 && data[i + 1] > data[i + 2] + 60) {
            data[i] = r; data[i + 1] = g; data[i + 2] = b;
        }

        // Applicazione desaturazione/luminosità
        const gradoDesaturazione = 0.2;
        const gradoLuminosita = 0.8;

        const gray = data[i] * 0.299 + data[i+1] * 0.587 + data[i+2] * 0.114;
        data[i] = Math.round(data[i] * gradoLuminosita + gray * gradoDesaturazione) * 0.9;
        data[i+1] = Math.round(data[i+1] * gradoLuminosita + gray * gradoDesaturazione) * 0.9;
        data[i+2] = Math.round(data[i+2] * gradoLuminosita + gray * gradoDesaturazione) * 0.9;
    }
    ctx.putImageData(imageData, 0, 0);

    if (logoTorneoPath) {
        const logoT = await loadImage(logoTorneoPath);
        ctx.drawImage(logoT, canvas.width * 0.195, canvas.height * 0.375, canvas.width * 0.22, (canvas.width * 0.22 / logoT.width) * logoT.height);
    }

    if (teamBadge) {
        const sImg = await loadImage(teamBadge);
        const w = canvas.width * 0.13;
        const h = (w / sImg.width) * sImg.height;
        const x = canvas.width * 0.63;
        const y = canvas.height * 0.408;

        ctx.save();
        ctx.beginPath();
        ctx.arc(x + w / 2, y + h / 2, Math.min(w, h) / 2, 0, Math.PI * 2);
        ctx.clip();
        ctx.drawImage(sImg, x, y, w, h);
        ctx.restore();
    }

    return canvas;
}