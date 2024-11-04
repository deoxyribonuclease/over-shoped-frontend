import { useGlobalContext } from "../../context/context.jsx";
import { Close } from "../../icons/index.jsx";
import { Splide, SplideSlide } from "@splidejs/react-splide";
import "@splidejs/react-splide/css";
import '../styles/imageoverlay.css';
import { useRef } from "react";

const ImageOverlay = (x) => {
    const { hideImageOverlay } = useGlobalContext();
    const thumbnailsRef = useRef(null);

    const handleOverlayClick = (event) => {
        if (event.target === event.currentTarget) {
            hideImageOverlay();
        }
    };

    const scrollToThumbnail = (idx) => {
        const thumbnail = thumbnailsRef.current?.children[idx];
        if (thumbnail) {

            thumbnail.scrollIntoView({
                behavior: "smooth",
                block: "nearest",
                inline: "center",
            });
        }
    };

    return (
        <div className="overlay-wrapper" onClick={handleOverlayClick}>
            <div className="inner-overlay">
                <button className="close-btn" onClick={hideImageOverlay}>
                    <Close />
                </button>
                <Splide
                    options={{ autoWidth: false, pagination: false, type: "loop" }}
                    ref={x.overlayRef}
                    onMove={() => {
                        x.setImageIndex(x.overlayRef.current.splide.index);
                        x.carouselRef.current.go(x.overlayRef.current.splide.index);
                    }}
                >
                    {x.productImages.map((image, idx) => (
                        <SplideSlide key={idx}>
                            <img src={image.url || image} alt={`Product Image ${idx + 1}`} />
                        </SplideSlide>
                    ))}
                </Splide>
                <div className="thumbnails" ref={thumbnailsRef}>
                    {x.productThumbnails.map((thumbnail, idx) => (
                        <button
                            className={`thumb-btn ${x.imageIndex === idx ? "active" : ""}`}
                            onClick={() => {
                                x.overlayRef.current.go(idx);
                                x.carouselRef.current.go(idx);
                                scrollToThumbnail(idx);
                            }}
                            key={idx}
                        >
                            <img src={thumbnail.url || thumbnail} alt={`Thumbnail ${idx + 1}`} />
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ImageOverlay;
