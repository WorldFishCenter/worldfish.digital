function VideoModal({ isOpen, onClose, videoLoading, onVideoLoad, youtubeId }) {
    if (!isOpen) return null;

    return (
        <section className="modal__bg" onClick={onClose}>
            <div className="modal__align">
                <div className="modal__content" modal={isOpen}>
                    <div className="modal__video-align">
                        {videoLoading ? (
                            <div className="modal__spinner">
                                <i className="fi-rr-refresh"></i>
                            </div>
                        ) : null}
                        <iframe
                            className="modal__video-style"
                            onLoad={onVideoLoad}
                            loading="lazy"
                            width="800"
                            height="500"
                            src={`https://www.youtube.com/embed/${youtubeId}`}
                            title="Peskas Platform Demonstration Video"
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                            aria-label="Peskas platform demonstration video"
                        ></iframe>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default VideoModal;
