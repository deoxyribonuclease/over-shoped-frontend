import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import ProductCard from "./ProductCard.jsx";
import ReactPaginate from "react-paginate";
import '../styles/Pagination.css';
import { getPaginatedProducts } from "../../api/ItemsApi.jsx";
import Empty from "../../assets/empty.jpg";

function useQuery() {
    return new URLSearchParams(useLocation().search);
}

function ProductGrid() {
    const [products, setProducts] = useState([]);
    const [totalPages, setTotalPages] = useState(0);
    const [loading, setLoading] = useState(false);
    const query = useQuery();
    const navigate = useNavigate();

    const currentPage = parseInt(query.get("page")) || 1;
    const itemsPerPage = 16;

    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            try {
                const data = await getPaginatedProducts(currentPage, itemsPerPage);
                setProducts(data.products);
                setTotalPages(data.totalPages);
            } catch (error) {
                console.error("Error fetching products:", error);
            }
            setLoading(false);
        };

        fetchProducts();

        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    }, [currentPage]);

    const handlePageClick = ({ selected }) => {
        const newPage = selected + 1;
        navigate(`?page=${newPage}`);
    };

    const renderPlaceholder = () => {
        return (
            <div className="no-products-placeholder-container">
                <div className="no-products-placeholder">
                    <p>На даний момент немає доступних продуктів. Спробуйте пізніше.</p>
                    <img src={Empty} alt="empty"></img>
                </div>
            </div>
        );
    };

    return (
        <div>
        <div className="product-grid-container">
                {loading && (
                    <div className="loading-grid-screen">
                        <div className="loading-grid-spinner"></div>
                    </div>
                )}
                <div className="product-grid">
                    {products.length === 0 && !loading ? renderPlaceholder() : (
                        products.map((product) => (
                            <ProductCard key={product.id} product={product}/>
                        ))
                    )}
                </div>
            </div>
            {products.length === 0 && !loading ? "" : (
            <ReactPaginate
                previousLabel={"←"}
                nextLabel={"→"}
                breakLabel={"..."}
                pageCount={totalPages}
                onPageChange={handlePageClick}
                containerClassName={"pagination"}
                activeClassName={"active"}
                forcePage={currentPage - 1}
            />
            )}
        </div>
    );
}

export default ProductGrid;
