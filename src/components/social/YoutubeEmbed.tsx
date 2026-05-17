export default function YoutubeEmbed({ link } : { link: string }) {
    return (
        <iframe
            className="w-full h-full"
            src={`https://www.youtube.com/embed/${link}`}
            title="YouTube video player"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
        />
    )
}