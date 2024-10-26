import { useGlobalContext } from "../../context/context.jsx";
import { Close } from "../../icons/index.jsx";
import { Splide, SplideSlide } from "@splidejs/react-splide";
import "@splidejs/react-splide/css";
import '../styles/imageoverlay.css'; // Імпортуємо CSS файл

const ImageOverlay = (x) => {
  const { hideImageOverlay } = useGlobalContext();

  return (
      <div className="overlay-wrapper">
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
            {x.productImages.map((image, idx) => {
              const { url, alt } = image;
              return (
                  <SplideSlide key={idx}>
                    <button>
                      <img src={url} alt={alt} />
                    </button>
                  </SplideSlide>
              );
            })}
          </Splide>
          <div className="thumbnails">
            {x.productThumbnails.map((thumbnail, idx) => {
              return (
                  <button
                      className={`thumb-btn ${x.imageIndex === idx ? "active" : ""}`}
                      onClick={() => {
                        x.overlayRef.current.go(idx);
                        x.carouselRef.current.go(idx);
                      }}
                      key={idx}
                  >
                    <img src={thumbnail.url} alt={thumbnail.alt} />
                  </button>
              );
            })}
          </div>
        </div>
      </div>
  );
};

export default ImageOverlay;
