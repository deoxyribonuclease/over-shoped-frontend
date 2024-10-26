import { useRef, useState } from "react";
import { Splide, SplideSlide } from "@splidejs/react-splide";
import "@splidejs/react-splide/css";
import { useGlobalContext } from "../../context/context";
import ImageOverlay from "./ImageOverlay";
import '../styles/imagecarousel.css';

const ImageCarousel = (x) => {
  const [imageIndex, setImageIndex] = useState(0);
  const {
    state: { screenWidth, showingOverlay },
    showImageOverlay,
  } = useGlobalContext();


  const carouselRef = useRef(null);
  const overlayRef = useRef(null);

  const splideOptions = {
    pagination: false,
    height: `${screenWidth < 601 ? "30rem" : screenWidth < 768 ? "40rem" : "44.5rem"}`,
    type: "loop",
    autoWidth: false,
    perPage: 1,
    drag: false,
  };

  return (
      <>
        <div className="carousel-wrapper">
          <Splide
              onClick={() => {
                showImageOverlay();
                if (carouselRef.current && overlayRef.current) {
                  overlayRef.current.sync(carouselRef.current.splide);
                  setImageIndex(carouselRef.current.splide.index);
                }
              }}
              options={splideOptions}
              ref={carouselRef}
              onMove={() => setImageIndex(carouselRef.current.splide.index)}
          >
            {x.productImages.map((image, idx) => {
              const { url, alt } = image;
              return (
                  <SplideSlide key={idx}>
                    <img src={url} alt={alt} />
                  </SplideSlide>
              );
            })}
          </Splide>
          <div className="thumbnails">
            {x.productThumbnails.map((thumbnail, idx) => {
              const { url, alt } = thumbnail;
              return (
                  <button
                      className={`thumb-btn ${imageIndex === idx ? "active" : ""}`}
                      key={idx}
                      onClick={() => {
                        setImageIndex(idx);
                        carouselRef.current.go(idx);
                      }}
                  >
                    <img src={url} alt={alt} />
                  </button>
              );
            })}
          </div>
        </div>
        {showingOverlay && (
            <ImageOverlay
                carouselRef={carouselRef}
                overlayRef={overlayRef}
                productImages={x.productImages}
                productThumbnails={x.productThumbnails}
                imageIndex={imageIndex}
                setImageIndex={setImageIndex}
            />
        )}
      </>
  );
};

export default ImageCarousel;
